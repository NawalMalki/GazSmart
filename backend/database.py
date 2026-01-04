'''
Création et connexion à la base de données et gestion des sessions
'''

import pymysql # biblio python pour mySQL 
from config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT # Charger les paramètres de DB depuis config.py 


# Connexion prête à l'emploi dans tout le code 
def get_db_connection():
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

# Créer les bases de données et les tables dendans si elles n'existent pas + Initialiser certains données
def init_db():
    try:
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT,
            charset='utf8mb4'
        )
        with connection.cursor() as cursor:
            # Créer bdd 
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
        connection.close()
        
        # Se connecter via la connexion prête à l'emploi déjà créé au dessus 
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Créer la table des utilisateurs 
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    full_name VARCHAR(255) NOT NULL,
                    password_hash VARCHAR(255),
                    google_id VARCHAR(255) UNIQUE,
                    profile_picture VARCHAR(500),
                    is_verified BOOLEAN DEFAULT FALSE,
                    role VARCHAR(50) DEFAULT 'user',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_email (email),
                    INDEX idx_google_id (google_id),
                    INDEX idx_role (role)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            
            # Si la table existe déjà sans la colonne role, on l'ajoute
            cursor.execute("""
                SELECT COUNT(*) as count 
                FROM information_schema.COLUMNS 
                WHERE TABLE_SCHEMA = %s 
                AND TABLE_NAME = 'users' 
                AND COLUMN_NAME = 'role'
            """, (DB_NAME,))
            
            result = cursor.fetchone()
            if result['count'] == 0:
                cursor.execute("""
                    ALTER TABLE users 
                    ADD COLUMN role VARCHAR(50) DEFAULT 'user' AFTER is_verified
                """)
                cursor.execute("CREATE INDEX idx_role ON users(role)")
            
            # Créer la table des tokens 
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
            
            # Tous les utilisateurs connectés par Google sont considéré comme vérifiés 
            cursor.execute("""
                UPDATE users 
                SET is_verified = TRUE 
                WHERE google_id IS NOT NULL
            """)
            
            # Créer le compte admin GRDF si il n'existe pas encore
            cursor.execute("SELECT * FROM users WHERE email = 'admin_grdf@gmail.com'")
            admin_exists = cursor.fetchone()
            
            if not admin_exists:
                from auth import hash_password
                admin_password_hash = hash_password("admin_grdf_2026")
                
                cursor.execute("""
                    INSERT INTO users (email, full_name, password_hash, is_verified, role)
                    VALUES (%s, %s, %s, %s, %s)
                """, ("admin_grdf@gmail.com", "Admin GRDF", admin_password_hash, True, "admin"))
                
                print("Compte admin GRDF créé avec succès")
            else:
                # S'assurer que le compte admin a bien le rôle admin
                cursor.execute("""
                    UPDATE users 
                    SET role = 'admin', is_verified = TRUE 
                    WHERE email = 'admin_grdf@gmail.com'
                """)
                print("Compte admin GRDF vérifié")
            
            connection.commit()
        connection.close()
        print("Base de données initialisée avec succès")
        print("Table des utilisateurs créée / vérifiée")
        print("Table des tokens de vérification créée / vérifiée")

    except Exception as e:
        print(f"Erreur lors de l'initialisation de la base de données : {str(e)}")