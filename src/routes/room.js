const express = require('express');
const router = express.Router();
const {createRoom, getMyRooms} = require('../controllers/roomController');
const protect = require('../middlewares/auth');

router.post('/rooms', protect, createRoom)
router.get('/rooms/my' , protect , getMyRooms)

module.exports = router;