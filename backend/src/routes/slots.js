import express from 'express';
import {
    getAvailableSlots,
    generateSlots,
    toggleBlockSlot,
    updateSlotTiming,
    getAllSlots,
    deleteSlot,
} from '../controllers/slotController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/available', getAvailableSlots);

// Admin routes
router.get('/', verifyToken, isAdmin, getAllSlots);
router.post('/generate', verifyToken, isAdmin, generateSlots);
router.patch('/:id/block', verifyToken, isAdmin, toggleBlockSlot);
router.patch('/:id/timing', verifyToken, isAdmin, updateSlotTiming);
router.delete('/:id', verifyToken, isAdmin, deleteSlot);

export default router;
