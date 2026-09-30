import { useState, useEffect } from 'react'
import { Search, Sparkles, CheckCircle, Clock } from 'lucide-react'
import api from '../../api/axios'

const FALLBACK = [
  { id: 1, room: { roomNumber: '101' }, assignedStaff: 'Maria Santos', cleaningStatus: 'Pending', assignedDate: '2026-08-29', notes: 'Guest checkout' },
  { id: 2, room: { roomNumber: '102' }, assignedStaff: 'John Rivera', cleaningStatus: 'In Progress', assignedDate: '2026-08-29', notes: 'Routine cleaning' },
  { id: 3, room: { roomNumber: '201' }, assignedStaff: 'Lisa Chen', cleaningStatus: 'Completed', assignedDate: '2026-08-29', notes: 'Deep clean done' },
  { id: 4, room: { roomNumber: '202' }, assignedStaff: 'David Park', cleaningStatus: 'Pending', assignedDate: '2026-08-29', notes: 'VIP arrival prep' },
  { id: 5, room: { roomNumber: '301' }, assignedStaff: 'Maria Santos', cleaningStatus: 'Completed', assignedDate: '2026-08-29', notes: 'Routine turnover' },
  { id: 6, room: { roomNumber: '302' }, assignedStaff: 'Lisa Chen', cleaningStatus: 'In Progress', assignedDate: '2026-08-29', notes: 'Checkout clean' },
  { id: 7, room: { roomNumber: '401' }, assignedStaff: 'David Park', cleaningStatus: 'Completed', assignedDate: '2026-08-28', notes: 'Full sanitization' },
  { id: 8, room: { roomNumber: '402' }, assignedStaff: 'John Rivera', cleaningStatus: 'Pending', assignedDate: '2026-08-29', notes: 'Guest reported stains' },
  { id: 9, room: { roomNumber: '103' }, assignedStaff: 'Maria Santos', cleaningStatus: 'In Progress', assignedDate: '2026-08-29', notes: 'Routine cleaning' },
  { id: 10, room: { roomNumber: '104' }, assignedStaff: 'Lisa Chen', cleaningStatus: 'Pending', assignedDate: '2026-08-29', notes: 'Post-maintenance clean' },
]

const STATUS_STYLE = {
  Pending: { color: '#64748B', bg: '#F1F5F9', border: '#CBD5E1', icon: Clock, label: 'Pending' },
  'In Progress': { color: '#CA8A04', bg: '#FEF9C3', border: '#FDE68A', icon: Sparkles, label: 'In Progress' },
  Completed: { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', icon: CheckCircle, label: 'Completed' },
}

export default function HousekeepingRooms() {
  const [tasks, setTasks] = useState(FALLBACK)
  const [filterStatus, setFilterStatus] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/housekeeping').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      setTasks(data.length > 0 ? data : FALLBACK)
    }).catch(err => console.error(err))
  }, [])

  const handleStatusUpdate = (id, newStatus) => {
    const updated = tasks.map(t => t.id === id ? { ...t, cleaningStatus: newStatus } : t)
    setTasks(updated)
    api.patch(`/housekeeping/${id}`, { cleaningStatus: newStatus }).catch(err => console.error(err))
  }

  const filtered = tasks.filter(t => {
    const roomMatch = `room ${t.room?.roomNumber}`.toLowerCase().includes(search.toLowerCase())
    const staffMatch = (t.assignedStaff || '').toLowerCase().includes(search.toLowerCase())
    const statusMatch = filterStatus === 'All' || t.cleaningStatus === filterStatus
    return (roomMatch || staffMatch) && statusMatch
  })

  const counts = { Pending: 0, 'In Progress': 0, Completed: 0 }
  tasks.forEach(t => { if (counts[t.cleaningStatus] !== undefined) counts[t.cleaningStatus]++ })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">My Assigned Rooms</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>View and manage your assigned room cleaning tasks</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {Object.entries(counts).map(([status, count], i) => {
          const s = STATUS_STYLE[status]
          return (
            <div key={status} style={{
              flex: 1, background: s.bg, borderRadius: 12, padding: 16,
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              border: filterStatus === status ? `2px solid ${s.color}` : '2px solid transparent',
              transition: 'border 0.15s',
              animationDelay: `${i * 60}ms`,
            }} onClick={() => setFilterStatus(filterStatus === status ? 'All' : status)}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, display: 'flex',
                alignItems: 'center', justifyContent: 'center', background: s.color, color: '#fff',
              }}>
                <s.icon size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: s.color }}>{count}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: s.color }}>{status}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="booking-search" style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Search by room or staff..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }} />
          </div>
          <select className="booking-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state">
              <Sparkles size={48} style={{ color: 'var(--border)', marginBottom: 16 }} />
              <p>No rooms match the filters</p>
            </div>
          </div>
        ) : filtered.map((task, i) => {
          const s = STATUS_STYLE[task.cleaningStatus] || STATUS_STYLE.Pending
          const Icon = s.icon
          return (
            <div key={task.id || task.housekeepingId} className="card" style={{
              borderLeft: `4px solid ${s.color}`,
              padding: 20,
              transition: 'transform 0.15s, box-shadow 0.15s',
              animationDelay: `${i * 50}ms`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>Room {task.room?.roomNumber}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>{task.assignedStaff}</div>
                </div>
                <span className={`badge badge-${task.cleaningStatus === 'Completed' ? 'green' : task.cleaningStatus === 'In Progress' ? 'yellow' : 'gray'}`}>
                  {task.cleaningStatus}
                </span>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 10px', marginBottom: 12 }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Notes</div>
                <div style={{ fontSize: '0.82rem', marginTop: 2 }}>{task.notes}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{task.assignedDate}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {task.cleaningStatus === 'Pending' && (
                    <button className="btn btn-sm btn-secondary" onClick={() => handleStatusUpdate(task.id || task.housekeepingId, 'In Progress')}>
                      <Sparkles size={12} /> Start
                    </button>
                  )}
                  {task.cleaningStatus === 'In Progress' && (
                    <button className="btn btn-sm btn-success" onClick={() => handleStatusUpdate(task.id || task.housekeepingId, 'Completed')}>
                      <CheckCircle size={12} /> Complete
                    </button>
                  )}
                  {task.cleaningStatus === 'Completed' && (
                    <span style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle size={14} /> Done
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
