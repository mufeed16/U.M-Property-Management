const express = require('express');
const {
  getAllTenants,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant,
} = require('../controllers/tenantController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

const router = express.Router();

router.get('/', auth, authorize('admin', 'viewer'), getAllTenants);
router.get('/:id', auth, getTenantById);
router.post('/', auth, authorize('admin'), createTenant);
router.put('/:id', auth, authorize('admin'), updateTenant);
router.delete('/:id', auth, authorize('admin'), deleteTenant);

module.exports = router;
