import React from 'react';

function UserProfilePage() {
  return (
    <div style={{ fontFamily: 'sans-serif', background: '#050810', minHeight: '100vh', color: '#f0f4ff', padding: '100px 5%' }}>
      <a href="/" style={{ color: '#4f6ef7', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Home</a>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '2rem 0 2rem' }}>My Profile</h1>
      <div style={{
        background: '#161d30', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', padding: '2rem', maxWidth: '500px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'rgba(79,110,247,0.2)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: '700', color: '#818cf8'
          }}>D</div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>David Srinivasan</div>
            <div style={{ color: '#8892aa', fontSize: '0.85rem' }}>david@example.com</div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
            <span style={{ color: '#8892aa' }}>Events Created</span>
            <span style={{ color: '#4f6ef7', fontWeight: '600' }}>12</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
            <span style={{ color: '#8892aa' }}>Total Attendees</span>
            <span style={{ color: '#10b981', fontWeight: '600' }}>3,241</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', fontSize: '0.9rem' }}>
            <span style={{ color: '#8892aa' }}>Plan</span>
            <span style={{ background: 'rgba(79,110,247,0.15)', color: '#818cf8', padding: '2px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>Pro</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
