import { useState, useEffect } from 'react'
import { Calendar, CreditCard, Eye, X, CheckCircle, Clock } from 'lucide-react'
import api from '../../api/axios'

const STATUS_COLORS = {
  Pending: { bg: '#FEF9C3', color: '#CA8A04' },
  Confirmed: { bg: '#ECFDF5', color: '#059669' },
  'Checked-In': { bg: '#EFF6FF', color: '#2563EB' },
  'Checked-Out': { bg: '#F1F5F9', color: '#64748B' },
  Cancelled: { bg: '#FEF2F2', color: '#DC2626' },
}

const FALLBACK = [
  { reservationId: 'BK-1001', room: { roomNumber: '201', roomType: 'Deluxe King' }, checkInDate: '2026-08-15', checkOutDate: '2026-08-19', totalPrice: 1000, reservationStatus: 'Confirmed' },
  { reservationId: 'BK-1002', room: { roomNumber: '301', roomType: 'Suite' }, checkInDate: '2026-07-20', checkOutDate: '2026-07-24', totalPrice: 1800, reservationStatus: 'Checked-Out' },
  { reservationId: 'BK-1003', room: { roomNumber: '102', roomType: 'Standard Twin' }, checkInDate: '2026-09-01', checkOutDate: '2026-09-03', totalPrice: 360, reservationStatus: 'Pending' },
]

const s = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: '1.5rem', fontWeight: 800 },
  card: { background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  tabs: { display: 'flex', gap: 4, padding: '16px 24px', borderBottom: '1px solid #F3F4F6' },
  tab: (active) => ({
    padding: '8px 20px', borderRadius: 10, fontSize: '0.85rem', fontWeight: active ? 700 : 500,
    background: active ? '#EAF3FF' : 'transparent', color: active ? '#3B82F6' : '#6B7280',
    border: 'none', cursor: 'pointer', transition: 'all 0.15s',
  }),
  modal: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  modalCard: {
    background: '#fff', borderRadius: 20, width: '100%', maxWidth: 500, maxHeight: '90vh', overflow: 'auto',
  },
  modalHeader: {
    padding: '20px 24px', borderBottom: '1px solid #F3F4F6',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  modalBody: { padding: 24 },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  infoItem: { display: 'flex', flexDirection: 'column', gap: 4 },
  infoLabel: { fontSize: '0.78rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 },
  infoValue: { fontWeight: 600, fontSize: '0.95rem' },
}

export default function GuestBooking() {
  const [bookings, setBookings] = useState(FALLBACK)
  const [tab, setTab] = useState('All')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.get('/reservations').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      if (data.length > 0) setBookings(data)
    }).catch(err => console.error(err))
  }, [])

  const filtered = tab === 'All' ? bookings : bookings.filter(b => b.reservationStatus === tab)

  const handleCancel = async (id) => {
    try { await api.patch(`/reservations/${id}/cancel`) } catch (err) { console.error(err) }
    setBookings(bookings.map(b => b.reservationId === id ? { ...b, reservationStatus: 'Cancelled' } : b))
    setSelected(null)
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>My Bookings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>View and manage your reservations</p>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.tabs}>
          {['All', 'Pending', 'Confirmed', 'Checked-Out', 'Cancelled'].map(t => (
            <button key={t} style={s.tab(tab === t)} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="booking-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="empty-state">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                    <Calendar size={40} style={{ color: 'var(--border)', marginBottom: 12 }} />
                    <span>No bookings found</span>
                  </div>
                </td></tr>
              ) : filtered.map((b, i) => {
                const st = STATUS_COLORS[b.reservationStatus] || STATUS_COLORS.Pending
                return (
                  <tr key={b.reservationId} style={{ animationDelay: `${i * 40}ms` }}>
                    <td style={{ fontWeight: 600 }}>{b.reservationId}</td>
                    <td>{b.room?.roomType} ({b.room?.roomNumber})</td>
                    <td>{b.checkInDate}</td>
                    <td>{b.checkOutDate}</td>
                    <td style={{ fontWeight: 700, color: '#3B82F6' }}>${b.totalPrice}</td>
                    <td>
                      <span className="badge" style={{ background: st.bg, color: st.color }}>
                        {b.reservationStatus}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-secondary btn-sm" onClick={() => setSelected(b)}>
                          <Eye size={14} /> View
                        </button>
                        {b.reservationStatus === 'Pending' && (
                          <button className="btn-danger btn-sm" onClick={() => handleCancel(b.reservationId)}>
                            <X size={14} /> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={s.modal} onClick={() => setSelected(null)}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h3 style={{ fontWeight: 700 }}>Booking Details</h3>
              <button onClick={() => setSelected(null)} style={{ padding: 4 }}><X size={20} /></button>
            </div>
            <div style={s.modalBody}>
              <div style={{ marginBottom: 16 }}>
                <span className="badge" style={{
                  background: STATUS_COLORS[selected.reservationStatus]?.bg,
                  color: STATUS_COLORS[selected.reservationStatus]?.color,
                  fontSize: '0.85rem', padding: '6px 16px',
                }}>
                  {selected.reservationStatus}
                </span>
              </div>
              <div style={s.infoGrid}>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Reference</span>
                  <span style={s.infoValue}>{selected.reservationId}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Room</span>
                  <span style={s.infoValue}>{selected.room?.roomType}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Room Number</span>
                  <span style={s.infoValue}>{selected.room?.roomNumber}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Check-in</span>
                  <span style={s.infoValue}>{selected.checkInDate}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Check-out</span>
                  <span style={s.infoValue}>{selected.checkOutDate}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.infoLabel}>Total</span>
                  <span style={{ ...s.infoValue, color: '#3B82F6', fontSize: '1.2rem' }}>${selected.totalPrice}</span>
                </div>
              </div>
              {selected.reservationStatus === 'Pending' && (
                <button className="btn-danger" style={{ width: '100%', justifyContent: 'center', marginTop: 20, padding: '12px', borderRadius: 12 }}
                  onClick={() => handleCancel(selected.reservationId)}>
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
