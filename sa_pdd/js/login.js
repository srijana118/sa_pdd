// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Password Toggle
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
});

// Form Validation Functions
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const showError = (inputId, message) => {
    const errorElement = document.getElementById(`${inputId}Error`);
    const inputElement = document.getElementById(inputId);
    
    errorElement.textContent = message;
    inputElement.classList.add('invalid');
};

const clearError = (inputId) => {
    const errorElement = document.getElementById(`${inputId}Error`);
    const inputElement = document.getElementById(inputId);
    
    errorElement.textContent = '';
    inputElement.classList.remove('invalid');
};

const showMessage = (message, type) => {
    const messageArea = document.getElementById('messageArea');
    messageArea.textContent = message;
    messageArea.className = `message-area ${type}`;
    messageArea.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageArea.style.display = 'none';
    }, 5000);
};

// Real-time validation
document.getElementById('email').addEventListener('input', (e) => {
    const email = e.target.value.trim();
    if (email && !validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
    } else {
        clearError('email');
    }
});

document.getElementById('password').addEventListener('input', (e) => {
    if (e.target.value) {
        clearError('password');
    }
});

// Form Submission
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearError('email');
    clearError('password');
    
    // Get form values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validation
    let isValid = true;
    
    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!password) {
        showError('password', 'Password is required');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Disable submit button
    const submitButton = loginForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Logging in...';
    
    try {
        // Simulate API call - Replace with actual backend endpoint
        const response = await loginUser(email, password);
        
        if (response.success) {
            // Store user data
            const userData = {
                email: email,
                token: response.token,
                name: response.name
            };
            
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(userData));
            }
            
            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to diagnosis page after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'diagnosis.html';
            }, 1500);
        } else {
            showMessage(response.message || 'Invalid email or password', 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('An error occurred. Please try again.', 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
    }
});

// Placeholder function for API call
async function loginUser(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demonstration purposes, check against stored users
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        return {
            success: true,
            token: 'demo_token_' + Date.now(),
            name: user.name,
            email: user.email
        };
    }
    
    // If no users are registered, allow demo login
    if (email === 'demo@potato.ai' && password === 'Demo@123') {
        return {
            success: true,
            token: 'demo_token_' + Date.now(),
            name: 'Demo User',
            email: email
        };
    }
    
    return {
        success: false,
        message: 'Invalid email or password. Try demo@potato.ai / Demo@123'
    };
    
    /* 
    // Actual API call example:
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    
    return await response.json();
    */
}

// Check if already logged in
const checkAuthStatus = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || 'null');
    
    if (user && user.token) {
        // User is already logged in, redirect to diagnosis
        window.location.href = 'diagnosis.html';
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});