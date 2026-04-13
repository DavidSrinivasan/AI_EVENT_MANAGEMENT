import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar, Chatbot, VenueMap } from '../components/shared';
import { C, venues, eventTypes, API } from '../utils';

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#6366f1;border-radius:2px}
  .btn-p{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s}
  .btn-p:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(99,102,241,.4)}
  .btn-o{background:transparent;color:#94a3b8;border:1px solid rgba(99,102,241,.25);border-radius:10px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .2s}
  .btn-o:hover{border-color:rgba(99,102,241,.6);color:#c7d2fe}
  .inp{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:10px 14px;color:#f0f4ff;font-size:14px;font-family:inherit;outline:none;transition:border-color .2s;width:100%}
  .inp:focus{border-color:rgba(99,102,241,.5)}
  .card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:18px}
  .tag{background:rgba(99,102,241,.1);color:#a5b4fc;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:500}
  label{font-size:13px;color:#64748b;display:block;margin-bottom:6px;font-weight:500}
  @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  .fade{animation:fadeIn .5s ease}
  @media(max-width:768px){.two-col{grid-template-columns:1fr!important}.three-col{grid-template-columns:1fr!important}}
`;

/* ─────────────────── VENUE DETAIL ─────────────────────── */
export function VenueDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const venue = venues.find(v => v.id === parseInt(id)) || venues[0];
  const [savedVenues, setSavedVenues] = useState(JSON.parse(localStorage.getItem('savedVenues') || '[]'));
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState([
    { name: 'Sarah K.', rating: 5, text: 'Outstanding facilities and excellent staff support throughout our conference.' },
    { name: 'Michael T.', rating: 4, text: 'Great venue, perfect location. Catering could be improved.' },
    { name: 'Priya R.', rating: 5, text: 'Used this for our product launch. Everything was seamless and professional.' },
  ]);
  const [userRating, setUserRating] = useState(0);

  const isSaved = savedVenues.includes(venue.id);
  const toggleSave = () => {
    const updated = isSaved ? savedVenues.filter(i => i !== venue.id) : [...savedVenues, venue.id];
    setSavedVenues(updated);
    localStorage.setItem('savedVenues', JSON.stringify(updated));
  };

  const submitReview = () => {
    if (!review.trim()) return;
    setReviews(p => [{ name: 'You', rating, text: review }, ...p]);
    setReview('');
  };

  const nearby = venues.filter(v => v.id !== venue.id && v.country === venue.country).slice(0, 3);

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <style>{style}</style>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        {/* Hero */}
        <div style={{ height: 260, background: `linear-gradient(135deg,rgba(99,102,241,.2),rgba(139,92,246,.15))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <span style={{ position: 'relative', zIndex: 1 }}>{venue.image}</span>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 5%' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>{venue.name}</h1>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: C.muted, fontSize: 14 }}>📍 {venue.city}, {venue.country}</span>
                <span style={{ background: 'rgba(16,185,129,.12)', color: '#34d399', padding: '3px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>★ {venue.rating}</span>
                <span style={{ color: C.muted, fontSize: 13 }}>👁 {venue.views.toLocaleString()} views</span>
                <span style={{ color: C.muted, fontSize: 13 }}>💬 {venue.reviews} reviews</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn-o" style={{ padding: '10px 18px', fontSize: 14 }} onClick={toggleSave}>{isSaved ? '🔖 Saved' : '🔖 Save Venue'}</button>
              <button className="btn-p" style={{ padding: '10px 18px', fontSize: 14 }} onClick={() => nav('/create-event')}>Book This Venue →</button>
            </div>
          </div>

          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
            <div>
              {/* Info cards */}
              <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {[['👥', 'Capacity', venue.capacity.toLocaleString() + ' guests'], ['💰', 'Starting Price', '$' + venue.price.toLocaleString()], ['🏷️', 'Venue Type', venue.type]].map(([ic, la, va]) => (
                  <div key={la} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{ic}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{la}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{va}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>About This Venue</h3>
                <p style={{ color: C.muted, lineHeight: 1.75, fontSize: 14 }}>{venue.description}</p>
              </div>

              {/* Amenities */}
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Amenities & Services</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {venue.amenities.map(a => <span key={a} className="tag" style={{ padding: '6px 14px', fontSize: 13 }}>✓ {a}</span>)}
                </div>
              </div>

              {/* Map */}
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Location</h3>
                <VenueMap venues={[venue]} center={[venue.lat, venue.lng]} zoom={14} height={280} />
              </div>

              {/* Reviews */}
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Reviews ({reviews.length})</h3>
                {reviews.map((r, i) => (
                  <div key={i} style={{ padding: '1rem 0', borderBottom: i < reviews.length - 1 ? `1px solid ${C.border2}` : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span>
                      <span style={{ color: '#fbbf24', fontSize: 13 }}>{'★'.repeat(r.rating)}</span>
                    </div>
                    <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{r.text}</p>
                  </div>
                ))}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${C.border2}` }}>
                  <h4 style={{ fontWeight: 600, fontSize: 14, marginBottom: '0.75rem' }}>Write a Review</h4>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                    {[1,2,3,4,5].map(s => <span key={s} onClick={() => setRating(s)} style={{ fontSize: '1.4rem', cursor: 'pointer', color: s <= rating ? '#fbbf24' : C.muted, transition: 'color .15s' }}>★</span>)}
                  </div>
                  <textarea className="inp" value={review} onChange={e => setReview(e.target.value)} placeholder="Share your experience…" rows={3} style={{ marginBottom: 10, resize: 'vertical' }} />
                  <button className="btn-p" style={{ padding: '9px 20px', fontSize: 14 }} onClick={submitReview}>Submit Review</button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem', position: 'sticky', top: 88 }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: C.accent, marginBottom: 4 }}>${venue.price.toLocaleString()}</div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: '1.25rem' }}>Starting price per event</div>
                <button className="btn-p" style={{ width: '100%', padding: '13px', fontSize: 15, marginBottom: 10 }} onClick={() => nav('/create-event')}>Book This Venue →</button>
                <button className="btn-o" style={{ width: '100%', padding: '11px', fontSize: 14 }} onClick={toggleSave}>{isSaved ? '🔖 Remove from Saved' : '🔖 Save for Later'}</button>
                <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(99,102,241,.06)', borderRadius: 12, border: `1px solid rgba(99,102,241,.15)` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#a5b4fc', marginBottom: 4 }}>🤖 AI Tip</div>
                  <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>This venue is popular for {venue.type.toLowerCase()} events. Book 3+ months in advance for best rates.</p>
                </div>
              </div>

              {nearby.length > 0 && (
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>Nearby Venues</h3>
                  {nearby.map(v => (
                    <div key={v.id} onClick={() => nav(`/venue/${v.id}`)} style={{ display: 'flex', gap: 10, padding: '0.75rem 0', borderBottom: `1px solid ${C.border2}`, cursor: 'pointer' }}>
                      <span style={{ fontSize: '1.6rem' }}>{v.image}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{v.name}</div>
                        <div style={{ fontSize: 12, color: C.muted }}>★{v.rating} · ${v.price.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}

/* ─────────────────── CREATE EVENT ─────────────────────── */
export function CreateEventPage() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', type: '', date: '', time: '', location: '', attendees: '', budget: '', notes: '' });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Choose venue', done: false },
    { id: 2, text: 'Set budget and allocate costs', done: false },
    { id: 3, text: 'Send invitations', done: false },
    { id: 4, text: 'Arrange catering', done: false },
    { id: 5, text: 'Book AV equipment', done: false },
    { id: 6, text: 'Confirm speakers/performers', done: false },
    { id: 7, text: 'Arrange security', done: false },
    { id: 8, text: 'Create event page', done: false },
    { id: 9, text: 'Send reminders 1 week before', done: false },
    { id: 10, text: 'Prepare day-of schedule', done: false },
  ]);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const getRecommendations = async () => {
    setLoading(true);
    const filtered = venues.filter(v => {
      const cap = parseInt(form.attendees) || 0;
      const bud = parseInt(form.budget) || 99999;
      return v.capacity >= cap && v.price <= bud;
    }).sort((a, b) => b.rating - a.rating).slice(0, 4);
    setRecommendations(filtered);
    setLoading(false);
    setStep(2);
  };

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <style>{style}</style>
      <Navbar />

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '100px 5% 4rem' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Create Your Event</h1>
        <p style={{ color: C.muted, marginBottom: '2.5rem', fontSize: 14 }}>Fill in your event details and get AI-powered venue recommendations.</p>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '2rem' }}>
          {['Event Details', 'Venue Recommendations', 'Planning Checklist'].map((s, i) => (
            <div key={s} style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: step === i + 1 ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : step > i + 1 ? 'rgba(99,102,241,.15)' : 'rgba(255,255,255,.03)', border: step === i + 1 ? 'none' : `1px solid ${C.border2}`, fontSize: 13, fontWeight: step === i + 1 ? 700 : 500, color: step === i + 1 ? '#fff' : step > i + 1 ? '#a5b4fc' : C.muted, textAlign: 'center', cursor: step > i + 1 ? 'pointer' : 'default', transition: 'all .2s' }} onClick={() => step > i + 1 && setStep(i + 1)}>
              {step > i + 1 ? '✓ ' : `${i + 1}. `}{s}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="card fade" style={{ padding: '2rem' }}>
            <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label>Event Name *</label>
                <input className="inp" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Tech Summit 2025" />
              </div>
              <div>
                <label>Event Type *</label>
                <select className="inp" value={form.type} onChange={e => update('type', e.target.value)}>
                  <option value="">Select type…</option>
                  {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label>Date *</label>
                <input className="inp" type="date" value={form.date} onChange={e => update('date', e.target.value)} />
              </div>
              <div>
                <label>Time</label>
                <input className="inp" type="time" value={form.time} onChange={e => update('time', e.target.value)} />
              </div>
              <div>
                <label>Location / City *</label>
                <input className="inp" value={form.location} onChange={e => update('location', e.target.value)} placeholder="e.g. Singapore, Dubai, London" />
              </div>
              <div>
                <label>Expected Attendees *</label>
                <input className="inp" type="number" value={form.attendees} onChange={e => update('attendees', e.target.value)} placeholder="e.g. 500" />
              </div>
              <div>
                <label>Budget (USD) *</label>
                <input className="inp" type="number" value={form.budget} onChange={e => update('budget', e.target.value)} placeholder="e.g. 10000" />
              </div>
              <div>
                <label>Additional Notes</label>
                <input className="inp" value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Any special requirements…" />
              </div>
            </div>
            <button className="btn-p" style={{ padding: '13px 28px', fontSize: 15, width: '100%' }} onClick={getRecommendations} disabled={!form.name || !form.type || !form.attendees || !form.budget}>
              {loading ? 'Getting AI Recommendations…' : 'Get AI Venue Recommendations →'}
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="fade">
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'rgba(99,102,241,.06)', border: `1px solid rgba(99,102,241,.2)` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#a5b4fc', marginBottom: 4 }}>🤖 AI Recommendations for: {form.name}</div>
              <p style={{ fontSize: 13, color: C.muted }}>Based on {form.attendees} attendees and ${parseInt(form.budget).toLocaleString()} budget — here are the best matching venues:</p>
            </div>
            {recommendations.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {recommendations.map((v, i) => (
                  <div key={v.id} className="card" style={{ padding: '1.25rem', cursor: 'pointer', position: 'relative' }} onClick={() => nav(`/venue/${v.id}`)}>
                    {i === 0 && <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 12px', borderRadius: 20 }}>🏆 Best Match</div>}
                    <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.75rem', marginTop: i === 0 ? '0.5rem' : 0 }}>{v.image}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{v.name}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>📍 {v.city}, {v.country}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      <span className="tag">★{v.rating}</span>
                      <span className="tag">👥 {v.capacity.toLocaleString()}</span>
                      <span className="tag">${v.price.toLocaleString()}</span>
                    </div>
                    <button className="btn-p" style={{ width: '100%', padding: '8px', fontSize: 13, marginTop: 4 }}>View Details →</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>😕</div>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No venues match your filters</div>
                <p style={{ color: C.muted, fontSize: 14 }}>Try increasing your budget or reducing attendee count</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-o" style={{ padding: '11px 22px', fontSize: 14 }} onClick={() => setStep(1)}>← Back</button>
              <button className="btn-p" style={{ padding: '11px 22px', fontSize: 14, flex: 1 }} onClick={() => setStep(3)}>Continue to Checklist →</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="fade">
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Event Planning Checklist</h3>
                <span style={{ fontSize: 13, color: C.accent }}>{checklist.filter(i => i.done).length}/{checklist.length} completed</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2, marginBottom: '1.25rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(checklist.filter(i => i.done).length / checklist.length) * 100}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 2, transition: 'width .3s' }} />
              </div>
              {checklist.map(item => (
                <div key={item.id} onClick={() => setChecklist(p => p.map(i => i.id === item.id ? { ...i, done: !i.done } : i))} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${C.border2}`, cursor: 'pointer' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${item.done ? '#6366f1' : 'rgba(255,255,255,.2)'}`, background: item.done ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', flexShrink: 0, transition: 'all .2s' }}>
                    {item.done ? '✓' : ''}
                  </div>
                  <span style={{ fontSize: 14, color: item.done ? C.muted : C.text, textDecoration: item.done ? 'line-through' : 'none', transition: 'all .2s' }}>{item.text}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '1.25rem', background: 'rgba(16,185,129,.06)', border: `1px solid rgba(16,185,129,.2)`, borderRadius: 14, marginBottom: '1.25rem' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#34d399', marginBottom: 4 }}>✅ Event Created: {form.name}</div>
              <p style={{ fontSize: 13, color: C.muted }}>Date: {form.date} · Attendees: {form.attendees} · Budget: ${parseInt(form.budget || 0).toLocaleString()}</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-o" style={{ padding: '11px 22px', fontSize: 14 }} onClick={() => setStep(2)}>← Back</button>
              <button className="btn-p" style={{ padding: '11px 22px', fontSize: 14, flex: 1 }} onClick={() => nav('/dashboard')}>View Dashboard →</button>
            </div>
          </div>
        )}
      </div>
      <Chatbot />
    </div>
  );
}

/* ─────────────────── DASHBOARD ─────────────────────────── */
export function DashboardPage() {
  const nav = useNavigate();
  const budget = 15000;
  const spent = 9800;
  const revenue = 22000;
  const roi = Math.round(((revenue - spent) / spent) * 100);

  const chartData = [
    { label: 'Venue', amount: 4500, color: '#6366f1' },
    { label: 'Catering', amount: 2800, color: '#8b5cf6' },
    { label: 'Marketing', amount: 1200, color: '#06b6d4' },
    { label: 'AV & Tech', amount: 900, color: '#10b981' },
    { label: 'Staff', amount: 400, color: '#f59e0b' },
  ];

  const monthlyData = [
    { month: 'Aug', tickets: 45, revenue: 2200 },
    { month: 'Sep', tickets: 80, revenue: 3900 },
    { month: 'Oct', tickets: 120, revenue: 5800 },
    { month: 'Nov', tickets: 180, revenue: 8700 },
    { month: 'Dec', tickets: 240, revenue: 11600 },
    { month: 'Jan', tickets: 310, revenue: 15000 },
  ];
  const maxRev = Math.max(...monthlyData.map(d => d.revenue));

  const events = [
    { name: 'Tech Summit 2025', date: 'Dec 15', status: 'upcoming', attendees: 450, revenue: 22000 },
    { name: 'Design Week', date: 'Jan 10', status: 'draft', attendees: 200, revenue: 8000 },
    { name: 'AI Conference', date: 'Feb 5', status: 'upcoming', attendees: 300, revenue: 12000 },
  ];

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <style>{style}</style>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '90px 5% 4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>Analytics Dashboard</h1>
            <p style={{ color: C.muted, fontSize: 14 }}>Financial overview and ROI analysis for your events</p>
          </div>
          <button className="btn-p" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => nav('/create-event')}>+ New Event</button>
        </div>

        {/* KPI Cards */}
        <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[['💰', 'Total Revenue', `$${revenue.toLocaleString()}`, '+18%', C.green], ['📉', 'Total Spent', `$${spent.toLocaleString()}`, `${Math.round((spent/budget)*100)}% of budget`, C.amber], ['📈', 'ROI', `${roi}%`, 'Return on investment', C.accent], ['👥', 'Total Attendees', '950', '+12% vs last', C.accent3]].map(([ic, la, va, ch, col]) => (
            <div key={la} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>{ic}</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{la}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>{va}</div>
              <div style={{ fontSize: 12, color: col }}>{ch}</div>
            </div>
          ))}
        </div>

        <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Revenue chart */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.5rem' }}>Revenue Over Time</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
              {monthlyData.map((d, i) => (
                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 11, color: C.muted }}>${Math.round(d.revenue / 1000)}k</div>
                  <div style={{ width: '100%', background: 'linear-gradient(180deg,#6366f1,rgba(99,102,241,.3))', borderRadius: '6px 6px 0 0', height: `${(d.revenue / maxRev) * 120}px`, transition: 'height .5s ease', animationDelay: `${i * 0.1}s` }} />
                  <div style={{ fontSize: 11, color: C.muted }}>{d.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget breakdown */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem' }}>Budget Distribution</div>
            {chartData.map(d => (
              <div key={d.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                  <span style={{ color: C.muted2 }}>{d.label}</span>
                  <span style={{ fontWeight: 600 }}>${d.amount.toLocaleString()}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(d.amount / spent) * 100}%`, background: d.color, borderRadius: 3, transition: 'width .6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Summary */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg,rgba(99,102,241,.06),rgba(139,92,246,.06))', border: `1px solid rgba(99,102,241,.2)` }}>
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
          {events.map((e, i) => (
            <div key={e.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: i < events.length - 1 ? `1px solid ${C.border2}` : 'none', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{e.name}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>📅 {e.date} · 👥 {e.attendees} attendees</div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: C.green }}>${e.revenue.toLocaleString()}</span>
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: e.status === 'upcoming' ? 'rgba(99,102,241,.12)' : 'rgba(245,158,11,.12)', color: e.status === 'upcoming' ? '#a5b4fc' : '#fbbf24' }}>{e.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Chatbot />
    </div>
  );
}

/* ─────────────────── PROFILE ───────────────────────────── */
export function ProfilePage() {
  const nav = useNavigate();
  const savedIds = JSON.parse(localStorage.getItem('savedVenues') || '[]');
  const savedVenuesList = venues.filter(v => savedIds.includes(v.id));
  const [activeTab, setActiveTab] = useState('saved');
  const [prefs, setPrefs] = useState({ eventType: 'Conference', budget: '10000', location: 'Singapore', notifications: true });

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <style>{style}</style>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '90px 5% 4rem' }}>
        {/* Profile header */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>D</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>David Srinivasan</div>
            <div style={{ color: C.muted, fontSize: 14 }}>Event Professional · Member since 2024</div>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[['3', 'Events Created'], [savedIds.length.toString(), 'Saved Venues'], ['950', 'Total Attendees']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: C.accent }}>{n}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,.03)', border: `1px solid ${C.border2}`, borderRadius: 14, padding: 4, marginBottom: '2rem', overflowX: 'auto' }}>
          {[['saved', '🔖 Saved Venues'], ['preferences', '⚙️ Preferences'], ['history', '🕐 History']].map(([k, l]) => (
            <button key={k} onClick={() => setActiveTab(k)} style={{ flex: 1, padding: '10px 16px', borderRadius: 10, background: activeTab === k ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'none', border: 'none', color: activeTab === k ? '#fff' : C.muted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: activeTab === k ? 700 : 500, whiteSpace: 'nowrap', transition: 'all .2s' }}>{l}</button>
          ))}
        </div>

        {activeTab === 'saved' && (
          <div>
            {savedVenuesList.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
                {savedVenuesList.map(v => (
                  <div key={v.id} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => nav(`/venue/${v.id}`)}>
                    <div style={{ height: 100, background: `linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.1))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>{v.image}</div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{v.name}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>📍 {v.city}, {v.country} · ★{v.rating}</div>
                      <span className="tag">${v.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔖</div>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No saved venues yet</div>
                <p style={{ color: C.muted, fontSize: 14, marginBottom: '1.5rem' }}>Browse venues and click Save to add them here</p>
                <button className="btn-p" style={{ padding: '10px 22px', fontSize: 14 }} onClick={() => nav('/venues')}>Find Venues →</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="card fade" style={{ padding: '2rem', maxWidth: 560 }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.5rem' }}>My Preferences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label>Preferred Event Type</label>
                <select className="inp" value={prefs.eventType} onChange={e => setPrefs(p => ({ ...p, eventType: e.target.value }))}>
                  {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label>Default Budget (USD)</label>
                <input className="inp" type="number" value={prefs.budget} onChange={e => setPrefs(p => ({ ...p, budget: e.target.value }))} />
              </div>
              <div>
                <label>Default Location</label>
                <input className="inp" value={prefs.location} onChange={e => setPrefs(p => ({ ...p, location: e.target.value }))} placeholder="City or country" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ marginBottom: 0 }}>Email Notifications</label>
                <div onClick={() => setPrefs(p => ({ ...p, notifications: !p.notifications }))} style={{ width: 44, height: 24, borderRadius: 12, background: prefs.notifications ? '#6366f1' : 'rgba(255,255,255,.1)', cursor: 'pointer', transition: 'background .2s', position: 'relative' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: prefs.notifications ? 23 : 3, transition: 'left .2s' }} />
                </div>
              </div>
              <button className="btn-p" style={{ padding: '11px', fontSize: 14, marginTop: 4 }}>Save Preferences</button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="card fade" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem' }}>Recent Activity</h3>
            {[['🔍', 'Searched for venues in Singapore', '2 hours ago'], ['👁️', 'Viewed Marina Bay Sands Expo', '3 hours ago'], ['🔖', 'Saved ICC Sydney', 'Yesterday'], ['📅', 'Created Tech Summit 2025', '2 days ago'], ['🔍', 'Searched for venues in London', '3 days ago']].map(([ic, tx, ti]) => (
              <div key={tx} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '0.75rem 0', borderBottom: `1px solid ${C.border2}` }}>
                <span style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(99,102,241,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{ic}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.text }}>{tx}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{ti}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Chatbot />
    </div>
  );
}
