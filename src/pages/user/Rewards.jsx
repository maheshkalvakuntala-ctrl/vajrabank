import React from 'react';

const Rewards = () => {
    const rewards = [
        { id: 1, title: 'Amazon Voucher', points: 500, icon: '🌟', color: '#FF9900' },
        { id: 2, title: 'Fuel Cashback', points: 250, icon: '⛽', color: '#10b981' },
        { id: 3, title: 'Movie Tickets', points: 400, icon: '🎬', color: '#ef4444' },
        { id: 4, title: 'Starbucks Card', points: 300, icon: '☕', color: '#00704A' },
    ];

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Rewards & Offers</h1>

            <div style={styles.heroCard}>
                <div style={styles.balanceInfo}>
                    <p style={styles.balanceLabel}>Vajra Points Balance</p>
                    <h2 style={styles.balanceValue}>2,450 <span style={styles.pts}>PTS</span></h2>
                </div>
                <div style={styles.actionBox}>
                    <button style={styles.secondaryBtn}>Redemption History</button>
                    <button style={styles.primaryBtn}>How it works?</button>
                </div>
            </div>

            <h2 style={styles.sectionTitle}>Exclusive Offers</h2>
            <div style={styles.grid}>
                {rewards.map(reward => (
                    <div key={reward.id} style={styles.card}>
                        <div style={{ ...styles.iconBox, background: `${reward.color}22` }}>
                            <span style={styles.icon}>{reward.icon}</span>
                        </div>
                        <h3 style={styles.rewardTitle}>{reward.title}</h3>
                        <p style={styles.rewardPoints}>{reward.points} Points Req.</p>
                        <button style={styles.redeemBtn}>Redeem Now</button>
                    </div>
                ))}
            </div>

            <div style={styles.promoBanner}>
                <div style={styles.promoInfo}>
                    <h3>Refer a Friend</h3>
                    <p>Earn 1000 bonus points for every successful referral.</p>
                </div>
                <button style={styles.inviteBtn}>Invite Now</button>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '30px', color: '#fff' },
    title: {
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '30px',
        background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    heroCard: {
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '24px',
        padding: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
    },
    balanceLabel: { color: '#94a3b8', fontSize: '16px', marginBottom: '8px' },
    balanceValue: { fontSize: '48px', fontWeight: '800' },
    pts: { fontSize: '20px', fontWeight: '500', color: '#94a3b8' },
    actionBox: { display: 'flex', gap: '16px' },
    primaryBtn: {
        background: '#fff',
        color: '#080f25',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '12px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    secondaryBtn: {
        background: 'transparent',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '12px 24px',
        borderRadius: '12px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    sectionTitle: { fontSize: '22px', fontWeight: '600', marginBottom: '24px', color: '#94a3b8' },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        marginBottom: '40px',
    },
    card: {
        background: 'rgba(12, 20, 44, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '20px',
        padding: '24px',
        textAlign: 'center',
    },
    iconBox: {
        width: '60px',
        height: '60px',
        borderRadius: '16px',
        margin: '0 auto 16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: { fontSize: '30px' },
    rewardTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '8px' },
    rewardPoints: { color: '#94a3b8', fontSize: '14px', marginBottom: '20px' },
    redeemBtn: {
        width: '100%',
        padding: '10px',
        borderRadius: '10px',
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        color: '#3b82f6',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    promoBanner: {
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '20px',
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    promoInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
    inviteBtn: {
        background: '#10b981',
        border: 'none',
        color: '#fff',
        padding: '10px 24px',
        borderRadius: '10px',
        fontWeight: '600',
        cursor: 'pointer',
    }
};

export default Rewards;
