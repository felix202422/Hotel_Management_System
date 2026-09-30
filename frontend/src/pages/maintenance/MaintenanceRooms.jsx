import { useState, useEffect } from 'react'
import { BedDouble, AlertTriangle, Wrench, Search } from 'lucide-react'
import api from '../../api/axios'

const FICTIOUS_ROOMS = [
  { roomId: 10, roomNumber: '104', roomType: 'Standard Twin', floor: 1, capacity: 2, pricePerNight: 180, roomStatus: 'Not Ready', maintenanceIssue: 'Leaking faucet in bathroom needs repair', priority: 'High' },
  { roomId: 5, roomNumber: '301', roomType: 'Executive Suite', floor: 3, capacity: 4, pricePerNight: 650, roomStatus: 'Not Ready', maintenanceIssue: 'Water heater intermittent failure', priority: 'High' },
  { roomId: 15, roomNumber: '403', roomType: 'Deluxe King', floor: 4, capacity: 2, pricePerNight: 250, roomStatus: 'Not Ready', maintenanceIssue: 'Carpet stain removal in living area', priority: 'Medium' },
  { roomId: 2, roomNumber: '102', roomType: 'Deluxe King', floor: 1, capacity: 2, pricePerNight: 250, roomStatus: 'Occupied', maintenanceIssue: 'Mini-fridge making unusual noise', priority: 'Medium' },
  { roomId: 12, roomNumber: '204', roomType: 'Deluxe King', floor: 2, capacity: 2, pricePerNight: 250, roomStatus: 'Occupied', maintenanceIssue: 'Bathroom grout needs resealing', priority: 'Low' },
]

const PRIORITY_BADGE = { Critical: 'badge-red', High: 'badge-yellow', Medium: 'badge-blue', Low: 'badge-gray' }

export default function MaintenanceRooms() {
  const [rooms, setRooms] = useState(FICTIOUS_ROOMS)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/rooms').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      if (data.length > 0) {
        const maintenanceRooms = data.filter(r =>
          r.roomStatus === 'Not Ready' || r.roomStatus === 'Maintenance'
        )
        if (maintenanceRooms.length > 0) {
          setRooms(maintenanceRooms.map(r => ({
            ...r,
            maintenanceIssue: 'Maintenance in progress',
            priority: 'Medium',
          })))
        }
      }
    }).catch(err => console.error(err))
  }, [])

  const filtered = rooms.filter(r => {
    const roomNum = `room ${r.roomNumber}`.toLowerCase()
    const issue = (r.maintenanceIssue || '').toLowerCase()
    const type = (r.roomType || '').toLowerCase()
    return roomNum.includes(search.toLowerCase()) || issue.includes(search.toLowerCase()) || type.includes(search.toLowerCase())
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Rooms Under Maintenance</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Track rooms with active maintenance issues</p>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <div className="kpi-card" style={{ animationDelay: '0ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff' }}><AlertTriangle size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{rooms.length}</div>
            <div className="kpi-label">Total Under Maintenance</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '60ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><Wrench size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{rooms.filter(r => r.priority === 'High' || r.priority === 'Critical').length}</div>
            <div className="kpi-label">High/Critical Priority</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '120ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><BedDouble size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{rooms.filter(r => r.roomStatus === 'Not Ready').length}</div>
            <div className="kpi-label">Out of Service</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="booking-search" style={{ position: 'relative', maxWidth: 320 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
          <input type="text" placeholder="Search rooms or issues..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: '100%' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state">
              <BedDouble size={48} style={{ color: 'var(--border)', marginBottom: 16 }} />
              <p>No rooms under maintenance</p>
            </div>
          </div>
        ) : filtered.map((room, i) => (
          <div key={room.roomId} className="card" style={{ padding: 20, animationDelay: `${i * 50}ms` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: room.roomStatus === 'Not Ready' ? '#fef2f2' : '#eff6ff',
                  color: room.roomStatus === 'Not Ready' ? '#dc2626' : '#2563eb',
                }}>
                  <BedDouble size={20} />
                </div>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>Room {room.roomNumber}</span>
                  <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{room.roomType}</span>
                </div>
              </div>
              <span className={`badge badge-${room.roomStatus === 'Not Ready' ? 'red' : 'yellow'}`}>{room.roomStatus}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Floor</span>
                <span style={{ fontWeight: 600 }}>{room.floor}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Capacity</span>
                <span style={{ fontWeight: 600 }}>{room.capacity} guests</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Price/Night</span>
                <span style={{ fontWeight: 600 }}>${room.pricePerNight}</span>
              </div>
            </div>

            {room.maintenanceIssue && (
              <div style={{ background: '#fffbeb', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <AlertTriangle size={14} style={{ color: '#d97706' }} />
                  <span style={{ fontWeight: 600, fontSize: '0.78rem', color: '#d97706' }}>Maintenance Issue</span>
                  {room.priority && <span className={`badge badge-sm badge-${PRIORITY_BADGE[room.priority]?.replace('badge-', '') || 'gray'}`} style={{ marginLeft: 'auto' }}>{room.priority}</span>}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{room.maintenanceIssue}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
