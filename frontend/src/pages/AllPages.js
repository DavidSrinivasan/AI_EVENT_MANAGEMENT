import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Navbar, VenueMap, GlobalStyles, getUser, setUser, logout } from '../components/shared';
import { C, venues, vendors, eventTypes } from '../utils';

/* ── Shared page styles ── */
const S = `
  .btn-primary{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s;display:inline-flex;align-items:center;justify-content:center}
  .btn-primary:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(99,102,241,.4)}
  .btn-secondary{background:rgba(255,255,255,.04);color:#94a3b8;border:1px solid rgba(255,255,255,.08);border-radius:10px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .2s;display:inline-flex;align-items:center;justify-content:center}
  .btn-secondary:hover{border-color:rgba(99,102,241,.5);color:#c7d2fe}
  .card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:18px;transition:all .3s}
  .card:hover{background:rgba(99,102,241,.05);border-color:rgba(99,102,241,.25);transform:translateY(-3px)}
  .inp{background:#0f1221;border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 14px;color:#f0f4ff;font-size:14px;font-family:inherit;outline:none;transition:all .2s;width:100%;appearance:none;-webkit-appearance:none}
  .inp:focus{border-color:rgba(99,102,241,.6);background:#131629}
  .inp option{background:#131629;color:#f0f4ff;padding:8px}
  .tag{background:rgba(99,102,241,.1);color:#a5b4fc;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:500;display:inline-block}
  label{font-size:13px;color:#64748b;display:block;margin-bottom:6px;font-weight:500}
  .sel-wrapper{position:relative}
  .sel-wrapper::after{content:'▾';position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#64748b;pointer-events:none;font-size:12px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  .fade{animation:fadeUp .4s ease}
  @media(max-width:900px){.two-col{grid-template-columns:1fr!important}}
  @media(max-width:768px){.three-col{grid-template-columns:1fr 1fr!important}.four-col{grid-template-columns:1fr 1fr!important}}
`;

function FormField({ label, children }) {
  return (
    <div>
      <label>{label}</label>
      <div className="sel-wrapper">{children}</div>
    </div>
  );
}

