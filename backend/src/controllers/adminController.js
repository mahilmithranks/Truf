import prisma from '../config/database.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Total bookings
        const totalBookings = await prisma.booking.count();

        // Monthly bookings
        const monthlyBookings = await prisma.booking.count({
            where: {
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        });

        // Total revenue
        const totalRevenueData = await prisma.booking.aggregate({
            where: {
                paymentStatus: 'COMPLETED',
            },
            _sum: {
                totalAmount: true,
            },
        });

        // Monthly revenue
        const monthlyRevenueData = await prisma.booking.aggregate({
            where: {
                paymentStatus: 'COMPLETED',
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
            _sum: {
                totalAmount: true,
            },
        });

        // Upcoming bookings
        const upcomingBookings = await prisma.booking.count({
            where: {
                status: 'CONFIRMED',
                slot: {
                    date: {
                        gte: now,
                    },
                },
            },
        });

        // Cancelled bookings this month
        const cancelledBookings = await prisma.booking.count({
            where: {
                status: 'CANCELLED',
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        });

        // Pending payments
        const pendingPayments = await prisma.booking.count({
            where: {
                paymentStatus: 'PENDING',
            },
        });

        res.json({
            success: true,
            data: {
                totalBookings,
                monthlyBookings,
                totalRevenue: totalRevenueData._sum.totalAmount || 0,
                monthlyRevenue: monthlyRevenueData._sum.totalAmount || 0,
                upcomingBookings,
                cancelledBookings,
                pendingPayments,
            },
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching stats',
        });
    }
};

// @desc    Get monthly revenue breakdown
// @route   GET /api/admin/revenue/monthly
// @access  Private/Admin
export const getMonthlyRevenue = async (req, res) => {
    try {
        const { year } = req.query;
        const targetYear = year ? parseInt(year) : new Date().getFullYear();

        const monthlyData = [];

        for (let month = 0; month < 12; month++) {
            const startOfMonth = new Date(targetYear, month, 1);
            const endOfMonth = new Date(targetYear, month + 1, 0);

            const revenue = await prisma.booking.aggregate({
                where: {
                    paymentStatus: 'COMPLETED',
                    createdAt: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                },
                _sum: {
                    totalAmount: true,
                },
                _count: {
                    id: true,
                },
            });

            monthlyData.push({
                month: month + 1,
                monthName: new Date(targetYear, month).toLocaleString('default', { month: 'long' }),
                revenue: revenue._sum.totalAmount || 0,
                bookings: revenue._count.id,
            });
        }

        res.json({
            success: true,
            data: {
                year: targetYear,
                months: monthlyData,
                totalRevenue: monthlyData.reduce((sum, m) => sum + m.revenue, 0),
                totalBookings: monthlyData.reduce((sum, m) => sum + m.bookings, 0),
            },
        });
    } catch (error) {
        console.error('Get monthly revenue error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching revenue',
        });
    }
};

// @desc    Get recent bookings
// @route   GET /api/admin/bookings/recent
// @access  Private/Admin
export const getRecentBookings = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const bookings = await prisma.booking.findMany({
            take: parseInt(limit),
            include: {
                user: {
                    select: {
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
        console.error('Get recent bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching bookings',
        });
    }
};
