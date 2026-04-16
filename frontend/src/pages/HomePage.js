import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, VenueMap, GlobalStyles } from '../components/shared';
import { C, venues, wakeBackend } from '../utils';

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, v];
}

function Reveal({ children, delay = 0, y = 32 }) {
  const [ref, v] = useReveal();
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : `translateY(${y}px)`, transition: `opacity .7s ${delay}s ease, transform .7s ${delay}s ease` }}>
      {children}
    </div>
  );
}

function Count({ to, suffix = '' }) {
  const [n, setN] = useState(0);
  const [ref, v] = useReveal();
  useEffect(() => {
    if (!v) return;
    let cur = 0, id;
    const step = () => { cur += to / 55; if (cur >= to) { setN(to); return; } setN(Math.floor(cur)); id = requestAnimationFrame(step); };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [v, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

export default function HomePage() {
  const nav = useNavigate();
  const [heroIn, setHeroIn] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    wakeBackend();
    setTimeout(() => setHeroIn(true), 80);
  }, []);

  const featured = venues.slice(0, 6);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: C.bg, color: C.text, overflowX: 'hidden', minHeight: '100vh' }}>
      <GlobalStyles />
      <Navbar />

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 5% 60px', position: 'relative', overflow: 'hidden' }}>
        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.03) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860 }}>
          {/* Badge */}
          <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(-12px)', transition: 'all .6s ease', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', border: '1px solid rgba(99,102,241,.35)', background: 'rgba(99,102,241,.08)', borderRadius: 100, fontSize: 12, color: '#a5b4fc', marginBottom: '1.5rem', fontWeight: 500 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
            AI-Powered Global Event Management Platform
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(2.6rem,6vw,5.2rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '1.5rem', opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(28px)', transition: 'all .7s .1s ease' }}>
            Discover & Manage<br />
            <span style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa,#38bdf8)', backgroundSize: '200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'gradShift 5s ease infinite' }}>
              Events Worldwide
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(.95rem,1.8vw,1.18rem)', color: C.muted2, maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.78, opacity: heroIn ? 1 : 0, transition: 'all .7s .2s ease' }}>
            Search venues across 140 countries, get AI recommendations, manage vendors, analyze ROI — all on one powerful free platform.
          </p>

          {/* Search */}
          <div style={{ opacity: heroIn ? 1 : 0, transition: 'all .7s .3s ease', maxWidth: 560, margin: '0 auto 2rem', display: 'flex', gap: 8, background: 'rgba(255,255,255,.06)', border: `1px solid ${C.border}`, borderRadius: 14, padding: 6 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && nav(`/venues?q=${search}`)} placeholder="Search venues by city, country, or name..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: 14, padding: '8px 12px', fontFamily: 'inherit' }} />
            <button className="btn-primary" style={{ padding: '10px 22px', fontSize: 14, borderRadius: 10 }} onClick={() => nav(`/venues?q=${search}`)}>Search</button>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', opacity: heroIn ? 1 : 0, transition: 'all .7s .35s ease', marginBottom: '4rem' }}>
            <button className="btn-primary" style={{ padding: '13px 26px', fontSize: 15 }} onClick={() => nav('/venues')}>Find Venues</button>
            <button className="btn-secondary" style={{ padding: '13px 26px', fontSize: 15 }} onClick={() => nav('/create-event')}>Create Event</button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', opacity: heroIn ? 1 : 0, transition: 'all .7s .45s ease' }}>
            {[['12', 'K+', 'Venues'], ['98', '%', 'Satisfaction'], ['140', '+', 'Countries'], ['50', 'K+', 'Events']].map(([n, s, l]) => (
              <div key={l} style={{ padding: '18px 14px', background: 'rgba(255,255,255,.03)', border: `1px solid ${C.border2}`, borderRadius: 14, textAlign: 'center' }}>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em' }}><Count to={parseInt(n)} suffix={s} /></div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORLD MAP */}
      <section style={{ padding: '80px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.15em', color: C.accent, marginBottom: '0.75rem' }}>Live Venue Map</div>
              <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Venues Across the Globe</h2>
              <p style={{ color: C.muted, maxWidth: 480, margin: '0 auto', fontSize: 15 }}>Click any marker on the map to see venue details. Explore {venues.length}+ venues across {new Set(venues.map(v => v.country)).size} countries.</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <VenueMap venues={venues} center={[20, 0]} zoom={2} height={500} onVenueClick={v => setSelected(v)} />
          </Reveal>

          {selected && (
            <div style={{ marginTop: '1.5rem', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', animation: 'slideIn .3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={selected.image} alt={selected.name} style={{ width: 72, height: 56, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} onError={e => e.target.style.display='none'} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{selected.name}</div>
                  <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{selected.city}, {selected.country} &nbsp;·&nbsp; Cap. {selected.capacity.toLocaleString()} &nbsp;·&nbsp; ★{selected.rating}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => setSelected(null)}>Close</button>
                <button className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }} onClick={() => nav(`/venue/${selected.id}`)}>View Details</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 5%', background: 'rgba(255,255,255,.01)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal><div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.15em', color: C.accent, marginBottom: '0.75rem' }}>Platform Features</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>Everything You Need to Succeed</h2>
          </div></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5px', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.04)', borderRadius: 24, overflow: 'hidden' }}>
            {[
              { icon: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=60&h=60&fit=crop', title: 'Global Venue Search', desc: 'Search 12,000+ venues worldwide with smart filters for type, capacity, price and ratings.', path: '/venues' },
              { icon: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=60&h=60&fit=crop', title: 'AI Recommendations', desc: 'Get GPT-4 powered venue suggestions tailored to your event type, budget and attendee count.', path: '/create-event' },
              { icon: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=60&h=60&fit=crop', title: 'ROI Dashboard', desc: 'Track budgets, revenue projections and ROI with interactive real-time analytics charts.', path: '/dashboard' },
              { icon: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=60&h=60&fit=crop', title: 'Vendor Integration', desc: 'Browse and connect with catering, photography, decoration and security vendors per location.', path: '/vendors' },
              { icon: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=60&h=60&fit=crop', title: 'Event Creation', desc: 'Create and manage events with a 3-step wizard and AI venue recommendations at every stage.', path: '/create-event' },
              { icon: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=60&h=60&fit=crop', title: 'User Profiles', desc: 'Bookmark venues, manage your events, track history and customize recommendations.', path: '/profile' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="card" style={{ borderRadius: 0, border: 'none', padding: '2rem', height: '100%', cursor: 'pointer' }} onClick={() => nav(f.path)}>
                  <img src={f.icon} alt={f.title} style={{ width: 52, height: 52, borderRadius: 14, objectFit: 'cover', marginBottom: '1.25rem' }} onError={e => { e.target.style.display='none'; }} />
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{f.title}</div>
                  <p style={{ fontSize: '0.875rem', color: C.muted, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED VENUES */}
      <section style={{ padding: '80px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.15em', color: C.accent, marginBottom: '0.5rem' }}>Top Picks</div>
                <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>Featured Venues</h2>
              </div>
              <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => nav('/venues')}>View All Venues</button>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '1.5rem' }}>
            {featured.map((v, i) => (
              <Reveal key={v.id} delay={i * 0.08}>
                <div className="card" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => nav(`/venue/${v.id}`)}>
                  <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                    <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease' }} onError={e => { e.target.parentElement.style.background = 'rgba(99,102,241,.1)'; e.target.style.display = 'none'; }} onMouseEnter={e => e.target.style.transform='scale(1.05)'} onMouseLeave={e => e.target.style.transform='scale(1)'} />
                    <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600, color: '#fff' }}>★ {v.rating}</div>
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{v.name}</div>
                    </div>
                    <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>{v.city}, {v.country}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                      <span className="tag">{v.type}</span>
                      <span className="tag">Cap. {v.capacity.toLocaleString()}</span>
                      <span className="tag">${v.price.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569' }}>
                      <span>{v.views.toLocaleString()} views</span>
                      <span>{v.reviews} reviews</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 5%' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', padding: '60px 40px', background: 'linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.08))', border: '1px solid rgba(99,102,241,.2)', borderRadius: 28 }}>
              <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Start Planning Your Event Today</h2>
              <p style={{ color: C.muted, marginBottom: '2rem', fontSize: '1.05rem', lineHeight: 1.7 }}>Join thousands of event professionals. Everything is free — no credit card, no subscriptions, no limits.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-primary" style={{ padding: '14px 30px', fontSize: 15 }} onClick={() => nav('/create-event')}>Get Started Free</button>
                <button className="btn-secondary" style={{ padding: '14px 30px', fontSize: 15 }} onClick={() => nav('/venues')}>Browse Venues</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '3rem 5% 2rem', borderTop: `1px solid ${C.border2}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2rem', marginBottom: '2rem', maxWidth: 1200, margin: '0 auto 2rem' }}>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Event<span style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IQ</span></div>
            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, maxWidth: 240 }}>The AI-powered global event management platform. Plan smarter, execute flawlessly.</p>
          </div>
          {[['Platform', ['Find Venues', 'Create Event', 'Dashboard', 'Vendors']], ['Company', ['About', 'Blog', 'Careers', 'Contact']], ['Legal', ['Privacy Policy', 'Terms of Service', 'Security']]].map(([title, links]) => (
            <div key={title}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: '1rem' }}>{title}</div>
              {links.map(l => <div key={l} style={{ fontSize: 13, color: '#475569', marginBottom: 8, cursor: 'pointer', transition: 'color .2s' }} onMouseEnter={e => e.target.style.color='#a5b4fc'} onMouseLeave={e => e.target.style.color='#475569'}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', borderTop: `1px solid ${C.border2}`, paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: '#334155', fontSize: 12 }}>© 2025 EventIQ · Built with React, GPT-4o-mini and OpenStreetMap · 100% Free</p>
        </div>
      </footer>
    </div>
  );
}
