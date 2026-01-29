'''
Gestion des posts et commentaires - Version complète corrigée
'''

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List, Dict, Any
import shutil
import os
from datetime import datetime, date
import json
from auth import get_user_by_email
from database import get_db_connection
from dependencies import get_current_user
import uuid

router = APIRouter(prefix="/api/posts", tags=["posts"])

# Créer le dossier pour stocker les images si il n'existe pas
UPLOAD_DIR = "uploads/posts"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Encodeur JSON personnalisé pour gérer les dates
class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return super().default(obj)

def serialize_datetime(obj):
    """Convertit les objets datetime en string ISO format"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, date):
        return obj.isoformat()
    return obj

def serialize_for_json(data):
    """Sérialise récursivement les données pour JSON"""
    if isinstance(data, dict):
        return {k: serialize_for_json(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [serialize_for_json(item) for item in data]
    elif isinstance(data, (datetime, date)):
        return data.isoformat()
    elif hasattr(data, 'isoformat'):  # Pour les objets datetime-like de MySQL
        return data.isoformat()
    else:
        return data

@router.post("/")
async def create_post(
    content: str = Form(...),
    image: Optional[UploadFile] = None,
    user: dict = Depends(get_current_user)
):
    """Créer un nouveau post"""
    try:
        image_url = None
        
        if image and image.filename:
            # Générer un nom unique pour l'image
            file_extension = os.path.splitext(image.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join(UPLOAD_DIR, unique_filename)
            
            # Sauvegarder le fichier
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            
            image_url = f"/{UPLOAD_DIR}/{unique_filename}"
        
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Insertion du post
            cursor.execute("""
                INSERT INTO posts (user_id, content, image_url, created_at, updated_at)
                VALUES (%s, %s, %s, NOW(), NOW())
            """, (user["id"], content, image_url))
            
            # Récupérer le dernier ID inséré
            post_id = cursor.lastrowid
            connection.commit()
            
            # Récupérer le post complet avec les infos utilisateur
            cursor.execute("""
                SELECT 
                    p.*,
                    u.full_name as user_name,
                    u.profile_picture as user_avatar,
                    u.email as user_email
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE p.id = %s
            """, (post_id,))
            
            post = cursor.fetchone()
            
        connection.close()
        
        if not post:
            raise HTTPException(status_code=500, detail="Post créé mais non récupéré")
        
        # Formater les données pour la réponse
        formatted_post = {
            "id": post["id"],
            "user_id": post["user_id"],
            "content": post["content"],
            "image_url": post["image_url"],
            "likes_count": post.get("likes_count", 0) or 0,
            "comments_count": post.get("comments_count", 0) or 0,
            "shares_count": post.get("shares_count", 0) or 0,
            "created_at": serialize_datetime(post["created_at"]),
            "updated_at": serialize_datetime(post["updated_at"]),
            "user_name": post["user_name"],
            "user_avatar": post["user_avatar"] or "https://i.pravatar.cc/150?img=5",
            "user_email": post["user_email"],
            "user_liked": 0,
            "time": "À l'instant",
            "commentList": [],
            "likes": post.get("likes_count", 0) or 0,
            "comments": post.get("comments_count", 0) or 0,
            "shares": post.get("shares_count", 0) or 0,
            "userName": post["user_name"],
            "userAvatar": post["user_avatar"] or "https://i.pravatar.cc/150?img=5"
        }
        
        return JSONResponse(
            status_code=201, 
            content=serialize_for_json(formatted_post)
        )
        
    except Exception as e:
        print(f"Error creating post: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création du post: {str(e)}")

@router.get("/")
async def get_posts(
    page: int = 1,
    limit: int = 20,
    user: dict = Depends(get_current_user)
):
    """Récupérer tous les posts avec pagination"""
    try:
        offset = (page - 1) * limit
        
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Récupérer les posts avec infos utilisateur
            cursor.execute("""
                SELECT 
                    p.*,
                    u.full_name as user_name,
                    u.profile_picture as user_avatar,
                    u.email as user_email,
                    CASE WHEN pl.user_id IS NOT NULL THEN 1 ELSE 0 END as user_liked,
                    (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
                    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
                FROM posts p
                JOIN users u ON p.user_id = u.id
                LEFT JOIN post_likes pl ON p.id = pl.post_id AND pl.user_id = %s
                ORDER BY p.created_at DESC
                LIMIT %s OFFSET %s
            """, (user["id"], limit, offset))
            
            posts = cursor.fetchall()
            
            formatted_posts = []
            for post in posts:
                # Récupérer les commentaires pour ce post
                cursor.execute("""
                    SELECT 
                        c.*,
                        u.full_name as user_name,
                        u.profile_picture as user_avatar
                    FROM comments c
                    JOIN users u ON c.user_id = u.id
                    WHERE c.post_id = %s
                    ORDER BY c.created_at ASC
                """, (post["id"],))
                
                comments = cursor.fetchall()
                comment_list = []
                for c in comments:
                    comment_list.append({
                        "id": c["id"],
                        "user": c["user_name"],
                        "avatar": c["user_avatar"] or "https://i.pravatar.cc/40?img=5",
                        "text": c["content"],
                        "time": format_time_ago(c["created_at"]),
                        "edited": bool(c.get("is_edited", False))
                    })
                
                # Formater le post
                formatted_post = {
                    "id": post["id"],
                    "user_id": post["user_id"],
                    "content": post["content"],
                    "image_url": post["image_url"],
                    "likes_count": post.get("likes_count", 0) or 0,
                    "comments_count": post.get("comments_count", 0) or 0,
                    "shares_count": post.get("shares_count", 0) or 0,
                    "created_at": serialize_datetime(post["created_at"]),
                    "updated_at": serialize_datetime(post["updated_at"]),
                    "user_name": post["user_name"],
                    "user_avatar": post["user_avatar"] or "https://i.pravatar.cc/150?img=5",
                    "user_email": post["user_email"],
                    "user_liked": post.get("user_liked", 0),
                    "time": format_time_ago(post["created_at"]),
                    "commentList": comment_list,
                    "likes": post.get("likes_count", 0) or 0,
                    "comments": post.get("comments_count", 0) or 0,
                    "shares": post.get("shares_count", 0) or 0,
                    "userName": post["user_name"],
                    "userAvatar": post["user_avatar"] or "https://i.pravatar.cc/150?img=5"
                }
                
                formatted_posts.append(serialize_for_json(formatted_post))
        
        connection.close()
        
        return JSONResponse(
            content={
                "posts": formatted_posts, 
                "page": page, 
                "limit": limit,
                "total": len(formatted_posts)
            }
        )
        
    except Exception as e:
        print(f"Error fetching posts: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des posts: {str(e)}")

@router.put("/{post_id}")
async def update_post(
    post_id: int,
    content: str = Form(...),
    image: Optional[UploadFile] = None,
    user: dict = Depends(get_current_user)
):
    """Mettre à jour un post"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Vérifier si le post existe et appartient à l'utilisateur
            cursor.execute("""
                SELECT * FROM posts WHERE id = %s AND user_id = %s
            """, (post_id, user["id"]))
            
            post = cursor.fetchone()
            
            if not post:
                connection.close()
                raise HTTPException(status_code=404, detail="Post non trouvé ou accès non autorisé")
            
            image_url = post["image_url"]
            
            if image and image.filename:
                # Supprimer l'ancienne image si elle existe
                if image_url:
                    old_path = image_url.lstrip('/')
                    if os.path.exists(old_path):
                        os.remove(old_path)
                
                # Sauvegarder la nouvelle image
                file_extension = os.path.splitext(image.filename)[1]
                unique_filename = f"{uuid.uuid4()}{file_extension}"
                file_path = os.path.join(UPLOAD_DIR, unique_filename)
                
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(image.file, buffer)
                
                image_url = f"/{UPLOAD_DIR}/{unique_filename}"
            
            # Mettre à jour le post
            cursor.execute("""
                UPDATE posts 
                SET content = %s, image_url = %s, updated_at = NOW()
                WHERE id = %s
            """, (content, image_url, post_id))
            
            connection.commit()
            
            # Récupérer le post mis à jour avec les infos utilisateur
            cursor.execute("""
                SELECT 
                    p.*,
                    u.full_name as user_name,
                    u.profile_picture as user_avatar,
                    u.email as user_email
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE p.id = %s
            """, (post_id,))
            
            updated_post = cursor.fetchone()
        
        connection.close()
        
        if not updated_post:
            raise HTTPException(status_code=500, detail="Post mis à jour mais non récupéré")
        
        return JSONResponse(
            content={
                "message": "Post mis à jour avec succès",
                "post": serialize_for_json({
                    "id": updated_post["id"],
                    "user_id": updated_post["user_id"],
                    "content": updated_post["content"],
                    "image_url": updated_post["image_url"],
                    "likes_count": updated_post.get("likes_count", 0) or 0,
                    "comments_count": updated_post.get("comments_count", 0) or 0,
                    "shares_count": updated_post.get("shares_count", 0) or 0,
                    "created_at": serialize_datetime(updated_post["created_at"]),
                    "updated_at": serialize_datetime(updated_post["updated_at"]),
                    "user_name": updated_post["user_name"],
                    "user_avatar": updated_post["user_avatar"]
                })
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating post: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de la mise à jour du post: {str(e)}")

@router.delete("/{post_id}")
async def delete_post(
    post_id: int,
    user: dict = Depends(get_current_user)
):
    """Supprimer un post"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Vérifier si l'utilisateur est admin ou propriétaire du post
            cursor.execute("""
                SELECT p.*, u.role 
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE p.id = %s
            """, (post_id,))
            
            post = cursor.fetchone()
            
            if not post:
                connection.close()
                raise HTTPException(status_code=404, detail="Post non trouvé")
            
            # Vérifier les permissions
            is_owner = post["user_id"] == user["id"]
            is_admin = user.get("role") == "admin"
            
            if not (is_owner or is_admin):
                connection.close()
                raise HTTPException(status_code=403, detail="Accès non autorisé")
            
            # Supprimer l'image associée si elle existe
            if post["image_url"]:
                image_path = post["image_url"].lstrip('/')
                if os.path.exists(image_path):
                    os.remove(image_path)
            
            # Supprimer le post (les FK cascade supprimeront les commentaires et likes)
            cursor.execute("DELETE FROM posts WHERE id = %s", (post_id,))
            connection.commit()
        
        connection.close()
        
        return {"message": "Post supprimé avec succès"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting post: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de la suppression du post: {str(e)}")

@router.post("/{post_id}/like")
async def toggle_like(
    post_id: int,
    user: dict = Depends(get_current_user)
):
    """Like/Unlike un post"""
    try:
        print(f"Toggling like for post {post_id} by user {user['id']}")
        
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Vérifier si le post existe
            cursor.execute("SELECT id FROM posts WHERE id = %s", (post_id,))
            post = cursor.fetchone()
            
            if not post:
                connection.close()
                raise HTTPException(status_code=404, detail="Post non trouvé")
            
            # Vérifier si l'utilisateur a déjà liké
            cursor.execute("""
                SELECT id FROM post_likes 
                WHERE post_id = %s AND user_id = %s
            """, (post_id, user["id"]))
            
            existing_like = cursor.fetchone()
            
            if existing_like:
                print(f"Removing like for post {post_id}")
                # Supprimer le like
                cursor.execute("""
                    DELETE FROM post_likes 
                    WHERE post_id = %s AND user_id = %s
                """, (post_id, user["id"]))
                
                # Décrémenter le compteur de likes
                cursor.execute("""
                    UPDATE posts 
                    SET likes_count = GREATEST(likes_count - 1, 0)
                    WHERE id = %s
                """, (post_id,))
                
                action = "unliked"
            else:
                print(f"Adding like for post {post_id}")
                # Ajouter le like
                cursor.execute("""
                    INSERT INTO post_likes (post_id, user_id)
                    VALUES (%s, %s)
                """, (post_id, user["id"]))
                
                # Incrémenter le compteur de likes
                cursor.execute("""
                    UPDATE posts 
                    SET likes_count = likes_count + 1
                    WHERE id = %s
                """, (post_id,))
                
                action = "liked"
            
            # Récupérer le nouveau nombre de likes
            cursor.execute("SELECT likes_count FROM posts WHERE id = %s", (post_id,))
            result = cursor.fetchone()
            likes_count = result["likes_count"] if result else 0
            
            connection.commit()
            print(f"Like action: {action}, new likes count: {likes_count}")
        
        connection.close()
        
        return {"action": action, "likes_count": likes_count}
        
    except Exception as e:
        print(f"Error toggling like: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erreur lors du like: {str(e)}")

@router.post("/{post_id}/comments")
async def add_comment(
    post_id: int,
    content: str = Form(...),
    user: dict = Depends(get_current_user)
):
    """Ajouter un commentaire à un post"""
    print(f"🚀 Route /comments appelée pour post_id: {post_id}")
    print(f"📝 Contenu reçu: {content}")
    print(f"👤 Utilisateur: {user['id']} - {user['email']}")

    """Ajouter un commentaire à un post"""
    try:
        print(f"Adding comment to post {post_id} by user {user['id']}: {content[:50]}...")
        
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Vérifier si le post existe
            cursor.execute("SELECT id FROM posts WHERE id = %s", (post_id,))
            post = cursor.fetchone()
            
            if not post:
                connection.close()
                raise HTTPException(status_code=404, detail="Post non trouvé")
            
            # Ajouter le commentaire
            cursor.execute("""
                INSERT INTO comments (post_id, user_id, content, created_at)
                VALUES (%s, %s, %s, NOW())
            """, (post_id, user["id"], content))
            
            # Récupérer le dernier ID inséré
            comment_id = cursor.lastrowid
            print(f"Comment inserted with ID: {comment_id}")
            
            # Incrémenter le compteur de commentaires
            cursor.execute("""
                UPDATE posts 
                SET comments_count = comments_count + 1
                WHERE id = %s
            """, (post_id,))
            
            # Récupérer le commentaire avec les infos utilisateur
            cursor.execute("""
                SELECT 
                    c.*,
                    u.full_name as user_name,
                    u.profile_picture as user_avatar
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.id = %s
            """, (comment_id,))
            
            comment = cursor.fetchone()
            connection.commit()
            
            print(f"Comment retrieved: {comment}")
        
        connection.close()
        
        if not comment:
            raise HTTPException(status_code=500, detail="Commentaire créé mais non récupéré")
        
        # Formater la réponse
        formatted_comment = serialize_for_json({
            "id": comment["id"],
            "user": comment["user_name"],
            "avatar": comment["user_avatar"] or "https://i.pravatar.cc/40?img=5",
            "text": comment["content"],
            "time": "À l'instant",
            "edited": False
        })
        
        return JSONResponse(content=formatted_comment)
        
    except Exception as e:
        print(f"Error adding comment: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'ajout du commentaire: {str(e)}")

@router.put("/comments/{comment_id}")
async def update_comment(
    comment_id: int,
    content: str = Form(...),
    user: dict = Depends(get_current_user)
):
    """Mettre à jour un commentaire"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Vérifier si le commentaire existe et appartient à l'utilisateur
            cursor.execute("""
                SELECT * FROM comments 
                WHERE id = %s AND user_id = %s
            """, (comment_id, user["id"]))
            
            comment = cursor.fetchone()
            
            if not comment:
                connection.close()
                raise HTTPException(status_code=404, detail="Commentaire non trouvé ou accès non autorisé")
            
            # Mettre à jour le commentaire
            cursor.execute("""
                UPDATE comments 
                SET content = %s, is_edited = TRUE, edited_at = NOW()
                WHERE id = %s
            """, (content, comment_id))
            
            connection.commit()
            
            # Récupérer le commentaire mis à jour
            cursor.execute("SELECT * FROM comments WHERE id = %s", (comment_id,))
            updated_comment = cursor.fetchone()
        
        connection.close()
        
        return JSONResponse(
            content={
                "message": "Commentaire mis à jour avec succès", 
                "comment": serialize_for_json({
                    "id": updated_comment["id"],
                    "content": updated_comment["content"],
                    "is_edited": updated_comment["is_edited"],
                    "edited_at": serialize_datetime(updated_comment["edited_at"]) if updated_comment["edited_at"] else None
                })
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating comment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de la mise à jour du commentaire: {str(e)}")

@router.delete("/comments/{comment_id}")
async def delete_comment(
    comment_id: int,
    user: dict = Depends(get_current_user)
):
    """Supprimer un commentaire"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Vérifier si le commentaire existe
            cursor.execute("""
                SELECT c.*, u.role 
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.id = %s
            """, (comment_id,))
            
            comment = cursor.fetchone()
            
            if not comment:
                connection.close()
                raise HTTPException(status_code=404, detail="Commentaire non trouvé")
            
            # Vérifier les permissions
            is_owner = comment["user_id"] == user["id"]
            is_admin = user.get("role") == "admin"
            
            if not (is_owner or is_admin):
                connection.close()
                raise HTTPException(status_code=403, detail="Accès non autorisé")
            
            # Décrémenter le compteur de commentaires du post
            cursor.execute("""
                UPDATE posts 
                SET comments_count = GREATEST(comments_count - 1, 0)
                WHERE id = %s
            """, (comment["post_id"],))
            
            # Supprimer le commentaire
            cursor.execute("DELETE FROM comments WHERE id = %s", (comment_id,))
            connection.commit()
        
        connection.close()
        
        return {"message": "Commentaire supprimé avec succès"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting comment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de la suppression du commentaire: {str(e)}")

def format_time_ago(timestamp):
    """Formater la date en format relatif"""
    if timestamp is None:
        return "Récemment"
    
    now = datetime.now()
    
    # Si c'est déjà un string ISO, le convertir en datetime
    if isinstance(timestamp, str):
        try:
            # Essayer différents formats
            timestamp = timestamp.replace('Z', '+00:00')
            timestamp = datetime.fromisoformat(timestamp)
        except:
            try:
                # Essayer format MySQL
                timestamp = datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S')
            except:
                return "Récemment"
    
    # Si c'est un datetime, calculer la différence
    if isinstance(timestamp, datetime):
        diff = now - timestamp
        
        if diff.days > 365:
            years = diff.days // 365
            return f"Il y a {years} an{'s' if years > 1 else ''}"
        elif diff.days > 30:
            months = diff.days // 30
            return f"Il y a {months} mois"
        elif diff.days > 0:
            return f"Il y a {diff.days} jour{'s' if diff.days > 1 else ''}"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"Il y a {hours} heure{'s' if hours > 1 else ''}"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"Il y a {minutes} minute{'s' if minutes > 1 else ''}"
        else:
            return "À l'instant"
    
    return "Récemment"

#####################################################################
# 
# Routes Admin Simplifiées
# @router.get("/admin/all")
# async def get_all_posts_admin(
#     page: int = 1,
#     limit: int = 20,
#     user: dict = Depends(get_current_user)
# ):
#     """Récupérer tous les posts (admin seulement)"""
#     try:
#         # Vérification du rôle admin
#         if user.get("role") != "admin":
#             raise HTTPException(status_code=403, detail="Accès admin requis")
        
#         offset = (page - 1) * limit
        
#         connection = get_db_connection()
#         with connection.cursor() as cursor:
#             # Récupérer tous les posts avec infos utilisateur
#             cursor.execute("""
#                 SELECT 
#                     p.*,
#                     u.full_name as user_name,
#                     u.profile_picture as user_avatar,
#                     u.email as user_email,
#                     u.role as user_role,
#                     (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
#                     (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
#                 FROM posts p
#                 JOIN users u ON p.user_id = u.id
#                 ORDER BY p.created_at DESC
#                 LIMIT %s OFFSET %s
#             """, (limit, offset))
            
#             posts = cursor.fetchall()
            
#             # Compter le total pour la pagination
#             cursor.execute("SELECT COUNT(*) as total FROM posts")
#             total_result = cursor.fetchone()
#             total = total_result["total"] if total_result else 0
            
#             # Récupérer les commentaires pour chaque post
#             for post in posts:
#                 cursor.execute("""
#                     SELECT 
#                         c.id,
#                         c.content,
#                         c.created_at,
#                         u.full_name as commenter_name
#                     FROM comments c
#                     JOIN users u ON c.user_id = u.id
#                     WHERE c.post_id = %s
#                     ORDER BY c.created_at DESC
#                     LIMIT 5
#                 """, (post["id"],))
#                 post["recent_comments"] = cursor.fetchall()
        
#         connection.close()
        
#         return {
#             "posts": serialize_for_json(posts),
#             "page": page,
#             "limit": limit,
#             "total": total,
#             "total_pages": (total + limit - 1) // limit
#         }
        
#     except Exception as e:
#         print(f"Error fetching admin posts: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

# @router.delete("/admin/{post_id}")
# async def admin_delete_post(
#     post_id: int,
#     reason: str = Form(None),
#     user: dict = Depends(get_current_user)
# ):
#     """Supprimer un post en tant qu'admin"""
#     try:
#         # Vérification du rôle admin
#         if user.get("role") != "admin":
#             raise HTTPException(status_code=403, detail="Accès admin requis")
        
#         connection = get_db_connection()
#         with connection.cursor() as cursor:
#             # Récupérer les infos du post avant suppression
#             cursor.execute("""
#                 SELECT p.*, u.full_name, u.email 
#                 FROM posts p
#                 JOIN users u ON p.user_id = u.id
#                 WHERE p.id = %s
#             """, (post_id,))
            
#             post = cursor.fetchone()
            
#             if not post:
#                 connection.close()
#                 raise HTTPException(status_code=404, detail="Post non trouvé")
            
#             # Log de l'action admin
#             try:
#                 cursor.execute("""
#                     INSERT INTO admin_actions 
#                     (admin_id, action_type, target_id, target_type, reason, created_at)
#                     VALUES (%s, %s, %s, %s, %s, NOW())
#                 """, (user["id"], "DELETE_POST", post_id, "post", reason or "Administrative action"))
#             except:
#                 print("Note: admin_actions table might not exist")
            
#             # Supprimer l'image si elle existe
#             if post.get("image_url"):
#                 try:
#                     import os
#                     image_path = post["image_url"].lstrip('/')
#                     if os.path.exists(image_path):
#                         os.remove(image_path)
#                 except:
#                     print("Note: Could not delete image file")
            
#             # Supprimer le post
#             cursor.execute("DELETE FROM posts WHERE id = %s", (post_id,))
#             connection.commit()
        
#         connection.close()
        
#         return {"success": True, "message": "Post supprimé avec succès"}
        
#     except Exception as e:
#         print(f"Error admin deleting post: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")   