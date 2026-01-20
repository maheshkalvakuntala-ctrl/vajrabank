/**
 * In-Memory Storage for Test Mode
 * Used when MongoDB is not available
 * WARNING: Data will be lost on server restart!
 */

let adsStore = [];
let idCounter = 1;

export const inMemoryDB = {
    // Create ad
    createAd: async (adData) => {
        const ad = {
            _id: `test_${idCounter++}`,
            ...adData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        adsStore.push(ad);
        return ad;
    },

    // Find ads by query
    findAds: async (query = {}) => {
        let results = [...adsStore];

        // Filter by status
        if (query.status) {
            results = results.filter(ad => ad.status === query.status);
        }

        // Filter by createdBy
        if (query.createdBy) {
            results = results.filter(ad => ad.createdBy === query.createdBy);
        }

        return results;
    },

    // Find ad by ID
    findById: async (id) => {
        return adsStore.find(ad => ad._id === id);
    },

    // Update ad
    updateAd: async (id, updates) => {
        const index = adsStore.findIndex(ad => ad._id === id);
        if (index === -1) return null;

        adsStore[index] = {
            ...adsStore[index],
            ...updates,
            updatedAt: new Date()
        };
        return adsStore[index];
    },

    // Delete ad
    deleteAd: async (id) => {
        const index = adsStore.findIndex(ad => ad._id === id);
        if (index === -1) return null;

        const deleted = adsStore[index];
        adsStore.splice(index, 1);
        return deleted;
    },

    // Update many ads
    updateMany: async (query, updates) => {
        let updatedCount = 0;
        const now = new Date();

        adsStore = adsStore.map(ad => {
            let shouldUpdate = true;

            // Check query conditions
            if (query.status && ad.status !== query.status) shouldUpdate = false;
            if (query.endDate?.$lt && !(ad.endDate < query.endDate.$lt)) shouldUpdate = false;

            if (shouldUpdate) {
                updatedCount++;
                return { ...ad, ...updates.$set, updatedAt: now };
            }
            return ad;
        });

        return { modifiedCount: updatedCount };
    },

    // Get all ads
    getAllAds: () => [...adsStore],

    // Clear all (for testing)
    clearAll: () => {
        adsStore = [];
        idCounter = 1;
    },

    seedSampleData: () => {
        // Clean slate - no default ads
        adsStore = [];
        console.log('📊 Database cleared (Clean Slate for Testing)');
    },

    // --- NOTIFICATIONS SUPPORT ---
    createNotification: async (notifData) => {
        const notif = {
            _id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            ...notifData,
            createdAt: new Date(),
            isRead: false
        };
        // Use a global variable for notifications or attach to object if not generic
        // Since inMemoryDB is a const object, we need a place to store them.
        // We'll add a store property.
        if (!inMemoryDB.notificationStore) inMemoryDB.notificationStore = [];
        inMemoryDB.notificationStore.unshift(notif); // Add to top
        return notif;
    },

    getNotifications: async (role, userId) => {
        if (!inMemoryDB.notificationStore) return [];
        return inMemoryDB.notificationStore.filter(n =>
            (n.recipientRole === role) &&
            (!n.recipientId || n.recipientId === userId || n.recipientId === 'all')
        );
    },

    markNotificationRead: async (id) => {
        if (!inMemoryDB.notificationStore) return null;
        const notif = inMemoryDB.notificationStore.find(n => n._id === id);
        if (notif) {
            notif.isRead = true;
            return notif;
        }
        return null;
    }
};

export default inMemoryDB;
