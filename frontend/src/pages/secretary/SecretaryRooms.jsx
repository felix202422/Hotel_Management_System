import { useState, useEffect } from 'react'
import { Search, Filter, Bed } from 'lucide-react'
import api from '../../api/axios'

const STATUS_COLORS = { Available: '#22c55e', Occupied: '#3b82f6', Reserved: '#eab308', 'Not Ready': '#ef4444' }
const STATUS_BG = { Available: '#f0fdf4', Occupied: '#eff6ff', Reserved: '#fefce8', 'Not Ready': '#fef2f2' }

export default function SecretaryRooms() {
  const [rooms, setRooms] = useState([])
  const [search, setSearch] = useState('')
  const [filterFloor, setFilterFloor] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    api.get('/rooms').then(res => {
      setRooms(Array.isArray(res.data) ? res.data : [])
    }).catch(err => console.error(err))
  }, [])

  const floors = [...new Set(rooms.map(r => r.floor))].sort()
  const types = [...new Set(rooms.map(r => r.roomType))].sort()

  const filtered = rooms.filter(r => {
    const matchSearch = r.roomNumber.includes(search) || r.roomType.toLowerCase().includes(search.toLowerCase())
    const matchFloor = filterFloor === 'All' || r.floor === Number(filterFloor)
    const matchType = filterType === 'All' || r.roomType === filterType
    const matchStatus = filterStatus === 'All' || r.roomStatus === filterStatus
    return matchSearch && matchFloor && matchType && matchStatus
  })

  const counts = { Available: 0, Occupied: 0, Reserved: 0, 'Not Ready': 0 }
  rooms.forEach(r => { if (counts[r.roomStatus] !== undefined) counts[r.roomStatus]++ })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Room Availability</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Check real-time room status across all floors</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {Object.entries(counts).map(([status, count], i) => (
          <div key={status} style={{ flex: 1, background: STATUS_BG[status], borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: `${0.1 + i * 0.1}s` }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_COLORS[status] }} />
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{count}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{status}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Search rooms..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 200 }} />
          </div>
          <select className="booking-filter" value={filterFloor} onChange={(e) => setFilterFloor(e.target.value)}>
            <option value="All">All Floors</option>
            {floors.map(f => <option key={f} value={f}>Floor {f}</option>)}
          </select>
          <select className="booking-filter" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="booking-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option>Available</option>
            <option>Occupied</option>
            <option>Reserved</option>
            <option>Not Ready</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state"><Bed size={40} style={{ color: 'var(--border)', marginBottom: 12 }} /><br />No rooms match the filters</div>
          </div>
        ) : filtered.map((room, i) => (
          <div key={room.roomId} className="card" style={{
            borderLeft: `4px solid ${STATUS_COLORS[room.roomStatus]}`,
            padding: 20,
            transition: 'transform 0.15s, box-shadow 0.15s',
            animation: 'fadeInUp 0.4s ease forwards', opacity: 0, animationDelay: `${0.03 * i}s`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Room {room.roomNumber}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>{room.roomType}</div>
              </div>
              <span className={`badge badge-${room.roomStatus === 'Available' ? 'green' : room.roomStatus === 'Occupied' ? 'yellow' : room.roomStatus === 'Reserved' ? 'blue' : 'gray'}`}>
                {room.roomStatus}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              <div style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Floor</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{room.floor}</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Capacity</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{room.capacity} guests</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Per night</span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>${room.pricePerNight}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}