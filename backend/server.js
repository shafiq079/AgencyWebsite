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

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://atelier-rho-indol.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
const uploadsPath = path.resolve(__dirname, 'uploads');
app.use('/uploads', require('cors')({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}), (req, res, next) => {
  // Log image requests for debugging
  console.log('Image request:', {
    path: req.path,
    fullUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    userAgent: req.get('User-Agent'),
    origin: req.get('Origin')
  });
  next();
}, express.static(uploadsPath, {
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
    console.log('Serving static file:', path);
  }
}));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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