import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// Sign up
export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if any admin already exists (only one admin account allowed)
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'An admin account already exists. Only one admin account is allowed.',
      });
    }

    // Check if admin with this email already exists (additional check)
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists',
      });
    }

    // Create new admin
    const admin = await Admin.create({
      email: email.toLowerCase(),
      password,
      name: name || 'Admin',
    });

    // Generate token
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        admin: {
          _id: admin._id,
          email: admin.email,
          name: admin.name,
          profileImage: admin.profileImage,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admin account',
      error: error.message,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find admin and include password for comparison
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        admin: {
          _id: admin._id,
          email: admin.email,
          name: admin.name,
          profileImage: admin.profileImage,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message,
    });
  }
};

// Get current admin profile
export const getProfile = async (req, res) => {
  try {
    if (!req.admin || !req.admin._id) {
      return res.status(401).json({
        success: false,
        message: 'Admin not authenticated',
      });
    }
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }
    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    if (!req.admin || !req.admin._id) {
      return res.status(401).json({
        success: false,
        message: 'Admin not authenticated',
      });
    }
    const { email, password, name, profileImage } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Update email if provided
    if (email && email !== admin.email) {
      // Check if email already exists
      const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
      }
      admin.email = email.toLowerCase();
    }

    // Update password if provided
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long',
        });
      }
      admin.password = password; // Will be hashed by pre-save hook
    }

    // Update name if provided
    if (name) {
      admin.name = name;
    }

    // Update profile image if provided
    if (profileImage !== undefined) {
      admin.profileImage = profileImage;
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        profileImage: admin.profileImage,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

