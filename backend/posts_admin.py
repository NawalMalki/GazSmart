from fastapi import APIRouter, Depends, HTTPException, Body
from database import get_db_connection
from dependencies import get_current_admin
import os

router = APIRouter(
    prefix="/api/admin/posts",
    tags=["Admin Posts"]
)

@router.get("")
def get_admin_posts(
    page: int = 1,
    limit: int = 20,
    admin: dict = Depends(get_current_admin)
):
    offset = (page - 1) * limit
    db = get_db_connection()

    with db.cursor() as cursor:
        cursor.execute("""
            SELECT 
                p.*,
                u.full_name AS user_name,
                u.email AS user_email,
                u.role AS user_role,
                u.profile_picture AS user_avatar,
                (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes_count,
                (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count
            FROM posts p
            JOIN users u ON u.id = p.user_id
            ORDER BY p.created_at DESC
            LIMIT %s OFFSET %s
        """, (limit, offset))

        posts = cursor.fetchall()

        cursor.execute("SELECT COUNT(*) AS total FROM posts")
        total = cursor.fetchone()["total"]

    db.close()

    return {
        "posts": posts,
        "page": page,
        "total_pages": (total + limit - 1) // limit,
        "total": total
    }


@router.delete("/{post_id}")
def delete_admin_post(
    post_id: int,
    payload: dict = Body(default={}),
    admin: dict = Depends(get_current_admin)
):
    reason = payload.get("reason", "Administrative action")
    db = get_db_connection()

    with db.cursor() as cursor:
        cursor.execute("SELECT image_url FROM posts WHERE id=%s", (post_id,))
        post = cursor.fetchone()

        if not post:
            raise HTTPException(status_code=404, detail="Post non trouvé")

        cursor.execute("""
            INSERT INTO admin_actions
            (admin_id, action_type, target_id, target_type, reason, created_at)
            VALUES (%s,'DELETE_POST',%s,'post',%s,NOW())
        """, (admin["id"], post_id, reason))

        if post["image_url"]:
            path = post["image_url"].lstrip("/")
            if os.path.exists(path):
                os.remove(path)

        cursor.execute("DELETE FROM posts WHERE id=%s", (post_id,))
        db.commit()

    db.close()
    return {"success": True}
