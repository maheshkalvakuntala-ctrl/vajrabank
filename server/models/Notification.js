import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipientRole: {
        type: String,
        enum: ['admin', 'partner'],
        required: true
    },
    recipientId: {
        type: String, // Can be specific User ID or 'all'
        default: null
    },
    type: {
        type: String,
        enum: ['AD_SUBMISSION', 'AD_APPROVED', 'AD_REJECTED', 'SYSTEM'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedAdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ad'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
