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
            
            # ==================== TABLES POUR LES DÉFIS ====================
            
            # Table des types de défis disponibles
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS challenges (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    slug VARCHAR(100) UNIQUE NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    explanation TEXT,
                    icon VARCHAR(50),
                    max_points_per_month INT DEFAULT 500,
                    energy_savings VARCHAR(100),
                    target_value DECIMAL(10, 2),
                    target_unit VARCHAR(50),
                    daily_points INT DEFAULT 70,
                    weekly_bonus INT DEFAULT 500,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_slug (slug),
                    INDEX idx_active (is_active)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            
            # Table des participations aux défis (un user peut participer à plusieurs défis)
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
                    UNIQUE KEY unique_participation (user_id, challenge_id),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
                    INDEX idx_user (user_id),
                    INDEX idx_challenge (challenge_id),
                    INDEX idx_active (is_active)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            
            # Table des logs quotidiens de validation
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS challenge_daily_logs (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    participation_id INT NOT NULL,
                    log_date DATE NOT NULL,
                    value_recorded DECIMAL(10, 2),
                    is_validated BOOLEAN DEFAULT FALSE,
                    points_earned INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE KEY unique_daily_log (participation_id, log_date),
                    FOREIGN KEY (participation_id) REFERENCES challenge_participations(id) ON DELETE CASCADE,
                    INDEX idx_participation (participation_id),
                    INDEX idx_date (log_date),
                    INDEX idx_validated (is_validated)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            
            # Table des badges gagnés par les utilisateurs
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_badges (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    badge_type ENUM('bronze', 'silver', 'gold') NOT NULL,
                    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    total_points_at_earn INT,
                    UNIQUE KEY unique_badge (user_id, badge_type),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    INDEX idx_user (user_id),
                    INDEX idx_badge (badge_type)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            
            # Ajouter colonne total_points à la table users si elle n'existe pas
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
            
            # Insérer les défis par défaut s'ils n'existent pas
            cursor.execute("SELECT COUNT(*) as count FROM challenges")
            challenges_count = cursor.fetchone()
            if challenges_count['count'] == 0:
                cursor.execute("""
                    INSERT INTO challenges (slug, title, description, explanation, icon, max_points_per_month, energy_savings, target_value, target_unit, daily_points, weekly_bonus)
                    VALUES 
                    ('temperature', 'Défi température', 'Maintenez 19°C pendant 7 jours', 
                     'Optimisez votre chauffage en ne l''activant que lorsque c''est vraiment nécessaire. Gardez une température constante de 19°C pour un confort optimal tout en réduisant votre consommation énergétique.',
                     'thermometer', 500, '~17 kWh/mois', 19.00, '°C', 70, 500),
                    ('chrono-douche', 'Chrono douche', 'Réduisez votre temps de douche',
                     'Minimisez le temps passé sous la douche au maximum. Chaque minute économisée représente des litres d''eau chaude en moins et une réduction significative de votre consommation d''énergie.',
                     'droplet', 700, '~24 kWh/mois', 5.00, 'min', 100, 500),
                    ('cuisine-maligne', 'Cuisine maligne', 'Checklist quotidienne d''économie',
                     'Suivez une checklist quotidienne de bonnes pratiques en cuisine pour minimiser l''énergie consommée : couvercles sur les casseroles, utilisation optimale du four, extinction des plaques avant la fin de cuisson...',
                     'zap', 1000, '~25 kWh/mois', 1.00, 'checklist', 140, 500)
                """)
                print("Défis par défaut créés")
            
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
