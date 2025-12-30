import React, { useState } from 'react';

export default function CustomerTable({ data, onView }) {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 100;

    // PAGINATION LOGIC
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (data.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No matching records found.</div>;
    }

    return (
        <div className="table-container" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ overflowX: 'auto' }}>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                            <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>ID</th>
                            <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Customer</th>
                            <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Type</th>
                            <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Balance</th>
                            <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Risk</th>
                            <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                            <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((customer) => (
                            <tr
                                key={customer.customerId}
                                style={{
                                    borderBottom: '1px solid #f3f4f6',
                                    background: customer.isHighRisk ? '#fef2f2' : 'white' // Red bg for high risk
                                }}
                            >
                                <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{customer.customerId}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ fontWeight: '500' }}>{customer.fullName}</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{customer.email}</div>
                                </td>
                                <td style={{ padding: '12px 16px' }}>{customer.accountType}</td>
                                <td style={{ padding: '12px 16px', fontWeight: '500' }}>₹{customer.balance.toLocaleString()}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <span
                                        className={`risk-badge risk-${customer.riskLevel.toLowerCase()}`}
                                        style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: customer.riskLevel === 'High' ? '#fee2e2' : customer.riskLevel === 'Medium' ? '#fef3c7' : '#dcfce7',
                                            color: customer.riskLevel === 'High' ? '#991b1b' : customer.riskLevel === 'Medium' ? '#92400e' : '#166534'
                                        }}
                                    >
                                        {customer.riskLevel}
                                    </span>
                                    {customer.isFrozen && <span style={{ marginLeft: '6px' }}>❄️</span>}
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <span className={customer.activeStatus === 'Active' ? 'text-success' : 'text-muted'}>
                                        {customer.activeStatus}
                                    </span>
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <button
                                        onClick={() => onView(customer)}
                                        style={{
                                            padding: '6px 12px',
                                            border: '1px solid #e5e7eb',
                                            color: 'black',
                                            background: 'white',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION CONTROLS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, data.length)} of {data.length} entries
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{ padding: '6px 12px', cursor: 'pointer', disabled: currentPage === 1 }}
                    >
                        Previous
                    </button>
                    <span style={{ padding: '6px 12px', background: '#f3f4f6', borderRadius: '4px' }}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{ padding: '6px 12px', cursor: 'pointer' }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
