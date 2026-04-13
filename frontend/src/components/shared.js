import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { C, API, wakeBackend } from '../utils';

/* ── Navbar ─────────────────────────────────────────────── */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Find Venues', path: '/venues' },
    { label: 'Create Event', path: '/create-event' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <>
      <style>{`
        .nav-a{color:#94a3b8;text-decoration:none;font-size:14px;font-weight:500;transition:color .2s;cursor:pointer;background:none;border:none;font-family:inherit;padding:0}
        .nav-a:hover,.nav-a.active{color:#f0f4ff}
        .nav-a.active{color:#a5b4fc}
      `}</style>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%', background: scrolled ? 'rgba(5,6,15,.97)' : 'rgba(5,6,15,.7)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${scrolled ? C.border : 'transparent'}`, transition: 'all .3s' }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.03em', cursor: 'pointer' }} onClick={() => nav('/')}>
          Event<span style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IQ</span>
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {links.map(l => (
            <button key={l.path} className={`nav-a${loc.pathname === l.path ? ' active' : ''}`} onClick={() => nav(l.path)}>{l.label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={() => nav('/profile')} style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${C.border2}`, borderRadius: 10, padding: '8px 16px', color: C.muted2, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Profile</button>
          <button onClick={() => nav('/create-event')} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 10, padding: '9px 18px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(99,102,241,.35)' }}>+ Create Event</button>
        </div>
      </nav>
    </>
  );
}

