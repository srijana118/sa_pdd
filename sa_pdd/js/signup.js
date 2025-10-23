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
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
});

toggleConfirmPassword.addEventListener('click', () => {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
    toggleConfirmPassword.textContent = type === 'password' ? '👁️' : '🙈';
});

// Form Validation Functions
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    
    return requirements;
};

const updatePasswordStrength = (password) => {
    const requirements = validatePassword(password);
    const validCount = Object.values(requirements).filter(Boolean).length;
    const strengthBar = document.getElementById('strengthBar');
    
    strengthBar.className = 'strength-bar';
    
    if (validCount <= 2) {
        strengthBar.classList.add('weak');
    } else if (validCount <= 4) {
        strengthBar.classList.add('medium');
    } else {
        strengthBar.classList.add('strong');
    }
};

const updatePasswordRequirements = (password) => {
    const requirements = validatePassword(password);
    
    document.getElementById('req-length').className = requirements.length ? 'valid' : '';
    document.getElementById('req-uppercase').className = requirements.uppercase ? 'valid' : '';
    document.getElementById('req-lowercase').className = requirements.lowercase ? 'valid' : '';
    document.getElementById('req-number').className = requirements.number ? 'valid' : '';
    document.getElementById('req-special').className = requirements.special ? 'valid' : '';
};

const isPasswordValid = (password) => {
    const requirements = validatePassword(password);
    return Object.values(requirements).every(Boolean);
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
document.getElementById('name').addEventListener('input', (e) => {
    const name = e.target.value.trim();
    if (name && name.length < 2) {
        showError('name', 'Name must be at least 2 characters');
    } else {
        clearError('name');
    }
});

document.getElementById('email').addEventListener('input', (e) => {
    const email = e.target.value.trim();
    if (email && !validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
    } else {
        clearError('email');
    }
});

document.getElementById('password').addEventListener('input', (e) => {
    const password = e.target.value;
    
    if (password) {
        updatePasswordStrength(password);
        updatePasswordRequirements(password);
        clearError('password');
    } else {
        document.getElementById('strengthBar').className = 'strength-bar';
    }
    
    // Check confirm password match
    const confirmPassword = confirmPasswordInput.value;
    if (confirmPassword && password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
    } else if (confirmPassword) {
        clearError('confirmPassword');
    }
});

document.getElementById('confirmPassword').addEventListener('input', (e) => {
    const password = passwordInput.value;
    const confirmPassword = e.target.value;
    
    if (confirmPassword && password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
    } else {
        clearError('confirmPassword');
    }
});

// Form Submission
const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearError('name');
    clearError('email');
    clearError('password');
    clearError('confirmPassword');
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    let isValid = true;
    
    if (!name) {
        showError('name', 'Name is required');
        isValid = false;
    } else if (name.length < 2) {
        showError('name', 'Name must be at least 2 characters');
        isValid = false;
    }
    
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
    } else if (!isPasswordValid(password)) {
        showError('password', 'Password does not meet all requirements');
        isValid = false;
    }
    
    if (!confirmPassword) {
        showError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    if (!agreeTerms) {
        showMessage('Please agree to the Terms of Service and Privacy Policy', 'error');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Disable submit button
    const submitButton = signupForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Creating Account...';
    
    try {
        // Simulate API call - Replace with actual backend endpoint
        const response = await registerUser(name, email, password);
        
        if (response.success) {
            showMessage('Account created successfully! Redirecting to login...', 'success');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showMessage(response.message || 'Registration failed. Please try again.', 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Create Account';
        }
    } catch (error) {
        console.error('Signup error:', error);
        showMessage('An error occurred. Please try again.', 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'Create Account';
    }
});

// Placeholder function for API call
async function registerUser(name, email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
        return {
            success: false,
            message: 'Email already registered. Please login or use a different email.'
        };
    }
    
    // Save user (for demo purposes)
    const newUser = {
        name,
        email,
        password, // In real app, password should be hashed on backend
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    return {
        success: true,
        message: 'Registration successful'
    };
    
    /* 
    // Actual API call example:
    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
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