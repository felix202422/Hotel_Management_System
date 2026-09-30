import { useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'
import Modal from '../components/Modal'

const ROOM_TYPES = ['Standard Twin', 'Deluxe King', 'Suite', 'Executive Suite', 'Penthouse']

export default function Rooms() {
  const [rooms, setRooms] = useState([
    { roomId: 1, roomNumber: '101', roomType: 'Deluxe King', floor: 1, capacity: 2, pricePerNight: 250, roomStatus: 'Available' },
    { roomId: 2, roomNumber: '102', roomType: 'Deluxe King', floor: 1, capacity: 2, pricePerNight: 250, roomStatus: 'Occupied' },
    { roomId: 3, roomNumber: '201', roomType: 'Suite', floor: 2, capacity: 4, pricePerNight: 450, roomStatus: 'Occupied' },
    { roomId: 4, roomNumber: '202', roomType: 'Suite', floor: 2, capacity: 4, pricePerNight: 450, roomStatus: 'Available' },
    { roomId: 5, roomNumber: '301', roomType: 'Executive Suite', floor: 3, capacity: 4, pricePerNight: 650, roomStatus: 'Reserved' },
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
  ])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ roomNumber: '', roomType: 'Standard Twin', floor: 1, capacity: 2, pricePerNight: 200 })

  const filtered = rooms.filter((r) => {
    const matchSearch = r.roomNumber.includes(search) || r.roomType.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || r.roomStatus === filterStatus
    return matchSearch && matchStatus
  })

  const addRoom = () => {
    if (!form.roomNumber.trim()) return
    setRooms([...rooms, { roomId: rooms.length + 1, ...form, pricePerNight: Number(form.pricePerNight), floor: Number(form.floor), capacity: Number(form.capacity), roomStatus: 'Available' }])
    setModalOpen(false)
    setForm({ roomNumber: '', roomType: 'Standard Twin', floor: 1, capacity: 2, pricePerNight: 200 })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 className="page-title">Rooms</h1>
        <button className="btn-primary" onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> Add Room
        </button>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Room">
        <div className="form-group"><label>Room Number</label><input value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} placeholder="e.g. 501" /></div>
        <div className="form-group">
          <label>Room Type</label>
          <select value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })} className="booking-filter" style={{ width: '100%' }}>
            {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group"><label>Floor</label><input type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} /></div>
          <div className="form-group"><label>Capacity</label><input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
        </div>
        <div className="form-group"><label>Price per Night ($)</label><input type="number" value={form.pricePerNight} onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })} /></div>
        <button className="btn-primary" onClick={addRoom} style={{ width: '100%' }}>Add Room</button>
      </Modal>

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
              <tr><td colSpan={6} className="empty-state">No rooms found</td></tr>
            ) : filtered.map((room) => (
              <tr key={room.roomId}>
                <td><span className="room-badge">{room.roomNumber}</span></td>
                <td style={{ fontWeight: 600 }}>{room.roomType}</td>
                <td>Floor {room.floor}</td>
                <td>{room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</td>
                <td style={{ fontWeight: 700 }}>${room.pricePerNight}</td>
                <td><span className={`badge badge-${room.roomStatus === 'Available' ? 'green' : room.roomStatus === 'Occupied' ? 'yellow' : room.roomStatus === 'Reserved' ? 'blue' : 'gray'}`}>{room.roomStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
