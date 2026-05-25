const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
    enum: ['January', 'February', 'March', 'April', 'May', 'June',
           'July', 'August', 'September', 'October', 'November', 'December'],
    required: true,
  },
  amountDue: {
    type: Number,
    required: true,
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  datePaid: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

paymentSchema.index({ tenant: 1, year: 1, month: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
