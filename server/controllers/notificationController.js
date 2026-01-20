import Notification from '../models/Notification.js';
import { inMemoryDB } from '../config/inMemoryDB.js';

// Detect if MongoDB is available
const isTestMode = !process.env.MONGODB_URI;

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = async (req, res) => {
    try {
        let notifications;
        const { role, id } = req.user;

        if (isTestMode) {
            notifications = await inMemoryDB.getNotifications(role, id);
        } else {
            notifications = await Notification.find({
                recipientRole: role,
                $or: [
                    { recipientId: id },
                    { recipientId: null }, // Global role notifications
                    { recipientId: 'all' }
                ]
            }).sort({ createdAt: -1 }).limit(50);
        }

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications'
        });
    }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markRead = async (req, res) => {
    try {
        const { id } = req.params;

        if (isTestMode) {
            await inMemoryDB.markNotificationRead(id);
        } else {
            await Notification.findByIdAndUpdate(id, { isRead: true });
        }

        res.status(200).json({ success: true });

    } catch (error) {
        console.error('Error marking notification read:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * Helper: Create Notification (Internal Use)
 */
export const createNotification = async (data) => {
    try {
        if (isTestMode) {
            return await inMemoryDB.createNotification(data);
        } else {
            return await Notification.create(data);
        }
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};
