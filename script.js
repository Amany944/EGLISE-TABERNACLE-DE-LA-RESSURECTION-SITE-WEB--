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
    
    // ============================================================
    // 3. SCROLL SMOOTH VERS LES SECTIONS
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
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
    // 6. FORMULAIRE DE CONTACT
    // ============================================================
    const contactForm = document.querySelector('form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Vérification basique avant submission
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !message) {
                e.preventDefault();
                alert('Veuillez remplir tous les champs obligatoires.');
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
    
    // ============================================================
    // 7. EFFECTER UN DÉCALAGE DES CARTES DE TÉMOIGNAGES
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
