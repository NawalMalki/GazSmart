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


def create_events_table():
    """Crée la table des événements si elle n'existe pas"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS events (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    date DATE NOT NULL,
                    time TIME NOT NULL,
                    location VARCHAR(255) NOT NULL,
                    description TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    created_by INT,
                    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
                    INDEX idx_date (date),
                    INDEX idx_location (location)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
        connection.commit()
        connection.close()
        print("Table des événements créée / vérifiée")
    except Exception as e:
        print(f"Erreur lors de la création de la table events : {str(e)}")

# Ajoutez cette fonction à database.py
def create_posts_table():
    """Crée la table des posts si elle n'existe pas"""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS posts (
                    id SERIAL PRIMARY KEY,
                    user_id INT NOT NULL,
                    content TEXT NOT NULL,
                    image_url VARCHAR(500),
                    likes_count INT DEFAULT 0,
                    comments_count INT DEFAULT 0,
                    shares_count INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    INDEX idx_user_id (user_id),
                    INDEX idx_created_at (created_at DESC)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            
            # Table pour les commentaires
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS comments (
                    id SERIAL PRIMARY KEY,
                    post_id INT NOT NULL,
                    user_id INT NOT NULL,
                    content TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    edited_at TIMESTAMP NULL,
                    is_edited BOOLEAN DEFAULT FALSE,
                    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    INDEX idx_post_id (post_id),
                    INDEX idx_user_id (user_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            
            # Table pour les likes
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS post_likes (
                    id SERIAL PRIMARY KEY,
                    post_id INT NOT NULL,
                    user_id INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE KEY unique_like (post_id, user_id),
                    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
        connection.commit()
        connection.close()
        print("Tables des posts, commentaires et likes créées / vérifiées")
    except Exception as e:
        print(f"Erreur lors de la création des tables de posts : {str(e)}")        


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
            
            # Ajouter la colonne total_points si elle n'existe pas
            cursor.execute("""
                SELECT COUNT(*) as count 
                FROM information_schema.COLUMNS 
                WHERE TABLE_SCHEMA = %s 
                AND TABLE_NAME = 'users' 
                AND COLUMN_NAME = 'total_points'
            """, (DB_NAME,))
            
            result = cursor.fetchone()
            if result['count'] == 0:
                cursor.execute("""
                    ALTER TABLE users 
                    ADD COLUMN total_points INT DEFAULT 0 AFTER role
                """)
                print("Colonne total_points ajoutée à la table users")
            
            # ==================== TABLES POUR LES DÉFIS ====================
            
            # Table des défis disponibles
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS challenges (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    slug VARCHAR(100) UNIQUE NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    explanation TEXT,
                    icon VARCHAR(50),
                    max_points_per_month INT DEFAULT 0,
                    energy_savings VARCHAR(255),
                    target_value DECIMAL(10,2),
                    target_unit VARCHAR(50),
                    daily_points INT DEFAULT 10,
                    weekly_bonus INT DEFAULT 50,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_slug (slug),
                    INDEX idx_active (is_active)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            
            # Table des participations aux défis
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS challenge_participations (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    challenge_id INT NOT NULL,
                    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_active BOOLEAN DEFAULT TRUE,
                    current_streak INT DEFAULT 0,
                    best_streak INT DEFAULT 0,
                    total_points INT DEFAULT 0,
                    total_days_validated INT DEFAULT 0,
                    last_validation_date DATE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
                    UNIQUE KEY unique_participation (user_id, challenge_id),
                    INDEX idx_user (user_id),
                    INDEX idx_challenge (challenge_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            
            # Table des logs journaliers
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS challenge_daily_logs (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    participation_id INT NOT NULL,
                    log_date DATE NOT NULL,
                    value_recorded DECIMAL(10,2),
                    is_validated BOOLEAN DEFAULT FALSE,
                    points_earned INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (participation_id) REFERENCES challenge_participations(id) ON DELETE CASCADE,
                    INDEX idx_participation (participation_id),
                    INDEX idx_date (log_date)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            
            # Insérer les défis par défaut s'ils n'existent pas
            cursor.execute("SELECT COUNT(*) as count FROM challenges")
            challenge_count = cursor.fetchone()
            
            if challenge_count['count'] == 0:
                default_challenges = [
                    ('temperature', 'Défi Température', 
                     'Maintenez votre chauffage à 19°C pendant 30 jours',
                     'Chaque degré en moins représente environ 7% d économie sur votre facture de chauffage. En maintenant 19°C, température recommandée par l ADEME, vous optimisez votre confort tout en réduisant votre consommation.',
                     'Thermometer', 900, '7% par degré', 19.0, '°C', 30, 100),
                    
                    ('chrono-douche', 'Chrono Douche',
                     'Réduisez la durée de vos douches et gagnez des points',
                     'Une douche de 5 minutes consomme environ 60L d eau contre 150-200L pour un bain. En réduisant votre temps de douche, vous économisez eau et énergie pour la chauffer.',
                     'Droplets', 1200, '10-15L par minute', 5.0, 'minutes', 100, 150),
                    
                    ('cuisine-maligne', 'Cuisine Maligne',
                     'Adoptez les bons gestes en cuisine pour économiser l énergie',
                     'La cuisine représente environ 10% de la consommation électrique d un foyer. Couvrir les casseroles, utiliser la chaleur résiduelle et bien entretenir ses appareils permet de réduire significativement cette consommation.',
                     'ChefHat', 800, '20% en cuisine', None, None, 80, 100)
                ]
                
                cursor.executemany("""
                    INSERT INTO challenges (slug, title, description, explanation, icon, max_points_per_month, energy_savings, target_value, target_unit, daily_points, weekly_bonus)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, default_challenges)
                print("Défis par défaut créés")
            
            connection.commit()
        connection.close()
        
        # CRÉER LA TABLE DES ÉVÉNEMENTS - AJOUTÉ ICI
        create_events_table()
        create_posts_table()
        
        print("Base de données initialisée avec succès")
        print("Table des utilisateurs créée / vérifiée")
        print("Table des tokens de vérification créée / vérifiée")
        print("Table des événements créée / vérifiée")

    except Exception as e:
        print(f"Erreur lors de l'initialisation de la base de données : {str(e)}")
