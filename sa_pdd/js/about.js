// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections for animation
const animatedElements = document.querySelectorAll(
    '.tech-card, .disease-card, .stat-card, .process-step, .future-card, .value-card'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Animate stats on scroll
const statCards = document.querySelectorAll('.stat-card');
const animateStats = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValue = entry.target.querySelector('.stat-value');
            const finalValue = statValue.textContent;
            
            // Only animate numbers
            if (finalValue.includes('%')) {
                animateNumber(statValue, parseFloat(finalValue), '%');
            } else if (finalValue.includes('K+')) {
                animateNumber(statValue, parseInt(finalValue), 'K+');
            } else if (finalValue.includes('s')) {
                // Skip animation for time values
                statValue.textContent = finalValue;
            } else if (finalValue.includes('/')) {
                // Skip animation for 24/7
                statValue.textContent = finalValue;
            }
            
            observer.unobserve(entry.target);
        }
    });
};

const statsObserver = new IntersectionObserver(animateStats, {
    threshold: 0.5
});

statCards.forEach(card => {
    statsObserver.observe(card);
});

// Number animation function
const animateNumber = (element, target, suffix) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 30);
};

// Highlight active section in navigation
const sections = document.querySelectorAll('section[id]');
const highlightNav = () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', highlightNav);

// Add scroll effect to navbar
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Check if user is logged in
const checkAuthStatus = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || 'null');
    const loginBtn = document.querySelector('.btn-login');
    
    if (user && user.token && loginBtn) {
        loginBtn.textContent = 'Dashboard';
        loginBtn.href = 'diagnosis.html';
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    
    // Add entrance animation to hero
    const hero = document.querySelector('.hero-about');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            hero.style.transition = 'opacity 1s ease, transform 1s ease';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
});