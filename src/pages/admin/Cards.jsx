import React, { useMemo, useState, useEffect } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';

export default function AdminCards() {
  const { data, loading: dataLoading } = useBankData();
  const { overrides, toggleCardBlock } = useAdminActions();
  const [pendingApps, setPendingApps] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // Fetch pending card applications
  useEffect(() => {
    const q = query(
      collection(userDB, 'creditCardApplications'),
      where('status', '==', 'pending')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = [];
      snapshot.forEach(doc => apps.push({ id: doc.id, ...doc.data() }));
      setPendingApps(apps);
      setLoadingApps(false);
    });
    return () => unsubscribe();
  }, []);

  const handleApproveApp = async (appId, userId, cardType) => {
    try {
      const deliveryDays = 5 + Math.floor(Math.random() * 5); // 5-10 days
      await updateDoc(doc(userDB, 'creditCardApplications', appId), {
        status: 'approved',
        expectedDeliveryDays: deliveryDays,
        approvedAt: serverTimestamp()
      });

      await addDoc(collection(userDB, 'notifications'), {
        userId: userId,
        role: 'user',
        type: 'creditCard',
        message: `Your ${cardType} application is approved. Delivery in ${deliveryDays} days.`,
        read: false,
        redirectTo: '/user/cards',
        createdAt: serverTimestamp()
      });

      alert("Card application approved!");
    } catch (err) {
      console.error(err);
      alert("Error approving card");
    }
  };

  const handleRejectApp = async (appId, userId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      await updateDoc(doc(userDB, 'creditCardApplications', appId), {
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: serverTimestamp()
      });

      await addDoc(collection(userDB, 'notifications'), {
        userId: userId,
        role: 'user',
        type: 'creditCard',
        message: `Your credit card application was rejected. Tap to view reason.`,
        read: false,
        redirectTo: '/user/cards',
        createdAt: serverTimestamp()
      });

      alert("Card application rejected!");
    } catch (err) {
      console.error(err);
      alert("Error rejecting card");
    }
  };

  const processedData = useMemo(() => {
    return data.filter(c => c.raw['Credit Limit'] > 0).slice(0, 50).map(item => ({
      ...item,
      isBlocked: overrides[item.customerId]?.cardBlocked || false
    }));
  }, [data, overrides]);

  if (dataLoading || loadingApps) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Card Data...</div>;

  return (
    <div style={{ padding: '24px', color: 'black' }}>
      <h1>Card Management</h1>

      {/* NEW APPLICATIONS SECTION */}
      <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '20px' }}>Pending Applications</h2>
      {pendingApps.length === 0 ? (
        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
          <p style={{ color: '#64748b', margin: 0 }}>No pending applications</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
          {pendingApps.map(app => (
            <div key={app.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div>
                <strong style={{ fontSize: '16px' }}>{app.userName}</strong>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  {app.cardType} • Income: ₹{app.income.toLocaleString()}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleApproveApp(app.id, app.userId, app.cardType)}
                  style={{ background: '#22c55e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRejectApp(app.id, app.userId)}
                  style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EXISTING CARDS SECTION */}
      <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '20px' }}>Active Cards Control</h2>
      <div style={{ display: 'grid', gap: '16px' }}>
        {processedData.map(customer => (
          <div key={customer.customerId} style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '50px', height: '32px', background: 'linear-gradient(45deg, #3b82f6, #6366f1)', borderRadius: '6px' }}></div>
              <div>
                <strong>{customer.fullName}</strong>
                <div style={{ fontSize: '12px', color: '#666' }}>Limit: ₹{customer.raw['Credit Limit']} • Util: {Math.round(customer.raw['Credit Utilization'] * 100)}%</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {customer.isBlocked && <span style={{ color: 'red', fontWeight: 'bold', fontSize: '12px' }}>BLOCKED</span>}
              <button
                onClick={() => toggleCardBlock(customer.customerId, customer.isBlocked)}
                style={{
                  padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
                  border: '1px solid #e2e8f0', background: 'white',
                  color: customer.isBlocked ? '#22c55e' : '#ef4444',
                  fontSize: '13px', fontWeight: '500'
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
