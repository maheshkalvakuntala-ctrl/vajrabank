import React, { useState, useEffect } from 'react';
import { adService } from '../../services/adService';
import { CheckCircle, XCircle, ClockHistory } from 'react-bootstrap-icons';

export default function AdminAds() {
    const [stats, setStats] = useState({ pending: 0, active: 0, rejected: 0 });
    const [pendingAds, setPendingAds] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAds = async () => {
        setLoading(true);
        try {
            // 1. Fetch Pending Ads
            const pending = await adService.getPendingAds();
            setPendingAds(pending);

            // 2. Fetch Real Stats
            const statsData = await adService.getAdStats();

            // Parse stats from backend format
            // Backend returns: { statusCounts: [{_id: 'approved', count: 5}], activeCount: [{count: 2}] }
            const counts = statsData.statusCounts?.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {}) || {};

            setStats({
                pending: counts.pending || 0,
                active: statsData.activeCount?.[0]?.count || 0,
                rejected: counts.rejected || 0,
                total: (counts.pending || 0) + (counts.approved || 0) + (counts.rejected || 0)
            });

        } catch (error) {
            console.error("Failed to load ads", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    // Scroll to specific ad if navigated from notification
    useEffect(() => {
        const state = window.history.state?.usr; // React Router state
        if (state?.openAdId && !loading) {
            const element = document.getElementById(`ad-${state.openAdId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.style.border = '2px solid #3b82f6'; // Highlight
                setTimeout(() => element.style.border = '1px solid #334155', 3000);
            }
        }
    }, [loading, pendingAds]);

    const handleApprove = async (ad) => {
        try {
            await adService.approveAd(ad.id, ad.duration);
            fetchAds();
            alert(`Approved "${ad.title}" for ${ad.duration} days.`);
        } catch (error) {
            alert("Error approving ad");
        }
    };

    const handleReject = async (ad) => {
        const reason = window.prompt("Enter rejection reason (optional):");
        if (reason === null) return; // User cancelled

        try {
            await adService.rejectAd(ad.id, reason || "No description", ad.partnerId, ad.title);
            fetchAds();
        } catch (error) {
            alert("Error rejecting ad");
        }
    };

    return (
        <div style={{ color: 'white', padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Ad Moderation</h1>
                    <p style={{ color: '#94a3b8' }}>Review and manage partner ad campaigns</p>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div className="stat-pill" style={{ background: '#f59e0b22', color: '#f59e0b', padding: '8px 16px', borderRadius: '20px' }}>
                        Pending: {stats.pending}
                    </div>
                </div>
            </div>

            {loading ? (
                <div>Loading ads...</div>
            ) : pendingAds.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: '#ffffff05', borderRadius: '16px' }}>
                    <ClockHistory size={40} style={{ marginBottom: '16px', color: '#94a3b8' }} />
                    <h3>No Pending Ads</h3>
                    <p style={{ color: '#64748b' }}>All caught up! Check back later.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                    {pendingAds.map(ad => (
                        <div key={ad.id} id={`ad-${ad.id}`} style={{ background: '#1e293b', borderRadius: '16px', overflow: 'hidden', border: '1px solid #334155', display: 'flex', flexDirection: 'column', transition: 'border 0.3s' }}>
                            {/* Ad Preview Image */}
                            <div style={{ height: '180px', background: ad.image ? `url(${ad.image}) center/cover` : '#334155', position: 'relative' }}>
                                <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                    Partner: {ad.businessName}
                                </span>
                            </div>

                            <div style={{ padding: '20px', flex: 1 }}>
                                <h3 style={{ marginTop: 0 }}>{ad.title}</h3>
                                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
                                    <a href={ad.url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>{ad.url}</a>
                                </p>

                                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', fontSize: '14px', color: '#cbd5e1' }}>
                                    <div>💰 Budget: <b>${ad.budget}</b></div>
                                    <div>⏳ Duration: <b>{ad.duration} Days</b></div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                                    <button
                                        onClick={() => handleApprove(ad)}
                                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <CheckCircle /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(ad)}
                                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <XCircle /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