/* ── VENUE DETAIL ── */
export function VenueDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const venue = venues.find(v => v.id === parseInt(id)) || venues[0];
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem('savedVenues') || '[]').includes(venue.id));
  const [reviews, setReviews] = useState([
    { name: 'Sarah K.', rating: 5, text: 'Outstanding facilities and excellent staff. Our conference ran flawlessly.' },
    { name: 'Michael T.', rating: 4, text: 'Great venue, perfect location. Catering could be slightly improved.' },
    { name: 'Priya R.', rating: 5, text: 'Used this for our product launch. Everything was seamless and professional.' },
  ]);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);

  const toggleSave = () => {
    const list = JSON.parse(localStorage.getItem('savedVenues') || '[]');
    const updated = saved ? list.filter(i => i !== venue.id) : [...list, venue.id];
    localStorage.setItem('savedVenues', JSON.stringify(updated));
    setSaved(!saved);
  };

  const venueVendors = vendors.filter(v => v.cities.includes(venue.city));
  const nearby = venues.filter(v => v.id !== venue.id && v.country === venue.country).slice(0, 3);

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <style>{S}</style><GlobalStyles />
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        <div style={{ height: 300, overflow: 'hidden', position: 'relative' }}>
          <img src={venue.image} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.parentElement.style.background='rgba(99,102,241,.15)'; e.target.style.display='none'; }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(5,6,15,1) 0%,rgba(5,6,15,.2) 60%,transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: '2rem', left: '4%' }}>
            <h1 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8 }}>{venue.name}</h1>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', fontSize: 14, color: C.muted2 }}>
              <span>{venue.city}, {venue.country}</span>
              <span style={{ background: 'rgba(16,185,129,.2)', color: '#34d399', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>★ {venue.rating}</span>
              <span>{venue.views.toLocaleString()} views</span>
              <span>{venue.reviews} reviews</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 4%' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: '2rem', flexWrap: 'wrap' }}>
            <button className="btn-secondary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={toggleSave}>{saved ? 'Saved' : 'Save Venue'}</button>
            <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => nav('/create-event')}>Book This Venue</button>
          </div>

          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
            <div>
              <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {[['Capacity', venue.capacity.toLocaleString() + ' guests'], ['Starting Price', '$' + venue.price.toLocaleString()], ['Venue Type', venue.type]].map(([l, v]) => (
                  <div key={l} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{l}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{v}</div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>About This Venue</h3>
                <p style={{ color: C.muted, lineHeight: 1.75, fontSize: 14 }}>{venue.description}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: '1.25rem' }}>
                  {venue.amenities.map(a => <span key={a} className="tag" style={{ padding: '5px 12px', fontSize: 12 }}>{a}</span>)}
                </div>
              </div>

              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Location</h3>
                <VenueMap venues={[venue]} center={[venue.lat, venue.lng]} zoom={14} height={280} />
              </div>

              {venueVendors.length > 0 && (
                <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Vendors in {venue.city}</h3>
                    <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => nav('/vendors')}>View All</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
                    {venueVendors.slice(0, 4).map(v => (
                      <div key={v.id} style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${C.border2}`, borderRadius: 14, overflow: 'hidden' }}>
                        <img src={v.image} alt={v.name} style={{ width: '100%', height: 80, objectFit: 'cover' }} onError={e => { e.target.parentElement.style.background='rgba(99,102,241,.1)'; e.target.style.display='none'; }} />
                        <div style={{ padding: '0.75rem' }}>
                          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{v.name}</div>
                          <span className="tag" style={{ fontSize: 11 }}>{v.service}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Reviews ({reviews.length})</h3>
                {reviews.map((r, i) => (
                  <div key={i} style={{ padding: '0.875rem 0', borderBottom: i < reviews.length - 1 ? `1px solid ${C.border2}` : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</span>
                      <span style={{ color: '#fbbf24', fontSize: 13 }}>{'★'.repeat(r.rating)}</span>
                    </div>
                    <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{r.text}</p>
                  </div>
                ))}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${C.border2}` }}>
                  <h4 style={{ fontWeight: 600, fontSize: 14, marginBottom: '0.75rem' }}>Write a Review</h4>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                    {[1,2,3,4,5].map(s => <span key={s} onClick={() => setRating(s)} style={{ fontSize: '1.5rem', cursor: 'pointer', color: s <= rating ? '#fbbf24' : C.muted, transition: 'color .15s' }}>★</span>)}
                  </div>
                  <textarea className="inp" value={review} onChange={e => setReview(e.target.value)} placeholder="Share your experience..." rows={3} style={{ marginBottom: 10, resize: 'vertical' }} />
                  <button className="btn-primary" style={{ padding: '9px 20px', fontSize: 14 }} onClick={() => { if (review.trim()) { setReviews(p => [{ name: 'You', rating, text: review }, ...p]); setReview(''); } }}>Submit Review</button>
                </div>
              </div>
            </div>

            <div>
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem', position: 'sticky', top: 80 }}>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: C.accent, marginBottom: 4 }}>${venue.price.toLocaleString()}</div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: '1.25rem' }}>Starting price per event</div>
                <button className="btn-primary" style={{ width: '100%', padding: '13px', fontSize: 15, marginBottom: 10 }} onClick={() => nav('/create-event')}>Book This Venue</button>
                <button className="btn-secondary" style={{ width: '100%', padding: '11px', fontSize: 14 }} onClick={toggleSave}>{saved ? 'Remove from Saved' : 'Save for Later'}</button>
              </div>
              {nearby.length > 0 && (
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>Similar Venues</h3>
                  {nearby.map((v, i) => (
                    <div key={v.id} onClick={() => nav(`/venue/${v.id}`)} style={{ display: 'flex', gap: 10, padding: '0.75rem 0', borderBottom: i < nearby.length - 1 ? `1px solid ${C.border2}` : 'none', cursor: 'pointer' }}>
                      <img src={v.image} alt={v.name} style={{ width: 52, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} onError={e => { e.target.style.display='none'; }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{v.name}</div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>★{v.rating} · ${v.price.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── CREATE EVENT — venues filtered by location ── */
export function CreateEventPage() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    type: '',
    date: '',
    time: '',
    location: searchParams.get('location') || '',
    attendees: '',
    budget: '',
    notes: ''
  });
  const [recs, setRecs] = useState([]);
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Choose and confirm venue', done: false },
    { id: 2, text: 'Set and allocate event budget', done: false },
    { id: 3, text: 'Send invitations to attendees', done: false },
    { id: 4, text: 'Arrange catering services', done: false },
    { id: 5, text: 'Book AV and technical equipment', done: false },
    { id: 6, text: 'Confirm speakers or performers', done: false },
    { id: 7, text: 'Arrange security personnel', done: false },
    { id: 8, text: 'Create and publish event page', done: false },
    { id: 9, text: 'Send reminder 1 week before event', done: false },
    { id: 10, text: 'Prepare day-of schedule', done: false },
  ]);

  const up = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const step1Valid = form.name && form.type && form.attendees && form.budget;

  const getRecommendations = () => {
    const cap = parseInt(form.attendees) || 0;
    const bud = parseInt(form.budget) || 99999;
    const loc = form.location.toLowerCase().trim();

    // Filter by location first — match city or country
    let filtered = venues.filter(v => {
      const matchCap = v.capacity >= cap;
      const matchBud = v.price <= bud;
      const matchLoc = !loc || v.city.toLowerCase().includes(loc) || v.country.toLowerCase().includes(loc) || loc.includes(v.city.toLowerCase()) || loc.includes(v.country.toLowerCase());
      return matchCap && matchBud && matchLoc;
    }).sort((a, b) => b.rating - a.rating);

    // If no location match, show all matching budget/capacity
    if (filtered.length === 0 && loc) {
      filtered = venues.filter(v => v.capacity >= cap && v.price <= bud).sort((a, b) => b.rating - a.rating);
    }

    setRecs(filtered.slice(0, 6));

    // Save to dashboard events
    const events = JSON.parse(localStorage.getItem('eq_events') || '[]');
    const newEvent = {
      id: Date.now(),
      name: form.name,
      type: form.type,
      date: form.date,
      location: form.location,
      attendees: parseInt(form.attendees) || 0,
      budget: parseInt(form.budget) || 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
      revenue: Math.round(parseInt(form.attendees || 0) * (parseInt(form.budget || 0) / (parseInt(form.attendees || 1)) * 1.4))
    };
    localStorage.setItem('eq_events', JSON.stringify([newEvent, ...events]));
    setStep(2);
  };

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <style>{S}</style><GlobalStyles />
      <Navbar />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '90px 4% 4rem' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Create Event</h1>
        <p style={{ color: C.muted, marginBottom: '2.5rem', fontSize: 14 }}>Fill in your details and get AI-matched venue recommendations.</p>

        {/* Progress steps */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '2rem' }}>
          {['Event Details', 'Venue Recommendations', 'Planning Checklist'].map((s, i) => (
            <div key={s} onClick={() => step > i + 1 && setStep(i + 1)} style={{ flex: 1, padding: '10px 12px', borderRadius: 10, background: step === i + 1 ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : step > i + 1 ? 'rgba(99,102,241,.12)' : 'rgba(255,255,255,.03)', border: step === i + 1 ? 'none' : `1px solid ${C.border2}`, fontSize: 12, fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? '#fff' : step > i + 1 ? '#a5b4fc' : C.muted, textAlign: 'center', cursor: step > i + 1 ? 'pointer' : 'default', transition: 'all .2s' }}>
              {step > i + 1 ? '✓ ' : `${i + 1}. `}{s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="card fade" style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label>Event Name *</label>
                <input className="inp" value={form.name} onChange={e => up('name', e.target.value)} placeholder="e.g. Annual Tech Conference 2025" />
              </div>
              <div>
                <label>Event Type *</label>
                <div className="sel-wrapper">
                  <select className="inp" value={form.type} onChange={e => up('type', e.target.value)}>
                    <option value="">Select event type...</option>
                    {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label>Location / City *</label>
                <input className="inp" value={form.location} onChange={e => up('location', e.target.value)} placeholder="e.g. Singapore, Dubai, London" />
              </div>
              <div>
                <label>Event Date</label>
                <input className="inp" type="date" value={form.date} onChange={e => up('date', e.target.value)} />
              </div>
              <div>
                <label>Expected Attendees *</label>
                <input className="inp" type="number" value={form.attendees} onChange={e => up('attendees', e.target.value)} placeholder="e.g. 500" />
              </div>
              <div>
                <label>Budget (USD) *</label>
                <input className="inp" type="number" value={form.budget} onChange={e => up('budget', e.target.value)} placeholder="e.g. 10000" />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label>Additional Notes</label>
                <textarea className="inp" value={form.notes} onChange={e => up('notes', e.target.value)} placeholder="Special requirements, preferences..." rows={2} style={{ resize: 'vertical' }} />
              </div>
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '13px', fontSize: 15 }} onClick={getRecommendations} disabled={!step1Valid}>
              Get AI Venue Recommendations
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="fade">
            <div style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.2)', borderRadius: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#a5b4fc', marginBottom: 4 }}>AI Recommendations for: {form.name}</div>
              <div style={{ fontSize: 13, color: C.muted }}>
                {form.location ? `Venues in or near ${form.location}` : 'All venues'} · {form.attendees} attendees · ${parseInt(form.budget || 0).toLocaleString()} budget
                {recs.length > 0 && recs[0].city && form.location && !form.location.toLowerCase().includes(recs[0].city.toLowerCase()) && (
                  <span style={{ color: C.amber, marginLeft: 8 }}>· No exact match — showing nearest alternatives</span>
                )}
              </div>
            </div>

            {recs.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {recs.map((v, i) => (
                  <div key={v.id} className="card" style={{ overflow: 'hidden', cursor: 'pointer', position: 'relative' }} onClick={() => nav(`/venue/${v.id}`)}>
                    {i === 0 && <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 12px', borderRadius: 20, zIndex: 1, whiteSpace: 'nowrap' }}>Best Match</div>}
                    <img src={v.image} alt={v.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} onError={e => { e.target.parentElement.style.background='rgba(99,102,241,.1)'; e.target.style.display='none'; }} />
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 3 }}>{v.name}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{v.city}, {v.country}</div>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        <span className="tag" style={{ fontSize: 10 }}>★{v.rating}</span>
                        <span className="tag" style={{ fontSize: 10 }}>Cap. {v.capacity.toLocaleString()}</span>
                        <span className="tag" style={{ fontSize: 10 }}>${v.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No matching venues</div>
                <p style={{ color: C.muted, fontSize: 14 }}>Try increasing your budget or reducing attendee count</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" style={{ padding: '11px 22px', fontSize: 14 }} onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary" style={{ padding: '11px 22px', fontSize: 14, flex: 1 }} onClick={() => setStep(3)}>Continue to Checklist</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade">
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Event Planning Checklist</h3>
                <span style={{ fontSize: 13, color: C.accent }}>{checklist.filter(i => i.done).length}/{checklist.length} done</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2, marginBottom: '1.25rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(checklist.filter(i => i.done).length / checklist.length) * 100}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 2, transition: 'width .3s' }} />
              </div>
              {checklist.map(item => (
                <div key={item.id} onClick={() => setChecklist(p => p.map(i => i.id === item.id ? { ...i, done: !i.done } : i))} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: `1px solid ${C.border2}`, cursor: 'pointer' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${item.done ? '#6366f1' : 'rgba(255,255,255,.2)'}`, background: item.done ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', flexShrink: 0, transition: 'all .2s' }}>{item.done ? '✓' : ''}</div>
                  <span style={{ fontSize: 14, color: item.done ? C.muted : C.text, textDecoration: item.done ? 'line-through' : 'none', transition: 'all .2s' }}>{item.text}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" style={{ padding: '11px 22px', fontSize: 14 }} onClick={() => setStep(2)}>Back</button>
              <button className="btn-primary" style={{ padding: '11px 22px', fontSize: 14, flex: 1 }} onClick={() => nav('/dashboard')}>Go to Dashboard</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── REAL-TIME DASHBOARD ── */
export function DashboardPage() {
  const nav = useNavigate();
  const [events, setEvents] = useState([]);
  const [refreshed, setRefreshed] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const load = () => {
      const stored = JSON.parse(localStorage.getItem('eq_events') || '[]');
      setEvents(stored);
      setRefreshed(new Date().toLocaleTimeString());
    };
    load();
    const interval = setInterval(load, 10000); // refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const totalBudget = events.reduce((s, e) => s + (e.budget || 0), 0);
  const totalAttendees = events.reduce((s, e) => s + (e.attendees || 0), 0);
  const totalRevenue = events.reduce((s, e) => s + (e.revenue || 0), 0);
  const totalSpent = Math.round(totalBudget * 0.65);
  const roi = totalSpent > 0 ? Math.round(((totalRevenue - totalSpent) / totalSpent) * 100) : 0;

  const maxBudget = Math.max(...events.map(e => e.budget || 0), 1);

  const deleteEvent = (id) => {
    const updated = events.filter(e => e.id !== id);
    localStorage.setItem('eq_events', JSON.stringify(updated));
    setEvents(updated);
  };

  const toggleStatus = (id) => {
    const updated = events.map(e => e.id === id ? { ...e, status: e.status === 'draft' ? 'upcoming' : e.status === 'upcoming' ? 'completed' : 'draft' } : e);
    localStorage.setItem('eq_events', JSON.stringify(updated));
    setEvents(updated);
  };

  const breakdown = [
    { l: 'Venue', pct: 46, c: '#6366f1' },
    { l: 'Catering', pct: 28, c: '#8b5cf6' },
    { l: 'Marketing', pct: 13, c: '#06b6d4' },
    { l: 'AV & Tech', pct: 9, c: '#10b981' },
    { l: 'Staff', pct: 4, c: '#f59e0b' },
  ];

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <style>{S}</style><GlobalStyles />
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '90px 4% 4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>Analytics Dashboard</h1>
            <p style={{ color: C.muted, fontSize: 13 }}>Live data from your events · Last updated: {refreshed}</p>
          </div>
          <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => nav('/create-event')}>+ New Event</button>
        </div>

        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,.02)', border: `1px solid ${C.border2}`, borderRadius: 20 }}>
            <div style={{ fontSize: 40, marginBottom: '1rem', opacity: .3 }}>[ ]</div>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.75rem' }}>No events yet</div>
            <p style={{ color: C.muted, marginBottom: '1.5rem' }}>Create your first event to see real-time analytics here</p>
            <button className="btn-primary" style={{ padding: '12px 24px', fontSize: 15 }} onClick={() => nav('/create-event')}>Create First Event</button>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="four-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[
                ['Total Budget', `$${totalBudget.toLocaleString()}`, `${events.length} event${events.length !== 1 ? 's' : ''}`, C.accent],
                ['Total Spent', `$${totalSpent.toLocaleString()}`, `${totalBudget > 0 ? Math.round((totalSpent/totalBudget)*100) : 0}% of budget`, C.amber],
                ['Projected Revenue', `$${totalRevenue.toLocaleString()}`, `ROI: ${roi}%`, C.green],
                ['Total Attendees', totalAttendees.toLocaleString(), 'Across all events', C.accent3],
              ].map(([l, v, ch, col]) => (
                <div key={l} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{l}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>{v}</div>
                  <div style={{ fontSize: 12, color: col }}>{ch}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {/* Event budget chart */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.5rem' }}>Budget by Event</div>
                {events.length > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 150, marginBottom: 8 }}>
                    {events.slice(0, 6).map((e, i) => (
                      <div key={e.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ fontSize: 10, color: C.muted }}>${Math.round((e.budget||0)/1000)}k</div>
                        <div style={{ width: '100%', background: i % 2 === 0 ? 'linear-gradient(180deg,#6366f1,rgba(99,102,241,.3))' : 'linear-gradient(180deg,#8b5cf6,rgba(139,92,246,.3))', borderRadius: '6px 6px 0 0', height: `${Math.max(((e.budget||0) / maxBudget) * 130, 8)}px`, transition: 'height .5s ease', cursor: 'pointer' }} title={e.name} />
                        <div style={{ fontSize: 10, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{e.name.split(' ')[0]}</div>
                      </div>
                    ))}
                  </div>
                ) : <div style={{ color: C.muted, fontSize: 14, textAlign: 'center', padding: '2rem' }}>No data yet</div>}
              </div>

              {/* Budget distribution */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem' }}>Typical Budget Distribution</div>
                {breakdown.map(d => (
                  <div key={d.l} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                      <span style={{ color: C.muted2 }}>{d.l}</span>
                      <span style={{ fontWeight: 600 }}>{d.pct}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${d.pct}%`, background: d.c, borderRadius: 3, transition: 'width .6s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROI Summary */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg,rgba(99,102,241,.06),rgba(139,92,246,.06))', border: '1px solid rgba(99,102,241,.2)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem', textAlign: 'center' }}>
                {[['Total Investment', `$${totalSpent.toLocaleString()}`, C.amber], ['Projected Revenue', `$${totalRevenue.toLocaleString()}`, C.green], ['Expected ROI', `${roi}%`, C.accent]].map(([l, v, c]) => (
                  <div key={l}>
                    <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>{l}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: c, letterSpacing: '-0.02em' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events table */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem' }}>Your Events ({events.length})</div>
              {events.map((e, i) => (
                <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: i < events.length - 1 ? `1px solid ${C.border2}` : 'none', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{e.name}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{e.type} · {e.location} · {e.attendees} attendees · {e.date || 'TBD'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.green }}>${(e.budget||0).toLocaleString()}</span>
                    <span onClick={() => toggleStatus(e.id)} style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: e.status === 'upcoming' ? 'rgba(99,102,241,.12)' : e.status === 'completed' ? 'rgba(16,185,129,.12)' : 'rgba(245,158,11,.12)', color: e.status === 'upcoming' ? '#a5b4fc' : e.status === 'completed' ? '#34d399' : '#fbbf24' }}>{e.status}</span>
                    <button onClick={() => deleteEvent(e.id)} style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 8, padding: '4px 10px', fontSize: 12, color: '#f87171', cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── VENDORS ── */
export function VendorsPage() {
  const [filter, setFilter] = useState('');
  const services = [...new Set(vendors.map(v => v.service))];
  const filtered = filter ? vendors.filter(v => v.service === filter) : vendors;

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <style>{S}</style><GlobalStyles />
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '90px 4% 4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.15em', color: C.accent, marginBottom: '0.5rem' }}>Vendor Network</div>
          <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>Event Vendors & Services</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => setFilter('')} className={filter === '' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '7px 16px', fontSize: 13 }}>All</button>
            {services.map(s => <button key={s} onClick={() => setFilter(s)} className={filter === s ? 'btn-primary' : 'btn-secondary'} style={{ padding: '7px 16px', fontSize: 13 }}>{s}</button>)}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.5rem' }}>
          {filtered.map(v => (
            <div key={v.id} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ height: 170, overflow: 'hidden' }}>
                <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .35s' }} onError={e => { e.target.parentElement.style.background='rgba(99,102,241,.1)'; e.target.style.display='none'; }} onMouseEnter={e => e.target.style.transform='scale(1.06)'} onMouseLeave={e => e.target.style.transform='scale(1)'} />
              </div>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{v.name}</div>
                  <span style={{ background: 'rgba(16,185,129,.1)', color: '#34d399', padding: '2px 8px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>★ {v.rating}</span>
                </div>
                <span className="tag" style={{ fontSize: 11, marginBottom: 8, display: 'inline-block' }}>{v.service}</span>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 10, marginTop: 6 }}>{v.description}</p>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Price: <strong style={{ color: C.text }}>{v.price}</strong></div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Cities: <strong style={{ color: C.text }}>{v.cities.slice(0,3).join(', ')}</strong></div>
                <button className="btn-primary" style={{ width: '100%', padding: '9px', fontSize: 13 }}>Contact Vendor</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── PROFILE ── */
export function ProfilePage() {
  const nav = useNavigate();
  const savedIds = JSON.parse(localStorage.getItem('savedVenues') || '[]');
  const savedList = venues.filter(v => savedIds.includes(v.id));
  const [tab, setTab] = useState('saved');
  const user = getUser();

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <style>{S}</style><GlobalStyles />
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '90px 4% 4rem' }}>
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            {user ? user.name[0].toUpperCase() : 'G'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>{user ? user.name : 'Guest User'}</div>
            <div style={{ color: C.muted, fontSize: 14 }}>{user ? user.email : 'Sign in to save your preferences'}</div>
          </div>
          {!user ? (
            <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => nav('/auth')}>Sign In</button>
          ) : (
            <button className="btn-secondary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => { logout(); window.location.reload(); }}>Sign Out</button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,.03)', border: `1px solid ${C.border2}`, borderRadius: 14, padding: 4, marginBottom: '2rem' }}>
          {[['saved', 'Saved Venues'], ['events', 'My Events'], ['history', 'Activity']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: '10px', borderRadius: 10, background: tab === k ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'none', border: 'none', color: tab === k ? '#fff' : C.muted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: tab === k ? 700 : 400, transition: 'all .2s' }}>{l}</button>
          ))}
        </div>

        {tab === 'saved' && (
          savedList.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.25rem' }}>
              {savedList.map(v => (
                <div key={v.id} className="card" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => nav(`/venue/${v.id}`)}>
                  <img src={v.image} alt={v.name} style={{ width: '100%', height: 110, objectFit: 'cover' }} onError={e => { e.target.parentElement.style.background='rgba(99,102,241,.1)'; e.target.style.display='none'; }} />
                  <div style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{v.name}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{v.city}, {v.country} · ★{v.rating}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card fade" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No saved venues yet</div>
              <button className="btn-primary" style={{ padding: '10px 22px', fontSize: 14, marginTop: 12 }} onClick={() => nav('/venues')}>Find Venues</button>
            </div>
          )
        )}

        {tab === 'events' && (
          <div className="card fade" style={{ padding: '1.5rem' }}>
            {JSON.parse(localStorage.getItem('eq_events') || '[]').map((e, i, arr) => (
              <div key={e.id} style={{ padding: '0.875rem 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.border2}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{e.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{e.type} · {e.location}</div>
                </div>
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: e.status === 'upcoming' ? 'rgba(99,102,241,.12)' : 'rgba(245,158,11,.12)', color: e.status === 'upcoming' ? '#a5b4fc' : '#fbbf24' }}>{e.status}</span>
              </div>
            ))}
            {JSON.parse(localStorage.getItem('eq_events') || '[]').length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: C.muted }}>
                <p style={{ marginBottom: 12 }}>No events created yet</p>
                <button className="btn-primary" style={{ padding: '10px 22px', fontSize: 14 }} onClick={() => nav('/create-event')}>Create First Event</button>
              </div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className="card fade" style={{ padding: '1.5rem' }}>
            {[['Searched for venues in Singapore', '2 hours ago'], ['Viewed Marina Bay Sands', '3 hours ago'], ['Saved ICC Sydney', 'Yesterday'], ['Created Tech Summit 2025', '2 days ago']].map(([tx, ti]) => (
              <div key={tx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: `1px solid ${C.border2}`, flexWrap: 'wrap', gap: 6 }}>
                <span style={{ fontSize: 14 }}>{tx}</span>
                <span style={{ fontSize: 12, color: C.muted }}>{ti}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── AUTH ── */
export function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError('');
    if (!form.email || !form.password) { setError('Email and password are required.'); return; }
    if (mode === 'register' && !form.name) { setError('Please enter your name.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simulate API call
    if (mode === 'register') {
      const user = { name: form.name, email: form.email, phone: form.phone, joinedAt: new Date().toLocaleDateString() };
      setUser(user);
    } else {
      const stored = getUser();
      if (stored && stored.email === form.email) {
        setUser(stored);
      } else {
        const user = { name: form.email.split('@')[0], email: form.email, joinedAt: new Date().toLocaleDateString() };
        setUser(user);
      }
    }
    setLoading(false);
    nav('/');
  };

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <style>{S}</style><GlobalStyles />
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.5rem', cursor: 'pointer' }} onClick={() => nav('/')}>
            Event<span style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IQ</span>
          </div>
          <p style={{ color: C.muted, fontSize: 14 }}>{mode === 'login' ? 'Sign in to your account' : 'Create a free account'}</p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 20, padding: '2rem' }}>
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,.03)', borderRadius: 12, padding: 4, marginBottom: '1.75rem' }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }} style={{ flex: 1, padding: '10px', borderRadius: 10, background: mode === m ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'none', border: 'none', color: mode === m ? '#fff' : C.muted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: mode === m ? 700 : 400, transition: 'all .2s' }}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'register' && (
              <div>
                <label>Full Name *</label>
                <input className="inp" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" />
              </div>
            )}
            <div>
              <label>Email Address *</label>
              <input className="inp" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" />
            </div>
            {mode === 'register' && (
              <div>
                <label>Phone Number</label>
                <input className="inp" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 234 567 8900" />
              </div>
            )}
            <div>
              <label>Password *</label>
              <input className="inp" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Enter password" />
            </div>

            {error && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 10, fontSize: 13, color: '#f87171' }}>{error}</div>}

            <button className="btn-primary" style={{ padding: '13px', fontSize: 15, marginTop: 4, opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center', fontSize: 13, color: C.muted }}>
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ color: '#a5b4fc', cursor: 'pointer', fontWeight: 600 }}>
                {mode === 'login' ? 'Register free' : 'Sign in'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
