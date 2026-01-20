import { createContext, useContext, useState, useEffect } from "react";

const PartnerContext = createContext();

export const usePartner = () => useContext(PartnerContext);

export const PartnerProvider = ({ children }) => {
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock Persistence
        const storedPartner = localStorage.getItem("vajra_partner_auth");
        if (storedPartner) {
            setPartner(JSON.parse(storedPartner));
        }
        setLoading(false);
    }, []);

    const loginPartner = (partnerData) => {
        // In a real app, this would verify credentials
        const newPartner = { ...partnerData, role: 'PARTNER' };
        setPartner(newPartner);
        localStorage.setItem("vajra_partner_auth", JSON.stringify(newPartner));
    };

    const logoutPartner = () => {
        setPartner(null);
        localStorage.removeItem("vajra_partner_auth");
    };

    const updateSubscription = (plan, status = 'ACTIVE') => {
        if (!partner) return;
        const updatedPartner = {
            ...partner,
            planType: plan,
            subscriptionStatus: status,
            subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // +30 days
        };
        setPartner(updatedPartner);
        localStorage.setItem("vajra_partner_auth", JSON.stringify(updatedPartner));
    };

    const value = {
        partner,
        loading,
        loginPartner,
        logoutPartner,
        updateSubscription
    };

    return (
        <PartnerContext.Provider value={value}>
            {!loading && children}
        </PartnerContext.Provider>
    );
};