/* ── Chatbot ─────────────────────────────────────────────── */
export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ r: 'bot', t: "👋 Hi! I'm EventIQ's AI assistant. I can help you find venues, plan events, estimate budgets, and more. What are you planning?" }]);
  const [inp, setInp] = useState('');
  const [busy, setBusy] = useState(false);
  const [waking, setWaking] = useState(false);
  const end = useRef(null);

  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  useEffect(() => {
    if (open) { setWaking(true); fetch(`${API}/`).finally(() => setWaking(false)); }
  }, [open]);

  const send = async (text) => {
    const msg = text || inp.trim();
    if (!msg || busy) return;
    const history = msgs.map(m => ({ role: m.r === 'user' ? 'user' : 'assistant', content: m.t }));
    setMsgs(p => [...p, { r: 'user', t: msg }]);
    setInp(''); setBusy(true);
    try {
      const res = await fetch(`${API}/api/chatbot/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, messages: history }),
        signal: AbortSignal.timeout(25000)
      });
      if (!res.ok) throw new Error('bad response');
      const d = await res.json();
      setMsgs(p => [...p, { r: 'bot', t: d.reply }]);
    } catch {
      setMsgs(p => [...p, { r: 'bot', t: waking ? "Server is warming up (free tier). Wait 30s and try again!" : "Connection issue — try again!" }]);
    }
    setBusy(false);
  };

  const suggestions = ['Best venues in Singapore', 'Plan a 500-person conference', 'Budget for a wedding?', 'Venues in London under $10k'];

  return (
    <>
      <style>{`
        @keyframes dotBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes statusPulse{0%,100%{opacity:1}50%{opacity:.4}}
        .chat-inp:focus{border-color:rgba(99,102,241,.7)!important;outline:none}
        .msg-bubble{transition:transform .15s}
        .msg-bubble:hover{transform:scale(1.01)}
      `}</style>
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, fontFamily: 'Inter,sans-serif' }}>
        {open && (
          <div style={{ width: 370, marginBottom: 12, borderRadius: 22, overflow: 'hidden', background: 'linear-gradient(180deg,#0d0f23 0%,#080a18 100%)', border: '1px solid rgba(99,102,241,.35)', boxShadow: '0 40px 100px rgba(0,0,0,.8)', animation: 'slideUp .25s ease' }}>
            <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#2d1f6b)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 16px rgba(99,102,241,.5)', flexShrink: 0 }}>🤖</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff' }}>EventIQ AI Assistant</div>
                <div style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, color: waking ? '#fbbf24' : '#34d399' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: waking ? '#fbbf24' : '#34d399', display: 'inline-block', animation: 'statusPulse 1.5s infinite' }}></span>
                  {waking ? 'Connecting…' : 'Online · Groq Llama 3'}
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,.1)', border: 'none', color: '#a5b4fc', cursor: 'pointer', width: 28, height: 28, borderRadius: '50%', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            {/* Messages */}
            <div style={{ height: 310, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10, scrollbarWidth: 'thin', scrollbarColor: '#6366f1 transparent' }}>
              {msgs.map((m, i) => (
                <div key={i} className="msg-bubble" style={{ maxWidth: '88%', padding: '10px 14px', borderRadius: m.r === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px', background: m.r === 'user' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,.05)', color: '#f0f4ff', fontSize: 13, lineHeight: 1.65, alignSelf: m.r === 'user' ? 'flex-end' : 'flex-start', border: m.r === 'bot' ? '1px solid rgba(255,255,255,.07)' : 'none', whiteSpace: 'pre-wrap' }}>{m.t}</div>
              ))}
              {busy && (
                <div style={{ alignSelf: 'flex-start', padding: '12px 16px', borderRadius: '4px 18px 18px 18px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', display: 'flex', gap: 5 }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: `dotBounce 1s ${i*.2}s infinite` }}></span>)}
                </div>
              )}
              <div ref={end} />
            </div>

            {/* Suggestions */}
            {msgs.length <= 1 && (
              <div style={{ padding: '0 12px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {suggestions.map(s => (
                  <button key={s} onClick={() => send(s)} style={{ background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.25)', borderRadius: 20, padding: '4px 10px', fontSize: 11, color: '#a5b4fc', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }} onMouseEnter={e => e.target.style.background='rgba(99,102,241,.2)'} onMouseLeave={e => e.target.style.background='rgba(99,102,241,.1)'}>{s}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding: '10px 12px 14px', borderTop: '1px solid rgba(255,255,255,.05)', display: 'flex', gap: 8 }}>
              <input className="chat-inp" value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about venues, budgets, planning…" style={{ flex: 1, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(99,102,241,.3)', borderRadius: 14, padding: '10px 14px', color: '#f0f4ff', fontSize: 13, fontFamily: 'inherit', transition: 'border-color .2s' }} />
              <button onClick={() => send()} disabled={busy || !inp.trim()} style={{ width: 44, height: 44, borderRadius: 14, background: inp.trim() ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(99,102,241,.2)', border: 'none', color: '#fff', cursor: inp.trim() ? 'pointer' : 'not-allowed', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', flexShrink: 0 }}>→</button>
            </div>
          </div>
        )}

        <button onClick={() => setOpen(o => !o)} style={{ width: 60, height: 60, borderRadius: '50%', background: open ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', cursor: 'pointer', fontSize: 24, boxShadow: `0 8px 32px ${open ? 'rgba(239,68,68,.4)' : 'rgba(99,102,241,.5)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', transition: 'all .3s' }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
          {open ? '✕' : '🤖'}
        </button>
      </div>
    </>
  );
}

/* ── Leaflet Map ─────────────────────────────────────────── */
export function VenueMap({ venues = [], center = [20, 0], zoom = 2, height = 420, onVenueClick }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const l = document.createElement('link');
      l.id = 'leaflet-css'; l.rel = 'stylesheet';
      l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(l);
    }
    const init = () => {
      if (instanceRef.current || !mapRef.current) return;
      instanceRef.current = window.L.map(mapRef.current, { zoomControl: true }).setView(center, zoom);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(instanceRef.current);
      addMarkers();
    };
    const addMarkers = () => {
      if (!instanceRef.current) return;
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      venues.forEach(v => {
        const icon = window.L.divIcon({ html: `<div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:4px 8px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 4px 12px rgba(99,102,241,.5);cursor:pointer">${v.name.split(' ').slice(0,2).join(' ')}</div>`, className: '', iconAnchor: [0, 0] });
        const marker = window.L.marker([v.lat, v.lng], { icon })
          .addTo(instanceRef.current)
          .bindPopup(`<div style="font-family:Inter,sans-serif;padding:4px"><b style="font-size:13px">${v.name}</b><br><span style="color:#666;font-size:12px">${v.city}, ${v.country}</span><br><span style="color:#6366f1;font-size:12px;font-weight:600">★${v.rating} · Capacity ${v.capacity.toLocaleString()}</span></div>`);
        if (onVenueClick) marker.on('click', () => onVenueClick(v));
        markersRef.current.push(marker);
      });
    };
    if (!window.L) {
      const s = document.createElement('script'); s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload = init; document.head.appendChild(s);
    } else init();
    return () => { if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!instanceRef.current || !window.L) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    venues.forEach(v => {
      const icon = window.L.divIcon({ html: `<div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:4px 8px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 4px 12px rgba(99,102,241,.5);cursor:pointer">${v.name.split(' ').slice(0,2).join(' ')}</div>`, className: '', iconAnchor: [0, 0] });
      const marker = window.L.marker([v.lat, v.lng], { icon }).addTo(instanceRef.current)
        .bindPopup(`<div style="font-family:Inter,sans-serif;padding:4px"><b style="font-size:13px">${v.name}</b><br><span style="color:#666;font-size:12px">${v.city}, ${v.country}</span><br><span style="color:#6366f1;font-size:12px;font-weight:600">★${v.rating} · Capacity ${v.capacity.toLocaleString()}</span></div>`);
      if (onVenueClick) marker.on('click', () => onVenueClick(v));
      markersRef.current.push(marker);
    });
  }, [venues]);

  return <div ref={mapRef} style={{ height, width: '100%', borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }} />;
}
