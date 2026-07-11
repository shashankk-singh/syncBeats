const express = require('express');
const router = express.Router();
const { signup, login, getMe, refresh, logout} = require('../controllers/authController');
const protect = require('../middlewares/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout)
router.get('/me', protect, getMe);

module.exports = router;