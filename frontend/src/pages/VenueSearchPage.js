import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar, VenueMap, GlobalStyles } from '../components/shared';
import { C, venues as localVenues } from '../utils';

// Search real world places using OpenStreetMap Nominatim (100% free, no key needed)
async function searchRealPlaces(query) {
  if (!query || query.length < 2) return [];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=10&addressdetails=1&extratags=1`,
      { headers: { 'Accept-Language': 'en', 'User-Agent': 'EventIQ-Platform/1.0' } }
    );
    const data = await res.json();
    return data.map(p => ({
      id: 'osm_' + p.place_id,
      name: p.display_name.split(',').slice(0, 2).join(',').trim(),
      fullAddress: p.display_name,
      city: p.address?.city || p.address?.town || p.address?.county || p.address?.state || '',
      country: p.address?.country || '',
      lat: parseFloat(p.lat),
      lng: parseFloat(p.lon),
      type: p.type || 'Place',
      category: p.class || '',
      image: '',
      capacity: 0,
      price: 0,
      rating: 0,
      reviews: 0,
      views: 0,
      isRealPlace: true
    }));
  } catch { return []; }
}

export default function VenueSearchPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({ type: '', country: '', maxPrice: 25000, minCapacity: 0, minRating: 0 });
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('rating');
  const [selectedPlace, setSelectedPlace] = useState(null);

  const filteredLocal = localVenues.filter(v => {
    if (filters.type && v.type !== filters.type) return false;
    if (filters.country && v.country !== filters.country) return false;
    if (v.price > filters.maxPrice) return false;
    if (v.capacity < filters.minCapacity) return false;
    if (v.rating < filters.minRating) return false;
    return true;
  }).sort((a, b) => sort === 'rating' ? b.rating - a.rating : sort === 'price' ? a.price - b.price : b.views - a.views);

  const doSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);
    setHasSearched(true);
    const results = await searchRealPlaces(search);
    setSearchResults(results);
    setSearching(false);
  };

  const displayVenues = hasSearched ? searchResults : filteredLocal;
  const countries = [...new Set(localVenues.map(v => v.country))].sort();
  const types = [...new Set(localVenues.map(v => v.type))].sort();
  const mapVenues = hasSearched ? searchResults : filteredLocal;

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <GlobalStyles />
      <Navbar />
      <div style={{ paddingTop: 64 }}>

        {/* Search header */}
        <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border2}`, padding: '20px 4%' }}>
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>Find Event Venues Worldwide</h1>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 260, display: 'flex', gap: 8, background: 'rgba(255,255,255,.06)', border: `1px solid ${C.border}`, borderRadius: 12, padding: 6 }}>
                <input
                  className="inp"
                  value={search}
                  onChange={e => { setSearch(e.target.value); if (!e.target.value) { setHasSearched(false); setSearchResults([]); } }}
                  onKeyDown={e => e.key === 'Enter' && doSearch()}
                  placeholder="Search any city, country, venue name worldwide..."
                  style={{ background: 'none', border: 'none', padding: '6px 8px', fontSize: 14, flex: 1 }}
                />
                {search && <button onClick={() => { setSearch(''); setHasSearched(false); setSearchResults([]); }} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 18, padding: '0 4px' }}>×</button>}
              </div>
              <button className="btn-primary" style={{ padding: '11px 22px', fontSize: 14 }} onClick={doSearch} disabled={searching}>
                {searching ? 'Searching...' : 'Search'}
              </button>
              <select className="inp" value={sort} onChange={e => setSort(e.target.value)} style={{ width: 160, fontSize: 13 }}>
                <option value="rating">Top Rated</option>
                <option value="price">Lowest Price</option>
                <option value="views">Most Popular</option>
              </select>
              <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,.04)', border: `1px solid ${C.border2}`, borderRadius: 10, padding: 4 }}>
                {['grid','map'].map(v => (
                  <button key={v} onClick={() => setView(v)} style={{ padding: '7px 14px', borderRadius: 8, background: view === v ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'none', border: 'none', color: view === v ? '#fff' : C.muted, cursor: 'pointer', fontSize: 13, fontWeight: view === v ? 600 : 400, fontFamily: 'inherit' }}>
                    {v === 'grid' ? 'Grid' : 'Map'}
                  </button>
                ))}
              </div>
            </div>
            {hasSearched && <div style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>Found <strong style={{ color: C.text }}>{searchResults.length}</strong> results for "<strong style={{ color: C.accent }}>{search}</strong>" from OpenStreetMap</div>}
          </div>
        </div>

        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '1.5rem 4%', display: 'grid', gridTemplateColumns: hasSearched ? '1fr' : '240px 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* Filters — only show when not searching real places */}
          {!hasSearched && (
            <div style={{ background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 18, padding: '1.5rem', position: 'sticky', top: 80 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '1.25rem' }}>Filter Venues</div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label>Country</label>
                <select className="inp" value={filters.country} onChange={e => setFilters(p => ({ ...p, country: e.target.value }))} style={{ fontSize: 13 }}>
                  <option value="">All Countries</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label>Venue Type</label>
                <select className="inp" value={filters.type} onChange={e => setFilters(p => ({ ...p, type: e.target.value }))} style={{ fontSize: 13 }}>
                  <option value="">All Types</option>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label>Max Price: ${filters.maxPrice.toLocaleString()}</label>
                <input type="range" min={1000} max={25000} step={500} value={filters.maxPrice} onChange={e => setFilters(p => ({ ...p, maxPrice: Number(e.target.value) }))} style={{ width: '100%', accentColor: '#6366f1' }} />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label>Min Capacity: {filters.minCapacity.toLocaleString()}</label>
                <input type="range" min={0} max={15000} step={500} value={filters.minCapacity} onChange={e => setFilters(p => ({ ...p, minCapacity: Number(e.target.value) }))} style={{ width: '100%', accentColor: '#6366f1' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label>Min Rating: {filters.minRating}+</label>
                <input type="range" min={0} max={5} step={0.5} value={filters.minRating} onChange={e => setFilters(p => ({ ...p, minRating: Number(e.target.value) }))} style={{ width: '100%', accentColor: '#6366f1' }} />
              </div>

              <button className="btn-secondary" style={{ width: '100%', padding: '9px', fontSize: 13 }} onClick={() => setFilters({ type: '', country: '', maxPrice: 25000, minCapacity: 0, minRating: 0 })}>Reset Filters</button>

              <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(99,102,241,.06)', borderRadius: 12, border: '1px solid rgba(99,102,241,.15)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc', marginBottom: 5 }}>Real-World Search</div>
                <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>Use the search bar above to find any venue or location worldwide using OpenStreetMap data.</p>
              </div>
            </div>
          )}

          {/* Results */}
          <div>
            {view === 'map' ? (
              <VenueMap venues={mapVenues.filter(v => v.lat && v.lng)} center={mapVenues.length > 0 ? [mapVenues[0].lat, mapVenues[0].lng] : [20,0]} zoom={mapVenues.length > 0 && hasSearched ? 12 : 2} height={600} onVenueClick={v => v.isRealPlace ? setSelectedPlace(v) : nav(`/venue/${v.id}`)} />
            ) : (
              <>
                {searching && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} style={{ background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 18, height: 240, animation: 'pulse 1.5s infinite' }} />
                    ))}
                  </div>
                )}

                {!searching && hasSearched && searchResults.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '4rem 2rem', color: C.muted }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: .4 }}>[ ]</div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: C.text, marginBottom: '0.5rem' }}>No results found</div>
                    <p style={{ fontSize: 14 }}>Try a different city, country, or venue name</p>
                  </div>
                )}

                {!searching && displayVenues.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
                    {displayVenues.map(v => (
                      <div key={v.id} className="card" style={{ overflow: 'hidden', cursor: 'pointer' }}
                        onClick={() => v.isRealPlace ? setSelectedPlace(v) : nav(`/venue/${v.id}`)}>
                        <div style={{ position: 'relative', height: 150, overflow: 'hidden', background: v.image ? 'none' : 'linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.1))' }}>
                          {v.image ? (
                            <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .35s ease' }} onError={e => { e.target.parentElement.style.background='rgba(99,102,241,.1)'; e.target.style.display='none'; }} onMouseEnter={e => e.target.style.transform='scale(1.06)'} onMouseLeave={e => e.target.style.transform='scale(1)'} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.1))' }}>
                              <div style={{ textAlign: 'center', color: C.muted }}>
                                <div style={{ fontSize: 28, marginBottom: 6 }}>📍</div>
                                <div style={{ fontSize: 11 }}>{v.category || 'Place'}</div>
                              </div>
                            </div>
                          )}
                          {v.rating > 0 && <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(6px)', borderRadius: 20, padding: '2px 9px', fontSize: 12, fontWeight: 600, color: '#fff' }}>★ {v.rating}</div>}
                        </div>
                        <div style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</div>
                          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{v.city}{v.country ? `, ${v.country}` : ''}</div>
                          {v.isRealPlace ? (
                            <div>
                              <span className="tag" style={{ fontSize: 11 }}>{v.type || 'Place'}</span>
                              <div style={{ fontSize: 11, color: C.muted, marginTop: 8, lineHeight: 1.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.fullAddress}</div>
                            </div>
                          ) : (
                            <div>
                              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
                                <span className="tag" style={{ fontSize: 11 }}>{v.type}</span>
                                <span className="tag" style={{ fontSize: 11 }}>Cap. {v.capacity.toLocaleString()}</span>
                                <span className="tag" style={{ fontSize: 11 }}>${v.price.toLocaleString()}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569' }}>
                                <span>{v.views.toLocaleString()} views</span>
                                <span>{v.reviews} reviews</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Selected real place modal */}
            {selectedPlace && (
              <div style={{ marginTop: '1.5rem', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '1.5rem', animation: 'fadeUp .3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>{selectedPlace.name}</h3>
                    <div style={{ fontSize: 13, color: C.muted }}>{selectedPlace.fullAddress}</div>
                  </div>
                  <button onClick={() => setSelectedPlace(null)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20 }}>×</button>
                </div>
                <VenueMap venues={[selectedPlace]} center={[selectedPlace.lat, selectedPlace.lng]} zoom={15} height={280} />
                <div style={{ marginTop: '1rem', display: 'flex', gap: 10 }}>
                  <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => nav(`/create-event?location=${encodeURIComponent(selectedPlace.name)}`)}>Plan Event Here</button>
                  <button className="btn-secondary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => setSelectedPlace(null)}>Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
