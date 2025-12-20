import prisma from '../config/database.js';
import { sendBookingConfirmation } from '../utils/emailService.js';

// Pure Mock Payment Controller - No external payment gateway required
// This simulates payment processing for testing purposes

// @desc    Create mock payment order
// @route   POST /api/payment/create-order
// @access  Private
export const createOrder = async (req, res) => {
    try {
        // Support both single slot (slotId) and multiple slots (slotIds)
        const { slotId, slotIds } = req.body;
        const userId = req.user.id;

        // Convert single slot to array for uniform processing
        const slotIdsArray = slotIds || (slotId ? [slotId] : []);

        if (!slotIdsArray || slotIdsArray.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one slot must be selected',
            });
        }

        // Get turf settings for price
        const turfSettings = await prisma.turfSettings.findFirst();

        // Validate all slots and calculate total amount
        const slots = await prisma.slot.findMany({
            where: { id: { in: slotIdsArray } },
        });

        // Check if all requested slots exist
        if (slots.length !== slotIdsArray.length) {
            return res.status(404).json({
                success: false,
                message: 'One or more slots not found',
            });
        }

        // Check if any slot is already booked or blocked
        const unavailableSlot = slots.find(slot => slot.isBooked || slot.isBlocked);
        if (unavailableSlot) {
            return res.status(400).json({
                success: false,
                message: unavailableSlot.isBooked
                    ? 'One or more slots are already booked'
                    : 'One or more slots are blocked by admin',
            });
        }

        // Calculate total amount (price per slot)
        const totalAmount = turfSettings.pricePerHour * slots.length;
        const amountInPaise = totalAmount * 100; // Convert to paise

        // Create mock order ID
        const mockOrderId = `order_mock_${Date.now()}`;

        // Create pending bookings for all slots in a transaction
        const bookings = await prisma.$transaction(
            slotIdsArray.map(slotId =>
                prisma.booking.create({
                    data: {
                        userId,
                        slotId,
                        totalAmount: turfSettings.pricePerHour,
                        status: 'PENDING',
                        paymentStatus: 'PENDING',
                        orderId: mockOrderId,
                    },
                })
            )
        );

        res.json({
            success: true,
            data: {
                orderId: mockOrderId,
                amount: amountInPaise,
                currency: 'INR',
                bookingIds: bookings.map(b => b.id),
                bookingId: bookings[0].id, // For backward compatibility
                slotCount: slots.length,
                totalAmount: totalAmount,
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
        // Support both single booking (bookingId) and multiple bookings (bookingIds)
        const { paymentId, bookingId, bookingIds } = req.body;

        // Convert single booking to array for uniform processing
        const bookingIdsArray = bookingIds || (bookingId ? [bookingId] : []);

        if (!bookingIdsArray || bookingIdsArray.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one booking ID must be provided',
            });
        }

        // Mock payment ID if not provided
        const mockPaymentId = paymentId || `pay_mock_${Date.now()}`;

        // Update all bookings and slots in a transaction
        const bookings = await prisma.$transaction(async (tx) => {
            // Update all bookings
            const updatedBookings = await Promise.all(
                bookingIdsArray.map(id =>
                    tx.booking.update({
                        where: { id },
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
                    })
                )
            );

            // Mark all slots as booked
            await Promise.all(
                updatedBookings.map(booking =>
                    tx.slot.update({
                        where: { id: booking.slotId },
                        data: { isBooked: true },
                    })
                )
            );

            return updatedBookings;
        });

        // Get turf settings
        const turfSettings = await prisma.turfSettings.findFirst();

        // Send confirmation email (if email is configured)
        try {
            // Prepare slot details for email
            const slotDetails = bookings.map(b => ({
                date: b.slot.date,
                startTime: b.slot.startTime,
                endTime: b.slot.endTime,
            }));

            // Calculate total amount
            const totalAmount = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

            await sendBookingConfirmation(bookings[0].user.email, {
                bookingId: bookings[0].id,
                bookingIds: bookings.map(b => b.id),
                turfName: turfSettings.name,
                date: bookings[0].slot.date,
                startTime: bookings[0].slot.startTime,
                endTime: bookings[0].slot.endTime,
                slots: slotDetails,
                slotCount: bookings.length,
                totalAmount: totalAmount,
                userName: bookings[0].user.name,
            });
        } catch (emailError) {
            console.log('Email not sent (email service not configured):', emailError.message);
        }

        res.json({
            success: true,
            message: `Payment verified and ${bookings.length} booking(s) confirmed`,
            data: {
                bookings,
                slotCount: bookings.length,
            },
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error verifying payment',
        });
    }
};
