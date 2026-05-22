const Room = require('../models/Room');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private (admin)
const getStats = async (req, res, next) => {
  try {
    const [totalRooms, occupiedRooms, vacantRooms, maintenanceRooms, totalTenants] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments({ status: 'occupied' }),
      Room.countDocuments({ status: 'vacant' }),
      Room.countDocuments({ status: 'maintenance' }),
      User.countDocuments({ role: 'tenant' }),
    ]);

    res.json({
      totalRooms,
      occupiedRooms,
      vacantRooms,
      maintenanceRooms,
      totalTenants,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
