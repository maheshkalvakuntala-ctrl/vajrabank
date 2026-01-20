import Ad from '../models/Ad.js';

/**
 * DEVELOPMENT UTILITY: Generate Sample Advertisement Data
 * 
 * This script helps populate the database with sample ads for testing.
 * Run this ONLY in development environment.
 * 
 * Usage:
 *   import { createSampleAds } from './utils/sampleData.js';
 *   await createSampleAds();
 */

export const sampleAds = [
    {
        title: "Summer Sale - Up to 70% Off",
        imageUrl: "https://via.placeholder.com/800x200/FF6B6B/FFFFFF?text=Summer+Sale",
        redirectUrl: "https://example.com/summer-sale",
        durationDays: 30,
        showOn: { home: true, about: false, contact: true, user: true },
        createdBy: "partner_001",
        createdByRole: "partner"
    },
    {
        title: "New Credit Card Launch",
        imageUrl: "https://via.placeholder.com/800x200/4ECDC4/FFFFFF?text=New+Credit+Card",
        redirectUrl: "https://example.com/credit-card",
        durationDays: 60,
        showOn: { home: true, about: true, contact: false, user: true },
        createdBy: "partner_002",
        createdByRole: "partner"
    },
    {
        title: "Limited Time Loan Offer",
        imageUrl: "https://via.placeholder.com/800x200/95E1D3/000000?text=Loan+Offer",
        redirectUrl: "https://example.com/loans",
        durationDays: 15,
        showOn: { home: true, about: false, contact: false, user: false },
        createdBy: "partner_001",
        createdByRole: "partner"
    },
    {
        title: "Exclusive Partner Program",
        imageUrl: "https://via.placeholder.com/800x200/F38181/FFFFFF?text=Partner+Program",
        redirectUrl: "https://example.com/partners",
        durationDays: 90,
        showOn: { home: false, about: true, contact: true, user: false },
        createdBy: "partner_003",
        createdByRole: "partner"
    }
];

/**
 * Create sample pending ads
 */
export const createSampleAds = async () => {
    try {
        console.log('🌱 Creating sample advertisements...');

        const createdAds = await Ad.insertMany(sampleAds);

        console.log(`✅ Created ${createdAds.length} sample ads`);
        createdAds.forEach(ad => {
            console.log(`   - ${ad.title} (ID: ${ad._id})`);
        });

        return createdAds;
    } catch (error) {
        console.error('❌ Failed to create sample ads:', error.message);
        throw error;
    }
};

/**
 * Approve sample ads (for testing active ads)
 */
export const approveSampleAds = async () => {
    try {
        console.log('✅ Approving sample advertisements...');

        const pendingAds = await Ad.find({ status: 'pending' }).limit(2);

        for (const ad of pendingAds) {
            const now = new Date();
            ad.startDate = now;
            ad.status = 'approved';
            ad.approvedBy = 'admin_001';
            ad.approvedAt = now;
            ad.calculateEndDate();

            await ad.save();
            console.log(`   - Approved: ${ad.title} (expires: ${ad.endDate.toLocaleDateString()})`);
        }

        return pendingAds;
    } catch (error) {
        console.error('❌ Failed to approve sample ads:', error.message);
        throw error;
    }
};

/**
 * Clean up all ads (for testing)
 */
export const cleanupAds = async () => {
    try {
        console.log('🧹 Cleaning up advertisements...');

        const result = await Ad.deleteMany({});

        console.log(`✅ Deleted ${result.deletedCount} advertisements`);
        return result;
    } catch (error) {
        console.error('❌ Failed to cleanup ads:', error.message);
        throw error;
    }
};

/**
 * Display all ads with status
 */
export const displayAds = async () => {
    try {
        const ads = await Ad.find({}).sort({ createdAt: -1 });

        console.log('\n📊 Current Advertisements:\n');

        if (ads.length === 0) {
            console.log('   No ads found.');
            return;
        }

        ads.forEach((ad, index) => {
            console.log(`${index + 1}. ${ad.title}`);
            console.log(`   Status: ${ad.status}`);
            console.log(`   ID: ${ad._id}`);

            if (ad.startDate) {
                console.log(`   Start: ${ad.startDate.toLocaleDateString()}`);
                console.log(`   End: ${ad.endDate.toLocaleDateString()}`);
                console.log(`   Days Remaining: ${ad.daysRemaining}`);
            }

            console.log(`   Pages: ${Object.keys(ad.showOn).filter(k => ad.showOn[k]).join(', ')}`);
            console.log('');
        });

        return ads;
    } catch (error) {
        console.error('❌ Failed to display ads:', error.message);
        throw error;
    }
};

/**
 * Test auto-expiry logic
 * Creates an ad that expires immediately for testing
 */
export const testExpiry = async () => {
    try {
        console.log('⏰ Testing auto-expiry logic...');

        // Create an ad with very short duration
        const testAd = await Ad.create({
            title: "Test Expiry Ad",
            imageUrl: "https://via.placeholder.com/800x200",
            redirectUrl: "https://example.com/test",
            durationDays: 1,
            showOn: { home: true, about: false, contact: false, user: false },
            createdBy: "test_partner",
            createdByRole: "partner"
        });

        // Approve it with a past date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 2);

        testAd.startDate = yesterday;
        testAd.status = 'approved';
        testAd.calculateEndDate();
        await testAd.save();

        console.log(`   Created test ad (should expire): ${testAd.title}`);
        console.log(`   End date: ${testAd.endDate.toLocaleDateString()}`);

        // Now fetch active ads (should trigger auto-expiry)
        const activeAds = await Ad.getActiveAds();

        // Reload the test ad to see if it was marked as expired
        const updatedAd = await Ad.findById(testAd._id);

        console.log(`   Updated status: ${updatedAd.status}`);
        console.log(`   ${updatedAd.status === 'expired' ? '✅' : '❌'} Auto-expiry ${updatedAd.status === 'expired' ? 'working!' : 'failed!'}`);

        // Cleanup
        await Ad.findByIdAndDelete(testAd._id);

        return updatedAd;
    } catch (error) {
        console.error('❌ Failed to test expiry:', error.message);
        throw error;
    }
};

// Export for CLI usage
export default {
    createSampleAds,
    approveSampleAds,
    cleanupAds,
    displayAds,
    testExpiry
};
