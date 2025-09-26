# IoT-door-Opener

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