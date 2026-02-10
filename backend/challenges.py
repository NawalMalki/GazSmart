"""
API endpoints pour la gestion des défis (challenges)
"""
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date, timedelta
from database import get_db_connection

router = APIRouter(prefix="/api/challenges", tags=["challenges"])

# ==================== MODELS ====================

class ChallengeResponse(BaseModel):
    id: int
    slug: str
    title: str
    description: Optional[str]
    explanation: Optional[str]
    icon: Optional[str]
    max_points_per_month: int
    energy_savings: Optional[str]
    target_value: Optional[float]
    target_unit: Optional[str]
    daily_points: int
    weekly_bonus: int
    is_active: bool

class ParticipationResponse(BaseModel):
    id: int
    challenge_id: int
    challenge_slug: str
    challenge_title: str
    started_at: datetime
    is_active: bool
    current_streak: int
    best_streak: int
    total_points: int
    total_days_validated: int
    last_validation_date: Optional[date]

class DailyLogRequest(BaseModel):
    value_recorded: float

class DailyLogResponse(BaseModel):
    id: int
    log_date: date
    value_recorded: Optional[float]
    is_validated: bool
    points_earned: int

class ValidateDayRequest(BaseModel):
    value_recorded: Optional[float] = None

class CuisineValidateRequest(BaseModel):
    gestures_completed: int  # Nombre de gestes validés (1-8)

class UserStatsResponse(BaseModel):
    total_points: int
    active_challenges: int
    badges: List[str]
    observation_days_remaining: int

# ==================== HELPER FUNCTIONS ====================

def get_user_from_token(authorization: Optional[str]):
    """Extract user from authorization header"""
    from auth import verify_token, get_user_by_email
    
    if not authorization:
        raise HTTPException(status_code=401, detail="Non authentifié")
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Schéma d'authentification invalide")
    except ValueError:
        raise HTTPException(status_code=401, detail="Header d'autorisation invalide")
    
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Token invalide")
    
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur non trouvé")
    
    return user

# ==================== ENDPOINTS ====================

