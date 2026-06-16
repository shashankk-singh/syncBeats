const express = require('express');
const router = express.Router();
const {createRoom, getMyRooms, getRoomByCode} = require('../controllers/roomController');
const protect = require('../middlewares/auth');

router.post('/', protect, createRoom)
router.get('/my' , protect , getMyRooms)
router.get('/:code' , protect, getRoomByCode)

module.exports = router;