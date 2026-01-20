import jwt from 'jsonwebtoken';

/**
 * UTILITY: Generate JWT Token
 * Helper function to create authentication tokens
 * 
 * NOTE: This is a helper for testing
 * In production, this should be in your auth service
 */
export const generateToken = (userId, email, role) => {
    return jwt.sign(
        {
            id: userId,
            email: email,
            role: role // 'admin', 'partner', or 'user'
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || '7d'
        }
    );
};

/**
 * UTILITY: Verify Token
 * Helper function to decode and verify tokens
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

/**
 * Sample tokens for testing (DEVELOPMENT ONLY!)
 * Generate these when server starts for quick testing
 */
export const generateTestTokens = () => {
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return {
        admin: generateToken('admin_001', 'admin@vajrabank.com', 'admin'),
        partner: generateToken('partner_001', 'partner@example.com', 'partner'),
        user: generateToken('user_001', 'user@example.com', 'user')
    };
};
