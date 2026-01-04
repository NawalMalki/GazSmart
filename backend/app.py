''' Cerveau de l'application
C'est le point d'entrée de FastAPI où on crée l'application/api , on déclare les routes principales 
et connecte les autres fichiers 
'''



'''
************************************ IMPORTS & DEPENDANCES ******************************************
'''
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware # Pour autoriser le frontend 
from models import SignupRequest, LoginRequest, GoogleAuthRequest, UserResponse, AuthResponse
from auth import (
    hash_password, verify_password, create_access_token, verify_token,
    get_user_by_email, get_user_by_google_id, create_user, verify_google_token,
    create_verification_token, verify_email_token, resend_verification_token,
    is_admin  # Pour vérifier si l'utilisateur est admin
) # logique métier 
from email_service import send_verification_email, send_welcome_email
from database import init_db, get_db_connection # Création et Connexion à la bdd 
from typing import Optional

# Créer le serveur FastAPI 
app = FastAPI(title="Auth API", version="1.0.0")

# Initialiser la base de données 
init_db()

# PERMETTRE au frontend d'appeler l'API

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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



# Définition des endpoints principaux 
@app.get("/")
def root():
    return {"message": "L'API est en cours d'exécution"}


# Inscription + hash mot de passe + email verification
@app.post("/api/auth/signup", response_model=AuthResponse)
def signup(request: SignupRequest):
    """Register a new user"""
    existing_user = get_user_by_email(request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email déjà associé à un compte")
    
    password_hash = hash_password(request.password)
    
    user = create_user(
        email=request.email,
        full_name=request.full_name,
        password_hash=password_hash,
        is_verified=False,
        role="user"  # Par défaut, les nouveaux comptes sont des utilisateurs normaux
    )
    
    if not user:
        raise HTTPException(status_code=500, detail="Failed to create user")
    
    verification_token = create_verification_token(user["email"])
    
    if not verification_token:
        raise HTTPException(status_code=500, detail="Failed to create verification token")
    
    email_sent = send_verification_email(user["email"], verification_token, user["full_name"])
    
    if not email_sent:
        print("Warning: Verification email failed to send")
    
    access_token = create_access_token(data={"sub": user["email"]})
    
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        profile_picture=user.get("profile_picture"),
        google_id=user.get("google_id"),
        role=user.get("role", "user"),  # Inclure le rôle dans la réponse
        created_at=user["created_at"]
    )
    
    return AuthResponse(access_token=access_token, token_type="bearer", user=user_response)

# Connexion classique en mail et mot de passe avec JWT 
@app.post("/api/auth/login", response_model=AuthResponse)
def login(request: LoginRequest):
    user = get_user_by_email(request.email)
    
    if not user or not user.get("password_hash"):
        raise HTTPException(status_code=401, detail="Email ou mot de passe invalide")
    
    # Les admins peuvent se connecter sans vérification d'email
    if not user.get("is_verified") and not is_admin(user):
        raise HTTPException(status_code=403, detail="Email non vérifié, veuillez vérifier votre boîte de réception.")
    
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe invalide")
    
    access_token = create_access_token(data={"sub": user["email"]})
    
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        profile_picture=user.get("profile_picture"),
        google_id=user.get("google_id"),
        role=user.get("role", "user"),  # IMPORTANT: Le frontend a besoin du rôle pour rediriger correctement
        created_at=user["created_at"]
    )
    
    return AuthResponse(access_token=access_token, token_type="bearer", user=user_response)

