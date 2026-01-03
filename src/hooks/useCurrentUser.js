import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useCurrentUser = () => {
    const { user: authUser } = useAuth();
    const [localUpdates, setLocalUpdates] = useState({});

    // Load local updates on mount
    useEffect(() => {
        if (authUser) {
            try {
                const savedUpdates = localStorage.getItem(`userUpdates_${authUser.email}`);
                if (savedUpdates) {
                    setLocalUpdates(JSON.parse(savedUpdates));
                }
            } catch (err) {
                console.error("Failed to load user updates", err);
            }
        }
    }, [authUser]);

    const updateUserProfile = (updates) => {
        if (!authUser) return;
        const newUpdates = { ...localUpdates, ...updates };
        setLocalUpdates(newUpdates);
        localStorage.setItem(`userUpdates_${authUser.email}`, JSON.stringify(newUpdates));
    };

    const currentUser = useMemo(() => {
        if (!authUser) return null;

        const baseUser = {
            ...authUser,
            ...localUpdates,
            firstName: authUser.firstName || authUser.displayName?.split(' ')[0] || 'User',
            lastName: authUser.lastName || authUser.displayName?.split(' ').slice(1).join(' ') || '',
            fullName: authUser.displayName || `${authUser.firstName || 'User'} ${authUser.lastName || ''}`.trim(),
            balance: authUser.balance || 0,
            transactions: authUser.transactions || [],
            loans: authUser.loans || [],
            kycStatus: authUser.kycStatus || 'Verified',
            accountStatus: authUser.activeStatus || authUser.accountStatus || 'Active',
            accountType: authUser.accountType || 'Savings'
        };

        return baseUser;
    }, [authUser, localUpdates]);

    return {
        currentUser,
        loading: false, // AuthContext handles loading
        updateUserProfile
    };
};
