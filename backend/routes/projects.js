const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
  },
});

const upload = multer({ storage });

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
      url: file.path, // Cloudinary URL
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

    // Handle existing images (keep only the ones that weren't removed)
    const existingImages = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages].filter(Boolean);
    const removedImages = Array.isArray(req.body.removedImages) ? req.body.removedImages : [req.body.removedImages].filter(Boolean);
    
    // Filter out removed images from existing images
    const remainingExistingImages = project.images.filter(img => 
      existingImages.includes(img.url) && !removedImages.includes(img.url)
    );

    // Add new images from Cloudinary
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => ({
        url: file.path, // Cloudinary URL
        alt: `${project.title} - Project Image`,
        caption: ''
      }));
    }

    // Combine remaining existing images with new images
    project.images = [...remainingExistingImages, ...newImages];
    
    // Update featured image if needed
    if (project.images.length > 0) {
      project.featuredImage = project.images[0].url;
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
