const User = require('../models/User');
const Room = require('../models/Room');

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  Private (admin)
const getAllTenants = async (req, res, next) => {
  try {
    const tenants = await User.find({ role: 'tenant' })
      .select('-password')
      .populate('room', 'roomNumber floor status rentAmount')
      .sort({ createdAt: -1 });

    res.json({ tenants });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tenant by ID
// @route   GET /api/tenants/:id
// @access  Private (admin can view any, tenant can view own only)
const getTenantById = async (req, res, next) => {
  try {
    const tenant = await User.findById(req.params.id)
      .select('-password')
      .populate('room');

    if (!tenant || tenant.role !== 'tenant') {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Tenant can only access their own record
    if (req.user.role === 'tenant' && req.user._id.toString() !== tenant._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: access denied' });
    }

    res.json({ tenant });
  } catch (error) {
    next(error);
  }
};

// @desc    Create tenant
// @route   POST /api/tenants
// @access  Private (admin)
const createTenant = async (req, res, next) => {
  try {
    const { name, email, password, phone, roomId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Validate room if provided
    if (roomId) {
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(400).json({ message: 'Room not found' });
      }
      if (room.tenant) {
        return res.status(400).json({ message: `Room ${room.roomNumber} is already occupied` });
      }
    }

    const tenant = await User.create({
      name,
      email,
      password,
      role: 'tenant',
      phone: phone || '',
      room: roomId || null,
    });

    // Update room if assigned
    if (roomId) {
      await Room.findByIdAndUpdate(roomId, {
        tenant: tenant._id,
        status: 'occupied',
      });
    }

    const populated = await tenant.populate('room', 'roomNumber floor status');

    res.status(201).json({ tenant: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update tenant
// @route   PUT /api/tenants/:id
// @access  Private (admin)
const updateTenant = async (req, res, next) => {
  try {
    const tenant = await User.findById(req.params.id);

    if (!tenant || tenant.role !== 'tenant') {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const { name, email, phone, roomId } = req.body;

    // Check email uniqueness if changed
    if (email && email !== tenant.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Handle room reassignment
    const currentRoomId = tenant.room ? tenant.room.toString() : null;
    const newRoomId = roomId === undefined ? currentRoomId : (roomId || null);

    if (newRoomId !== currentRoomId) {
      // Unassign from old room
      if (currentRoomId) {
        await Room.findByIdAndUpdate(currentRoomId, {
          tenant: null,
          status: 'vacant',
        });
      }

      // Assign to new room
      if (newRoomId) {
        const newRoom = await Room.findById(newRoomId);
        if (!newRoom) {
          return res.status(400).json({ message: 'Room not found' });
        }
        if (newRoom.tenant && newRoom.tenant.toString() !== tenant._id.toString()) {
          return res.status(400).json({ message: `Room ${newRoom.roomNumber} is already occupied` });
        }
        await Room.findByIdAndUpdate(newRoomId, {
          tenant: tenant._id,
          status: 'occupied',
        });
      }

      tenant.room = newRoomId;
    }

    tenant.name = name ?? tenant.name;
    tenant.email = email ?? tenant.email;
    tenant.phone = phone ?? tenant.phone;

    await tenant.save();

    const populated = await tenant.populate('room', 'roomNumber floor status');
    res.json({ tenant: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete tenant
// @route   DELETE /api/tenants/:id
// @access  Private (admin)
const deleteTenant = async (req, res, next) => {
  try {
    const tenant = await User.findById(req.params.id);

    if (!tenant || tenant.role !== 'tenant') {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Unassign from room first
    if (tenant.room) {
      await Room.findByIdAndUpdate(tenant.room, {
        tenant: null,
        status: 'vacant',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllTenants, getTenantById, createTenant, updateTenant, deleteTenant };
