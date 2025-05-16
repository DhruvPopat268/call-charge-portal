const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const router = express.Router();
const JWT_SECRET_A = process.env.JWT_SECRET_A // You can use .env

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = await Admin.create({ email, password: hashedPassword });



    res.status(201).json({
      message: "Admin SignUp Successfully"
    });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid email or password' });

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate token
    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET_A, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: false,
      secure: true,
      sameSite: 'None'
    });

    res.status(200).json({
      token,
      admin: {
        _id: admin._id,
        email: admin.email,
        // add other fields if needed
      },
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: false,
    secure: true,
    sameSite: 'None'
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
