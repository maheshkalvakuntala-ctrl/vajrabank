import Ad from '../models/Ad.js';
import { inMemoryDB } from '../config/inMemoryDB.js';
import { createNotification } from './notificationController.js';

// Detect if MongoDB is available
const isTestMode = !process.env.MONGODB_URI;

/**
 * @desc    Create new advertisement
 * @route   POST /api/ads/create
 * @access  Private (Partner only)
 */
export const createAd = async (req, res) => {
    try {
        const { title, imageUrl, redirectUrl, durationDays, showOn } = req.body;

        // Validation
        if (!title || !imageUrl || !redirectUrl || !durationDays) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: title, imageUrl, redirectUrl, durationDays'
            });
        }

        // Validate duration
        if (durationDays < 1 || durationDays > 365) {
            return res.status(400).json({
                success: false,
                message: 'Duration must be between 1 and 365 days'
            });
        }

        // Create ad object
        const adData = {
            title,
            imageUrl,
            redirectUrl,
            durationDays: parseInt(durationDays),
            showOn: showOn || {
                home: false,
                about: false,
                contact: false,
                user: false
            },
            createdBy: req.user.id,
            createdByRole: req.user.role,
            status: 'pending' // Always starts as pending
        };

        let ad;
        if (isTestMode) {
            ad = await inMemoryDB.createAd(adData);
        } else {
            ad = await Ad.create(adData);
        }

        // NOTIFICATION: Notify Admin
        await createNotification({
            recipientRole: 'admin',
            recipientId: 'all',
            type: 'AD_SUBMISSION',
            title: 'New Ad Submission',
            message: `New ad "${title}" submitted for approval.`,
            relatedAdId: ad._id
        });

        res.status(201).json({
            success: true,
            message: 'Advertisement created successfully. Awaiting admin approval.',
            data: ad
        });

    } catch (error) {
        console.error('Error creating ad:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create advertisement',
            error: error.message
        });
    }
};

/**
 * @desc    Approve advertisement
 * @route   PUT /api/ads/approve/:id
 * @access  Private (Admin only)
 * 
 * CRITICAL: This is where the timing logic starts
 * - Sets startDate to current server time
 * - Calculates endDate = startDate + durationDays
 * - Changes status to 'approved'
 */
export const approveAd = async (req, res) => {
    try {
        const { id } = req.params;

        let ad;
        if (isTestMode) {
            ad = await inMemoryDB.findById(id);
        } else {
            ad = await Ad.findById(id);
        }

        if (!ad) {
            return res.status(404).json({
                success: false,
                message: 'Advertisement not found'
            });
        }

        // Check if already approved or rejected
        if (ad.status === 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Advertisement is already approved'
            });
        }

        if (ad.status === 'rejected') {
            return res.status(400).json({
                success: false,
                message: 'Cannot approve a rejected advertisement'
            });
        }

        // Set timing logic
        const now = new Date();
        const duration = ad.durationDays || 30;
        const endDate = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);

        const updates = {
            startDate: now,
            status: 'approved',
            approvedBy: req.user.id,
            approvedAt: now,
            endDate: endDate,
            daysRemaining: duration
        };

        if (isTestMode) {
            ad = await inMemoryDB.updateAd(id, updates);
        } else {
            Object.assign(ad, updates);
            ad.calculateEndDate(); // Re-calculate if needed by model logic
            await ad.save();
        }

        // NOTIFICATION: Notify Partner
        await createNotification({
            recipientRole: 'partner',
            recipientId: ad.createdBy,
            type: 'AD_APPROVED',
            title: 'Ad Approved',
            message: `Your ad "${ad.title}" has been approved and is live!`,
            relatedAdId: ad._id
        });

        res.status(200).json({
            success: true,
            message: `Advertisement approved successfully. Will be active until ${updates.endDate.toLocaleDateString()}`,
            data: ad
        });

    } catch (error) {
        console.error('Error approving ad:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve advertisement',
            error: error.message
        });
    }
};

/**
 * @desc    Reject advertisement
 * @route   PUT /api/ads/reject/:id
 * @access  Private (Admin only)
 */
export const rejectAd = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        let ad;
        if (isTestMode) {
            ad = await inMemoryDB.findById(id);
        } else {
            ad = await Ad.findById(id);
        }

        if (!ad) {
            return res.status(404).json({
                success: false,
                message: 'Advertisement not found'
            });
        }

        // Check if already approved
        if (ad.status === 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Cannot reject an approved advertisement. Use disable instead.'
            });
        }

        const updates = {
            status: 'rejected',
            rejectedBy: req.user.id,
            rejectedAt: new Date(),
            rejectionReason: reason || 'No reason provided'
        };

        if (isTestMode) {
            ad = await inMemoryDB.updateAd(id, updates);
        } else {
            Object.assign(ad, updates);
            await ad.save();
        }

        // NOTIFICATION: Notify Partner
        await createNotification({
            recipientRole: 'partner',
            recipientId: ad.createdBy,
            type: 'AD_REJECTED',
            title: 'Ad Rejected',
            message: `Your ad "${ad.title}" was rejected. Content: ${reason || 'Policy violation'}`,
            relatedAdId: ad._id
        });

        res.status(200).json({
            success: true,
            message: 'Advertisement rejected successfully',
            data: ad
        });

    } catch (error) {
        console.error('Error rejecting ad:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject advertisement',
            error: error.message
        });
    }
};

