import React, { useState, useEffect } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';

export default function Loans() {
  const { currentUser, loading } = useCurrentUser();
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({
    loanType: 'Personal Loan',
    amount: '',
    tenure: '12',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch applications for current user
  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(userDB, 'loanApplications'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = [];
      snapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() });
      });
      // Sort by date (desc)
      apps.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setApplications(apps);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.reason) {
      alert("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create Loan Application
      const appRef = await addDoc(collection(userDB, 'loanApplications'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName,
        loanType: formData.loanType,
        amount: Number(formData.amount),
        tenureMonths: Number(formData.tenure),
        reason: formData.reason,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // 2. Create Admin Notification
      await addDoc(collection(userDB, 'notifications'), {
        role: 'admin',
        type: 'loan',
        message: `New loan application from ${currentUser.email}`,
        userId: currentUser.uid,
        read: false,
        redirectTo: '/admin/loans',
        createdAt: serverTimestamp()
      });

      alert("Application submitted successfully!");
      setFormData({ loanType: 'Personal Loan', amount: '', tenure: '12', reason: '' });
    } catch (err) {
      console.error("Error applying for loan:", err);
      alert("Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !currentUser) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Secure Data...</div>;

  return (
    <div style={{ padding: '24px', color: 'black', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '8px' }}>Loans & Credit</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Manage your loans or apply for a new one.</p>

      {/* RENDER ACTIVE/HISTORY APPLICATIONS */}
      <h3 style={{ marginBottom: '16px' }}>My Applications</h3>
      {applications.length === 0 ? (
        <div style={{ background: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1', padding: '30px', textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ color: '#64748b', margin: 0 }}>No loan applications found. Start by applying below.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
          {applications.map(app => (
            <div key={app.id} style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{
                    background: app.status === 'approved' ? '#dcfce7' : app.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                    color: app.status === 'approved' ? '#166534' : app.status === 'rejected' ? '#991b1b' : '#92400e',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}>
                    {app.status}
                  </span>
                  <strong style={{ fontSize: '16px' }}>{app.loanType}</strong>
                </div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                  Amount: ₹{app.amount.toLocaleString()} | Tenure: {app.tenureMonths} Months
                </p>
                {app.status === 'approved' && (
                  <p style={{ margin: '8px 0 0 0', color: '#10b981', fontSize: '13px', fontWeight: '500' }}>
                    ✅ Approved! Expected disbursement in {app.expectedDisbursementDays} days.
                  </p>
                )}
                {app.status === 'rejected' && (
                  <p style={{ margin: '8px 0 0 0', color: '#ef4444', fontSize: '13px', fontWeight: '500' }}>
                    ❌ Rejected: {app.rejectionReason}
                  </p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                  Applied on: {app.createdAt?.toDate().toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEW APPLICATION FORM */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '24px' }}>Apply for a New Loan</h3>

        <form onSubmit={handleApply}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Loan Type</label>
              <select
                value={formData.loanType}
                onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }}
              >
                <option value="Personal Loan">Personal Loan</option>
                <option value="Home Loan">Home Loan</option>
                <option value="Education Loan">Education Loan</option>
                <option value="Business Loan">Business Loan</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Requested Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Tenure (Months)</label>
              <select
                value={formData.tenure}
                onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }}
              >
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
                <option value="48">48 Months</option>
                <option value="60">60 Months</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Reason for Loan</label>
              <input
                type="text"
                placeholder="e.g. Home renovation"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: '24px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
              transition: 'all 0.2s',
              opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
