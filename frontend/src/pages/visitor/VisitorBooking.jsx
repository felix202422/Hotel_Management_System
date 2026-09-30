import { useState } from 'react'
import { Search, Calendar, CreditCard, X, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import api from '../../api/axios'

const STATUS_CONFIG = {
  Pending: { color: '#FEF9C3', text: '#CA8A04', icon: Clock, label: 'Pending' },
  Confirmed: { color: '#ECFDF5', text: '#059669', icon: CheckCircle, label: 'Confirmed' },
  'Checked-In': { color: '#EFF6FF', text: '#2563EB', icon: CheckCircle, label: 'Checked-In' },
  'Checked-Out': { color: '#F1F5F9', text: '#64748B', icon: CheckCircle, label: 'Checked-Out' },
  Cancelled: { color: '#FEF2F2', text: '#DC2626', icon: X, label: 'Cancelled' },
}

const FALLBACK_BOOKINGS = [
  { reservationId: 'BK-1001', room: { roomNumber: '201', roomType: 'Deluxe King' }, checkInDate: '2026-08-15', checkOutDate: '2026-08-19', totalPrice: 1000, reservationStatus: 'Confirmed', guest: { firstName: 'Guest', lastName: 'User' } },
  { reservationId: 'BK-1002', room: { roomNumber: '301', roomType: 'Suite' }, checkInDate: '2026-09-01', checkOutDate: '2026-09-04', totalPrice: 1350, reservationStatus: 'Pending', guest: { firstName: 'Guest', lastName: 'User' } },
]

const s = {
  page: { maxWidth: 900, margin: '0 auto', padding: '40px 24px' },
  hero: {
    background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
    borderRadius: 20, padding: '48px 40px', textAlign: 'center', color: '#fff', marginBottom: 40,
  },
  heroTitle: { fontSize: '2rem', fontWeight: 800, marginBottom: 8 },
  heroSub: { opacity: 0.75, fontSize: '0.95rem' },
  searchCard: {
    background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 32,
  },
  searchRow: { display: 'flex', gap: 12, alignItems: 'center' },
  searchInput: {
    flex: 1, padding: '14px 18px', border: '1.5px solid #D1D5DB', borderRadius: 12,
    fontSize: '0.92rem', fontFamily: 'inherit',
  },
  resultCard: {
    background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 20,
  },
  resultHeader: {
    padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderBottom: '1px solid #F3F4F6',
  },
  resultBody: { padding: '24px 28px' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 },
  infoItem: { display: 'flex', flexDirection: 'column', gap: 4 },
  infoLabel: { fontSize: '0.78rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 },
  infoValue: { fontWeight: 600, fontSize: '0.95rem' },
  notFound: {
    textAlign: 'center', padding: 60, color: '#6B7280', background: '#fff',
    borderRadius: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
}

export default function VisitorBooking() {
  const [ref, setRef] = useState('')
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!ref.trim()) return
    setLoading(true)
    setError('')
    setSearched(true)
    try {
      const res = await api.get(`/reservations/track/${ref.trim()}`)
      setBooking(res.data)
    } catch {
      const found = FALLBACK_BOOKINGS.find(b => b.reservationId === ref.trim())
      if (found) {
        setBooking(found)
      } else {
        setBooking(null)
        setError('No booking found with that reference number.')
      }
    }
    setLoading(false)
  }

  const handleCancel = async () => {
    if (!booking || booking.reservationStatus !== 'Pending') return
    try {
      await api.patch(`/reservations/${booking.reservationId}/cancel`)
    } catch {}
    setBooking({ ...booking, reservationStatus: 'Cancelled' })
  }

  const st = booking ? (STATUS_CONFIG[booking.reservationStatus] || STATUS_CONFIG.Pending) : null

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)', padding: '60px 24px', textAlign: 'center', color: '#fff' }}>
        <h1 style={s.heroTitle}>Track Your Booking</h1>
        <p style={s.heroSub}>Enter your booking reference number to view details and status</p>
      </div>

      <div style={s.page}>
        <div style={s.searchCard}>
          <form onSubmit={handleSearch} style={s.searchRow}>
            <input
              style={s.searchInput}
              type="text"
              placeholder="Enter booking reference (e.g. BK-1001)"
              value={ref}
              onChange={e => setRef(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.92rem', borderRadius: 12 }} disabled={loading}>
              <Search size={18} /> {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: '#6B7280' }}>Searching for your booking...</div>
        )}

        {!loading && searched && error && (
          <div style={s.notFound}>
            <AlertCircle size={48} style={{ color: '#EF4444', marginBottom: 16 }} />
            <h3 style={{ fontWeight: 700, marginBottom: 8, color: '#1F2937' }}>Booking Not Found</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && booking && (
          <div style={s.resultCard}>
            <div style={s.resultHeader}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Booking {booking.reservationId}</h3>
                <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>Room {booking.room?.roomNumber}</span>
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 16px', borderRadius: 9999, fontSize: '0.82rem', fontWeight: 700,
                background: st.color, color: st.text,
              }}>
                <st.icon size={14} /> {st.label}
              </span>
            </div>
            <div style={s.resultBody}>
              <div style={s.infoGrid}>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Room Type</span>
                  <span style={s.infoValue}>{booking.room?.roomType || 'N/A'}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Room Number</span>
                  <span style={s.infoValue}>{booking.room?.roomNumber || 'N/A'}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Check-in</span>
                  <span style={s.infoValue}><Calendar size={14} style={{ marginRight: 6 }} />{booking.checkInDate}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Check-out</span>
                  <span style={s.infoValue}><Calendar size={14} style={{ marginRight: 6 }} />{booking.checkOutDate}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Total Amount</span>
                  <span style={{ ...s.infoValue, color: '#3B82F6', fontSize: '1.2rem' }}><CreditCard size={14} style={{ marginRight: 6 }} />${booking.totalPrice}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Status</span>
                  <span style={s.infoValue}>{booking.reservationStatus}</span>
                </div>
              </div>

              {booking.reservationStatus === 'Pending' && (
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button className="btn-danger" onClick={handleCancel} style={{ padding: '10px 24px', borderRadius: 12 }}>
                    <X size={16} /> Cancel Booking
                  </button>
                </div>
              )}

              {booking.reservationStatus === 'Confirmed' && (
                <div style={{ background: '#ECFDF5', borderRadius: 12, padding: 16, marginTop: 8, fontSize: '0.88rem', color: '#059669' }}>
                  Your booking is confirmed. We look forward to welcoming you!
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && !searched && (
          <div style={{ textAlign: 'center', padding: 60, color: '#6B7280' }}>
            <Search size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <p>Enter your booking reference above to track your reservation</p>
          </div>
        )}
      </div>
    </div>
  )
}
