"""
========================================================
CONFIGURATION - API REST
ÉGLISE TABERNACLE DE LA RÉSURRECTION
========================================================

Fichier de configuration centralisé pour l'API
"""

import os
from pathlib import Path

# Chemins
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
API_DIR = BASE_DIR / "api-rest"

# Créer les répertoires s'ils n'existent pas
DATA_DIR.mkdir(exist_ok=True)

# Configuration de l'API
API_CONFIG = {
    "title": "API Tabernacle de la Résurrection",
    "version": "1.0.0",
    "description": "API REST moderne pour la gestion des interactions de l'église",
    "host": "0.0.0.0",
    "port": 8000,
    "debug": True
}

# Configuration CORS
CORS_CONFIG = {
    "allow_origins": ["*"],
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}

# Événements par défaut
DEFAULT_EVENTS = {
    "1": {
        "name": "Culte Dominical",
        "capacity": 200,
        "registered": 0
    },
    "2": {
        "name": "Étude Biblique",
        "capacity": 50,
        "registered": 0
    },
    "3": {
        "name": "Séminaire de Prière",
        "capacity": 100,
        "registered": 0
    },
    "4": {
        "name": "Réunion de Jeunesse",
        "capacity": 80,
        "registered": 0
    }
}

# Fichiers de données
DATA_FILES = {
    "contacts": "contacts.json",
    "prayers": "prayers.json",
    "registrations": "registrations.json",
    "events": "events.json",
    "logs": "logs.json"
}

# Catégories de prières
PRAYER_CATEGORIES = {
    "santé": ["maladie", "guérison", "médecin", "hôpital", "cancer"],
    "famille": ["famille", "enfant", "parent", "mariage", "divorce"],
    "travail": ["travail", "emploi", "carrière", "argent", "finances"],
    "spirituel": ["foi", "prière", "dieu", "esprit", "bénédiction"],
}

# Limites de validation
VALIDATION_LIMITS = {
    "name_min": 2,
    "name_max": 100,
    "email_max": 120,
    "phone_max": 20,
    "subject_min": 3,
    "subject_max": 200,
    "message_min": 10,
    "message_max": 5000,
    "prayer_request_min": 10,
    "prayer_request_max": 1000,
}