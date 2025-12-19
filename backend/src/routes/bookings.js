import express from 'express';
import {
    getUserBookings,
    getAllBookings,
    updateBookingStatus,
    cancelBooking,
} from '../controllers/bookingController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.get('/my-bookings', verifyToken, getUserBookings);
router.delete('/:id', verifyToken, cancelBooking);

// Admin routes
router.get('/', verifyToken, isAdmin, getAllBookings);
router.patch('/:id', verifyToken, isAdmin, updateBookingStatus);

export default router;
