#!/usr/bin/env python3
"""
========================================================
API REST MODERNE - ÉGLISE TABERNACLE DE LA RÉSURRECTION
========================================================

API REST moderne basée sur FastAPI avec architecture
professionnelle, modèles Pydantic, validation, et
documentation Swagger automatique.

Technologies:
- FastAPI: Framework web moderne et performant
- Pydantic: Validation et sérialisation des données
- Uvicorn: Serveur web ASGI
- JSON: Stockage des données
"""

from fastapi import FastAPI, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional, List
import json
import os
from pathlib import Path
from email_utils import build_email_content, send_notification_email

# ============================================================
# CONFIGURATION DE L'APPLICATION
# ============================================================

app = FastAPI(
    title="API Tabernacle de la Résurrection",
    description="API REST moderne pour la gestion des contacts, prières et inscriptions",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dossier de stockage des données
DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

# ============================================================
# MODÈLES PYDANTIC - VALIDATION DES DONNÉES
# ============================================================

class ContactBase(BaseModel):
    """Modèle de base pour les contacts"""
    name: str = Field(..., min_length=2, max_length=100, description="Nom du contact")
    email: EmailStr = Field(..., description="Adresse email valide")
    phone: Optional[str] = Field(None, max_length=20, description="Numéro de téléphone")
    subject: str = Field(..., min_length=3, max_length=200, description="Sujet du message")
    message: str = Field(..., min_length=10, max_length=5000, description="Contenu du message")

    @validator('name')
    def validate_name(cls, v):
        """Valider que le nom ne contient que des caractères valides"""
        if not v or not v.replace(' ', '').replace('-', '').isalpha():
            raise ValueError('Le nom doit contenir uniquement des lettres')
        return v.strip()

    @validator('subject', 'message')
    def strip_whitespace(cls, v):
        """Nettoyer les espaces inutiles"""
        return v.strip()

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Jean Dupont",
                "email": "jean@example.com",
                "phone": "+225 01 02 03 04",
                "subject": "Demande d'information",
                "message": "Bonjour, j'aimerais avoir plus d'informations..."
            }
        }

class Contact(ContactBase):
    """Modèle complet pour un contact avec métadonnées"""
    id: int
    timestamp: datetime
    status: str = "nouveau"
    ip_address: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "Jean Dupont",
                "email": "jean@example.com",
                "phone": "+225 01 02 03 04",
                "subject": "Demande d'information",
                "message": "Bonjour, j'aimerais avoir plus d'informations...",
                "timestamp": "2026-04-15T17:45:00",
                "status": "nouveau",
                "ip_address": "192.168.1.1"
            }
        }

class ContactResponse(BaseModel):
    """Réponse pour la création d'un contact"""
    success: bool
    contact_id: int
    message: str
    timestamp: str

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "contact_id": 1,
                "message": "Votre message a été enregistré avec succès",
                "timestamp": "2026-04-15T17:45:00"
            }
        }

class PrayerBase(BaseModel):
    """Modèle de base pour les prières"""
    name: str = Field(..., min_length=2, max_length=100, description="Nom de la personne")
    email: EmailStr = Field(..., description="Adresse email")
    request: str = Field(..., min_length=10, max_length=1000, description="Demande de prière")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Marie Martin",
                "email": "marie@example.com",
                "request": "Prière pour la guérison de ma mère"
            }
        }

class Prayer(PrayerBase):
    """Modèle complet pour une prière"""
    id: int
    timestamp: datetime
    category: str
    status: str = "active"
    prayer_count: int = 0

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "Marie Martin",
                "email": "marie@example.com",
                "request": "Prière pour la guérison de ma mère",
                "timestamp": "2026-04-15T17:50:00",
                "category": "santé",
                "status": "active",
                "prayer_count": 0
            }
        }

class EventRegistrationBase(BaseModel):
    """Modèle de base pour les inscriptions aux événements"""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    event_id: str = Field(..., description="ID de l'événement")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Pierre Dubois",
                "email": "pierre@example.com",
                "phone": "+225 06 07 08 09",
                "event_id": "1"
            }
        }

class EventRegistration(EventRegistrationBase):
    """Modèle complet pour une inscription"""
    id: int
    timestamp: datetime
    event_name: str
    status: str = "confirmed"

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "Pierre Dubois",
                "email": "pierre@example.com",
                "phone": "+225 06 07 08 09",
                "event_id": "1",
                "event_name": "Culte Dominical",
                "timestamp": "2026-04-15T16:00:00",
                "status": "confirmed"
            }
        }

class Event(BaseModel):
    """Modèle pour les événements"""
    id: str
    name: str
    capacity: int
    registered: int

# ============================================================
# FONCTIONS UTILITAIRES POUR LA GESTION DES DONNÉES
# ============================================================

def load_json_file(filename: str, default: list | dict = None):
    """Charger un fichier JSON"""
    filepath = DATA_DIR / filename
    try:
        if filepath.exists():
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
    except (json.JSONDecodeError, IOError):
        pass
    return default if default is not None else []

def save_json_file(filename: str, data):
    """Sauvegarder un fichier JSON"""
    filepath = DATA_DIR / filename
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False, default=str)

def categorize_prayer(request: str) -> str:
    """Catégoriser automatiquement une prière basée sur les mots-clés"""
    categories = {
        'santé': ['maladie', 'guérison', 'médecin', 'hôpital', 'cancer', 'malade'],
        'famille': ['famille', 'enfant', 'parent', 'mariage', 'divorce', 'frère', 'sœur'],
        'travail': ['travail', 'emploi', 'carrière', 'argent', 'finances', 'business'],
        'spirituel': ['foi', 'prière', 'dieu', 'esprit', 'bénédiction', 'église'],
    }
    
    request_lower = request.lower()
    for category, keywords in categories.items():
        if any(keyword in request_lower for keyword in keywords):
            return category
    return 'autre'

# ============================================================
# ROUTES - CONTACTS
# ============================================================

@app.post(
    "/api/contacts",
    response_model=ContactResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Contacts"],
    summary="Créer un nouveau contact",
    description="Soumet un formulaire de contact et l'enregistre"
)
async def create_contact(contact: ContactBase, background_tasks: BackgroundTasks):
    """
    **Créer un nouveau contact**
    
    Ce endpoint permet aux utilisateurs de soumettre un formulaire de contact.
    
    - **name**: Nom de la personne (2-100 caractères)
    - **email**: Adresse email valide
    - **phone**: Numéro de téléphone (optionnel)
    - **subject**: Sujet du message (3-200 caractères)
    - **message**: Contenu du message (10-5000 caractères)
    """
    try:
        contacts = load_json_file('contacts.json', [])
        
        contact_dict = contact.dict()
        contact_dict['id'] = len(contacts) + 1
        contact_dict['timestamp'] = datetime.now().isoformat()
        contact_dict['status'] = 'nouveau'
        
        contacts.append(contact_dict)
        save_json_file('contacts.json', contacts)

        background_tasks.add_task(
            send_notification_email,
            f"Nouveau message de contact: {contact_dict['subject']}",
            *build_email_content('Nouveau message de contact', {
                'nom': contact_dict['name'],
                'email': contact_dict['email'],
                'téléphone': contact_dict.get('phone', ''),
                'sujet': contact_dict['subject'],
                'message': contact_dict['message'],
                'timestamp': contact_dict['timestamp']
            })
        )
        
        return ContactResponse(
            success=True,
            contact_id=contact_dict['id'],
            message="Votre message a été enregistré avec succès. Nous vous répondrons bientôt.",
            timestamp=contact_dict['timestamp']
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'enregistrement du contact: {str(e)}"
        )

