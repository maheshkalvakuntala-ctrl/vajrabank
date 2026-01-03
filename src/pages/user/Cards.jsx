import React, { useState, useEffect } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Wifi, PlusCircle, CreditCard as CardIcon } from 'react-bootstrap-icons';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';

export default function Cards() {
  const { currentUser, loading } = useCurrentUser();
  const [isBlocked, setIsBlocked] = useState(false);
  const [onlineEnabled, setOnlineEnabled] = useState(true);
  const [applications, setApplications] = useState([]);
  const [showApply, setShowApply] = useState(false);
  const [formData, setFormData] = useState({ cardType: 'Gold Card', income: '' });
  const [submitting, setSubmitting] = useState(false);

  // Load persistent card state & fetch applications
  useEffect(() => {
    if (!currentUser) return;

    // LocalStorage for block/online (legacy simulation)
    const cardState = localStorage.getItem(`cardState_${currentUser.customerId}`);
    if (cardState) {
      const { blocked, online } = JSON.parse(cardState);
      setIsBlocked(blocked);
      setOnlineEnabled(online);
    }

    // Firestore for Applications
    const q = query(
      collection(userDB, 'creditCardApplications'),
      where('userId', '==', currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = [];
      snapshot.forEach(doc => apps.push({ id: doc.id, ...doc.data() }));
      apps.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setApplications(apps);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!formData.income) return;

    setSubmitting(true);
    try {
      // 1. Create Application
      await addDoc(collection(userDB, 'creditCardApplications'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName,
        cardType: formData.cardType,
        income: Number(formData.income),
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // 2. Notify Admin
      await addDoc(collection(userDB, 'notifications'), {
        role: 'admin',
        type: 'creditCard',
        message: `New credit card application from ${currentUser.email}`,
        userId: currentUser.uid,
        read: false,
        redirectTo: '/admin/cards',
        createdAt: serverTimestamp()
      });

      alert("Credit card application submitted!");
      setShowApply(false);
      setFormData({ cardType: 'Gold Card', income: '' });
    } catch (err) {
      console.error(err);
      alert("Error submitting application");
    } finally {
      setSubmitting(false);
    }
  };

  const updateCardState = (newBlocked, newOnline) => {
    setIsBlocked(newBlocked);
    setOnlineEnabled(newOnline);
    localStorage.setItem(`cardState_${currentUser.customerId}`, JSON.stringify({ blocked: newBlocked, online: newOnline }));
  };

  if (loading || !currentUser) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Card Data...</div>;

  return (
    <div style={{ padding: '24px', color: 'black', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1>My Cards</h1>
        <button
          onClick={() => setShowApply(!showApply)}
          style={{
            background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px',
            borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            fontWeight: '600', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)'
          }}
        >
          <PlusCircle /> Apply for Card
        </button>
      </div>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Manage your debit and credit cards.</p>

      {/* APPLY FORM MODAL-ISH */}
      {showApply && (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '20px' }}>New Card Application</h3>
          <form onSubmit={handleApply} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Card Type</label>
              <select
                value={formData.cardType}
                onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              >
                <option>Platinum Card</option>
                <option>Gold Card</option>
                <option>Student Card</option>
                <option>Business Card</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Monthly Income (₹)</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={submitting} style={{ flex: 1, background: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                {submitting ? 'Sending...' : 'Submit'}
              </button>
              <button type="button" onClick={() => setShowApply(false)} style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* APPLICATIONS STATUS */}
      {applications.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '16px' }}>Application Status</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {applications.map(app => (
              <div key={app.id} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CardIcon size={20} style={{ color: '#3b82f6' }} />
                  <div>
                    <strong style={{ fontSize: '15px' }}>{app.cardType}</strong>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      Status: <span style={{
                        color: app.status === 'approved' ? '#10b981' : app.status === 'rejected' ? '#ef4444' : '#f59e0b',
                        fontWeight: '600', textTransform: 'uppercase'
                      }}>{app.status}</span>
                    </div>
                  </div>
                </div>
                {app.status === 'approved' && (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '500' }}>
                      📦 Delivery in {app.expectedDeliveryDays} days
                    </span>
                  </div>
                )}
                {app.status === 'rejected' && (
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#ef4444' }}>
                    Reason: {app.rejectionReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>

        {/* CARD VISUAL */}
        <div>
          <div style={{
            background: isBlocked
              ? 'linear-gradient(135deg, #334155, #1e293b)'
              : 'linear-gradient(135deg, #0f172a, #334155)',
            borderRadius: '20px',
            padding: '32px',
            color: 'white',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            aspectRatio: '1.6',
            position: 'relative',
            overflow: 'hidden',
            opacity: isBlocked ? 0.7 : 1,
            filter: isBlocked ? 'grayscale(1)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
              <img src="https://img.icons8.com/color/48/000000/chip-card.png" alt="Chip" style={{ width: '48px', opacity: 0.9 }} />
              <Wifi size={28} />
            </div>

            <h3 style={{ fontFamily: 'monospace', fontSize: '28px', letterSpacing: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              **** **** **** {currentUser.customerId.slice(-4)}
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '32px' }}>
              <div>
                <p style={{ fontSize: '12px', opacity: 0.7, margin: 0, textTransform: 'uppercase' }}>{currentUser.raw['Card Type'] || 'Debit'} Card</p>
                <p style={{ fontSize: '18px', fontWeight: '600', margin: '4px 0 0 0', textTransform: 'uppercase' }}>{currentUser.fullName}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>EXP</p>
                <p style={{ fontSize: '16px', fontWeight: '600', margin: '4px 0 0 0' }}>12/29</p>
              </div>
              <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" style={{ height: '40px' }} />
            </div>

            {isBlocked && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', border: '2px solid white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '24px', letterSpacing: '2px' }}>
                BLOCKED
              </div>
            )}
          </div>
        </div>

        {/* CONTROLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Freeze Card</h3>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Temporarily disable transactions</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={isBlocked} onChange={(e) => updateCardState(e.target.checked, onlineEnabled)} />
              <span className="slider round"></span>
            </label>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Online Transactions</h3>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Enable/Disable E-commerce</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={onlineEnabled} onChange={(e) => updateCardState(isBlocked, e.target.checked)} disabled={isBlocked} />
              <span className="slider round"></span>
            </label>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>Usage & Utilization</strong>
              <strong>{(currentUser.raw['Credit Utilization'] * 100).toFixed(1)}% Limit Used</strong>
            </div>
            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(100, currentUser.raw['Credit Utilization'] * 100)}%`,
                height: '100%',
                background: currentUser.raw['Credit Utilization'] > 0.7 ? '#ef4444' : '#3b82f6'
              }}></div >
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
