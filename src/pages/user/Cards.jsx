import React, { useState, useEffect } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Wifi } from 'react-bootstrap-icons';

export default function Cards() {
  const { currentUser, loading } = useCurrentUser();
  const [isBlocked, setIsBlocked] = useState(false);
  const [onlineEnabled, setOnlineEnabled] = useState(true);

  // Load persistent card state
  useEffect(() => {
    if (currentUser) {
      const cardState = localStorage.getItem(`cardState_${currentUser.customerId}`);
      if (cardState) {
        const { blocked, online } = JSON.parse(cardState);
        setIsBlocked(blocked);
        setOnlineEnabled(online);
      }
    }
  }, [currentUser]);

  const updateCardState = (newBlocked, newOnline) => {
    setIsBlocked(newBlocked);
    setOnlineEnabled(newOnline);
    localStorage.setItem(`cardState_${currentUser.customerId}`, JSON.stringify({ blocked: newBlocked, online: newOnline }));
  };

  if (loading || !currentUser) return <div>Loading...</div>;

  return (
    <div style={{ padding: '24px', color: 'black', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '8px' }}>My Cards</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Manage your debit and credit cards.</p>

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
              **** **** **** 8892
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '32px' }}>
              <div>
                <p style={{ fontSize: '12px', opacity: 0.7, margin: 0, textTransform: 'uppercase' }}>Card Holder</p>
                <p style={{ fontSize: '18px', fontWeight: '600', margin: '4px 0 0 0', textTransform: 'uppercase' }}>{currentUser.fullName}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>EXP</p>
                <p style={{ fontSize: '16px', fontWeight: '600', margin: '4px 0 0 0' }}>12/28</p>
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
              <strong>Credit Limit</strong>
              <strong>₹25,000 / ₹1,50,000</strong>
            </div>
            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '16%', height: '100%', background: '#3b82f6' }}></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
