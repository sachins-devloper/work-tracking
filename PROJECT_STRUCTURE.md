# Project Structure Overview

## 📁 Directory Structure

```
team-activity-tracker/
├── 📁 backend/                    # Backend API (Node.js/Express)
│   ├── 📄 server.js              # Main server file with all routes
│   ├── 📄 package.json           # Backend dependencies and scripts
│   └── 📄 package-lock.json      # Backend dependency lock file
│
├── 📁 frontend/                   # Frontend App (React/Vite)
│   ├── 📁 src/                   # React source code
│   │   ├── 📁 components/        # Reusable React components
│   │   │   ├── 📄 LoadingSpinner.jsx
│   │   │   └── 📄 MemberDetails.jsx
│   │   ├── 📁 context/           # React Context providers
│   │   │   ├── 📄 AuthContext.jsx
│   │   │   └── 📄 ThemeContext.jsx
│   │   ├── 📁 pages/             # Page components
│   │   │   ├── 📄 AdminDashboard.jsx
│   │   │   ├── 📄 Dashboard.jsx
│   │   │   ├── 📄 Login.jsx
│   │   │   ├── 📄 Profile.jsx
│   │   │   └── 📄 Signup.jsx
│   │   ├── 📁 services/          # API service functions
│   │   │   └── 📄 api.js
│   │   ├── 📄 App.jsx            # Main App component
│   │   ├── 📄 main.jsx           # React entry point
│   │   └── 📄 index.css          # Global styles
│   ├── 📄 index.html             # HTML template
│   ├── 📄 package.json           # Frontend dependencies
│   ├── 📄 package-lock.json      # Frontend dependency lock file
│   ├── 📄 vite.config.js         # Vite configuration
│   ├── 📄 tailwind.config.js     # Tailwind CSS configuration
│   └── 📄 postcss.config.js      # PostCSS configuration
│
├── 📁 node_modules/              # Root dependencies (concurrently)
├── 📄 package.json               # Root package.json (orchestrates everything)
├── 📄 package-lock.json          # Root dependency lock file
│
# 🚀 Deployment Configuration
├── 📄 render.yaml                # Render.com deployment config
├── 📄 Dockerfile                 # Docker container configuration
├── 📄 docker-compose.yml         # Docker Compose setup
├── 📄 Procfile                   # Heroku/Render process file
├── 📄 ecosystem.config.js        # PM2 process manager config
│
# 📚 Documentation
├── 📄 README.md                  # Main project documentation
├── 📄 DEPLOYMENT_GUIDE.md        # Complete deployment instructions
├── 📄 DEPLOYMENT.md              # Original deployment notes
├── 📄 ENVIRONMENT_VARIABLES.md   # Environment variables documentation
├── 📄 PROJECT_STRUCTURE.md       # This file
│
# 🔧 Configuration Files
├── 📄 .gitignore                 # Git ignore rules
├── 📄 .dockerignore              # Docker ignore rules
└── 📄 .env.example               # Environment variables template
```

## 🏗️ Architecture Overview

### Backend (Node.js/Express)
- **Location**: `backend/` directory
- **Main File**: `server.js`
- **Purpose**: REST API server
- **Features**:
  - User authentication (JWT)
  - Activity management
  - Admin dashboard APIs
  - Profile management
  - Static file serving (production)

### Frontend (React/Vite)
- **Location**: `frontend/` directory
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Features**:
  - User authentication UI
  - Activity tracking interface
  - Admin dashboard
  - Responsive design
  - Dark/Light theme support

### Root Orchestration
- **Location**: Root directory
- **Purpose**: Manages both frontend and backend
- **Scripts**:
  - `npm run dev`: Runs both frontend and backend in development
  - `npm run build`: Builds frontend for production
  - `npm start`: Starts production server
  - `npm run install-all`: Installs all dependencies

## 🔄 Development Workflow

### Local Development
```bash
# Install all dependencies
npm run install-all

# Start development servers (both frontend and backend)
npm run dev

# Or run individually
npm run server  # Backend only
npm run client  # Frontend only
```

