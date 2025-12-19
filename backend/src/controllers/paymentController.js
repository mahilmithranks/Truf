import prisma from '../config/database.js';
import { sendBookingConfirmation } from '../utils/emailService.js';

// Pure Mock Payment Controller - No external payment gateway required
// This simulates payment processing for testing purposes

// @desc    Create mock payment order
// @route   POST /api/payment/create-order
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { slotId } = req.body;
        const userId = req.user.id;

        // Get slot details
        const slot = await prisma.slot.findUnique({
            where: { id: slotId },
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
                message: 'Slot is already booked',
            });
        }

        if (slot.isBlocked) {
            return res.status(400).json({
                success: false,
                message: 'Slot is blocked by admin',
            });
        }

        // Get turf settings for price
        const turfSettings = await prisma.turfSettings.findFirst();
        const amount = turfSettings.pricePerHour * 100; // Convert to paise

        // Create mock order ID
        const mockOrderId = `order_mock_${Date.now()}`;

        // Create pending booking
        const booking = await prisma.booking.create({
            data: {
                userId,
                slotId,
                totalAmount: turfSettings.pricePerHour,
                status: 'PENDING',
                paymentStatus: 'PENDING',
                orderId: mockOrderId,
            },
        });

        res.json({
            success: true,
            data: {
                orderId: mockOrderId,
                amount: amount,
                currency: 'INR',
                bookingId: booking.id,
            },
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating order',
        });
    }
};

// @desc    Verify mock payment and confirm booking
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req, res) => {
    try {
        const { paymentId, bookingId } = req.body;

        // Mock payment ID if not provided
        const mockPaymentId = paymentId || `pay_mock_${Date.now()}`;

        // Update booking and slot
        const booking = await prisma.$transaction(async (tx) => {
            // Update booking
            const updatedBooking = await tx.booking.update({
                where: { id: bookingId },
                data: {
                    paymentId: mockPaymentId,
                    paymentStatus: 'COMPLETED',
                    status: 'CONFIRMED',
                },
                include: {
                    slot: true,
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            });

            // Mark slot as booked
            await tx.slot.update({
                where: { id: updatedBooking.slotId },
                data: { isBooked: true },
            });

            return updatedBooking;
        });

        // Get turf settings
        const turfSettings = await prisma.turfSettings.findFirst();

        // Send confirmation email (if email is configured)
        try {
            await sendBookingConfirmation(booking.user.email, {
                bookingId: booking.id,
                turfName: turfSettings.name,
                date: booking.slot.date,
                startTime: booking.slot.startTime,
                endTime: booking.slot.endTime,
                totalAmount: booking.totalAmount,
                userName: booking.user.name,
            });
        } catch (emailError) {
            console.log('Email not sent (email service not configured):', emailError.message);
        }

        res.json({
            success: true,
            message: 'Payment verified and booking confirmed',
            data: booking,
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error verifying payment',
        });
    }
};
