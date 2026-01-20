import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, XCircle, InfoCircle, Megaphone } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService'; // To get current user
import { notificationService } from '../../services/notificationService';
import './NotificationBell.css';

export default function NotificationBell({ user: propUser }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const currentUser = propUser || authService.getUser(); // Use prop or fetch
    const navigate = useNavigate();

    // Debug log
    useEffect(() => {
        console.log('NotificationBell User:', currentUser);
    }, [currentUser]);

    // Fetch on mount and polling
    const fetchNotifications = async () => {
        const data = await notificationService.getNotifications();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
    };

    useEffect(() => {
        if (!currentUser) return;

        fetchNotifications();

        // Poll every 15 seconds
        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
    }, [currentUser?.id]); // Re-run if user changes

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notif) => {
        // Mark as read immediately
        if (!notif.isRead) {
            await notificationService.markAsRead(notif._id || notif.id);
            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }

        // Navigation Logic
        setIsOpen(false);

        if (notif.type === 'AD_SUBMISSION' && currentUser?.role === 'admin') {
            navigate('/admin/ads', { state: { openAdId: notif.relatedAdId } });
        }
        else if (notif.type === 'AD_APPROVED' || notif.type === 'AD_REJECTED') {
            navigate('/partner/dashboard');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'AD_SUBMISSION': return <Megaphone />;
            case 'AD_APPROVED': return <CheckCircle />;
            case 'AD_REJECTED': return <XCircle />;
            default: return <InfoCircle />;
        }
    };

    const getTypeClass = (type) => {
        switch (type) {
            case 'AD_SUBMISSION': return 'submission';
            case 'AD_APPROVED': return 'approved';
            case 'AD_REJECTED': return 'rejected';
            default: return 'system';
        }
    };

    // If no user, we still render slightly to avoid layout shift, but maybe disabled?
    // actually let's just allow it for now to debug
    // if (!currentUser) return null;

    return (
        <div className="notification-container" ref={dropdownRef}>
            <div className="notification-icon" onClick={() => setIsOpen(!isOpen)}>
                <Bell />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </div>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notif-header">
                        <h4>Notifications</h4>
                        <button className="mark-all-btn" onClick={fetchNotifications}>Refresh</button>
                    </div>
                    <div className="notif-list">
                        {notifications.length === 0 ? (
                            <div className="empty-notif">No notifications</div>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif._id || notif.id}
                                    className={`notif-item ${!notif.isRead ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notif)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className={`notif-icon-box ${getTypeClass(notif.type)}`}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="notif-content">
                                        <div className="notif-title">{notif.title}</div>
                                        <div className="notif-message">{notif.message}</div>
                                        <span className="notif-time">
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
