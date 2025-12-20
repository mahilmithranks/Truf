import prisma from '../config/database.js';

// @desc    Get all turfs
// @route   GET /api/turfs/list
// @access  Public
export const getAllTurfs = async (req, res) => {
    try {
        const { city, sport, minPrice, maxPrice, search } = req.query;

        // Build filter object
        const where = {
            status: 'ACTIVE'
        };

        if (city) {
            where.city = { equals: city, mode: 'insensitive' };
        }

        if (sport) {
            where.sports = { has: sport };
        }

        if (minPrice || maxPrice) {
            where.pricePerHour = {};
            if (minPrice) where.pricePerHour.gte = parseFloat(minPrice);
            if (maxPrice) where.pricePerHour.lte = parseFloat(maxPrice);
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } }
            ];
        }

        const turfs = await prisma.turf.findMany({
            where,
            orderBy: [
                { rating: 'desc' },
                { totalReviews: 'desc' }
            ]
        });

        res.json({
            success: true,
            count: turfs.length,
            data: turfs
        });
    } catch (error) {
        console.error('Get all turfs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching turfs'
        });
    }
};

// @desc    Get turf by ID
// @route   GET /api/turfs/:id
// @access  Public
export const getTurfById = async (req, res) => {
    try {
        const { id } = req.params;

        const turf = await prisma.turf.findUnique({
            where: { id }
        });

        if (!turf) {
            return res.status(404).json({
                success: false,
                message: 'Turf not found'
            });
        }

        res.json({
            success: true,
            data: turf
        });
    } catch (error) {
        console.error('Get turf by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching turf details'
        });
    }
};

// @desc    Get available slots for a turf
// @route   GET /api/turfs/:id/slots?date=YYYY-MM-DD
// @access  Public
export const getTurfSlots = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date parameter is required'
            });
        }

        // Get turf to check availability
        const turf = await prisma.turf.findUnique({
            where: { id }
        });

        if (!turf) {
            return res.status(404).json({
                success: false,
                message: 'Turf not found'
            });
        }

        // Parse date
        const selectedDate = new Date(date);
        const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const availability = turf.availability[dayName];

        if (!availability) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date'
            });
        }

        // Generate time slots
        const slots = [];
        const openHour = parseInt(availability.open.split(':')[0]);
        const closeHour = parseInt(availability.close.split(':')[0]);

        for (let hour = openHour; hour < closeHour; hour++) {
            const startTime = `${hour.toString().padStart(2, '0')}:00`;
            const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

            // Check if slot is already booked
            const existingSlot = await prisma.slot.findFirst({
                where: {
                    turfId: id,
                    date: selectedDate,
                    startTime,
                    isBooked: true
                }
            });

            slots.push({
                startTime,
                endTime,
                isAvailable: !existingSlot,
                price: turf.pricePerHour
            });
        }

        res.json({
            success: true,
            data: {
                turfId: id,
                turfName: turf.name,
                date,
                slots
            }
        });
    } catch (error) {
        console.error('Get turf slots error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching slots'
        });
    }
};

// @desc    Get turf settings
// @route   GET /api/turf
// @access  Public
export const getTurfSettings = async (req, res) => {
    try {
        const settings = await prisma.turfSettings.findFirst({
            where: { isActive: true },
        });

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: 'Turf settings not found. Please configure turf settings.',
            });
        }

        res.json({
            success: true,
            data: settings,
        });
    } catch (error) {
        console.error('Get turf settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching turf settings',
        });
    }
};

// @desc    Update turf settings
// @route   PUT /api/turf
// @access  Private/Admin
export const updateTurfSettings = async (req, res) => {
    try {
        const {
            name,
            description,
            location,
            pricePerHour,
            images,
            amenities,
            contactEmail,
            contactPhone,
            openTime,
            closeTime,
            slotDuration,
        } = req.body;

        // Get existing settings or create new
        let settings = await prisma.turfSettings.findFirst();

        if (settings) {
            // Update existing
            settings = await prisma.turfSettings.update({
                where: { id: settings.id },
                data: {
                    ...(name && { name }),
                    ...(description !== undefined && { description }),
                    ...(location && { location }),
                    ...(pricePerHour && { pricePerHour: parseFloat(pricePerHour) }),
                    ...(images && { images }),
                    ...(amenities && { amenities }),
                    ...(contactEmail && { contactEmail }),
                    ...(contactPhone && { contactPhone }),
                    ...(openTime && { openTime }),
                    ...(closeTime && { closeTime }),
                    ...(slotDuration && { slotDuration: parseInt(slotDuration) }),
                },
            });
        } else {
            // Create new
            settings = await prisma.turfSettings.create({
                data: {
                    name: name || 'My Turf',
                    description,
                    location: location || 'Location',
                    pricePerHour: parseFloat(pricePerHour) || 500,
                    images: images || [],
                    amenities: amenities || [],
                    contactEmail: contactEmail || 'contact@turf.com',
                    contactPhone: contactPhone || '1234567890',
                    openTime: openTime || '06:00',
                    closeTime: closeTime || '23:00',
                    slotDuration: parseInt(slotDuration) || 60,
                },
            });
        }

        res.json({
            success: true,
            message: 'Turf settings updated successfully',
            data: settings,
        });
    } catch (error) {
        console.error('Update turf settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating turf settings',
        });
    }
};