@app.get(
    "/api/contacts",
    response_model=List[Contact],
    tags=["Contacts"],
    summary="Récupérer tous les contacts",
    description="Récupère la liste de tous les contacts enregistrés"
)
async def get_contacts():
    """Récupérer tous les contacts"""
    contacts = load_json_file('contacts.json', [])
    return contacts

@app.get(
    "/api/contacts/{contact_id}",
    response_model=Contact,
    tags=["Contacts"],
    summary="Récupérer un contact spécifique"
)
async def get_contact(contact_id: int):
    """Récupérer un contact par son ID"""
    contacts = load_json_file('contacts.json', [])
    for contact in contacts:
        if contact['id'] == contact_id:
            return contact
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Contact avec l'ID {contact_id} non trouvé"
    )

# ============================================================
# ROUTES - PRIÈRES
# ============================================================

@app.post(
    "/api/prayers",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    tags=["Prières"],
    summary="Créer une demande de prière",
    description="Enregistre une nouvelle demande de prière"
)
async def create_prayer(prayer: PrayerBase, background_tasks: BackgroundTasks):
    """
    **Créer une demande de prière**
    
    Ce endpoint permet aux utilisateurs de soumettre une demande de prière.
    La prière sera catégorisée automatiquement.
    """
    try:
        prayers = load_json_file('prayers.json', [])
        
        prayer_dict = prayer.dict()
        prayer_dict['id'] = len(prayers) + 1
        prayer_dict['timestamp'] = datetime.now().isoformat()
        prayer_dict['category'] = categorize_prayer(prayer.request)
        prayer_dict['status'] = 'active'
        prayer_dict['prayer_count'] = 0
        
        prayers.append(prayer_dict)
        save_json_file('prayers.json', prayers)

        background_tasks.add_task(
            send_notification_email,
            f"Nouvelle demande de prière de {prayer_dict['name']}",
            *build_email_content('Nouvelle demande de prière', {
                'nom': prayer_dict['name'],
                'email': prayer_dict['email'],
                'demande': prayer_dict['request'],
                'catégorie': prayer_dict['category'],
                'timestamp': prayer_dict['timestamp']
            })
        )
        
        return {
            'success': True,
            'prayer_id': prayer_dict['id'],
            'category': prayer_dict['category'],
            'message': 'Votre demande de prière a été enregistrée'
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'enregistrement de la prière: {str(e)}"
        )

@app.get(
    "/api/prayers",
    response_model=List[Prayer],
    tags=["Prières"],
    summary="Récupérer toutes les prières"
)
async def get_prayers(category: Optional[str] = None, status: Optional[str] = None):
    """
    **Récupérer les demandes de prière**
    
    Peut être filtré par catégorie ou statut
    """
    prayers = load_json_file('prayers.json', [])
    
    if category:
        prayers = [p for p in prayers if p.get('category') == category]
    if status:
        prayers = [p for p in prayers if p.get('status') == status]
    
    return prayers

@app.get(
    "/api/prayers/{prayer_id}",
    response_model=Prayer,
    tags=["Prières"]
)
async def get_prayer(prayer_id: int):
    """Récupérer une prière spécifique par son ID"""
    prayers = load_json_file('prayers.json', [])
    for prayer in prayers:
        if prayer['id'] == prayer_id:
            return prayer
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Prière avec l'ID {prayer_id} non trouvée"
    )

# ============================================================
# ROUTES - ÉVÉNEMENTS ET INSCRIPTIONS
# ============================================================

@app.get(
    "/api/events",
    response_model=List[Event],
    tags=["Événements"],
    summary="Récupérer les événements disponibles"
)
async def get_events():
    """Récupérer tous les événements disponibles"""
    events = load_json_file('events.json', {})
    if isinstance(events, dict):
        return [Event(id=k, **v) for k, v in events.items()]
    return []

