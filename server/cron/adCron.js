import Ad from '../models/Ad.js';
import { inMemoryDB } from '../config/inMemoryDB.js';

/**
 * Ad Expiry Cron Job
 * Checks for active ads that have passed their end date
 * and marks them as 'expired'
 */
export const startAdExpiryJob = () => {
    console.log('⏰ Ad Expiry Job Scheduler Started');

    const checkExpiry = async () => {
        try {
            const now = new Date();
            const isTestMode = !process.env.MONGODB_URI;

            if (isTestMode) {
                // In-memory update
                const ads = await inMemoryDB.findAds({ status: 'approved' });
                let expiredCount = 0;

                for (const ad of ads) {
                    if (new Date(ad.endDate) < now) {
                        await inMemoryDB.updateAd(ad._id, { status: 'expired' });
                        expiredCount++;
                    }
                }

                if (expiredCount > 0) {
                    console.log(`⏰ Cron: Expired ${expiredCount} ads in test mode`);
                }
            } else {
                // MongoDB update
                const result = await Ad.updateMany(
                    {
                        status: 'approved',
                        endDate: { $lt: now }
                    },
                    {
                        $set: { status: 'expired' }
                    }
                );

                if (result.modifiedCount > 0) {
                    console.log(`⏰ Cron: Expired ${result.modifiedCount} ads in database`);
                }
            }
        } catch (error) {
            console.error('❌ Cron Job Error:', error);
        }
    };

    // Run immediately on start
    checkExpiry();

    // Run every hour (3600000 ms)
    setInterval(checkExpiry, 3600000);
};
