// User Portal JavaScript - Face Recognition Door Access System

class UserPortal {
    constructor() {
        this.currentSection = 'dashboard';
        this.cameraStream = null;
        this.isCameraActive = false;
        this.notifications = [];
        this.accessHistory = [];
        this.currentUser = {
            id: '',
            name: '',
            email: '',
            department: '',
            employeeId: '',
            accessLevel: '',
            status: 'Inactive'
        };
        
        // New features
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.emailSettings = JSON.parse(localStorage.getItem('emailSettings') || '{}');
        this.translations = this.loadTranslations();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.loadAccessHistory();
        this.loadNotifications();
        this.updateDashboard();
        this.applyTheme();
        this.applyLanguage();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
            });
        });

        // Header actions
        document.getElementById('notificationsBtn').addEventListener('click', () => {
            this.showNotificationModal();
        });

        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSection('profile');
        });

        // Dashboard actions
        document.getElementById('quickAccessBtn').addEventListener('click', () => {
            this.showSection('access');
        });

        document.getElementById('markAllRead').addEventListener('click', () => {
            this.markAllNotificationsRead();
        });

        // Access controls
        document.getElementById('startCameraBtn').addEventListener('click', () => {
            this.startCamera();
        });

        document.getElementById('captureBtn').addEventListener('click', () => {
            this.captureAndAccess();
        });

        document.getElementById('stopCameraBtn').addEventListener('click', () => {
            this.stopCamera();
        });

        // History filters
        document.getElementById('dateFilter').addEventListener('change', (e) => {
            this.filterHistory('date', e.target.value);
        });

        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.filterHistory('status', e.target.value);
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportHistory();
        });

        // Profile form
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });

        document.getElementById('resetForm').addEventListener('click', () => {
            this.resetProfileForm();
        });

        // Security actions
        document.getElementById('changePasswordBtn').addEventListener('click', () => {
            this.showChangePasswordModal();
        });

        document.getElementById('setup2FABtn').addEventListener('click', () => {
            this.setup2FA();
        });

        document.getElementById('manageBiometricBtn').addEventListener('click', () => {
            this.manageBiometricData();
        });

        // Modal controls
        document.getElementById('closeNotificationModal').addEventListener('click', () => {
            this.hideModal('notificationModal');
        });

        document.getElementById('closePasswordModal').addEventListener('click', () => {
            this.hideModal('changePasswordModal');
        });

        document.getElementById('cancelPasswordChange').addEventListener('click', () => {
            this.hideModal('changePasswordModal');
        });

        document.getElementById('changePasswordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });

        // New feature event listeners
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        document.getElementById('languageToggle').addEventListener('click', () => {
            this.showModal('languageModal');
        });

        document.getElementById('searchFilterBtn').addEventListener('click', () => {
            this.showModal('advancedSearchModal');
        });

        document.getElementById('globalSearch').addEventListener('input', (e) => {
            this.performGlobalSearch(e.target.value);
        });

        // Export functionality
        document.querySelectorAll('.export-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const format = e.currentTarget.dataset.format;
                this.exportData(format);
            });
        });

        // Advanced search
        document.getElementById('advancedSearchForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.performAdvancedSearch();
        });

        document.getElementById('clearAdvancedSearch').addEventListener('click', () => {
            this.clearAdvancedSearch();
        });

        document.getElementById('cancelAdvancedSearch').addEventListener('click', () => {
            this.hideModal('advancedSearchModal');
        });

        // Language selection
        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                this.changeLanguage(lang);
            });
        });

        // Email settings
        document.getElementById('emailSettingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEmailSettings();
        });

        document.getElementById('cancelEmailSettings').addEventListener('click', () => {
            this.hideModal('emailSettingsModal');
        });

        // Modal close buttons
        document.getElementById('closeAdvancedSearchModal').addEventListener('click', () => {
            this.hideModal('advancedSearchModal');
        });

        document.getElementById('closeLanguageModal').addEventListener('click', () => {
            this.hideModal('languageModal');
        });

        document.getElementById('closeEmailSettingsModal').addEventListener('click', () => {
            this.hideModal('emailSettingsModal');
        });

        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
        });

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        // Add active class to corresponding nav item
        const navItem = document.querySelector(`[data-section="${sectionName}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'access':
                this.resetAccessInterface();
                break;
            case 'history':
                this.updateHistoryTable();
                break;
            case 'profile':
                this.loadProfileData();
                break;
            case 'help':
                // Help section is static
                break;
        }
    }

    // Dashboard Functions
    updateDashboard() {
        this.updateUserInfo();
        this.updateAccessStatus();
        this.updateStats();
        this.updateRecentActivity();
        this.updateNotifications();
    }

    updateUserInfo() {
        const displayName = this.currentUser.name || 'User';
        const displayEmail = this.currentUser.email || 'user@example.com';
        
        document.getElementById('userName').textContent = displayName;
        document.getElementById('profileName').textContent = displayName;
        document.getElementById('profileEmail').textContent = displayEmail;
    }

    updateAccessStatus() {
        const lastAccess = this.getLastAccessTime();
        const nextReview = this.getNextReviewDate();
        
        document.getElementById('lastAccess').textContent = lastAccess;
        document.getElementById('nextReview').textContent = nextReview;
        
        // Update status indicator
        const statusIndicator = document.getElementById('accessStatus');
        const statusDot = statusIndicator.querySelector('.status-dot');
        const statusText = statusIndicator.querySelector('span:last-child');
        const accessLevel = document.getElementById('accessLevel');
        
        if (!this.currentUser.name) {
            statusDot.className = 'status-dot inactive';
            statusText.textContent = 'Inactive';
            accessLevel.textContent = 'Pending';
            accessLevel.className = 'value badge badge-warning';
        } else {
            statusDot.className = 'status-dot active';
            statusText.textContent = 'Active';
            accessLevel.textContent = 'Standard User';
            accessLevel.className = 'value badge badge-success';
        }
    }

    updateStats() {
        const stats = this.calculateMonthlyStats();
        document.getElementById('monthlyAccess').textContent = stats.total;
        document.getElementById('successfulAccess').textContent = stats.successful;
        document.getElementById('failedAccess').textContent = stats.failed;
    }

    updateRecentActivity() {
        const recentActivity = this.getRecentActivity();
        const activityContainer = document.getElementById('recentActivity');
        
        activityContainer.innerHTML = recentActivity.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    updateNotifications() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        document.getElementById('notificationCount').textContent = unreadCount;
        
        const notificationContainer = document.getElementById('notificationList');
        notificationContainer.innerHTML = this.notifications.slice(0, 2).map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'}">
                <div class="notification-icon">
                    <i class="fas ${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
            </div>
        `).join('');
    }

    // Access Functions
    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                } 
            });
            
            this.cameraStream = stream;
            const video = document.getElementById('videoStream');
            video.srcObject = stream;
            video.classList.remove('hidden');
            
            document.querySelector('.camera-placeholder').style.display = 'none';
            document.getElementById('startCameraBtn').disabled = true;
            document.getElementById('captureBtn').disabled = false;
            document.getElementById('stopCameraBtn').disabled = false;
            
            this.updateAccessStatus('Camera Active');
            this.isCameraActive = true;
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            this.showAccessResult('error', 'Camera Error', 'Unable to access camera. Please check permissions.');
        }
    }

    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
        
        const video = document.getElementById('videoStream');
        video.classList.add('hidden');
        document.querySelector('.camera-placeholder').style.display = 'flex';
        
        document.getElementById('startCameraBtn').disabled = false;
        document.getElementById('captureBtn').disabled = true;
        document.getElementById('stopCameraBtn').disabled = true;
        
        this.updateAccessStatus('Ready');
        this.isCameraActive = false;
        this.hideAccessResult();
    }

    async captureAndAccess() {
        if (!this.isCameraActive) return;
        
        // Check if user profile is complete
        if (!this.currentUser.name) {
            this.showAccessResult('error', 'Profile Required', 'Please complete your profile first before accessing the door.');
            return;
        }
        
        const video = document.getElementById('videoStream');
        const canvas = document.getElementById('captureCanvas');
        const context = canvas.getContext('2d');
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to blob
        const imageBlob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/jpeg', 0.8);
        });
        
        // Show loading state
        document.getElementById('captureBtn').classList.add('loading');
        this.updateAccessStatus('Processing...');
        
        try {
            // Simulate API call
            const result = await this.processFaceRecognition(imageBlob);
            
            if (result.success) {
                this.showAccessResult('success', 'Access Granted', `Welcome, ${result.userName}!`);
                this.addAccessHistory({
                    timestamp: new Date(),
                    status: 'success',
                    location: 'Main Entrance',
                    confidence: result.confidence,
                    userName: result.userName
                });
            } else {
                this.showAccessResult('error', 'Access Denied', result.message);
                this.addAccessHistory({
                    timestamp: new Date(),
                    status: 'failed',
                    location: 'Main Entrance',
                    confidence: result.confidence,
                    reason: result.message
                });
            }
            
        } catch (error) {
            console.error('Face recognition error:', error);
            this.showAccessResult('error', 'System Error', 'Unable to process request. Please try again.');
        } finally {
            document.getElementById('captureBtn').classList.remove('loading');
        }
    }

    async processFaceRecognition(imageBlob) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock face recognition result
        const isRecognized = Math.random() > 0.3; // 70% success rate
        
        if (isRecognized) {
            return {
                success: true,
                userName: this.currentUser.name,
                confidence: Math.floor(Math.random() * 20) + 80 // 80-99%
            };
        } else {
            return {
                success: false,
                message: 'Face not recognized in database',
                confidence: Math.floor(Math.random() * 30) + 40 // 40-69%
            };
        }
    }

    showAccessResult(type, title, message) {
        const resultContainer = document.getElementById('accessResult');
        const resultIcon = document.getElementById('resultIcon');
        const resultMessage = document.getElementById('resultMessage');
        const resultDetails = document.getElementById('resultDetails');
        
        resultContainer.className = `access-result ${type}`;
        resultContainer.classList.remove('hidden');
        
        if (type === 'success') {
            resultIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
            resultIcon.className = 'result-icon success';
        } else {
            resultIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
            resultIcon.className = 'result-icon error';
        }
        
        resultMessage.textContent = title;
        resultDetails.textContent = message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideAccessResult();
        }, 5000);
    }

    hideAccessResult() {
        document.getElementById('accessResult').classList.add('hidden');
    }

    updateAccessStatus(status) {
        const statusElement = document.getElementById('doorStatus');
        const statusText = statusElement.querySelector('span:last-child');
        const statusDot = statusElement.querySelector('.status-dot');
        
        statusText.textContent = status;
        
        if (status === 'Camera Active' || status === 'Processing...') {
            statusDot.className = 'status-dot';
        } else if (status === 'Ready') {
            statusDot.className = 'status-dot';
        }
    }

    resetAccessInterface() {
        this.stopCamera();
        this.hideAccessResult();
        this.updateAccessStatus('Ready');
    }

    // History Functions
    loadAccessHistory() {
        // Empty access history - will be populated when user is added
        this.accessHistory = [];
    }

    updateHistoryTable() {
        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = this.accessHistory.map(entry => `
            <tr>
                <td>${this.formatDateTime(entry.timestamp)}</td>
                <td>
                    <span class="badge ${entry.status === 'success' ? 'badge-success' : 'badge-danger'}">
                        ${entry.status === 'success' ? 'Success' : 'Failed'}
                    </span>
                </td>
                <td>${entry.location}</td>
                <td>${entry.confidence}%</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="userPortal.viewAccessDetails('${entry.timestamp.getTime()}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    addAccessHistory(entry) {
        this.accessHistory.unshift(entry);
        
        // Save to localStorage for persistence
        if (this.currentUser.id) {
            localStorage.setItem(`accessHistory_${this.currentUser.id}`, JSON.stringify(this.accessHistory));
        }
        
        this.updateHistoryTable();
        this.updateDashboard();
    }

    filterHistory(type, value) {
        let filteredHistory = [...this.accessHistory];
        
        if (type === 'date') {
            const now = new Date();
            switch (value) {
                case 'today':
                    filteredHistory = filteredHistory.filter(entry => 
                        entry.timestamp.toDateString() === now.toDateString()
                    );
                    break;
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    filteredHistory = filteredHistory.filter(entry => 
                        entry.timestamp >= weekAgo
                    );
                    break;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    filteredHistory = filteredHistory.filter(entry => 
                        entry.timestamp >= monthAgo
                    );
                    break;
            }
        } else if (type === 'status') {
            if (value !== 'all') {
                filteredHistory = filteredHistory.filter(entry => 
                    entry.status === value
                );
            }
        }
        
        this.displayFilteredHistory(filteredHistory);
    }

    displayFilteredHistory(history) {
        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = history.map(entry => `
            <tr>
                <td>${this.formatDateTime(entry.timestamp)}</td>
                <td>
                    <span class="badge ${entry.status === 'success' ? 'badge-success' : 'badge-danger'}">
                        ${entry.status === 'success' ? 'Success' : 'Failed'}
                    </span>
                </td>
                <td>${entry.location}</td>
                <td>${entry.confidence}%</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="userPortal.viewAccessDetails('${entry.timestamp.getTime()}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    exportHistory() {
        const csvContent = this.generateCSV(this.accessHistory);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `access_history_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    generateCSV(history) {
        const headers = ['Date', 'Time', 'Status', 'Location', 'Confidence', 'User'];
        const rows = history.map(entry => [
            entry.timestamp.toLocaleDateString(),
            entry.timestamp.toLocaleTimeString(),
            entry.status,
            entry.location,
            entry.confidence + '%',
            entry.userName || 'Unknown'
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    viewAccessDetails(timestamp) {
        const entry = this.accessHistory.find(e => e.timestamp.getTime() == timestamp);
        if (entry) {
            alert(`Access Details:

Date: ${this.formatDateTime(entry.timestamp)}
Status: ${entry.status}
Location: ${entry.location}
Confidence: ${entry.confidence}%
${entry.reason ? `Reason: ${entry.reason}` : ''}`);
        }
    }

    // Profile Functions
    loadProfileData() {
        const firstName = this.currentUser.name.split(' ')[0] || '';
        const lastName = this.currentUser.name.split(' ').slice(1).join(' ') || '';
        
        document.getElementById('firstName').value = firstName;
        document.getElementById('lastName').value = lastName;
        document.getElementById('email').value = this.currentUser.email || '';
        document.getElementById('phone').value = this.currentUser.phone || '';
        document.getElementById('department').value = this.currentUser.department || '';
        document.getElementById('employeeId').value = this.currentUser.employeeId || '';
        
        // Update profile status indicator
        const profileStatus = document.getElementById('profileStatus');
        if (profileStatus) {
            if (this.currentUser.name && this.currentUser.email) {
                profileStatus.textContent = 'Active';
                profileStatus.className = 'badge badge-success';
            } else {
                profileStatus.textContent = 'Incomplete';
                profileStatus.className = 'badge badge-warning';
            }
        }
    }

    updateProfile() {
        const formData = new FormData(document.getElementById('profileForm'));
        const updatedUser = {
            ...this.currentUser,
            name: `${formData.get('firstName')} ${formData.get('lastName')}`.trim(),
            email: formData.get('email'),
            phone: formData.get('phone'),
            department: formData.get('department'),
            employeeId: formData.get('employeeId') || this.generateEmployeeId(),
            status: 'Active'
        };
        
        this.currentUser = updatedUser;
        
        // Update session data
        const sessionData = JSON.parse(
            localStorage.getItem('userSession') || 
            sessionStorage.getItem('userSession') || 
            'null'
        );
        
        if (sessionData) {
            sessionData.user = {
                ...sessionData.user,
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                department: formData.get('department'),
                employeeId: formData.get('employeeId') || this.generateEmployeeId()
            };
            
            // Update both storage types
            if (localStorage.getItem('userSession')) {
                localStorage.setItem('userSession', JSON.stringify(sessionData));
            }
            if (sessionStorage.getItem('userSession')) {
                sessionStorage.setItem('userSession', JSON.stringify(sessionData));
            }
            
            // Update registered users list
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const userIndex = registeredUsers.findIndex(u => u.id === sessionData.user.id || u.email === sessionData.user.email);
            if (userIndex !== -1) {
                registeredUsers[userIndex] = {
                    ...registeredUsers[userIndex],
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    phone: formData.get('phone'),
                    department: formData.get('department'),
                    employeeId: formData.get('employeeId') || this.generateEmployeeId()
                };
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            }
        }
        
        this.updateUserInfo();
        this.showNotification('Profile Updated', 'Your profile has been successfully updated.', 'success');
        
        // Add activity for profile update
        this.addAccessHistory({
            timestamp: new Date(),
            status: 'success',
            location: 'Profile Settings',
            confidence: 100,
            userName: this.currentUser.name,
            type: 'profile_update'
        });
    }

    resetProfileForm() {
        this.loadProfileData();
    }

    changePassword() {
        const formData = new FormData(document.getElementById('changePasswordForm'));
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');
        
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        
        if (newPassword.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }
        
        // Simulate password change
        this.showNotification('Password Changed', 'Your password has been successfully updated.', 'success');
        this.hideModal('changePasswordModal');
        document.getElementById('changePasswordForm').reset();
    }

    setup2FA() {
        alert('2FA setup would be implemented here. This would typically involve:\n\n1. Generating a QR code\n2. User scanning with authenticator app\n3. Verifying the setup with a test code');
    }

    manageBiometricData() {
        alert('Biometric data management would be implemented here. This would typically involve:\n\n1. Viewing current face data\n2. Updating face recognition data\n3. Deleting biometric data\n4. Privacy settings');
    }

    // Notification Functions
    loadNotifications() {
        // Empty notifications - will be populated when user is added
        this.notifications = [];
    }

    showNotificationModal() {
        const modal = document.getElementById('notificationModal');
        const modalBody = document.getElementById('notificationModalBody');
        
        modalBody.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'}">
                <div class="notification-icon">
                    <i class="fas ${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
            </div>
        `).join('');
        
        modal.classList.add('active');
    }

    markAllNotificationsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.updateNotifications();
    }

    showNotification(title, message, type = 'info') {
        // Create temporary notification
        const notification = {
            id: Date.now(),
            title,
            message,
            time: 'Just now',
            read: false,
            icon: type === 'success' ? 'fa-check' : type === 'error' ? 'fa-times' : 'fa-info'
        };
        
        this.notifications.unshift(notification);
        this.updateNotifications();
    }

    // Modal Functions
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    showChangePasswordModal() {
        this.showModal('changePasswordModal');
    }

    // Utility Functions
    formatDateTime(date) {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getLastAccessTime() {
        if (!this.currentUser.name) {
            return 'Complete profile first';
        }
        const lastAccess = this.accessHistory.find(entry => entry.status === 'success');
        if (lastAccess) {
            const now = new Date();
            const diffMs = now - lastAccess.timestamp;
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            if (diffMins < 1) {
                return 'Just now';
            } else if (diffMins < 60) {
                return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
            } else if (diffHours < 24) {
                return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            } else if (diffDays < 7) {
                return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            } else {
                return this.formatDateTime(lastAccess.timestamp);
            }
        }
        return 'No access attempts';
    }

    getNextReviewDate() {
        if (!this.currentUser.name) {
            return 'After profile completion';
        }
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + 30);
        return nextReview.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    calculateMonthlyStats() {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const monthlyHistory = this.accessHistory.filter(entry => 
            entry.timestamp >= monthStart
        );
        
        return {
            total: monthlyHistory.length,
            successful: monthlyHistory.filter(entry => entry.status === 'success').length,
            failed: monthlyHistory.filter(entry => entry.status === 'failed').length
        };
    }

    getRecentActivity() {
        // Return empty activity if no user is set up
        if (!this.currentUser.name) {
            return [
                {
                    title: 'Welcome to Door Access System',
                    time: 'Complete your profile to start',
                    type: 'info',
                    icon: 'fa-info'
                }
            ];
        }
        
        // Get recent activities from access history
        const recentActivities = [];
        
        // Add profile creation activity
        recentActivities.push({
            title: 'Profile Created',
            time: 'Profile setup completed',
            type: 'success',
            icon: 'fa-user-plus'
        });
        
        // Add recent access attempts
        const recentAccess = this.accessHistory.slice(0, 2);
        recentAccess.forEach(entry => {
            const timeAgo = this.getTimeAgo(entry.timestamp);
            recentActivities.push({
                title: entry.status === 'success' ? 'Door Access Granted' : 'Access Denied',
                time: timeAgo,
                type: entry.status === 'success' ? 'success' : 'danger',
                icon: entry.status === 'success' ? 'fa-door-open' : 'fa-times'
            });
        });
        
        return recentActivities.slice(0, 3); // Show max 3 activities
    }
    
    getTimeAgo(timestamp) {
        const now = new Date();
        const diffMs = now - timestamp;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 1) {
            return 'Just now';
        } else if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return this.formatDateTime(timestamp);
        }
    }

    loadUserData() {
        // Check for active session and load user data
        const sessionData = JSON.parse(
            localStorage.getItem('userSession') || 
            sessionStorage.getItem('userSession') || 
            'null'
        );
        
        if (sessionData && sessionData.user) {
            this.currentUser = {
                id: sessionData.user.id || '',
                name: `${sessionData.user.firstName || ''} ${sessionData.user.lastName || ''}`.trim(),
                email: sessionData.user.email || '',
                phone: sessionData.user.phone || '',
                department: sessionData.user.department || '',
                employeeId: sessionData.user.employeeId || '',
                status: sessionData.user.status || 'Active'
            };
            
            // Load user's access history if available
            const userHistory = JSON.parse(localStorage.getItem(`accessHistory_${this.currentUser.id}`) || '[]');
            this.accessHistory = userHistory;
            
            // Load user's notifications
            const userNotifications = JSON.parse(localStorage.getItem(`notifications_${this.currentUser.id}`) || '[]');
            this.notifications = userNotifications.length > 0 ? userNotifications : this.getDefaultNotifications();
        } else {
            // No session found, redirect to login
            window.location.href = 'login.html';
        }
        
        console.log('User data loaded:', this.currentUser);
    }

    generateEmployeeId() {
        // Generate a simple employee ID
        const timestamp = Date.now().toString().slice(-6);
        return `EMP${timestamp}`;
    }

    getDefaultNotifications() {
        return [
            {
                id: 1,
                title: 'Welcome to Smart Door Access',
                message: 'Your account has been set up successfully. You can now access doors using face recognition.',
                time: 'Just now',
                read: false,
                icon: 'fa-door-open'
            },
            {
                id: 2,
                title: 'Security Notice',
                message: 'For your security, please ensure your profile information is up to date.',
                time: '1 hour ago',
                read: false,
                icon: 'fa-shield-alt'
            },
            {
                id: 3,
                title: 'System Information',
                message: 'Face recognition system is online and ready for use.',
                time: '2 hours ago',
                read: true,
                icon: 'fa-info'
            }
        ];
    }

    // Theme Management
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Language Management
    loadTranslations() {
        return {
            en: {
                'dashboard': 'Dashboard',
                'doorAccess': 'Door Access',
                'accessHistory': 'Access History',
                'profile': 'Profile',
                'help': 'Help & Support',
                'search': 'Search access history, notifications...',
                'export': 'Export',
                'exportPdf': 'Export as PDF',
                'exportExcel': 'Export as Excel',
                'exportCsv': 'Export as CSV',
                'theme': 'Toggle theme',
                'language': 'Change language',
                'settings': 'Settings',
                'notifications': 'Notifications',
                'user': 'User',
                'welcome': 'Welcome to Smart Door Access System',
                'completeProfile': 'Complete your profile to start',
                'lastAccess': 'Last Access',
                'accessLevel': 'Access Level',
                'nextReview': 'Next Review',
                'thisMonth': 'This Month',
                'accessAttempts': 'Access Attempts',
                'successful': 'Successful',
                'failed': 'Failed',
                'recentActivity': 'Recent Activity',
                'profileCreated': 'Profile Created',
                'doorAccessGranted': 'Door Access Granted',
                'accessDenied': 'Access Denied',
                'faceRecognition': 'Face Recognition Access',
                'startCamera': 'Start Camera',
                'captureAccess': 'Capture & Access',
                'stopCamera': 'Stop Camera',
                'accessGranted': 'Access Granted',
                'accessDenied': 'Access Denied',
                'profileRequired': 'Profile Required',
                'completeProfileFirst': 'Please complete your profile first before accessing the door.',
                'dateTime': 'Date & Time',
                'status': 'Status',
                'location': 'Location',
                'confidence': 'Confidence',
                'actions': 'Actions',
                'viewAll': 'View All',
                'firstName': 'First Name',
                'lastName': 'Last Name',
                'email': 'Email Address',
                'phone': 'Phone Number',
                'department': 'Department',
                'employeeId': 'Employee ID',
                'saveChanges': 'Save Changes',
                'reset': 'Reset',
                'changePassword': 'Change Password',
                'currentPassword': 'Current Password',
                'newPassword': 'New Password',
                'confirmPassword': 'Confirm New Password',
                'cancel': 'Cancel',
                'helpSupport': 'Help & Support',
                'frequentlyAsked': 'Frequently Asked Questions',
                'userGuide': 'User Guide',
                'contactSupport': 'Contact Support',
                'contactInfo': 'Contact Information',
                'emailSettings': 'Email Notification Settings',
                'accessNotifications': 'Access notifications',
                'securityAlerts': 'Security alerts',
                'systemUpdates': 'System updates',
                'saveSettings': 'Save Settings',
                'advancedSearch': 'Advanced Search',
                'dateFrom': 'Date From',
                'dateTo': 'Date To',
                'allStatus': 'All Status',
                'successful': 'Successful',
                'failed': 'Failed',
                'enterLocation': 'Enter location',
                'enterUserName': 'Enter user name',
                'search': 'Search',
                'clear': 'Clear',
                'selectLanguage': 'Select Language',
                'english': 'English',
                'kiswahili': 'Kiswahili',
                'french': 'Français'
            },
            sw: {
                'dashboard': 'Dashibodi',
                'doorAccess': 'Ufikiaji wa Mlango',
                'accessHistory': 'Historia ya Ufikiaji',
                'profile': 'Wasifu',
                'help': 'Msaada na Usaidizi',
                'search': 'Tafuta historia ya ufikiaji, arifa...',
                'export': 'Hamisha',
                'exportPdf': 'Hamisha kama PDF',
                'exportExcel': 'Hamisha kama Excel',
                'exportCsv': 'Hamisha kama CSV',
                'theme': 'Badilisha mada',
                'language': 'Badilisha lugha',
                'settings': 'Mipangilio',
                'notifications': 'Arifa',
                'user': 'Mtumiaji',
                'welcome': 'Karibu kwenye Mfumo wa Ufikiaji wa Mlango wa Akili',
                'completeProfile': 'Kamilisha wasifu wako ili uanze',
                'lastAccess': 'Ufikiaji wa Mwisho',
                'accessLevel': 'Kiwango cha Ufikiaji',
                'nextReview': 'Ukaguzi Ujao',
                'thisMonth': 'Mwezi Huu',
                'accessAttempts': 'Majaribio ya Ufikiaji',
                'successful': 'Imefanikiwa',
                'failed': 'Imeshindwa',
                'recentActivity': 'Shughuli za Hivi Karibuni',
                'profileCreated': 'Wasifu Umeundwa',
                'doorAccessGranted': 'Ufikiaji wa Mlango Umepitishwa',
                'accessDenied': 'Ufikiaji Umekataliwa',
                'faceRecognition': 'Utambuzi wa Uso wa Ufikiaji',
                'startCamera': 'Anza Kamera',
                'captureAccess': 'Piga Picha na Ufikiaji',
                'stopCamera': 'Simamisha Kamera',
                'accessGranted': 'Ufikiaji Umepitishwa',
                'accessDenied': 'Ufikiaji Umekataliwa',
                'profileRequired': 'Wasifu Unahitajika',
                'completeProfileFirst': 'Tafadhali kamilisha wasifu wako kwanza kabla ya kufikia mlango.',
                'dateTime': 'Tarehe na Muda',
                'status': 'Hali',
                'location': 'Mahali',
                'confidence': 'Uthibitisho',
                'actions': 'Vitendo',
                'viewAll': 'Ona Yote',
                'firstName': 'Jina la Kwanza',
                'lastName': 'Jina la Mwisho',
                'email': 'Anwani ya Barua pepe',
                'phone': 'Nambari ya Simu',
                'department': 'Idara',
                'employeeId': 'Kitambulisho cha Mfanyakazi',
                'saveChanges': 'Hifadhi Mabadiliko',
                'reset': 'Weka Upya',
                'changePassword': 'Badilisha Nenosiri',
                'currentPassword': 'Nenosiri la Sasa',
                'newPassword': 'Nenosiri Jipya',
                'confirmPassword': 'Thibitisha Nenosiri Jipya',
                'cancel': 'Ghairi',
                'helpSupport': 'Msaada na Usaidizi',
                'frequentlyAsked': 'Maswali Yanayoulizwa Mara nyingi',
                'userGuide': 'Mwongozo wa Mtumiaji',
                'contactSupport': 'Wasiliana na Usaidizi',
                'contactInfo': 'Maelezo ya Mawasiliano',
                'emailSettings': 'Mipangilio ya Arifa za Barua pepe',
                'accessNotifications': 'Arifa za ufikiaji',
                'securityAlerts': 'Alamu za usalama',
                'systemUpdates': 'Sasisho za mfumo',
                'saveSettings': 'Hifadhi Mipangilio',
                'advancedSearch': 'Utafutaji wa Hali ya Juu',
                'dateFrom': 'Tarehe Kutoka',
                'dateTo': 'Tarehe Hadi',
                'allStatus': 'Hali Zote',
                'successful': 'Imefanikiwa',
                'failed': 'Imeshindwa',
                'enterLocation': 'Ingiza mahali',
                'enterUserName': 'Ingiza jina la mtumiaji',
                'search': 'Tafuta',
                'clear': 'Safisha',
                'selectLanguage': 'Chagua Lugha',
                'english': 'Kiingereza',
                'kiswahili': 'Kiswahili',
                'french': 'Kifaransa'
            },
            fr: {
                'dashboard': 'Tableau de bord',
                'doorAccess': 'Accès à la porte',
                'accessHistory': 'Historique d\'accès',
                'profile': 'Profil',
                'help': 'Aide et support',
                'search': 'Rechercher l\'historique d\'accès, notifications...',
                'export': 'Exporter',
                'exportPdf': 'Exporter en PDF',
                'exportExcel': 'Exporter en Excel',
                'exportCsv': 'Exporter en CSV',
                'theme': 'Basculer le thème',
                'language': 'Changer de langue',
                'settings': 'Paramètres',
                'notifications': 'Notifications',
                'user': 'Utilisateur',
                'welcome': 'Bienvenue dans le système d\'accès intelligent à la porte',
                'completeProfile': 'Complétez votre profil pour commencer',
                'lastAccess': 'Dernier accès',
                'accessLevel': 'Niveau d\'accès',
                'nextReview': 'Prochaine révision',
                'thisMonth': 'Ce mois',
                'accessAttempts': 'Tentatives d\'accès',
                'successful': 'Réussi',
                'failed': 'Échoué',
                'recentActivity': 'Activité récente',
                'profileCreated': 'Profil créé',
                'doorAccessGranted': 'Accès à la porte accordé',
                'accessDenied': 'Accès refusé',
                'faceRecognition': 'Accès par reconnaissance faciale',
                'startCamera': 'Démarrer la caméra',
                'captureAccess': 'Capturer et accéder',
                'stopCamera': 'Arrêter la caméra',
                'accessGranted': 'Accès accordé',
                'accessDenied': 'Accès refusé',
                'profileRequired': 'Profil requis',
                'completeProfileFirst': 'Veuillez compléter votre profil avant d\'accéder à la porte.',
                'dateTime': 'Date et heure',
                'status': 'Statut',
                'location': 'Emplacement',
                'confidence': 'Confiance',
                'actions': 'Actions',
                'viewAll': 'Voir tout',
                'firstName': 'Prénom',
                'lastName': 'Nom de famille',
                'email': 'Adresse e-mail',
                'phone': 'Numéro de téléphone',
                'department': 'Département',
                'employeeId': 'ID employé',
                'saveChanges': 'Enregistrer les modifications',
                'reset': 'Réinitialiser',
                'changePassword': 'Changer le mot de passe',
                'currentPassword': 'Mot de passe actuel',
                'newPassword': 'Nouveau mot de passe',
                'confirmPassword': 'Confirmer le nouveau mot de passe',
                'cancel': 'Annuler',
                'helpSupport': 'Aide et support',
                'frequentlyAsked': 'Questions fréquemment posées',
                'userGuide': 'Guide utilisateur',
                'contactSupport': 'Contacter le support',
                'contactInfo': 'Informations de contact',
                'emailSettings': 'Paramètres de notification par e-mail',
                'accessNotifications': 'Notifications d\'accès',
                'securityAlerts': 'Alertes de sécurité',
                'systemUpdates': 'Mises à jour du système',
                'saveSettings': 'Enregistrer les paramètres',
                'advancedSearch': 'Recherche avancée',
                'dateFrom': 'Date de début',
                'dateTo': 'Date de fin',
                'allStatus': 'Tous les statuts',
                'successful': 'Réussi',
                'failed': 'Échoué',
                'enterLocation': 'Entrez l\'emplacement',
                'enterUserName': 'Entrez le nom d\'utilisateur',
                'search': 'Rechercher',
                'clear': 'Effacer',
                'selectLanguage': 'Sélectionner la langue',
                'english': 'Anglais',
                'kiswahili': 'Kiswahili',
                'french': 'Français'
            }
        };
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', this.currentLanguage);
        this.applyLanguage();
        this.hideModal('languageModal');
        
        // Update active language option
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.lang === lang) {
                option.classList.add('active');
            }
        });
    }

    applyLanguage() {
        const elements = document.querySelectorAll('[data-text-en], [data-placeholder-en]');
        elements.forEach(element => {
            const key = element.dataset[`text-${this.currentLanguage}`] || element.dataset[`placeholder-${this.currentLanguage}`];
            if (key) {
                if (element.tagName === 'INPUT') {
                    element.placeholder = key;
                } else {
                    element.textContent = key;
                }
            }
        });
    }

    // Search and Filtering
    performGlobalSearch(query) {
        if (!query.trim()) {
            this.updateHistoryTable();
            return;
        }

        const filteredHistory = this.accessHistory.filter(entry => {
            const searchText = query.toLowerCase();
            return (
                entry.location.toLowerCase().includes(searchText) ||
                (entry.userName && entry.userName.toLowerCase().includes(searchText)) ||
                entry.status.toLowerCase().includes(searchText) ||
                this.formatDateTime(entry.timestamp).toLowerCase().includes(searchText)
            );
        });

        this.displayFilteredHistory(filteredHistory);
    }

    performAdvancedSearch() {
        const formData = new FormData(document.getElementById('advancedSearchForm'));
        const filters = {
            dateFrom: formData.get('dateFrom'),
            dateTo: formData.get('dateTo'),
            status: formData.get('status'),
            location: formData.get('location'),
            user: formData.get('user')
        };

        let filteredHistory = [...this.accessHistory];

        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            filteredHistory = filteredHistory.filter(entry => entry.timestamp >= fromDate);
        }

        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            filteredHistory = filteredHistory.filter(entry => entry.timestamp <= toDate);
        }

        if (filters.status) {
            filteredHistory = filteredHistory.filter(entry => entry.status === filters.status);
        }

        if (filters.location) {
            filteredHistory = filteredHistory.filter(entry => 
                entry.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        if (filters.user) {
            filteredHistory = filteredHistory.filter(entry => 
                entry.userName && entry.userName.toLowerCase().includes(filters.user.toLowerCase())
            );
        }

        this.displayFilteredHistory(filteredHistory);
        this.hideModal('advancedSearchModal');
    }

    clearAdvancedSearch() {
        document.getElementById('advancedSearchForm').reset();
        this.updateHistoryTable();
    }

    // Export Functionality
    exportData(format) {
        const data = this.accessHistory;
        const filename = `access_history_${new Date().toISOString().split('T')[0]}`;

        switch (format) {
            case 'pdf':
                this.exportToPDF(data, filename);
                break;
            case 'excel':
                this.exportToExcel(data, filename);
                break;
            case 'csv':
                this.exportToCSV(data, filename);
                break;
        }
    }

    exportToPDF(data, filename) {
        // Simple PDF generation using browser print
        const printWindow = window.open('', '_blank');
        const htmlContent = `
            <html>
                <head>
                    <title>Access History Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .header { text-align: center; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Access History Report</h1>
                        <p>Generated on: ${new Date().toLocaleString()}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Status</th>
                                <th>Location</th>
                                <th>Confidence</th>
                                <th>User</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(entry => `
                                <tr>
                                    <td>${this.formatDateTime(entry.timestamp)}</td>
                                    <td>${entry.status}</td>
                                    <td>${entry.location}</td>
                                    <td>${entry.confidence}%</td>
                                    <td>${entry.userName || 'Unknown'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
    }

    exportToExcel(data, filename) {
        // Create Excel-like CSV with proper formatting
        const headers = ['Date', 'Time', 'Status', 'Location', 'Confidence', 'User'];
        const rows = data.map(entry => [
            entry.timestamp.toLocaleDateString(),
            entry.timestamp.toLocaleTimeString(),
            entry.status,
            entry.location,
            entry.confidence + '%',
            entry.userName || 'Unknown'
        ]);
        
        const csvContent = [headers, ...rows].map(row => 
            row.map(cell => `"${cell}"`).join(',')
        ).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.csv`;
        link.click();
    }

    exportToCSV(data, filename) {
        this.exportToExcel(data, filename); // Same implementation
    }

    // Email Notifications
    saveEmailSettings() {
        const formData = new FormData(document.getElementById('emailSettingsForm'));
        this.emailSettings = {
            email: formData.get('email'),
            accessNotifications: formData.has('accessNotifications'),
            securityAlerts: formData.has('securityAlerts'),
            systemUpdates: formData.has('systemUpdates')
        };
        
        localStorage.setItem('emailSettings', JSON.stringify(this.emailSettings));
        this.showNotification('Email Settings Saved', 'Your email notification preferences have been updated.', 'success');
        this.hideModal('emailSettingsModal');
    }

    sendEmailNotification(type, subject, message) {
        if (!this.emailSettings.email) return;
        
        // Simulate email sending
        console.log(`Email sent to ${this.emailSettings.email}:`, {
            type,
            subject,
            message,
            timestamp: new Date().toISOString()
        });
        
        this.showNotification('Email Sent', `Notification sent to ${this.emailSettings.email}`, 'success');
    }

    logout() {
        if (confirm('Are you sure you want to log out?')) {
            // Clear session data
            localStorage.removeItem('userSession');
            sessionStorage.removeItem('userSession');
            
            // Log logout activity
            const activities = JSON.parse(localStorage.getItem('loginActivities') || '[]');
            activities.unshift({
                type: 'logout',
                timestamp: new Date(),
                userId: this.currentUser?.id,
                success: true,
                reason: 'User logout'
            });
            localStorage.setItem('loginActivities', JSON.stringify(activities.slice(0, 50)));
            
            // Redirect to login
            window.location.href = 'login.html';
        }
    }
}

// Global functions
function logout() {
    if (typeof userPortal !== 'undefined' && userPortal.logout) {
        userPortal.logout();
    } else {
        // Fallback logout if userPortal is not available
        if (confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('userSession');
            sessionStorage.removeItem('userSession');
            window.location.href = 'login.html';
        }
    }
}

// Initialize user portal when DOM is loaded
const userPortal = new UserPortal();

// Prevent navigation away from dashboard without proper logout
window.addEventListener('beforeunload', (e) => {
    const sessionData = JSON.parse(
        localStorage.getItem('userSession') || 
        sessionStorage.getItem('userSession') || 
        'null'
    );
    
    if (sessionData && sessionData.user && window.location.pathname.includes('user.html')) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.userPortal = new UserPortal();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.userPortal && window.userPortal.isCameraActive) {
        window.userPortal.stopCamera();
    }
});

// Handle window beforeunload
window.addEventListener('beforeunload', () => {
    if (window.userPortal && window.userPortal.isCameraActive) {
        window.userPortal.stopCamera();
    }
});
