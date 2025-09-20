# Environment Variables for Production Deployment

## Required Environment Variables

### Database Configuration
- **MONGODB_URI**: MongoDB connection string
  - Example: `mongodb+srv://username:password@cluster.mongodb.net/database`
  - Get this from MongoDB Atlas

### Authentication
- **JWT_SECRET**: Secret key for JWT token signing
  - Should be a strong, random string
  - Example: `your-super-secret-jwt-key-here-12345`

### Admin User
- **ADMIN_USERNAME**: Default admin username
  - Default: `admin`
  - Can be customized

- **ADMIN_PASSWORD**: Default admin password
  - **IMPORTANT**: Change this in production!
  - Default: `admin123`

### Application
- **NODE_ENV**: Application environment
  - Set to `production` for deployment
  - Automatically set by Render

## Setting Environment Variables in Render

1. Go to your service dashboard in Render
2. Navigate to **Environment** tab
3. Add each variable with its value
4. Click **Save Changes**
5. The service will automatically restart

## Security Best Practices

1. **Use Strong Passwords**: Change default admin password
2. **Secure JWT Secret**: Use a cryptographically secure random string
3. **MongoDB Security**: Ensure your MongoDB Atlas cluster has proper security settings
4. **Environment Separation**: Use different credentials for development and production

## Example Production Environment Variables

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://produser:securepassword@cluster.mongodb.net/teamtracker
JWT_SECRET=Kj8#mN9$pL2@vX7!qW4%rT6&uY1*iO3^eR5
ADMIN_USERNAME=admin
ADMIN_PASSWORD=SecureAdminPass123!
```
