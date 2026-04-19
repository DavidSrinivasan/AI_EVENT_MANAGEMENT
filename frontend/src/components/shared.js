import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { C, API } from '../utils';

/* ── Global CSS ── */
const GS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;background:#05060f;color:#f0f4ff;overflow-x:hidden}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:#05060f}
::-webkit-scrollbar-thumb{background:#6366f1;border-radius:2px}
.btn-primary{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s;display:inline-flex;align-items:center;justify-content:center}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(99,102,241,.45)}
.btn-primary:active{transform:translateY(0)}
.btn-secondary{background:rgba(255,255,255,.04);color:#94a3b8;border:1px solid rgba(255,255,255,.08);border-radius:10px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .2s;display:inline-flex;align-items:center;justify-content:center}
.btn-secondary:hover{border-color:rgba(99,102,241,.5);color:#c7d2fe;background:rgba(99,102,241,.06)}
.card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:18px;transition:all .3s}
.card:hover{background:rgba(99,102,241,.05);border-color:rgba(99,102,241,.25);transform:translateY(-3px)}
.inp{background:#0f1221;border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 14px;color:#f0f4ff;font-size:14px;font-family:inherit;outline:none;transition:all .2s;width:100%;appearance:none;-webkit-appearance:none}
.inp:focus{border-color:rgba(99,102,241,.6);background:#131629}
.inp option{background:#131629;color:#f0f4ff;padding:8px}
.tag{background:rgba(99,102,241,.1);color:#a5b4fc;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:500;display:inline-block}
label{font-size:13px;color:#64748b;display:block;margin-bottom:6px;font-weight:500}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideRight{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.fade{animation:fadeUp .4s ease}
@media(max-width:900px){.two-col{grid-template-columns:1fr!important}}
@media(max-width:768px){.three-col{grid-template-columns:1fr 1fr!important}.four-col{grid-template-columns:1fr 1fr!important}.nav-links{display:none!important}}
`;

export function GlobalStyles() {
  useEffect(() => {
    if (!document.getElementById('eq-gs')) {
      const s = document.createElement('style');
      s.id = 'eq-gs'; s.textContent = GS;
      document.head.appendChild(s);
    }
  }, []);
  return null;
}

/* ── Auth context helpers ── */
export function getUser() {
  try { return JSON.parse(localStorage.getItem('eq_user') || 'null'); } catch { return null; }
}
export function setUser(u) { localStorage.setItem('eq_user', JSON.stringify(u)); }
export function logout() { localStorage.removeItem('eq_user'); }

/* ── Navbar ── */
export function Navbar({ onOpenChat }) {
  const [scrolled, setScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const user = getUser();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleChat = () => {
    setChatOpen(o => !o);
    if (onOpenChat) onOpenChat();
  };

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Find Venues', path: '/venues' },
    { label: 'Create Event', path: '/create-event' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Vendors', path: '/vendors' },
  ];

  return (
    <>
      <GlobalStyles />
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4%', background: scrolled ? 'rgba(5,6,15,.98)' : 'rgba(5,6,15,.8)', backdropFilter: 'blur(24px)', borderBottom: `1px solid ${scrolled ? 'rgba(99,102,241,.2)' : 'transparent'}`, transition: 'all .3s' }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.03em', cursor: 'pointer', flexShrink: 0 }} onClick={() => nav('/')}>
          Event<span style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IQ</span>
        </div>

        <div className="nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {links.map(l => (
            <button key={l.path} onClick={() => nav(l.path)} style={{ color: loc.pathname === l.path ? '#a5b4fc' : '#64748b', background: 'none', border: 'none', fontSize: 14, fontWeight: loc.pathname === l.path ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'color .2s', borderBottom: loc.pathname === l.path ? '2px solid #6366f1' : '2px solid transparent', paddingBottom: 2 }}>
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={handleChat} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', background: chatOpen ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.3)', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: chatOpen ? 'rgba(255,255,255,.2)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em' }}>IQ</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: chatOpen ? '#fff' : '#a5b4fc' }}>AI Chat</span>
          </button>
          {user ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div onClick={() => nav('/profile')} style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff', cursor: 'pointer' }}>
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            </div>
          ) : (
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => nav('/auth')}>Sign In</button>
          )}
          <button className="btn-primary" style={{ padding: '8px 14px', fontSize: 13 }} onClick={() => nav('/create-event')}>+ Create Event</button>
        </div>
      </nav>

      {chatOpen && <ChatSidebar onClose={() => setChatOpen(false)} />}
    </>
  );
}

/* ── ChatGPT-style Chat Sidebar ── */
function ChatSidebar({ onClose }) {
  const [sessions, setSessions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eq_chat_sessions') || '[]'); } catch { return []; }
  });
  const [activeId, setActiveId] = useState(null);
  const [msgs, setMsgs] = useState([{ r: 'bot', t: "Hello! I'm EventIQ's AI assistant. I can help you find venues, plan events, estimate budgets, and analyze ROI. What are you working on?" }]);
  const [inp, setInp] = useState('');
  const [busy, setBusy] = useState(false);
  const [waking, setWaking] = useState(true);
  const end = useRef(null);

  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  useEffect(() => {
    const c = new AbortController();
    fetch(`${API}/`, { signal: c.signal }).finally(() => setWaking(false));
    const t = setTimeout(() => setWaking(false), 8000);
    return () => { c.abort(); clearTimeout(t); };
  }, []);

  const saveSessions = (s) => {
    setSessions(s);
    localStorage.setItem('eq_chat_sessions', JSON.stringify(s));
  };

  const newChat = () => {
    const id = Date.now().toString();
    const session = { id, title: 'New Chat', msgs: [], createdAt: new Date().toLocaleDateString() };
    const updated = [session, ...sessions];
    saveSessions(updated);
    setActiveId(id);
    setMsgs([{ r: 'bot', t: "Hello! Starting a new planning session. What event are you working on?" }]);
  };

  const loadSession = (s) => {
    setActiveId(s.id);
    setMsgs(s.msgs.length > 0 ? s.msgs : [{ r: 'bot', t: "Welcome back! How can I help with this event?" }]);
  };

  const deleteSession = (id, e) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    saveSessions(updated);
    if (activeId === id) { setActiveId(null); setMsgs([{ r: 'bot', t: "Hello! I'm EventIQ's AI assistant. What are you planning?" }]); }
  };

  const updateSessionMsgs = (id, newMsgs) => {
    if (!id) return;
    setSessions(prev => {
      const updated = prev.map(s => s.id === id ? {
        ...s,
        msgs: newMsgs,
        title: newMsgs.find(m => m.r === 'user')?.t?.slice(0, 30) || s.title
      } : s);
      localStorage.setItem('eq_chat_sessions', JSON.stringify(updated));
      return updated;
    });
  };

  const send = async (text) => {
    const msg = text || inp.trim();
    if (!msg || busy) return;
    const history = msgs.map(m => ({ role: m.r === 'user' ? 'user' : 'assistant', content: m.t }));
    const newMsgs = [...msgs, { r: 'user', t: msg }];
    setMsgs(newMsgs);
    setInp(''); setBusy(true);

    if (activeId) updateSessionMsgs(activeId, newMsgs);

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
      const d = await res.json();
      const botMsg = { r: 'bot', t: d.reply || "Sorry, I couldn't generate a response." };
      const finalMsgs = [...newMsgs, botMsg];
      setMsgs(finalMsgs);
      if (activeId) updateSessionMsgs(activeId, finalMsgs);
    } catch (e) {
      clearTimeout(timer);
      const errMsg = e.name === 'AbortError'
        ? 'Server is warming up. Please wait 30 seconds and try again.'
        : 'Connection error. Please check your internet and try again.';
      const finalMsgs = [...newMsgs, { r: 'bot', t: errMsg }];
      setMsgs(finalMsgs);
    }
    setBusy(false);
  };

  const suggestions = ['Best venues in Singapore for 500 people', 'Plan a corporate conference budget', 'Wedding venues in Dubai under $20k', 'ROI analysis for a tech summit'];

  return (
    <div style={{ position: 'fixed', top: 64, right: 0, bottom: 0, zIndex: 998, display: 'flex', animation: 'slideRight .25s ease' }}>
      {/* Sessions sidebar */}
      <div style={{ width: 220, background: '#0a0c1c', borderLeft: '1px solid rgba(255,255,255,.06)', borderRight: '1px solid rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 12px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <button onClick={newChat} style={{ width: '100%', padding: '9px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>+ New Chat</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#475569', fontSize: 12 }}>No chat history yet. Start a new chat!</div>
          ) : (
            sessions.map(s => (
              <div key={s.id} onClick={() => loadSession(s)} style={{ padding: '9px 10px', borderRadius: 8, marginBottom: 4, cursor: 'pointer', background: activeId === s.id ? 'rgba(99,102,241,.15)' : 'transparent', border: activeId === s.id ? '1px solid rgba(99,102,241,.3)' : '1px solid transparent', transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 12, fontWeight: activeId === s.id ? 600 : 400, color: activeId === s.id ? '#c7d2fe' : '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{s.createdAt}</div>
                </div>
                <button onClick={(e) => deleteSession(s.id, e)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 14, flexShrink: 0, padding: 2 }}>×</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ width: 380, background: 'rgba(10,12,28,.98)', borderLeft: '1px solid rgba(99,102,241,.15)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#2d1f6b)', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(99,102,241,.2)', flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', boxShadow: '0 4px 12px rgba(99,102,241,.5)' }}>IQ</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff' }}>EventIQ AI Assistant</div>
            <div style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, color: waking ? '#fbbf24' : '#34d399' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: waking ? '#fbbf24' : '#34d399', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
              {waking ? 'Connecting...' : 'Online · Groq Llama 3'}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,.1)', border: 'none', color: '#a5b4fc', cursor: 'pointer', width: 28, height: 28, borderRadius: '50%', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10, scrollbarWidth: 'thin', scrollbarColor: '#6366f1 transparent' }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ maxWidth: '88%', padding: '10px 14px', borderRadius: m.r === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: m.r === 'user' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,.05)', color: '#f0f4ff', fontSize: 13, lineHeight: 1.65, alignSelf: m.r === 'user' ? 'flex-end' : 'flex-start', border: m.r === 'bot' ? '1px solid rgba(255,255,255,.07)' : 'none', whiteSpace: 'pre-wrap', animation: 'fadeIn .3s ease' }}>{m.t}</div>
          ))}
          {busy && (
            <div style={{ alignSelf: 'flex-start', padding: '11px 16px', borderRadius: '4px 16px 16px 16px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', display: 'flex', gap: 5 }}>
              {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: `pulse 1s ${i*.2}s infinite` }}></span>)}
            </div>
          )}
          <div ref={end} />
        </div>

        {/* Quick suggestions */}
        {msgs.length <= 1 && (
          <div style={{ padding: '0 12px 8px', display: 'flex', gap: 5, flexWrap: 'wrap', flexShrink: 0 }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)} style={{ background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.2)', borderRadius: 20, padding: '4px 10px', fontSize: 11, color: '#a5b4fc', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' }} onMouseEnter={e => e.target.style.background='rgba(99,102,241,.22)'} onMouseLeave={e => e.target.style.background='rgba(99,102,241,.1)'}>{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '10px 12px 14px', borderTop: '1px solid rgba(255,255,255,.05)', display: 'flex', gap: 8, flexShrink: 0 }}>
          <input className="inp" value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} placeholder="Ask about venues, budgets, planning..." style={{ fontSize: 13, flex: 1 }} />
          <button onClick={() => send()} disabled={busy || !inp.trim()} className="btn-primary" style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, opacity: inp.trim() ? 1 : 0.5, fontSize: 16 }}>&#8594;</button>
        </div>
      </div>
    </div>
  );
}

/* ── Venue Map (Leaflet) ── */
export function VenueMap({ venues = [], center = [20, 0], zoom = 2, height = 420, onVenueClick }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const markersRef = useRef([]);

  const buildMarkers = (map, list) => {
    markersRef.current.forEach(m => { try { m.remove(); } catch {} });
    markersRef.current = [];
    list.forEach(v => {
      const icon = window.L.divIcon({
        html: `<div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 4px 12px rgba(99,102,241,.5);cursor:pointer;border:1px solid rgba(255,255,255,.2)">${(v.name||'Venue').split(' ').slice(0,2).join(' ')}</div>`,
        className: '', iconAnchor: [0, 0]
      });
      const popup = `<div style="font-family:Inter,sans-serif;min-width:180px;max-width:220px"><img src="${v.image||''}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin-bottom:8px" onerror="this.style.display='none'"/><b style="font-size:13px;display:block;margin-bottom:3px">${v.name}</b><span style="color:#555;font-size:12px">${v.city||''}, ${v.country||''}</span>${v.rating ? `<br><span style="color:#6366f1;font-size:12px;font-weight:600">★${v.rating} &nbsp;|&nbsp; Cap. ${(v.capacity||0).toLocaleString()}</span>` : ''}</div>`;
      const marker = window.L.marker([v.lat, v.lng], { icon }).addTo(map).bindPopup(popup);
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
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 }).addTo(map);
      instanceRef.current = map;
      buildMarkers(map, venues);
    };
    if (!window.L) {
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload = () => setTimeout(init, 100);
      document.head.appendChild(s);
    } else { setTimeout(init, 100); }
    return () => { if (instanceRef.current) { try { instanceRef.current.remove(); } catch {} instanceRef.current = null; } };
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
