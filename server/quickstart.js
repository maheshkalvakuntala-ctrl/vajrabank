/**
 * QUICK START SCRIPT
 * 
 * This script helps you quickly set up and test the advertisement system.
 * 
 * Usage:
 *   node quickstart.js
 * 
 * This will:
 * 1. Generate test JWT tokens
 * 2. Create sample ads
 * 3. Approve some ads
 * 4. Display current ads
 * 5. Test auto-expiry logic
 */

import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { generateTestTokens } from './middleware/tokenUtils.js';
import {
    createSampleAds,
    approveSampleAds,
    displayAds,
    testExpiry
} from './utils/sampleData.js';

// Load environment variables
dotenv.config();

async function quickStart() {
    console.log('\n🚀 VajraBank Ad System - Quick Start\n');
    console.log('='.repeat(50));

    try {
        // 1. Connect to database
        console.log('\n1️⃣  Connecting to MongoDB...');
        await connectDB();

        // 2. Generate test tokens
        console.log('\n2️⃣  Generating JWT tokens for testing...');
        const tokens = generateTestTokens();

        if (tokens) {
            console.log('\n📝 Copy these tokens for API testing:\n');
            console.log('ADMIN TOKEN:');
            console.log(tokens.admin);
            console.log('\nPARTNER TOKEN:');
            console.log(tokens.partner);
            console.log('\nUSER TOKEN:');
            console.log(tokens.user);
        }

        // 3. Create sample ads
        console.log('\n3️⃣  Creating sample advertisements...');
        const ads = await createSampleAds();

        // 4. Approve some ads
        console.log('\n4️⃣  Approving sample advertisements...');
        await approveSampleAds();

        // 5. Display all ads
        console.log('\n5️⃣  Current advertisements:');
        await displayAds();

        // 6. Test auto-expiry
        console.log('\n6️⃣  Testing auto-expiry logic...');
        await testExpiry();

        console.log('\n' + '='.repeat(50));
        console.log('✅ Quick start completed successfully!\n');
        console.log('🔗 API endpoint: http://localhost:5000/api/ads');
        console.log('📖 Documentation: http://localhost:5000/health\n');

        console.log('Next steps:');
        console.log('1. Start the server: npm run dev');
        console.log('2. Test endpoints with the tokens above');
        console.log('3. Check README.md for full documentation\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Quick start failed:', error.message);
        process.exit(1);
    }
}

// Run quick start
quickStart();
