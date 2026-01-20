/**
 * Advertisement Service - REST API Based
 * 
 * Completely migrated from Firebase to Node.js + Express + MongoDB backend
 * All ad operations now use REST API endpoints instead of Firestore
 */

import { authService } from './authService.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Helper: Get JWT token from localStorage via authService
 */
const getAuthToken = () => {
    return authService.getToken();
};

/**
 * Helper: Make authenticated API request
 */
const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Add auth token if available
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
};

export const adService = {
    /**
     * 1. GET ACTIVE ADS (Public)
     * Fetches currently active advertisements from MongoDB backend
     * 
     * @param {string} page - Optional page filter (home, about, contact, user)
     * @returns {Promise<Array>} Array of active ads
     */
    getActiveAds: async (page = null) => {
        try {
            const queryParam = page ? `?page=${page}` : '';
            const result = await apiRequest(`/api/ads/active${queryParam}`);

            return result.data || [];
        } catch (error) {
            console.error('Error fetching active ads:', error);
            return []; // Return empty array on error to prevent UI crash
        }
    },

    /**
     * 2. CREATE AD (Partner)
     * Creates a new advertisement (requires partner authentication)
     * 
     * @param {Object} adData - Advertisement data
     * @returns {Promise<Object>} Created ad response
     */
    createAd: async (adData) => {
        try {
            // Transform data to match backend schema
            const payload = {
                title: adData.title,
                imageUrl: adData.image,
                redirectUrl: adData.url,
                durationDays: parseInt(adData.duration),
                showOn: {
                    home: true,
                    about: true,
                    contact: true,
                    user: true
                }
            };

            const result = await apiRequest('/api/ads/create', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            return { success: true, id: result.data._id };
        } catch (error) {
            console.error('Error creating ad:', error);
            throw error;
        }
    },

    /**
     * 3. GET PARTNER ADS (Partner)
     * Fetches all ads created by a specific partner
     * 
     * @param {string} partnerId - Partner ID
     * @returns {Promise<Array>} Array of partner's ads
     */
    getPartnerAds: async (partnerId) => {
        try {
            // Backend endpoint: GET /api/ads/partner/my-ads (partner only)
            const result = await apiRequest('/api/ads/partner/my-ads');

            return result.data?.map(ad => ({
                id: ad._id,
                title: ad.title,
                image: ad.imageUrl,
                url: ad.redirectUrl,
                budget: 0, // Backend doesn't track budget (legacy field)
                duration: ad.durationDays,
                status: ad.status.toUpperCase(), // Convert 'approved' to 'ACTIVE'
                createdAt: ad.createdAt
            })) || [];
        } catch (error) {
            console.error('Error fetching partner ads:', error);
            return []; // Return empty array if unauthorized or error
        }
    },

    /**
     * 4. GET PENDING ADS (Admin)
     * Fetches advertisements awaiting approval
     * 
     * @returns {Promise<Array>} Array of pending ads
     */
    getPendingAds: async () => {
        try {
            const result = await apiRequest('/api/ads/all?status=pending');

            return result.data?.map(ad => ({
                id: ad._id,
                title: ad.title,
                image: ad.imageUrl,
                url: ad.redirectUrl,
                duration: ad.durationDays,
                status: 'PENDING',
                createdAt: ad.createdAt,
                partnerId: ad.createdBy,
                businessName: ad.createdBy // TODO: Fetch actual business name from user
            })) || [];
        } catch (error) {
            console.error('Error fetching pending ads:', error);
            throw error;
        }
    },

    /**
     * 5. APPROVE AD (Admin)
     * Approves an advertisement and activates it
     * 
     * @param {string} adId - Advertisement ID
     * @param {number} durationDays - Duration in days (optional, already set)
     * @param {string} partnerId - Partner ID (optional, for notifications)
     * @param {string} adTitle - Ad title (optional, for notifications)
     * @returns {Promise<Object>} Approval response
     */
    approveAd: async (adId, durationDays, partnerId, adTitle) => {
        try {
            const result = await apiRequest(`/api/ads/approve/${adId}`, {
                method: 'PUT'
            });

            // TODO: Create notification via separate notification service
            // For now, backend handles notification internally

            return { success: true };
        } catch (error) {
            console.error('Error approving ad:', error);
            throw error;
        }
    },

    /**
     * 6. REJECT AD (Admin)
     * Rejects an advertisement
     * 
     * @param {string} adId - Advertisement ID
     * @param {string} reason - Rejection reason
     * @param {string} partnerId - Partner ID (optional)
     * @param {string} adTitle - Ad title (optional)
     * @returns {Promise<Object>} Rejection response
     */
    rejectAd: async (adId, reason = "No reason provided", partnerId, adTitle) => {
        try {
            const result = await apiRequest(`/api/ads/reject/${adId}`, {
                method: 'PUT',
                body: JSON.stringify({ reason })
            });

            return { success: true };
        } catch (error) {
            console.error('Error rejecting ad:', error);
            throw error;
        }
    },

    /**
     * 7. TRACK CLICK (Public)
     * Tracks advertisement click
     * 
     * Note: Backend doesn't currently have click tracking endpoint
     * This is a placeholder for future implementation
     * 
     * @param {string} adId - Advertisement ID
     * @param {number} costPerClick - Cost per click (not used in MongoDB version)
     */
    trackClick: async (adId, costPerClick = 0.50) => {
        try {
            // TODO: Backend needs to implement click tracking endpoint
            // For now, just log the click
            console.log(`Ad clicked: ${adId}`);
            return { success: true };
        } catch (error) {
            console.error('Error tracking click:', error);
        }
    }
};

export default adService;
export { apiRequest };
