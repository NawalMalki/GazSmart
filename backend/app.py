from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from models import SignupRequest, LoginRequest, GoogleAuthRequest, UserResponse, AuthResponse
from auth import (
    hash_password, verify_password, create_access_token, verify_token,
    get_user_by_email, get_user_by_google_id, create_user, verify_google_token,
    create_verification_token, verify_email_token, resend_verification_token
)
from email_service import send_verification_email, send_welcome_email
from database import init_db, get_db_connection
from typing import Optional

# Initialize FastAPI app
app = FastAPI(title="Auth API", version="1.0.0")

# Initialize database
init_db()

# CORS middleware

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
        raise HTTPException(status_code=401, detail="Not authenticated")
    
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

@app.get("/")
def root():
    return {"message": "Auth API is running"}

@app.post("/api/auth/signup", response_model=AuthResponse)
def signup(request: SignupRequest):
    """Register a new user"""
    existing_user = get_user_by_email(request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    password_hash = hash_password(request.password)
    
    user = create_user(
        email=request.email,
        full_name=request.full_name,
        password_hash=password_hash,
        is_verified=False
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
        created_at=user["created_at"]
    )
    
    return AuthResponse(access_token=access_token, token_type="bearer", user=user_response)

@app.post("/api/auth/login", response_model=AuthResponse)
def login(request: LoginRequest):
    """Login a user with email and password"""
    user = get_user_by_email(request.email)
    
    if not user or not user.get("password_hash"):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.get("is_verified"):
        raise HTTPException(status_code=403, detail="Email not verified. Please check your inbox.")
    
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": user["email"]})
    
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        profile_picture=user.get("profile_picture"),
        google_id=user.get("google_id"),
        created_at=user["created_at"]
    )
    
    return AuthResponse(access_token=access_token, token_type="bearer", user=user_response)

@app.post("/api/auth/google", response_model=AuthResponse)
def google_auth(request: GoogleAuthRequest):
    """Authenticate with Google OAuth token"""
    token_data = verify_google_token(request.token)
    
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid Google token")
    
    google_id = token_data.get("sub")
    email = token_data.get("email")
    full_name = token_data.get("name", "")
    profile_picture = token_data.get("picture")
    
    if not email:
        raise HTTPException(status_code=400, detail="Email not provided by Google")
    
    user = get_user_by_google_id(google_id)
    
    if not user:
        user = get_user_by_email(email)
    
    if not user:
        user = create_user(
            email=email,
            full_name=full_name,
            google_id=google_id,
            profile_picture=profile_picture,
            is_verified=True
        )
    
    if not user:
        raise HTTPException(status_code=500, detail="Failed to process Google authentication")
    
    access_token = create_access_token(data={"sub": user["email"]})
    
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        profile_picture=user.get("profile_picture"),
        google_id=user.get("google_id"),
        created_at=user["created_at"]
    )
    
    return AuthResponse(access_token=access_token, token_type="bearer", user=user_response)

@app.get("/api/auth/me", response_model=UserResponse)
def get_me(user: dict = Depends(get_current_user)):
    """Get current authenticated user"""
    return UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        profile_picture=user.get("profile_picture"),
        google_id=user.get("google_id"),
        created_at=user["created_at"]
    )

@app.post("/api/auth/logout")
def logout():
    """Logout user (token handled on frontend)"""
    return {"message": "Logged out successfully"}

@app.get("/api/auth/verify-email")
def verify_email(token: str):
    """
    Verify an email token safely without double-writing to DB.
    """
    # Vérifie le token, met à jour l’utilisateur et supprime le token
    email = verify_email_token(token)

    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")

    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Email de bienvenue (best-effort)
    try:
        send_welcome_email(email, user.get("full_name", ""))
    except Exception as e:
        print(f"Warning: failed to send welcome email: {e}")

    return {
        "message": "Email verified successfully",
        "email": email
    }

@app.post("/api/auth/resend-verification")
def resend_verification(request: LoginRequest):
    """Resend verification email"""
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
