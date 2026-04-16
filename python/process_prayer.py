#!/usr/bin/env python3
"""
========================================================
SCRIPT PYTHON - TRAITEMENT DES DEMANDES DE PRIÈRE
ÉGLISE TABERNACLE DE LA RÉSURRECTION
========================================================

Ce script gère les demandes de prière soumises par les utilisateurs.
Il enregistre les demandes et peut les catégoriser.

Fonctionnalités :
- Enregistrement des demandes de prière
- Catégorisation automatique
- Suivi des demandes
- Génération de rapports

Inspiration : Les sites d'églises modernes comme Compassion
et ICC Brazzaville offrent des fonctionnalités de prière
en ligne avec suivi et communauté.
"""

import json
import sys
import os
from datetime import datetime

# Configuration
PRAYERS_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'prayers.json')

# Assurer que le dossier data existe
os.makedirs(os.path.dirname(PRAYERS_FILE), exist_ok=True)

def load_prayers():
    """Charge les demandes de prière existantes"""
    try:
        with open(PRAYERS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []

def save_prayers(prayers):
    """Sauvegarde les demandes de prière"""
    with open(PRAYERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(prayers, f, indent=2, ensure_ascii=False)

def categorize_prayer(request_text):
    """Catégorise automatiquement la demande de prière"""
    categories = {
        'santé': ['maladie', 'guérison', 'médecin', 'hôpital', 'cancer'],
        'famille': ['famille', 'enfant', 'parent', 'mariage', 'divorce'],
        'travail': ['travail', 'emploi', 'carrière', 'argent', 'finances'],
        'spirituel': ['foi', 'prière', 'dieu', 'esprit', 'bénédiction'],
        'autre': []
    }

    request_lower = request_text.lower()

    for category, keywords in categories.items():
        if category != 'autre':
            for keyword in keywords:
                if keyword in request_lower:
                    return category

    return 'autre'

def process_prayer(prayer_data):
    """Traite une demande de prière"""
    try:
        prayers = load_prayers()

        prayer_entry = {
            'id': len(prayers) + 1,
            'timestamp': prayer_data['timestamp'],
            'name': prayer_data['name'],
            'email': prayer_data['email'],
            'request': prayer_data['request'],
            'category': categorize_prayer(prayer_data['request']),
            'status': 'active',  # active, answered, archived
            'prayer_count': 0,  # nombre de personnes qui prient pour cette demande
            'responses': []  # témoignages de réponses
        }

        prayers.append(prayer_entry)
        save_prayers(prayers)

        return {
            'success': True,
            'prayer_id': prayer_entry['id'],
            'category': prayer_entry['category'],
            'message': 'Demande de prière enregistrée'
        }

    except Exception as e:
        return {
            'success': False,
            'error': f"Erreur traitement prière: {str(e)}"
        }

def main():
    """Fonction principale"""
    try:
        input_data = sys.stdin.read()
        prayer_data = json.loads(input_data)

        result = process_prayer(prayer_data)
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