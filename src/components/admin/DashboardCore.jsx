import React from 'react';
import DashboardStats from './DashboardStats';
import AdminAnalytics from './AdminAnalytics';
import AuditLogPanel from './AuditLogPanel';
import AdModerationWidget from './AdModerationWidget';
import { NavLink } from 'react-router-dom';
import { ArrowRight, ExclamationTriangle, FileText, CreditCard, CheckCircle, XCircle } from 'react-bootstrap-icons';
import "../../pages/admin/AdminDashboard.css";

export default function DashboardCore({
    role = 'ADMIN', // 'ADMIN' | 'PARTNER'
    data,
    // Admin-specific props (optional for Partner)
    pendingUsers = [],
    loadingUsers = false,
    approveUser,
    rejectUser,
    auditLogs = []
}) {
    const isAdmin = role === 'ADMIN';

    return (
        <div className="dashboard-core">
            {/* HEADER */}
            <div className="admin-glass-header">
                <h1 className="admin-glass-title">Command Center</h1>
                <p className="admin-glass-subtitle">Live Operations & Security Overview</p>
            </div>

            {/* ROW 1: OVERVIEW METRICS */}
            <section className="dashboard-section">
                <DashboardStats data={data} />
            </section>

            {/* ANALYTICS SECTION */}
            <section className="dashboard-section">
                <AdminAnalytics data={data} />
            </section>

            {/* ADMIN ONLY SECTIONS */}
            {isAdmin && (
                <>
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
                                        {data.filter(d => d.isHighRisk).length}
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
                                        {data.length}
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
                </>
            )}
        </div>
    );
}
