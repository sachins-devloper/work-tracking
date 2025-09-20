# Deployment Guide for Render.com

## Prerequisites
- GitHub repository with your code
- MongoDB Atlas account
- Render.com account

## Step 1: Prepare Your Repository

1. Make sure all files are committed and pushed to your GitHub repository
2. The project structure should be:
   ```
   team-activity-tracker/
   ├── backend/
   ├── frontend/
   ├── package.json
   └── render.yaml
   ```

## Step 2: Deploy on Render

1. **Create a New Web Service on Render:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the Service:**
   - **Name:** team-activity-tracker (or your preferred name)
   - **Environment:** Node
   - **Build Command:** `npm run install-all && npm run build`
   - **Start Command:** `npm start`
   - **Node Version:** 18.x (or latest)

3. **Set Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://sachin:student123@cluster0.pgfrxp6.mongodb.net
   JWT_SECRET=secret#text
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   NODE_ENV=production
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

## Step 3: Access Your Application

- Once deployed, you'll get a URL like: `https://your-app-name.onrender.com`
- The application will serve both frontend and backend from the same URL
- Default admin credentials: `admin` / `admin123`

## Features Available After Deployment

### For Regular Users (Members):
- Login with username/password
- Add daily activities (title, description, date)
- View personal activity history
- Logout

### For Admin Users:
- All member features
- Create new users (admin/member roles)
- View all team activities
- Filter activities by date and user
- Access admin dashboard

## Troubleshooting

### Common Issues:
1. **Build Fails:** Check that all dependencies are properly listed in package.json files
2. **Database Connection:** Verify MongoDB URI is correct and accessible
3. **Environment Variables:** Ensure all required variables are set in Render dashboard

### Logs:
- Check Render dashboard logs for any errors
- Backend logs will show database connection status
- Frontend build logs will show any compilation errors

## Security Notes

- Change default admin credentials after first login
- Use strong JWT secrets in production
- Ensure MongoDB Atlas has proper security settings
- Consider adding rate limiting for production use

## Scaling

- Render automatically handles scaling
- MongoDB Atlas provides automatic scaling
- Consider implementing caching for better performance
