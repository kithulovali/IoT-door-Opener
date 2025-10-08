/**
 * Simple IoT Door Opener - Core Functions
 * Essential functionality with admin features and email notifications
 */

// Simple session check
function checkAuth() {
    const session = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
    if (!session && window.location.pathname.includes('user.html')) {
        window.location.href = 'login.html';
    }
    return !!session;
}

// Simple form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    return isValid;
}

function showFieldError(input, message) {
    const group = input.closest('.form-group');
    if (group) {
        group.classList.add('has-error');
        let errorDiv = group.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            group.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function clearFieldError(input) {
    const group = input.closest('.form-group');
    if (group) {
        group.classList.remove('has-error');
        const errorDiv = group.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }
}

// User Authentication
function handleLogin(username, password) {
    // Demo credentials
    if (username === 'demo' && password === 'demo123') {
        const sessionData = {
            user: { username: 'demo', fullName: 'Demo User', email: 'demo@example.com' },
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('userSession', JSON.stringify(sessionData));
        logAccess('demo', 'User Login');
        return true;
    }
    
    // Check custom users
    const users = getAllUsers();
    const user = users.find(u => 
        (u.username === username || u.email === username) && 
        (u.password === password || atob(u.passwordHash || '') === password)
    );
    
    if (user) {
        const sessionData = {
            user: { username: user.username, fullName: user.fullName, email: user.email },
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('userSession', JSON.stringify(sessionData));
        logAccess(user.username, 'User Login');
        return true;
    }
    
    return false;
}

function handleRegistration(userData) {
    const users = getAllUsers();
    
    // Check if username already exists
    if (users.find(u => u.username === userData.username || u.email === userData.email)) {
        return false;
    }
    
    // Add new user
    users.push({
        fullName: userData.fullName,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        photo: userData.photo || null,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    logAccess('System', `New user registered: ${userData.username}`);
    return true;
}

function getUserSession() {
    const session = localStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
}

// Admin Authentication
function handleAdminLogin(username, password) {
    if (username === 'admin' && password === 'admin123') {
        const adminSessionData = {
            admin: { username: 'admin', fullName: 'Administrator' },
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('adminSession', JSON.stringify(adminSessionData));
        logAccess('admin', 'Admin Login');
        return true;
    }
    return false;
}

function getAdminSession() {
    const session = localStorage.getItem('adminSession');
    return session ? JSON.parse(session) : null;
}

// User Management
function getAllUsers() {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
}

function addNewUser(userData) {
    return handleRegistration(userData);
}

function deleteUserAccount(username) {
    const users = getAllUsers();
    const filteredUsers = users.filter(u => u.username !== username);
    
    if (filteredUsers.length < users.length) {
        localStorage.setItem('registeredUsers', JSON.stringify(filteredUsers));
        logAccess('admin', `User deleted: ${username}`);
        return true;
    }
    return false;
}

function getActiveSessionsCount() {
    const userSession = getUserSession();
    const adminSession = getAdminSession();
    return (userSession ? 1 : 0) + (adminSession ? 1 : 0);
}

// Door Control
function toggleDoor() {
    const doorStatus = getDoorStatus();
    const newStatus = !doorStatus.locked;
    
    localStorage.setItem('doorStatus', JSON.stringify({
        locked: newStatus,
        lastChanged: new Date().toISOString()
    }));
    
    const session = getUserSession();
    const action = newStatus ? 'Door Locked' : 'Door Unlocked';
    const user = session ? session.user.username : 'Unknown';
    
    logAccess(user, action);
    sendEmailNotification(user, action);
    
    return newStatus;
}

function getDoorStatus() {
    const status = localStorage.getItem('doorStatus');
    return status ? JSON.parse(status) : { locked: true, lastChanged: new Date().toISOString() };
}

function lockDoor() {
    localStorage.setItem('doorStatus', JSON.stringify({
        locked: true,
        lastChanged: new Date().toISOString()
    }));
    
    const session = getUserSession();
    const user = session ? session.user.username : 'Unknown';
    logAccess(user, 'Door Locked');
    sendEmailNotification(user, 'Door Locked');
}

function unlockDoor() {
    localStorage.setItem('doorStatus', JSON.stringify({
        locked: false,
        lastChanged: new Date().toISOString()
    }));
    
    const session = getUserSession();
    const user = session ? session.user.username : 'Unknown';
    logAccess(user, 'Door Unlocked');
    sendEmailNotification(user, 'Door Unlocked');
}

// Access Logging
function logAccess(user, action) {
    const logs = getAccessLogs();
    const newLog = {
        timestamp: new Date().toLocaleString(),
        user: user,
        action: action,
        id: Date.now()
    };
    
    logs.push(newLog);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('accessLogs', JSON.stringify(logs));
}

function getAccessLogs() {
    const logs = localStorage.getItem('accessLogs');
    return logs ? JSON.parse(logs) : [];
}

function clearAccessLogs() {
    localStorage.setItem('accessLogs', JSON.stringify([]));
    logAccess('admin', 'Access logs cleared');
}

// Visitor Management
function addVisitor(name) {
    const visitors = getVisitors();
    const newVisitor = {
        id: Date.now(),
        name: name,
        timestamp: new Date().toLocaleString(),
        status: 'pending'
    };
    
    visitors.push(newVisitor);
    localStorage.setItem('visitors', JSON.stringify(visitors));
    
    logAccess('System', `New visitor: ${name}`);
    sendEmailNotification('System', `New visitor at door: ${name}`);
    
    return newVisitor;
}

function getVisitors() {
    const visitors = localStorage.getItem('visitors');
    return visitors ? JSON.parse(visitors) : [];
}

function approveVisitor(visitorId) {
    const visitors = getVisitors();
    const visitor = visitors.find(v => v.id === visitorId);
    
    if (visitor) {
        visitor.status = 'approved';
        localStorage.setItem('visitors', JSON.stringify(visitors));
        
        logAccess('System', `Visitor approved: ${visitor.name}`);
        sendEmailNotification('System', `Visitor approved: ${visitor.name}`);
        
        // Auto-unlock door for approved visitor
        unlockDoor();
        
        return true;
    }
    return false;
}

function denyVisitor(visitorId) {
    const visitors = getVisitors();
    const visitor = visitors.find(v => v.id === visitorId);
    
    if (visitor) {
        visitor.status = 'denied';
        localStorage.setItem('visitors', JSON.stringify(visitors));
        
        logAccess('System', `Visitor denied: ${visitor.name}`);
        sendEmailNotification('System', `Visitor denied: ${visitor.name}`);
        
        return true;
    }
    return false;
}

// Email Notification System
function sendEmailNotification(user, action) {
    const emailSettings = getEmailSettings();
    
    if (!emailSettings.enabled) {
        return false;
    }
    
    // Simulate email sending (in real implementation, this would call an email service)
    const emailData = {
        to: emailSettings.adminEmail,
        subject: `IoT Door Alert: ${action}`,
        body: `
            IoT Door System Alert
            
            User: ${user}
            Action: ${action}
            Time: ${new Date().toLocaleString()}
            
            This is an automated notification from your IoT Door Opener System.
        `,
        timestamp: new Date().toISOString()
    };
    
    // Store email in local storage for demonstration
    const sentEmails = getSentEmails();
    sentEmails.push(emailData);
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));
    
    console.log('📧 Email notification sent:', emailData);
    
    // Show notification to user
    showMessage(`📧 Email sent: ${action}`, 'success');
    
    return true;
}

function getEmailSettings() {
    const settings = localStorage.getItem('emailSettings');
    return settings ? JSON.parse(settings) : {
        adminEmail: 'admin@iotdoor.com',
        enabled: true
    };
}

function saveEmailNotificationSettings(email, enabled) {
    const settings = {
        adminEmail: email,
        enabled: enabled
    };
    localStorage.setItem('emailSettings', JSON.stringify(settings));
    logAccess('admin', 'Email settings updated');
    return true;
}

function getSentEmails() {
    const emails = localStorage.getItem('sentEmails');
    return emails ? JSON.parse(emails) : [];
}

// Camera Functions
function startCamera() {
    return navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.getElementById('videoFeed');
            if (video) {
                video.srcObject = stream;
                video.style.display = 'block';
            }
            return stream;
        })
        .catch(err => {
            console.error('Camera access error:', err);
            alert('Camera access denied. Please allow camera permissions.');
            return null;
        });
}

function stopCamera() {
    const video = document.getElementById('videoFeed');
    if (video && video.srcObject) {
        const stream = video.srcObject;
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        video.style.display = 'none';
    }
}

// Simple message display with enhanced animations and types
function showMessage(message, type = 'info', duration = 3000) {
    // Remove existing messages first
    const existingMessages = document.querySelectorAll('.toast-message');
    existingMessages.forEach(msg => msg.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    
    // Create toast content with icon
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        loading: '🔄'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-text">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="toast-progress"></div>
    `;
    
    // Enhanced styling
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        min-width: 300px;
        max-width: 400px;
        background: var(--white, #ffffff);
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border-left: 4px solid var(--primary-blue, #2563eb);
        overflow: hidden;
    `;
    
    // Type-specific styling
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        loading: '#6b7280'
    };
    
    if (colors[type]) {
        toast.style.borderLeftColor = colors[type];
    }
    
    document.body.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
    });
    
    // Auto remove with progress bar
    if (type !== 'loading' && duration > 0) {
        const progressBar = toast.querySelector('.toast-progress');
        progressBar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: ${colors[type] || colors.info};
            width: 100%;
            transform-origin: left;
            animation: progressShrink ${duration}ms linear;
        `;
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 400);
            }
        }, duration);
    }
    
    return toast;
}

// Enhanced button loading state
function setButtonLoading(buttonElement, loading = true, originalText = null) {
    if (loading) {
        buttonElement.dataset.originalText = originalText || buttonElement.textContent;
        buttonElement.innerHTML = `
            <span class="btn-spinner"></span>
            <span>Processing...</span>
        `;
        buttonElement.disabled = true;
        buttonElement.classList.add('btn-loading');
    } else {
        buttonElement.innerHTML = buttonElement.dataset.originalText || originalText || 'Submit';
        buttonElement.disabled = false;
        buttonElement.classList.remove('btn-loading');
    }
}

// Enhanced form validation with real-time feedback
function validateFormField(input) {
    const value = input.value.trim();
    const type = input.type;
    const required = input.hasAttribute('required');
    
    clearFieldError(input);
    
    if (required && !value) {
        showFieldError(input, 'This field is required');
        return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(input, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Password validation
    if (type === 'password' && value) {
        if (value.length < 6) {
            showFieldError(input, 'Password must be at least 6 characters');
            return false;
        }
    }
    
    // Username validation
    if (input.name === 'username' && value) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(value)) {
            showFieldError(input, 'Username must be 3-20 characters, letters, numbers, and underscore only');
            return false;
        }
    }
    
    // Show success state
    const group = input.closest('.form-group');
    if (group && value) {
        group.classList.add('has-success');
    }
    
    return true;
}

// Add animation styles
if (!document.getElementById('messageStyles')) {
    const style = document.createElement('style');
    style.id = 'messageStyles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .has-error input {
            border-color: #ef4444;
        }
        .error-message {
            color: #ef4444;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        }
    `;
    document.head.appendChild(style);
}

// Initialize on page load with enhanced features
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Add real-time form validation
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', () => validateFormField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateFormField(input);
            }
        });
    });
    
    // Enhanced login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const username = document.getElementById('loginIdentifier').value;
            const password = document.getElementById('loginPassword').value;
            
            if (validateForm('loginForm')) {
                setButtonLoading(submitBtn, true);
                showMessage('Authenticating...', 'loading', 0);
                
                // Simulate network delay for better UX
                setTimeout(() => {
                    if (handleLogin(username, password)) {
                        showMessage('✓ Login successful! Redirecting...', 'success');
                        setTimeout(() => window.location.href = 'welcome.html', 1500);
                    } else {
                        setButtonLoading(submitBtn, false);
                        showMessage('❌ Invalid credentials. Please try again.', 'error');
                    }
                }, 1000);
            }
        });
    }
    
    // Enhanced registration form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            
            if (validateForm('registerForm')) {
                setButtonLoading(submitBtn, true);
                showMessage('Creating your account...', 'loading', 0);
                
                const formData = new FormData(registerForm);
                const userData = Object.fromEntries(formData);
                
                // Simulate network delay
                setTimeout(() => {
                    if (handleRegistration(userData)) {
                        showMessage('✓ Registration successful! Redirecting to login...', 'success');
                        setTimeout(() => window.location.href = 'login.html', 2000);
                    } else {
                        setButtonLoading(submitBtn, false);
                        showMessage('❌ Username or email already exists. Please try different credentials.', 'error');
                    }
                }, 1500);
            }
        });
    }
    
    // Enhanced admin login form
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            
            setButtonLoading(submitBtn, true);
            showMessage('Verifying admin credentials...', 'loading', 0);
            
            setTimeout(() => {
                if (handleAdminLogin(username, password)) {
                    showMessage('✓ Admin authentication successful!', 'success');
                    setTimeout(() => window.location.href = 'admin-dashboard.html', 1000);
                } else {
                    setButtonLoading(submitBtn, false);
                    showMessage('❌ Invalid admin credentials. Access denied.', 'error');
                }
            }, 1200);
        });
    }
    
    // Auto-update dashboard elements
    if (window.location.pathname.includes('admin-dashboard.html')) {
        // Update admin dashboard every 30 seconds
        setInterval(() => {
            if (typeof loadUserStats === 'function') loadUserStats();
            if (typeof updateDoorStatus === 'function') updateDoorStatus();
            if (typeof loadAccessLogs === 'function') loadAccessLogs();
        }, 30000);
    }
    
    if (window.location.pathname.includes('user.html')) {
        // Update user dashboard every 10 seconds
        setInterval(() => {
            if (typeof updateDoorDisplay === 'function') updateDoorDisplay();
            if (typeof refreshLogs === 'function') refreshLogs();
        }, 10000);
        
        // Update timestamp
        setInterval(() => {
            const timestamp = document.getElementById('statusTimestamp');
            if (timestamp) {
                const doorStatus = getDoorStatus();
                if (doorStatus.lastChanged) {
                    timestamp.textContent = `Last updated: ${new Date(doorStatus.lastChanged).toLocaleTimeString()}`;
                }
            }
        }, 1000);
    }
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Escape key closes modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal[style*="block"]');
            modals.forEach(modal => modal.style.display = 'none');
        }
        
        // Enter key submits forms
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            const form = e.target.closest('form');
            if (form) {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.click();
            }
        }
    });
    
    // Add touch-friendly interactions for mobile
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Add touch feedback to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            btn.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            });
        });
    }
    
    // Accessibility: Focus management
    document.querySelectorAll('button, input, select, textarea, a[href]').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-blue)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Preload critical resources
    const criticalImages = ['camera-placeholder', 'visitor-icon'];
    criticalImages.forEach(imageClass => {
        const img = new Image();
        img.className = imageClass;
    });
    
    console.log('🎆 Enhanced IoT Door Opener loaded with professional UI features!');
});

console.log('IoT Door Opener with Admin Features loaded');