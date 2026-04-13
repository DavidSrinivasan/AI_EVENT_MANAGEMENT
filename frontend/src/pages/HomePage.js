import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Chatbot, VenueMap } from '../components/shared';
import { C, venues, wakeBackend } from '../utils';

function useReveal() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, v];
}

function Reveal({ children, delay = 0 }) {
  const [ref, v] = useReveal();
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(32px)', transition: `opacity .7s ${delay}s ease, transform .7s ${delay}s ease` }}>{children}</div>;
}

function Count({ to, suffix = '' }) {
  const [n, setN] = useState(0);
  const [ref, v] = useReveal();
  useEffect(() => {
    if (!v) return;
    let cur = 0, id;
    const step = () => { cur += to / 60; if (cur >= to) { setN(to); return; } setN(Math.floor(cur)); id = requestAnimationFrame(step); };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [v, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

export default function HomePage() {
  const nav = useNavigate();
  const [heroIn, setHeroIn] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedVenue, setSelectedVenue] = useState(null);

  useEffect(() => {
    wakeBackend();
    setTimeout(() => setHeroIn(true), 80);
  }, []);

  const featuredVenues = venues.slice(0, 6);

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: C.bg, color: C.text, overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#05060f}::-webkit-scrollbar-thumb{background:#6366f1;border-radius:2px}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes shimmer{0%,100%{opacity:.6}50%{opacity:1}}
        .btn-p{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .25s}
        .btn-p:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(99,102,241,.45)}
        .btn-o{background:transparent;color:#94a3b8;border:1px solid rgba(99,102,241,.3);border-radius:12px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .25s}
        .btn-o:hover{border-color:rgba(99,102,241,.7);color:#c7d2fe;background:rgba(99,102,241,.06)}
        .card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:20px;transition:all .3s;cursor:pointer}
        .card:hover{background:rgba(99,102,241,.06);border-color:rgba(99,102,241,.3);transform:translateY(-4px)}
        .tag{background:rgba(99,102,241,.12);color:#a5b4fc;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:500}
        @media(max-width:768px){.hero-h1{font-size:2.4rem!important}.grid-2{grid-template-columns:1fr!important}.grid-3{grid-template-columns:1fr!important}.grid-4{grid-template-columns:1fr 1fr!important}.hide-mobile{display:none!important}}
      `}</style>

      <Navbar />

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 5% 60px', position: 'relative', overflow: 'hidden' }}>
        {[{ top: '-15%', left: '-8%', c: 'rgba(99,102,241,.18)', d: '0s' }, { top: '10%', right: '-12%', c: 'rgba(139,92,246,.14)', d: '2s' }, { bottom: '-10%', left: '35%', c: 'rgba(6,182,212,.1)', d: '4s' }].map((o, i) => (
          <div key={i} style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle,${o.c},transparent 68%)`, filter: 'blur(72px)', ...o, animation: `float ${7 + i}s ${o.d} ease-in-out infinite`, zIndex: 0 }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.025) 1px,transparent 1px)', backgroundSize: '64px 64px', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900 }}>
          <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(-16px)', transition: 'all .6s ease', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', border: '1px solid rgba(99,102,241,.35)', background: 'rgba(99,102,241,.08)', borderRadius: 100, fontSize: 12, color: '#a5b4fc', marginBottom: '1.5rem', fontWeight: 500 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'shimmer 2s infinite' }}></span>
            AI-Powered · 12,000+ Venues Worldwide · Completely Free
          </div>

          <h1 className="hero-h1" style={{ fontSize: 'clamp(2.8rem,6.5vw,5.5rem)', fontWeight: 900, lineHeight: 1.04, letterSpacing: '-0.04em', marginBottom: '1.5rem', opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(28px)', transition: 'all .7s .1s ease' }}>
            Discover & Manage<br />
            <span style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa,#38bdf8)', backgroundSize: '200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'gradShift 5s ease infinite' }}>Events Worldwide</span>
          </h1>

          <p style={{ fontSize: 'clamp(.95rem,1.8vw,1.2rem)', color: C.muted2, maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.78, opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(28px)', transition: 'all .7s .2s ease' }}>
            Find perfect venues, get AI recommendations, analyze ROI, and manage events globally — all in one powerful free platform.
          </p>

          {/* Search bar */}
          <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(28px)', transition: 'all .7s .3s ease', maxWidth: 580, margin: '0 auto 2rem', display: 'flex', gap: 8, background: 'rgba(255,255,255,.06)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 8 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && nav(`/venues?q=${search}`)} placeholder="🔍  Search venues by city, country or name…" style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: 14, padding: '6px 12px', fontFamily: 'inherit' }} />
            <button className="btn-p" style={{ padding: '10px 22px', fontSize: 14, borderRadius: 10 }} onClick={() => nav(`/venues?q=${search}`)}>Search</button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', opacity: heroIn ? 1 : 0, transition: 'all .7s .35s ease' }}>
            <button className="btn-p" style={{ padding: '13px 26px', fontSize: 15 }} onClick={() => nav('/venues')}>Find Venues →</button>
            <button className="btn-o" style={{ padding: '13px 26px', fontSize: 15 }} onClick={() => nav('/create-event')}>Create Event</button>
          </div>

          {/* Stats */}
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginTop: '4rem', opacity: heroIn ? 1 : 0, transition: 'all .7s .45s ease' }}>
            {[['12', 'K+', 'Venues Worldwide'], ['98', '%', 'Satisfaction Rate'], ['140', '+', 'Countries Covered'], ['50', 'K+', 'Events Hosted']].map(([n, s, l]) => (
              <div key={l} style={{ padding: '18px', background: 'rgba(255,255,255,.03)', border: `1px solid ${C.border2}`, borderRadius: 16, textAlign: 'center' }}>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em' }}><Count to={parseInt(n)} suffix={s} /></div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORLD MAP ── */}
      <section style={{ padding: '80px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.15em', color: C.accent, marginBottom: '1rem', display: 'block' }}>Live Venue Map</span>
              <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Venues Across the Globe</h2>
              <p style={{ color: C.muted, maxWidth: 480, margin: '0 auto' }}>Click any venue marker to see details. Explore {venues.length}+ venues in {new Set(venues.map(v => v.country)).size} countries.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <VenueMap venues={venues} center={[20, 0]} zoom={2} height={480} onVenueClick={v => setSelectedVenue(v)} />
          </Reveal>
          {selectedVenue && (
            <div style={{ marginTop: '1.5rem', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', animation: 'slideUp .3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2.5rem' }}>{selectedVenue.image}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{selectedVenue.name}</div>
                  <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{selectedVenue.city}, {selectedVenue.country} · Capacity {selectedVenue.capacity.toLocaleString()} · ★{selectedVenue.rating}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-o" style={{ padding: '9px 18px', fontSize: 13 }} onClick={() => setSelectedVenue(null)}>✕</button>
                <button className="btn-p" style={{ padding: '9px 18px', fontSize: 13 }} onClick={() => nav(`/venue/${selectedVenue.id}`)}>View Venue →</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '80px 5%', background: 'rgba(255,255,255,.01)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal><div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.15em', color: C.accent, display: 'block', marginBottom: '1rem' }}>Everything You Need</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>Built for Event Professionals</h2>
          </div></Reveal>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5px', background: 'rgba(255,255,255,.04)', border: `1px solid rgba(255,255,255,.04)`, borderRadius: 24, overflow: 'hidden' }}>
            {[['🗺️','Global Venue Search','Search 12,000+ venues worldwide with filters for type, capacity, budget and ratings.','/venues'],['🤖','AI Recommendations','Get AI-powered venue suggestions tailored to your event type, budget and attendee count.','/create-event'],['📊','ROI Dashboard','Track budgets, revenue projections and ROI with interactive visual analytics.','/dashboard'],['✅','Event Creation','Create and manage events with smart recommendations at every step.','/create-event'],['⭐','Ratings & Reviews','Read verified reviews and ratings from real event organizers worldwide.','/venues'],['🔖','Saved Venues','Bookmark favorite venues and get personalized suggestions based on your history.','/profile']].map(([ic, ti, de, path], i) => (
              <Reveal key={ti} delay={i * 0.07}>
                <div className="card" style={{ borderRadius: 0, border: 'none', padding: '2rem', height: '100%' }} onClick={() => nav(path)}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(99,102,241,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1.25rem' }}>{ic}</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{ti}</div>
                  <p style={{ fontSize: '0.875rem', color: C.muted, lineHeight: 1.7 }}>{de}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED VENUES ── */}
      <section style={{ padding: '80px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.15em', color: C.accent, display: 'block', marginBottom: '0.5rem' }}>Top Picks</span>
                <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>Featured Venues</h2>
              </div>
              <button className="btn-o" style={{ padding: '10px 22px', fontSize: 14 }} onClick={() => nav('/venues')}>View All Venues →</button>
            </div>
          </Reveal>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
            {featuredVenues.map((v, i) => (
              <Reveal key={v.id} delay={i * 0.08}>
                <div className="card" style={{ overflow: 'hidden' }} onClick={() => nav(`/venue/${v.id}`)}>
                  <div style={{ height: 130, background: `linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.1))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', borderRadius: '16px 16px 0 0' }}>{v.image}</div>
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>{v.name}</div>
                        <div style={{ fontSize: 13, color: C.muted }}>📍 {v.city}, {v.country}</div>
                      </div>
                      <span style={{ background: 'rgba(16,185,129,.12)', color: '#34d399', padding: '2px 8px', borderRadius: 20, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>★ {v.rating}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <span className="tag">{v.type}</span>
                      <span className="tag">👥 {v.capacity.toLocaleString()}</span>
                      <span className="tag">${v.price.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.muted }}>
                      <span>👁 {v.views.toLocaleString()} views</span>
                      <span>💬 {v.reviews} reviews</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '80px 5%', background: 'rgba(255,255,255,.01)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal><div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>Plan Your Event in 4 Steps</h2>
          </div></Reveal>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem' }}>
            {[['🔍','Search Venues','Browse 12,000+ venues with filters for location, type, capacity and budget.'],['🤖','Get AI Picks','Our AI analyzes your requirements and recommends the most suitable venues.'],['📅','Create Event','Fill in your event details and get a complete planning checklist and timeline.'],['📊','Track & Analyze','Monitor ROI, budgets and attendance with live analytics dashboards.']].map(([ic, ti, de], i) => (
              <Reveal key={ti} delay={i * 0.1}>
                <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                  <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(99,102,241,.1)', border: `2px solid rgba(99,102,241,.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.8rem', position: 'relative' }}>
                    {ic}
                    <div style={{ position: 'absolute', top: -2, right: -2, width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>{i + 1}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{ti}</div>
                  <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.7 }}>{de}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 5%' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', padding: '60px 40px', background: 'linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.08))', border: `1px solid rgba(99,102,241,.2)`, borderRadius: 28 }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
              <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Ready to Plan Your Event?</h2>
              <p style={{ color: C.muted, marginBottom: '2rem', fontSize: '1.05rem', lineHeight: 1.7 }}>Join thousands of event professionals. Everything is free — no credit card, no subscriptions, no limits.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-p" style={{ padding: '15px 32px', fontSize: 16 }} onClick={() => nav('/create-event')}>Start Planning Free →</button>
                <button className="btn-o" style={{ padding: '15px 32px', fontSize: 16 }} onClick={() => nav('/venues')}>Explore Venues</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '3rem 5% 2rem', borderTop: `1px solid ${C.border2}` }}>
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Event<span style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IQ</span></div>
            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, maxWidth: 240 }}>The AI-powered event management platform. Plan smarter, execute flawlessly — completely free.</p>
          </div>
          {[['Platform', ['Find Venues', 'Create Event', 'Dashboard', 'AI Assistant']], ['Company', ['About', 'Blog', 'Careers', 'Contact']], ['Legal', ['Privacy Policy', 'Terms', 'Security', 'Status']]].map(([title, links]) => (
            <div key={title}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: '1rem' }}>{title}</div>
              {links.map(l => <div key={l} style={{ fontSize: 13, color: '#475569', marginBottom: 8, cursor: 'pointer' }} onMouseEnter={e => e.target.style.color='#a5b4fc'} onMouseLeave={e => e.target.style.color='#475569'}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border2}`, paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: '#334155', fontSize: 12 }}>© 2025 EventIQ · Built with React, Groq AI & OpenStreetMap · 100% Free</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {['𝕏', 'in', 'gh', 'yt'].map(s => <div key={s} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 12, cursor: 'pointer', transition: 'all .2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,.4)'; e.currentTarget.style.color = '#a5b4fc'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.color = '#475569'; }}>{s}</div>)}
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}
