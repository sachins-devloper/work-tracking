# Complete Deployment Guide

## 🚀 Quick Start Deployment

### Prerequisites
- GitHub repository with your code
- MongoDB Atlas account (for production database)
- Render.com account
- Git installed locally

### 1. Prepare Your Repository

#### Clone and Setup
```bash
git clone <your-repository-url>
cd team-activity-tracker
```

#### Install Dependencies
```bash
npm run install-all
```

#### Test Locally
```bash
# Development mode
npm run dev

# Production build test
npm run build
npm start
```

### 2. Deploy to Render

#### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your repository

#### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select `team-activity-tracker` repository

#### Step 3: Configure Service
- **Name**: `team-activity-tracker`
- **Environment**: `Node`
- **Region**: `Oregon` (or closest to your users)
- **Branch**: `main`
- **Root Directory**: (leave empty)
- **Build Command**: `npm run install-all && npm run build`
- **Start Command**: `npm start`
- **Node Version**: `18.x`

#### Step 4: Set Environment Variables
In the Render dashboard, go to **Environment** tab:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password
```

#### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait for build to complete (5-10 minutes)
3. Your app will be available at `https://your-app-name.onrender.com`

## 🐳 Docker Deployment (Alternative)

### Local Docker Testing
```bash
# Build and run with Docker
docker build -t team-activity-tracker .
docker run -p 5001:5001 -e MONGODB_URI=your-mongodb-uri team-activity-tracker
```

### Docker Compose (with local MongoDB)
```bash
# Create .env file
echo "MONGODB_URI=mongodb://admin:password@mongodb:27017/teamtracker" > .env
echo "JWT_SECRET=your-secret-key" >> .env
echo "ADMIN_USERNAME=admin" >> .env
echo "ADMIN_PASSWORD=admin123" >> .env

# Run with Docker Compose
docker-compose up -d
```

## 📁 Project Structure

```
team-activity-tracker/
├── backend/                 # Node.js/Express API
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React/Vite frontend
│   ├── src/               # React source code
│   ├── dist/              # Built frontend (generated)
│   └── package.json       # Frontend dependencies
├── .gitignore             # Git ignore rules
├── .dockerignore          # Docker ignore rules
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose setup
├── ecosystem.config.js    # PM2 configuration
├── Procfile              # Heroku/Render process file
├── render.yaml           # Render deployment config
├── package.json          # Root package.json
└── README.md             # Project documentation
```

## 🔧 Configuration Files

### Root package.json
- Manages both frontend and backend
- Contains build and start scripts
- Specifies Node.js version requirements

### render.yaml
- Render.com deployment configuration
- Defines build and start commands
- Sets environment variables
- Configures health checks

### Dockerfile
- Multi-stage build for production
- Optimized for size and performance
- Includes health checks

## 🌐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `production` |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `ADMIN_USERNAME` | Admin username | No | `admin` |
| `ADMIN_PASSWORD` | Admin password | No | `admin123` |
| `PORT` | Server port | No | `5001` |

## 🔍 Health Checks

The application includes health check endpoints:

- **Health Check**: `GET /health`
  - Returns server status, uptime, and environment info
- **API Status**: `GET /api/status`
  - Returns API version and status

## 🚨 Troubleshooting

### Common Issues

#### Build Fails
```bash
# Check Node.js version
node --version  # Should be >= 18.0.0

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm run install-all
```

#### Database Connection Issues
1. Verify MongoDB URI is correct
2. Check MongoDB Atlas IP whitelist
3. Ensure database user has proper permissions

#### Frontend Not Loading
1. Check if build completed successfully
2. Verify static file serving in server.js
3. Check browser console for errors

### Logs and Debugging

#### Render Logs
1. Go to Render dashboard
2. Click on your service
3. Go to **Logs** tab
4. Check for error messages

#### Local Debugging
```bash
# Run in development mode
npm run dev

# Check specific service
npm run server  # Backend only
npm run client  # Frontend only
```

## 🔒 Security Considerations

### Production Security
1. **Change Default Passwords**: Update admin credentials
2. **Strong JWT Secret**: Use cryptographically secure random string
3. **MongoDB Security**: Enable authentication and IP whitelisting
4. **Environment Variables**: Never commit secrets to git
5. **HTTPS**: Render provides automatic SSL certificates

### Environment Separation
- Use different databases for development and production
- Use different JWT secrets for each environment
- Never use production credentials in development

## 📈 Performance Optimization

### Frontend Optimization
- Vite automatically optimizes builds
- Static files are served efficiently
- Images and assets are compressed

### Backend Optimization
- Express.js with production optimizations
- MongoDB connection pooling
- JWT token caching
- Health check monitoring

## 🔄 Continuous Deployment

### Automatic Deployments
- Render automatically deploys on git push
- Build process runs on every deployment
- Zero-downtime deployments

### Manual Deployments
1. Push changes to main branch
2. Render detects changes
3. Builds and deploys automatically
4. Service restarts with new code

## 📊 Monitoring

### Render Dashboard
- View deployment history
- Monitor resource usage
- Check service health
- View logs and errors

### Application Monitoring
- Health check endpoints
- Uptime monitoring
- Error tracking
- Performance metrics

## 🆘 Support

### Getting Help
1. Check Render documentation
2. Review application logs
3. Test locally first
4. Check environment variables

### Common Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Install all dependencies
npm run install-all

# Health check
curl https://your-app.onrender.com/health
```

## 📝 Next Steps

After successful deployment:
1. Test all functionality
2. Update admin credentials
3. Configure custom domain (optional)
4. Set up monitoring alerts
5. Plan for scaling if needed

---

**Happy Deploying! 🎉**
