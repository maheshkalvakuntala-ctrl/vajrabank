import express from 'express';
import {
    createAd,
    approveAd,
    rejectAd,
    getActiveAds,
    getAllAds,
    disableAd,
    getAdStats
} from '../controllers/adController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * PUBLIC ROUTES
 * No authentication required
 */

// Get active advertisements (with optional page filter)
// Query params: ?page=home|about|contact|user
router.get('/active', getActiveAds);

/**
 * PARTNER ROUTES
 * Requires authentication + partner role
 */

// Create new advertisement
router.post('/create', authenticate, authorize('partner'), createAd);

// Get partner's own advertisements
router.get('/partner/my-ads', authenticate, authorize('partner'), getAllAds);

/**
 * ADMIN ROUTES
 * Requires authentication + admin role
 */

// Approve advertisement
router.put('/approve/:id', authenticate, authorize('admin'), approveAd);

// Reject advertisement
router.put('/reject/:id', authenticate, authorize('admin'), rejectAd);

// Get all advertisements (for admin) or own ads (for partner)
// Query params: ?status=pending|approved|rejected|expired&page=1&limit=20
router.get('/all', authenticate, authorize('admin', 'partner'), getAllAds);

// Disable/delete advertisement
router.delete('/:id', authenticate, authorize('admin'), disableAd);

// Get advertisement statistics
router.get('/stats', authenticate, authorize('admin'), getAdStats);

export default router;
