import React, { useState } from 'react';

export default function CustomerModal({ customer, overrides, onAction, onClose }) {
    if (!customer) return null;

    // Local state for remarks before saving
    const [remarkText, setRemarkText] = useState(overrides?.remarks || "");

    // Merge overrides
    const isFrozen = overrides?.isFrozen ?? customer.isFrozen;
    const isFlagged = overrides?.flagged ?? false;

    const handleRemarkSave = () => {
        onAction.addRemark(customer.customerId, remarkText);
        alert("Remark Saved!");
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="modal-content" style={{
                background: 'white',
                borderRadius: '12px',
                width: '800px',
                maxWidth: '95%',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {/* HEADER */}
                <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isFlagged ? '#fee2e2' : 'white' }}>
                    <div>
                        <h2 style={{ margin: 0 }}>{customer.fullName}</h2>
                        <span style={{ color: '#6b7280', fontSize: '14px' }}>ID: {customer.customerId}</span>
                        {isFlagged && <span style={{ marginLeft: '12px', color: '#dc2626', fontWeight: 'bold' }}>⚠️ SUSPICIOUS</span>}
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
                </div>

                {/* BODY - SCROLLABLE */}
                <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>

                    {/* 1. KEY METRICS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                            <label style={{ fontSize: '12px', color: '#64748b' }}>Account Balance</label>
                            <div style={{ fontSize: '18px', fontWeight: '600', color: customer.balance < 0 ? '#ef4444' : '#0f172a' }}>
                                ₹{customer.balance.toLocaleString()}
                            </div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                            <label style={{ fontSize: '12px', color: '#64748b' }}>Risk Level</label>
                            <div className={`risk-badge risk-${customer.riskLevel.toLowerCase()}`} style={{ display: 'inline-block', marginTop: '4px' }}>
                                {customer.riskLevel}
                            </div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                            <label style={{ fontSize: '12px', color: '#64748b' }}>CIBIL Score</label>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: customer.cibilScore < 650 ? '#dc2626' : '#16a34a' }}>
                                {customer.cibilScore}
                            </div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                            <label style={{ fontSize: '12px', color: '#64748b' }}>Status</label>
                            <div style={{ fontSize: '16px', fontWeight: '500' }}>
                                {isFrozen ? '❄️ Frozen' : customer.activeStatus}
                            </div>
                        </div>
                    </div>

                    {/* 2. DETAIL SECTIONS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

                        {/* LEFT: PERSONAL INFO */}
                        <div>
                            <h4 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', marginBottom: '16px' }}>Personal Details</h4>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                <div className="detail-row"><span>Email:</span> <strong>{customer.email}</strong></div>
                                <div className="detail-row"><span>Phone:</span> <strong>{customer.raw['Contact Number']}</strong></div>
                                <div className="detail-row"><span>Address:</span> <strong>{customer.raw['Address']}</strong></div>
                                <div className="detail-row"><span>Gender:</span> <strong>{customer.gender}</strong></div>
                                <div className="detail-row"><span>Age:</span> <strong>{customer.age}</strong></div>
                            </div>

                            <h4 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', marginBottom: '16px', marginTop: '32px' }}>Financial Health</h4>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                <div className="detail-row"><span>Credit Util:</span> <strong>{Math.round(customer.raw['Credit Utilization'] * 100)}%</strong></div>
                                <div className="detail-row"><span>Credit Limit:</span> <strong>₹{customer.raw['Credit Limit']}</strong></div>
                                <div className="detail-row"><span>Payment Delay:</span> <strong style={{ color: customer.paymentDelay > 60 ? 'red' : 'inherit' }}>{customer.paymentDelay} days</strong></div>
                            </div>
                        </div>

                        {/* RIGHT: ADMIN ACTIONS */}
                        <div style={{ background: '#fef2f2', padding: '20px', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                            <h4 style={{ color: '#991b1b', marginTop: 0, marginBottom: '20px' }}>⚠️ Admin Actions</h4>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', background: 'white', padding: '12px', borderRadius: '8px' }}>
                                <div>
                                    <strong>Freeze Account</strong>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Prevent all transactions</p>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={isFrozen}
                                        onChange={() => onAction.toggleFreeze(customer.customerId, isFrozen)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', background: 'white', padding: '12px', borderRadius: '8px' }}>
                                <div>
                                    <strong>Flag Suspicious</strong>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Mark for high-priority review</p>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={isFlagged}
                                        onChange={() => onAction.toggleFlag(customer.customerId, isFlagged)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Admin Remarks</label>
                                <textarea
                                    rows="4"
                                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                    placeholder="Add notes about this case..."
                                    value={remarkText}
                                    onChange={(e) => setRemarkText(e.target.value)}
                                />
                                <button
                                    onClick={handleRemarkSave}
                                    style={{ marginTop: '8px', padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', float: 'right' }}
                                >
                                    Save Note
                                </button>
                            </div>

                        </div>
                    </div>

                </div>

                {/* FOOTER */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '8px 24px', borderRadius: '6px', border: '1px solid #ddd', background: 'white', color: '#374151', cursor: 'pointer' }}>
                        Close
                    </button>
                </div>
            </div>

            {/* CSS for Toggles included here for simplicity */}
            <style>{`
        .detail-row { display: flex; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px dashed #e2e8f0; }
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; -webkit-transition: .4s; transition: .4s; }
        input:checked + .slider { background-color: #ef4444; }
        input:focus + .slider { box-shadow: 0 0 1px #ef4444; }
        input:checked + .slider:before { -webkit-transform: translateX(20px); -ms-transform: translateX(20px); transform: translateX(20px); }
        .slider.round { border-radius: 34px; }
        .slider.round:before { border-radius: 50%; }
      `}</style>
        </div>
    );
}
