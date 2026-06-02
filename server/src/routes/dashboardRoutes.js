const express = require('express');
const { getStats } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

const router = express.Router();

router.get('/stats', auth, authorize('admin', 'viewer'), getStats);

module.exports = router;
