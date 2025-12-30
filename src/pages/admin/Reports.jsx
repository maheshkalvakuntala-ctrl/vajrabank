import React from 'react';
import { useBankData } from '../../hooks/useBankData';
import { useAdminActions } from '../../hooks/useAdminActions';
import { FileEarmarkSpreadsheet } from 'react-bootstrap-icons';

export default function Reports() {
  const { data, loading } = useBankData();
  const { overrides } = useAdminActions();

  const handleExport = (type) => {
    let exportData = data;

    // Apply overrides logic for fresh data
    const merged = data.map(d => ({
      ...d,
      isFrozen: overrides[d.customerId]?.isFrozen ?? d.isFrozen,
      isHighRisk: overrides[d.customerId]?.flagged ? true : d.isHighRisk
    }));

    if (type === 'HIGH_RISK') {
      exportData = merged.filter(d => d.isHighRisk);
    } else if (type === 'FROZEN') {
      exportData = merged.filter(d => d.isFrozen);
    } else if (type === 'KYC_PENDING') {
      // Mock logic for kyc pending since overrides handle it
      const pendingIds = Object.keys(overrides).filter(id => overrides[id].kycStatus === 'Pending');
      exportData = merged.filter(d => pendingIds.includes(d.customerId));
    }

    const headers = ["Customer ID", "Name", "Email", "Balance", "Risk Level", "Status"];
    const rows = exportData.map(c => [
      c.customerId, c.fullName, c.email, c.balance, c.riskLevel, c.activeStatus
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${type.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '24px', color: 'black'}}>
      <h1>Analytics & Reports</h1>
      <p>Generate compliant reports for audit and risk analysis.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '32px' }}>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3>High Risk Customers</h3>
          <p style={{ color: '#666' }}>Export all customers flagged as high risk (Automated + Manual).</p>
          <button
            onClick={() => handleExport('HIGH_RISK')}
            style={{ marginTop: '16px', background: '#dc2626', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FileEarmarkSpreadsheet /> Download CSV
          </button>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3>Frozen Accounts</h3>
          <p style={{ color: '#666' }}>Details of all currently frozen or suspended accounts.</p>
          <button
            onClick={() => handleExport('FROZEN')}
            style={{ marginTop: '16px', background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FileEarmarkSpreadsheet /> Download CSV
          </button>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3>Full Database</h3>
          <p style={{ color: '#666' }}>Complete snapshot of all customer records.</p>
          <button
            onClick={() => handleExport('ALL')}
            style={{ marginTop: '16px', background: '#0f172a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FileEarmarkSpreadsheet /> Download CSV
          </button>
        </div>

      </div>
    </div>
  );
}
