import React, { useMemo } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';

export default function AdminCards() {
  const { data, loading } = useBankData();
  const { overrides, toggleCardBlock } = useAdminActions();

  const processedData = useMemo(() => {
    return data.filter(c => c.raw['Credit Limit'] > 0).slice(0, 50).map(item => ({
      ...item,
      isBlocked: overrides[item.customerId]?.cardBlocked || false
    }));
  }, [data, overrides]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '24px', color: 'black' }}>
      <h1>Card Management</h1>
      <div style={{ marginTop: '20px', display: 'grid', gap: '16px' }}>
        {processedData.map(customer => (
          <div key={customer.customerId} style={{ background: 'white', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '50px', height: '32px', background: 'linear-gradient(45deg, #3b82f6, #6366f1)', borderRadius: '6px' }}></div>
              <div>
                <strong>{customer.fullName}</strong>
                <div style={{ fontSize: '12px', color: '#666' }}>Limit: ₹{customer.raw['Credit Limit']} • Util: {Math.round(customer.raw['Credit Utilization'] * 100)}%</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {customer.isBlocked && <span style={{ color: 'red', fontWeight: 'bold' }}>BLOCKED</span>}
              <button
                onClick={() => toggleCardBlock(customer.customerId, customer.isBlocked)}
                style={{
                  padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
                  border: '1px solid #ccc', background: 'white',
                  color: customer.isBlocked ? '#22c55e' : '#ef4444'
                }}
              >
                {customer.isBlocked ? 'Unblock Card' : 'Block Card'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
