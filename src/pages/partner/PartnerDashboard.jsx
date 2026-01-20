import React, { useState } from 'react';
import { usePartner } from '../../context/PartnerContext';
import { PlusCircle } from 'react-bootstrap-icons';
import { useBankData } from '../../hooks/useBankData';
import DashboardCore from '../../components/admin/DashboardCore';
import NotificationBell from '../../components/common/NotificationBell';

import { adService } from '../../services/adService';

export default function PartnerDashboard() {
    const { partner } = usePartner();
    const { data, loading, error } = useBankData();
    const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'ads'

    // Ads State
    const [showAdForm, setShowAdForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ads, setAds] = useState([]);
    const [newAd, setNewAd] = useState({ title: '', image: '', url: '', budget: '', duration: '' });

    // Fetch Partner Ads
    React.useEffect(() => {
        if (partner?.id && activeTab === 'ads') {
            const fetchAds = async () => {
                const myAds = await adService.getPartnerAds(partner.id);
                setAds(myAds);
            };
            fetchAds();
        }
    }, [partner, activeTab]);

    const handleCreateAd = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await adService.createAd({
                ...newAd,
                partnerId: partner.id,
                businessName: partner.businessName || 'Unknown Partner'
            });
            // Refresh list
            const myAds = await adService.getPartnerAds(partner.id);
            setAds(myAds);

            setShowAdForm(false);
            setNewAd({ title: '', image: '', url: '', budget: '', duration: '' });
            alert("Ad submitted for approval!");
        } catch (err) {
            console.error(err);
            alert("Failed to create ad: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: 40, color: 'white', textAlign: 'center' }}>Loading Partner Data...</div>;
    if (error) return <div style={{ padding: 40, color: '#ef4444', textAlign: 'center' }}>Error: {error}</div>;

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', padding: '100px 24px 40px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '28px' }}>Partner Dashboard</h1>
                        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Welcome back, <span style={{ color: '#3b82f6' }}>{partner?.businessName || 'Partner'}</span></p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'analytics' ? '#3b82f6' : '#1e293b', color: 'white', cursor: 'pointer' }}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('ads')}
                            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'campaigns' ? '#3b82f6' : '#1e293b', color: 'white', cursor: 'pointer' }}
                        >
                            Ads Manager
                        </button>
                        <NotificationBell />
                    </div>
                </div>

                {activeTab === 'analytics' ? (
                    /* SHARED DASHBOARD CORE (READ ONLY) */
                    <DashboardCore
                        role="PARTNER"
                        data={data}
                    />
                ) : (
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3>Your Ad Campaigns</h3>
                            <button
                                onClick={() => setShowAdForm(!showAdForm)}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                <PlusCircle /> {showAdForm ? 'Cancel' : 'Create New Ad'}
                            </button>
                        </div>

                        {showAdForm && (
                            <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155', marginBottom: '24px' }}>
                                <h4 style={{ marginTop: 0, marginBottom: '20px', color: 'white' }}>New Ad Campaign</h4>
                                <form onSubmit={handleCreateAd}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <input
                                            placeholder="Campaign Title"
                                            className="partner-input"
                                            value={newAd.title}
                                            onChange={e => setNewAd({ ...newAd, title: e.target.value })}
                                            required
                                        />
                                        <input
                                            placeholder="Redirect URL"
                                            className="partner-input"
                                            value={newAd.url}
                                            onChange={e => setNewAd({ ...newAd, url: e.target.value })}
                                            required
                                        />
                                        <input
                                            placeholder="Budget ($)"
                                            type="number"
                                            className="partner-input"
                                            value={newAd.budget}
                                            onChange={e => setNewAd({ ...newAd, budget: e.target.value })}
                                            required
                                        />
                                        <input
                                            placeholder="Duration (Days)"
                                            type="number"
                                            className="partner-input"
                                            value={newAd.duration}
                                            onChange={e => setNewAd({ ...newAd, duration: e.target.value })}
                                            required
                                        />
                                        <input
                                            placeholder="Image URL"
                                            className="partner-input"
                                            style={{ gridColumn: 'span 2' }}
                                            value={newAd.image}
                                            onChange={e => setNewAd({ ...newAd, image: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        style={{ background: isSubmitting ? '#94a3b8' : '#7142f3', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                            {ads.length === 0 ? (
                                <p style={{ color: '#64748b' }}>No ads created yet.</p>
                            ) : ads.map(ad => (
                                <div key={ad.id} style={{ background: '#1e293b', borderRadius: '16px', overflow: 'hidden', border: '1px solid #334155' }}>
                                    <div style={{ height: '140px', background: ad.image ? `url(${ad.image}) center/cover` : 'linear-gradient(45deg, #3b82f6, #8b5cf6)' }}></div>
                                    <div style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <h4 style={{ margin: 0 }}>{ad.title}</h4>
                                            <span style={{
                                                background: ad.status === 'ACTIVE' ? '#10b98133' : ad.status === 'REJECTED' ? '#ef444433' : '#f59e0b33',
                                                color: ad.status === 'ACTIVE' ? '#10b981' : ad.status === 'REJECTED' ? '#ef4444' : '#f59e0b',
                                                padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold'
                                            }}>
                                                {ad.status}
                                            </span>
                                        </div>
                                        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
                                            Budget: ${ad.budget} • Duration: {ad.duration} days
                                        </p>
                                        <div style={{ background: '#334155', height: '6px', borderRadius: '3px' }}>
                                            <div style={{ width: ad.status === 'ACTIVE' ? '60%' : '0%', background: '#3b82f6', height: '100%', borderRadius: '3px' }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .partner-input {
            width: 100%;
            padding: 12px;
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 8px;
            color: white;
            outline: none;
        }
        .partner-input:focus {
            border-color: #3b82f6;
        }
      `}</style>
        </div >
    );
}
