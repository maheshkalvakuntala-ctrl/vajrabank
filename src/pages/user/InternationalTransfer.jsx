import React, { useState } from 'react';

const InternationalTransfer = () => {
    const [amount, setAmount] = useState('1000');
    const [currency, setCurrency] = useState('USD');

    const rates = {
        'USD': 83.25,
        'EUR': 90.12,
        'GBP': 105.45,
        'AED': 22.67
    };

    const calculated = (amount * rates[currency]).toFixed(2);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>International Transfers</h1>

            <div style={styles.grid}>
                {/* Calculator Section */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Exchange Rate Calculator</h2>
                    <div style={styles.calcBox}>
                        <div style={styles.inputRow}>
                            <input
                                style={styles.input}
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <select
                                style={styles.select}
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="AED">AED</option>
                            </select>
                        </div>
                        <div style={styles.divider}>
                            <span style={styles.equal}>=</span>
                        </div>
                        <div style={styles.resultRow}>
                            <span style={styles.resultValue}>₹ {calculated}</span>
                            <span style={styles.resultLabel}>INR (Estimated)</span>
                        </div>
                    </div>
                    <p style={styles.rateInfo}>1 {currency} = ₹{rates[currency]} (Last updated 2 mins ago)</p>
                    <button style={styles.primaryBtn}>Initiate Transfer</button>
                </div>

                {/* Popular Countries */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Send to Popular Destinations</h2>
                    <div style={styles.countryList}>
                        {['USA', 'UK', 'UAE', 'Canada', 'Germany', 'Singapore'].map(country => (
                            <div key={country} style={styles.countryItem}>
                                <div style={styles.flagPlaceholder}>📍</div>
                                <span>{country}</span>
                            </div>
                        ))}
                    </div>
                    <button style={styles.secondaryBtn}>View All Countries</button>
                </div>

                {/* Tracking / Info Card */}
                <div style={{ ...styles.card, gridColumn: 'span 2' }}>
                    <div style={styles.infoContent}>
                        <div style={styles.infoIcon}>🌐</div>
                        <div>
                            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Swift & Secure Global Network</h3>
                            <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                                Move money across 180+ countries with competitive rates and zero hidden fees.
                                Most transfers are completed within 24 hours.
                            </p>
                        </div>
                    </div>
                </div>
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
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
    },
    card: {
        background: 'rgba(12, 20, 44, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '20px',
        padding: '24px',
    },
    cardTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#94a3b8' },
    calcBox: {
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
    },
    inputRow: { display: 'flex', gap: '12px' },
    input: {
        flex: 1,
        background: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        padding: '12px',
        color: '#fff',
        fontSize: '20px',
        fontWeight: '600',
    },
    select: {
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '10px',
        padding: '0 12px',
        color: '#3b82f6',
        fontWeight: '600',
    },
    divider: { textAlign: 'center', margin: '12px 0' },
    equal: { fontSize: '24px', color: '#94a3b8' },
    resultRow: { textAlign: 'center' },
    resultValue: { fontSize: '28px', fontWeight: '800', display: 'block' },
    resultLabel: { fontSize: '12px', color: '#94a3b8' },
    rateInfo: { fontSize: '12px', color: '#64748b', textAlign: 'center', marginBottom: '20px' },
    primaryBtn: {
        width: '100%',
        padding: '14px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        border: 'none',
        color: '#fff',
        fontWeight: '600',
        cursor: 'pointer',
    },
    countryList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px',
    },
    countryItem: {
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '12px',
        borderRadius: '12px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
    },
    flagPlaceholder: { fontSize: '20px' },
    secondaryBtn: {
        width: '100%',
        padding: '12px',
        borderRadius: '12px',
        background: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#94a3b8',
        fontWeight: '600',
        cursor: 'pointer',
    },
    infoContent: { display: 'flex', gap: '20px', alignItems: 'center' },
    infoIcon: { fontSize: '40px' }
};

export default InternationalTransfer;
