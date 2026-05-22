const Room = require('../models/Room');
const User = require('../models/User');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private (admin)
const getAllRooms = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const rooms = await Room.find(filter)
      .populate('tenant', 'name email phone')
      .sort({ roomNumber: 1 });

    res.json({ rooms });
  } catch (error) {
    next(error);
  }
};

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Private (admin can view any, tenant can view own only)
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('tenant', 'name email phone');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Tenant can only access their own room
    if (req.user.role === 'tenant') {
      if (!req.user.room || req.user.room.toString() !== room._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: access denied' });
      }
    }

    res.json({ room });
  } catch (error) {
    next(error);
  }
};

// @desc    Create room
// @route   POST /api/rooms
// @access  Private (admin)
const createRoom = async (req, res, next) => {
  try {
    const { roomNumber, floor, capacity, rentAmount, status, amenities, description } = req.body;

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: `Room ${roomNumber} already exists` });
    }

    const room = await Room.create({
      roomNumber,
      floor: floor || 1,
      capacity: capacity || 1,
      rentAmount: rentAmount || 0,
      status: status || 'vacant',
      amenities: amenities || [],
      description: description || '',
    });

    res.status(201).json({ room });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (admin)
const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const { roomNumber, floor, capacity, rentAmount, status, amenities, description } = req.body;

    // Check if new room number conflicts with another room
    if (roomNumber && roomNumber !== room.roomNumber) {
      const existing = await Room.findOne({ roomNumber });
      if (existing) {
        return res.status(400).json({ message: `Room ${roomNumber} already exists` });
      }
    }

    room.roomNumber = roomNumber ?? room.roomNumber;
    room.floor = floor ?? room.floor;
    room.capacity = capacity ?? room.capacity;
    room.rentAmount = rentAmount ?? room.rentAmount;
    room.status = status ?? room.status;
    room.amenities = amenities ?? room.amenities;
    room.description = description ?? room.description;

    await room.save();

    const populated = await room.populate('tenant', 'name email phone');
    res.json({ room: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (admin)
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Unassign tenant if room is occupied
    if (room.tenant) {
      await User.findByIdAndUpdate(room.tenant, { room: null });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom };
