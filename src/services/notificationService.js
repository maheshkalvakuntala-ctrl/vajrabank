import { apiRequest } from './adService'; // Re-use the apiRequest helper which handles Headers

export const notificationService = {
    /**
     * Get all notifications for the current user
     */
    getNotifications: async () => {
        try {
            const response = await apiRequest('/api/notifications', 'GET');
            return response.data || [];
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    },

    /**
     * Mark a notification as read
     * @param {string} id - Notification ID
     */
    markAsRead: async (id) => {
        try {
            await apiRequest(`/api/notifications/${id}/read`, 'PUT');
            return true;
        } catch (error) {
            console.error('Error marking notification read:', error);
            return false;
        }
    }
};
