import mongoose from 'mongoose';

/**
 * MongoDB Database Connection
 * Establishes connection to MongoDB using Mongoose
 * TEST MODE: If MONGODB_URI not set, runs without database
 */
const connectDB = async () => {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
        console.log('⚠️  MONGODB_URI not set - Running in TEST MODE');
        console.log('⚠️  Data will NOT persist - in-memory only');
        console.log('⚠️  To use real database, set MONGODB_URI in server/.env\n');
        return; // Skip database connection
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);

        // Connection event listeners
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('⚠️  Continuing in TEST MODE without database\n');
        // Don't exit - continue in test mode
    }
};

export default connectDB;
