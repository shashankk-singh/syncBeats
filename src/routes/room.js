const express = require('express');
const router = express.Router();
const createRoom = require('../controllers/roomController');
const protect = require('../middlewares/auth');

router.post('/rooms', protect, createRoom)

module.exports = router;