# Connexion via Google OAuth 
@app.post("/api/auth/google", response_model=AuthResponse)
def google_auth(request: GoogleAuthRequest):
    token_data = verify_google_token(request.token)
    
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid Google token")
    
    google_id = token_data.get("sub")
    email = token_data.get("email")
    full_name = token_data.get("name", "")
    profile_picture = token_data.get("picture")
    
    if not email:
        raise HTTPException(status_code=400, detail="L'email n'a pas été fourni par Google")
    
    user = get_user_by_google_id(google_id)
    
    if not user:
        user = get_user_by_email(email)
    
    if not user:
        # Créer un nouvel utilisateur
        user = create_user(
            email=email,
            full_name=full_name,
            google_id=google_id,
            profile_picture=profile_picture,
            is_verified=True,
            role="user"  # Les utilisateurs Google sont par défaut des users normaux
        )
    else:
        # Mettre à jour la photo de profil si elle a changé
        if user.get("profile_picture") != profile_picture:
            try:
                connection = get_db_connection()
                with connection.cursor() as cursor:
                    cursor.execute("""
                        UPDATE users 
                        SET profile_picture = %s, full_name = %s
                        WHERE id = %s
                    """, (profile_picture, full_name, user["id"]))
                    connection.commit()
                connection.close()
                
                # Recharger l'utilisateur mis à jour
                user = get_user_by_google_id(google_id)
            except Exception as e:
                print(f"Error updating Google profile picture: {str(e)}")
    
    if not user:
        raise HTTPException(status_code=500, detail="Échec de l'authentification Google")
    
    access_token = create_access_token(data={"sub": user["email"]})
    
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        profile_picture=user.get("profile_picture"),
        google_id=user.get("google_id"),
        role=user.get("role", "user"),  # Inclure le rôle
        created_at=user["created_at"]
    )
    
    return AuthResponse(access_token=access_token, token_type="bearer", user=user_response)

    
# Récupérer l'utilisateur connecté 
@app.get("/api/auth/me", response_model=UserResponse)
def get_me(user: dict = Depends(get_current_user)):
    return UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        profile_picture=user.get("profile_picture"),
        google_id=user.get("google_id"),
        role=user.get("role", "user"),  # Inclure le rôle
        created_at=user["created_at"]
    )

@app.post("/api/auth/logout")
def logout():
    return {"message": "Déconnexion réussie"}


# Vérifier si l'utilisateur connecté est admin
@app.get("/api/auth/check-admin")
def check_admin(user: dict = Depends(get_current_user)):
    """Vérifie si l'utilisateur connecté est admin"""
    return {
        "is_admin": is_admin(user),
        "role": user.get("role", "user")
    }


# EXEMPLE: Endpoint protégé accessible uniquement aux admins
@app.get("/api/admin/users")
def get_all_users(admin: dict = Depends(get_current_admin)):
    """Liste tous les utilisateurs - accessible uniquement aux admins"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, email, full_name, role, is_verified, created_at FROM users")
            users = cursor.fetchall()
        connection.close()
        return {"users": users}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")


# Vérifier le token email
@app.get("/api/auth/verify-email")
def verify_email(token: str):
    # Vérifie le token
    email = verify_email_token(token)

    if not email:
        raise HTTPException(status_code=400, detail="Jeton de vérification invalide ou expiré")

    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    # SI DÉJÀ VÉRIFIÉ, RETOURNER SUCCESS SANS ERREUR
    if user.get("is_verified"):
        return {
            "message": "Email déjà vérifié",
            "email": email
        }

    # Mettre à jour is_verified dans la base de données
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE users 
                SET is_verified = TRUE 
                WHERE email = %s
            """, (email,))
            connection.commit()
            
            # Supprimer le token après vérification réussie
            cursor.execute("DELETE FROM verification_tokens WHERE token = %s", (token,))
            connection.commit()
        connection.close()
    except Exception as e:
        print(f"Error updating user verification status: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la vérification")

    # Email de bienvenue (best-effort)
    try:
        send_welcome_email(email, user.get("full_name", ""))
    except Exception as e:
        print(f"Warning: failed to send welcome email: {e}")

    return {
        "message": "Email vérifié avec succès",
        "email": email
    }

# Renvoyer le mail de vérification
@app.post("/api/auth/resend-verification")
def resend_verification(request: LoginRequest):
    user = get_user_by_email(request.email)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("is_verified"):
        raise HTTPException(status_code=400, detail="Email already verified")
    
    if not user.get("password_hash") or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid password")
    
    token = resend_verification_token(request.email)
    
    if not token:
        raise HTTPException(status_code=500, detail="Failed to generate verification token")
    
    email_sent = send_verification_email(request.email, token, user["full_name"])
    
    if not email_sent:
        raise HTTPException(status_code=500, detail="Failed to send verification email")
    
    return {"message": "Verification email sent successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)