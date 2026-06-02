const Payment = require('../models/Payment');
const User = require('../models/User');
const Room = require('../models/Room');

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Helper: get total paid for a tenant+year+month
const getTotalPaidForMonth = async (tenantId, year, month) => {
  const entries = await Payment.find({ tenant: tenantId, year, month });
  return entries.reduce((sum, e) => sum + e.amountPaid, 0);
};

// Helper: smart allocation — always creates NEW rows, never modifies existing
const smartAllocate = async (tenantId, roomId, year, month, amount, datePaid) => {
  const room = await Room.findById(roomId);
  if (!room) return [];

  const rentAmount = room.rentAmount;
  let remaining = amount;
  const created = [];

  // Step 1: Find all previous months with outstanding balance
  const currentMonthIndex = MONTHS.indexOf(month);
  const previousMonths = [];

  for (let i = 0; i < currentMonthIndex; i++) {
    const m = MONTHS[i];
    const totalPaid = await getTotalPaidForMonth(tenantId, year, m);
    const outstanding = rentAmount - totalPaid;
    if (outstanding > 0) {
      previousMonths.push({ month: m, outstanding });
    }
  }

  // Step 2: Clear previous outstanding (oldest first) — NEW rows only
  for (const prev of previousMonths) {
    if (remaining <= 0) break;

    const toApply = Math.min(remaining, prev.outstanding);
    remaining -= toApply;

    const entry = await Payment.create({
      tenant: tenantId,
      room: roomId,
      year,
      month: prev.month,
      amountDue: rentAmount,
      amountPaid: toApply,
      datePaid,
    });
    created.push(entry);
  }

  // Step 3: Apply remaining to current month — NEW row
  const currentTotalPaid = await getTotalPaidForMonth(tenantId, year, month);
  const currentOutstanding = rentAmount - currentTotalPaid;
  const toApplyCurrent = Math.min(remaining, currentOutstanding);

  if (toApplyCurrent > 0) {
    remaining -= toApplyCurrent;

    const entry = await Payment.create({
      tenant: tenantId,
      room: roomId,
      year,
      month,
      amountDue: rentAmount,
      amountPaid: toApplyCurrent,
      datePaid,
    });
    created.push(entry);
  }

  // Step 4: If still remaining, carry forward to future months — NEW rows
  if (remaining > 0) {
    let monthIndex = currentMonthIndex;
    let fwdYear = year;

    while (remaining > 0) {
      monthIndex += 1;
      if (monthIndex > 11) {
        monthIndex = 0;
        fwdYear += 1;
      }
      const fwdMonth = MONTHS[monthIndex];
      const fwdPaid = await getTotalPaidForMonth(tenantId, fwdYear, fwdMonth);
      const fwdOutstanding = rentAmount - fwdPaid;
      const toApplyFwd = Math.min(remaining, fwdOutstanding);

      if (toApplyFwd <= 0) break;

      remaining -= toApplyFwd;

      const entry = await Payment.create({
        tenant: tenantId,
        room: roomId,
        year: fwdYear,
        month: fwdMonth,
        amountDue: rentAmount,
        amountPaid: toApplyFwd,
        datePaid,
      });
      created.push(entry);
    }
  }

  return created;
};

// @desc    Get all payment entries for a tenant in a year
// @route   GET /api/payments?tenantId=X&year=2026
// @access  Private (admin)
const getPayments = async (req, res, next) => {
  try {
    const { tenantId, year } = req.query;

    // If no tenantId, return all payments (for heatmap, notifications, etc.)
    if (!tenantId) {
      const filter = {};
      if (year) filter.year = Number(year);
      const payments = await Payment.find(filter)
        .populate('tenant', 'name')
        .populate('room', 'roomNumber')
        .sort({ month: 1, datePaid: 1 });
      return res.json({ payments });
    }

    if (!year) {
      return res.status(400).json({ message: 'year is required when tenantId is provided' });
    }

    const payments = await Payment.find({
      tenant: tenantId,
      year: Number(year),
    }).sort({ month: 1, datePaid: 1 });

    res.json({ payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a payment entry with smart allocation
// @route   POST /api/payments
// @access  Private (admin)
const createPayment = async (req, res, next) => {
  try {
    const { tenantId, year, month, amountPaid, datePaid } = req.body;

    if (!tenantId || !year || !month) {
      return res.status(400).json({ message: 'tenantId, year, and month are required' });
    }

    const tenant = await User.findById(tenantId);
    if (!tenant || tenant.role !== 'tenant') {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    if (!tenant.room) {
      return res.status(400).json({ message: 'Tenant is not assigned to a room' });
    }

    const room = await Room.findById(tenant.room);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const paidAmount = Number(amountPaid) || 0;
    const parsedDate = datePaid ? new Date(datePaid) : null;

    // Smart allocation: create new rows for outstanding, current, and forward
    const allocated = await smartAllocate(
      tenantId, room._id, Number(year), month, paidAmount, parsedDate
    );

    // Return all payments for this tenant+year
    const payments = await Payment.find({
      tenant: tenantId,
      year: Number(year),
    }).sort({ month: 1, datePaid: 1 });

    res.status(201).json({ allocated, payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a payment entry with smart allocation
// @route   PUT /api/payments/:id
// @access  Private (admin)
const updatePayment = async (req, res, next) => {
  try {
    const { amountPaid, datePaid } = req.body;

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const newAmount = amountPaid !== undefined ? Number(amountPaid) : payment.amountPaid;
    const newDate = datePaid !== undefined ? (datePaid ? new Date(datePaid) : null) : payment.datePaid;

    // If overpaid, cap this entry and create new rows for overflow
    if (newAmount > payment.amountDue) {
      payment.amountPaid = payment.amountDue;
      payment.datePaid = newDate;
      await payment.save();

      const overflow = newAmount - payment.amountDue;
      const allocated = await smartAllocate(
        payment.tenant, payment.room, payment.year, payment.month, overflow, newDate
      );

      const payments = await Payment.find({ tenant: payment.tenant, year: payment.year }).sort({ month: 1, datePaid: 1 });
      return res.json({ payment, allocated, payments });
    }

    // Normal update — just change this entry
    payment.amountPaid = newAmount;
    payment.datePaid = newDate;
    await payment.save();

    const payments = await Payment.find({ tenant: payment.tenant, year: payment.year }).sort({ month: 1, datePaid: 1 });
    res.json({ payment, payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a payment entry
// @route   DELETE /api/payments/:id
// @access  Private (admin)
const deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Payment deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPayments, createPayment, updatePayment, deletePayment };
