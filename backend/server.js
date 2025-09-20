const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://sachin:student123@cluster0.pgfrxp6.mongodb.net';
console.log('🔗 Connecting to MongoDB...');

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('🔧 Please check your MONGODB_URI environment variable');
  process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  },
  profile: {
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    mobile: {
      type: String,
      trim: true
    },
    socialLinks: {
      linkedin: {
        type: String,
        trim: true
      },
      github: {
        type: String,
        trim: true
      },
      twitter: {
        type: String,
        trim: true
      },
      website: {
        type: String,
        trim: true
      }
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500
    },
    avatar: {
      type: String,
      trim: true
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      mobile: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true
});

// Activity Schema
const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
const Activity = mongoose.model('Activity', activitySchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret#text', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin Middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Initialize Admin User
const initializeAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      await User.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
};

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'Team Activity Tracker API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Login
app.post('/auth/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret#text',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create User (Admin only)
app.post('/users', authenticateToken, requireAdmin, [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'member']).withMessage('Role must be admin or member')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Activities
app.get('/activities', authenticateToken, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.userId })
      .sort({ date: -1 })
      .populate('userId', 'username');
    
    res.json(activities);
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Activity
app.post('/activities', authenticateToken, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').optional().isISO8601().withMessage('Invalid date format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date } = req.body;
    const activity = await Activity.create({
      userId: req.user.userId,
      title,
      description,
      date: date ? new Date(date) : new Date()
    });

    await activity.populate('userId', 'username');
    res.status(201).json(activity);
  } catch (error) {
    console.error('Add activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Activities (Admin only)
app.get('/admin/activities', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { date, userId } = req.query;
    let query = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    if (userId) {
      query.userId = userId;
    }

    const activities = await Activity.find(query)
      .sort({ date: -1 })
      .populate('userId', 'username');
    
    res.json(activities);
  } catch (error) {
    console.error('Get all activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Activities by User ID (Admin only)
app.get('/admin/users/:userId/activities', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    let query = { userId };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const activities = await Activity.find(query)
      .sort({ date: -1 })
      .populate('userId', 'username profile.email profile.mobile');

    const user = await User.findById(userId).select('username profile role createdAt');
    
    res.json({
      user,
      activities
    });
  } catch (error) {
    console.error('Get user activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Users (Admin only)
app.get('/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'username role createdAt profile.email profile.mobile');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Profile
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update User Profile
app.put('/profile', authenticateToken, [
  body('profile.email').optional().isEmail().withMessage('Invalid email format'),
  body('profile.mobile').optional().isLength({ min: 10, max: 15 }).withMessage('Mobile number must be between 10-15 characters'),
  body('profile.bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('preferences.theme').optional().isIn(['light', 'dark']).withMessage('Invalid theme')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = {};
    
    if (req.body.profile) {
      updateData.profile = req.body.profile;
    }
    
    if (req.body.preferences) {
      updateData.preferences = req.body.preferences;
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateData },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change Password
app.put('/profile/password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
  initializeAdmin();
});
