import express from 'express';
import {
    getAllTurfs,
    getTurfById,
    getTurfSlots,
    getTurfSettings,
    updateTurfSettings
} from '../controllers/turfController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes - Client facing
router.get('/list', getAllTurfs);                    // GET /api/turfs/list - Get all turfs
router.get('/:id', getTurfById);                     // GET /api/turfs/:id - Get turf details
router.get('/:id/slots', getTurfSlots);              // GET /api/turfs/:id/slots?date=YYYY-MM-DD

// Legacy routes (keeping for backward compatibility)
router.get('/', getTurfSettings);

// Admin routes (for future admin panel)
router.put('/', verifyToken, isAdmin, updateTurfSettings);

export default router;
