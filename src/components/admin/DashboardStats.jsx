import React from 'react';
import '../../styles/GlassTheme.css';

export default function DashboardStats({ data }) {
    // CALCULATE STATS
    const totalCustomers = data.length;
    const frozenCount = data.filter(d => d.isFrozen).length;
    const activeCount = data.filter(d => d.activeStatus === 'Active').length;
    const inactiveCount = data.filter(d => d.activeStatus === 'Inactive').length;

    // FORMAT CURRENCY
    const totalBalance = data.reduce((acc, curr) => acc + curr.balance, 0);
    const formattedBalance = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(totalBalance);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>

            <div className="glass-card" style={{ padding: '24px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Total Customers</p>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '28px', color: '#0f172a' }}>{totalCustomers.toLocaleString()}</h2>
                <p style={{ margin: 0, fontSize: '13px', color: '#10b981' }}>+12% this month</p>
            </div>

            <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4))' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Total Liquidity</p>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '28px', color: '#1e40af' }}>{formattedBalance}</h2>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Across all accounts</p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Active Status</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <h2 style={{ margin: '0 0 4px 0', fontSize: '28px', color: '#0f172a' }}>{activeCount}</h2>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>/ {inactiveCount} Inactive</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#10b981' }}>Healthy Ratio</p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Frozen Accounts</p>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '28px', color: '#ef4444' }}>{frozenCount.toLocaleString()}</h2>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Requires Review</p>
            </div>

        </div>
    );
}
