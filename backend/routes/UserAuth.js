const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET_U = process.env.JWT_SECRET_U // You can use .env

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      message: "User SignUp Successfully"
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
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET_U, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: false,
      secure: true,
      sameSite: 'None'
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        // add other fields if needed
      },
    });

  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;
