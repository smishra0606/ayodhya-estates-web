const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const Gallery = require('../models/Gallery');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @route   GET /api/gallery
// @desc    Get all gallery images
// @access  Public
// @route   GET /api/gallery
// @desc    Get all gallery images DIRECTLY from Cloudinary
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log("Fetching images directly from Cloudinary...");

    // 🚀 Cloudinary ki Search API use kar rahe hain
    const result = await cloudinary.search
      .expression('resource_type:image') // Tumhare account ki saari photos nikal lega
      .sort_by('created_at', 'desc')
      .max_results(50) // Ek baar mein 50 photos
      .execute();

    // Frontend ko jis format mein data chahiye, usme convert kar rahe hain
    const images = result.resources.map((img, index) => ({
      _id: img.public_id || `cloud-${index}`,
      imageUrl: img.secure_url,
      cloudinaryId: img.public_id,
      status: 'Available', // Default status for older photos
      description: 'Premium Plot in Ayodhya',
      createdAt: img.created_at
    }));

    res.json(images);
  } catch (error) {
    console.error('Error fetching from Cloudinary:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images from Cloudinary' });
  }
});
// @route   POST /api/gallery/upload
// @desc    Upload image to Cloudinary and save to database
// @access  Admin (Protected)
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { status, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Upload to Cloudinary using buffer
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'ayodhya-estate',
          transformation: [
            { width: 1200, quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const result = await uploadPromise;

    // Save to database
    const newImage = new Gallery({
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      status: status || 'New Plot',
      description: description || ''
    });

    await newImage.save();

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: newImage
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image', message: error.message });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete gallery image
// @access  Admin (Protected)
router.delete('/:id', async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.cloudinaryId);

    // Delete from database
    await Gallery.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Image deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;
