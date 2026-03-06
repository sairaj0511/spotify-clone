const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// One-time admin setup route
router.post('/make-admin', async (req, res) => {
  try {
    const { email, secretKey } = req.body;
    if (secretKey !== 'spotify-admin-2024') {
      return res.status(403).json({ message: 'Wrong secret key' });
    }
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `${user.name} is now admin!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;