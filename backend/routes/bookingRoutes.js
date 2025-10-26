const express = require('express');
const { 
  getAllBookings, 
  getBookingById, 
  createBooking, 
  updateBooking, 
  partialUpdateBooking, 
  deleteBooking 
} = require('../controllers/bookingController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateBooking } = require('../middleware/validationMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', validateBooking, createBooking);

// Protected routes (require authentication)
router.put('/:id', authenticateToken, validateBooking, updateBooking);
router.patch('/:id', authenticateToken, partialUpdateBooking);
router.delete('/:id', authenticateToken, deleteBooking);

module.exports = router;