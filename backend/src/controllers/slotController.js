import prisma from '../config/database.js';

// @desc    Get available slots for a specific date
// @route   GET /api/slots/available
// @access  Public
export const getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date is required',
            });
        }

        const slots = await prisma.slot.findMany({
            where: {
                date: new Date(date),
                isBooked: false,
                isBlocked: false,
            },
            orderBy: { startTime: 'asc' },
        });

        res.json({
            success: true,
            count: slots.length,
            data: slots,
        });
    } catch (error) {
        console.error('Get available slots error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching slots',
        });
    }
};

// @desc    Generate slots for a date range
// @route   POST /api/slots/generate
// @access  Private/Admin
export const generateSlots = async (req, res) => {
    try {
        const { startDate, endDate, timeSlots } = req.body;

        // timeSlots format: [{ startTime: "09:00", endTime: "10:00" }, ...]

        if (!startDate || !endDate || !timeSlots || timeSlots.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const slotsToCreate = [];

        // Generate slots for each day in the range
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            for (const timeSlot of timeSlots) {
                slotsToCreate.push({
                    date: new Date(date),
                    startTime: timeSlot.startTime,
                    endTime: timeSlot.endTime,
                    isBooked: false,
                    isBlocked: false,
                });
            }
        }

        // Create slots (skip duplicates)
        const createdSlots = [];
        for (const slot of slotsToCreate) {
            try {
                const created = await prisma.slot.create({
                    data: slot,
                });
                createdSlots.push(created);
            } catch (error) {
                // Skip if slot already exists (unique constraint violation)
                if (error.code !== 'P2002') {
                    throw error;
                }
            }
        }

        res.status(201).json({
            success: true,
            message: `${createdSlots.length} slots generated successfully`,
            data: createdSlots,
        });
    } catch (error) {
        console.error('Generate slots error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error generating slots',
        });
    }
};

// @desc    Block/Unblock slot
// @route   PATCH /api/slots/:id/block
// @access  Private/Admin
export const toggleBlockSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const { isBlocked } = req.body;

        const slot = await prisma.slot.findUnique({
            where: { id },
        });

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: 'Slot not found',
            });
        }

        if (slot.isBooked && isBlocked) {
            return res.status(400).json({
                success: false,
                message: 'Cannot block a booked slot. Cancel the booking first.',
            });
        }

        const updatedSlot = await prisma.slot.update({
            where: { id },
            data: { isBlocked },
        });

        res.json({
            success: true,
            message: `Slot ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
            data: updatedSlot,
        });
    } catch (error) {
        console.error('Toggle block slot error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating slot',
        });
    }
};

// @desc    Update slot timing
// @route   PATCH /api/slots/:id/timing
// @access  Private/Admin
export const updateSlotTiming = async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime, endTime } = req.body;

        const slot = await prisma.slot.findUnique({
            where: { id },
        });

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: 'Slot not found',
            });
        }

        if (slot.isBooked) {
            return res.status(400).json({
                success: false,
                message: 'Cannot modify timing of a booked slot',
            });
        }

        const updatedSlot = await prisma.slot.update({
            where: { id },
            data: {
                ...(startTime && { startTime }),
                ...(endTime && { endTime }),
            },
        });

        res.json({
            success: true,
            message: 'Slot timing updated successfully',
            data: updatedSlot,
        });
    } catch (error) {
        console.error('Update slot timing error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating slot timing',
        });
    }
};

// @desc    Get all slots for admin (with filters)
// @route   GET /api/slots
// @access  Private/Admin
export const getAllSlots = async (req, res) => {
    try {
        const { date, isBooked, isBlocked } = req.query;

        const where = {
            ...(date && { date: new Date(date) }),
            ...(isBooked !== undefined && { isBooked: isBooked === 'true' }),
            ...(isBlocked !== undefined && { isBlocked: isBlocked === 'true' }),
        };

        const slots = await prisma.slot.findMany({
            where,
            include: {
                booking: {
                    select: {
                        id: true,
                        totalAmount: true,
                        status: true,
                        paymentStatus: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
            orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        });

        res.json({
            success: true,
            count: slots.length,
            data: slots,
        });
    } catch (error) {
        console.error('Get all slots error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching slots',
        });
    }
};

// @desc    Delete slot
// @route   DELETE /api/slots/:id
// @access  Private/Admin
export const deleteSlot = async (req, res) => {
    try {
        const { id } = req.params;

        const slot = await prisma.slot.findUnique({
            where: { id },
        });

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: 'Slot not found',
            });
        }

        if (slot.isBooked) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete a booked slot. Cancel the booking first.',
            });
        }

        await prisma.slot.delete({
            where: { id },
        });

        res.json({
            success: true,
            message: 'Slot deleted successfully',
        });
    } catch (error) {
        console.error('Delete slot error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting slot',
        });
    }
};
