# IoT Door Opener - Smart Access Control System

A comprehensive web-based IoT door access control system featuring face recognition technology, user management, and real-time monitoring capabilities.

## 🚀 Features

### Core Functionality
- ✅ **User Registration** - Complete account creation with validation
- ✅ **User Authentication** - Secure login with session management
- ✅ **Profile Management** - User profile settings and security options
- ✅ **Welcome Dashboard** - Centralized navigation and user statistics
- ✅ **Face Recognition Access** - AI-powered door access control
- ✅ **Access History** - Comprehensive logging and reporting
- ✅ **Real-time Notifications** - System alerts and updates
- ✅ **Responsive Design** - Mobile-friendly interface

### Security Features
- 🔐 Password strength validation
- 🔐 Session timeout management
- 🔐 Account lockout protection
- 🔐 Activity logging and monitoring
- 🔐 Secure data storage

### User Experience
- 🎨 Modern, professional UI design
- 🎨 Dark/Light theme support
- 🎨 Multi-language support (English, Swahili, French)
- 🎨 Advanced search and filtering
- 🎨 Export functionality (PDF, Excel, CSV)

## 📋 Pages Overview

### 1. Landing Page (`index.html`)
- System overview and features
- Quick demo access
- Navigation to login/register
- Contact information

### 2. Registration Page (`register.html`) ✅
- Complete user registration form
- Real-time form validation
- Password strength checking
- Terms and conditions acceptance
- Department selection
- Automatic employee ID generation

### 3. Login Page (`login.html`) ✅
- Secure user authentication
- Demo account access
- Remember me functionality
- Account lockout protection
- Password visibility toggle
- Forgot password option

### 4. Welcome Page (`welcome.html`) ✅
- Personalized welcome message
- User statistics display
- Quick navigation cards
- Feature highlights
- Session management
- Auto-logout on inactivity

### 5. Profile Page (Enhanced `user.html#profile`) ✅
- Personal information management
- Security settings
- Password change functionality
- 2FA setup options
- Biometric data management
- Activity history

### 6. Main Dashboard (`user.html`)
- Face recognition access control
- Real-time system status
- Access history and analytics
- Notification center
- Administrative tools

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Custom CSS with CSS Variables
- **Icons:** Font Awesome 6.0
- **Fonts:** Inter (Google Fonts)
- **Storage:** localStorage/sessionStorage
- **Camera:** WebRTC API
- **Security:** Client-side validation, session management

## 🚀 Getting Started

### Installation
1. Clone or download the repository
2. Open `index.html` in a web browser
3. No additional setup required!

### Demo Access
**Email:** demo@smartdoor.com  
**Password:** Demo123!@#

### File Structure
```
IoT-door-Opener/
├── index.html          # Landing page
├── register.html       # User registration ✅
├── login.html         # User login ✅
├── welcome.html       # Welcome dashboard ✅
├── user.html          # Main application dashboard
├── user-styles.css    # Comprehensive styling
├── user-script.js     # Application logic
└── README.md          # Documentation
```

## 💻 Usage Guide

### For New Users
1. Visit `index.html` (Landing Page)
2. Click "Create Account" → Complete registration
3. Login with your credentials
4. Complete your profile information
5. Start using face recognition access

### For Existing Users
1. Visit `index.html` or `login.html`
2. Enter your credentials
3. Access the welcome dashboard
4. Navigate to desired features

### Demo Mode
1. Click "Try Demo" on landing page
2. Or use demo credentials on login page
3. Explore all features with sample data

## 🔧 Features Detail

### Registration System
- **Validation:** Real-time form validation
- **Security:** Strong password requirements
- **Data:** Comprehensive user information
- **Storage:** Secure local storage
- **Flow:** Automatic redirect to login

### Authentication System
- **Security:** Account lockout after failed attempts
- **Sessions:** Configurable session duration
- **Recovery:** Password reset workflow
- **Demo:** Quick demo access
- **Persistence:** Remember me functionality

### Welcome Dashboard
- **Personalization:** User-specific greetings
- **Statistics:** Access attempts and success rates
- **Navigation:** Quick access to all features
- **Security:** Auto-logout on inactivity
- **Notifications:** Welcome messages for new users

### Profile Management
- **Information:** Complete profile editing
- **Security:** Password change and 2FA
- **Integration:** Seamless data synchronization
- **Validation:** Real-time form validation
- **Privacy:** Biometric data management

### Face Recognition Access
- **Camera:** WebRTC camera integration
- **Processing:** Simulated AI recognition
- **Security:** Confidence scoring
- **Logging:** Complete access history
- **Feedback:** Real-time result display

## 🎨 Design Features

- **Responsive:** Mobile-first design approach
- **Accessibility:** ARIA labels and keyboard navigation
- **Performance:** Optimized loading and animations
- **Consistency:** Unified design language
- **Professional:** Modern business interface

## 🔒 Security Considerations

- **Client-side only:** Suitable for demonstrations
- **Production ready:** Requires backend integration
- **Data protection:** Local storage encryption needed
- **Authentication:** Server-side validation required
- **Compliance:** GDPR/privacy considerations

## 📱 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers

## 👥 Development Team

**Group 2**  
📧 Email: group2@gmail.com  
📞 Phone: 0761365727

## 📝 License

This project is developed for educational purposes as part of System Analysis & Design coursework.

## 🤝 Contributing

This project is part of an academic assignment. For improvements or suggestions, please contact the development team.

---

*Last updated: September 2024*

![Door Opener Diagram](assets/initial_plan.png)

## INPUT [ CAMERA /FACE RECOGNISATION]

```
{USER ON DOOR} CAMERA --------->SERVER --------> DOOR 
{ADMIN REMOTE ACCESS} OFFICIAL WEBSITE -------> NEW USERS REGISTRATION ------> SAVED IN A DATABASE
```

## PROCES [SERVER frontend---> server ---> ]

##### Django is used as a backend server .

##### The frontend by HTML and CSS for design .

##### Postgress is being used as the database .

# OUTPUT [SERVER TO DOOR FACE RECOGNISE OR IGNORED]

##### This is the final step where by the user either get in or ingored  .

#### The server can be acceded on the [Server branch](https://github.com/kithulovali/IoT-door-Opener/tree/server)

---

## Frontend (HTML/CSS/JS)

This repository includes a complete user portal for the face recognition door access system.

### User Portal Features

- **Dashboard**: Overview of access status, statistics, and recent activity
- **Door Access**: Face recognition interface with camera integration
- **Access History**: Detailed log of all access attempts with filtering
- **Profile Management**: User profile settings and security options
- **Help & Support**: User guides and contact information

### How to run

- Option 1: Open `user.html` directly in your browser.
- Option 2: Serve locally (recommended for camera access).

Windows PowerShell example:

```powershell
cd "C:\Users\lenovo\Desktop\Drago Samuel\Year 2\System Analy & Design\Assin\IoT-door-Opener"
python -m http.server 5500
```

Then open `http://localhost:5500/user.html` in your browser.

### Current Features

- **Face Recognition Access**: Camera-based face recognition with mock API
- **Access History**: Complete log with filtering and export functionality
- **User Dashboard**: Real-time statistics and notifications
- **Profile Management**: User settings and security options
- **Responsive Design**: Works on desktop and mobile devices

### Technical Implementation

- **HTML5**: Semantic structure with accessibility features
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript ES6+**: Class-based architecture with async/await
- **Camera API**: WebRTC for face capture
- **Local Storage**: User preferences and session data

### Next Steps

- Integrate with Django backend API
- Connect to real face recognition service
- Implement actual door actuator control
- Add real-time notifications via WebSocket