@app.post(
    "/api/registrations",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    tags=["Inscriptions"],
    summary="Créer une inscription à un événement"
)
async def create_registration(registration: EventRegistrationBase, background_tasks: BackgroundTasks):
    """
    **Créer une inscription à un événement**
    
    Permet aux utilisateurs de s'inscrire à un événement
    """
    try:
        registrations = load_json_file('registrations.json', [])
        events = load_json_file('events.json', {})
        
        # Vérifier que l'événement existe
        if registration.event_id not in events:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Événement {registration.event_id} non trouvé"
            )
        
        event = events[registration.event_id]
        
        # Vérifier la capacité
        if event['registered'] >= event['capacity']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cet événement est complet"
            )
        
        # Vérifier si déjà inscrit
        for reg in registrations:
            if reg['email'] == registration.email and reg['event_id'] == registration.event_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Vous êtes déjà inscrit à cet événement"
                )
        
        reg_dict = registration.dict()
        reg_dict['id'] = len(registrations) + 1
        reg_dict['timestamp'] = datetime.now().isoformat()
        reg_dict['event_name'] = event['name']
        reg_dict['status'] = 'confirmed'
        
        registrations.append(reg_dict)
        save_json_file('registrations.json', registrations)
        
        # Mettre à jour le compteur
        event['registered'] += 1
        save_json_file('events.json', events)

        background_tasks.add_task(
            send_notification_email,
            f"Nouvelle inscription à {event['name']}",
            *build_email_content('Nouvelle inscription événement', {
                'nom': reg_dict['name'],
                'email': reg_dict['email'],
                'téléphone': reg_dict.get('phone', ''),
                'événement': reg_dict['event_name'],
                'timestamp': reg_dict['timestamp']
            })
        )
        
        return {
            'success': True,
            'registration_id': reg_dict['id'],
            'event_name': event['name'],
            'message': 'Inscription confirmée'
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'inscription: {str(e)}"
        )

@app.get(
    "/api/registrations",
    response_model=List[EventRegistration],
    tags=["Inscriptions"],
    summary="Récupérer toutes les inscriptions"
)
async def get_registrations():
    """Récupérer toutes les inscriptions"""
    return load_json_file('registrations.json', [])

# ============================================================
# ROUTES - SANTÉ ET STATS
# ============================================================

@app.get(
    "/api/health",
    tags=["Santé"],
    summary="Vérifier l'état de l'API"
)
async def health():
    """Vérifier que l'API fonctionne correctement"""
    return {
        "status": "ok",
        "message": "API Tabernacle de la Résurrection en ligne",
        "timestamp": datetime.now().isoformat()
    }

@app.get(
    "/api/stats",
    tags=["Statistiques"],
    summary="Récupérer les statistiques"
)
async def get_stats():
    """Récupérer les statistiques globales"""
    contacts = load_json_file('contacts.json', [])
    prayers = load_json_file('prayers.json', [])
    registrations = load_json_file('registrations.json', [])
    
    # Catégories de prières
    prayer_categories = {}
    for prayer in prayers:
        category = prayer.get('category', 'autre')
        prayer_categories[category] = prayer_categories.get(category, 0) + 1
    
    return {
        "total_contacts": len(contacts),
        "total_prayers": len(prayers),
        "total_registrations": len(registrations),
        "prayer_categories": prayer_categories,
        "timestamp": datetime.now().isoformat()
    }

# ============================================================
# ROUTE RACINE
# ============================================================

@app.get("/", tags=["Info"])
async def root():
    """Endpoint racine"""
    return {
        "app": "API REST Tabernacle de la Résurrection",
        "version": "1.0.0",
        "docs": "/api/docs",
        "redoc": "/api/redoc"
    }

# ============================================================
# DÉMARRAGE DE L'APPLICATION
# ============================================================

if __name__ == "__main__":
    import uvicorn
    print("🚀 API REST démarrée sur http://localhost:8000")
    print("📚 Documentation Swagger sur http://localhost:8000/api/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)