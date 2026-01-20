import express from 'express';
import { login, getMe, logout } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * PUBLIC ROUTES
 */

// Login and get JWT token
router.post('/login', login);

// Logout (client-side token removal)
router.post('/logout', logout);

/**
 * PROTECTED ROUTES
 * Require authentication
 */

// Get current user profile
router.get('/me', authenticate, getMe);

export default router;
