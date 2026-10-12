const express = require('express');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id || user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'admin'
    },
    process.env.JWT_ACCESS_SECRET || 'dev-secret',
    { expiresIn: '7d' }
  );
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@watercare.local' && password === 'admin123') {
    const user = {
      id: 'admin-1',
      name: 'Admin User',
      email,
      role: 'admin'
    };

    return res.json({
      message: 'Login successful',
      token: generateToken(user),
      user
    });
  }

  return res.status(401).json({ message: 'Invalid email or password' });
});

router.get('/me', protect, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;
