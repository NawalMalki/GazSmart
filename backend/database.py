import pymysql
from config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT

def get_db_connection():
    """Create a MySQL database connection"""
    connection = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    return connection

def init_db():
    """Initialize database and create tables if they don't exist"""
    try:
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT,
            charset='utf8mb4'
        )
        with connection.cursor() as cursor:
            # Create database if it doesn't exist
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
        connection.close()
        
        # Now connect to the database
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Create users table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    full_name VARCHAR(255) NOT NULL,
                    password_hash VARCHAR(255),
                    google_id VARCHAR(255) UNIQUE,
                    profile_picture VARCHAR(500),
                    is_verified BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_email (email),
                    INDEX idx_google_id (google_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            
            # Create verification_tokens table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS verification_tokens (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(255) NOT NULL,
                    token VARCHAR(255) NOT NULL UNIQUE,
                    expires_at DATETIME NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_email (email),
                    INDEX idx_token (token),
                    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            
            # Update existing Google users to be verified
            cursor.execute("""
                UPDATE users 
                SET is_verified = TRUE 
                WHERE google_id IS NOT NULL
            """)
            
            connection.commit()
        connection.close()
        print("Database initialized successfully")
        print("Users table created/verified")
        print("Verification_tokens table created/verified")
    except Exception as e:
        print(f" Database initialization error: {str(e)}")