import React from 'react';

export default function AuditLogPanel({ logs }) {
    return (
        <div className="audit-panel" style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            height: '100%'
        }}>
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                🛡️ Admin Audit Log
            </h3>

            <div className="audit-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {logs.length === 0 ? (
                    <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No actions recorded yet.</p>
                ) : (
                    logs.map(log => (
                        <div key={log.id} style={{
                            borderBottom: '1px solid #f3f4f6',
                            padding: '12px 0',
                            fontSize: '13px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <strong style={{ color: '#374151' }}>{log.action.replace('_', ' ')}</strong>
                                <span style={{ color: '#9ca3af', fontSize: '11px' }}>
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <div style={{ marginBottom: '4px' }}>
                                Customer: <span style={{ fontFamily: 'monospace' }}>{log.customerId}</span>
                            </div>
                            <div style={{ color: '#6b7280' }}>
                                {log.details}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
