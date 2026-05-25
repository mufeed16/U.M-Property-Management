const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    required: [true, 'Room number is required'],
    unique: true,
  },
  floor: {
    type: String,
    enum: ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor', 'Fourth Floor', 'Fifth Floor'],
    default: 'Ground Floor',
  },
  capacity: {
    type: Number,
    default: 1,
  },
  rentAmount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['occupied', 'vacant', 'maintenance'],
    default: 'vacant',
  },
  amenities: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: '',
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
