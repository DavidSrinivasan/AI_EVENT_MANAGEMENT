import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar, Chatbot, VenueMap } from '../components/shared';
import { C, venues, eventTypes } from '../utils';

export default function VenueSearchPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const [filters, setFilters] = useState({ type: '', maxPrice: 25000, minCapacity: 0, minRating: 0 });
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('rating');
  const [showFilters, setShowFilters] = useState(true);

  const filtered = venues.filter(v => {
    if (search && !`${v.name} ${v.city} ${v.country} ${v.type}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.type && v.type !== filters.type) return false;
    if (v.price > filters.maxPrice) return false;
    if (v.capacity < filters.minCapacity) return false;
    if (v.rating < filters.minRating) return false;
    return true;
  }).sort((a, b) => sort === 'rating' ? b.rating - a.rating : sort === 'price' ? a.price - b.price : b.views - a.views);

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#6366f1;border-radius:2px}
        .btn-p{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s}
        .btn-p:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(99,102,241,.4)}
        .btn-o{background:transparent;color:#94a3b8;border:1px solid rgba(99,102,241,.25);border-radius:10px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .2s}
        .btn-o:hover{border-color:rgba(99,102,241,.6);color:#c7d2fe}
        .card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:18px;transition:all .25s;cursor:pointer}
        .card:hover{background:rgba(99,102,241,.06);border-color:rgba(99,102,241,.3);transform:translateY(-3px)}
        .inp{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:9px 14px;color:#f0f4ff;font-size:13px;font-family:inherit;outline:none;transition:border-color .2s}
        .inp:focus{border-color:rgba(99,102,241,.5)}
        .tag{background:rgba(99,102,241,.1);color:#a5b4fc;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:500}
        @media(max-width:900px){.layout{grid-template-columns:1fr!important}.sidebar{display:none!important}}
      `}</style>

      <Navbar />

      <div style={{ paddingTop: 80 }}>
        {/* Search header */}
        <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border2}`, padding: '20px 5%' }}>
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.03em' }}>Find Event Venues</h1>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 250, display: 'flex', gap: 8, background: 'rgba(255,255,255,.06)', border: `1px solid ${C.border}`, borderRadius: 12, padding: 8 }}>
                <input className="inp" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search by city, country, venue name…" style={{ flex: 1, background: 'none', border: 'none', padding: '4px 8px' }} />
                {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 16 }}>✕</button>}
              </div>
              <select className="inp" value={sort} onChange={e => setSort(e.target.value)} style={{ minWidth: 150 }}>
                <option value="rating">Sort: Top Rated</option>
                <option value="price">Sort: Lowest Price</option>
                <option value="views">Sort: Most Popular</option>
              </select>
              <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,.04)', border: `1px solid ${C.border2}`, borderRadius: 10, padding: 4 }}>
                {['grid', 'map'].map(v => <button key={v} onClick={() => setView(v)} style={{ padding: '6px 14px', borderRadius: 8, background: view === v ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'none', border: 'none', color: view === v ? '#fff' : C.muted, cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'inherit' }}>{v === 'grid' ? '⊞ Grid' : '🗺 Map'}</button>)}
              </div>
            </div>
          </div>
        </div>

        <div className="layout" style={{ maxWidth: 1300, margin: '0 auto', padding: '1.5rem 5%', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Sidebar filters */}
          <div className="sidebar" style={{ background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 18, padding: '1.5rem', position: 'sticky', top: 80 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '1.25rem' }}>Filters</div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6 }}>Venue Type</label>
              <select className="inp" value={filters.type} onChange={e => setFilters(p => ({ ...p, type: e.target.value }))} style={{ width: '100%' }}>
                <option value="">All Types</option>
                {[...new Set(venues.map(v => v.type))].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6 }}>Max Price: ${filters.maxPrice.toLocaleString()}</label>
              <input type="range" min={1000} max={25000} step={500} value={filters.maxPrice} onChange={e => setFilters(p => ({ ...p, maxPrice: Number(e.target.value) }))} style={{ width: '100%', accentColor: '#6366f1' }} />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6 }}>Min Capacity: {filters.minCapacity.toLocaleString()}</label>
              <input type="range" min={0} max={15000} step={500} value={filters.minCapacity} onChange={e => setFilters(p => ({ ...p, minCapacity: Number(e.target.value) }))} style={{ width: '100%', accentColor: '#6366f1' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6 }}>Min Rating: {filters.minRating}+</label>
              <input type="range" min={0} max={5} step={0.5} value={filters.minRating} onChange={e => setFilters(p => ({ ...p, minRating: Number(e.target.value) }))} style={{ width: '100%', accentColor: '#6366f1' }} />
            </div>

            <button className="btn-o" style={{ width: '100%', padding: '9px', fontSize: 13 }} onClick={() => setFilters({ type: '', maxPrice: 25000, minCapacity: 0, minRating: 0 })}>Reset Filters</button>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99,102,241,.06)', borderRadius: 12, border: `1px solid rgba(99,102,241,.15)` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#a5b4fc', marginBottom: 6 }}>🤖 AI Search</div>
              <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>Use the chatbot to describe your event and get personalized venue recommendations!</p>
            </div>
          </div>

          {/* Results */}
          <div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: '1.25rem' }}>Showing <strong style={{ color: C.text }}>{filtered.length}</strong> venues{search ? ` for "${search}"` : ''}</div>

            {view === 'map' ? (
              <VenueMap venues={filtered} center={[20, 0]} zoom={2} height={550} onVenueClick={v => nav(`/venue/${v.id}`)} />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
                {filtered.map(v => (
                  <div className="card" key={v.id} onClick={() => nav(`/venue/${v.id}`)}>
                    <div style={{ height: 110, background: `linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.1))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', borderRadius: '14px 14px 0 0' }}>{v.image}</div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{v.name}</div>
                        <span style={{ background: 'rgba(16,185,129,.1)', color: '#34d399', padding: '2px 7px', borderRadius: 20, fontSize: 11, fontWeight: 600, flexShrink: 0, marginLeft: 6 }}>★{v.rating}</span>
                      </div>
                      <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>📍 {v.city}, {v.country}</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                        <span className="tag">{v.type}</span>
                        <span className="tag">👥 {v.capacity.toLocaleString()}</span>
                        <span className="tag">${v.price.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569' }}>
                        <span>👁 {v.views.toLocaleString()}</span>
                        <span>💬 {v.reviews} reviews</span>
                      </div>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: C.muted }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No venues found</div>
                    <p>Try a different search or adjust your filters</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Chatbot />
    </div>
  );
}
