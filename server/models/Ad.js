import mongoose from 'mongoose';

/**
 * Advertisement Schema
 * 
 * Key Features:
 * - Auto-calculates endDate based on startDate + durationDays
 * - Tracks visibility across multiple pages (home, about, contact, user)
 * - Supports status workflow: pending → approved/rejected → expired
 * - Stores reference to creator (partner)
 */
const adSchema = new mongoose.Schema(
    {
        // Basic ad information
        title: {
            type: String,
            required: [true, 'Ad title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters']
        },

        imageUrl: {
            type: String,
            required: [true, 'Image URL is required'],
            trim: true
        },

        redirectUrl: {
            type: String,
            required: [true, 'Redirect URL is required'],
            trim: true
        },

        // Duration and timing logic
        durationDays: {
            type: Number,
            required: [true, 'Duration in days is required'],
            min: [1, 'Duration must be at least 1 day'],
            max: [365, 'Duration cannot exceed 365 days']
        },

        startDate: {
            type: Date,
            default: null, // Will be set when admin approves
            index: true
        },

        endDate: {
            type: Date,
            default: null, // Auto-calculated: startDate + durationDays
            index: true
        },

        // Status tracking
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'expired'],
            default: 'pending',
            index: true
        },

        // Page-level visibility control
        showOn: {
            home: {
                type: Boolean,
                default: false
            },
            about: {
                type: Boolean,
                default: false
            },
            contact: {
                type: Boolean,
                default: false
            },
            user: {
                type: Boolean,
                default: false
            }
        },

        // Creator tracking
        createdBy: {
            type: String, // In production, use: mongoose.Schema.Types.ObjectId, ref: 'User'
            required: [true, 'Creator ID is required']
        },

        createdByRole: {
            type: String,
            enum: ['partner', 'admin'],
            required: true
        },

        // Admin actions tracking
        approvedBy: {
            type: String, // Admin ID who approved
            default: null
        },

        approvedAt: {
            type: Date,
            default: null
        },

        rejectedBy: {
            type: String, // Admin ID who rejected
            default: null
        },

        rejectedAt: {
            type: Date,
            default: null
        },

        rejectionReason: {
            type: String,
            trim: true,
            maxlength: [500, 'Rejection reason cannot exceed 500 characters']
        }
    },
    {
        timestamps: true, // Auto-creates createdAt and updatedAt
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

/**
 * Virtual: Check if ad is currently active
 * Returns true only if:
 * - status is 'approved'
 * - current date is between startDate and endDate
 */
adSchema.virtual('isActive').get(function () {
    if (this.status !== 'approved') return false;
    if (!this.startDate || !this.endDate) return false;

    const now = new Date();
    return now >= this.startDate && now <= this.endDate;
});

/**
 * Virtual: Days remaining until expiry
 */
adSchema.virtual('daysRemaining').get(function () {
    if (!this.endDate) return null;

    const now = new Date();
    const diffTime = this.endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
});

/**
 * Instance Method: Calculate and set end date
 * Called when startDate is set (on approval)
 */
adSchema.methods.calculateEndDate = function () {
    if (this.startDate && this.durationDays) {
        const endDate = new Date(this.startDate);
        endDate.setDate(endDate.getDate() + this.durationDays);
        this.endDate = endDate;
    }
    return this.endDate;
};

/**
 * Static Method: Get all active ads for a specific page
 * Automatically marks expired ads and returns only valid ones
 */
adSchema.statics.getActiveAds = async function (pageName = null) {
    // First, mark all expired ads
    const now = new Date();
    await this.updateMany(
        {
            status: 'approved',
            endDate: { $lt: now }
        },
        {
            $set: { status: 'expired' }
        }
    );

    // Build query for active ads
    const query = {
        status: 'approved',
        startDate: { $lte: now },
        endDate: { $gte: now }
    };

    // If specific page requested, filter by showOn
    if (pageName && ['home', 'about', 'contact', 'user'].includes(pageName)) {
        query[`showOn.${pageName}`] = true;
    }

    return await this.find(query).sort({ createdAt: -1 });
};

/**
 * Pre-save hook: Auto-calculate endDate when startDate changes
 */
adSchema.pre('save', function (next) {
    // If startDate is being set and endDate is not yet set
    if (this.isModified('startDate') && this.startDate && !this.endDate) {
        this.calculateEndDate();
    }
    next();
});

/**
 * Index for efficient queries
 * Compound index on status, startDate, endDate for active ad queries
 */
adSchema.index({ status: 1, startDate: 1, endDate: 1 });

const Ad = mongoose.model('Ad', adSchema);

export default Ad;
