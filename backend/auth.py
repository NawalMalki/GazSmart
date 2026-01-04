'''
TOUTE LA LOGIQUE D'AUTHENTIFICATION
- signup
- login
- Création et vérification des tokens jwt 
- hash & verify password 
C'est le fichier qu'il faut vérifier si un utilisateur ne peut pas se connecter 
'''


'''
****************************** IMPORTS & DEPENDENCES *******************************************
'''
import jwt # Sécurité 
import bcrypt # Hash des mots de passe 
from datetime import datetime, timedelta # Gestion du temps
from typing import Optional
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES # Les variables critiques de JWT 
from database import get_db_connection # Ouvrir une connexion à la bdd 
import secrets # Géneration de tokens sur 

'''
************************************* PASSWORD HASHING *******************************************
'''
# On ne stocke jamais un mot de passe en clair 
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

# Compare le password entré par l'utilisateur vs celui hashé en DB
def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))

'''
************************************* JWT (TOKEN ACCESS) *****************************************
Cet utilisateur est connecté ET autorisé
'''
# Créer un token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Vérifier le token 
def verify_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except jwt.InvalidTokenError:
        return None

'''
************************************* USERS (DATABASE) ******************************************
'''

# Récupérer un utilisateur depuis la base de données par mail
def get_user_by_email(email: str):
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

'''
****************************************** GOOGLE TOKEN ******************************************
'''
# Récupérer l'utilisateur par ID Google 
def get_user_by_google_id(google_id: str):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE google_id = %s", (google_id,))
            user = cursor.fetchone()
        connection.close()
        return user
    except Exception as e:
        print(f"Erreur de récupération d'utilisateur par Google ID: {str(e)}")
        return None

def create_user(email: str, full_name: str, password_hash: str = None, google_id: str = None, profile_picture: str = None, is_verified: bool = False, role: str = "user"):
    """Create a new user in the database"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO users (email, full_name, password_hash, google_id, profile_picture, is_verified, role)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (email, full_name, password_hash, google_id, profile_picture, is_verified, role))
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

'''
************************************* ADMIN VERIFICATION ******************************************
'''
# Vérifier si l'utilisateur a le rôle admin
def is_admin(user: dict) -> bool:
    """Check if user has admin role"""
    return user.get("role") == "admin"

# Vérifier l'accès admin par email
def check_admin_access(email: str) -> bool:
    """Verify if user is admin"""
    user = get_user_by_email(email)
    if not user:
        return False
    return is_admin(user)

'''
******************************** EMAIL VERIFICATION TOKENS *****************************************
'''
# => Confirmer que l'email appartient à user 
def create_verification_token(email: str) -> Optional[str]:
    try:
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=24)
        
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # remove old tokens for the same email (optional)
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

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT email, expires_at FROM verification_tokens 
                WHERE token = %s
            """, (token,))
            result = cursor.fetchone()
            
            if result:
                # Token exists, check expiration
                email = result['email']
                expires_at = result['expires_at']
                
                # If token expired: delete it and return None
                if datetime.utcnow() > expires_at:
                    try:
                        cursor.execute("DELETE FROM verification_tokens WHERE token = %s", (token,))
                        connection.commit()
                    except Exception as ex_del:
                        print(f"Warning: failed to delete expired token: {ex_del}")
                    finally:
                        connection.close()
                    return None
                
                # Token exists and is not expired
                connection.close()
                return email
            
            connection.close()
            return None
            
    except Exception as e:
        print(f"Error verifying email token: {str(e)}")
        return None

# La possibilité de renvoyer un email de vérification
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