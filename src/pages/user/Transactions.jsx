import React, { useState, useMemo } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Download, Filter, X } from 'react-bootstrap-icons';

export default function Transactions() {
  const { currentUser, loading } = useCurrentUser();
  const [filterType, setFilterType] = useState('All');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [page, setPage] = useState(1);

  // SIMULATE TRANSACTIONS (Deterministic)
  const allTransactions = useMemo(() => {
    if (!currentUser) return [];
    return Array.from({ length: 45 }).map((_, i) => {
      const isCredit = i % 3 === 0;
      const amount = (i + 1) * 240 + 50;
      return {
        id: `TXN-${currentUser.customerId}-${1000 + i}`,
        date: new Date(Date.now() - i * 86400000 * 1.5).toLocaleDateString(),
        description: isCredit ? 'Deposit via UPI' : `Payment to ${['Amazon', 'Uber', 'Netflix', 'Swiggy', 'Electricity Bill'][i % 5]}`,
        type: isCredit ? 'Credit' : 'Debit',
        amount: amount,
        status: 'Success',
        refId: `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        balanceAfter: Math.round(currentUser.balance - (i * 500)) // Mock logic
      };
    });
  }, [currentUser]);

  // FILTER & PAGINATE
  const filteredTxns = useMemo(() => {
    return allTransactions.filter(t => filterType === 'All' || t.type === filterType);
  }, [allTransactions, filterType]);

  const pagedTxns = filteredTxns.slice((page - 1) * 10, page * 10);
  const totalPages = Math.ceil(filteredTxns.length / 10);

  if (loading || !currentUser) return <div>Loading...</div>;

  return (
    <div style={{ padding: '24px', color: 'black', position: 'relative' }}>

      {/* HEADER & FILTERS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Transaction History</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
            style={{ background: 'white', border: '1px solid #e2e8f0', color: '#334155', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}
          >
            <option value="All">All Transactions</option>
            <option value="Credit">Credits Only</option>
            <option value="Debit">Debits Only</option>
          </select>
          <button className="btn" style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Download /> Export CSV
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', color: '#64748b' }}>Date</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', color: '#64748b' }}>Description</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', color: '#64748b' }}>Ref ID</th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '600', color: '#64748b' }}>Amount</th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontWeight: '600', color: '#64748b' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {pagedTxns.map(txn => (
              <tr key={txn.id} onClick={() => setSelectedTxn(txn)} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                <td style={{ padding: '16px 24px', color: '#334155' }}>{txn.date}</td>
                <td style={{ padding: '16px 24px', fontWeight: '500' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: txn.type === 'Credit' ? '#f0fdf4' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                      {txn.type === 'Credit' ? '↓' : '↑'}
                    </div>
                    {txn.description}
                  </div>
                </td>
                <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '13px', fontFamily: 'monospace' }}>{txn.id}</td>
                <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '600', color: txn.type === 'Credit' ? '#166534' : '#1e293b' }}>
                  {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>Success</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#cbd5e1' : '#334155' }}>Previous</button>
          <span style={{ color: '#64748b' }}>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#cbd5e1' : '#334155' }}>Next</button>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedTxn && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '400px', maxWidth: '90%', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Transaction Details</h3>
              <X size={24} style={{ cursor: 'pointer' }} onClick={() => setSelectedTxn(null)} />
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '32px', margin: '0 0 8px 0', color: selectedTxn.type === 'Credit' ? '#166534' : '#1e293b' }}>
                  {selectedTxn.type === 'Credit' ? '+' : '-'}₹{selectedTxn.amount.toLocaleString()}
                </h2>
                <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>{selectedTxn.status}</span>
              </div>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Date</span>
                  <span style={{ fontWeight: '500' }}>{selectedTxn.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Merchant</span>
                  <span style={{ fontWeight: '500' }}>{selectedTxn.description}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Reference ID</span>
                  <span style={{ fontWeight: '500', fontFamily: 'monospace' }}>{selectedTxn.refId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Closing Balance</span>
                  <span style={{ fontWeight: '500' }}>₹{selectedTxn.balanceAfter.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
              <button style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Download Receipt</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
