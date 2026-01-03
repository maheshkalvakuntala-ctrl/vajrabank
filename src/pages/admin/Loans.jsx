import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';

export default function AdminLoans() {
  const [pendingLoans, setPendingLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending loans from Firestore
  useEffect(() => {
    const q = query(
      collection(userDB, 'loanApplications'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loans = [];
      snapshot.forEach((doc) => {
        loans.push({ id: doc.id, ...doc.data() });
      });
      setPendingLoans(loans);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (loanId, userId, amount) => {
    try {
      const disbursementDays = 3 + Math.floor(Math.random() * 5); // 3-7 days

      // 1. Update Loan Status
      await updateDoc(doc(userDB, 'loanApplications', loanId), {
        status: 'approved',
        expectedDisbursementDays: disbursementDays,
        approvedAt: serverTimestamp()
      });

      // 2. Notify User
      await addDoc(collection(userDB, 'notifications'), {
        userId: userId,
        role: 'user',
        type: 'loan',
        message: `Your loan of ₹${amount.toLocaleString()} is approved. Amount will be credited in ${disbursementDays} days.`,
        read: false,
        redirectTo: '/user/loans',
        createdAt: serverTimestamp()
      });

      alert("Loan Approved and user notified!");
    } catch (err) {
      console.error("Error approving loan:", err);
      alert("Failed to approve loan");
    }
  };

  const handleReject = async (loanId, userId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      // 1. Update Loan Status
      await updateDoc(doc(userDB, 'loanApplications', loanId), {
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: serverTimestamp()
      });

      // 2. Notify User
      await addDoc(collection(userDB, 'notifications'), {
        userId: userId,
        role: 'user',
        type: 'loan',
        message: `Your loan application was rejected. Tap to view reason.`,
        read: false,
        redirectTo: '/user/loans',
        createdAt: serverTimestamp()
      });

      alert("Loan Rejected and user notified!");
    } catch (err) {
      console.error("Error rejecting loan:", err);
      alert("Failed to reject loan");
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Applications...</div>;

  return (
    <div style={{ padding: '24px', color: 'black' }}>
      <h1>Loan Applications</h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Review and approve/reject pending loan requests.</p>

      {pendingLoans.length === 0 ? (
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', margin: 0 }}>No pending loan applications.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {pendingLoans.map(loan => (
            <div key={loan.id} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <strong style={{ fontSize: '18px' }}>{loan.userName}</strong>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{loan.loanType}</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '13px' }}>Requested Amount</p>
                <h3 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>₹{loan.amount.toLocaleString()}</h3>
              </div>

              <div style={{ marginBottom: '20px', fontSize: '14px' }}>
                <p style={{ margin: '0 0 8px 0' }}><strong>Tenure:</strong> {loan.tenureMonths} Months</p>
                <p style={{ margin: 0 }}><strong>Reason:</strong> {loan.reason}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => handleApprove(loan.id, loan.userId, loan.amount)}
                  style={{ background: '#22c55e', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(loan.id, loan.userId)}
                  style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
