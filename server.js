/**
 * ============================================================
 * SERVEUR BACKEND - ÉGLISE TABERNACLE DE LA RÉSURRECTION
 * ============================================================
 *
 * Ce serveur Express.js gère le backend du site web de l'église.
 * Il sert les fichiers statiques, gère les formulaires de contact,
 * et intègre des scripts Python pour des tâches spécifiques.
 *
 * Technologies utilisées :
 * - Node.js avec Express pour le serveur web
 * - Python pour l'envoi d'emails et le traitement des données
 * - Sécurité avec Helmet et CORS
 *
 * Fonctionnalités :
 * - Service des fichiers statiques (HTML, CSS, JS, images)
 * - Gestion du formulaire de contact
 * - API pour les interactions utilisateur
 * - Intégration Python pour les tâches avancées
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');
const { spawn } = require('child_process');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * CONFIGURATION DE SÉCURITÉ ET MIDDLEWARE
 */

// Sécurité de base avec Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com", "https://formspree.io"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
}));

// Gestion des CORS pour les requêtes cross-origin
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://votredomaine.com' : '*',
  credentials: true
}));

// Parser pour les données JSON et URL-encoded
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

/**
 * SERVICE DES FICHIERS STATIQUES
 */

// Servir les fichiers statiques depuis le répertoire racine
app.use(express.static(path.join(__dirname)));

// Route spécifique pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * API POUR LES INTERACTIONS UTILISATEUR
 */

// Route pour le formulaire de contact
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation des données
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis.'
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Adresse email invalide.'
      });
    }

    // Préparation des données pour Python
    const contactData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      ip: req.ip
    };

    // Appel du script Python pour traiter le contact
    const pythonResult = await runPythonScript('process_contact.py', contactData);

    if (pythonResult.success) {
      res.json({
        success: true,
        message: 'Votre message a été envoyé avec succès. Nous vous répondrons bientôt.'
      });
    } else {
      throw new Error(pythonResult.error);
    }

  } catch (error) {
    console.error('Erreur lors du traitement du contact:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue. Veuillez réessayer plus tard.'
    });
  }
});

// Route pour les demandes de prière
app.post('/api/prayer-request', async (req, res) => {
  try {
    const { name, email, request } = req.body;

    if (!name || !email || !request) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires.'
      });
    }

    const prayerData = {
      name: name.trim(),
      email: email.trim(),
      request: request.trim(),
      timestamp: new Date().toISOString()
    };

    // Traitement avec Python
    const pythonResult = await runPythonScript('process_prayer.py', prayerData);

    res.json({
      success: true,
      message: 'Votre demande de prière a été enregistrée.'
    });

  } catch (error) {
    console.error('Erreur lors du traitement de la demande de prière:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement de votre demande.'
    });
  }
});

// Route pour les inscriptions aux événements
app.post('/api/event-registration', async (req, res) => {
  try {
    const { name, email, phone, eventId } = req.body;

    if (!name || !email || !eventId) {
      return res.status(400).json({
        success: false,
        message: 'Informations incomplètes.'
      });
    }

    const registrationData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      eventId: eventId,
      timestamp: new Date().toISOString()
    };

    const pythonResult = await runPythonScript('process_registration.py', registrationData);

    res.json({
      success: true,
      message: 'Inscription enregistrée avec succès.'
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription.'
    });
  }
});

/**
 * FONCTIONS UTILITAIRES
 */

/**
 * Exécute un script Python avec des données JSON
 * @param {string} scriptName - Nom du script Python
 * @param {object} data - Données à passer au script
 * @returns {Promise<object>} Résultat du script
 */
function runPythonScript(scriptName, data) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [scriptName], {
      cwd: path.join(__dirname, 'python'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // Envoyer les données JSON au script Python
    pythonProcess.stdin.write(JSON.stringify(data));
    pythonProcess.stdin.end();

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(stdout.trim());
          resolve(result);
        } catch (error) {
          resolve({ success: true, message: stdout.trim() });
        }
      } else {
        reject(new Error(`Script Python échoué: ${stderr}`));
      }
    });

    pythonProcess.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * MIDDLEWARE POUR LES ERREURS
 */

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Page non trouvée'
  });
});

// Gestion des erreurs générales
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});

/**
 * DÉMARRAGE DU SERVEUR
 */

app.listen(PORT, () => {
  console.log(`🚀 Serveur backend de l'Église Tabernacle de la Résurrection démarré`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📧 Contact: contact@tabernacle-resurrection.com`);
  console.log(`🔒 Sécurité activée avec Helmet et CORS`);
});

module.exports = app;