### Production Build
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🚀 Deployment Architecture

### Single Service Deployment (Render)
- **One Service**: Both frontend and backend in one Render service
- **Build Process**: Installs dependencies → Builds React → Starts Node.js
- **Serving**: Backend serves built React files in production
- **URL**: Single URL for both API and frontend

### Multi-Service Deployment (Alternative)
- **Frontend Service**: Static site hosting (Vercel, Netlify)
- **Backend Service**: API hosting (Render, Railway, Heroku)
- **Database**: MongoDB Atlas
- **CORS**: Configured for cross-origin requests

## 📦 Dependencies Management

### Root Dependencies
- `concurrently`: Run multiple npm scripts simultaneously

### Backend Dependencies
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT authentication
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variables
- `express-validator`: Input validation

### Frontend Dependencies
- `react`: UI library
- `react-dom`: React DOM rendering
- `react-router-dom`: Client-side routing
- `axios`: HTTP client
- `react-hot-toast`: Notifications
- `date-fns`: Date manipulation

## 🔧 Configuration Files

### Build Configuration
- **Vite**: `frontend/vite.config.js`
- **Tailwind**: `frontend/tailwind.config.js`
- **PostCSS**: `frontend/postcss.config.js`

### Deployment Configuration
- **Render**: `render.yaml`
- **Docker**: `Dockerfile`, `docker-compose.yml`
- **PM2**: `ecosystem.config.js`
- **Heroku**: `Procfile`

### Development Configuration
- **Git**: `.gitignore`
- **Docker**: `.dockerignore`
- **Environment**: `.env.example`

## 🌐 API Endpoints

### Authentication
- `POST /auth/login` - User login

### Activities
- `GET /activities` - Get user activities
- `POST /activities` - Add new activity

### Admin
- `GET /admin/activities` - Get all activities
- `GET /admin/users` - Get all users
- `POST /users` - Create new user

### Profile
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `PUT /profile/password` - Change password

### Health
- `GET /health` - Health check
- `GET /api/status` - API status

## 🔒 Security Features

### Authentication
- JWT token-based authentication
- Password hashing with bcrypt
- Token expiration (24 hours)

### Authorization
- Role-based access control (admin/member)
- Protected routes with middleware
- Admin-only endpoints

### Input Validation
- Express-validator for request validation
- Sanitization of user inputs
- Error handling and responses

## 📊 Database Schema

### Users Collection
```javascript
{
  username: String (unique),
  password: String (hashed),
  role: String (admin/member),
  profile: {
    email: String,
    mobile: String,
    bio: String,
    socialLinks: Object,
    avatar: String
  },
  preferences: {
    theme: String (light/dark),
    notifications: Object
  },
  timestamps: true
}
```

### Activities Collection
```javascript
{
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  date: Date,
  timestamps: true
}
```

## 🎯 Key Features

### User Management
- User registration and login
- Profile management
- Role-based access control
- Password change functionality

### Activity Tracking
- Add daily activities
- View personal activity history
- Date-based filtering
- Activity management

### Admin Dashboard
- View all team activities
- User management
- Activity filtering and search
- Team overview

### UI/UX
- Responsive design
- Dark/Light theme
- Loading states
- Error handling
- Toast notifications

## 🔄 Data Flow

1. **User Login**: Frontend → Backend API → JWT Token
2. **Activity Creation**: Frontend → Backend API → Database
3. **Data Retrieval**: Frontend → Backend API → Database → Frontend
4. **Admin Operations**: Admin Frontend → Backend API → Database

## 🚀 Performance Optimizations

### Frontend
- Vite for fast builds
- Code splitting
- Optimized bundle size
- Static asset optimization

### Backend
- Express.js optimizations
- MongoDB connection pooling
- JWT token caching
- Health check monitoring

### Database
- Indexed queries
- Efficient data retrieval
- Connection pooling
- Atlas scaling

This structure provides a solid foundation for a full-stack application that can be easily deployed and maintained.
