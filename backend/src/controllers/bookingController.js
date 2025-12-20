import prisma from '../config/database.js';
import { sendBookingCancellation } from '../utils/emailService.js';

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                slot: true,
                turf: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        // Get turf settings
        const turfSettings = await prisma.turfSettings.findFirst();

        res.json({
            success: true,
            count: bookings.length,
            data: {
                bookings,
                turfInfo: turfSettings,
            },
        });
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching bookings',
        });
    }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
    try {
        const { status, paymentStatus, startDate, endDate } = req.query;

        const where = {
            ...(status && { status }),
            ...(paymentStatus && { paymentStatus }),
            ...(startDate &&
                endDate && {
                slot: {
                    date: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
            }),
        };

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                slot: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching bookings',
        });
    }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await prisma.booking.update({
            where: { id },
            data: { status },
            include: {
                slot: true,
                user: true,
            },
        });

        res.json({
            success: true,
            message: 'Booking status updated successfully',
            data: booking,
        });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating booking',
        });
    }
};

// @desc    Cancel booking (Admin can cancel any, User can cancel own)
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'ADMIN';

        // Get booking with turf data
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                slot: true,
                user: true,
                turf: true,
            },
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }

        // Check if user owns the booking or is admin
        if (booking.userId !== userId && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking',
            });
        }

        if (booking.status === 'CANCELLED') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled',
            });
        }

        // Calculate time difference between now and booking creation
        const now = new Date();
        const bookingTime = new Date(booking.createdAt);
        const hoursSinceBooking = (now - bookingTime) / (1000 * 60 * 60); // Convert to hours

        // Determine refund status based on 2-hour policy
        let refundStatus = 'FAILED';
        let refundMessage = '';

        if (hoursSinceBooking <= 2) {
            // Within 2 hours - 100% refund
            refundStatus = booking.paymentStatus === 'COMPLETED' ? 'REFUNDED' : 'FAILED';
            refundMessage = 'Full refund will be processed within 5-7 business days.';
        } else {
            // After 2 hours - No refund
            refundStatus = 'FAILED';
            refundMessage = 'No refund available as cancellation is after 2 hours of booking.';
        }

        // Cancel booking and free up slot
        await prisma.$transaction(async (tx) => {
            await tx.booking.update({
                where: { id },
                data: {
                    status: 'CANCELLED',
                    paymentStatus: refundStatus,
                },
            });

            await tx.slot.update({
                where: { id: booking.slotId },
                data: { isBooked: false },
            });
        });

        // Send cancellation email
        try {
            await sendBookingCancellation(booking.user.email, {
                bookingId: booking.id,
                turfName: booking.turf?.name || 'Turf',
                date: booking.slot.date,
                startTime: booking.slot.startTime,
                endTime: booking.slot.endTime,
                userName: booking.user.name,
                cancelledBy: isAdmin ? 'Admin' : 'You',
                refundStatus: refundStatus,
                refundMessage: refundMessage,
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the cancellation if email fails
        }

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            refundStatus: refundStatus,
            refundMessage: refundMessage,
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error cancelling booking',
        });
    }
};
