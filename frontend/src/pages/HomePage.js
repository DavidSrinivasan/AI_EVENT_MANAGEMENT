import React, { useState, useEffect, useRef } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://eventiq-backend.onrender.com';

// ─── Chatbot Component ────────────────────────────────────────
function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "👋 Hi! I'm EventIQ's AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chatbot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, messages })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, connection issue. Try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {open && (
        <div style={{
          width: '340px', background: '#0c1020', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px', overflow: 'hidden', marginBottom: '12px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)'
        }}>
          {/* Header */}
          <div style={{ background: '#111827', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#4f6ef7,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#f0f4ff' }}>EventIQ Assistant</div>
              <div style={{ fontSize: '11px', color: '#10b981' }}>● Online · AI Powered</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#8892aa', cursor: 'pointer', fontSize: '18px' }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ height: '280px', overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                maxWidth: '85%', padding: '8px 12px', borderRadius: m.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                background: m.role === 'user' ? '#4f6ef7' : '#161d30',
                color: m.role === 'user' ? '#fff' : '#8892aa',
                fontSize: '13px', lineHeight: '1.5',
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.07)'
              }}>{m.content}</div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: '#161d30', border: '1px solid rgba(255,255,255,0.07)', padding: '8px 12px', borderRadius: '4px 12px 12px 12px', fontSize: '13px', color: '#8892aa' }}>Typing...</div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything..."
              style={{ flex: 1, background: '#161d30', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#f0f4ff', fontSize: '13px', outline: 'none' }}
            />
            <button onClick={sendMessage} style={{ background: '#4f6ef7', border: 'none', borderRadius: '8px', width: '36px', height: '36px', color: '#fff', cursor: 'pointer', fontSize: '16px' }}>→</button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button onClick={() => setOpen(!open)} style={{
        width: '56px', height: '56px', borderRadius: '50%',
        background: 'linear-gradient(135deg,#4f6ef7,#7c3aed)',
        border: 'none', cursor: 'pointer', fontSize: '1.4rem',
        boxShadow: '0 8px 32px rgba(79,110,247,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginLeft: 'auto'
      }}>💬</button>
    </div>
  );
}

// ─── Map Component (Leaflet - FREE, no API key) ───────────────
function EventMap({ lat = 1.3521, lng = 103.8198, venueName = "Singapore Expo" }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (mapInstanceRef.current || !mapRef.current) return;
      const map = window.L.map(mapRef.current).setView([lat, lng], 14);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      window.L.marker([lat, lng]).addTo(map).bindPopup(`<b>${venueName}</b>`).openPopup();
      mapInstanceRef.current = map;
    };

    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, venueName]);

  return (
    <div ref={mapRef} style={{ height: '400px', width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
  );
}

// ─── Main HomePage ────────────────────────────────────────────
function HomePage() {
  return (
    <div style={{ fontFamily: 'sans-serif', background: '#050810', minHeight: '100vh', color: '#f0f4ff' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px', background: 'rgba(5,8,16,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f0f4ff' }}>Event<span style={{ color: '#4f6ef7' }}>IQ</span></span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Features', 'Events', 'Pricing', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: '#8892aa', textDecoration: 'none', fontSize: '0.9rem' }}>{item}</a>
          ))}
        </div>
        <a href="/profile" style={{ background: '#4f6ef7', color: '#fff', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600' }}>Get Started →</a>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 5% 60px' }}>
        <div style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', border: '1px solid rgba(79,110,247,0.3)', background: 'rgba(79,110,247,0.08)', borderRadius: '100px', fontSize: '0.8rem', color: '#a5b4fc', marginBottom: '2rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06b6d4', display: 'inline-block' }}></span>
            Powered by AI · Trusted by 12,000+ Event Professionals
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: '800', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            The Smartest Way to<br />
            <span style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Manage Any Event</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#8892aa', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
            AI-powered event platform with smart ticketing, real-time analytics, venue maps, and automated guest management.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/event/1" style={{ background: '#4f6ef7', color: '#fff', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '1rem' }}>Browse Events →</a>
            <a href="#features" style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#8892aa', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '1rem' }}>Learn More</a>
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '4rem', flexWrap: 'wrap' }}>
            {[['50K+', 'Events Hosted'], ['98%', 'Satisfaction'], ['140+', 'Countries'], ['4.9★', 'Rating']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>{num}</div>
                <div style={{ fontSize: '0.8rem', color: '#8892aa' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '80px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '700', marginBottom: '3rem' }}>Everything Powered by AI</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
          {[
            ['🤖', 'AI Chatbot', 'GPT-powered assistant answers attendee questions 24/7 in 40+ languages.'],
            ['🗺️', 'Venue Maps', 'Free interactive maps powered by OpenStreetMap — no API key needed.'],
            ['📊', 'Analytics', 'Real-time dashboards showing ticket sales, attendance and revenue.'],
            ['🎟️', 'Smart Ticketing', 'QR code check-in, waitlist management, and dynamic pricing.'],
            ['📱', 'Mobile Ready', 'Fully responsive — works perfectly on phones and tablets.'],
            ['🔒', 'Secure', 'GDPR compliant with role-based access and encrypted data.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: '#050810', padding: '2rem', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#0c1020'}
              onMouseLeave={e => e.currentTarget.style.background = '#050810'}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#8892aa', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MAP SECTION */}
      <section id="venue-map" style={{ padding: '80px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.75rem' }}>Find Event Venues</h2>
        <p style={{ color: '#8892aa', marginBottom: '2rem' }}>Interactive map powered by OpenStreetMap — completely free, no API key needed.</p>
        <EventMap lat={1.3521} lng={103.8198} venueName="Singapore Expo — Main Venue" />
      </section>

      {/* EVENTS */}
      <section id="events" style={{ padding: '80px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Upcoming Events</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.5rem' }}>
          {[
            { id: 1, title: 'Tech Summit 2025', date: 'Dec 15, 2025', location: 'Singapore', price: '$49', tag: ' Selling Fast' },
            { id: 2, title: 'Design Week', date: 'Jan 10, 2026', location: 'Mumbai', price: '$29', tag: ' New' },
            { id: 3, title: 'AI Conference', date: 'Feb 5, 2026', location: 'Chennai', price: '$79', tag: ' Featured' },
          ].map(event => (
            <div key={event.id} style={{ background: '#161d30', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.5rem', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(79,110,247,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
              <span style={{ background: 'rgba(79,110,247,0.12)', color: '#818cf8', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem' }}>{event.tag}</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '1rem 0 0.5rem' }}>{event.title}</h3>
              <p style={{ color: '#8892aa', fontSize: '0.875rem', marginBottom: '0.25rem' }}> {event.date}</p>
              <p style={{ color: '#8892aa', fontSize: '0.875rem', marginBottom: '1.5rem' }}> {event.location}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4f6ef7' }}>{event.price}</span>
                <a href={`/event/${event.id}`} style={{ background: '#4f6ef7', color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600' }}>View Details →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '3rem 5%', borderTop: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Event<span style={{ color: '#4f6ef7' }}>IQ</span></div>
        <p style={{ color: '#8892aa', fontSize: '0.875rem' }}>© 2025 EventIQ. AI-Powered Event Management Platform.</p>
      </footer>

      {/* CHATBOT */}
      <Chatbot />
    </div>
  );
}

export default HomePage;
