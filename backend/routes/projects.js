const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/projects');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all published projects (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit = 20, page = 1 } = req.query;

    const filter = { status: 'published' };
    if (category && category !== 'All') filter.category = category;
    if (featured === 'true') filter.featured = true;

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-createdBy');

    const total = await Project.countDocuments(filter);

    res.json({
      projects,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all projects created by the authenticated user
router.get('/admin/all', auth, async (req, res) => {
  try {
    const { status, category, limit = 20, page = 1 } = req.query;

    const filter = { createdBy: req.user._id };
    if (status) filter.status = status;
    if (category && category !== 'All') filter.category = category;

    const projects = await Project.find(filter)
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Project.countDocuments(filter);

    res.json({
      projects,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single project by ID (for editing)
router.get('/admin/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }
    res.json(project);
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single project by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ 
      slug: req.params.slug, 
      status: 'published' 
    }).populate('createdBy', 'username email'); // ✅ include user info

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Create project
router.post('/', auth, upload.array('images', 10), [
  body('title').isLength({ min: 1, max: 100 }).trim().escape(),
  body('description').isLength({ min: 1, max: 1000 }).trim(),
  body('shortDescription').isLength({ min: 1, max: 200 }).trim(),
  body('category').isIn(['Branding', 'Digital', 'Print', 'Art Direction', 'Web Design']),
  body('year').isInt({ min: 2000, max: new Date().getFullYear() + 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      slug,
      description,
      shortDescription,
      category,
      technologies,
      client,
      year,
      status = 'draft',
      featured = false
    } = req.body;

    const images = req.files?.map(file => ({
      url: `/uploads/projects/${file.filename}`,
      alt: `${title} - Project Image`,
      caption: ''
    })) || [];

    const featuredImage = images.length > 0 ? images[0].url : '';

    const project = new Project({
      title,
      slug,
      description,
      shortDescription,
      category,
      technologies: technologies ? technologies.split(',').map(t => t.trim()) : [],
      images,
      featuredImage,
      client,
      year: parseInt(year),
      status,
      featured: featured === 'true',
      createdBy: req.user._id
    });

    await project.save();
    await project.populate('createdBy', 'username email');

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project
router.put('/:id', auth, upload.array('images', 10), [
  body('title').optional().isLength({ min: 1, max: 100 }).trim().escape(),
  body('description').optional().isLength({ min: 1, max: 1000 }).trim(),
  body('shortDescription').optional().isLength({ min: 1, max: 200 }).trim(),
  body('category').optional().isIn(['Branding', 'Digital', 'Print', 'Art Direction', 'Web Design']),
  body('year').optional().isInt({ min: 2000, max: new Date().getFullYear() + 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    Object.keys(req.body).forEach(key => {
      if (key === 'technologies' && req.body[key]) {
        project[key] = req.body[key].split(',').map(t => t.trim());
      } else if (key === 'featured') {
        project[key] = req.body[key] === 'true';
      } else if (key === 'year') {
        project[key] = parseInt(req.body[key]);
      } else if (req.body[key] !== undefined) {
        project[key] = req.body[key];
      }
    });

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `/uploads/projects/${file.filename}`,
        alt: `${project.title} - Project Image`,
        caption: ''
      }));

      project.images = [...project.images, ...newImages];
      if (!project.featuredImage) {
        project.featuredImage = newImages[0].url;
      }
    }

    await project.save();
    await project.populate('createdBy', 'username email');

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    project.images.forEach(image => {
      const imagePath = path.join(__dirname, '../', image.url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
