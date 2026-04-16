// ============================================================
// SCRIPT JAVASCRIPT - Tabernacle de la Résurrection
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================================
    // 1. MENU BURGER / MENU MOBILE
    // ============================================================
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Mise à jour de aria-expanded pour l'accessibilité
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', !isExpanded);
            
            // Changement d'icône (optionnel)
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        
        // Fermer le menu mobile au clic sur un lien
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                menuBtn.setAttribute('aria-expanded', 'false');
                
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }
    
    // ============================================================
    // 2. ANIMATIONS AU DÉFILEMENT (Intersection Observer)
    // ============================================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments avec les classes d'animation
    document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => {
        observer.observe(el);
    });
    
    const API_BASE_URL = 'http://localhost:8000/api';

    // ============================================================
    // 3. SCROLL SMOOTH VERS LES SECTIONS
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = window.pageYOffset + targetElement.getBoundingClientRect().top - headerHeight - 16;

                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    menuBtn.setAttribute('aria-expanded', 'false');

                    const icon = menuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
                
                window.scrollTo({
                    top: Math.max(targetPosition, 0),
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================================
    // 4. ANIMATION DU HEADER AU SCROLL
    // ============================================================
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Ajouter une ombre au header quand on scroll
        if (scrollTop > 10) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    // ============================================================
    // 5. COMPTEUR ANIMÉ (Optionnel - pour les statistiques)
    // ============================================================
    function animateCounter(element, target, duration = 2000) {
        let current = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    // ============================================================
    // 6. FORMULAIRE DE CONTACT AVEC BACKEND
    // ============================================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Empêcher la soumission par défaut

            // Récupérer les valeurs des champs
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };

            // Validation côté client
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                showMessage('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }

            // Validation email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(formData.email)) {
                showMessage('Veuillez entrer une adresse email valide.', 'error');
                return;
            }

            // Désactiver le bouton pendant l'envoi
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Envoi en cours...';

            try {
                // Envoyer les données au backend
                const response = await fetch(`${API_BASE_URL}/contacts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    showMessage(result.message, 'success');
                    contactForm.reset(); // Vider le formulaire
                } else {
                    showMessage(result.message || 'Une erreur est survenue.', 'error');
                }

            } catch (error) {
                console.error('Erreur lors de l\'envoi:', error);
                showMessage('Erreur de connexion. Veuillez réessayer.', 'error');
            } finally {
                // Réactiver le bouton
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });

        // Validation en temps réel des champs
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const email = this.value.trim();
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (email && !emailPattern.test(email)) {
                    this.style.borderColor = '#ef4444';
                    this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                } else {
                    this.style.borderColor = '#d1d5db';
                    this.style.boxShadow = '';
                }
            });
        }
    }

    // Fonction pour afficher les messages
    function showMessage(message, type) {
        // Supprimer les messages existants
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Créer le nouveau message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message p-4 rounded-lg mb-6 ${
            type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
        }`;
        messageDiv.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>${message}`;

        // Insérer le message avant le formulaire
        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(messageDiv, form);

        // Faire défiler vers le message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Supprimer le message après 5 secondes
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
    
    // ============================================================
    // 7. EFFECTUER UN DÉCALAGE DES CARTES DE TÉMOIGNAGES
    // ============================================================
    const testimonyCards = document.querySelectorAll('#temoignages .bg-gradient-to-br');
    testimonyCards.forEach((card, index) => {
        card.style.animationDelay = (index * 0.1) + 's';
    });
    
    // ============================================================
    // 8. BOUTONS INTERACTIFS - AJOUT DE FEEDBACK
    // ============================================================
    document.querySelectorAll('button, a.bg-blue-600, a.bg-green-500').forEach(button => {
        button.addEventListener('click', function() {
            // Ajouter une animation de click
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    // ============================================================
    // 9. SCROLL TO TOP BUTTON (Optionnel)
    // ============================================================
    function createScrollToTopButton() {
        const scrollButton = document.createElement('button');
        scrollButton.id = 'scrollToTop';
        scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            z-index: 99;
            font-size: 18px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(scrollButton);
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollButton.style.display = 'flex';
                scrollButton.style.alignItems = 'center';
                scrollButton.style.justifyContent = 'center';
            } else {
                scrollButton.style.display = 'none';
            }
        });
        
        scrollButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        scrollButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#1d4ed8';
            this.style.transform = 'scale(1.1)';
        });
        
        scrollButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#2563eb';
            this.style.transform = 'scale(1)';
        });
    }
    
    createScrollToTopButton();
    
    // ============================================================
    // 10. DÉTECTER LES LIENS EXTERNES ET LES OUVRIR DANS UN NOUVEL ONGLET
    // ============================================================
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
    
    // ============================================================
    // 11. ANIMATION DES ÉTOILES DES TÉMOIGNAGES
    // ============================================================
    document.querySelectorAll('.fas.fa-star').forEach((star, index) => {
        star.style.opacity = '0';
        star.style.animation = `starFadeIn 0.5s ease forwards ${index * 0.1}s`;
    });
    
    // ============================================================
    // 12. INDICATEUR DE SECTION ACTIVE (Optionnel)
    // ============================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-blue-600', 'border-blue-600');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('text-blue-600', 'border-blue-600');
            }
        });
    });
    
    // ============================================================
    // 13. MISE À JOUR DE L'ANNÉE DU COPYRIGHT
    // ============================================================
    const copyrightElement = document.getElementById('copyright');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = `&copy; ${currentYear} Tabernacle de la Résurrection. Tous droits réservés.`;
    }
    
    // ============================================================
    // 14. GESTION DU MODE THÈME
    // ============================================================
    const lightModeBtn = document.getElementById('light-mode-btn');
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const themeDetails = document.querySelector('details');
    
    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        if (themeDetails) {
            themeDetails.open = false;
        }
    }
    
    if (lightModeBtn) {
        lightModeBtn.addEventListener('click', function() {
            setTheme('light');
        });
    }
    
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', function() {
            setTheme('dark');
        });
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        setTheme('dark');
    } else if (savedTheme === 'light') {
        setTheme('light');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
    
    document.addEventListener('click', function(event) {
        if (themeDetails && !themeDetails.contains(event.target)) {
            themeDetails.open = false;
        }
    });
    
    console.log('✅ JavaScript chargé avec succès - Tabernacle de la Résurrection');
});

// ============================================================
// STYLE POUR LES ANIMATIONS (injecter via script)
// ============================================================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes starFadeIn {
        from {
            opacity: 0;
            transform: scale(0.5);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .fade-in.animate {
        animation: fadeIn 1s ease-in-out forwards;
    }
    
    .fade-in-up.animate {
        animation: fadeInUp 1s ease-in-out forwards;
    }
    
    #scrollToTop:hover {
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
    }
    
    /* Smooth scroll behavior */
    html {
        scroll-behavior: smooth;
    }
`;
document.head.appendChild(style);
