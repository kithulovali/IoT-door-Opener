# 🚪 IoT Door Access System


![server development cercle](https://github.com/kithulovali/IoT-door-Opener/blob/server/assets/Development.png)

This above image is described by the algorithm bellow 

```
if (face == image){
 arduino -> send Opendoor
}else{
 you are not allowed here 
}
```

![Door opener diagram](assets/initial_plan.png)

This diagram above shows the working  circle of the project itself

 - [X] Django is used as a backend server .

 - [X] The frontend by HTML and CSS for design .

 - [X] Postgress is being used as the database  in production and sqlite for devellopment.
 
The server can be acceded on the [Server branch](https://github.com/kithulovali/IoT-door-Opener/tree/server)
=======
A comprehensive smart door access control system using face recognition technology, integrating camera capture, Django REST API backend, Arduino hardware control, and automated door mechanisms for secure, contactless building access.

## 🏗️ System Architecture

```
IoT-door-Opener/
├── index.html                 # Landing page with system overview
├── register.html             # User registration with validation ✅
├── login.html               # User authentication with security ✅
├── welcome.html             # Personalized welcome dashboard ✅
├── user.html                # Main application dashboard ✅
├── user-styles.css          # Comprehensive styling with themes
├── user-script.js           # Core application logic
├── security-framework.js    # Security and authentication system
├── theme-language.js        # Theme and multi-language support
├── advanced-search.js       # Search and filtering functionality
├── export-system.js         # Data export capabilities
├── enhanced-login.js        # Enhanced login with security integration
├── door_openner_server/     # Django REST API backend
│   ├── Users/
│   │   ├── models.py
│   │   ├── views.py
│   │   └── admin.py
│   └── door_openner_server/
│       ├── settings.py
│       ├── urls.py
│       └── wsgi.py
└── README.md               # This documentation
```

## ✨ Features

### 🔐 Security Features
- **Password Strength Validation**: Real-time validation with visual feedback
- **Session Timeout Management**: Configurable 30-minute timeout with activity monitoring
- **Account Lockout Protection**: 5 failed attempts trigger 30-minute lockout
- **Activity Logging**: Comprehensive audit trail with export capabilities
- **Secure Data Storage**: Client-side encryption for sensitive data

### 🎨 User Experience
- **Dark/Light Theme Support**: Professional theme switching with persistence
- **Multi-Language Support**: English, Swahili, and French with seamless switching
- **Advanced Search & Filtering**: Global search across all system data
- **Export Functionality**: PDF, Excel, and CSV export capabilities
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🔧 Core Functionality
- **Face Recognition Access**: Real-time camera integration for biometric authentication
- **User Management**: Complete profile management with security settings
- **Access History**: Detailed logging with analytics and reporting
- **Notification System**: Real-time alerts and system notifications
- **Hardware Integration**: Arduino microcontroller and door mechanism control

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)
- Camera access for face recognition features

### Installation

1. **Clone or download the project files**
   ```bash
   git clone <repository-url>
   cd IoT-door-Opener
   ```

2. **Open the landing page**
   - Open `index.html` in your web browser
   - Or serve through a local web server for better development experience

3. **Create an account**
   - Click "Create Account" on the landing page
   - Fill in your information with a strong password
   - Complete profile setup

4. **Start using the system**
   - Log in with your credentials
   - Explore the dashboard and features
   - Set up face recognition for door access

## 📱 User Journey

### 1. Landing Page (`index.html`)
- System overview with feature highlights
- Quick demo access
- Navigation to registration/login

### 2. Registration (`register.html`)
- Complete user registration form
- Real-time password strength validation
- Automatic employee ID generation
- Department selection

### 3. Login (`login.html`)
- Secure authentication with lockout protection
- Remember me functionality
- Enhanced security monitoring

### 4. Welcome Dashboard (`welcome.html`)
- Personalized welcome with user statistics
- Quick navigation to all features
- Session management and auto-logout

### 5. Main Dashboard (`user.html`)
- Face recognition access control
- Access history and analytics
- Profile management and security settings
- Advanced search and export capabilities

## 🔧 Technical Details

### Frontend Architecture
- **Vanilla JavaScript**: Modular architecture with dedicated functionality files
- **CSS3**: Advanced styling with CSS custom properties for theming
- **HTML5**: Semantic markup with accessibility features
- **Font Awesome**: Professional icon library
- **Inter Font**: Modern typography from Google Fonts

### Security Implementation
- **Client-side Encryption**: AES-style encryption for local data storage
- **Session Management**: Secure session handling with timeout
- **Input Validation**: Comprehensive form validation and sanitization
- **CSRF Protection**: Built-in protection against common attacks
- **Activity Monitoring**: Real-time security event tracking

### Data Management
- **Local Storage**: Encrypted local data persistence
- **Export Formats**: PDF (jsPDF), Excel (SheetJS), CSV
- **Search Engine**: Semantic search with relevance scoring
- **Caching**: Efficient data caching for performance

## 🌐 Multi-Language Support

The system supports three languages:
- **English (en)**: Default language
- **Swahili (sw)**: Kiswahili translation
- **French (fr)**: Français translation

Language can be changed from any page using the globe icon in the header.

## 🎨 Theme System

Two professional themes available:
- **Light Theme**: Clean, modern light interface
- **Dark Theme**: Eye-friendly dark interface

Theme preference is automatically saved and persists across sessions.

## 📊 Analytics & Reporting

### Access Analytics
- Success/failure rates
- Access attempt frequency
- User activity patterns
- Security event monitoring

### Export Options
- **PDF Reports**: Professional formatted reports with branding
- **Excel Spreadsheets**: Detailed data with multiple worksheets
- **CSV Data**: Raw data for external analysis

## 🔌 Hardware Integration

### Camera System
- Real-time video capture
- Face detection and recognition
- Image processing and analysis
- Confidence scoring

### Arduino Control
- Door mechanism control
- Sensor integration
- Status monitoring
- Hardware feedback

## 🚨 Security Considerations

### Password Policy
- Minimum 8 characters
- Mixed case letters required
- Numbers and special characters required
- Common password prevention

### Session Security
- Automatic timeout after 30 minutes of inactivity
- Secure session token generation
- Activity-based session renewal
- Logout on suspicious activity

### Access Control
- Role-based permissions
- Activity logging and audit trails
- Failed attempt monitoring
- Account lockout protection

## 🛠️ Development

### Adding New Features
1. Follow the modular JavaScript architecture
2. Maintain consistent styling with existing components
3. Add proper security validation
4. Include multi-language support
5. Test across all supported browsers

### Styling Guidelines
- Use CSS custom properties for consistent theming
- Follow responsive design principles
- Maintain accessibility standards
- Use the existing color palette and spacing system

### Security Best Practices
- Validate all user inputs
- Encrypt sensitive data before storage
- Log security-relevant events
- Implement proper error handling
- Follow OWASP security guidelines

## 📞 Support & Contact

- **Email**: group2@gmail.com
- **Phone**: 0761365727
- **Development Team**: Group 2
- **System Monitoring**: 24/7 availability

## 📄 License

This project is developed for educational purposes as part of System Analysis & Design coursework.

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added security features and multi-language support
- **v1.2.0**: Enhanced UI/UX with dark theme and advanced search
- **v1.3.0**: Added export functionality and comprehensive analytics

---

**© 2025 Smart Door Access System - Developed by Group 2**
>>>>>>> 13feea2aae11afa1f2dde36b707d30eb5afd0a17
