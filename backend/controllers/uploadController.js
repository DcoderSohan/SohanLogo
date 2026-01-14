import { uploadToCloudinary } from '../utils/cloudinary.js';
import fs from 'fs';
import path from 'path';

// Upload single image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file, 'sohanlogo');

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Clean up local file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message,
    });
  }
};

// Upload multiple images
export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided',
      });
    }

    const uploadPromises = req.files.map(file => uploadToCloudinary(file, 'sohanlogo'));
    const imageUrls = await Promise.all(uploadPromises);

    // Delete local files after upload
    req.files.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        urls: imageUrls,
      },
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    
    // Clean up local files if they exist
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message,
    });
  }
};

