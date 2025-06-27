const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');

const app = express();

// CORS configuration - Apply this first
const allowedOrigins = [
  'http://localhost:3000',
  'https://atelier-rho-indol.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

console.log('Allowed CORS origins:', allowedOrigins);
console.log('Environment FRONTEND_URL:', process.env.FRONTEND_URL);

// Secure CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Handle preflight requests
app.options('*', cors());

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  res.json({ 
    message: 'CORS test successful',
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    allowedOrigins: allowedOrigins
  });
});

// Test image serving endpoint
app.get('/api/test-images', (req, res) => {
  const uploadsPath = path.resolve(__dirname, 'uploads');
  const projectsPath = path.join(uploadsPath, 'projects');
  
  try {
    if (fs.existsSync(projectsPath)) {
      const files = fs.readdirSync(projectsPath);
      res.json({ 
        message: 'Image directory accessible',
        uploadsPath,
        projectsPath,
        fileCount: files.length,
        files: files.slice(0, 5), // Show first 5 files
        sampleUrls: files.slice(0, 3).map(file => `/uploads/projects/${file}`)
      });
    } else {
      res.json({ 
        message: 'Projects directory not found',
        uploadsPath,
        projectsPath
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Error accessing image directory',
      error: error.message
    });
  }
});

// List all uploaded images
app.get('/api/list-images', (req, res) => {
  const uploadsPath = path.resolve(__dirname, 'uploads');
  const projectsPath = path.join(uploadsPath, 'projects');
  
  try {
    if (fs.existsSync(projectsPath)) {
      const files = fs.readdirSync(projectsPath);
      const imageUrls = files.map(file => ({
        filename: file,
        url: `/uploads/projects/${file}`,
        fullUrl: `${req.protocol}://${req.get('host')}/uploads/projects/${file}`
      }));
      
      res.json({ 
        message: 'Images found',
        count: files.length,
        images: imageUrls
      });
    } else {
      res.json({ 
        message: 'No images found',
        uploadsPath,
        projectsPath
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Error listing images',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/atelier')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start server
    const PORT = process.env.BACKEND_PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });