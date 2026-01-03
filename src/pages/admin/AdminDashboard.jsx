import React, { useMemo, useState, useEffect } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';
import DashboardStats from '../../components/admin/DashboardStats';
import AdminAnalytics from '../../components/admin/AdminAnalytics';
import AuditLogPanel from '../../components/admin/AuditLogPanel';
import { NavLink } from 'react-router-dom';
import { ArrowRight, ExclamationTriangle, FileText, CreditCard, CheckCircle, XCircle } from 'react-bootstrap-icons';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';
import "../../styles/GlassTheme.css"; // Ensure Glass Theme is active

export default function AdminDashboard() {
  const { data, loading, error } = useBankData();
  const { overrides, auditLogs } = useAdminActions();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch pending users from Firestore
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const q = query(collection(userDB, 'users'), where('status', '==', 'pending'));
        const querySnapshot = await getDocs(q);
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        setPendingUsers(users);
      } catch (error) {
        console.error('Error fetching pending users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchPendingUsers();
  }, []);

  // Approve user function
  const approveUser = async (userId) => {
    try {
      await updateDoc(doc(userDB, 'users', userId), {
        status: 'approved'
      });

      // Update local state
      setPendingUsers(prev => prev.filter(user => user.id !== userId));

      // Log the action
      console.log(`User ${userId} approved`);
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user. Please try again.');
    }
  };

  // Reject user function
  const rejectUser = async (userId) => {
    try {
      await updateDoc(doc(userDB, 'users', userId), {
        status: 'rejected'
      });

      // Update local state
      setPendingUsers(prev => prev.filter(user => user.id !== userId));

      // Log the action
      console.log(`User ${userId} rejected`);
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user. Please try again.');
    }
  };

  // MERGE DATA FOR ACCURATE STATS
  const processedData = useMemo(() => {
    return data.map(item => {
      const override = overrides[item.customerId];
      if (override) {
        return {
          ...item,
          isFrozen: override.isFrozen ?? item.isFrozen,
          isHighRisk: override.flagged ? true : item.isHighRisk
        };
      }
      return item;
    });
  }, [data, overrides]);

  if (loading) return <div className="p-10 text-center">Loading Secure Banking Data...</div>;
  if (error) return <div className="p-10 text-red-500">System Error: {error}</div>;

  return (
    <main style={{ maxWidth: '1600px', margin: '0 auto', paddingBottom: '40px' }}>

      {/* HEADER */}
      <div className="glass-header">
        <h1 className="glass-title">Command Center</h1>
        <p className="glass-subtitle">Live Operational Overview & Risk Assessment</p>
      </div>

      {/* ROW 1: OVERVIEW METRICS */}
      <section style={{ marginBottom: '32px' }}>
        <DashboardStats data={processedData} />
      </section>

      {/* ANALYTICS SECTION */}
      <section style={{ marginBottom: '32px' }}>
        <AdminAnalytics data={processedData} />
      </section>

      {/* ROW 2: RISK & ALERTS */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', color: '#334155', marginBottom: '16px', fontWeight: '600' }}>Risk & Alerts</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>

          {/* CARD 1: HIGH RISK */}
          <div className="glass-card" style={{ padding: '24px', borderTop: '4px solid #ef4444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ background: '#fee2e2', padding: '10px', borderRadius: '12px', color: '#ef4444' }}>
                <ExclamationTriangle size={20} />
              </div>
              <NavLink to="/admin/customers" style={{ textDecoration: 'none', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View All <ArrowRight size={12} />
              </NavLink>
            </div>
            <div>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>High Risk Accounts</span>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', margin: '4px 0' }}>
                {processedData.filter(d => d.isHighRisk).length}
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#ef4444', fontWeight: '500' }}>Requires Immediate Attention</p>
            </div>
          </div>

          {/* CARD 2: KYC PENDING */}
          <div className="glass-card" style={{ padding: '24px', borderTop: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '12px', color: '#d97706' }}>
                <FileText size={20} />
              </div>
              <NavLink to="/admin/kyc" style={{ textDecoration: 'none', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Process Queue <ArrowRight size={12} />
              </NavLink>
            </div>
            <div>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending KYC</span>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', margin: '4px 0' }}>
                {processedData.length}
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#d97706', fontWeight: '500' }}>Verification Requests</p>
            </div>
          </div>

          {/* CARD 3: CARD REQUESTS */}
          <div className="glass-card" style={{ padding: '24px', borderTop: '4px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ background: '#dbeafe', padding: '10px', borderRadius: '12px', color: '#2563eb' }}>
                <CreditCard size={20} />
              </div>
              <NavLink to="/admin/cards" style={{ textDecoration: 'none', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Manage Cards <ArrowRight size={12} />
              </NavLink>
            </div>
            <div>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Card Requests</span>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', margin: '4px 0' }}>
                12
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#3b82f6', fontWeight: '500' }}>+4 since yesterday</p>
            </div>
          </div>

        </div>
      </section>

      {/* USER APPROVAL SECTION */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', color: '#334155', marginBottom: '16px', fontWeight: '600' }}>User Account Approvals</h3>

        {loadingUsers ? (
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
            Loading pending approvals...
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
            <CheckCircle size={24} style={{ marginBottom: '8px' }} />
            <p>No pending user approvals</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {pendingUsers.map((user) => (
              <div key={user.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '16px' }}>
                    {user.firstName} {user.lastName}
                  </h4>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '14px' }}>
                    {user.email}
                  </p>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '14px' }}>
                    Mobile: {user.mobile} | Account: {user.accountType}
                  </p>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '12px', fontStyle: 'italic' }}>
                    Requested on: {user.createdAt?.toDate().toLocaleDateString()} {user.createdAt?.toDate().toLocaleTimeString()}
                  </p>
                  <p style={{ margin: 0, color: '#f59e0b', fontSize: '13px', fontWeight: '500' }}>
                    Status: Pending Approval
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => approveUser(user.id)}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => rejectUser(user.id)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* AUDIT LOG & SYSTEM STATUS SECTION */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

          {/* AUDIT LOG (Left, Large) */}
          <div style={{ minHeight: '400px', color: 'black' }}>
            <AuditLogPanel logs={auditLogs} />
          </div>

          {/* SYSTEM HEALTH (Right, Small) */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', color: '#0f172a', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              System Status
            </h3>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Core Banking API</span>
                <span style={{ color: '#10b981', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span> Online</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Transaction DB</span>
                <span style={{ color: '#10b981', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span> Connected</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Gateway Latency</span>
                <span style={{ color: '#64748b', fontWeight: '500', fontSize: '13px' }}>24ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Encryption</span>
                <span style={{ color: '#64748b', fontWeight: '500', fontSize: '13px' }}>TLS 1.3</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
              VajraBank Admin v2.5.0
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
