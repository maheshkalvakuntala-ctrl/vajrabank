import jwt from 'jsonwebtoken';

/**
 * Authentication Controller
 * Handles user login and JWT token generation
 */

// Test users (in production, these would come from database)
const testUsers = [
    {
        id: 'admin_001',
        email: 'admin@vajrabank.com',
        password: 'admin123', // In production: use bcrypt hash
        role: 'admin',
        name: 'Admin User'
    },
    {
        id: 'partner_001',
        email: 'partner@example.com',
        password: 'partner123',
        role: 'partner',
        name: 'Partner Business',
        businessName: 'Example Business'
    },
    {
        id: 'user_001',
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
        name: 'Test User'
    }
];

/**
 * @desc    Login user and generate JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user (in production: query database)
        const user = testUsers.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials - user not found'
            });
        }

        // Check password (in production: use bcrypt.compare)
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials - wrong password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'default_secret_key_for_testing',
            {
                expiresIn: process.env.JWT_EXPIRE || '7d'
            }
        );

        // Return user data and token
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                businessName: user.businessName
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
    try {
        // User is already attached by auth middleware
        const userId = req.user.id;

        // Find user (in production: query database)
        const user = testUsers.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                businessName: user.businessName
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = async (req, res) => {
    // JWT tokens are stateless - logout happens client-side
    // This endpoint exists for consistency
    res.status(200).json({
        success: true,
        message: 'Logout successful. Please remove token from client.'
    });
};
