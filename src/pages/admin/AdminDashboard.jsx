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
import "./AdminDashboard.css";

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
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
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
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      console.log(`User ${userId} rejected`);
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user. Please try again.');
    }
  };

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

  if (loading) return <div className="p-10 text-center">Loading Admin Surveillance...</div>;
  if (error) return <div className="p-10 text-red-500">System Error: {error}</div>;

  return (
    <main className="admin-dashboard-main">

      {/* HEADER */}
      <div className="admin-glass-header">
        <h1 className="admin-glass-title">Command Center</h1>
        <p className="admin-glass-subtitle">Live Operations & Security Overview</p>
      </div>

      {/* ROW 1: OVERVIEW METRICS */}
      <section className="dashboard-section">
        <DashboardStats data={processedData} />
      </section>

      {/* ANALYTICS SECTION */}
      <section className="dashboard-section">
        <AdminAnalytics data={processedData} />
      </section>

      {/* ROW 2: RISK & ALERTS */}
      <section className="dashboard-section">
        <h3 className="admin-section-title">Risk & Alerts</h3>
        <div className="risk-alerts-grid">

          {/* CARD 1: HIGH RISK */}
          <div className="admin-alert-card">
            <div className="alert-card-header">
              <div className="alert-icon-box danger">
                <ExclamationTriangle size={20} />
              </div>
              <NavLink to="/admin/customers" className="alert-link">
                View All <ArrowRight size={12} />
              </NavLink>
            </div>
            <div>
              <span className="alert-card-label">High Risk Accounts</span>
              <div className="alert-card-value">
                {processedData.filter(d => d.isHighRisk).length}
              </div>
              <p className="alert-card-hint danger">Immediate Attention Required</p>
            </div>
          </div>

          {/* CARD 2: KYC PENDING */}
          <div className="admin-alert-card">
            <div className="alert-card-header">
              <div className="alert-icon-box warning">
                <FileText size={20} />
              </div>
              <NavLink to="/admin/kyc" className="alert-link">
                Review Queue <ArrowRight size={12} />
              </NavLink>
            </div>
            <div>
              <span className="alert-card-label">Pending KYC</span>
              <div className="alert-card-value">
                {processedData.length}
              </div>
              <p className="alert-card-hint warning">Identity Verifications</p>
            </div>
          </div>

          {/* CARD 3: CARD REQUESTS */}
          <div className="admin-alert-card">
            <div className="alert-card-header">
              <div className="alert-icon-box info">
                <CreditCard size={20} />
              </div>
              <NavLink to="/admin/cards" className="alert-link">
                Manage <ArrowRight size={12} />
              </NavLink>
            </div>
            <div>
              <span className="alert-card-label">New Card Requests</span>
              <div className="alert-card-value">12</div>
              <p className="alert-card-hint success">+4 Recent Requests</p>
            </div>
          </div>

        </div>
      </section>

      {/* USER APPROVAL SECTION */}
      <section className="dashboard-section">
        <h3 className="admin-section-title">Pending Approvals</h3>

        {loadingUsers ? (
          <div className="admin-alert-card text-center">Loading queue...</div>
        ) : pendingUsers.length === 0 ? (
          <div className="admin-alert-card text-center">
            <CheckCircle size={32} color="#10b981" />
            <p className="mt-2 font-bold color-secondary">Approval queue clear</p>
          </div>
        ) : (
          <div className="admin-list-container">
            {pendingUsers.map((user) => (
              <div key={user.id} className="approval-card">
                <div className="approval-info">
                  <h4 className="approval-name">{user.firstName} {user.lastName}</h4>
                  <p className="approval-details">{user.email} • {user.accountType}</p>
                  <p className="approval-meta">
                    Requested on: {user.createdAt?.toDate().toLocaleDateString()}
                  </p>
                </div>
                <div className="approval-actions">
                  <button onClick={() => approveUser(user.id)} className="approve-btn">
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button onClick={() => rejectUser(user.id)} className="reject-btn">
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* AUDIT LOG & SYSTEM STATUS */}
      <section className="dashboard-section">
        <div className="system-health-grid">
          <div className="audit-log-wrapper">
            <AuditLogPanel logs={auditLogs} />
          </div>

          <div className="health-card">
            <h3 className="section-title-small">System Health</h3>
            <div className="health-list">
              <div className="health-item">
                <span className="health-label">Core Banking Engine</span>
                <span className="health-status"><span className="status-dot online"></span> Online</span>
              </div>
              <div className="health-item">
                <span className="health-label">Firestore Real-time</span>
                <span className="health-status"><span className="status-dot online"></span> Connected</span>
              </div>
              <div className="health-item">
                <span className="health-label">API Latency</span>
                <span className="health-status">18ms</span>
              </div>
              <div className="health-item">
                <span className="health-label">Last Backup</span>
                <span className="health-status">6 mins ago</span>
              </div>
            </div>
            <div className="text-center mt-auto color-muted" style={{ fontSize: '11px', fontWeight: 600 }}>
              VajraOS v2.9.5-PRO
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
