import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from '../src/config/database.js';

// Import routes
import authRoutes from '../src/routes/auth.js';
import turfRoutes from '../src/routes/turfs.js';
import slotRoutes from '../src/routes/slots.js';
import bookingRoutes from '../src/routes/bookings.js';
import paymentRoutes from '../src/routes/payment.js';
import adminRoutes from '../src/routes/admin.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    'https://truf.vercel.app',
    'https://truf-git-main-zenvoatechnologies.vercel.app'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/turfs', turfRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

export default app;
