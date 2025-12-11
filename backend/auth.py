import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Optional
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from database import get_db_connection
import secrets

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    """Verify a JWT token and return the email"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except jwt.InvalidTokenError:
        return None

def get_user_by_email(email: str):
    """Get user from database by email"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
        connection.close()
        return user
    except Exception as e:
        print(f"Error getting user: {str(e)}")
        return None

def get_user_by_google_id(google_id: str):
    """Get user from database by Google ID"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE google_id = %s", (google_id,))
            user = cursor.fetchone()
        connection.close()
        return user
    except Exception as e:
        print(f"Error getting user by Google ID: {str(e)}")
        return None

def create_user(email: str, full_name: str, password_hash: str = None, google_id: str = None, profile_picture: str = None, is_verified: bool = False):
    """Create a new user in the database"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO users (email, full_name, password_hash, google_id, profile_picture, is_verified)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (email, full_name, password_hash, google_id, profile_picture, is_verified))
            connection.commit()
        connection.close()
        return get_user_by_email(email)
    except Exception as e:
        print(f"Error creating user: {str(e)}")
        return None

def verify_google_token(token: str):
    """Verify a Google ID token"""
    try:
        decoded_token = jwt.decode(token, options={"verify_signature": False})
        return decoded_token
    except Exception as e:
        print(f"Error verifying Google token: {str(e)}")
        return None

def create_verification_token(email: str) -> str:
    """Create a verification token and store it in database"""
    try:
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=24)
        
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM verification_tokens WHERE email = %s", (email,))
            cursor.execute("""
                INSERT INTO verification_tokens (email, token, expires_at)
                VALUES (%s, %s, %s)
            """, (email, token, expires_at))
            connection.commit()
        connection.close()
        
        return token
    except Exception as e:
        print(f"Error creating verification token: {str(e)}")
        return None

def verify_email_token(token: str) -> Optional[str]:
    """Verify an email verification token and return the email"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT email, expires_at FROM verification_tokens 
                WHERE token = %s
            """, (token,))
            result = cursor.fetchone()
            
            if not result:
                connection.close()
                return None
            
            email = result['email']
            expires_at = result['expires_at']
            
            if datetime.utcnow() > expires_at:
                cursor.execute("DELETE FROM verification_tokens WHERE token = %s", (token,))
                connection.commit()
                connection.close()
                return None
            
            cursor.execute("""
                UPDATE users SET is_verified = TRUE 
                WHERE email = %s
            """, (email,))
            
            cursor.execute("DELETE FROM verification_tokens WHERE token = %s", (token,))
            connection.commit()
        
        connection.close()
        return email
        
    except Exception as e:
        print(f"Error verifying email token: {str(e)}")
        return None

def resend_verification_token(email: str) -> Optional[str]:
    """Resend verification token for a user"""
    try:
        user = get_user_by_email(email)
        if not user:
            return None
        
        if user.get('is_verified'):
            return None
        
        return create_verification_token(email)
    except Exception as e:
        print(f"Error resending verification token: {str(e)}")
        return None