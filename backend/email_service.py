import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import SMTP_SERVER, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD, FRONTEND_URL

def send_verification_email(email: str, token: str, full_name: str) -> bool:
    """Send verification email to user"""
    try:
        verification_link = f"{FRONTEND_URL}/verify-email?token={token}"
        
        message = MIMEMultipart("alternative")
        message["Subject"] = "Vérifiez votre adresse email - Challenge Sobriété"
        message["From"] = f"Les Gaz'Vengers <{SMTP_EMAIL}>"
        message["To"] = email

        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }}
                .container {{
                    background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
                    border-radius: 10px;
                    padding: 30px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }}
                .content {{
                    background: white;
                    border-radius: 8px;
                    padding: 30px;
                }}
                .header {{
                    text-align: center;
                    margin-bottom: 30px;
                }}
                .logo {{
                    font-size: 24px;
                    font-weight: bold;
                    color: #14b8a6;
                    margin-bottom: 10px;
                }}
                h1 {{
                    color: #1f2937;
                    margin-bottom: 20px;
                    font-size: 28px;
                }}
                .button {{
                    display: inline-block;
                    padding: 14px 28px;
                    background: linear-gradient(to right, #14b8a6, #06b6d4);
                    color: white !important;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    margin: 20px 0;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 30px;
                    color: #6b7280;
                    font-size: 14px;
                }}
                .warning {{
                    background: #fef3c7;
                    border-left: 4px solid #f59e0b;
                    padding: 12px;
                    margin: 20px 0;
                    border-radius: 4px;
                }}
                .link {{
                    word-break: break-all;
                    color: #14b8a6;
                    font-size: 14px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="content">
                    <div class="header">
                        <div class="logo">🌱 Les Gaz'Vengers</div>
                    </div>
                    
                    <h1>Bonjour {full_name} ! 👋</h1>
                    
                    <p>Bienvenue sur Challenge Sobriété ! Nous sommes ravis de vous compter parmi nous.</p>
                    
                    <p>Pour commencer à utiliser votre compte et accéder à votre tableau de bord, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
                    
                    <div style="text-align: center;">
                        <a href="{verification_link}" class="button">
                             Vérifier mon email
                        </a>
                    </div>
                    
                    <div class="warning">
                        <strong>Important :</strong> Ce lien de vérification expire dans 24 heures.
                    </div>
                    
                    <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
                    <p class="link">
                        {verification_link}
                    </p>
                    
                    <div class="footer">
                        <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email en toute sécurité.</p>
                        <p>© 2025 GazSmart - Challenge Sobriété</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

        text = f"""
        Bonjour {full_name} !
        
        Bienvenue sur Challenge Sobriété !
        
        Pour vérifier votre adresse email, cliquez sur ce lien :
        {verification_link}
        
        Ce lien expire dans 24 heures.
        
        Si vous n'avez pas créé de compte, ignorez cet email.
        
        GazSmart - Challenge Sobriété
        """

        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")
        message.attach(part1)
        message.attach(part2)

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, email, message.as_string())
        
        print(f"✅ Verification email sent successfully to {email}")
        return True
        
    except Exception as e:
        print(f"❌ Error sending verification email: {str(e)}")
        return False

def send_welcome_email(email: str, full_name: str) -> bool:
    """Send welcome email after successful verification"""
    try:
        message = MIMEMultipart("alternative")
        message["Subject"] = "Bienvenue sur Challenge Sobriété ! 🎉"
        message["From"] = f"GazSmart <{SMTP_EMAIL}>"
        message["To"] = email

        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .container {{
                    background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
                    border-radius: 10px;
                    padding: 30px;
                }}
                .content {{
                    background: white;
                    border-radius: 8px;
                    padding: 30px;
                }}
                h1 {{
                    color: #1f2937;
                    text-align: center;
                }}
                .button {{
                    display: inline-block;
                    padding: 14px 28px;
                    background: linear-gradient(to right, #14b8a6, #06b6d4);
                    color: white !important;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    margin: 20px 0;
                }}
                .features {{
                    margin: 20px 0;
                }}
                .feature {{
                    margin: 15px 0;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="content">
                    <h1>🎉 Votre compte est activé !</h1>
                    
                    <p>Félicitations {full_name} ! Votre email a été vérifié avec succès.</p>
                    
                    <p>Vous pouvez maintenant profiter de toutes les fonctionnalités de Challenge Sobriété :</p>
                    
                    <div class="features">
                        <div class="feature">- Suivi temps réel de votre consommation énergétique</div>
                        <div class="feature">- Rapports détaillés et analyses personnalisées</div>
                        <div class="feature">- Conseils d'optimisation sur mesure</div>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="{FRONTEND_URL}/dashboard" class="button">
                            Accéder au tableau de bord
                        </a>
                    </div>
                    
                    <p style="text-align: center; margin-top: 30px; color: #6b7280;">
                        Merci de nous faire confiance ! 🌱<br>
                        L'équipe Les Gaz'Vengers
                    </p>
                </div>
            </div>
        </body>
        </html>
        """

        text = f"""
        Félicitations {full_name} !
        
        Votre email a été vérifié avec succès. Vous pouvez maintenant accéder à votre tableau de bord.
        
        {FRONTEND_URL}/dashboard
        
        L'équipe Les Gaz'Vengers
        """

        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")
        message.attach(part1)
        message.attach(part2)

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, email, message.as_string())
        
        print(f"Welcome email sent successfully to {email}")
        return True
        
    except Exception as e:
        print(f"Error sending welcome email: {str(e)}")
        return False