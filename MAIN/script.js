/**
 * ============================================================
 * FICHIER JAVASCRIPT - TABERNACLE DE LA RÉSURRECTION
 * ============================================================
 * 
 * Ce fichier gère les interactions dynamiques du site web
 * pour l'Église Tabernacle de la Résurrection
 * 
 * Fonctionnalités principales :
 * - Gestion du menu mobile
 * - Animations au défilement
 * - Validation des formulaires
 * - Interactions utilisateur
 */

// ============================================================
// 1. GESTION DU MENU MOBILE (RESPONSIVE)
// ============================================================

/**
 * Fonction pour gérer l'ouverture/fermeture du menu mobile
 * Cette fonction s'exécute au chargement du page
 */
document.addEventListener('DOMContentLoaded', function () {
    // Récupérer les éléments du DOM
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Vérifier que les éléments existent
    if (!menuBtn || !mobileMenu) {
        console.log('Les éléments du menu mobile n\'ont pas été trouvés');
        return;
    }

    /**
     * Événement : Clic sur le bouton menu burger
     * Bascule la visibilité du menu mobile
     */
    menuBtn.addEventListener('click', function () {
        // Ajouter/Retirer la classe 'hidden' pour afficher/masquer le menu
        mobileMenu.classList.toggle('hidden');
        
        // Animation de l'icône (optionnel)
        if (mobileMenu.classList.contains('hidden')) {
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        } else {
            menuBtn.innerHTML = '<i class="fas fa-xmark"></i>';
        }
    });

    /**
     * Événement : Fermer le menu au clic sur un lien
     * Lorsqu'on clique sur un lien de navigation, le menu se ferme automatiquement
     */
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.add('hidden');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
});

// ============================================================
// 2. ANIMATIONS AU DÉFILEMENT (SCROLL ANIMATIONS)
// ============================================================

/**
 * Fonction pour animer les éléments au défilement
 * Les éléments avec la classe fade-in-up s'animent quand ils deviennent visibles
 */
function observeElements() {
    // Options pour l'observateur d'intersection
    const options = {
        threshold: 0.1, // L'animation démarre quand 10% de l'élément est visible
        rootMargin: '0px 0px -100px 0px' // Décale le point d'activation
    };

    /**
     * Créer un IntersectionObserver
     * Pour exécuter des animations quand les éléments entrent dans la vue
     */
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            // Si l'élément est visible
            if (entry.isIntersecting) {
                // Ajouter la classe d'animation
                entry.target.style.animation = getAnimationStyle(entry.target.classList);
                
                // Arrêter d'observer cet élément (animation un fois)
                observer.unobserve(entry.target);
            }
        });
    }, options);

    /**
     * Observer tous les éléments avec classes d'animation
     */
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Fonction pour définir le style d'animation selon la classe
 */
function getAnimationStyle(classList) {
    if (classList.contains('fade-in-up')) {
        return 'fadeInUp 0.8s ease-out forwards';
    } else if (classList.contains('fade-in')) {
        return 'fadeIn 0.8s ease-in-out forwards';
    } else if (classList.contains('slide-in-left')) {
        return 'slideInLeft 0.8s ease-out forwards';
    } else if (classList.contains('slide-in-right')) {
        return 'slideInRight 0.8s ease-out forwards';
    }
    return 'none';
}

// Lancer les animations au chargement du DOM
document.addEventListener('DOMContentLoaded', observeElements);

// ============================================================
// 3. VALIDATION ET GESTION DU FORMULAIRE DE CONTACT
// ============================================================

/**
 * Fonction pour valider le formulaire de contact
 * Avant d'envoyer le formulaire, on vérifie que tous les champs sont valides
 */
function validateContactForm() {
    const form = document.querySelector('form');
    
    if (!form) {
        console.log('Formulaire non trouvé');
        return;
    }

    /**
     * Événement : Avant d'envoyer le formulaire (submit)
     */
    form.addEventListener('submit', function (event) {
        // Récupérer les valeurs des champs
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        let isValid = true;
        let errorMessage = '';

        /**
         * Vérifications des champs
         */

        // Vérifier le nom (minimum 3 caractères)
        if (name.length < 3) {
            isValid = false;
            errorMessage += '• Le nom doit avoir au moins 3 caractères\n';
        }

        // Vérifier l'email (format valide)
        const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegexp.test(email)) {
            isValid = false;
            errorMessage += '• L\'email n\'est pas valide\n';
        }

        // Vérifier le sujet (minimum 5 caractères)
        if (subject.length < 5) {
            isValid = false;
            errorMessage += '• Le sujet doit avoir au moins 5 caractères\n';
        }

        // Vérifier le message (minimum 10 caractères)
        if (message.length < 10) {
            isValid = false;
            errorMessage += '• Le message doit avoir au moins 10 caractères\n';
        }

        /**
         * Si le formulaire n'est pas valide, afficher un message d'erreur
         */
        if (!isValid) {
            event.preventDefault(); // Empêcher l'envoi
            alert('Veuillez corriger les erreurs suivantes :\n\n' + errorMessage);
            return false;
        }

        /**
         * Si le formulaire est valide, afficher un message de succès
         * Note : Vous devez configurer votre endpoint Formspree
         */
        alert('Merci pour votre message ! Nous vous répondrons très bientôt.');
    });
}

