import React, { useState, useEffect } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Person, Envelope, Phone, GeoAlt, ShieldLock, CheckCircle, XCircle } from 'react-bootstrap-icons';

export default function Profile() {
  const { currentUser, loading, updateUserProfile } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        email: currentUser.email,
        phone: currentUser.phone,
        address: currentUser.address
      });
    }
  }, [currentUser]);

  const handleSave = () => {
    updateUserProfile(formData);
    setIsEditing(false);
    showToast("Profile updated successfully!", "success");
  };

  const handleCancel = () => {
    setFormData({
      email: currentUser.email,
      phone: currentUser.phone,
      address: currentUser.address
    });
    setIsEditing(false);
    showToast("Changes discarded.", "info");
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading || !currentUser) return <div>Loading...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', color: 'black', position: 'relative' }}>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: toast.type === 'success' ? '#10b981' : '#64748b', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', animation: 'fadeUp 0.3s ease' }}>
          {toast.msg}
        </div>
      )}

      <h1 style={{ marginBottom: '32px' }}>My Profile</h1>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>

        {/* PROFILE HEADER */}
        <div style={{ padding: '32px', background: 'linear-gradient(to right, #f8fafc, #fff)', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '80px', height: '80px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '32px', fontWeight: 'bold' }}>
            {currentUser.firstName.charAt(0)}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px' }}>{currentUser.fullName}</h2>
            <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>Customer ID: {currentUser.customerId}</p>
          </div>

          <div style={{ marginLeft: 'auto' }}>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', color: '#334155', fontWeight: '500' }}>
                Edit Profile
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleCancel} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', color: '#64748b' }}>
                  Cancel
                </button>
                <button onClick={handleSave} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#3b82f6', cursor: 'pointer', color: 'white' }}>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* DETAILS GRID */}
        <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
              <Envelope /> Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #3b82f6', outline: 'none' }}
              />
            ) : (
              <div style={{ fontSize: '16px', fontWeight: '500' }}>{currentUser.email}</div>
            )}
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
              <Phone /> Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #3b82f6', outline: 'none' }}
              />
            ) : (
              <div style={{ fontSize: '16px', fontWeight: '500' }}>{currentUser.phone}</div>
            )}
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
              <GeoAlt /> Residential Address
            </label>
            {isEditing ? (
              <textarea
                rows="2"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #3b82f6', outline: 'none' }}
              />
            ) : (
              <div style={{ fontSize: '16px', fontWeight: '500' }}>{currentUser.address}</div>
            )}
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
              <ShieldLock /> Security Questions
            </label>
            <div style={{ fontSize: '16px', fontWeight: '500', color: '#64748b' }}>Set (3 questions) <span style={{ fontSize: '12px', fontStyle: 'italic' }}>(Read-only)</span></div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
              Last Login
            </label>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>{new Date().toLocaleDateString()}</div>
          </div>

        </div>
      </div>
    </div>
  );
}
