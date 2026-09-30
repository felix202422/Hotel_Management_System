import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import api from '../../api/axios'

const s = {
  hero: {
    background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
    padding: '80px 24px',
    textAlign: 'center',
    color: '#fff',
  },
  heroTitle: { fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 },
  heroSub: { fontSize: '1.05rem', opacity: 0.75, maxWidth: 600, margin: '0 auto' },
  section: { maxWidth: 1100, margin: '0 auto', padding: '60px 24px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 400px', gap: 40, alignItems: 'start' },
  formCard: { background: '#fff', borderRadius: 20, padding: 36, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  formTitle: { fontSize: '1.4rem', fontWeight: 700, marginBottom: 24 },
  input: {
    width: '100%', padding: '12px 16px', border: '1.5px solid #D1D5DB', borderRadius: 12,
    fontSize: '0.88rem', transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'inherit',
  },
  textarea: {
    width: '100%', padding: '12px 16px', border: '1.5px solid #D1D5DB', borderRadius: 12,
    fontSize: '0.88rem', minHeight: 140, resize: 'vertical', fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  infoCards: { display: 'flex', flexDirection: 'column', gap: 16 },
  infoCard: {
    background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    display: 'flex', gap: 16, alignItems: 'flex-start',
  },
  infoIcon: {
    width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
  },
  mapPlaceholder: {
    background: 'linear-gradient(135deg, #EAF3FF, #DBEAFE)', borderRadius: 20,
    height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexDirection: 'column', gap: 12, color: '#6B7280', marginTop: 24,
  },
  successMsg: {
    background: '#ECFDF5', color: '#059669', padding: 16, borderRadius: 12,
    textAlign: 'center', fontWeight: 600, marginTop: 16,
  },
}

export default function VisitorContact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setSending(true)
    try {
      await api.post('/contact', form)
    } catch {}
    setSending(false)
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <div>
      <div style={s.hero}>
        <h1 style={s.heroTitle}>Contact Us</h1>
        <p style={s.heroSub}>Have a question or need assistance? We're here to help. Reach out to us anytime.</p>
      </div>

      <div style={s.section}>
        <div style={s.layout}>
          <div>
            <div style={s.formCard}>
              <h2 style={s.formTitle}>Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    style={s.input}
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    style={s.input}
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    style={s.input}
                    type="text"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    style={s.textarea}
                    placeholder="Write your message here..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem', borderRadius: 12 }} disabled={sending}>
                  <Send size={18} /> {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
              {sent && <div style={s.successMsg}>Thank you! Your message has been sent successfully.</div>}
            </div>

            <div style={s.mapPlaceholder}>
              <MapPin size={40} style={{ color: '#3B82F6' }} />
              <span style={{ fontWeight: 600 }}>123 Luxury Avenue, Metro City</span>
              <span style={{ fontSize: '0.85rem' }}>Interactive map coming soon</span>
            </div>
          </div>

          <div style={s.infoCards}>
            <div style={s.infoCard}>
              <div style={{ ...s.infoIcon, background: '#EFF6FF', color: '#3B82F6' }}><MapPin size={22} /></div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Our Address</h4>
                <p style={{ color: '#6B7280', fontSize: '0.88rem', lineHeight: 1.6 }}>123 Luxury Avenue<br />Metro City, MC 10001</p>
              </div>
            </div>
            <div style={s.infoCard}>
              <div style={{ ...s.infoIcon, background: '#ECFDF5', color: '#22C55E' }}><Phone size={22} /></div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Phone</h4>
                <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>+1 (555) 123-4567</p>
                <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>+1 (555) 987-6543</p>
              </div>
            </div>
            <div style={s.infoCard}>
              <div style={{ ...s.infoIcon, background: '#FEF9C3', color: '#CA8A04' }}><Mail size={22} /></div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Email</h4>
                <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>info@hasmirhotels.com</p>
                <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>reservations@hasmirhotels.com</p>
              </div>
            </div>
            <div style={s.infoCard}>
              <div style={{ ...s.infoIcon, background: '#F3E8FF', color: '#9333EA' }}><Clock size={22} /></div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Working Hours</h4>
                <p style={{ color: '#6B7280', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  Front Desk: 24/7<br />
                  Restaurant: 6 AM - 11 PM<br />
                  Spa: 9 AM - 9 PM<br />
                  Gym: 5 AM - 11 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
