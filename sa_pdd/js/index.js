// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger icon
        hamburger.classList.toggle('active');
    });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scroll for anchor links
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

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
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

// Observe all cards for animation
const animatedElements = document.querySelectorAll('.feature-card, .step-card, .disease-tag');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Check if user is logged in (from localStorage)
const checkAuthStatus = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const loginBtn = document.querySelector('.btn-login');
    
    if (user && loginBtn) {
        loginBtn.textContent = 'Logout';
        loginBtn.href = '#';
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
};

// Handle logout
const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.reload();
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});

// Add hover effect to buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});