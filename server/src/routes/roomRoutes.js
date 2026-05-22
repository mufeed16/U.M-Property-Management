const express = require('express');
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

const router = express.Router();

router.get('/', auth, authorize('admin'), getAllRooms);
router.get('/:id', auth, getRoomById);
router.post('/', auth, authorize('admin'), createRoom);
router.put('/:id', auth, authorize('admin'), updateRoom);
router.delete('/:id', auth, authorize('admin'), deleteRoom);

module.exports = router;
