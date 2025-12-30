import React from 'react';

export default function CustomerFilters({ filters, setFilters }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="filters-bar" style={{
            display: 'flex',
            gap: '16px',
            padding: '16px',
            background: 'white',
            borderRadius: '8px',
            marginBottom: '20px',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <div style={{ flex: 1 }}>
                <input
                    type="text"
                    name="search"
                    placeholder="Search by Customer ID..."
                    value={filters.search}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px'
                    }}
                />
            </div>

            <div>
                <select
                    name="riskLevel"
                    value={filters.riskLevel}
                    onChange={handleChange}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                >
                    <option value="All">All Risks</option>
                    <option value="High">High Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="Low">Low Risk</option>
                </select>
            </div>

            <div>
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleChange}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
        </div>
    );
}
