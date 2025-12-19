import express from 'express';
import {
    getDashboardStats,
    getMonthlyRevenue,
    getRecentBookings,
} from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes are admin-only
router.use(verifyToken, isAdmin);

router.get('/stats', getDashboardStats);
router.get('/revenue/monthly', getMonthlyRevenue);
router.get('/bookings/recent', getRecentBookings);

export default router;
