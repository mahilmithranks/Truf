import prisma from '../config/database.js';
import { sendBookingConfirmation } from '../utils/emailService.js';

// Confirm payment and create booking
export const confirmPayment = async (req, res) => {
    try {
        const { turfId, date, slots, sport, players, totalAmount } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!turfId || !date || !slots || slots.length === 0 || !sport) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Get turf details
        const turf = await prisma.turf.findUnique({
            where: { id: turfId }
        });

        if (!turf) {
            return res.status(404).json({
                success: false,
                message: 'Turf not found'
            });
        }

        // Get user details
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        // Create bookings in a transaction
        const bookings = await prisma.$transaction(async (tx) => {
            const createdBookings = [];

            for (const slotData of slots) {
                // Find or create slot
                let slot = await tx.slot.findFirst({
                    where: {
                        turfId: turfId,
                        date: new Date(date),
                        startTime: slotData.startTime,
                        endTime: slotData.endTime
                    }
                });

                if (!slot) {
                    // Create slot if it doesn't exist
                    slot = await tx.slot.create({
                        data: {
                            turfId: turfId,
                            date: new Date(date),
                            startTime: slotData.startTime,
                            endTime: slotData.endTime,
                            isBooked: true
                        }
                    });
                } else {
                    // Check if slot is already booked
                    if (slot.isBooked) {
                        throw new Error(`Slot ${slotData.startTime} - ${slotData.endTime} is already booked`);
                    }

                    // Mark slot as booked
                    slot = await tx.slot.update({
                        where: { id: slot.id },
                        data: { isBooked: true }
                    });
                }

                // Generate unique booking reference
                const timestamp = Date.now().toString().slice(-6);
                const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                const bookingRef = `TRF${timestamp}${random}`;

                // Create booking
                const booking = await tx.booking.create({
                    data: {
                        userId: userId,
                        turfId: turfId,
                        slotId: slot.id,
                        sport: sport,
                        players: players,
                        totalAmount: turf.pricePerHour,
                        status: 'CONFIRMED',
                        paymentStatus: 'COMPLETED',
                        orderId: bookingRef // Store booking reference in orderId field
                    }
                });

                createdBookings.push(booking);
            }

            return createdBookings;
        });

        // Send confirmation email
        try {
            await sendBookingConfirmation(user.email, {
                userName: user.name,
                turfName: turf.name,
                turfLocation: `${turf.address}, ${turf.city}`,
                date: new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                slots: slots.map(s => `${s.startTime} - ${s.endTime}`),
                sport: sport,
                players: players,
                totalAmount: totalAmount,
                bookingId: bookings[0].id
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the booking if email fails
        }

        res.status(200).json({
            success: true,
            message: 'Booking confirmed successfully',
            data: {
                bookings: bookings,
                bookingCount: bookings.length
            }
        });

    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to confirm payment'
        });
    }
};
