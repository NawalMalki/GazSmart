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
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_email (email),
                    INDEX idx_google_id (google_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            
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
            
            connection.commit()
        connection.close()
        print("Base de données initialisée avec succès")
        print("Table des utilisateurs créée / vérifiée")
        print("Table des tokens de vérification créée / vérifiée")

    except Exception as e:
        print(f"Erreur lors de l'initialisation de la base de données : {str(e)}")