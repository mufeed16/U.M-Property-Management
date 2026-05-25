const express = require('express');
const { getPayments, createPayment, updatePayment, deletePayment } = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

const router = express.Router();

router.get('/', auth, authorize('admin'), getPayments);
router.post('/', auth, authorize('admin'), createPayment);
router.put('/:id', auth, authorize('admin'), updatePayment);
router.delete('/:id', auth, authorize('admin'), deletePayment);

module.exports = router;
