const express = require('express');
const { healthCheck } = require('../controllers/healthController');

const router = express.Router();

// GET /ping - Health check
router.get('/', healthCheck);

module.exports = router;