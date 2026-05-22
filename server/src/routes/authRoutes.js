const express = require('express');
const { login, getMe, register } = require('../controllers/authController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

const router = express.Router();

router.post('/login', login);
router.get('/me', auth, getMe);
router.post('/register', auth, authorize('admin'), register);

module.exports = router;
