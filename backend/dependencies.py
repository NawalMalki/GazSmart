# dependencies.py
from typing import Optional
from fastapi import Header, HTTPException, Depends
from auth import verify_token, get_user_by_email, is_admin

def get_current_user(authorization: Optional[str] = Header(None)):
    """Dependency to get current user from JWT token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Utilisateur non connecté")
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

def get_current_admin(user: dict = Depends(get_current_user)):
    """Dependency pour vérifier que l'utilisateur est admin"""
    if not is_admin(user):
        raise HTTPException(
            status_code=403, 
            detail="Accès refusé : droits administrateur requis"
        )
    return user