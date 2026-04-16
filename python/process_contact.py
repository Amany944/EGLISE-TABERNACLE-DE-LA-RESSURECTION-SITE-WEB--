#!/usr/bin/env python3
"""
========================================================
SCRIPT PYTHON - TRAITEMENT DES CONTACTS
ÉGLISE TABERNACLE DE LA RÉSURRECTION
========================================================

Ce script traite les données du formulaire de contact.
Il enregistre les informations et peut envoyer des emails.

Fonctionnalités :
- Validation des données
- Enregistrement dans un fichier JSON
- Envoi d'email (optionnel avec smtplib)
- Logging des interactions utilisateur

Inspiration : Sites modernes comme Compassion et ICC Brazzaville
utilisent des backends qui traitent les formulaires de contact
de manière sécurisée et suivent les interactions utilisateur.
"""

import json
import sys
import os
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuration
CONTACTS_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'contacts.json')
LOGS_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'logs.json')

# Assurer que le dossier data existe
os.makedirs(os.path.dirname(CONTACTS_FILE), exist_ok=True)

def load_contacts():
    """Charge les contacts existants depuis le fichier JSON"""
    try:
        with open(CONTACTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        print("Erreur: Fichier contacts.json corrompu", file=sys.stderr)
        return []

def save_contacts(contacts):
    """Sauvegarde les contacts dans le fichier JSON"""
    with open(CONTACTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(contacts, f, indent=2, ensure_ascii=False)

def load_logs():
    """Charge les logs existants"""
    try:
        with open(LOGS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []

def save_logs(logs):
    """Sauvegarde les logs"""
    with open(LOGS_FILE, 'w', encoding='utf-8') as f:
        json.dump(logs, f, indent=2, ensure_ascii=False)

def log_interaction(action, data, ip):
    """Log une interaction utilisateur"""
    logs = load_logs()
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'action': action,
        'ip': ip,
        'data': data
    }
    logs.append(log_entry)
    save_logs(logs)

def send_email_notification(contact_data):
    """
    Envoie une notification par email (optionnel)
    Configurez les variables SMTP selon vos besoins
    """
    try:
        # Configuration SMTP (à adapter)
        SMTP_SERVER = "smtp.gmail.com"
        SMTP_PORT = 587
        SMTP_USERNAME = "votre-email@gmail.com"
        SMTP_PASSWORD = "votre-mot-de-passe"

        # Création du message
        msg = MIMEMultipart()
        msg['From'] = SMTP_USERNAME
        msg['To'] = "contact@tabernacle-resurrection.com"
        msg['Subject'] = f"Nouveau message de contact: {contact_data['subject']}"

        body = f"""
        Nouveau message de contact reçu :

        Nom: {contact_data['name']}
        Email: {contact_data['email']}
        Téléphone: {contact_data['phone']}
        Sujet: {contact_data['subject']}

        Message:
        {contact_data['message']}

        Reçu le: {contact_data['timestamp']}
        """

        msg.attach(MIMEText(body, 'plain'))

        # Envoi de l'email
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()

        return True
    except Exception as e:
        print(f"Erreur envoi email: {e}", file=sys.stderr)
        return False

def validate_contact_data(data):
    """Valide les données du contact"""
    required_fields = ['name', 'email', 'subject', 'message']
    for field in required_fields:
        if field not in data or not data[field].strip():
            return False, f"Champ {field} manquant ou vide"

    # Validation email basique
    if '@' not in data['email'] or '.' not in data['email']:
        return False, "Email invalide"

    return True, "Données valides"

def process_contact(contact_data):
    """Traite les données du formulaire de contact"""
    try:
        # Validation
        is_valid, error_msg = validate_contact_data(contact_data)
        if not is_valid:
            return {
                'success': False,
                'error': error_msg
            }

        # Chargement des contacts existants
        contacts = load_contacts()

        # Ajout du nouveau contact
        contact_entry = {
            'id': len(contacts) + 1,
            'timestamp': contact_data['timestamp'],
            'name': contact_data['name'],
            'email': contact_data['email'],
            'phone': contact_data['phone'],
            'subject': contact_data['subject'],
            'message': contact_data['message'],
            'status': 'nouveau'  # nouveau, traité, répondu
        }

        contacts.append(contact_entry)
        save_contacts(contacts)

        # Log de l'interaction
        log_interaction('contact_form', {
            'contact_id': contact_entry['id'],
            'subject': contact_data['subject']
        }, contact_data.get('ip', 'unknown'))

        # Envoi d'email (optionnel)
        email_sent = send_email_notification(contact_data)

        return {
            'success': True,
            'contact_id': contact_entry['id'],
            'email_sent': email_sent,
            'message': 'Contact traité avec succès'
        }

    except Exception as e:
        print(f"Erreur traitement contact: {e}", file=sys.stderr)
        return {
            'success': False,
            'error': f"Erreur interne: {str(e)}"
        }

def main():
    """Fonction principale"""
    try:
        # Lecture des données JSON depuis stdin
        input_data = sys.stdin.read()
        contact_data = json.loads(input_data)

        # Traitement
        result = process_contact(contact_data)

        # Sortie JSON
        print(json.dumps(result, ensure_ascii=False))

    except json.JSONDecodeError:
        print(json.dumps({
            'success': False,
            'error': 'Données JSON invalides'
        }))
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': f"Erreur inattendue: {str(e)}"
        }))

if __name__ == "__main__":
    main()