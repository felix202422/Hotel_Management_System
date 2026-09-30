import { useState, useEffect } from 'react'
import { Search, CalendarCheck, LogIn, LogOut, XCircle, Package } from 'lucide-react'
import api from '../../api/axios'

const STATUS_MAP = {
  'Reserved': 'blue',
  'CHECKED_IN': 'yellow',
  'CHECKED_OUT': 'green',
  'CANCELLED': 'red',
  'Checked-In': 'yellow',
  'Checked-Out': 'green',
  'Cancelled': 'red',
}

const fmt = (v) => `$${(v || 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function AdminReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    setLoading(true)
    api.get('/reservations')
      .then(res => { setReservations(Array.isArray(res.data) ? res.data : []) })
      .catch(err => { console.error(err); setReservations([]) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = reservations.filter(r => {
    const guestName = `${r.guest?.firstName || ''} ${r.guest?.lastName || ''}`.toLowerCase()
    const roomNum = r.room?.roomNumber?.toString() || ''
    const matchSearch = guestName.includes(search.toLowerCase()) || roomNum.includes(search)
    const matchStatus = statusFilter === 'All' || r.reservationStatus === statusFilter
    return matchSearch && matchStatus
  })

  const handleCheckin = async (id) => {
    try {
      await api.put(`/reservations/${id}/checkin`)
      setReservations(reservations.map(r => r.reservationId === id ? { ...r, reservationStatus: 'CHECKED_IN' } : r))
    } catch (err) {
      alert(err?.response?.data?.message || 'Check-in failed')
    }
  }

  const handleCheckout = async (id) => {
    try {
      await api.put(`/reservations/${id}/checkout`)
      setReservations(reservations.map(r => r.reservationId === id ? { ...r, reservationStatus: 'CHECKED_OUT' } : r))
    } catch (err) {
      alert(err?.response?.data?.message || 'Check-out failed')
    }
  }

  const handleCancel = async (id) => {
    if (!confirm('Cancel this reservation?')) return
    try {
      await api.put(`/reservations/${id}/cancel`)
      setReservations(reservations.map(r => r.reservationId === id ? { ...r, reservationStatus: 'CANCELLED' } : r))
    } catch (err) {
      alert(err?.response?.data?.message || 'Cancel failed')
    }
  }

  const renderActions = (r) => {
    const status = r.reservationStatus
    if (status === 'Reserved' || status === 'RESERVED') {
      return (
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn-icon" onClick={() => handleCheckin(r.reservationId)} title="Check In" style={{ color: 'var(--success)' }}><LogIn size={15} /></button>
          <button className="btn-icon" onClick={() => handleCancel(r.reservationId)} title="Cancel" style={{ color: 'var(--danger)' }}><XCircle size={15} /></button>
        </div>
      )
    }
    if (status === 'Checked-In' || status === 'CHECKED_IN') {
      return (
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn-icon" onClick={() => handleCheckout(r.reservationId)} title="Check Out" style={{ color: '#FACC15' }}><LogOut size={15} /></button>
          <button className="btn-icon" onClick={() => handleCancel(r.reservationId)} title="Cancel" style={{ color: 'var(--danger)' }}><XCircle size={15} /></button>
        </div>
      )
    }
    return null
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 className="page-title">Reservations</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>View and manage all booking reservations</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <CalendarCheck size={16} /> {reservations.length} total reservations
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="booking-search" style={{ flex: 1, minWidth: 220 }}>
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search by guest or room..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="booking-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Reserved">Reserved</option>
            <option value="Checked-In">Checked-In</option>
            <option value="Checked-Out">Checked-Out</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Total</th>
              <th>Status</th>
              <th style={{ width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="empty-state">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7}><div className="empty-state"><Package size={48} style={{opacity:0.3, marginBottom:12}} /><p>No reservations found</p></div></td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.reservationId || r.id} style={{ animationDelay: i * 0.03 + 's' }}>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{r.guest?.firstName?.[0]}{r.guest?.lastName?.[0]}</div>
                    <span style={{ fontWeight: 600 }}>{r.guest?.firstName} {r.guest?.lastName}</span>
                  </div>
                </td>
                <td><span className="room-badge">Room {r.room?.roomNumber}</span></td>
                <td>{r.checkInDate}</td>
                <td>{r.checkOutDate}</td>
                <td style={{ fontWeight: 600 }}>{fmt(r.totalPrice)}</td>
                <td>
                  <span className={`badge badge-${STATUS_MAP[r.reservationStatus] || 'gray'}`}>
                    {r.reservationStatus}
                  </span>
                </td>
                <td>{renderActions(r)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
