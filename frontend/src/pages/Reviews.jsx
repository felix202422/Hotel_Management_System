import { useState } from 'react'
import { Star, ThumbsUp, MessageSquare, Share2, Send } from 'lucide-react'

export default function Reviews() {
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Alice Johnson', rating: 5, date: '2 days ago', text: 'Amazing stay! The room was spotless, staff was incredibly friendly, and the breakfast was delicious.', source: 'Booking.com', replies: [] },
    { id: 2, name: 'Robert Chen', rating: 4, date: '4 days ago', text: 'Great location and beautiful lobby. Room service could be faster, but overall a wonderful experience.', source: 'Expedia', replies: [] },
    { id: 3, name: 'Maria Garcia', rating: 5, date: '1 week ago', text: 'The rooftop pool and bar are incredible. Will definitely come back!', source: 'TripAdvisor', replies: [] },
    { id: 4, name: 'James Wilson', rating: 3, date: '1 week ago', text: 'Decent hotel for the price. The room was a bit small but clean. Parking was convenient.', source: 'Google', replies: [] },
    { id: 5, name: 'Sophie Turner', rating: 5, date: '2 weeks ago', text: 'Perfect for our honeymoon! The staff went above and beyond to make it special.', source: 'Booking.com', replies: [] },
  ])
  const [replyText, setReplyText] = useState({})
  const [filterSource, setFilterSource] = useState('All')

  const handleReply = (id) => {
    if (!replyText[id]?.trim()) return
    setReviews(reviews.map(r => r.id === id ? { ...r, replies: [...r.replies, { text: replyText[id], date: 'Just now' }] } : r))
    setReplyText({ ...replyText, [id]: '' })
  }

  const filtered = filterSource === 'All' ? reviews : reviews.filter(r => r.source === filterSource)
  const avg = (filtered.reduce((s, r) => s + r.rating, 0) / filtered.length).toFixed(1)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 className="page-title">Reviews</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <select className="booking-filter" value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
            <option>All</option>
            <option>Booking.com</option>
            <option>Expedia</option>
            <option>TripAdvisor</option>
            <option>Google</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <div className="kpi-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <div className="kpi-icon" style={{ background: '#fffbeb', color: '#d97706' }}><Star size={20} /></div>
          <div><div className="kpi-value">{avg}</div><div className="kpi-label">Avg. Rating</div></div>
        </div>
        <div className="kpi-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <div className="kpi-icon" style={{ background: '#ecfdf5', color: '#059669' }}><ThumbsUp size={20} /></div>
          <div><div className="kpi-value">72</div><div className="kpi-label">Positive</div></div>
        </div>
        <div className="kpi-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <div className="kpi-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}><MessageSquare size={20} /></div>
          <div><div className="kpi-value">{filtered.length}</div><div className="kpi-label">Total Reviews</div></div>
        </div>
        <div className="kpi-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <div className="kpi-icon" style={{ background: '#f1f5f9', color: '#64748b' }}><Share2 size={20} /></div>
          <div><div className="kpi-value">4</div><div className="kpi-label">Sources</div></div>
        </div>
      </div>

      <div className="card">
        {filtered.map((r) => (
          <div key={r.id} style={{ padding: '16px 0', borderBottom: r.id !== filtered[filtered.length - 1]?.id ? '1px solid var(--border)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="guest-avatar-sm">{r.name.split(' ').map((n) => n[0]).join('')}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: 5 }, (_, j) => (
                        <Star key={j} size={12} fill={j < r.rating ? '#f59e0b' : '#e2e8f0'} color={j < r.rating ? '#f59e0b' : '#e2e8f0'} />
                      ))}
                    </div>
                    <span className="room-badge">{r.source}</span>
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{r.date}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginTop: 4 }}>{r.text}</p>

            {r.replies.map((rep, i) => (
              <div key={i} style={{ marginTop: 12, marginLeft: 44, padding: '10px 14px', background: 'var(--bg)', borderRadius: 12, fontSize: '0.82rem', color: '#475569' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.75rem' }}>Fizzo Hotels</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{rep.date}</span>
                </div>
                {rep.text}
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 12, marginLeft: 44 }}>
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText[r.id] || ''}
                onChange={(e) => setReplyText({ ...replyText, [r.id]: e.target.value })}
                style={{ flex: 1, padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: '0.82rem' }}
              />
              <button className="btn-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => handleReply(r.id)}>
                <Send size={14} /> Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
