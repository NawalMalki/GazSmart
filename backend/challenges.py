'''
GESTION DES DÉFIS - Endpoints et logique métier
- Liste des défis disponibles
- Participation aux défis
- Validation quotidienne
- Progression et statistiques
'''

from fastapi import APIRouter, HTTPException, Depends
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

class DailyLogResponse(BaseModel):
    id: int
    log_date: date
    value_recorded: Optional[float]
    is_validated: bool
    points_earned: int

class ValidateDayRequest(BaseModel):
    value: float

class UserStatsResponse(BaseModel):
    total_points: int
    active_challenges: int
    total_days_validated: int
    best_streak: int
    badges: List[str]

# ==================== HELPER FUNCTIONS ====================

def get_user_from_token(authorization: str):
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

def check_and_award_badges(user_id: int, total_points: int):
    """Check if user qualifies for badges and award them"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Get user's account age
            cursor.execute("SELECT created_at FROM users WHERE id = %s", (user_id,))
            user = cursor.fetchone()
            if not user:
                return
            
            account_age = (datetime.now() - user['created_at']).days
            
            # Get active participations count
            cursor.execute("""
                SELECT COUNT(*) as count FROM challenge_participations 
                WHERE user_id = %s AND is_active = TRUE
            """, (user_id,))
            active_challenges = cursor.fetchone()['count']
            
            # Badge criteria (simplified - in production, you'd check regularity more thoroughly)
            badges_to_award = []
            
            # Bronze: 1500 points, 2 active challenges, 1 month observation
            if total_points >= 1500 and active_challenges >= 2 and account_age >= 30:
                badges_to_award.append('bronze')
            
            # Silver: 3000 points, 3 active challenges, 1 month regularity
            if total_points >= 3000 and active_challenges >= 3 and account_age >= 60:
                badges_to_award.append('silver')
            
            # Gold: 5000 points, 3 active challenges, 2 months regularity
            if total_points >= 5000 and active_challenges >= 3 and account_age >= 90:
                badges_to_award.append('gold')
            
            for badge in badges_to_award:
                cursor.execute("""
                    INSERT IGNORE INTO user_badges (user_id, badge_type, total_points_at_earn)
                    VALUES (%s, %s, %s)
                """, (user_id, badge, total_points))
            
            connection.commit()
        connection.close()
    except Exception as e:
        print(f"Error checking badges: {str(e)}")

# ==================== ENDPOINTS ====================

@router.get("/", response_model=List[ChallengeResponse])
def get_all_challenges():
    """Get all active challenges"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM challenges WHERE is_active = TRUE ORDER BY id
            """)
            challenges = cursor.fetchall()
        connection.close()
        return challenges
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.get("/{slug}")
def get_challenge_by_slug(slug: str):
    """Get a specific challenge by slug"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM challenges WHERE slug = %s", (slug,))
            challenge = cursor.fetchone()
        connection.close()
        
        if not challenge:
            raise HTTPException(status_code=404, detail="Défi non trouvé")
        
        return challenge
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.post("/{slug}/join")
def join_challenge(slug: str, authorization: str = None):
    """Join a challenge"""
    from fastapi import Header
    user = get_user_from_token(authorization)
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Get challenge
            cursor.execute("SELECT id FROM challenges WHERE slug = %s AND is_active = TRUE", (slug,))
            challenge = cursor.fetchone()
            
            if not challenge:
                raise HTTPException(status_code=404, detail="Défi non trouvé")
            
            # Check if already participating
            cursor.execute("""
                SELECT id FROM challenge_participations 
                WHERE user_id = %s AND challenge_id = %s
            """, (user['id'], challenge['id']))
            
            existing = cursor.fetchone()
            if existing:
                # Reactivate if inactive
                cursor.execute("""
                    UPDATE challenge_participations 
                    SET is_active = TRUE 
                    WHERE id = %s
                """, (existing['id'],))
                connection.commit()
                connection.close()
                return {"message": "Participation réactivée", "participation_id": existing['id']}
            
            # Create new participation
            cursor.execute("""
                INSERT INTO challenge_participations (user_id, challenge_id)
                VALUES (%s, %s)
            """, (user['id'], challenge['id']))
            connection.commit()
            
            participation_id = cursor.lastrowid
        connection.close()
        
        return {"message": "Inscription au défi réussie", "participation_id": participation_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.get("/{slug}/participation")
def get_my_participation(slug: str, authorization: str = None):
    """Get current user's participation in a challenge"""
    user = get_user_from_token(authorization)
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT cp.*, c.slug as challenge_slug, c.title as challenge_title,
                       c.target_value, c.target_unit, c.daily_points, c.weekly_bonus
                FROM challenge_participations cp
                JOIN challenges c ON cp.challenge_id = c.id
                WHERE cp.user_id = %s AND c.slug = %s
            """, (user['id'], slug))
            participation = cursor.fetchone()
        connection.close()
        
        if not participation:
            return None
        
        return participation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.get("/{slug}/logs")
def get_challenge_logs(slug: str, days: int = 7, authorization: str = None):
    """Get daily logs for a challenge participation"""
    user = get_user_from_token(authorization)
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Get participation
            cursor.execute("""
                SELECT cp.id FROM challenge_participations cp
                JOIN challenges c ON cp.challenge_id = c.id
                WHERE cp.user_id = %s AND c.slug = %s
            """, (user['id'], slug))
            participation = cursor.fetchone()
            
            if not participation:
                raise HTTPException(status_code=404, detail="Participation non trouvée")
            
            # Get logs for the last N days
            cursor.execute("""
                SELECT * FROM challenge_daily_logs 
                WHERE participation_id = %s 
                ORDER BY log_date DESC 
                LIMIT %s
            """, (participation['id'], days))
            logs = cursor.fetchall()
        connection.close()
        
        return logs
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.get("/{slug}/week-progress")
def get_week_progress(slug: str, authorization: str = None):
    """Get the weekly progress for a challenge"""
    user = get_user_from_token(authorization)
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Get participation
            cursor.execute("""
                SELECT cp.id FROM challenge_participations cp
                JOIN challenges c ON cp.challenge_id = c.id
                WHERE cp.user_id = %s AND c.slug = %s
            """, (user['id'], slug))
            participation = cursor.fetchone()
            
            if not participation:
                return {"days": [], "message": "Pas encore inscrit à ce défi"}
            
            # Get current week's dates (Monday to Sunday)
            today = date.today()
            monday = today - timedelta(days=today.weekday())
            
            week_days = []
            day_names = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
            
            for i in range(7):
                day_date = monday + timedelta(days=i)
                
                cursor.execute("""
                    SELECT * FROM challenge_daily_logs 
                    WHERE participation_id = %s AND log_date = %s
                """, (participation['id'], day_date))
                log = cursor.fetchone()
                
                week_days.append({
                    "day": day_names[i],
                    "date": day_date.isoformat(),
                    "validated": log['is_validated'] if log else False,
                    "value": float(log['value_recorded']) if log and log['value_recorded'] else None,
                    "points": log['points_earned'] if log else 0
                })
        
        connection.close()
        return {"days": week_days}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.post("/{slug}/validate")
def validate_day(slug: str, request: ValidateDayRequest, authorization: str = None):
    """Validate today's challenge"""
    user = get_user_from_token(authorization)
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Get challenge and participation
            cursor.execute("""
                SELECT cp.*, c.target_value, c.daily_points, c.weekly_bonus, c.slug
                FROM challenge_participations cp
                JOIN challenges c ON cp.challenge_id = c.id
                WHERE cp.user_id = %s AND c.slug = %s AND cp.is_active = TRUE
            """, (user['id'], slug))
            participation = cursor.fetchone()
            
            if not participation:
                raise HTTPException(status_code=404, detail="Participation active non trouvée. Rejoignez d'abord le défi.")
            
            today = date.today()
            target_value = float(participation['target_value'])
            value = request.value
            
            # Determine if validated based on challenge type
            # For temperature: value must equal target (19°C)
            # For chrono-douche: value must be <= target (5 min)
            # For cuisine-maligne: value must be >= target (1 = checklist completed)
            is_validated = False
            if slug == 'temperature':
                is_validated = value == target_value
            elif slug == 'chrono-douche':
                is_validated = value <= target_value
            elif slug == 'cuisine-maligne':
                is_validated = value >= target_value
            else:
                is_validated = value == target_value
            
            points_earned = participation['daily_points'] if is_validated else 0
            
            # Check if already logged today
            cursor.execute("""
                SELECT id FROM challenge_daily_logs 
                WHERE participation_id = %s AND log_date = %s
            """, (participation['id'], today))
            existing_log = cursor.fetchone()
            
            if existing_log:
                # Update existing log
                cursor.execute("""
                    UPDATE challenge_daily_logs 
                    SET value_recorded = %s, is_validated = %s, points_earned = %s
                    WHERE id = %s
                """, (value, is_validated, points_earned, existing_log['id']))
            else:
                # Insert new log
                cursor.execute("""
                    INSERT INTO challenge_daily_logs (participation_id, log_date, value_recorded, is_validated, points_earned)
                    VALUES (%s, %s, %s, %s, %s)
                """, (participation['id'], today, value, is_validated, points_earned))
            
            # Update streak
            new_streak = participation['current_streak']
            best_streak = participation['best_streak']
            bonus_points = 0
            
            if is_validated:
                # Check if yesterday was validated
                yesterday = today - timedelta(days=1)
                cursor.execute("""
                    SELECT is_validated FROM challenge_daily_logs 
                    WHERE participation_id = %s AND log_date = %s
                """, (participation['id'], yesterday))
                yesterday_log = cursor.fetchone()
                
                if yesterday_log and yesterday_log['is_validated']:
                    new_streak += 1
                else:
                    new_streak = 1
                
                # Check for weekly bonus (7 day streak)
                if new_streak >= 7 and new_streak % 7 == 0:
                    bonus_points = participation['weekly_bonus']
                    points_earned += bonus_points
                
                best_streak = max(best_streak, new_streak)
            else:
                new_streak = 0
            
            # Update participation stats
            cursor.execute("""
                UPDATE challenge_participations 
                SET current_streak = %s, 
                    best_streak = %s, 
                    total_points = total_points + %s,
                    total_days_validated = total_days_validated + %s,
                    last_validation_date = %s
                WHERE id = %s
            """, (
                new_streak, 
                best_streak, 
                points_earned,
                1 if is_validated else 0,
                today if is_validated else participation['last_validation_date'],
                participation['id']
            ))
            
            # Update user's total points
            if points_earned > 0:
                cursor.execute("""
                    UPDATE users SET total_points = total_points + %s WHERE id = %s
                """, (points_earned, user['id']))
            
            connection.commit()
            
            # Get updated participation
            cursor.execute("""
                SELECT total_points FROM challenge_participations WHERE id = %s
            """, (participation['id'],))
            updated = cursor.fetchone()
            
            # Get user's new total points
            cursor.execute("SELECT total_points FROM users WHERE id = %s", (user['id'],))
            user_updated = cursor.fetchone()
            
        connection.close()
        
        # Check for badges
        if user_updated:
            check_and_award_badges(user['id'], user_updated['total_points'])
        
        return {
            "validated": is_validated,
            "value": value,
            "points_earned": points_earned,
            "bonus_points": bonus_points,
            "current_streak": new_streak,
            "best_streak": best_streak,
            "total_points": updated['total_points'] if updated else 0,
            "message": "Journée validée avec succès!" if is_validated else "Valeur non conforme à l'objectif"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.delete("/{slug}/leave")
def leave_challenge(slug: str, authorization: str = None):
    """Leave a challenge (deactivate participation)"""
    user = get_user_from_token(authorization)
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE challenge_participations cp
                JOIN challenges c ON cp.challenge_id = c.id
                SET cp.is_active = FALSE
                WHERE cp.user_id = %s AND c.slug = %s
            """, (user['id'], slug))
            connection.commit()
            affected = cursor.rowcount
        connection.close()
        
        if affected == 0:
            raise HTTPException(status_code=404, detail="Participation non trouvée")
        
        return {"message": "Vous avez quitté le défi"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.get("/user/stats")
def get_user_stats(authorization: str = None):
    """Get current user's challenge statistics"""
    user = get_user_from_token(authorization)
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Get aggregated stats
            cursor.execute("""
                SELECT 
                    COALESCE(SUM(total_points), 0) as total_points,
                    COUNT(*) as active_challenges,
                    COALESCE(SUM(total_days_validated), 0) as total_days_validated,
                    COALESCE(MAX(best_streak), 0) as best_streak
                FROM challenge_participations 
                WHERE user_id = %s AND is_active = TRUE
            """, (user['id'],))
            stats = cursor.fetchone()
            
            # Get badges
            cursor.execute("""
                SELECT badge_type FROM user_badges WHERE user_id = %s
            """, (user['id'],))
            badges = [row['badge_type'] for row in cursor.fetchall()]
        connection.close()
        
        return {
            "total_points": stats['total_points'] or 0,
            "active_challenges": stats['active_challenges'] or 0,
            "total_days_validated": stats['total_days_validated'] or 0,
            "best_streak": stats['best_streak'] or 0,
            "badges": badges
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.get("/user/participations")
def get_user_participations(authorization: str = None):
    """Get all participations for current user"""
    user = get_user_from_token(authorization)
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT cp.*, c.slug as challenge_slug, c.title as challenge_title,
                       c.icon, c.description, c.energy_savings
                FROM challenge_participations cp
                JOIN challenges c ON cp.challenge_id = c.id
                WHERE cp.user_id = %s AND cp.is_active = TRUE
                ORDER BY cp.started_at DESC
            """, (user['id'],))
            participations = cursor.fetchall()
        connection.close()
        
        return participations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")
