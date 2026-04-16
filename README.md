# 🏰 Site Web - Tabernacle de la Résurrection

## 📖 Vue d'ensemble

Site web moderne et responsive pour l'**Église Tabernacle de la Résurrection** basée à Brazzaville, République du Congo. Le site présente les services de l'église, les témoignages de guérison, et permet aux visiteurs de prendre contact facilement.

---

## 📁 Structure du projet

```
EGLISE TABERNACLE DE LA RESSURECTION SITE WEB/
├── MAIN/
│   ├── index.html          # Fichier HTML principal (toutes les sections)
│   ├── style.css           # Styles CSS personnalisés et animations
│   ├── script.js           # Interactions JavaScript
│   ├── prompt.txt          # Les spécifications du projet
│   └── README.md           # Ce fichier
├── CSS/                    # Dossier pour les fichiers CSS supplémentaires
├── JS/                     # Dossier pour les fichiers JavaScript supplémentaires
└── images/                 # Images du projet
    ├── LOGO TDR.jpg        # Logo de l'église
    ├── PASTEUR DEVANT LA CHAIR.jpg
    └── PASTEUR EN CHAIR EN VESTE NOIR OK.jpg
```

---

## 🎨 Caractéristiques du design

### **Couleurs principales**
- **Blanc** : Couleur de base (fond)
- **Bleu** (#2563eb) : Couleur secondaire (accents, boutons, liens)
- **Gris** : Textes et contenus

### **Sections du site**

1. **Header/Navigation** - Logo et menu de navigation sticky
2. **Accueil** - Section de présentation avec image
3. **Qui sommes-nous** - Information sur l'église et le Pasteur
4. **Notre Mission** - 3 cartes avec les missions principales
5. **Les Témoignages** - 6 témoignages de guérison et transformation
6. **Nous Contacter** - Formulaire de contact + infos de localisation
7. **Footer** - Liens rapides et réseaux sociaux

---

## 🚀 Comment démarrer

### **Prérequis**
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Un éditeur de code (VS Code recommandé)
- Une connexion Internet (pour Tailwind CSS CDN)

### **Installation locale**

1. **Ouvrir le fichier HTML**
   - Double-cliquez sur `index.html` pour ouvrir le site dans votre navigateur
   - **OU** Utilisez un serveur local (voir ci-dessous)

2. **Serveur local (recommandé)**
   - **Avec VS Code** : Utilisez l'extension "Live Server"
   - **Avec Python** : 
     ```bash
     python -m http.server 8000
     # Puis ouvrez http://localhost:8000
     ```
   - **Avec Node.js** :
     ```bash
     npx http-server
     ```

---

## 📦 Technologies utilisées

### **Frontend**
- **HTML5** : Structure sémantique de la page
- **Tailwind CSS** : Framework CSS (version CDN)
- **CSS3** : Animations personnalisées et styles avancés
- **JavaScript (ES6)** : Interactions dynamiques

### **Icons et Fonts**
- **Font Awesome 6** : Icônes vectorielles
- **Google Fonts** : (Optionnel) - Intégration de polices personnalisées

---

## 📖 Explication du code pour développeurs juniors

### **1. FICHIER HTML (index.html)**

Le HTML est structuré en sections avec des commentaires clairs :

```html
<!-- ============================================================
     HEADER / NAVIGATION
     ============================================================ -->
```

**Chaque section contient :**
- **ID unique** : Pour permettre la navigation vers cette section
- **Classes Tailwind** : Pour le responsive design
- **Commentaires** : Expliquant la structure

**Utilisation de Tailwind :**
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
  <!-- grid-cols-1 : 1 colonne sur mobile -->
  <!-- md:grid-cols-2 : 2 colonnes sur tablette+ -->
  <!-- gap-8 : Espacement entre les éléments -->
</div>
```

### **2. FICHIER CSS (style.css)**

Le CSS contient :

**Animations personnalisées :**
```css
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Utilisation dans le HTML */
<div class="fade-in">Contenu</div>
```

**Responsive Design :**
```css
@media (max-width: 768px) {
    /* Styles pour les petits écrans */
    h1 { font-size: 1.5rem; }
}
```

**Effets au survol :**
```css
.card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}
```

### **3. FICHIER JAVASCRIPT (script.js)**

Le JavaScript gère les interactions :

**Menu mobile :**
```javascript
// Récupérer le bouton menu et le menu
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

// Écouter le clic sur le bouton
menuBtn.addEventListener('click', function () {
    // Basculer l'affichage du menu
    mobileMenu.classList.toggle('hidden');
});
```

**Animations au défilement :**
```javascript
// Observer les éléments quand ils entrent en vue
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Déclencher l'animation
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }
    });
});
```

**Validation du formulaire :**
```javascript
// Vérifier les champs du formulaire
form.addEventListener('submit', function (event) {
    if (name.length < 3) {
        alert('Le nom est trop court');
        event.preventDefault(); // Empêcher l'envoi
    }
});
```

---

## 🔧 Configuration Tailwind CSS

Le site utilise **Tailwind CSS via CDN**. Si vous voulez installer Tailwind localement :

```bash
# 1. Installer les dépendances depuis package.json
npm install

