import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from dotenv import load_dotenv

# Charger les variables d'environnement depuis la racine du projet
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

SMTP_HOST = os.getenv('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
SMTP_USER = os.getenv('SMTP_USER', '')
SMTP_PASS = os.getenv('SMTP_PASS', '')
SMTP_USE_TLS = os.getenv('SMTP_USE_TLS', 'true').lower() in ('1', 'true', 'yes')
EMAIL_FROM = os.getenv('EMAIL_FROM', SMTP_USER)
EMAIL_TO = os.getenv('EMAIL_TO', 'mboungouchristamany@gmail.com')


def build_email_content(title: str, data: dict) -> tuple[str, str]:
    """Construire les contenus texte et HTML d'un email."""
    lines = [f"{key.capitalize()}: {value}" for key, value in data.items()]
    text_body = f"{title}\n\n" + "\n".join(lines) + "\n"

    html_lines = [f"<tr><td style='padding: 4px 8px; font-family: Arial, sans-serif;'><strong>{key.capitalize()}</strong></td><td style='padding: 4px 8px; font-family: Arial, sans-serif;'>{value}</td></tr>" for key, value in data.items()]
    html_body = f"""
    <html>
      <body style='font-family: Arial, sans-serif; font-size: 14px; color: #111;'>
        <h2>{title}</h2>
        <table style='border-collapse: collapse; width: 100%;'>
          {''.join(html_lines)}
        </table>
      </body>
    </html>
    """

    return text_body, html_body


def send_notification_email(subject: str, body_text: str, body_html: str | None = None, to_email: str | None = None) -> bool:
    """Envoie une notification email au destinataire configuré."""
    recipient = to_email or EMAIL_TO

    if not SMTP_USER or not SMTP_PASS:
        print('WARNING: SMTP credentials are manquantes, email non envoyé.')
        return False

    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = EMAIL_FROM or SMTP_USER
        msg['To'] = recipient

        msg.attach(MIMEText(body_text, 'plain'))
        if body_html:
            msg.attach(MIMEText(body_html, 'html'))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as smtp:
            if SMTP_USE_TLS:
                smtp.starttls()
            smtp.login(SMTP_USER, SMTP_PASS)
            smtp.sendmail(msg['From'], recipient, msg.as_string())

        return True
    except Exception as error:
        print(f"Erreur envoi email: {error}")
        return False
