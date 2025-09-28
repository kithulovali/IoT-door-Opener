// Multi-Language and Theme Support System
// Supports English, Swahili, and French with dark/light themes

class ThemeLanguageManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = this.loadTranslations();
        this.init();
    }

    init() {
        this.applyTheme();
        this.applyLanguage();
        this.setupThemeToggle();
        this.setupLanguageToggle();
    }

    // Multi-Language Support
    loadTranslations() {
        return {
            en: {
                // Navigation
                dashboard: "Dashboard",
                access: "Door Access",
                history: "Access History",
                profile: "Profile",
                help: "Help & Support",
                
                // Dashboard
                welcome: "Welcome",
                currentStatus: "Current Access Status",
                lastAccess: "Last Access",
                accessLevel: "Access Level",
                nextReview: "Next Review",
                thisMonth: "This Month",
                accessAttempts: "Access Attempts",
                successful: "Successful",
                failed: "Failed",
                recentActivity: "Recent Activity",
                notifications: "Notifications",
                markAllRead: "Mark All Read",
                
                // Access Control
                faceRecognition: "Face Recognition Access",
                startCamera: "Start Camera",
                captureAccess: "Capture & Access",
                stopCamera: "Stop Camera",
                accessInstructions: "Access Instructions",
                cameraNotActive: "Camera not active",
                
                // Security
                password: "Password",
                currentPassword: "Current Password",
                newPassword: "New Password",
                confirmPassword: "Confirm New Password",
                changePassword: "Change Password",
                passwordStrength: "Password Strength",
                strongPassword: "Strong",
                mediumPassword: "Medium",
                weakPassword: "Weak",
                
                // Export
                export: "Export",
                exportPDF: "Export as PDF",
                exportExcel: "Export as Excel", 
                exportCSV: "Export as CSV",
                
                // Time
                justNow: "Just now",
                minutesAgo: "minutes ago",
                hoursAgo: "hours ago",
                daysAgo: "days ago",
                
                // Status
                active: "Active",
                inactive: "Inactive",
                pending: "Pending",
                success: "Success",
                error: "Error",
                warning: "Warning"
            },
            
            sw: {
                // Navigation
                dashboard: "Dashibodi",
                access: "Ufikiaji wa Mlango",
                history: "Historia ya Ufikiaji",
                profile: "Wasifu",
                help: "Msaada na Uongozi",
                
                // Dashboard
                welcome: "Karibu",
                currentStatus: "Hali ya Sasa ya Ufikiaji",
                lastAccess: "Ufikiaji wa Mwisho",
                accessLevel: "Kiwango cha Ufikiaji",
                nextReview: "Mapitio ya Baadaye",
                thisMonth: "Mwezi Huu",
                accessAttempts: "Miarahi ya Ufikiaji",
                successful: "Zilizofanikiwa",
                failed: "Zilizoshindwa",
                recentActivity: "Shughuli za Hivi Karibuni",
                notifications: "Arifa",
                markAllRead: "Weka Zote Zimesomwa",
                
                // Access Control
                faceRecognition: "Ufikiaji wa Utambuzi wa Uso",
                startCamera: "Anzisha Kamera",
                captureAccess: "Nasa na Ufikiaji",
                stopCamera: "Simamisha Kamera",
                accessInstructions: "Maelekezo ya Ufikiaji",
                cameraNotActive: "Kamera haiko hai",
                
                // Security
                password: "Nenosiri",
                currentPassword: "Nenosiri la Sasa",
                newPassword: "Nenosiri Jipya",
                confirmPassword: "Thibitisha Nenosiri Jipya",
                changePassword: "Badilisha Nenosiri",
                passwordStrength: "Nguvu ya Nenosiri",
                strongPassword: "Kali",
                mediumPassword: "Wastani",
                weakPassword: "Dhaifu",
                
                // Export
                export: "Hamisha",
                exportPDF: "Hamisha kama PDF",
                exportExcel: "Hamisha kama Excel",
                exportCSV: "Hamisha kama CSV",
                
                // Time
                justNow: "Sasa hivi",
                minutesAgo: "dakika zilizopita",
                hoursAgo: "masaa yaliyopita", 
                daysAgo: "siku zilizopita",
                
                // Status
                active: "Hai",
                inactive: "Si Hai",
                pending: "Inasubiri",
                success: "Mafanikio",
                error: "Hitilafu",
                warning: "Onyo"
            },
            
            fr: {
                // Navigation
                dashboard: "Tableau de Bord",
                access: "Accès Porte",
                history: "Historique d'Accès",
                profile: "Profil",
                help: "Aide et Support",
                
                // Dashboard
                welcome: "Bienvenue",
                currentStatus: "Statut d'Accès Actuel",
                lastAccess: "Dernier Accès",
                accessLevel: "Niveau d'Accès",
                nextReview: "Prochaine Révision",
                thisMonth: "Ce Mois",
                accessAttempts: "Tentatives d'Accès",
                successful: "Réussies",
                failed: "Échouées",
                recentActivity: "Activité Récente",
                notifications: "Notifications",
                markAllRead: "Marquer Tout Lu",
                
                // Access Control
                faceRecognition: "Accès par Reconnaissance Faciale",
                startCamera: "Démarrer Caméra",
                captureAccess: "Capturer et Accéder",
                stopCamera: "Arrêter Caméra",
                accessInstructions: "Instructions d'Accès",
                cameraNotActive: "Caméra non active",
                
                // Security
                password: "Mot de Passe",
                currentPassword: "Mot de Passe Actuel",
                newPassword: "Nouveau Mot de Passe",
                confirmPassword: "Confirmer Nouveau Mot de Passe",
                changePassword: "Changer Mot de Passe",
                passwordStrength: "Force du Mot de Passe",
                strongPassword: "Fort",
                mediumPassword: "Moyen",
                weakPassword: "Faible",
                
                // Export
                export: "Exporter",
                exportPDF: "Exporter en PDF",
                exportExcel: "Exporter en Excel",
                exportCSV: "Exporter en CSV",
                
                // Time
                justNow: "À l'instant",
                minutesAgo: "minutes passées",
                hoursAgo: "heures passées",
                daysAgo: "jours passés",
                
                // Status
                active: "Actif",
                inactive: "Inactif", 
                pending: "En Attente",
                success: "Succès",
                error: "Erreur",
                warning: "Avertissement"
            }
        };
    }

    applyLanguage() {
        const lang = this.translations[this.currentLanguage];
        if (!lang) return;

        // Update elements with data-text attributes
        document.querySelectorAll('[data-text-en]').forEach(element => {
            const key = element.getAttribute(`data-text-${this.currentLanguage}`);
            if (key) {
                element.textContent = key;
            }
        });

        // Update placeholder texts
        document.querySelectorAll('[data-placeholder-en]').forEach(element => {
            const placeholder = element.getAttribute(`data-placeholder-${this.currentLanguage}`);
            if (placeholder) {
                element.placeholder = placeholder;
            }
        });

        // Update specific elements by ID
        this.updateElementText('userName', lang.welcome);
        
        // Update navigation
        const navItems = document.querySelectorAll('.nav-item span');
        const navKeys = ['dashboard', 'access', 'history', 'profile', 'help'];
        navItems.forEach((item, index) => {
            if (navKeys[index] && lang[navKeys[index]]) {
                item.textContent = lang[navKeys[index]];
            }
        });
    }

    updateElementText(id, text) {
        const element = document.getElementById(id);
        if (element && text) {
            element.textContent = text;
        }
    }

    changeLanguage(langCode) {
        this.currentLanguage = langCode;
        localStorage.setItem('language', langCode);
        this.applyLanguage();
        this.hideModal('languageModal');
        
        // Show success message
        const messages = {
            en: 'Language changed to English',
            sw: 'Lugha imebadilishwa kuwa Kiswahili', 
            fr: 'Langue changée en Français'
        };
        this.showNotification(messages[langCode], 'success');
    }

    // Theme Management
    applyTheme() {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${this.currentTheme}-theme`);
        
        // Update theme icon
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Update CSS custom properties for theme
        this.updateThemeProperties();
    }

    updateThemeProperties() {
        const root = document.documentElement;
        
        if (this.currentTheme === 'dark') {
            root.style.setProperty('--bg-primary', '#1a1a1a');
            root.style.setProperty('--bg-secondary', '#2d2d2d');
            root.style.setProperty('--bg-tertiary', '#404040');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#b3b3b3');
            root.style.setProperty('--text-muted', '#888888');
            root.style.setProperty('--border-color', '#404040');
            root.style.setProperty('--card-bg', 'rgba(45, 45, 45, 0.95)');
        } else {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f8fafc');
            root.style.setProperty('--bg-tertiary', '#f1f5f9');
            root.style.setProperty('--text-primary', '#0f172a');
            root.style.setProperty('--text-secondary', '#475569');
            root.style.setProperty('--text-muted', '#64748b');
            root.style.setProperty('--border-color', '#e2e8f0');
            root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.95)');
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
        
        const message = this.currentTheme === 'dark' ? 'Dark theme enabled' : 'Light theme enabled';
        this.showNotification(message, 'info');
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    setupLanguageToggle() {
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => this.showModal('languageModal'));
        }
        
        // Setup language selection buttons
        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                this.changeLanguage(lang);
            });
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-times' : 'fa-info'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Get translated text
    t(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    }
}

// Initialize theme and language manager
window.themeLanguageManager = new ThemeLanguageManager();