@router.get("/", response_model=List[ChallengeResponse])
def get_all_challenges():
    """Récupérer tous les défis disponibles"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, slug, title, description, explanation, icon, 
                       max_points_per_month, energy_savings, target_value, 
                       target_unit, daily_points, weekly_bonus, is_active
                FROM challenges
                WHERE is_active = TRUE
                ORDER BY id
            """)
            challenges = cursor.fetchall()
        connection.close()
        return challenges
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.get("/my-participations", response_model=List[ParticipationResponse])
def get_my_participations(authorization: Optional[str] = Header(None)):
    """Récupérer les participations de l'utilisateur connecté"""
    user = get_user_from_token(authorization)
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT cp.id, cp.challenge_id, c.slug as challenge_slug, c.title as challenge_title,
                       cp.started_at, cp.is_active, cp.current_streak, cp.best_streak,
                       cp.total_points, cp.total_days_validated, cp.last_validation_date
                FROM challenge_participations cp
                JOIN challenges c ON cp.challenge_id = c.id
                WHERE cp.user_id = %s
                ORDER BY cp.started_at DESC
            """, (user["id"],))
            participations = cursor.fetchall()
        connection.close()
        return participations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.post("/join/{challenge_slug}")
def join_challenge(challenge_slug: str, authorization: Optional[str] = Header(None)):
    """Rejoindre un défi"""
    user = get_user_from_token(authorization)
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Vérifier que le défi existe
            cursor.execute("SELECT id FROM challenges WHERE slug = %s AND is_active = TRUE", (challenge_slug,))
            challenge = cursor.fetchone()
            
            if not challenge:
                raise HTTPException(status_code=404, detail="Défi non trouvé")
            
            # Vérifier si déjà participant
            cursor.execute("""
                SELECT id FROM challenge_participations 
                WHERE user_id = %s AND challenge_id = %s
            """, (user["id"], challenge["id"]))
            
            existing = cursor.fetchone()
            if existing:
                # Réactiver si inactif
                cursor.execute("""
                    UPDATE challenge_participations 
                    SET is_active = TRUE 
                    WHERE id = %s
                """, (existing["id"],))
                connection.commit()
                connection.close()
                return {"message": "Participation réactivée", "participation_id": existing["id"]}
            
            # Créer nouvelle participation
            cursor.execute("""
                INSERT INTO challenge_participations (user_id, challenge_id)
                VALUES (%s, %s)
            """, (user["id"], challenge["id"]))
            connection.commit()
            participation_id = cursor.lastrowid
        connection.close()
        
        return {"message": "Vous avez rejoint le défi!", "participation_id": participation_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.get("/participation/{challenge_slug}")
def get_participation_details(challenge_slug: str, authorization: Optional[str] = Header(None)):
    """Récupérer les détails de participation à un défi"""
    user = get_user_from_token(authorization)
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Récupérer le défi
            cursor.execute("""
                SELECT id, slug, title, description, explanation, icon, 
                       max_points_per_month, energy_savings, target_value, 
                       target_unit, daily_points, weekly_bonus
                FROM challenges 
                WHERE slug = %s AND is_active = TRUE
            """, (challenge_slug,))
            challenge = cursor.fetchone()
            
            if not challenge:
                raise HTTPException(status_code=404, detail="Défi non trouvé")
            
            # Récupérer la participation
            cursor.execute("""
                SELECT id, started_at, is_active, current_streak, best_streak,
                       total_points, total_days_validated, last_validation_date
                FROM challenge_participations 
                WHERE user_id = %s AND challenge_id = %s
            """, (user["id"], challenge["id"]))
            participation = cursor.fetchone()
            
            # Récupérer les logs de la semaine
            weekly_logs = []
            if participation:
                cursor.execute("""
                    SELECT id, log_date, value_recorded, is_validated, points_earned
                    FROM challenge_daily_logs 
                    WHERE participation_id = %s 
                    AND log_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                    ORDER BY log_date DESC
                """, (participation["id"],))
                weekly_logs = cursor.fetchall()
            
        connection.close()
        
        return {
            "challenge": challenge,
            "participation": participation,
            "weekly_logs": weekly_logs,
            "is_participating": participation is not None and participation["is_active"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.post("/validate/{challenge_slug}")
def validate_day(challenge_slug: str, request: ValidateDayRequest, authorization: Optional[str] = Header(None)):
    """Valider une journée pour un défi"""
    user = get_user_from_token(authorization)
    today = date.today()
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Récupérer le défi
            cursor.execute("""
                SELECT id, target_value, target_unit, daily_points, weekly_bonus
                FROM challenges 
                WHERE slug = %s AND is_active = TRUE
            """, (challenge_slug,))
            challenge = cursor.fetchone()
            
            if not challenge:
                raise HTTPException(status_code=404, detail="Défi non trouvé")
            
            # Récupérer la participation
            cursor.execute("""
                SELECT id, current_streak, best_streak, total_points, 
                       total_days_validated, last_validation_date
                FROM challenge_participations 
                WHERE user_id = %s AND challenge_id = %s AND is_active = TRUE
            """, (user["id"], challenge["id"]))
            participation = cursor.fetchone()
            
            if not participation:
                raise HTTPException(status_code=400, detail="Vous ne participez pas à ce défi")
            
            # Vérifier si déjà validé aujourd'hui
            cursor.execute("""
                SELECT id FROM challenge_daily_logs 
                WHERE participation_id = %s AND log_date = %s
            """, (participation["id"], today))
            
            existing_log = cursor.fetchone()
            if existing_log:
                raise HTTPException(status_code=400, detail="Vous avez déjà validé aujourd'hui")
            
            # Déterminer si la validation est réussie
            is_validated = True
            points_earned = challenge["daily_points"]
            
            # Pour le défi température: vérifier que la valeur = target
            if challenge_slug == "temperature":
                if request.value_recorded != challenge["target_value"]:
                    is_validated = False
                    points_earned = 0
            
            # Calculer le streak
            new_streak = participation["current_streak"] + 1 if is_validated else 0
            best_streak = max(participation["best_streak"], new_streak)
            
            # Bonus hebdomadaire si streak >= 7
            bonus = 0
            if new_streak > 0 and new_streak % 7 == 0:
                bonus = challenge["weekly_bonus"]
                points_earned += bonus
            
            # Créer le log
            cursor.execute("""
                INSERT INTO challenge_daily_logs 
                (participation_id, log_date, value_recorded, is_validated, points_earned)
                VALUES (%s, %s, %s, %s, %s)
            """, (participation["id"], today, request.value_recorded, is_validated, points_earned))
            
            # Mettre à jour la participation
            cursor.execute("""
                UPDATE challenge_participations 
                SET current_streak = %s, 
                    best_streak = %s, 
                    total_points = total_points + %s,
                    total_days_validated = total_days_validated + %s,
                    last_validation_date = %s
                WHERE id = %s
            """, (new_streak, best_streak, points_earned, 1 if is_validated else 0, today, participation["id"]))
            
            # Mettre à jour les points totaux de l'utilisateur
            cursor.execute("""
                UPDATE users SET total_points = total_points + %s WHERE id = %s
            """, (points_earned, user["id"]))
            
            connection.commit()
        connection.close()
        
        return {
            "message": "Journée validée!" if is_validated else "Journée enregistrée",
            "is_validated": is_validated,
            "points_earned": points_earned,
            "bonus_earned": bonus,
            "new_streak": new_streak,
            "best_streak": best_streak
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.post("/validate-shower/{challenge_slug}")
def validate_shower(challenge_slug: str, shower_duration_seconds: int, authorization: Optional[str] = Header(None)):
    """Valider une douche pour le défi chrono-douche"""
    user = get_user_from_token(authorization)
    today = date.today()
    
    # Points selon la durée
    if shower_duration_seconds < 300:  # < 5 min
        points_earned = 150
    elif shower_duration_seconds < 420:  # 5-7 min
        points_earned = 100
    elif shower_duration_seconds < 600:  # 7-10 min
        points_earned = 70
    else:  # 10+ min
        points_earned = 40
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Récupérer le défi
            cursor.execute("""
                SELECT id, weekly_bonus FROM challenges 
                WHERE slug = %s AND is_active = TRUE
            """, (challenge_slug,))
            challenge = cursor.fetchone()
            
            if not challenge:
                raise HTTPException(status_code=404, detail="Défi non trouvé")
            
            # Récupérer ou créer la participation
            cursor.execute("""
                SELECT id, current_streak, best_streak, total_points, total_days_validated
                FROM challenge_participations 
                WHERE user_id = %s AND challenge_id = %s
            """, (user["id"], challenge["id"]))
            participation = cursor.fetchone()
            
            if not participation:
                # Auto-join au défi
                cursor.execute("""
                    INSERT INTO challenge_participations (user_id, challenge_id)
                    VALUES (%s, %s)
                """, (user["id"], challenge["id"]))
                connection.commit()
                participation_id = cursor.lastrowid
                current_streak = 0
                best_streak = 0
            else:
                participation_id = participation["id"]
                current_streak = participation["current_streak"]
                best_streak = participation["best_streak"]
            
            # Vérifier si déjà validé aujourd'hui
            cursor.execute("""
                SELECT id, value_recorded, points_earned FROM challenge_daily_logs 
                WHERE participation_id = %s AND log_date = %s
            """, (participation_id, today))
            existing_log = cursor.fetchone()
            
            if existing_log:
                connection.close()
                raise HTTPException(
                    status_code=400, 
                    detail=f"Tu as deja enregistre ta douche aujourd'hui ({existing_log['value_recorded']:.1f} min, {existing_log['points_earned']} pts). Reviens demain pour un nouveau defi!"
                )
            
            # Enregistrer le log
            duration_minutes = shower_duration_seconds / 60
            cursor.execute("""
                INSERT INTO challenge_daily_logs 
                (participation_id, log_date, value_recorded, is_validated, points_earned)
                VALUES (%s, %s, %s, TRUE, %s)
            """, (participation_id, today, duration_minutes, points_earned))
            
            # Mettre à jour les stats
            new_streak = current_streak + 1
            new_best_streak = max(best_streak, new_streak)
            
            # Bonus si 10 douches validées
            total_showers = (participation["total_days_validated"] if participation else 0) + 1
            bonus = challenge["weekly_bonus"] if total_showers % 10 == 0 else 0
            total_points_earned = points_earned + bonus
            
            cursor.execute("""
                UPDATE challenge_participations 
                SET current_streak = %s, 
                    best_streak = %s, 
                    total_points = total_points + %s,
                    total_days_validated = total_days_validated + 1,
                    last_validation_date = %s
                WHERE id = %s
            """, (new_streak, new_best_streak, total_points_earned, today, participation_id))
            
            # Mettre à jour les points totaux de l'utilisateur
            cursor.execute("""
                UPDATE users SET total_points = total_points + %s WHERE id = %s
            """, (total_points_earned, user["id"]))
            
            connection.commit()
            
            # Récupérer les stats mises à jour
            cursor.execute("""
                SELECT total_points, total_days_validated, current_streak
                FROM challenge_participations WHERE id = %s
            """, (participation_id,))
            updated_stats = cursor.fetchone()
            
        connection.close()
        
        return {
            "message": "Douche validée!",
            "points_earned": points_earned,
            "bonus_earned": bonus,
            "total_showers": updated_stats["total_days_validated"],
            "total_points": updated_stats["total_points"],
            "duration_minutes": round(duration_minutes, 1)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.post("/validate-cuisine/{challenge_slug}")
def validate_cuisine(challenge_slug: str, request: CuisineValidateRequest, authorization: Optional[str] = Header(None)):
    """Valider une journée pour le défi cuisine maligne"""
    user = get_user_from_token(authorization)
    today = date.today()
    
    gestures = request.gestures_completed
    
    # Points selon le nombre de gestes
    if gestures <= 0:
        points_earned = 0
    elif gestures <= 2:
        points_earned = 20
    elif gestures <= 4:
        points_earned = 50
    elif gestures <= 6:
        points_earned = 80
    else:
        points_earned = 120
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Récupérer le défi
            cursor.execute("""
                SELECT id, weekly_bonus FROM challenges 
                WHERE slug = %s AND is_active = TRUE
            """, (challenge_slug,))
            challenge = cursor.fetchone()
            
            if not challenge:
                raise HTTPException(status_code=404, detail="Défi non trouvé")
            
            # Récupérer ou créer la participation
            cursor.execute("""
                SELECT id, current_streak, best_streak, total_points, total_days_validated
                FROM challenge_participations 
                WHERE user_id = %s AND challenge_id = %s
            """, (user["id"], challenge["id"]))
            participation = cursor.fetchone()
            
            if not participation:
                # Auto-join au défi
                cursor.execute("""
                    INSERT INTO challenge_participations (user_id, challenge_id)
                    VALUES (%s, %s)
                """, (user["id"], challenge["id"]))
                connection.commit()
                participation_id = cursor.lastrowid
                current_streak = 0
                best_streak = 0
                total_days = 0
            else:
                participation_id = participation["id"]
                current_streak = participation["current_streak"]
                best_streak = participation["best_streak"]
                total_days = participation["total_days_validated"]
            
            # Vérifier si déjà validé aujourd'hui
            cursor.execute("""
                SELECT id FROM challenge_daily_logs 
                WHERE participation_id = %s AND log_date = %s
            """, (participation_id, today))
            
            existing_log = cursor.fetchone()
            if existing_log:
                raise HTTPException(status_code=400, detail="Vous avez déjà validé aujourd'hui")
            
            # Enregistrer le log
            cursor.execute("""
                INSERT INTO challenge_daily_logs 
                (participation_id, log_date, value_recorded, is_validated, points_earned)
                VALUES (%s, %s, %s, TRUE, %s)
            """, (participation_id, today, gestures, points_earned))
            
            # Calculer le streak (série de 7 jours consécutifs)
            new_streak = current_streak + 1
            new_best_streak = max(best_streak, new_streak)
            
            # Bonus pour série de 7 jours
            bonus = challenge["weekly_bonus"] if new_streak % 7 == 0 else 0
            total_points_earned = points_earned + bonus
            
            cursor.execute("""
                UPDATE challenge_participations 
                SET current_streak = %s, 
                    best_streak = %s, 
                    total_points = total_points + %s,
                    total_days_validated = total_days_validated + 1,
                    last_validation_date = %s
                WHERE id = %s
            """, (new_streak, new_best_streak, total_points_earned, today, participation_id))
            
            # Mettre à jour les points totaux de l'utilisateur
            cursor.execute("""
                UPDATE users SET total_points = total_points + %s WHERE id = %s
            """, (total_points_earned, user["id"]))
            
            connection.commit()
            
            # Récupérer les stats mises à jour
            cursor.execute("""
                SELECT total_points, total_days_validated, current_streak
                FROM challenge_participations WHERE id = %s
            """, (participation_id,))
            updated_stats = cursor.fetchone()
            
        connection.close()
        
        return {
            "message": "Journée validée!",
            "gestures_completed": gestures,
            "points_earned": points_earned,
            "bonus_earned": bonus,
            "current_day": updated_stats["total_days_validated"],
            "total_points": updated_stats["total_points"],
            "current_streak": updated_stats["current_streak"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.get("/stats")
def get_user_challenge_stats(authorization: Optional[str] = Header(None)):
    """Récupérer les statistiques globales de l'utilisateur pour les défis"""
    user = get_user_from_token(authorization)
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Total points
            cursor.execute("SELECT total_points FROM users WHERE id = %s", (user["id"],))
            user_data = cursor.fetchone()
            total_points = user_data["total_points"] if user_data else 0
            
            # Défis actifs
            cursor.execute("""
                SELECT COUNT(*) as count FROM challenge_participations 
                WHERE user_id = %s AND is_active = TRUE
            """, (user["id"],))
            active = cursor.fetchone()
            
            # Badges (table peut ne pas exister)
            badges = []
            try:
                cursor.execute("""
                    SELECT badge_type FROM user_badges WHERE user_id = %s
                """, (user["id"],))
                badges = [b["badge_type"] for b in cursor.fetchall()]
            except:
                pass
            
            # Jours d'observation restants (90 jours depuis le premier défi)
            cursor.execute("""
                SELECT MIN(started_at) as first_challenge 
                FROM challenge_participations WHERE user_id = %s
            """, (user["id"],))
            first = cursor.fetchone()
            
            observation_days = 90
            if first and first["first_challenge"]:
                days_since = (datetime.now() - first["first_challenge"]).days
                observation_days = max(0, 90 - days_since)
            
        connection.close()
        
        return {
            "total_points": total_points,
            "active_challenges": active["count"],
            "badges": badges,
            "observation_days_remaining": observation_days
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.get("/leaderboard")
def get_leaderboard(limit: int = 10):
    """Récupérer le classement des utilisateurs"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT u.id, u.full_name, u.profile_picture, u.total_points,
                       (SELECT COUNT(*) FROM challenge_participations cp 
                        WHERE cp.user_id = u.id AND cp.is_active = TRUE) as active_challenges
                FROM users u
                WHERE u.total_points > 0
                ORDER BY u.total_points DESC
                LIMIT %s
            """, (limit,))
            leaderboard = cursor.fetchall()
        connection.close()
        
        return {"leaderboard": leaderboard}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")
