# Backend - Église Tabernacle de la Résurrection

## Description

Ce backend moderne et créatif a été conçu pour gérer toutes les interactions utilisateur du site web de l'Église Tabernacle de la Résurrection. Il utilise des technologies simples et faciles à prendre en main tout en étant à jour avec les pratiques modernes de développement backend.

## Technologies Utilisées

- **Node.js** avec **Express.js** : Serveur web rapide et léger
- **Python** : Traitement des données et tâches spécialisées
- **JSON** : Stockage des données utilisateur
- **CORS** et **Helmet** : Sécurité moderne

## Fonctionnalités

### Gestion des Formulaires
- **Formulaire de Contact** : Validation, enregistrement et notification par email
- **Demandes de Prière** : Soumission et suivi des prières
- **Inscriptions aux Événements** : Gestion des capacités et confirmations

### Interactions Utilisateur
- Suivi de toutes les actions utilisateur (logs)
- Validation des données en temps réel
- Réponses JSON structurées

### Sécurité
- Protection contre les attaques XSS et CSRF
- Validation des emails et données
- Logs des interactions pour audit

## Architecture

```
backend/
├── server.js              # Serveur Express principal
├── package.json           # Dépendances Node.js
├── python/                # Scripts Python
│   ├── process_contact.py
│   ├── process_prayer.py
│   └── process_registration.py
└── data/                  # Stockage des données
    ├── contacts.json
    ├── prayers.json
    ├── registrations.json
    └── logs.json
```

## Installation

1. **Installer Node.js** (version 16+ recommandée)
2. **Installer Python** (version 3.8+ recommandée)
3. **Cloner ou télécharger le projet**
4. **Installer les dépendances :**
   ```bash
   npm install
   ```
5. **Démarrer le serveur :**
   ```bash
   npm start
   ```
   Ou en mode développement :
   ```bash
   npm run dev
   ```

## Configuration

### Variables d'Environnement
Créer un fichier `.env` à la racine :
```
PORT=3000
NODE_ENV=development
SMTP_USERNAME=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe
```

### Configuration Python
Les scripts Python utilisent des chemins relatifs. Assurez-vous que Python 3 est installé et accessible via `python3`.

## API Endpoints

### POST /api/contact
Soumission du formulaire de contact.

**Corps de la requête :**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "+225 01 02 03 04 05",
  "subject": "Demande d'information",
  "message": "Contenu du message"
}
```

### POST /api/prayer-request
Soumission d'une demande de prière.

**Corps de la requête :**
```json
{
  "name": "Marie Martin",
  "email": "marie@example.com",
  "request": "Prière pour la guérison de ma mère"
}
```

### POST /api/event-registration
Inscription à un événement.

**Corps de la requête :**
```json
{
  "name": "Pierre Dubois",
  "email": "pierre@example.com",
  "phone": "+225 06 07 08 09 10",
  "eventId": "1"
}
```

## Inspiration

Ce backend s'inspire des meilleures pratiques des sites modernes d'églises :

- **Compassion** : Gestion des dons et interactions communautaires
- **ICC Brazzaville** : Systèmes d'inscription et suivi des membres

## Sécurité

- **Helmet** : Protection contre les vulnérabilités web courantes
- **CORS** : Contrôle des origines des requêtes
- **Validation** : Vérification des données utilisateur
- **Logs** : Suivi de toutes les interactions

## Développement

### Scripts Disponibles
- `npm start` : Démarrage en production
- `npm run dev` : Démarrage avec rechargement automatique

### Structure des Données
Toutes les données sont stockées en JSON pour la simplicité :
- `contacts.json` : Messages de contact
- `prayers.json` : Demandes de prière
- `registrations.json` : Inscriptions aux événements
- `logs.json` : Historique des interactions

## Contribution

Pour contribuer :
1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Push et créer une Pull Request

## Licence

MIT - Voir le fichier LICENSE pour plus de détails.

## Support

Pour toute question ou problème :
- Email : contact@tabernacle-resurrection.com
- Téléphone : +225 XX XX XX XX XX

---

*Développé avec ❤️ pour l'Église Tabernacle de la Résurrection*