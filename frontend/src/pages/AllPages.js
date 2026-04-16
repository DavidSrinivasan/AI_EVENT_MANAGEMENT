import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar, VenueMap, GlobalStyles } from '../components/shared';
import { C, venues, vendors, eventTypes } from '../utils';

const S = `
  .btn-primary{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s}
  .btn-primary:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(99,102,241,.4)}
  .btn-secondary{background:rgba(255,255,255,.05);color:#94a3b8;border:1px solid rgba(255,255,255,.08);border-radius:10px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .2s}
  .btn-secondary:hover{border-color:rgba(99,102,241,.5);color:#c7d2fe}
  .card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:18px;transition:all .3s}
  .card:hover{background:rgba(99,102,241,.05);border-color:rgba(99,102,241,.3);transform:translateY(-3px)}
  .inp{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:10px 14px;color:#f0f4ff;font-size:14px;font-family:inherit;outline:none;transition:border-color .2s;width:100%}
  .inp:focus{border-color:rgba(99,102,241,.6)}
  .tag{background:rgba(99,102,241,.1);color:#a5b4fc;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:500;display:inline-block}
  label{font-size:13px;color:#64748b;display:block;margin-bottom:6px;font-weight:500}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  .fade{animation:fadeUp .45s ease}
  @media(max-width:900px){.two-col{grid-template-columns:1fr!important}}
  @media(max-width:768px){.three-col{grid-template-columns:1fr 1fr!important}.four-col{grid-template-columns:1fr 1fr!important}}
`;

