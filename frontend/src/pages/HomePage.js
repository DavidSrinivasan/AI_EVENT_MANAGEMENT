import React from 'react';

function HomePage() {
  return (
    <div style={{ fontFamily: 'sans-serif', background: '#050810', minHeight: '100vh', color: '#f0f4ff' }}>
      <div style={{ textAlign: 'center', paddingTop: '120px', paddingBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
          Welcome to <span style={{ color: '#4f6ef7' }}>EventIQ</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#8892aa', maxWidth: '500px', margin: '0 auto 2rem' }}>
          The AI-powered event management platform. Plan smarter, execute flawlessly.
        </p>
        <a href="/event/1" style={{
          background: '#4f6ef7', color: '#fff', padding: '0.875rem 2rem',
          borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '1rem'
        }}>
          Browse Events →
        </a>
      </div>
    </div>
  );
}

export default HomePage;
