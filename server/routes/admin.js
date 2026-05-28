const express = require('express');
const bcrypt = require('bcrypt');
const Inquiry = require('../models/Inquiry');
const Admin = require('../models/Admin');
const router = express.Router();

// @route   POST /api/admin/login
// @desc    Admin Login
// @access  Public
// @route   POST /api/admin/login
// @desc    Admin Login (With Auto-Create Magic)
// @access  Public
// @route   POST /api/admin/login
// @desc    Admin Login (With Auto-Create Magic)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Database se pehla admin uthao
    let admin = await Admin.findOne().select('+password');
    
    // 🚀 MAGIC: Agar database khali hai, toh naya admin khud bana do!
    if (!admin) {
      console.log("No admin found. Creating a new one with the provided password...");
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Naya admin save kar rahe hain (Name field required tha!)
      admin = new Admin({
        name: 'Ayodhya Admin', // <-- YE MISSING THA!
        email: 'admin@ayodhyaestate.com',
        password: hashedPassword
      });
      await admin.save();
      
      return res.json({ success: true, adminId: admin._id });
    }

    // Agar admin pehle se hai, toh normal password check karo
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (isMatch) {
      res.json({ success: true, adminId: admin._id });
    } else {
      res.status(401).json({ error: 'Invalid password. Please try again.' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login failed due to server error' });
  }
});

// @route   GET /api/admin/dashboard-stats
// @desc    Get admin dashboard statistics
// @access  Public
router.get('/dashboard-stats', async (req, res) => {
  try {
    const totalInquiries = await Inquiry.countDocuments();
    res.json({
      totalInquiries,
      ongoingProjects: 1,
      upcomingProjects: 1,
      completedProjects: 1
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
});

// @route   PUT /api/admin/change-password
// @desc    Change admin password (BULLETPROOF - No adminId required)
// @access  Public
router.put('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Both current and new passwords are required'
      });
    }

    // Seedha pehla admin uthao, ID ki tension khatam
    const admin = await Admin.findOne().select('+password');

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found in database' });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Password Change Error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

module.exports = router;