import React, { useState, useEffect, useRef } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://eventiq-backend.onrender.com';

// ── Wake up Render on load so chatbot is ready ──────────────
const wakeUpBackend = () => {
  fetch(`${API_URL}/`).catch(() => {});
};

// ── Chatbot ─────────────────────────────────────────────────
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
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setLoading(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const res = await fetch(`${API_URL}/api/chatbot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, messages: messages }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      const msg = err.name === 'AbortError'
        ? "The server is waking up (free tier). Please wait 30 seconds and try again!"
        : "Connection issue — server may be starting up. Try again in 30 seconds!";
      setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, fontFamily: 'inherit' }}>
      {open && (
        <div style={{ width: 360, background: 'rgba(10,12,28,0.97)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, overflow: 'hidden', marginBottom: 12, boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.1)' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff', letterSpacing: '-0.01em' }}>EventIQ Assistant</div>
              <div style={{ fontSize: 11, color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }}></span>
                Online · AI Powered by Groq
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#a5b4fc', cursor: 'pointer', width: 28, height: 28, borderRadius: '50%', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>
          <div style={{ height: 300, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10, background: '#0a0c1c' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ maxWidth: '88%', padding: '10px 14px', borderRadius: m.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px', background: m.role === 'user' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.06)', color: '#f0f4ff', fontSize: 13, lineHeight: 1.6, alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>{m.content}</div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', padding: '10px 14px', borderRadius: '4px 18px 18px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 4 }}>
                {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: `bounce 1s ${i*0.2}s infinite` }}></span>)}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0a0c1c', display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Ask me anything..." style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, padding: '10px 14px', color: '#f0f4ff', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
            <button onClick={sendMessage} disabled={loading} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 12, width: 42, height: 42, color: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>→</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', cursor: 'pointer', fontSize: 24, boxShadow: '0 8px 32px rgba(99,102,241,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>💬</button>
    </div>
  );
}

// ── Map ──────────────────────────────────────────────────────
function EventMap({ lat = 1.3521, lng = 103.8198, venueName = "Singapore Expo" }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const l = document.createElement('link');
      l.id = 'leaflet-css'; l.rel = 'stylesheet';
      l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(l);
    }
    const init = () => {
      if (mapInstanceRef.current || !mapRef.current) return;
      const map = window.L.map(mapRef.current).setView([lat, lng], 14);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
      window.L.marker([lat, lng]).addTo(map).bindPopup(`<b>${venueName}</b>`).openPopup();
      mapInstanceRef.current = map;
    };
    if (!window.L) {
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload = init; document.head.appendChild(s);
    } else init();
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [lat, lng, venueName]);
  return <div ref={mapRef} style={{ height: 420, width: '100%', borderRadius: 16, border: '1px solid rgba(99,102,241,0.2)' }} />;
}

// ── Animated counter ─────────────────────────────────────────
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const t = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(t); }
          else setCount(Math.floor(start));
        }, 25);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Scroll reveal hook ───────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, dir = 'up' }) {
  const [ref, visible] = useReveal();
  const transforms = { up: 'translateY(40px)', left: 'translateX(-40px)', right: 'translateX(40px)', scale: 'scale(0.92)' };
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : transforms[dir], transition: `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s ease` }}>
      {children}
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────
export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    wakeUpBackend();
    setTimeout(() => setHeroVisible(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  const features = [
    { icon: '🤖', title: 'AI Chatbot', desc: 'Groq-powered assistant answers attendee questions instantly in 40+ languages, 24/7.' },
    { icon: '🗺️', title: 'Live Venue Maps', desc: 'Interactive OpenStreetMap integration with real-time crowd data and directions.' },
    { icon: '📊', title: 'Smart Analytics', desc: 'Real-time dashboards showing ticket sales, attendance trends and revenue forecasts.' },
    { icon: '🎟️', title: 'Smart Ticketing', desc: 'QR code check-in, dynamic pricing, and automated waitlist management.' },
    { icon: '📱', title: 'Mobile First', desc: 'Fully responsive design that works flawlessly on every device and screen size.' },
    { icon: '🔒', title: 'Enterprise Security', desc: 'GDPR compliant with role-based access, audit logs and end-to-end encryption.' },
  ];

  const events = [
    { id: 1, title: 'Tech Summit 2025', date: 'Dec 15, 2025', location: 'Singapore', color: '#6366f1', emoji: '💻' },
    { id: 2, title: 'Design Week', date: 'Jan 10, 2026', location: 'Mumbai', color: '#8b5cf6', emoji: '🎨' },
    { id: 3, title: 'AI Conference', date: 'Feb 5, 2026', location: 'Chennai', color: '#06b6d4', emoji: '🧠' },
  ];

  const steps = [
    { num: '01', title: 'Create Your Event', desc: 'Describe your event in plain English. AI auto-fills details and builds your page in minutes.' },
    { num: '02', title: 'Customize & Publish', desc: 'Pick from templates, add ticketing, agenda and maps. Go live globally with one click.' },
    { num: '03', title: 'Promote Everywhere', desc: 'AI writes your marketing copy and auto-publishes to all platforms simultaneously.' },
    { num: '04', title: 'Analyze & Grow', desc: 'Get deep insights after every event. AI recommends exactly how to grow your next one.' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#05060f', color: '#f0f4ff', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #05060f; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 2px; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse-ring { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2);opacity:0} }
        @keyframes gradient-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes shimmer { 0%{opacity:0.5} 50%{opacity:1} 100%{opacity:0.5} }
        .btn-primary { background: linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; border:none; padding:14px 28px; border-radius:12px; font-size:15px; font-weight:600; cursor:pointer; transition:all 0.25s; font-family:inherit; letter-spacing:-0.01em; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 12px 40px rgba(99,102,241,0.4); }
        .btn-outline { background:transparent; color:#a5b4fc; border:1px solid rgba(99,102,241,0.4); padding:14px 28px; border-radius:12px; font-size:15px; font-weight:500; cursor:pointer; transition:all 0.25s; font-family:inherit; }
        .btn-outline:hover { background:rgba(99,102,241,0.08); border-color:rgba(99,102,241,0.7); color:#c7d2fe; }
        .card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:20px; padding:28px; transition:all 0.3s; }
        .card:hover { background:rgba(99,102,241,0.06); border-color:rgba(99,102,241,0.3); transform:translateY(-4px); }
        .nav-link { color:#94a3b8; text-decoration:none; font-size:14px; font-weight:500; transition:color 0.2s; cursor:pointer; background:none; border:none; font-family:inherit; }
        .nav-link:hover { color:#f0f4ff; }
        @media(max-width:768px){
          .hero-title{font-size:2.4rem!important}
          .nav-links{display:none}
          .stats-grid{grid-template-columns:1fr 1fr!important}
          .features-grid{grid-template-columns:1fr!important}
          .steps-grid{grid-template-columns:1fr!important}
          .events-grid{grid-template-columns:1fr!important}
          .maps-grid{grid-template-columns:1fr!important}
          .footer-grid{grid-template-columns:1fr 1fr!important}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 5%', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(5,6,15,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none', transition: 'all 0.3s' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', cursor: 'pointer' }} onClick={() => scrollTo('hero')}>
          Event<span style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IQ</span>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: '2rem' }}>
          {['features','steps','events','venue-map'].map(id => (
            <button key={id} className="nav-link" onClick={() => scrollTo(id)}>{id === 'venue-map' ? 'Maps' : id === 'steps' ? 'How It Works' : id.charAt(0).toUpperCase() + id.slice(1)}</button>
          ))}
        </div>
        <button className="btn-primary" onClick={() => scrollTo('events')} style={{ padding: '10px 22px', fontSize: 14 }}>Get Started →</button>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 5% 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Background orbs */}
        {[{ top: '-10%', left: '-5%', color: 'rgba(99,102,241,0.15)' }, { top: '20%', right: '-10%', color: 'rgba(139,92,246,0.12)' }, { bottom: '-10%', left: '40%', color: 'rgba(6,182,212,0.08)' }].map((orb, i) => (
          <div key={i} style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${orb.color}, transparent 70%)`, filter: 'blur(60px)', ...orb, animation: `float ${6 + i * 2}s ease-in-out infinite` }} />
        ))}
        {/* Grid bg */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860 }}>
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(-20px)', transition: 'all 0.6s ease', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', border: '1px solid rgba(99,102,241,0.35)', background: 'rgba(99,102,241,0.1)', borderRadius: 100, fontSize: '0.78rem', color: '#a5b4fc', marginBottom: '1.75rem', fontWeight: 500 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'shimmer 2s infinite' }}></span>
            Live · Trusted by 12,000+ Event Professionals Worldwide
          </div>

          <h1 className="hero-title" style={{ fontSize: 'clamp(2.8rem,7vw,5.5rem)', fontWeight: 900, lineHeight: 1.04, letterSpacing: '-0.04em', marginBottom: '1.5rem', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(30px)', transition: 'all 0.7s 0.1s ease' }}>
            The Smartest Way to<br />
            <span style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa,#38bdf8)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'gradient-shift 4s ease infinite' }}>
              Manage Any Event
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', color: '#94a3b8', maxWidth: 580, margin: '0 auto 2.5rem', lineHeight: 1.75, fontWeight: 400, opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(30px)', transition: 'all 0.7s 0.2s ease' }}>
            AI-powered event platform with smart ticketing, real-time analytics, interactive venue maps, and automated guest management — all completely free.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(30px)', transition: 'all 0.7s 0.3s ease' }}>
            <button className="btn-primary btn-large" onClick={() => scrollTo('events')}>Browse Events →</button>
            <button className="btn-outline" onClick={() => scrollTo('features')}>Explore Features</button>
          </div>

          {/* Stats */}
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginTop: '4rem', opacity: heroVisible ? 1 : 0, transition: 'all 0.7s 0.4s ease' }}>
            {[['50', 'K+', 'Events Hosted'], ['98', '%', 'Satisfaction Rate'], ['140', '+', 'Countries'], ['4.9', '★', 'Average Rating']].map(([n, s, l], i) => (
              <div key={i} style={{ padding: '20px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f0f4ff', letterSpacing: '-0.03em' }}><Counter target={parseFloat(n)} suffix={s} /></div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '100px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6366f1', marginBottom: '1rem', padding: '4px 14px', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100 }}>Core Features</div>
              <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Everything Powered by AI</h2>
              <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>From planning to post-event analytics — one platform handles it all.</p>
            </div>
          </Reveal>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 24, overflow: 'hidden' }}>
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="card" style={{ borderRadius: 0, border: 'none', height: '100%' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1.25rem' }}>{f.icon}</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="steps" style={{ padding: '100px 5%', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6366f1', marginBottom: '1rem', padding: '4px 14px', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100 }}>Process</div>
              <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>From Idea to Sold-Out<br />in 4 Simple Steps</h2>
            </div>
          </Reveal>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem' }}>
            {steps.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.1}>
                <div style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', border: '2px solid rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.6rem', fontWeight: 800, color: '#6366f1', position: 'relative' }}>
                    {s.num}
                    <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '1px solid rgba(99,102,241,0.15)', animation: 'pulse-ring 3s infinite' }} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section id="events" style={{ padding: '100px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6366f1', marginBottom: '0.75rem' }}>Upcoming</div>
                <h2 style={{ fontSize: 'clamp(2rem,4vw,2.5rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>Featured Events</h2>
              </div>
              <button className="btn-outline" style={{ padding: '10px 22px', fontSize: 14 }}>View All Events</button>
            </div>
          </Reveal>
          <div className="events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
            {events.map((ev, i) => (
              <Reveal key={ev.id} delay={i * 0.1}>
                <div className="card" style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/event/${ev.id}`}>
                  <div style={{ height: 140, borderRadius: 14, background: `linear-gradient(135deg,${ev.color}22,${ev.color}11)`, border: `1px solid ${ev.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', marginBottom: '1.25rem' }}>{ev.emoji}</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: ev.color, marginBottom: '0.5rem' }}>Free Entry</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{ev.title}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 20, fontSize: '0.78rem', color: '#94a3b8' }}>📅 {ev.date}</span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 20, fontSize: '0.78rem', color: '#94a3b8' }}>📍 {ev.location}</span>
                  </div>
                  <button className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}>Register Free →</button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP ── */}
      <section id="venue-map" style={{ padding: '100px 5%', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="maps-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '4rem', alignItems: 'center' }}>
            <Reveal dir="left">
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6366f1', marginBottom: '1rem' }}>Venue Intelligence</div>
              <h2 style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Interactive Maps & Smart Venue Search</h2>
              <p style={{ color: '#64748b', lineHeight: 1.75, marginBottom: '2rem' }}>Powered by OpenStreetMap — completely free, no API key required. Find venues, get directions, and show attendees exactly where to go.</p>
              {[['📍','OpenStreetMap — free forever, no API key'],['🏢','Interactive markers and popups'],['🚗','Click the marker for venue details'],['🌍','Works for any location worldwide']].map(([ic, tx]) => (
                <div key={tx} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, fontSize: '0.9rem', color: '#94a3b8' }}>
                  <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{ic}</span>
                  {tx}
                </div>
              ))}
            </Reveal>
            <Reveal dir="right">
              <EventMap lat={1.3521} lng={103.8198} venueName="Singapore Expo — Main Venue" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 5%', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <Reveal>
            <div style={{ padding: '60px 40px', background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 28 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀</div>
              <h2 style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Ready to Host Your Best Event?</h2>
              <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: 1.7 }}>Join thousands of event professionals. Everything is free — no credit card, no subscriptions.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-primary" style={{ padding: '16px 32px', fontSize: 16 }} onClick={() => scrollTo('events')}>Start Free Now →</button>
                <button className="btn-outline" onClick={() => scrollTo('venue-map')}>See the Map</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '3rem 5% 2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
              Event<span style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IQ</span>
            </div>
            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 240 }}>The AI-powered event management platform. Plan smarter, execute flawlessly — completely free.</p>
          </div>
          {[['Product', ['Features', 'How It Works', 'Events', 'Maps']],['Company', ['About', 'Blog', 'Careers', 'Privacy']],['Support', ['Help Center', 'Contact', 'GitHub', 'Status']]].map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '1rem' }}>{title}</h4>
              <ul style={{ listStyle: 'none' }}>
                {links.map(l => <li key={l} style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#a5b4fc'} onMouseLeave={e => e.target.style.color='#475569'}>{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: '#334155', fontSize: '0.8rem' }}>© 2025 EventIQ. Built with ❤️ using React, Groq AI & OpenStreetMap.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['𝕏', 'in', 'gh'].map(s => <a key={s} href="#" style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', textDecoration: 'none', fontSize: '0.85rem', transition: 'all 0.2s' }} onMouseEnter={e => { e.target.style.borderColor='rgba(99,102,241,0.4)'; e.target.style.color='#a5b4fc'; }} onMouseLeave={e => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.color='#475569'; }}>{s}</a>)}
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}
