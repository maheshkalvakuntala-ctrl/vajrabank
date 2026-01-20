import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 * 
 * TEST MODE: Auto-authenticates as ADMIN when no MongoDB URI is set
 */
export const authenticate = async (req, res, next) => {
    try {
        // TEST MODE: Auto-authenticate for development without MongoDB
        if (!process.env.MONGODB_URI) {
            console.log('⚠️ TEST MODE: Auto-authenticating as ADMIN');
            req.user = {
                id: 'admin_test_user',
                role: 'admin', // Changed to admin to allow approval
                email: 'admin@vajrabank.com',
                name: 'Test Admin'
            };
            return next();
        }

        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request
        req.user = {
            id: decoded.id,
            role: decoded.role,
            email: decoded.email
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Authentication failed.',
            error: error.message
        });
    }
};

/**
 * Role-Based Authorization Middleware
 * Checks if authenticated user has required role
 * 
 * TEST MODE: Bypasses role check if MongoDB is not connected
 */
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // TEST MODE: Allow everything
        if (!process.env.MONGODB_URI) {
            return next();
        }

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`
            });
        }

        next();
    };
};

/**
 * Optional Authentication
 * Attempts to authenticate but doesn't fail if no token
 * Useful for endpoints that work for both authenticated and non-authenticated users
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = {
                id: decoded.id,
                role: decoded.role,
                email: decoded.email
            };
        }

        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};
