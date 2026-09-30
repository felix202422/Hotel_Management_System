import { useState, useEffect } from 'react'
import { Search, Check, X, CalendarCheck } from 'lucide-react'
import api from '../../api/axios'

const FICTIOUS = [
  { reservationId: 1, guest: { firstName: 'Alice', lastName: 'Johnson' }, room: { roomNumber: '201' }, checkInDate: '2026-08-28', checkOutDate: '2026-08-31', totalPrice: 1350, reservationStatus: 'Checked-In' },
  { reservationId: 2, guest: { firstName: 'Robert', lastName: 'Chen' }, room: { roomNumber: '102' }, checkInDate: '2026-08-29', checkOutDate: '2026-09-02', totalPrice: 1000, reservationStatus: 'Checked-In' },
  { reservationId: 3, guest: { firstName: 'Maria', lastName: 'Garcia' }, room: { roomNumber: '301' }, checkInDate: '2026-08-29', checkOutDate: '2026-09-02', totalPrice: 2600, reservationStatus: 'Pending' },
  { reservationId: 4, guest: { firstName: 'James', lastName: 'Wilson' }, room: { roomNumber: '402' }, checkInDate: '2026-08-25', checkOutDate: '2026-08-28', totalPrice: 3600, reservationStatus: 'Checked-Out' },
  { reservationId: 5, guest: { firstName: 'Sophie', lastName: 'Turner' }, room: { roomNumber: '103' }, checkInDate: '2026-08-30', checkOutDate: '2026-09-03', totalPrice: 720, reservationStatus: 'Checked-In' },
  { reservationId: 6, guest: { firstName: 'David', lastName: 'Kim' }, room: { roomNumber: '302' }, checkInDate: '2026-08-27', checkOutDate: '2026-08-30', totalPrice: 1950, reservationStatus: 'Checked-Out' },
  { reservationId: 7, guest: { firstName: 'Emma', lastName: 'Brown' }, room: { roomNumber: '404' }, checkInDate: '2026-08-31', checkOutDate: '2026-09-04', totalPrice: 1800, reservationStatus: 'Pending' },
  { reservationId: 8, guest: { firstName: 'Michael', lastName: 'Davis' }, room: { roomNumber: '204' }, checkInDate: '2026-08-26', checkOutDate: '2026-08-29', totalPrice: 750, reservationStatus: 'Checked-Out' },
  { reservationId: 9, guest: { firstName: 'Olivia', lastName: 'Martinez' }, room: { roomNumber: '304' }, checkInDate: '2026-08-28', checkOutDate: '2026-09-01', totalPrice: 720, reservationStatus: 'Checked-In' },
  { reservationId: 10, guest: { firstName: 'William', lastName: 'Taylor' }, room: { roomNumber: '101' }, checkInDate: '2026-08-29', checkOutDate: '2026-08-31', totalPrice: 500, reservationStatus: 'Pending' },
  { reservationId: 11, guest: { firstName: 'Sarah', lastName: 'Mitchell' }, room: { roomNumber: '203' }, checkInDate: '2026-09-01', checkOutDate: '2026-09-05', totalPrice: 1000, reservationStatus: 'Pending' },
  { reservationId: 12, guest: { firstName: 'Thomas', lastName: 'Anderson' }, room: { roomNumber: '302' }, checkInDate: '2026-08-30', checkOutDate: '2026-09-02', totalPrice: 1950, reservationStatus: 'Checked-In' },
]

const STATUS_BADGE = {
  'Checked-In': 'badge-green',
  'Reserved': 'badge-blue',
  'Checked-Out': 'badge-gray',
  Cancelled: 'badge-red',
  Pending: 'badge-yellow',
}

export default function ManagerReservations() {
  const [reservations, setReservations] = useState(FICTIOUS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    api.get('/reservations').then((res) => { setReservations(Array.isArray(res.data) ? res.data : []) }).catch(err => { console.error(err) })
  }, [])

  const filtered = reservations.filter(r => {
    const name = `${r.guest?.firstName || ''} ${r.guest?.lastName || ''}`.toLowerCase()
    const room = `room ${r.room?.roomNumber}`.toLowerCase()
    const matchesSearch = name.includes(search.toLowerCase()) || room.includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'All' || r.reservationStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleApprove = (id) => {
    setReservations(reservations.map(r => r.reservationId === id ? { ...r, reservationStatus: 'Checked-In' } : r))
  }

  const handleReject = (id) => {
    setReservations(reservations.map(r => r.reservationId === id ? { ...r, reservationStatus: 'Cancelled' } : r))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Reservations</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Manage and track all guest reservations</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
            <input type="text" placeholder="Search reservations..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <select className="booking-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option>All</option>
            <option>Checked-In</option>
            <option>Reserved</option>
            <option>Pending</option>
            <option>Checked-Out</option>
            <option>Cancelled</option>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="empty-state"><CalendarCheck size={40} style={{ color: 'var(--border)', marginBottom: 12 }} /><br />No reservations found</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.reservationId} style={{ animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.03 * i}s` }}>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{r.guest?.firstName?.[0]}{r.guest?.lastName?.[0]}</div>
                    <span style={{ fontWeight: 500 }}>{r.guest?.firstName} {r.guest?.lastName}</span>
                  </div>
                </td>
                <td><span className="room-badge">Room {r.room?.roomNumber}</span></td>
                <td>{r.checkInDate}</td>
                <td>{r.checkOutDate}</td>
                <td style={{ fontWeight: 700 }}>${r.totalPrice?.toLocaleString()}</td>
                <td>
                  <span className={`badge ${STATUS_BADGE[r.reservationStatus] || 'badge-gray'}`}>
                    {r.reservationStatus}
                  </span>
                </td>
                <td>
                  {r.reservationStatus === 'Pending' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-sm btn-success" onClick={() => handleApprove(r.reservationId)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Check size={14} /> Approve
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleReject(r.reservationId)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <X size={14} /> Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}