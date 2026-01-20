import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import adRoutes from './routes/adRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
await connectDB();

// Seed test data if in test mode
if (!process.env.MONGODB_URI) {
    const { inMemoryDB } = await import('./config/inMemoryDB.js');
    inMemoryDB.seedSampleData();
}

/**
 * MIDDLEWARE
 */

// CORS configuration - Allow localhost on both 5173 and 5174
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl requests)
        if (!origin) return callback(null, true);
        
        if (process.env.NODE_ENV === 'development' || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`, {
            body: req.body,
            query: req.query,
            user: req.user?.role || 'unauthenticated'
        });
        next();
    });
}

/**
 * ROUTES
 */

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Advertisement routes
app.use('/api/ads', adRoutes);

// Notification routes
import notificationRoutes from './routes/notificationRoutes.js';
app.use('/api/notifications', notificationRoutes);

/**
 * ERROR HANDLING
 */

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: messages
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate field value entered'
        });
    }

    // Default error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

import { startAdExpiryJob } from './cron/adCron.js';

// Start background jobs
startAdExpiryJob();

/**
 * START SERVER
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('\n🚀========================================🚀');
    console.log(`   VajraBank Ad System Backend`);
    console.log(`   Server running on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   URL: http://localhost:${PORT}`);
    console.log('🚀========================================🚀\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    // In production, you might want to close server and exit
    // server.close(() => process.exit(1));
});

export default app;
