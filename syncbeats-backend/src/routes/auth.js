const express = require('express');
const router = express.Router();
const { signup, login, getMe, refresh, logout} = require('../controllers/authController');
const protect = require('../middlewares/auth');
const { rateLimit } = require('express-rate-limit')

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' }
});

router.post('/signup',loginLimiter, signup);
router.post('/login',loginLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout)
router.get('/me', protect, getMe);

module.exports = router;