// Lancer la validation du formulaire
document.addEventListener('DOMContentLoaded', validateContactForm);

// ============================================================
// 4. EFFET DE DÉFILEMENT SMOOTH (SMOOTH SCROLL)
// ============================================================

/**
 * Fonction pour gérer le défilement fluide vers les sections
 * Quand on clique sur un lien de navigation, on défile vers la section
 */
function setupSmoothScroll() {
    // Sélectionner tous les liens avec des ancres (#)
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (event) {
            // Récupérer l'ID de la cible
            const targetId = this.getAttribute('href');

            // Vérifier que ce n'est pas juste un "#"
            if (targetId === '#') return;

            // Récupérer l'élément cible
            const targetElement = document.querySelector(targetId);

            // Si l'élément existe, défiler vers lui
            if (targetElement) {
                event.preventDefault(); // Empêcher le comportement par défaut
                
                // Défiler avec une animation smooth
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Lancer le défilement smooth
document.addEventListener('DOMContentLoaded', setupSmoothScroll);

// ============================================================
// 5. FOND DE PAGE ACTIF LORS DU DÉFILEMENT
// ============================================================

/**
 * Fonction pour surligner le lien de navigation actif
 * Selon la section en cours de lecture
 */
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    window.addEventListener('scroll', () => {
        let currentSection = '';

        // Vérifier quelle section est visible
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        // Mettre à jour les liens actifs
        navLinks.forEach(link => {
            const linkTarget = link.getAttribute('href').substring(1);

            if (linkTarget === currentSection) {
                link.classList.add('font-bold', 'text-blue-600');
            } else {
                link.classList.remove('font-bold', 'text-blue-600');
            }
        });
    });
}

// Note : Cette fonction est optionnelle, à activer selon vos préférences
// highlightActiveNavLink();

// ============================================================
// 6. GESTION DES ÉVÉNEMENTS DE FENÊTRE (WINDOW)
// ============================================================

/**
 * Événement : Fermer le menu mobile au redimensionnement de la fenêtre
 * Si la fenêtre dépasse 768px (breakpoint md), masquer le menu mobile
 */
window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuBtn = document.getElementById('menu-btn');
        
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
        if (menuBtn) {
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
});

// ============================================================
// 7. HELPERS ET FONCTIONS UTILITAIRES
// ============================================================

/**
 * Fonction pour afficher une notification (toast)
 * Utilisée pour donner des retours à l'utilisateur
 */
function showNotification(message, type = 'success', duration = 3000) {
    // Créer l'élément notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        animation: fadeIn 0.5s ease-in-out;
    `;

    // Définir les couleurs selon le type
    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
        notification.style.color = 'white';
    } else if (type === 'warning') {
        notification.style.backgroundColor = '#f59e0b';
        notification.style.color = 'white';
    }

    // Ajouter la notification au DOM
    document.body.appendChild(notification);

    // Retirer la notification après la durée spécifiée
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease-in-out';
        setTimeout(() => notification.remove(), 500);
    }, duration);
}

/**
 * Fonction pour logger les informations (mode développement)
 */
function debugLog(message, data = null) {
    if (window.DEBUG_MODE) {
        console.log(`[DEBUG] ${message}`, data || '');
    }
}

// ============================================================
// 8. INITIALISATION GÉNÉRALE
// ============================================================

/**
 * Fonction d'initialisation générale
 * Exécutée quand la page est complètement chargée
 */
window.addEventListener('load', function () {
    console.log('✓ Site Tabernacle de la Résurrection chargé avec succès');
    console.log('✓ Toutes les animations et interactions sont actives');
});

// ============================================================
// FIN DU SCRIPT JAVASCRIPT
// ============================================================
