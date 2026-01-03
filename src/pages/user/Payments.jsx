import React, { useState } from 'react';

const Payments = () => {
    const [amount, setAmount] = useState('');
    const [upiId, setUpiId] = useState('');

    const quickTransfers = [
        { id: 1, name: 'Rahul S.', avatar: 'RS', phone: '98765 43210' },
        { id: 2, name: 'Priya K.', avatar: 'PK', phone: '87654 32109' },
        { id: 3, name: 'Amit V.', avatar: 'AV', phone: '76543 21098' },
        { id: 4, name: 'Sonia M.', avatar: 'SM', phone: '65432 10987' },
    ];

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Payments & Transfers</h1>

            <div style={styles.grid}>
                {/* UPI Section */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Your UPI ID</h2>
                    <div style={styles.upiBox}>
                        <span style={styles.upiText}>mahesh@vajrabank</span>
                        <button style={styles.copyBtn}>Copy</button>
                    </div>
                    <div style={styles.qrPlaceholder}>
                        <div style={styles.qrIcon}>📱</div>
                        <p style={styles.qrText}>Show QR Code</p>
                    </div>
                </div>

                {/* Quick Transfer */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Quick Transfer</h2>
                    <div style={styles.transferGrid}>
                        {quickTransfers.map(person => (
                            <div key={person.id} style={styles.personCard}>
                                <div style={styles.avatar}>{person.avatar}</div>
                                <span style={styles.personName}>{person.name}</span>
                            </div>
                        ))}
                        <div style={styles.addPerson}>+</div>
                    </div>
                </div>

                {/* Send Money Form */}
                <div style={{ ...styles.card, gridColumn: 'span 2' }}>
                    <h2 style={styles.cardTitle}>Send Money</h2>
                    <div style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Recipient UPI ID / Mobile / Account</label>
                            <input
                                style={styles.input}
                                placeholder="Enter details..."
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Amount (₹)</label>
                            <input
                                style={styles.input}
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <button style={styles.primaryBtn}>Proceed to Pay</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '30px',
        color: '#fff',
        minHeight: '100vh',
    },
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
    cardTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '20px',
        color: '#94a3b8',
    },
    upiBox: {
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '12px 16px',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    upiText: {
        fontSize: '16px',
        fontWeight: '500',
    },
    copyBtn: {
        background: 'rgba(59, 130, 246, 0.2)',
        border: 'none',
        color: '#3b82f6',
        padding: '4px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
    },
    qrPlaceholder: {
        textAlign: 'center',
        padding: '20px',
        border: '2px dashed rgba(59, 130, 246, 0.2)',
        borderRadius: '12px',
    },
    qrIcon: { fontSize: '32px', marginBottom: '8px' },
    qrText: { fontSize: '14px', color: '#94a3b8' },
    transferGrid: {
        display: 'flex',
        gap: '20px',
        overflowX: 'auto',
        paddingBottom: '10px',
    },
    personCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '70px',
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '8px',
    },
    personName: { fontSize: '12px', color: '#94a3b8' },
    addPerson: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '2px dashed rgba(59, 130, 246, 0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        color: '#3b82f6',
        cursor: 'pointer',
    },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '14px', color: '#94a3b8' },
    input: {
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(59, 130, 246, 0.1)',
        borderRadius: '12px',
        padding: '12px 16px',
        color: '#fff',
        fontSize: '16px',
        outline: 'none',
    },
    primaryBtn: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        border: 'none',
        borderRadius: '12px',
        padding: '14px',
        color: '#fff',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '10px',
        transition: 'all 0.3s ease',
    }
};

export default Payments;
