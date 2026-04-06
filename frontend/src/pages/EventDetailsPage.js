import React from 'react';
import { useParams } from 'react-router-dom';

function EventDetailsPage() {
  const { id } = useParams();

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#050810', minHeight: '100vh', color: '#f0f4ff', padding: '100px 5%' }}>
      <a href="/" style={{ color: '#4f6ef7', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Home</a>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '2rem 0 1rem' }}>
        Event Details
      </h1>
      <p style={{ color: '#8892aa', fontSize: '1rem', marginBottom: '2rem' }}>Event ID: {id}</p>
      <div style={{
        background: '#161d30', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', padding: '2rem', maxWidth: '600px'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Tech Summit 2025</h2>
        <p style={{ color: '#8892aa', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          Join thousands of tech professionals for the biggest summit of the year. 
          AI, Web3, and the future of software.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(79,110,247,0.12)', color: '#818cf8', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>📅 Dec 15, 2025</span>
          <span style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>📍 Singapore</span>
          <span style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>🎟️ $49</span>
        </div>
        <button style={{
          marginTop: '1.5rem', background: '#4f6ef7', color: '#fff',
          border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px',
          fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem'
        }}>
          Register Now →
        </button>
      </div>
    </div>
  );
}

export default EventDetailsPage;
