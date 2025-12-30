import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBankData } from './useBankData';

export const useCurrentUser = () => {
    const { user: authUser } = useAuth();
    const { data, loading, error } = useBankData();
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
        if (!authUser || !data) return null;

        let baseUser = data.find(c => c.email.toLowerCase() === authUser.email.toLowerCase());

        // Fallback for demo
        if (!baseUser && data.length > 0) {
            baseUser = data[0];
        }

        if (baseUser) {
            return {
                ...baseUser,
                ...localUpdates, // Apply local overrides (phone, address, etc)
                firstName: baseUser.fullName.split(' ')[0],
                kycStatus: baseUser.kycStatus || 'Verified',
                accountStatus: baseUser.activeStatus || 'Active'
            };
        }

        return null;
    }, [authUser, data, localUpdates]);

    return { currentUser, loading, error, updateUserProfile };
};