/* ── VENUE DETAIL ── */
export function VenueDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const venue = venues.find(v => v.id === parseInt(id)) || venues[0];
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem('savedVenues') || '[]').includes(venue.id));
  const [reviews, setReviews] = useState([
    { name: 'Sarah K.', rating: 5, text: 'Outstanding facilities and excellent staff. Our conference ran flawlessly.' },
    { name: 'Michael T.', rating: 4, text: 'Great venue, perfect location. The catering could be improved slightly.' },
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
        {/* Hero image */}
        <div style={{ height: 320, overflow: 'hidden', position: 'relative' }}>
          <img src={venue.image} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.parentElement.style.background='rgba(99,102,241,.15)'; e.target.style.display='none'; }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,6,15,1) 0%, rgba(5,6,15,.3) 60%, transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: '2rem', left: '4%', right: '4%', maxWidth: 1200, margin: '0 auto' }}>
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
          {/* Action bar */}
          <div style={{ display: 'flex', gap: 10, marginBottom: '2rem', flexWrap: 'wrap' }}>
            <button className="btn-secondary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={toggleSave}>{saved ? 'Saved' : 'Save Venue'}</button>
            <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => nav('/create-event')}>Book This Venue</button>
          </div>

          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
            <div>
              {/* Info cards */}
              <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {[['Capacity', venue.capacity.toLocaleString() + ' guests'], ['Starting Price', '$' + venue.price.toLocaleString()], ['Venue Type', venue.type]].map(([l, v]) => (
                  <div key={l} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{l}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>About This Venue</h3>
                <p style={{ color: C.muted, lineHeight: 1.75, fontSize: 14 }}>{venue.description}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: '1.25rem' }}>
                  {venue.amenities.map(a => <span key={a} className="tag" style={{ padding: '5px 12px', fontSize: 12 }}>{a}</span>)}
                </div>
              </div>

              {/* Venue Map */}
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Location</h3>
                <VenueMap venues={[venue]} center={[venue.lat, venue.lng]} zoom={14} height={300} />
              </div>

              {/* Vendors at this venue */}
              {venueVendors.length > 0 && (
                <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Vendors in {venue.city}</h3>
                    <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => nav('/vendors')}>View All Vendors</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1rem' }}>
                    {venueVendors.slice(0, 4).map(v => (
                      <div key={v.id} style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${C.border2}`, borderRadius: 14, overflow: 'hidden' }}>
                        <img src={v.image} alt={v.name} style={{ width: '100%', height: 90, objectFit: 'cover' }} onError={e => { e.target.parentElement.style.background='rgba(99,102,241,.1)'; e.target.style.display='none'; }} />
                        <div style={{ padding: '0.875rem' }}>
                          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{v.name}</div>
                          <div className="tag" style={{ fontSize: 11 }}>{v.service}</div>
                          <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>{v.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
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
                  <textarea className="inp" value={review} onChange={e => setReview(e.target.value)} placeholder="Share your experience with this venue..." rows={3} style={{ marginBottom: 10, resize: 'vertical' }} />
                  <button className="btn-primary" style={{ padding: '9px 20px', fontSize: 14 }} onClick={() => { if (review.trim()) { setReviews(p => [{ name: 'You', rating, text: review }, ...p]); setReview(''); } }}>Submit Review</button>
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div>
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem', position: 'sticky', top: 80 }}>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: C.accent, marginBottom: 4 }}>${venue.price.toLocaleString()}</div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: '1.25rem' }}>Starting price per event</div>
                <button className="btn-primary" style={{ width: '100%', padding: '13px', fontSize: 15, marginBottom: 10 }} onClick={() => nav('/create-event')}>Book This Venue</button>
                <button className="btn-secondary" style={{ width: '100%', padding: '11px', fontSize: 14 }} onClick={toggleSave}>{saved ? 'Remove from Saved' : 'Save for Later'}</button>
                <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(99,102,241,.06)', borderRadius: 12, border: '1px solid rgba(99,102,241,.15)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc', marginBottom: 6 }}>AI Tip</div>
                  <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>This venue is popular for {venue.type.toLowerCase()} events. Book 3+ months in advance for best availability and rates.</p>
                </div>
              </div>

              {nearby.length > 0 && (
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>Similar Venues in {venue.country}</h3>
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

/* ── CREATE EVENT ── */
export function CreateEventPage() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', type: '', date: '', time: '', location: '', attendees: '', budget: '', notes: '' });
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
    { id: 10, text: 'Prepare day-of event schedule', done: false },
  ]);

  const up = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const step1Valid = form.name && form.type && form.attendees && form.budget;

  const getRecommendations = () => {
    const cap = parseInt(form.attendees) || 0;
    const bud = parseInt(form.budget) || 99999;
    const filtered = venues.filter(v => v.capacity >= cap && v.price <= bud)
      .sort((a, b) => b.rating - a.rating).slice(0, 4);
    setRecs(filtered);
    setStep(2);
  };

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <style>{S}</style><GlobalStyles />
      <Navbar />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '90px 4% 4rem' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Create Event</h1>
        <p style={{ color: C.muted, marginBottom: '2.5rem', fontSize: 14 }}>Fill in your event details and get AI-powered venue recommendations.</p>

        {/* Steps */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '2rem' }}>
          {['Event Details', 'Venue Recommendations', 'Planning Checklist'].map((s, i) => (
            <div key={s} onClick={() => step > i + 1 && setStep(i + 1)} style={{ flex: 1, padding: '10px 12px', borderRadius: 10, background: step === i + 1 ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : step > i + 1 ? 'rgba(99,102,241,.12)' : 'rgba(255,255,255,.03)', border: step === i + 1 ? 'none' : `1px solid ${C.border2}`, fontSize: 12, fontWeight: step === i + 1 ? 700 : 500, color: step === i + 1 ? '#fff' : step > i + 1 ? '#a5b4fc' : C.muted, textAlign: 'center', cursor: step > i + 1 ? 'pointer' : 'default', transition: 'all .2s' }}>
              {step > i + 1 ? '✓ ' : `${i + 1}. `}{s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="card fade" style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              {[['name','Event Name','e.g. Annual Tech Conference 2025'], ['location','City / Location','e.g. Singapore, Dubai, London']].map(([k, l, p]) => (
                <div key={k}><label>{l} *</label><input className="inp" value={form[k]} onChange={e => up(k, e.target.value)} placeholder={p} /></div>
              ))}
              <div>
                <label>Event Type *</label>
                <select className="inp" value={form.type} onChange={e => up('type', e.target.value)}>
                  <option value="">Select event type...</option>
                  {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div><label>Event Date *</label><input className="inp" type="date" value={form.date} onChange={e => up('date', e.target.value)} /></div>
              <div><label>Expected Attendees *</label><input className="inp" type="number" value={form.attendees} onChange={e => up('attendees', e.target.value)} placeholder="e.g. 500" /></div>
              <div><label>Budget (USD) *</label><input className="inp" type="number" value={form.budget} onChange={e => up('budget', e.target.value)} placeholder="e.g. 10000" /></div>
              <div style={{ gridColumn: '1/-1' }}><label>Additional Notes</label><textarea className="inp" value={form.notes} onChange={e => up('notes', e.target.value)} placeholder="Special requirements, preferences..." rows={2} style={{ resize: 'vertical' }} /></div>
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '13px', fontSize: 15 }} onClick={getRecommendations} disabled={!step1Valid}>
              Get AI Venue Recommendations
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="fade">
            <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.2)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#a5b4fc', marginBottom: 3 }}>AI Recommendations for: {form.name}</div>
              <p style={{ fontSize: 13, color: C.muted }}>{form.attendees} attendees · ${parseInt(form.budget || 0).toLocaleString()} budget · {form.type}</p>
            </div>
            {recs.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {recs.map((v, i) => (
                  <div key={v.id} className="card" style={{ overflow: 'hidden', cursor: 'pointer', position: 'relative' }} onClick={() => nav(`/venue/${v.id}`)}>
                    {i === 0 && <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 12px', borderRadius: 20, zIndex: 1, whiteSpace: 'nowrap' }}>Best Match</div>}
                    <img src={v.image} alt={v.name} style={{ width: '100%', height: 130, objectFit: 'cover' }} onError={e => { e.target.parentElement.style.background='rgba(99,102,241,.1)'; e.target.style.display='none'; }} />
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{v.name}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{v.city}, {v.country}</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span className="tag" style={{ fontSize: 11 }}>★{v.rating}</span>
                        <span className="tag" style={{ fontSize: 11 }}>Cap. {v.capacity.toLocaleString()}</span>
                        <span className="tag" style={{ fontSize: 11 }}>${v.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No matching venues found</div>
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

/* ── DASHBOARD ── */
export function DashboardPage() {
  const nav = useNavigate();
  const budget = 15000, spent = 9800, revenue = 22000;
  const roi = Math.round(((revenue - spent) / spent) * 100);
  const maxRev = 15000;

  const monthly = [
    { m: 'Sep', r: 2200 }, { m: 'Oct', r: 3900 }, { m: 'Nov', r: 5800 },
    { m: 'Dec', r: 8700 }, { m: 'Jan', r: 11600 }, { m: 'Feb', r: 15000 },
  ];

  const breakdown = [
    { l: 'Venue', a: 4500, c: '#6366f1' }, { l: 'Catering', a: 2800, c: '#8b5cf6' },
    { l: 'Marketing', a: 1200, c: '#06b6d4' }, { l: 'AV & Tech', a: 900, c: '#10b981' },
    { l: 'Staff', a: 400, c: '#f59e0b' },
  ];

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <style>{S}</style><GlobalStyles />
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '90px 4% 4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>Analytics Dashboard</h1>
            <p style={{ color: C.muted, fontSize: 14 }}>Real-time financial overview and ROI analysis</p>
          </div>
          <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => nav('/create-event')}>+ New Event</button>
        </div>

        {/* KPIs */}
        <div className="four-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[['Total Revenue', `$${revenue.toLocaleString()}`, '+18% this month', C.green], ['Total Spent', `$${spent.toLocaleString()}`, `${Math.round((spent/budget)*100)}% of budget`, C.amber], ['ROI', `${roi}%`, 'Return on investment', C.accent], ['Attendees', '950', '+12% vs last event', C.accent3]].map(([l, v, c, col]) => (
            <div key={l} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{l}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>{v}</div>
              <div style={{ fontSize: 12, color: col }}>{c}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Revenue chart */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.5rem' }}>Revenue Over Time</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 160, marginBottom: 8 }}>
              {monthly.map((d, i) => (
                <div key={d.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 11, color: C.muted }}>${Math.round(d.r / 1000)}k</div>
                  <div style={{ width: '100%', background: i === monthly.length - 1 ? 'linear-gradient(180deg,#06b6d4,rgba(6,182,212,.3))' : 'linear-gradient(180deg,#6366f1,rgba(99,102,241,.3))', borderRadius: '6px 6px 0 0', height: `${(d.r / maxRev) * 130}px`, transition: 'height .5s ease' }} />
                  <div style={{ fontSize: 11, color: C.muted }}>{d.m}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget breakdown */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem' }}>Budget Distribution</div>
            {breakdown.map(d => (
              <div key={d.l} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                  <span style={{ color: C.muted2 }}>{d.l}</span>
                  <span style={{ fontWeight: 600 }}>${d.a.toLocaleString()}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(d.a / spent) * 100}%`, background: d.c, borderRadius: 3, transition: 'width .6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROI summary */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg,rgba(99,102,241,.06),rgba(139,92,246,.06))', border: '1px solid rgba(99,102,241,.2)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem', textAlign: 'center' }}>
            {[['Total Investment', `$${spent.toLocaleString()}`, C.amber], ['Projected Revenue', `$${revenue.toLocaleString()}`, C.green], ['Expected ROI', `${roi}%`, C.accent]].map(([l, v, c]) => (
              <div key={l}>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>{l}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: c, letterSpacing: '-0.02em' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Events table */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem' }}>Your Events</div>
          {[['Tech Summit 2025', 'Dec 15', 450, 22000, 'upcoming'], ['Design Week', 'Jan 10', 200, 8000, 'draft'], ['AI Conference', 'Feb 5', 300, 12000, 'upcoming']].map(([n, d, a, r, s], i) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: i < 2 ? `1px solid ${C.border2}` : 'none', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{n}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{d} · {a} attendees</div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: C.green }}>${r.toLocaleString()}</span>
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s === 'upcoming' ? 'rgba(99,102,241,.12)' : 'rgba(245,158,11,.12)', color: s === 'upcoming' ? '#a5b4fc' : '#fbbf24' }}>{s}</span>
              </div>
            </div>
          ))}
        </div>
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
            <button onClick={() => setFilter('')} className={filter === '' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '7px 16px', fontSize: 13 }}>All Services</button>
            {services.map(s => <button key={s} onClick={() => setFilter(s)} className={filter === s ? 'btn-primary' : 'btn-secondary'} style={{ padding: '7px 16px', fontSize: 13 }}>{s}</button>)}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.5rem' }}>
          {filtered.map(v => (
            <div key={v.id} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ height: 180, overflow: 'hidden' }}>
                <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .35s' }} onError={e => { e.target.parentElement.style.background='rgba(99,102,241,.1)'; e.target.style.display='none'; }} onMouseEnter={e => e.target.style.transform='scale(1.06)'} onMouseLeave={e => e.target.style.transform='scale(1)'} />
              </div>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{v.name}</div>
                  <span style={{ background: 'rgba(16,185,129,.1)', color: '#34d399', padding: '2px 8px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>★ {v.rating}</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span className="tag" style={{ fontSize: 11 }}>{v.service}</span>
                </div>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 10 }}>{v.description}</p>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>Price range: <strong style={{ color: C.text }}>{v.price}</strong></div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Available in: <strong style={{ color: C.text }}>{v.cities.slice(0, 3).join(', ')}</strong></div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: 13 }}>Contact Vendor</button>
                  <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: 13 }}>{v.reviews} reviews</button>
                </div>
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
  const [prefs, setPrefs] = useState({ eventType: 'Conference', budget: '10000', location: 'Singapore', notifications: true });

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <style>{S}</style><GlobalStyles />
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '90px 4% 4rem' }}>
        {/* Profile header */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>D</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>David Srinivasan</div>
            <div style={{ color: C.muted, fontSize: 14 }}>Event Professional · Member since 2024</div>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[['3', 'Events'], [savedIds.length.toString(), 'Saved Venues'], ['950', 'Attendees']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: C.accent }}>{n}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,.03)', border: `1px solid ${C.border2}`, borderRadius: 14, padding: 4, marginBottom: '2rem' }}>
          {[['saved', 'Saved Venues'], ['preferences', 'Preferences'], ['history', 'Activity History']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: '10px', borderRadius: 10, background: tab === k ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'none', border: 'none', color: tab === k ? '#fff' : C.muted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: tab === k ? 700 : 500, transition: 'all .2s' }}>{l}</button>
          ))}
        </div>

        {tab === 'saved' && (
          savedList.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
              {savedList.map(v => (
                <div key={v.id} className="card" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => nav(`/venue/${v.id}`)}>
                  <img src={v.image} alt={v.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} onError={e => { e.target.parentElement.style.background='rgba(99,102,241,.1)'; e.target.style.display='none'; }} />
                  <div style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{v.name}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{v.city}, {v.country} · ★{v.rating}</div>
                    <span className="tag" style={{ fontSize: 11 }}>${v.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card fade" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No saved venues yet</div>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: '1.5rem' }}>Browse venues and save your favorites</p>
              <button className="btn-primary" style={{ padding: '10px 22px', fontSize: 14 }} onClick={() => nav('/venues')}>Find Venues</button>
            </div>
          )
        )}

        {tab === 'preferences' && (
          <div className="card fade" style={{ padding: '2rem', maxWidth: 560 }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.5rem' }}>My Preferences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div><label>Preferred Event Type</label><select className="inp" value={prefs.eventType} onChange={e => setPrefs(p => ({ ...p, eventType: e.target.value }))}>{eventTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              <div><label>Default Budget (USD)</label><input className="inp" type="number" value={prefs.budget} onChange={e => setPrefs(p => ({ ...p, budget: e.target.value }))} /></div>
              <div><label>Default Location</label><input className="inp" value={prefs.location} onChange={e => setPrefs(p => ({ ...p, location: e.target.value }))} /></div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ marginBottom: 0 }}>Email Notifications</label>
                <div onClick={() => setPrefs(p => ({ ...p, notifications: !p.notifications }))} style={{ width: 44, height: 24, borderRadius: 12, background: prefs.notifications ? '#6366f1' : 'rgba(255,255,255,.1)', cursor: 'pointer', transition: 'background .2s', position: 'relative' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: prefs.notifications ? 23 : 3, transition: 'left .2s' }} />
                </div>
              </div>
              <button className="btn-primary" style={{ padding: '11px', fontSize: 14 }}>Save Preferences</button>
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div className="card fade" style={{ padding: '1.5rem' }}>
            {[['Searched for venues in Singapore', '2 hours ago'], ['Viewed Marina Bay Sands', '3 hours ago'], ['Saved ICC Sydney', 'Yesterday'], ['Created Tech Summit 2025', '2 days ago'], ['Searched venues in London', '3 days ago']].map(([tx, ti]) => (
              <div key={tx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 0', borderBottom: `1px solid ${C.border2}`, fontSize: 14, flexWrap: 'wrap', gap: 8 }}>
                <span>{tx}</span>
                <span style={{ fontSize: 12, color: C.muted, flexShrink: 0 }}>{ti}</span>
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

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{S}</style><GlobalStyles />
      <div style={{ width: '100%', maxWidth: 420, padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.5rem', cursor: 'pointer' }} onClick={() => nav('/')}>Event<span style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IQ</span></div>
          <p style={{ color: C.muted, fontSize: 14 }}>{mode === 'login' ? 'Sign in to your account' : 'Create a free account'}</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,.03)', borderRadius: 10, padding: 4, marginBottom: '1.5rem' }}>
            {['login', 'register'].map(m => <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '9px', borderRadius: 8, background: mode === m ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'none', border: 'none', color: mode === m ? '#fff' : C.muted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: mode === m ? 700 : 500 }}>{m === 'login' ? 'Sign In' : 'Register'}</button>)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'register' && <div><label>Full Name</label><input className="inp" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" /></div>}
            <div><label>Email Address</label><input className="inp" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" /></div>
            {mode === 'register' && <div><label>Phone Number</label><input className="inp" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 234 567 8900" /></div>}
            <div><label>Password</label><input className="inp" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Enter password" /></div>
            <button className="btn-primary" style={{ padding: '13px', fontSize: 15, marginTop: 4 }} onClick={() => nav('/')}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
