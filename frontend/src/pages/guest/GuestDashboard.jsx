import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar, Bed, CreditCard, Clock, ArrowRight, User, Star, Bell
} from 'lucide-react'
import api from '../../api/axios'

const FALLBACK_BOOKING = {
  reservationId: 'BK-1001',
  room: { roomNumber: '201', roomType: 'Deluxe King' },
  checkInDate: '2026-09-01',
  checkOutDate: '2026-09-05',
  totalPrice: 1000,
  reservationStatus: 'Confirmed',
}

const s = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  welcome: {
    background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
    borderRadius: 20, padding: '36px 40px', color: '#fff', marginBottom: 32,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  welcomeTitle: { fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 },
  welcomeSub: { opacity: 0.7, fontSize: '0.92rem' },
  welcomeIcon: {
    width: 64, height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 },
  card: {
    background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  cardTitle: { fontWeight: 700, fontSize: '1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 },
  bookingStatus: (status) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px',
    borderRadius: 9999, fontSize: '0.82rem', fontWeight: 700,
    background: status === 'Confirmed' ? '#ECFDF5' : status === 'Pending' ? '#FEF9C3' : '#FEF2F2',
    color: status === 'Confirmed' ? '#059669' : status === 'Pending' ? '#CA8A04' : '#DC2626',
  }),
  bookingGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  bookingItem: { display: 'flex', flexDirection: 'column', gap: 4 },
  bookingLabel: { fontSize: '0.78rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 },
  bookingValue: { fontWeight: 600, fontSize: '0.95rem' },
  quickLinks: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  quickLink: {
    display: 'flex', alignItems: 'center', gap: 14, padding: 20,
    borderRadius: 14, border: '1.5px solid #E5E7EB', background: '#fff',
    transition: 'all 0.2s', cursor: 'pointer', textDecoration: 'none', color: 'inherit',
  },
  quickIcon: {
    width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
  },
  activityList: { display: 'flex', flexDirection: 'column', gap: 12 },
  activityItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F3F4F6' },
  activityDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
}

const ACTIVITIES = [
  { text: 'Booking BK-1001 confirmed', color: '#22C55E', time: '2 hours ago' },
  { text: 'Profile updated', color: '#3B82F6', time: '1 day ago' },
  { text: 'Welcome to Hasmir Hotels!', color: '#9333EA', time: '2 days ago' },
]

export default function GuestDashboard() {
  const [booking, setBooking] = useState(FALLBACK_BOOKING)
  const [user] = useState(() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })

  useEffect(() => {
    api.get('/reservations').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      if (data.length > 0) {
        const active = data.find(r =>
          r.reservationStatus === 'Confirmed' || r.reservationStatus === 'Reserved' || r.reservationStatus === 'Checked-In'
        )
        if (active) setBooking(active)
      }
    }).catch(err => console.error(err))
  }, [])

  const name = user?.username || user?.name || 'Guest'

  return (
    <div style={s.page}>
      <div style={s.welcome}>
        <div>
          <h1 style={s.welcomeTitle}>Welcome back, {name}</h1>
          <p style={s.welcomeSub}>Here's an overview of your stay with us</p>
        </div>
        <div style={s.welcomeIcon}><Bell size={28} /></div>
      </div>

      <div style={s.grid}>
        <div style={{ ...s.card, animationDelay: '0ms' }}>
          <div style={s.cardTitle}><Bed size={18} style={{ color: '#3B82F6' }} /> Current Booking</div>
          <div style={s.bookingStatus(booking.reservationStatus)}>
            {booking.reservationStatus}
          </div>
          <div style={{ ...s.bookingGrid, marginTop: 16 }}>
            <div style={s.bookingItem}>
              <span style={s.bookingLabel}>Room</span>
              <span style={s.bookingValue}>{booking.room?.roomType} ({booking.room?.roomNumber})</span>
            </div>
            <div style={s.bookingItem}>
              <span style={s.bookingLabel}>Reference</span>
              <span style={s.bookingValue}>{booking.reservationId}</span>
            </div>
            <div style={s.bookingItem}>
              <span style={s.bookingLabel}>Check-in</span>
              <span style={s.bookingValue}>{booking.checkInDate}</span>
            </div>
            <div style={s.bookingItem}>
              <span style={s.bookingLabel}>Check-out</span>
              <span style={s.bookingValue}>{booking.checkOutDate}</span>
            </div>
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#3B82F6' }}>${booking.totalPrice}</span>
            <Link to="/guest/bookings" className="btn-primary btn-sm">View Details</Link>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ ...s.card, animationDelay: '60ms' }}>
            <div style={s.cardTitle}><Star size={18} style={{ color: '#FACC15' }} /> Quick Actions</div>
            <div style={s.quickLinks}>
              <Link to="/rooms" style={s.quickLink}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.background = '#F8FAFF' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#fff' }}
              >
                <div style={{ ...s.quickIcon, background: '#EFF6FF', color: '#3B82F6' }}><Bed size={22} /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Browse Rooms</div>
                  <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>Explore available rooms</div>
                </div>
              </Link>
              <Link to="/guest/profile" style={s.quickLink}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.background = '#F8FAFF' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#fff' }}
              >
                <div style={{ ...s.quickIcon, background: '#ECFDF5', color: '#22C55E' }}><User size={22} /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>My Profile</div>
                  <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>Manage your account</div>
                </div>
              </Link>
            </div>
          </div>

          <div style={{ ...s.card, animationDelay: '120ms' }}>
            <div style={s.cardTitle}><Clock size={18} style={{ color: '#9333EA' }} /> Recent Activity</div>
            <div style={s.activityList}>
              {ACTIVITIES.map((a, i) => (
                <div key={i} style={{ ...s.activityItem, animationDelay: `${i * 40}ms` }}>
                  <div style={{ ...s.activityDot, background: a.color }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{a.text}</div>
                    <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