# 2. Créer le fichier de configuration si nécessaire
npx tailwindcss init

# 3. Compiler le CSS localement
npx tailwindcss -i ./input.css -o ./CSS/tailwind.css --watch
```

---

## 📝 Ajouter du contenu

### **Modifier le texte**
Ouvrez `index.html` et cherchez le texte que vous voulez modifier :
```html
<h1 class="text-4xl font-bold text-blue-600">
    Bienvenue au Tabernacle de la Résurrection
</h1>
```

### **Ajouter une image**
```html
<img src="../images/votre-image.jpg" alt="Description" class="rounded-lg shadow-lg">
```

### **Ajouter un témoignage**
Dupliquez une carte de témoignage et modifiez le contenu :
```html
<div class="bg-white rounded-lg shadow-lg p-8">
    <p class="text-gray-700">Votre témoignage ici...</p>
    <p class="font-semibold text-gray-800">Nom de la personne</p>
</div>
```

---

## 📞 Informations de contact

- **Téléphone/WhatsApp** : +242 06 984 2607
- **Adresse** : P13 Lot Parcelle 240 SONACO, MOUKONDO, Brazzaville
- **Facebook** : tabernacle de la resurection

---

## 🌐 Déploiement en ligne

### **Options de déploiement gratuit :**

1. **Netlify**
   - Connecter votre repository GitHub
   - Netlify déploiera automatiquement les changements

2. **GitHub Pages**
   - Pousser le code sur GitHub
   - Activer GitHub Pages dans les réglages

3. **Vercel**
   - Importer le projet depuis GitHub
   - Configuration automatique

### **Exemple avec Netlify :**
```bash
# 1. Installer Netlify CLI
npm install -g netlify-cli

# 2. Déployer le site
netlify deploy --prod
```

---

## ✨ Astuces pour améliorer le site

### **1. Ajouter Google Analytics**
```html
<!-- Dans le <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_ID');
</script>
```

### **2. Optimiser les images**
```bash
# Utiliser TinyPNG pour réduire la taille
# https://tinypng.com
```

### **3. Ajouter un blog**
Créer un fichier `blog.html` et ajouter les articles

### **4. Intégrer les réseaux sociaux**
```html
<a href="https://www.facebook.com/[username]">
    <i class="fab fa-facebook"></i> Facebook
</a>
```

---

## 🐛 Dépannage

### **Le site ne s'affiche pas correctement**
- Vérifier que tous les fichiers sont dans le même dossier
- Actualiser la page (F5 ou Ctrl+Shift+R)
- Vérifier la console du navigateur (F12) pour les erreurs

### **Les images ne s'affichent pas**
- Vérifier que le chemin des images est correct : `../images/nom-image.jpg`
- Vérifier que l'image existe dans le dossier `/images/`

### **Le formulaire ne fonctionne pas**
- Créer un compte Formspree : https://formspree.io
- Remplacer `YOUR_FORM_ID` par votre ID Formspree dans le HTML

### **Le menu mobile ne fonctionne pas**
- Vérifier que `script.js` est chargé correctement
- Ouvrir la console (F12) et chercher les erreurs JavaScript

---

## 📚 Ressources et documentation

- **Tailwind CSS** : https://tailwindcss.com/docs
- **MDN Web Docs** : https://developer.mozilla.org
- **Font Awesome Icons** : https://fontawesome.com/icons
- **CSS Animations** : https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations
- **JavaScript** : https://javascript.info

---

## 📄 Licence

Ce projet est créé pour l'Église Tabernacle de la Résurrection. Tous droits réservés.

---

## 👨‍💻 Développé par

Site web moderne avec un code claire et commenté pour faciliter la compréhension et la maintenance par les développeurs juniors.

---

## 🙏 Notes importantes

- Le site est complètement **responsive** et fonctionne sur tous les appareils
- Tous les liens externes sont directement connectés (Facebook, WhatsApp)
- Les animations sont fluides et n'impactent pas les performances
- Le code est produit avec des commentaires détaillés en français

---

## ✅ Checklist avant mise en ligne

- [ ] Vérifier tous les liens (navigation, formulaire, réseaux)
- [ ] Tester sur mobile, tablette et desktop
- [ ] Vérifier les images s'affichent correctement
- [ ] Configurer le formulaire avec Formspree
- [ ] Activer la compression GZIP sur le serveur
- [ ] Ajouter un favicon
- [ ] Mettre à jour les meta tags (description, og:image)
- [ ] Tester la vitesse du site (PageSpeed Insights)
- [ ] Mettre en place un certificat SSL (HTTPS)

---

**Bon développement ! 🚀**
