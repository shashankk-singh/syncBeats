const express = require('express');
const router = express.Router();
const {createRoom, getMyRooms, getRoomByCode, deleteRoom} = require('../controllers/roomController');
const protect = require('../middlewares/auth');

router.post('/', protect, createRoom)
router.get('/my' , protect , getMyRooms)
router.get('/:code' , protect, getRoomByCode)
router.delete('/:code', protect, deleteRoom)

module.exports = router;