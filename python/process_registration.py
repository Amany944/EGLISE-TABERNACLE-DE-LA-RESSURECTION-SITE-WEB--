#!/usr/bin/env python3
"""
========================================================
SCRIPT PYTHON - TRAITEMENT DES INSCRIPTIONS ÉVÉNEMENTS
ÉGLISE TABERNACLE DE LA RÉSURRECTION
========================================================

Ce script gère les inscriptions aux événements de l'église.
Il permet de suivre les participants et gérer les capacités.

Fonctionnalités :
- Inscription aux événements
- Gestion des capacités
- Suivi des participants
- Notifications

Inspiration : Sites modernes d'églises offrent des systèmes
d'inscription en ligne pour événements, formations, etc.
"""

import json
import sys
import os
from datetime import datetime

# Configuration
REGISTRATIONS_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'registrations.json')
EVENTS_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'events.json')

# Assurer que le dossier data existe
os.makedirs(os.path.dirname(REGISTRATIONS_FILE), exist_ok=True)

def load_registrations():
    """Charge les inscriptions existantes"""
    try:
        with open(REGISTRATIONS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []

def save_registrations(registrations):
    """Sauvegarde les inscriptions"""
    with open(REGISTRATIONS_FILE, 'w', encoding='utf-8') as f:
        json.dump(registrations, f, indent=2, ensure_ascii=False)

def load_events():
    """Charge les événements disponibles"""
    try:
        with open(EVENTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        # Événements par défaut
        return {
            '1': {'name': 'Culte Dominical', 'capacity': 200, 'registered': 0},
            '2': {'name': 'Étude Biblique', 'capacity': 50, 'registered': 0},
            '3': {'name': 'Séminaire de Prière', 'capacity': 100, 'registered': 0}
        }
    except json.JSONDecodeError:
        return {}

def save_events(events):
    """Sauvegarde les événements"""
    with open(EVENTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(events, f, indent=2, ensure_ascii=False)

def check_event_capacity(event_id, events):
    """Vérifie si l'événement a encore de la place"""
    if event_id not in events:
        return False, "Événement introuvable"

    event = events[event_id]
    if event['registered'] >= event['capacity']:
        return False, "Événement complet"

    return True, "Place disponible"

def process_registration(registration_data):
    """Traite une inscription à un événement"""
    try:
        events = load_events()
        registrations = load_registrations()

        # Vérification de la capacité
        can_register, message = check_event_capacity(registration_data['eventId'], events)
        if not can_register:
            return {
                'success': False,
                'error': message
            }

        # Vérification si déjà inscrit
        existing_registration = next(
            (r for r in registrations
             if r['email'] == registration_data['email'] and r['eventId'] == registration_data['eventId']),
            None
        )

        if existing_registration:
            return {
                'success': False,
                'error': 'Vous êtes déjà inscrit à cet événement'
            }

        # Création de l'inscription
        registration_entry = {
            'id': len(registrations) + 1,
            'timestamp': registration_data['timestamp'],
            'name': registration_data['name'],
            'email': registration_data['email'],
            'phone': registration_data['phone'],
            'eventId': registration_data['eventId'],
            'eventName': events[registration_data['eventId']]['name'],
            'status': 'confirmed'
        }

        registrations.append(registration_entry)
        save_registrations(registrations)

        # Mise à jour du compteur de l'événement
        events[registration_data['eventId']]['registered'] += 1
        save_events(events)

        return {
            'success': True,
            'registration_id': registration_entry['id'],
            'event_name': registration_entry['eventName'],
            'message': 'Inscription confirmée'
        }

    except Exception as e:
        return {
            'success': False,
            'error': f"Erreur inscription: {str(e)}"
        }

def main():
    """Fonction principale"""
    try:
        input_data = sys.stdin.read()
        registration_data = json.loads(input_data)

        result = process_registration(registration_data)
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