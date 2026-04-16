import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { C, API } from '../utils';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Find Venues', path: '/venues' },
  { label: 'Create Event', path: '/create-event' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Vendors', path: '/vendors' },
];

const gs = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', sans-serif; background: #05060f; color: #f0f4ff; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #05060f; }
  ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 2px; }
  .btn-primary { background: linear-gradient(135deg,#6366f1,#8b5cf6); color: #fff; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .2s; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,.45); }
  .btn-secondary { background: rgba(255,255,255,.05); color: #94a3b8; border: 1px solid rgba(255,255,255,.08); border-radius: 10px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all .2s; }
  .btn-secondary:hover { border-color: rgba(99,102,241,.5); color: #c7d2fe; background: rgba(99,102,241,.06); }
  .card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06); border-radius: 18px; transition: all .3s; }
  .card:hover { background: rgba(99,102,241,.05); border-color: rgba(99,102,241,.3); transform: translateY(-3px); }
  .inp { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); border-radius: 10px; padding: 10px 14px; color: #f0f4ff; font-size: 14px; font-family: inherit; outline: none; transition: border-color .2s; width: 100%; }
  .inp:focus { border-color: rgba(99,102,241,.6); }
  .tag { background: rgba(99,102,241,.1); color: #a5b4fc; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; display: inline-block; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes gradShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
    .nav-links { display: none !important; }
  }
`;

/* ── Global Styles injector ── */
export function GlobalStyles() {
  useEffect(() => {
    if (!document.getElementById('eq-global')) {
      const s = document.createElement('style');
      s.id = 'eq-global'; s.textContent = gs;
      document.head.appendChild(s);
    }
  }, []);
  return null;
}

/* ── Navbar with IQ chatbot button ── */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <GlobalStyles />
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4%', background: scrolled ? 'rgba(5,6,15,.98)' : 'rgba(5,6,15,.75)', backdropFilter: 'blur(24px)', borderBottom: `1px solid ${scrolled ? 'rgba(99,102,241,.2)' : 'transparent'}`, transition: 'all .3s' }}>
        {/* Logo */}
        <div style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.03em', cursor: 'pointer', flexShrink: 0 }} onClick={() => nav('/')}>
          Event<span style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IQ</span>
        </div>

        {/* Links */}
        <div className="nav-links" style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
          {NAV_LINKS.map(l => (
            <button key={l.path} onClick={() => nav(l.path)} style={{ color: loc.pathname === l.path ? '#a5b4fc' : '#64748b', background: 'none', border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'color .2s', borderBottom: loc.pathname === l.path ? '2px solid #6366f1' : '2px solid transparent', paddingBottom: 2 }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
          {/* IQ Chatbot button */}
          <button onClick={() => setChatOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', background: chatOpen ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.35)', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: chatOpen ? 'rgba(255,255,255,.25)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', flexShrink: 0 }}>IQ</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: chatOpen ? '#fff' : '#a5b4fc' }}>AI Assistant</span>
          </button>
          <button className="btn-secondary" style={{ padding: '7px 14px', fontSize: 13 }} onClick={() => nav('/profile')}>Profile</button>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => nav('/create-event')}>+ Create Event</button>
        </div>
      </nav>

      {/* IQ Chatbot Panel */}
      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
    </>
  );
}

/* ── IQ Chat Panel (slides down from navbar) ── */
function ChatPanel({ onClose }) {
  const [msgs, setMsgs] = useState([
    { r: 'bot', t: "Hello! I'm EventIQ's AI assistant. I can help you find venues worldwide, plan events, estimate budgets, and analyze ROI. What are you working on?" }
  ]);
  const [inp, setInp] = useState('');
  const [busy, setBusy] = useState(false);
  const [waking, setWaking] = useState(true);
  const end = useRef(null);

  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);
  useEffect(() => {
    // Wake up Render server - free tier sleeps after 15 mins inactivity
    const wakeController = new AbortController();
    const wakeTimer = setTimeout(() => wakeController.abort(), 15000);
    fetch(`${API}/`, { signal: wakeController.signal })
      .then(() => { clearTimeout(wakeTimer); setWaking(false); })
      .catch(() => { clearTimeout(wakeTimer); setWaking(false); });
    // Also stop showing "connecting" after 8s regardless
    const fallback = setTimeout(() => setWaking(false), 8000);
    return () => { clearTimeout(fallback); wakeController.abort(); };
  }, []);

  const send = async (text) => {
    const msg = text || inp.trim();
    if (!msg || busy) return;
    const history = msgs.map(m => ({ role: m.r === 'user' ? 'user' : 'assistant', content: m.t }));
    setMsgs(p => [...p, { r: 'user', t: msg }]);
    setInp(''); setBusy(true);

    // Compatible timeout using AbortController (works in all browsers)
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);

    try {
      const res = await fetch(`${API}/api/chatbot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, messages: history }),
        signal: controller.signal
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const d = await res.json();
      if (d.reply) {
        setMsgs(p => [...p, { r: 'bot', t: d.reply }]);
      } else {
        throw new Error('Empty response');
      }
    } catch (e) {
      clearTimeout(timer);
      if (e.name === 'AbortError') {
        setMsgs(p => [...p, { r: 'bot', t: 'The server is still warming up (Render free tier). Please wait 30 seconds and try again — it will work!' }]);
      } else if (e.message && e.message.includes('HTTP')) {
        setMsgs(p => [...p, { r: 'bot', t: 'Server returned an error. Please check that OPENAI_API_KEY is set correctly in your Render environment variables.' }]);
      } else {
        setMsgs(p => [...p, { r: 'bot', t: 'Could not reach the server. Make sure your Render backend is running at: ' + API }]);
      }
    }
    setBusy(false);
  };

  const suggestions = ['Best conference venues in Singapore', 'Plan a 300-person corporate event', 'Budget breakdown for a wedding', 'Top venues in Dubai under $15k'];

  return (
    <div style={{ position: 'fixed', top: 64, right: 20, width: 420, zIndex: 999, animation: 'slideIn .25s ease' }}>
      <div style={{ background: 'rgba(10,12,28,.98)', border: '1px solid rgba(99,102,241,.3)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,.7)' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#2d1f6b)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', flexShrink: 0, boxShadow: '0 4px 12px rgba(99,102,241,.5)' }}>IQ</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff' }}>EventIQ AI Assistant</div>
            <div style={{ fontSize: 11, color: waking ? '#fbbf24' : '#34d399', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: waking ? '#fbbf24' : '#34d399', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
              {waking ? 'Connecting to server...' : 'Online · GPT-4o-mini'}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,.1)', border: 'none', color: '#a5b4fc', cursor: 'pointer', width: 30, height: 30, borderRadius: '50%', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>x</button>
        </div>

        {/* Messages */}
        <div style={{ height: 340, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10, scrollbarWidth: 'thin', scrollbarColor: '#6366f1 transparent' }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ maxWidth: '88%', padding: '10px 14px', borderRadius: m.r === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px', background: m.r === 'user' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,.05)', color: '#f0f4ff', fontSize: 13.5, lineHeight: 1.65, alignSelf: m.r === 'user' ? 'flex-end' : 'flex-start', border: m.r === 'bot' ? '1px solid rgba(255,255,255,.07)' : 'none', whiteSpace: 'pre-wrap', animation: 'slideIn .3s ease' }}>{m.t}</div>
          ))}
          {busy && (
            <div style={{ alignSelf: 'flex-start', padding: '12px 16px', borderRadius: '4px 18px 18px 18px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', display: 'flex', gap: 5 }}>
              {[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: `pulse 1s ${i * .2}s infinite` }}></span>)}
            </div>
          )}
          <div ref={end} />
        </div>

        {/* Quick suggestions */}
        {msgs.length <= 1 && (
          <div style={{ padding: '0 14px 10px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)} style={{ background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.25)', borderRadius: 20, padding: '5px 12px', fontSize: 12, color: '#a5b4fc', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }} onMouseEnter={e => e.target.style.background = 'rgba(99,102,241,.22)'} onMouseLeave={e => e.target.style.background = 'rgba(99,102,241,.1)'}>{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '10px 14px 14px', borderTop: '1px solid rgba(255,255,255,.05)', display: 'flex', gap: 8 }}>
          <input className="inp" value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about venues, budgets, event planning..." style={{ fontSize: 13 }} />
          <button onClick={() => send()} disabled={busy || !inp.trim()} className="btn-primary" style={{ width: 44, height: 44, fontSize: 18, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: inp.trim() ? 1 : 0.5 }}>
            <span style={{ fontSize: 16 }}>&#8594;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Venue Map (Leaflet + OpenStreetMap) ── */
export function VenueMap({ venues = [], center = [20, 0], zoom = 2, height = 420, onVenueClick }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const markersRef = useRef([]);

  const buildMarkers = (map, venueList) => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    venueList.forEach(v => {
      const icon = window.L.divIcon({
        html: `<div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 4px 12px rgba(99,102,241,.5);cursor:pointer;border:1px solid rgba(255,255,255,.2)">${v.name.split(' ').slice(0, 2).join(' ')}</div>`,
        className: '',
        iconAnchor: [0, 0]
      });
      const marker = window.L.marker([v.lat, v.lng], { icon })
        .addTo(map)
        .bindPopup(`<div style="font-family:Inter,sans-serif;min-width:180px"><img src="${v.image}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin-bottom:8px" onerror="this.style.display='none'"/><b style="font-size:13px;display:block;margin-bottom:2px">${v.name}</b><span style="color:#666;font-size:12px">${v.city}, ${v.country}</span><br><span style="color:#6366f1;font-size:12px;font-weight:600">★${v.rating} &nbsp;|&nbsp; Cap. ${v.capacity.toLocaleString()}</span></div>`);
      if (onVenueClick) marker.on('click', () => onVenueClick(v));
      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const l = document.createElement('link');
      l.id = 'leaflet-css'; l.rel = 'stylesheet';
      l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(l);
    }
    const init = () => {
      if (instanceRef.current || !mapRef.current) return;
      const map = window.L.map(mapRef.current, { zoomControl: true }).setView(center, zoom);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(map);
      instanceRef.current = map;
      buildMarkers(map, venues);
    };
    if (!window.L) {
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload = init; document.head.appendChild(s);
    } else { setTimeout(init, 100); }
    return () => {
      if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }
    };
  }, []);

  useEffect(() => {
    if (instanceRef.current && window.L) buildMarkers(instanceRef.current, venues);
  }, [venues]);

  return (
    <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(99,102,241,.2)' }}>
      <div ref={mapRef} style={{ height, width: '100%' }} />
    </div>
  );
}
