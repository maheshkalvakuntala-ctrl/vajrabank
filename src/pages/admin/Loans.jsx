import React, { useMemo } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';

export default function AdminLoans() {
  const { data, loading } = useBankData();
  const { overrides, updateLoan } = useAdminActions();

  // Mock loan Data based on bankData
  const processedData = useMemo(() => {
    return data
      .filter(c => c.raw['Age'] > 25) // Simulate loan applicants
      .slice(0, 30)
      .map(item => ({
        ...item,
        loanAmount: (item.balance * 2.5).toFixed(0),
        loanStatus: overrides[item.customerId]?.loanStatus || 'Pending'
      }));
  }, [data, overrides]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '24px', color: 'black'}}>
      <h1>Loan Applications</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {processedData.map(customer => (
          <div key={customer.customerId} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{customer.fullName}</strong>
              <span style={{ fontSize: '12px', color: '#666' }}>ID: {customer.customerId}</span>
            </div>
            <div style={{ marginTop: '16px' }}>
              <p style={{ margin: '4px 0', color: '#666' }}>Requested Amount</p>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>₹{Number(customer.loanAmount).toLocaleString()}</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
                <span>CIBIL: <strong style={{ color: customer.cibilScore < 650 ? 'red' : 'green' }}>{customer.cibilScore}</strong></span>
                <span>Income: ₹{Math.round(customer.balance / 0.3).toLocaleString()}</span>
              </div>
            </div>

            {customer.loanStatus === 'Pending' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button onClick={() => updateLoan(customer.customerId, 'Approved')} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>Approve</button>
                <button onClick={() => updateLoan(customer.customerId, 'Rejected')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>
              </div>
            ) : (
              <div style={{
                textAlign: 'center', padding: '8px', borderRadius: '4px', fontWeight: 'bold',
                background: customer.loanStatus === 'Approved' ? '#dcfce7' : '#fee2e2',
                color: customer.loanStatus === 'Approved' ? '#166534' : '#991b1b'
              }}>
                {customer.loanStatus.toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
