import React, { useState } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import UserAnalytics from '../../components/user/UserAnalytics';
import { ArrowUpRight, Plus, Download, ShieldCheck, Wallet, GraphUpArrow, X, CheckCircle } from 'react-bootstrap-icons';
import '../../styles/Dashboard.css';
import { NavLink } from 'react-router-dom';

export default function UserDashboard() {
  const { currentUser, loading } = useCurrentUser();
  const [showModal, setShowModal] = useState(null); // 'transfer', 'statement', 'account'
  const [toast, setToast] = useState(null);

  const handleAction = (type) => {
    // Mock success for simple actions
    if (type === 'ACCOUNT_REQ') {
      showToast("New Account Request submitted to Admin.", "success");
    } else {
      setShowModal(type);
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeModal = () => setShowModal(null);

  if (loading || !currentUser) return <div className="p-5">Loading your dashboard...</div>;

  return (
    <div className="dashboard-page" style={{ paddingBottom: '40px', position: 'relative' }}>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', animation: 'fadeUp 0.3s ease' }}>
          <CheckCircle style={{ marginRight: '8px' }} /> {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#0f172a', fontWeight: '700', margin: 0 }}>
          Hello, {currentUser.firstName} <span style={{ fontSize: '24px' }}>👋</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>Here is your financial overview.</p>
      </div>

      {/* ROW 1: STATS */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>

        {/* BALANCE CARD */}
        <div className="stat-card primary" style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#dbeafe', margin: 0, fontSize: '14px' }}>Total Balance</p>
              <h2 style={{ margin: '8px 0', fontSize: '32px' }}>₹{currentUser.balance.toLocaleString()}</h2>
            </div>
            <Wallet size={24} style={{ opacity: 0.8 }} />
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', fontSize: '12px' }}>
            **** **** 8892
          </div>
        </div>

        {/* GROWTH CARD */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Monthly Interest</p>
              <h3 style={{ margin: '8px 0', color: '#10b981' }}>+₹{Math.round(currentUser.balance * 0.004).toLocaleString()}</h3>
            </div>
            <div style={{ background: '#dcfce7', padding: '8px', borderRadius: '50%', color: '#166534' }}>
              <GraphUpArrow />
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Projected based on current balance</p>
        </div>

        {/* ACCOUNT STATUS */}
        <div className="stat-card" style={{ borderLeft: `4px solid ${currentUser.accountStatus === 'Active' ? '#10b981' : '#ef4444'}` }}>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Account Status</p>
          <h3 style={{ margin: '8px 0', color: '#0f172a' }}>{currentUser.accountStatus}</h3>
          <span style={{
            fontSize: '12px',
            padding: '2px 8px',
            borderRadius: '12px',
            background: currentUser.accountStatus === 'Active' ? '#dcfce7' : '#fee2e2',
            color: currentUser.accountStatus === 'Active' ? '#166534' : '#991b1b'
          }}>
            {currentUser.accountStatus === 'Active' ? 'Fully Operational' : 'Action Required'}
          </span>
        </div>

        {/* KYC STATUS */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>KYC Status</p>
              <h3 style={{ margin: '8px 0', color: '#0f172a' }}>{currentUser.kycStatus}</h3>
            </div>
            <div style={{ background: '#e0f2fe', padding: '8px', borderRadius: '50%', color: '#0369a1' }}>
              <ShieldCheck />
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Identity Verification</p>
        </div>

      </div>

      {/* ROW 2: ACTIONS & TRANSACTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '32px' }}>

        {/* LEFT COL: ACTIONS & INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* QUICK ACTIONS */}
          {/* <div className="quick-actions" style={{ padding: '0' }}>
            <h3 style={{ fontSize: '18px', color: '#334155', marginBottom: '16px' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button onClick={() => setShowModal('transfer')} className="btn" style={{ background: '#3b82f6', color: 'white', border: 'none', justifyContent: 'center', cursor: 'pointer' }}>
                <ArrowUpRight /> Send Money
              </button>
              <button onClick={() => handleAction('ACCOUNT_REQ')} className="btn" style={{ background: 'white', border: '1px solid #e2e8f0', color: '#334155', justifyContent: 'center', cursor: 'pointer' }}>
                <Plus /> Add Account
              </button>
              <button onClick={() => showToast("Statement downloaded (Mock PDF)", "success")} className="btn" style={{ background: 'white', border: '1px solid #e2e8f0', color: '#334155', justifyContent: 'center', cursor: 'pointer' }}>
                <Download /> Statement
              </button>
              <button className="btn" style={{ background: 'white', border: '1px solid #e2e8f0', color: '#334155', justifyContent: 'center', cursor: 'not-allowed' }}>
                ⋯ More
              </button>
            </div>
          </div> */}

          {/* ACCOUNT DETAILS */}
          <div className="info-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', color: '#334155', marginBottom: '16px' }}>Account Details</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>Account Number</span>
              <span style={{ fontWeight: '600' }}>{currentUser.customerId}00892</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>Account Type</span>
              <span style={{ fontWeight: '600' }}>{currentUser.accountType}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
              <span style={{ color: '#64748b' }}>Branch</span>
              <span style={{ fontWeight: '600' }}>Main Street (IFSC: VJRA001)</span>
            </div>
          </div>

        </div>

        {/* RIGHT COL: RECENT TRANSACTIONS */}
        <div className="info-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#334155' }}>Recent Transactions</h3>
            <NavLink to="/user/transactions" style={{ fontSize: '12px', color: '#3b82f6', cursor: 'pointer', textDecoration: 'none' }}>View All</NavLink>
          </div>

          <div>
            {currentUser.transactions && currentUser.transactions.length > 0 ? (
              currentUser.transactions.slice(0, 5).map((txn, i) => (
                <div key={i} className="transaction-item" style={{ padding: '16px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: txn.type === 'Deposit' ? '#f0fdf4' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                      {txn.type === 'Deposit' ? '↓' : '↑'}
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#0f172a' }}>{txn.reason || (txn.type === 'Deposit' ? 'Deposit' : 'Withdrawal')}</strong>
                      <small style={{ color: '#64748b' }}>{new Date(txn.date).toLocaleDateString()}</small>
                    </div>
                  </div>
                  <div style={{ fontWeight: '600', color: txn.type === 'Deposit' ? '#166534' : '#991b1b' }}>
                    {txn.type === 'Deposit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No recent transactions found.</div>
            )}
          </div>
        </div>
      </div>

      {/* ANALYTICS SECTION */}
      <UserAnalytics />

      {/* TRANSFER MODAL */}
      {showModal === 'transfer' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '400px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Transfer Money</h3>
              <X size={24} style={{ cursor: 'pointer' }} onClick={closeModal} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>Recipient Account</label>
              <input type="text" placeholder="Enter account number" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>Amount</label>
              <input type="number" placeholder="₹ Enter amount" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <button onClick={() => { closeModal(); showToast("Transfer Successful!", "success"); }} style={{ width: '100%', background: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
              Send Securely
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
