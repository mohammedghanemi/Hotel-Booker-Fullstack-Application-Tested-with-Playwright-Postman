const express = require('express');
const { createToken } = require('../controllers/authController');

const router = express.Router();

// POST /auth - Create token
router.post('/', createToken);

module.exports = router;