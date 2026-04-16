# API REST Moderne - Église Tabernacle de la Résurrection

## 🚀 Vue d'ensemble

API REST moderne et professionelle basée sur **FastAPI** pour la gestion complète des interactions de l'église avec :
- Architecture professionnelle et scalable
- Validation des données avec Pydantic
- Documentation interactive Swagger/OpenAPI
- Gestion d'erreurs robuste
- Types Python pour la sécurité

## 🎯 Caractéristiques Modernes

### ✅ Framework FastAPI
- Framework web ultra-rapide du monde Python
- Performance comparable à Node.js et Go
- Documentation automatique Swagger/OpenAPI
- Validation de données intégrée
- Async/await natif

### ✅ Modèles Pydantic
```python
class ContactBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str]
    subject: str
    message: str
```
- Validation stricte et type-safe
- Sérialisation/désérialisation automatique
- Documentation automatique des endpoints

### ✅ API RESTful Moderne
- Codes de statut HTTP appropriés
- Réponses JSON structurées
- Gestion d'erreurs complète
- Filtrage et pagination
- Pagination des résultats

## 📦 Installation

### 1. Installer Python 3.8+
```bash
python3 --version
```

### 2. Installer les dépendances
```bash
cd "api-rest"
pip install -r requirements.txt
```

Variables d'environnement requises :
```bash
# requirements.txt inclut :
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
python-multipart==0.0.6
```

### 3. Démarrer l'API
```bash
python3 main.py
```

L'API sera accessible sur :
- **Serveur** : http://localhost:8000
- **Documentation Swagger** : http://localhost:8000/api/docs
- **Documentation ReDoc** : http://localhost:8000/api/redoc
- **OpenAPI JSON** : http://localhost:8000/api/openapi.json

## 📚 Endpoints de l'API

### Contacts

#### POST /api/contacts
**Créer un nouveau contact**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "+225 01 02 03 04",
  "subject": "Demande d'information",
  "message": "Message détaillé..."
}
```
- Validation de l'email avec EmailStr
- Longueur minimale/maximale des champs
- Validation du format du nom

#### GET /api/contacts
**Récupérer tous les contacts**

#### GET /api/contacts/{contact_id}
**Récupérer un contact spécifique**

### Prières

#### POST /api/prayers
**Créer une demande de prière**
```json
{
  "name": "Marie Martin",
  "email": "marie@example.com",
  "request": "Prière pour la guérison de ma mère..."
}
```
- Catégorisation automatique
- Validation stricte des données

#### GET /api/prayers
**Récupérer les demandes de prière**
- Filtrage par catégorie : `?category=santé`
- Filtrage par statut : `?status=active`

#### GET /api/prayers/{prayer_id}
**Récupérer une prière spécifique**

### Événements

#### GET /api/events
**Récupérer les événements disponibles**

### Inscriptions

#### POST /api/registrations
**Créer une inscription à un événement**
```json
{
  "name": "Pierre Dubois",
  "email": "pierre@example.com",
  "phone": "+225 06 07 08 09",
  "event_id": "1"
}
```
- Vérification de la capacité
- Prévention des doublons

#### GET /api/registrations
**Récupérer toutes les inscriptions**

### Santé et Statistiques

#### GET /api/health
**Vérifier l'état de l'API**

#### GET /api/stats
**Récupérer les statistiques globales**

## 🏗️ Architecture Moderne

### Structure des fichiers
```
api-rest/
├── main.py              # Application FastAPI principale
├── config.py            # Configuration centralisée
├── requirements.txt     # Dépendances Python
└── README.md           # Documentation
```

### Modèles Pydantic
```
Validation des données :
├── ContactBase → Contact → ContactResponse
├── PrayerBase → Prayer
├── EventRegistrationBase → EventRegistration
└── Event
```

### Couches de l'application
```
FastAPI App
    ↓
Routes/Endpoints
    ↓
Modèles Pydantic (Validation)
    ↓
Utilitaires JSON
    ↓
Fichiers JSON (Stockage)
```

## 🔒 Sécurité

- **Validation stricte** : Pydantic valide tous les inputs
- **CORS** : Configuration sécurisée
- **Types Python** : Sécurité au compilateur
- **Email validation** : EmailStr pour vérifier les emails
- **Gestion d'erreurs** : Messages d'erreur explicites

## ⚡ Performance

FastAPI offre des performances exceptionnelles :
- **Async/await natif** : Gestion efficace des requêtes
- **Validation optimisée** : Pydantic en Rust (très rapide)
- **Uvicorn** : Serveur ASGI ultra-performant
- **Temps de réponse** : < 100ms pour la plupart des requêtes

## 📊 Réponses Structurées

### Succès
```json
{
  "success": true,
  "contact_id": 1,
  "message": "Votre message a été enregistré",
  "timestamp": "2026-04-15T17:45:00"
}
```

### Erreur
```json
{
  "detail": "Erreur descriptive et utile"
}
```

## 🧪 Tests

### Test avec curl
```bash
# Créer un contact
curl -X POST "http://localhost:8000/api/contacts" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Test",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Message de test très long..."
  }'

# Récupérer tous les contacts
curl "http://localhost:8000/api/contacts"

# Vérifier la santé
curl "http://localhost:8000/api/health"

# Récupérer les stats
curl "http://localhost:8000/api/stats"
```

### Test avec Python
```python
import requests

# Créer un contact
response = requests.post(
    "http://localhost:8000/api/contacts",
    json={
        "name": "Jean Test",
        "email": "test@example.com",
        "subject": "Test",
        "message": "Message de test..."
    }
)
print(response.json())
```

## 📈 Avantages par rapport à Express/Node.js

| Aspect | FastAPI | Express |
|--------|---------|---------|
| Type Safety | ✅ Excellent | ❌ Moyen |
| Validation | ✅ Intégrée | ❌ Manuelle |
| Documentation | ✅ Auto Swagger | ❌ Manuel |
| Performance | ✅ Comparable | ✅ Similaire |
| Async | ✅ Natif | ✅ Possible |
| Apprentissage | ✅ Facile | ✅ Facile |

## 🚀 Déploiement

### Production avec Uvicorn
```bash
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Avec Gunicorn + Uvicorn
```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python3", "main.py"]
```

## 📝 Conventions

- **Endpoints** : `/api/{resource}`
- **Méthodes** : GET, POST, PUT, DELETE
- **Codes HTTP** : 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Error
- **Format** : JSON avec camelCase pour les réponses
- **Documentation** : Docstrings pour chaque route

## 🎓 Inspirations Modernes

Inspiré des meilleures pratiques :
- Django REST Framework (Python)
- FastAPI Starlette (Framework moderne)
- OpenAPI 3.0 Standard
- RESTful Architecture Patterns
- Microservices Best Practices

## 💡 Points Clés

1. **Modern Stack** : FastAPI + Pydantic + Uvicorn
2. **Type Safety** : Python type hints partout
3. **Validation** : Complète et intégrée
4. **Documentation** : Automatique et interactive
5. **Performance** : Ultra-rapide et scalable
6. **Sécurité** : CORS, validation, gestion d'erreurs
7. **Facilité** : Simple à comprendre et maintenir

## 📞 Support

Pour toute question ou problème :
- Email : contact@tabernacle-resurrection.com
- Téléphone : +225 XX XX XX XX XX

---

**Développé avec FastAPI pour l'Église Tabernacle de la Résurrection** 🙏