/**
 * @desc    Get all active advertisements
 * @route   GET /api/ads/active?page=home
 * @access  Public
 * 
 * CRITICAL AUTO-EXPIRY LOGIC:
 * - Automatically marks expired ads (endDate < now)
 * - Returns only approved ads within date range
 * - Optionally filters by page (home, about, contact, user)
 */
export const getActiveAds = async (req, res) => {
    try {
        const { page } = req.query;

        let ads;

        // TEST MODE: Use in-memory data if MongoDB not available
        if (isTestMode) {
            ads = await inMemoryDB.findAds({ status: 'approved' });

            // Filter by expiry
            const now = new Date();
            ads = ads.filter(ad => {
                if (!ad.startDate || !ad.endDate) return false;
                return now >= new Date(ad.startDate) && now <= new Date(ad.endDate);
            });

            // Filter by page if specified
            if (page && ['home', 'about', 'contact', 'user'].includes(page)) {
                ads = ads.filter(ad => ad.showOn && ad.showOn[page] === true);
            }
        } else {
            // Use MongoDB static method which handles auto-expiry
            ads = await Ad.getActiveAds(page);
        }

        res.status(200).json({
            success: true,
            count: ads.length,
            mode: isTestMode ? 'test' : 'production',
            data: ads.map(ad => ({
                id: ad._id,
                title: ad.title,
                imageUrl: ad.imageUrl,
                redirectUrl: ad.redirectUrl,
                daysRemaining: ad.daysRemaining || 0,
                showOn: ad.showOn
            }))
        });

    } catch (error) {
        console.error('Error fetching active ads:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch active advertisements',
            error: error.message
        });
    }
};

/**
 * @desc    Get all advertisements (for admin) or partner's ads (for partner)
 * @route   GET /api/ads/all (admin) or GET /api/ads/partner/my-ads (partner)
 * @access  Private (Admin or Partner)
 */
export const getAllAds = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        // Build query
        const query = {};
        if (status) {
            query.status = status;
        }

        // If partner, only show their own ads
        if (req.user.role === 'partner') {
            query.createdBy = req.user.id;
        }

        let ads = [];
        let total = 0;

        if (isTestMode) {
            let allAds = await inMemoryDB.findAds(query);

            // Apply sorting (newest first)
            allAds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            total = allAds.length;

            // Apply pagination
            const skip = (page - 1) * limit;
            ads = allAds.slice(skip, skip + parseInt(limit));
        } else {
            const skip = (page - 1) * limit;
            ads = await Ad.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));
            total = await Ad.countDocuments(query);
        }

        res.status(200).json({
            success: true,
            count: ads.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            data: ads
        });

    } catch (error) {
        console.error('Error fetching all ads:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch advertisements',
            error: error.message
        });
    }
};

/**
 * @desc    Disable/Delete an active advertisement
 * @route   DELETE /api/ads/:id
 * @access  Private (Admin only)
 */
export const disableAd = async (req, res) => {
    try {
        const { id } = req.params;

        if (isTestMode) {
            const ad = await inMemoryDB.updateAd(id, { status: 'expired' });
            if (!ad) {
                return res.status(404).json({ success: false, message: 'Advertisement not found' });
            }
            return res.status(200).json({
                success: true,
                message: 'Advertisement disabled successfully',
                data: ad
            });
        }

        // MongoDB Logic
        const ad = await Ad.findById(id);

        if (!ad) {
            return res.status(404).json({
                success: false,
                message: 'Advertisement not found'
            });
        }

        // Mark as expired instead of deleting (for audit trail)
        ad.status = 'expired';
        await ad.save();

        res.status(200).json({
            success: true,
            message: 'Advertisement disabled successfully',
            data: {
                id: ad._id,
                title: ad.title,
                status: ad.status
            }
        });

    } catch (error) {
        console.error('Error disabling ad:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to disable advertisement',
            error: error.message
        });
    }
};

/**
 * @desc    Get ad statistics
 * @route   GET /api/ads/stats
 * @access  Private (Admin only)
 */
export const getAdStats = async (req, res) => {
    try {
        if (isTestMode) {
            const ads = await inMemoryDB.getAllAds();
            const now = new Date();

            const stats = {
                statusCounts: ads.reduce((acc, ad) => {
                    acc[ad.status] = (acc[ad.status] || 0) + 1;
                    return acc;
                }, {}),
                activeCount: ads.filter(ad =>
                    ad.status === 'approved' &&
                    new Date(ad.startDate) <= now &&
                    new Date(ad.endDate) >= now
                ).length
            };

            return res.status(200).json({
                success: true,
                data: {
                    statusCounts: Object.entries(stats.statusCounts).map(([k, v]) => ({ _id: k, count: v })),
                    activeCount: [{ count: stats.activeCount }]
                }
            });
        }

        const now = new Date();

        const stats = await Ad.aggregate([
            {
                $facet: {
                    statusCounts: [
                        { $group: { _id: '$status', count: { $sum: 1 } } }
                    ],
                    activeCount: [
                        {
                            $match: {
                                status: 'approved',
                                startDate: { $lte: now },
                                endDate: { $gte: now }
                            }
                        },
                        { $count: 'count' }
                    ]
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: stats[0]
        });

    } catch (error) {
        console.error('Error fetching ad stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
};
