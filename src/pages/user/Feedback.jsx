import React from 'react';

export default function Feedback() {
  return (
    <div style={{ padding: '24px', color: 'black', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '16px' }}>Help & Support</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Have a question or feedback? We're here to help.</p>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px' }}>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Subject</label>
          <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <option>General Inquiry</option>
            <option>Transaction Issue</option>
            <option>Technical Support</option>
            <option>Feedback</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Message</label>
          <textarea rows="5" placeholder="Describe your issue or feedback..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}></textarea>
        </div>

        <button style={{ width: '100%', background: '#0f172a', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
          Submit Request
        </button>

      </div>

      <div style={{ marginTop: '32px', textAlign: 'center', color: '#64748b' }}>
        <p>Or call us directly at <strong>1-800-VAJRA-HELP</strong></p>
      </div>
    </div>
  );
}
