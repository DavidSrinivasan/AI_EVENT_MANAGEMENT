import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar, VenueMap, GlobalStyles } from '../components/shared';
import { C, venues } from '../utils';

export default function VenueSearchPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const [filters, setFilters] = useState({ type: '', country: '', maxPrice: 25000, minCapacity: 0, minRating: 0 });
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('rating');

  const filtered = venues.filter(v => {
    if (search && !`${v.name} ${v.city} ${v.country} ${v.type}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.type && v.type !== filters.type) return false;
    if (filters.country && v.country !== filters.country) return false;
    if (v.price > filters.maxPrice) return false;
    if (v.capacity < filters.minCapacity) return false;
    if (v.rating < filters.minRating) return false;
    return true;
  }).sort((a, b) => sort === 'rating' ? b.rating - a.rating : sort === 'price' ? a.price - b.price : b.views - a.views);

  const countries = [...new Set(venues.map(v => v.country))].sort();
  const types = [...new Set(venues.map(v => v.type))].sort();

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <GlobalStyles />
      <Navbar />
      <div style={{ paddingTop: 64 }}>

        {/* Search header */}
        <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border2}`, padding: '20px 4%' }}>
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.03em' }}>Find Event Venues</h1>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 240, display: 'flex', gap: 8, background: 'rgba(255,255,255,.06)', border: `1px solid ${C.border}`, borderRadius: 12, padding: 6 }}>
                <input className="inp" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by city, country, or venue name..." style={{ background: 'none', border: 'none', padding: '6px 8px', fontSize: 14 }} />
                {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 18, paddingRight: 4 }}>×</button>}
              </div>
              <select className="inp" value={sort} onChange={e => setSort(e.target.value)} style={{ width: 160, fontSize: 13 }}>
                <option value="rating">Top Rated</option>
                <option value="price">Lowest Price</option>
                <option value="views">Most Popular</option>
              </select>
              <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,.04)', border: `1px solid ${C.border2}`, borderRadius: 10, padding: 4 }}>
                {['grid', 'map'].map(v => (
                  <button key={v} onClick={() => setView(v)} style={{ padding: '7px 14px', borderRadius: 8, background: view === v ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'none', border: 'none', color: view === v ? '#fff' : C.muted, cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'inherit' }}>
                    {v === 'grid' ? 'Grid' : 'Map'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '1.5rem 4%', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Filters sidebar */}
          <div style={{ background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 18, padding: '1.5rem', position: 'sticky', top: 80 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '1.25rem' }}>Filters</div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6, fontWeight: 500 }}>Country</label>
              <select className="inp" value={filters.country} onChange={e => setFilters(p => ({ ...p, country: e.target.value }))} style={{ fontSize: 13 }}>
                <option value="">All Countries</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6, fontWeight: 500 }}>Venue Type</label>
              <select className="inp" value={filters.type} onChange={e => setFilters(p => ({ ...p, type: e.target.value }))} style={{ fontSize: 13 }}>
                <option value="">All Types</option>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6, fontWeight: 500 }}>Max Price: ${filters.maxPrice.toLocaleString()}</label>
              <input type="range" min={1000} max={25000} step={500} value={filters.maxPrice} onChange={e => setFilters(p => ({ ...p, maxPrice: Number(e.target.value) }))} style={{ width: '100%', accentColor: '#6366f1' }} />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6, fontWeight: 500 }}>Min Capacity: {filters.minCapacity.toLocaleString()}</label>
              <input type="range" min={0} max={15000} step={500} value={filters.minCapacity} onChange={e => setFilters(p => ({ ...p, minCapacity: Number(e.target.value) }))} style={{ width: '100%', accentColor: '#6366f1' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6, fontWeight: 500 }}>Min Rating: {filters.minRating}+</label>
              <input type="range" min={0} max={5} step={0.5} value={filters.minRating} onChange={e => setFilters(p => ({ ...p, minRating: Number(e.target.value) }))} style={{ width: '100%', accentColor: '#6366f1' }} />
            </div>

            <button className="btn-secondary" style={{ width: '100%', padding: '9px', fontSize: 13 }} onClick={() => setFilters({ type: '', country: '', maxPrice: 25000, minCapacity: 0, minRating: 0 })}>Reset All Filters</button>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99,102,241,.06)', borderRadius: 12, border: '1px solid rgba(99,102,241,.15)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#a5b4fc', marginBottom: 6 }}>AI Venue Search</div>
              <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>Use the IQ assistant in the navbar to describe your event and get personalized venue recommendations.</p>
            </div>
          </div>

          {/* Results */}
          <div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: '1.25rem' }}>
              Showing <strong style={{ color: C.text }}>{filtered.length}</strong> venues{search ? ` matching "${search}"` : ''}
            </div>

            {view === 'map' ? (
              <VenueMap venues={filtered} center={[20, 0]} zoom={2} height={600} onVenueClick={v => nav(`/venue/${v.id}`)} />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
                {filtered.map(v => (
                  <div key={v.id} className="card" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => nav(`/venue/${v.id}`)}>
                    <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                      <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .35s ease' }} onError={e => { e.target.parentElement.style.background='rgba(99,102,241,.1)'; e.target.style.display='none'; }} onMouseEnter={e => e.target.style.transform='scale(1.06)'} onMouseLeave={e => e.target.style.transform='scale(1)'} />
                      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(6px)', borderRadius: 20, padding: '2px 9px', fontSize: 12, fontWeight: 600, color: '#fff' }}>★ {v.rating}</div>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{v.name}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{v.city}, {v.country}</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                        <span className="tag" style={{ fontSize: 11 }}>{v.type}</span>
                        <span className="tag" style={{ fontSize: 11 }}>Cap. {v.capacity.toLocaleString()}</span>
                        <span className="tag" style={{ fontSize: 11 }}>${v.price.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569' }}>
                        <span>{v.views.toLocaleString()} views</span>
                        <span>{v.reviews} reviews</span>
                      </div>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', color: C.muted }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: .4 }}>[ ]</div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem', color: C.text }}>No venues found</div>
                    <p style={{ fontSize: 14 }}>Try a different search term or adjust your filters</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
