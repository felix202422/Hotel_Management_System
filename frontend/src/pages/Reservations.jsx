import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import api from '../api/axios'

const FICTIOUS = [
  { reservationId: 1, guest: { firstName: 'Alice', lastName: 'Johnson' }, room: { roomNumber: '201' }, checkInDate: '2026-07-28', checkOutDate: '2026-07-31', totalPrice: 1350, reservationStatus: 'Checked-In' },
  { reservationId: 2, guest: { firstName: 'Robert', lastName: 'Chen' }, room: { roomNumber: '102' }, checkInDate: '2026-07-29', checkOutDate: '2026-08-02', totalPrice: 1000, reservationStatus: 'Checked-In' },
  { reservationId: 3, guest: { firstName: 'Maria', lastName: 'Garcia' }, room: { roomNumber: '301' }, checkInDate: '2026-08-01', checkOutDate: '2026-08-05', totalPrice: 2600, reservationStatus: 'Reserved' },
  { reservationId: 4, guest: { firstName: 'James', lastName: 'Wilson' }, room: { roomNumber: '402' }, checkInDate: '2026-07-25', checkOutDate: '2026-07-28', totalPrice: 3600, reservationStatus: 'Checked-Out' },
  { reservationId: 5, guest: { firstName: 'Sophie', lastName: 'Turner' }, room: { roomNumber: '103' }, checkInDate: '2026-07-30', checkOutDate: '2026-08-03', totalPrice: 720, reservationStatus: 'Checked-In' },
  { reservationId: 6, guest: { firstName: 'David', lastName: 'Kim' }, room: { roomNumber: '302' }, checkInDate: '2026-07-27', checkOutDate: '2026-07-30', totalPrice: 1950, reservationStatus: 'Checked-Out' },
  { reservationId: 7, guest: { firstName: 'Emma', lastName: 'Brown' }, room: { roomNumber: '404' }, checkInDate: '2026-08-02', checkOutDate: '2026-08-06', totalPrice: 1800, reservationStatus: 'Reserved' },
  { reservationId: 8, guest: { firstName: 'Michael', lastName: 'Davis' }, room: { roomNumber: '204' }, checkInDate: '2026-07-26', checkOutDate: '2026-07-29', totalPrice: 750, reservationStatus: 'Checked-Out' },
  { reservationId: 9, guest: { firstName: 'Olivia', lastName: 'Martinez' }, room: { roomNumber: '304' }, checkInDate: '2026-07-28', checkOutDate: '2026-08-01', totalPrice: 720, reservationStatus: 'Checked-In' },
  { reservationId: 10, guest: { firstName: 'William', lastName: 'Taylor' }, room: { roomNumber: '202' }, checkInDate: '2026-08-05', checkOutDate: '2026-08-08', totalPrice: 1350, reservationStatus: 'Reserved' },
  { reservationId: 11, guest: { firstName: 'Sarah', lastName: 'Mitchell' }, room: { roomNumber: '203' }, checkInDate: '2026-08-10', checkOutDate: '2026-08-14', totalPrice: 1000, reservationStatus: 'Reserved' },
  { reservationId: 12, guest: { firstName: 'Thomas', lastName: 'Anderson' }, room: { roomNumber: '302' }, checkInDate: '2026-08-03', checkOutDate: '2026-08-06', totalPrice: 1950, reservationStatus: 'Checked-In' },
]

export default function Reservations() {
  const [reservations, setReservations] = useState(FICTIOUS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    api.get('/reservations').then((res) => { if (res.data.length) setReservations(res.data) }).catch(() => {})
  }, [])

  const filtered = reservations.filter(r => {
    const name = `${r.guest?.firstName || ''} ${r.guest?.lastName || ''}`.toLowerCase()
    const room = `room ${r.room?.roomNumber}`.toLowerCase()
    const matchesSearch = name.includes(search.toLowerCase()) || room.includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'All' || r.reservationStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 className="page-title">Reservations</h1>
        <button className="btn-primary">+ New Reservation</button>
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
            <option>Checked-Out</option>
            <option>Cancelled</option>
          </select>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="empty-state">No reservations found</td></tr>
            ) : filtered.map((r) => (
              <tr key={r.reservationId}>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{r.guest?.firstName?.[0]}{r.guest?.lastName?.[0]}</div>
                    <span style={{ fontWeight: 500 }}>{r.guest?.firstName} {r.guest?.lastName}</span>
                  </div>
                </td>
                <td><span className="room-badge">Room {r.room?.roomNumber}</span></td>
                <td>{r.checkInDate}</td>
                <td>{r.checkOutDate}</td>
                <td style={{ fontWeight: 700 }}>${r.totalPrice}</td>
                <td>
                  <span className={`badge badge-${r.reservationStatus === 'Checked-In' ? 'yellow' : r.reservationStatus === 'Reserved' ? 'blue' : r.reservationStatus === 'Cancelled' ? 'red' : 'green'}`}>
                    {r.reservationStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
