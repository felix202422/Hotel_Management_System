import { useState, useEffect } from 'react'
import { Search, Bed } from 'lucide-react'
import api from '../../api/axios'

const FICTIOUS = [
  { roomId: 1, roomNumber: '101', roomType: 'Deluxe King', floor: 1, capacity: 2, pricePerNight: 250, roomStatus: 'Available' },
  { roomId: 2, roomNumber: '102', roomType: 'Deluxe King', floor: 1, capacity: 2, pricePerNight: 250, roomStatus: 'Occupied' },
  { roomId: 3, roomNumber: '201', roomType: 'Suite', floor: 2, capacity: 4, pricePerNight: 450, roomStatus: 'Occupied' },
  { roomId: 4, roomNumber: '202', roomType: 'Suite', floor: 2, capacity: 4, pricePerNight: 450, roomStatus: 'Available' },
  { roomId: 5, roomNumber: '301', roomType: 'Executive Suite', floor: 3, capacity: 4, pricePerNight: 650, roomStatus: 'Occupied' },
  { roomId: 6, roomNumber: '302', roomType: 'Executive Suite', floor: 3, capacity: 4, pricePerNight: 650, roomStatus: 'Occupied' },
  { roomId: 7, roomNumber: '401', roomType: 'Penthouse', floor: 4, capacity: 6, pricePerNight: 1200, roomStatus: 'Available' },
  { roomId: 8, roomNumber: '402', roomType: 'Penthouse', floor: 4, capacity: 6, pricePerNight: 1200, roomStatus: 'Occupied' },
  { roomId: 9, roomNumber: '103', roomType: 'Standard Twin', floor: 1, capacity: 2, pricePerNight: 180, roomStatus: 'Occupied' },
  { roomId: 10, roomNumber: '104', roomType: 'Standard Twin', floor: 1, capacity: 2, pricePerNight: 180, roomStatus: 'Not Ready' },
  { roomId: 11, roomNumber: '203', roomType: 'Deluxe King', floor: 2, capacity: 2, pricePerNight: 250, roomStatus: 'Available' },
  { roomId: 12, roomNumber: '204', roomType: 'Deluxe King', floor: 2, capacity: 2, pricePerNight: 250, roomStatus: 'Occupied' },
  { roomId: 13, roomNumber: '303', roomType: 'Suite', floor: 3, capacity: 4, pricePerNight: 450, roomStatus: 'Available' },
  { roomId: 14, roomNumber: '304', roomType: 'Standard Twin', floor: 3, capacity: 2, pricePerNight: 180, roomStatus: 'Occupied' },
  { roomId: 15, roomNumber: '403', roomType: 'Deluxe King', floor: 4, capacity: 2, pricePerNight: 250, roomStatus: 'Reserved' },
  { roomId: 16, roomNumber: '404', roomType: 'Suite', floor: 4, capacity: 4, pricePerNight: 450, roomStatus: 'Occupied' },
]

const STATUS_MAP = {
  Available: { badge: 'badge-green', label: 'Available' },
  Occupied: { badge: 'badge-yellow', label: 'Occupied' },
  Reserved: { badge: 'badge-blue', label: 'Reserved' },
  'Not Ready': { badge: 'badge-red', label: 'Not Ready' },
}

export default function ManagerRooms() {
  const [rooms, setRooms] = useState(FICTIOUS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    api.get('/rooms').then((res) => { setRooms(Array.isArray(res.data) ? res.data : []) }).catch(err => { console.error(err) })
  }, [])

  const filtered = rooms.filter((r) => {
    const matchSearch = r.roomNumber.includes(search) || r.roomType.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || r.roomStatus === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Rooms</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>View and manage room inventory across all floors</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
            <input type="text" placeholder="Search rooms..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <select className="booking-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option>All</option>
            <option>Available</option>
            <option>Occupied</option>
            <option>Reserved</option>
            <option>Not Ready</option>
          </select>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Room #</th>
              <th>Type</th>
              <th>Floor</th>
              <th>Capacity</th>
              <th>Price/Night</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="empty-state"><Bed size={40} style={{ color: 'var(--border)', marginBottom: 12 }} /><br />No rooms found</td></tr>
            ) : filtered.map((room, i) => {
              const status = STATUS_MAP[room.roomStatus] || { badge: 'badge-gray', label: room.roomStatus }
              return (
                <tr key={room.roomId} style={{ animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.03 * i}s` }}>
                  <td><span className="room-badge">{room.roomNumber}</span></td>
                  <td style={{ fontWeight: 600 }}>{room.roomType}</td>
                  <td>Floor {room.floor}</td>
                  <td>{room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</td>
                  <td style={{ fontWeight: 700 }}>${room.pricePerNight}</td>
                  <td><span className={`badge ${status.badge}`}>{status.label}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}