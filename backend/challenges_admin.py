"""
API endpoints pour la gestion admin des défis (challenges)
Admin CRUD pour créer, modifier, supprimer et gérer les défis
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from database import get_db_connection
from dependencies import get_current_admin

router = APIRouter(prefix="/api/admin/challenges", tags=["Admin Challenges"])

# ==================== MODELS ====================

class ChallengeCreateRequest(BaseModel):
    slug: str
    title: str
    description: str
    explanation: Optional[str] = None
    icon: Optional[str] = "zap"
    max_points_per_month: int = 1000
    energy_savings: Optional[str] = None
    target_value: Optional[float] = None
    target_unit: Optional[str] = None
    daily_points: int = 100
    weekly_bonus: int = 500
    is_active: bool = False  # draft par défaut

class ChallengeUpdateRequest(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    explanation: Optional[str] = None
    icon: Optional[str] = None
    max_points_per_month: Optional[int] = None
    energy_savings: Optional[str] = None
    target_value: Optional[float] = None
    target_unit: Optional[str] = None
    daily_points: Optional[int] = None
    weekly_bonus: Optional[int] = None
    is_active: Optional[bool] = None

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
    created_at: datetime
    participants_count: Optional[int] = 0
    total_validations: Optional[int] = 0
    total_points_awarded: Optional[int] = 0

class ChallengeDetailResponse(ChallengeResponse):
    top_users: Optional[List[Dict]] = []
    recent_activity: Optional[List[Dict]] = []
    avg_completion_rate: Optional[float] = 0

# ==================== ENDPOINTS ====================

@router.get("/", response_model=List[ChallengeResponse])
def get_all_challenges_admin(
    status: Optional[str] = None,
    admin: dict = Depends(get_current_admin)
):
    """Récupérer tous les défis (incluant brouillons) - Admin uniquement"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Requête de base
            query = """
                SELECT 
                    c.*,
                    COUNT(DISTINCT cp.user_id) as participants_count,
                    COUNT(DISTINCT cdl.id) as total_validations,
                    COALESCE(SUM(cdl.points_earned), 0) as total_points_awarded
                FROM challenges c
                LEFT JOIN challenge_participations cp ON c.id = cp.challenge_id AND cp.is_active = TRUE
                LEFT JOIN challenge_daily_logs cdl ON cp.id = cdl.participation_id AND cdl.is_validated = TRUE
            """
            
            # Filtre par statut
            where_clause = ""
            params = []
            if status and status != "all":
                if status == "active":
                    where_clause = " WHERE c.is_active = TRUE"
                elif status == "draft":
                    where_clause = " WHERE c.is_active = FALSE"
            
            query += where_clause
            query += " GROUP BY c.id ORDER BY c.created_at DESC"
            
            cursor.execute(query, params)
            challenges = cursor.fetchall()
        
        connection.close()
        return challenges
        
    except Exception as e:
        print(f"Error fetching admin challenges: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.get("/{challenge_id}", response_model=ChallengeDetailResponse)
def get_challenge_detail_admin(
    challenge_id: int,
    admin: dict = Depends(get_current_admin)
):
    """Récupérer les détails d'un défi avec stats - Admin uniquement"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Récupérer le défi
            cursor.execute("""
                SELECT 
                    c.*,
                    COUNT(DISTINCT cp.user_id) as participants_count,
                    COUNT(DISTINCT cdl.id) as total_validations,
                    COALESCE(SUM(cdl.points_earned), 0) as total_points_awarded
                FROM challenges c
                LEFT JOIN challenge_participations cp ON c.id = cp.challenge_id AND cp.is_active = TRUE
                LEFT JOIN challenge_daily_logs cdl ON cp.id = cdl.participation_id AND cdl.is_validated = TRUE
                WHERE c.id = %s
                GROUP BY c.id
            """, (challenge_id,))
            
            challenge = cursor.fetchone()
            
            if not challenge:
                raise HTTPException(status_code=404, detail="Défi non trouvé")
            
            # Top 5 utilisateurs
            cursor.execute("""
                SELECT 
                    u.id,
                    u.full_name as name,
                    cp.total_points as points,
                    cp.total_days_validated as days
                FROM challenge_participations cp
                JOIN users u ON cp.user_id = u.id
                WHERE cp.challenge_id = %s AND cp.is_active = TRUE
                ORDER BY cp.total_points DESC, cp.total_days_validated DESC
                LIMIT 5
            """, (challenge_id,))
            top_users = cursor.fetchall()
            
            # Activité récente (dernières 10 validations)
            cursor.execute("""
                SELECT 
                    u.full_name as user,
                    cdl.log_date as date,
                    cdl.value_recorded as value,
                    cdl.points_earned as points,
                    cdl.is_validated as action
                FROM challenge_daily_logs cdl
                JOIN challenge_participations cp ON cdl.participation_id = cp.id
                JOIN users u ON cp.user_id = u.id
                WHERE cp.challenge_id = %s
                ORDER BY cdl.log_date DESC, cdl.id DESC
                LIMIT 10
            """, (challenge_id,))
            recent_activity = cursor.fetchall()
            
            # Formater l'activité récente
            formatted_activity = []
            for activity in recent_activity:
                formatted_activity.append({
                    "user": activity["user"],
                    "date": activity["date"].isoformat() if activity["date"] else None,
                    "value": activity["value"],
                    "points": activity["points"],
                    "action": "validated" if activity["action"] else "failed"
                })
            
            # Calculer le taux de complétion moyen
            cursor.execute("""
                SELECT 
                    AVG(cp.total_days_validated) as avg_days,
                    COUNT(*) as total_participants
                FROM challenge_participations cp
                WHERE cp.challenge_id = %s AND cp.is_active = TRUE AND cp.total_days_validated > 0
            """, (challenge_id,))
            completion_data = cursor.fetchone()
            
            avg_completion_rate = 0
            if completion_data and completion_data["total_participants"] > 0:
                # Supposons un objectif de 30 jours pour calculer le taux
                avg_days = completion_data["avg_days"] or 0
                avg_completion_rate = min(100, (avg_days / 30) * 100)
            
        connection.close()
        
        return {
            **challenge,
            "top_users": top_users,
            "recent_activity": formatted_activity,
            "avg_completion_rate": round(avg_completion_rate, 1)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching challenge detail: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.post("/", response_model=ChallengeResponse)
def create_challenge(
    challenge: ChallengeCreateRequest,
    admin: dict = Depends(get_current_admin)
):
    """Créer un nouveau défi - Admin uniquement"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Vérifier que le slug n'existe pas déjà
            cursor.execute("SELECT id FROM challenges WHERE slug = %s", (challenge.slug,))
            if cursor.fetchone():
                raise HTTPException(status_code=400, detail=f"Un défi avec le slug '{challenge.slug}' existe déjà")
            
            # Insérer le nouveau défi
            cursor.execute("""
                INSERT INTO challenges (
                    slug, title, description, explanation, icon,
                    max_points_per_month, energy_savings, target_value, target_unit,
                    daily_points, weekly_bonus, is_active, created_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            """, (
                challenge.slug,
                challenge.title,
                challenge.description,
                challenge.explanation,
                challenge.icon,
                challenge.max_points_per_month,
                challenge.energy_savings,
                challenge.target_value,
                challenge.target_unit,
                challenge.daily_points,
                challenge.weekly_bonus,
                challenge.is_active
            ))
            
            challenge_id = cursor.lastrowid
            connection.commit()
            
            # Récupérer le défi créé
            cursor.execute("""
                SELECT 
                    c.*,
                    0 as participants_count,
                    0 as total_validations,
                    0 as total_points_awarded
                FROM challenges c
                WHERE c.id = %s
            """, (challenge_id,))
            
            new_challenge = cursor.fetchone()
        
        connection.close()
        
        return new_challenge
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating challenge: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.put("/{challenge_id}", response_model=ChallengeResponse)
def update_challenge(
    challenge_id: int,
    challenge: ChallengeUpdateRequest,
    admin: dict = Depends(get_current_admin)
):
    """Mettre à jour un défi - Admin uniquement"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Vérifier que le défi existe
            cursor.execute("SELECT id FROM challenges WHERE id = %s", (challenge_id,))
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Défi non trouvé")
            
            # Si le slug change, vérifier qu'il n'existe pas déjà
            if challenge.slug:
                cursor.execute(
                    "SELECT id FROM challenges WHERE slug = %s AND id != %s", 
                    (challenge.slug, challenge_id)
                )
                if cursor.fetchone():
                    raise HTTPException(status_code=400, detail=f"Un défi avec le slug '{challenge.slug}' existe déjà")
            
            # Construire la requête de mise à jour dynamiquement
            update_fields = []
            update_values = []
            
            if challenge.slug is not None:
                update_fields.append("slug = %s")
                update_values.append(challenge.slug)
            if challenge.title is not None:
                update_fields.append("title = %s")
                update_values.append(challenge.title)
            if challenge.description is not None:
                update_fields.append("description = %s")
                update_values.append(challenge.description)
            if challenge.explanation is not None:
                update_fields.append("explanation = %s")
                update_values.append(challenge.explanation)
            if challenge.icon is not None:
                update_fields.append("icon = %s")
                update_values.append(challenge.icon)
            if challenge.max_points_per_month is not None:
                update_fields.append("max_points_per_month = %s")
                update_values.append(challenge.max_points_per_month)
            if challenge.energy_savings is not None:
                update_fields.append("energy_savings = %s")
                update_values.append(challenge.energy_savings)
            if challenge.target_value is not None:
                update_fields.append("target_value = %s")
                update_values.append(challenge.target_value)
            if challenge.target_unit is not None:
                update_fields.append("target_unit = %s")
                update_values.append(challenge.target_unit)
            if challenge.daily_points is not None:
                update_fields.append("daily_points = %s")
                update_values.append(challenge.daily_points)
            if challenge.weekly_bonus is not None:
                update_fields.append("weekly_bonus = %s")
                update_values.append(challenge.weekly_bonus)
            if challenge.is_active is not None:
                update_fields.append("is_active = %s")
                update_values.append(challenge.is_active)
            
            if not update_fields:
                raise HTTPException(status_code=400, detail="Aucune modification à appliquer")
            
            # Exécuter la mise à jour
            update_values.append(challenge_id)
            query = f"UPDATE challenges SET {', '.join(update_fields)} WHERE id = %s"
            cursor.execute(query, update_values)
            connection.commit()
            
            # Récupérer le défi mis à jour
            cursor.execute("""
                SELECT 
                    c.*,
                    COUNT(DISTINCT cp.user_id) as participants_count,
                    COUNT(DISTINCT cdl.id) as total_validations,
                    COALESCE(SUM(cdl.points_earned), 0) as total_points_awarded
                FROM challenges c
                LEFT JOIN challenge_participations cp ON c.id = cp.challenge_id AND cp.is_active = TRUE
                LEFT JOIN challenge_daily_logs cdl ON cp.id = cdl.participation_id AND cdl.is_validated = TRUE
                WHERE c.id = %s
                GROUP BY c.id
            """, (challenge_id,))
            
            updated_challenge = cursor.fetchone()
        
        connection.close()
        
        return updated_challenge
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating challenge: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.patch("/{challenge_id}/toggle-status")
def toggle_challenge_status(
    challenge_id: int,
    admin: dict = Depends(get_current_admin)
):
    """Activer/Désactiver un défi - Admin uniquement"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Récupérer le statut actuel
            cursor.execute("SELECT is_active FROM challenges WHERE id = %s", (challenge_id,))
            challenge = cursor.fetchone()
            
            if not challenge:
                raise HTTPException(status_code=404, detail="Défi non trouvé")
            
            # Inverser le statut
            new_status = not challenge["is_active"]
            cursor.execute(
                "UPDATE challenges SET is_active = %s WHERE id = %s",
                (new_status, challenge_id)
            )
            connection.commit()
        
        connection.close()
        
        return {
            "message": f"Défi {'activé' if new_status else 'désactivé'} avec succès",
            "is_active": new_status
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error toggling challenge status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.delete("/{challenge_id}")
def delete_challenge(
    challenge_id: int,
    admin: dict = Depends(get_current_admin)
):
    """Supprimer un défi - Admin uniquement"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Vérifier que le défi existe
            cursor.execute("SELECT id, slug, title FROM challenges WHERE id = %s", (challenge_id,))
            challenge = cursor.fetchone()
            
            if not challenge:
                raise HTTPException(status_code=404, detail="Défi non trouvé")
            
            # Vérifier le nombre de participants
            cursor.execute("""
                SELECT COUNT(*) as count 
                FROM challenge_participations 
                WHERE challenge_id = %s
            """, (challenge_id,))
            participants = cursor.fetchone()
            
            # Log de l'action admin
            try:
                cursor.execute("""
                    INSERT INTO admin_actions 
                    (admin_id, action_type, target_id, target_type, reason, created_at)
                    VALUES (%s, %s, %s, %s, %s, NOW())
                """, (
                    admin["id"],
                    "DELETE_CHALLENGE",
                    challenge_id,
                    "challenge",
                    f"Suppression du défi '{challenge['title']}' avec {participants['count']} participants"
                ))
            except:
                print("Note: admin_actions table might not exist")
            
            # Supprimer les logs quotidiens associés
            cursor.execute("""
                DELETE cdl FROM challenge_daily_logs cdl
                INNER JOIN challenge_participations cp ON cdl.participation_id = cp.id
                WHERE cp.challenge_id = %s
            """, (challenge_id,))
            
            # Supprimer les participations
            cursor.execute("DELETE FROM challenge_participations WHERE challenge_id = %s", (challenge_id,))
            
            # Supprimer le défi
            cursor.execute("DELETE FROM challenges WHERE id = %s", (challenge_id,))
            
            connection.commit()
        
        connection.close()
        
        return {
            "success": True,
            "message": f"Défi '{challenge['title']}' supprimé avec succès",
            "participants_affected": participants["count"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting challenge: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@router.get("/stats/overview")
def get_challenges_stats_admin(
    admin: dict = Depends(get_current_admin)
):
    """Récupérer les statistiques globales des défis - Admin uniquement"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Nombre total de défis
            cursor.execute("SELECT COUNT(*) as total FROM challenges")
            total = cursor.fetchone()["total"]
            
            # Nombre de défis actifs
            cursor.execute("SELECT COUNT(*) as active FROM challenges WHERE is_active = TRUE")
            active = cursor.fetchone()["active"]
            
            # Nombre de défis en brouillon
            cursor.execute("SELECT COUNT(*) as draft FROM challenges WHERE is_active = FALSE")
            draft = cursor.fetchone()["draft"]
            
            # Total de participants (tous défis confondus)
            cursor.execute("""
                SELECT COUNT(DISTINCT user_id) as total_participants
                FROM challenge_participations
                WHERE is_active = TRUE
            """)
            participants = cursor.fetchone()["total_participants"]
            
            # Total de points distribués
            cursor.execute("""
                SELECT COALESCE(SUM(cdl.points_earned), 0) as total_points
                FROM challenge_daily_logs cdl
                WHERE cdl.is_validated = TRUE
            """)
            total_points = cursor.fetchone()["total_points"]
            
            # Total de validations
            cursor.execute("""
                SELECT COUNT(*) as total_validations
                FROM challenge_daily_logs
                WHERE is_validated = TRUE
            """)
            total_validations = cursor.fetchone()["total_validations"]
        
        connection.close()
        
        return {
            "total_challenges": total,
            "active_challenges": active,
            "draft_challenges": draft,
            "total_participants": participants,
            "total_points_awarded": total_points,
            "total_validations": total_validations
        }
        
    except Exception as e:
        print(f"Error fetching challenges stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")