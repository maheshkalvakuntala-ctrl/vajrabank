import React from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function Loans() {
  const { currentUser, loading } = useCurrentUser();

  if (loading || !currentUser) return <div>Loading...</div>;

  // Mock Loan Status (derived from admin logic usually, but here simulating based on data)
  const hasActiveLoan = currentUser.balance > 50000;

  return (
    <div style={{ padding: '24px', color: 'black', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '8px' }}>Loans & Credit</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Manage your loans or apply for a new one.</p>

      {/* ACTIVE LOAN CARD */}
      {hasActiveLoan ? (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>ACTIVE</span>
            <h2 style={{ marginTop: '12px', marginBottom: '4px' }}>Personal Loan</h2>
            <p style={{ color: '#64748b', margin: 0 }}>Account: VJ-LOAN-8832</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Outstanding Balance</p>
            <h2 style={{ color: '#0f172a', margin: '4px 0' }}>₹{Math.round(currentUser.balance * 0.8).toLocaleString()}</h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Next EMI: ₹12,400 on 5th Feb</p>
          </div>
        </div>
      ) : (
        <div style={{ background: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1', padding: '40px', textAlign: 'center', marginBottom: '32px' }}>
          <h3>No Active Loans</h3>
          <p style={{ color: '#64748b' }}>You currently do not have any active loans with us.</p>
        </div>
      )}

      {/* NEW APPLICATION FORM (MOCK) */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px' }}>
        <h3 style={{ marginBottom: '24px' }}>Apply for a New Loan</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Loan Type</label>
            <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option>Personal Loan</option>
              <option>Home Loan</option>
              <option>Auto Loan</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Requested Amount</label>
            <input type="number" placeholder="Enter amount" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Duration (Months)</label>
            <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option>12 Months</option>
              <option>24 Months</option>
              <option>36 Months</option>
              <option>48 Months</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Monthly Income</label>
            <input type="number" placeholder="Your income" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>
        </div>

        <button style={{ marginTop: '24px', background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}>
          Check Eligibility
        </button>
      </div>

    </div>
  );
}
