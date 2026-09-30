import { useState, useEffect } from 'react'
import { Search, Filter, ClipboardCheck } from 'lucide-react'
import api from '../../api/axios'

const FALLBACK = [
  { id: 1, room: { roomNumber: '101' }, assignedStaff: 'Maria Santos', cleaningStatus: 'Pending', assignedDate: '2026-08-29', completedDate: '', notes: 'Guest checkout — full cleaning required' },
  { id: 2, room: { roomNumber: '102' }, assignedStaff: 'John Rivera', cleaningStatus: 'In Progress', assignedDate: '2026-08-29', completedDate: '', notes: 'Routine daily cleaning' },
  { id: 3, room: { roomNumber: '201' }, assignedStaff: 'Lisa Chen', cleaningStatus: 'Completed', assignedDate: '2026-08-29', completedDate: '2026-08-29 10:30', notes: 'Deep clean — used for VIP' },
  { id: 4, room: { roomNumber: '202' }, assignedStaff: 'David Park', cleaningStatus: 'Pending', assignedDate: '2026-08-29', completedDate: '', notes: 'VIP arrival preparation' },
  { id: 5, room: { roomNumber: '301' }, assignedStaff: 'Maria Santos', cleaningStatus: 'Completed', assignedDate: '2026-08-28', completedDate: '2026-08-28 14:20', notes: 'Routine turnover' },
  { id: 6, room: { roomNumber: '302' }, assignedStaff: 'Lisa Chen', cleaningStatus: 'In Progress', assignedDate: '2026-08-29', completedDate: '', notes: 'Checkout cleaning' },
  { id: 7, room: { roomNumber: '401' }, assignedStaff: 'David Park', cleaningStatus: 'Completed', assignedDate: '2026-08-28', completedDate: '2026-08-28 16:45', notes: 'Full room sanitization' },
  { id: 8, room: { roomNumber: '402' }, assignedStaff: 'John Rivera', cleaningStatus: 'Pending', assignedDate: '2026-08-29', completedDate: '', notes: 'Guest reported carpet stains' },
  { id: 9, room: { roomNumber: '103' }, assignedStaff: 'Maria Santos', cleaningStatus: 'In Progress', assignedDate: '2026-08-29', completedDate: '', notes: 'Standard room cleaning' },
  { id: 10, room: { roomNumber: '104' }, assignedStaff: 'Lisa Chen', cleaningStatus: 'Pending', assignedDate: '2026-08-29', completedDate: '', notes: 'Post-maintenance cleanup' },
  { id: 11, room: { roomNumber: '303' }, assignedStaff: 'David Park', cleaningStatus: 'Completed', assignedDate: '2026-08-27', completedDate: '2026-08-27 11:15', notes: 'Standard cleaning' },
  { id: 12, room: { roomNumber: '304' }, assignedStaff: 'John Rivera', cleaningStatus: 'Completed', assignedDate: '2026-08-28', completedDate: '2026-08-28 09:00', notes: 'Checkout clean' },
]

const STATUS_BADGE = {
  Completed: 'badge-green',
  'In Progress': 'badge-yellow',
  Pending: 'badge-gray',
}

export default function HousekeepingTasks() {
  const [tasks, setTasks] = useState(FALLBACK)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    api.get('/housekeeping').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      setTasks(data.length > 0 ? data : FALLBACK)
    }).catch(err => console.error(err))
  }, [])

  const handleStatusChange = (id, newStatus) => {
    const completedDate = newStatus === 'Completed' ? new Date().toISOString().slice(0, 16).replace('T', ' ') : ''
    const updated = tasks.map(t =>
      t.id === id ? { ...t, cleaningStatus: newStatus, completedDate } : t
    )
    setTasks(updated)
    api.patch(`/housekeeping/${id}`, { cleaningStatus: newStatus }).catch(err => console.error(err))
  }

  const filtered = tasks.filter(t => {
    const roomMatch = `room ${t.room?.roomNumber}`.toLowerCase().includes(search.toLowerCase())
    const staffMatch = (t.assignedStaff || '').toLowerCase().includes(search.toLowerCase())
    const statusMatch = filterStatus === 'All' || t.cleaningStatus === filterStatus
    return (roomMatch || staffMatch) && statusMatch
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Cleaning Tasks</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Track and update cleaning task progress across all rooms</p>
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {filtered.length} of {tasks.length} tasks
        </span>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="booking-search" style={{ flex: 1, minWidth: 220 }}>
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search by room or staff..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="booking-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Room</th>
              <th>Status</th>
              <th>Assigned Date</th>
              <th>Completed Date</th>
              <th>Notes</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="empty-state">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                  <ClipboardCheck size={40} style={{ color: 'var(--border)', marginBottom: 12 }} />
                  <span>No tasks match the filters</span>
                </div>
              </td></tr>
            ) : filtered.map((t, i) => (
              <tr key={t.id || t.housekeepingId} style={{ animationDelay: `${i * 40}ms` }}>
                <td style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>#{t.id || t.housekeepingId}</td>
                <td><span className="room-badge">Room {t.room?.roomNumber}</span></td>
                <td>
                  <span className={`badge ${STATUS_BADGE[t.cleaningStatus] || 'badge-gray'}`}>
                    {t.cleaningStatus}
                  </span>
                </td>
                <td style={{ fontSize: '0.82rem' }}>{t.assignedDate}</td>
                <td style={{ fontSize: '0.82rem', color: t.completedDate ? 'var(--text)' : 'var(--text-secondary)' }}>
                  {t.completedDate || '—'}
                </td>
                <td style={{ fontSize: '0.82rem', maxWidth: 200 }}>{t.notes}</td>
                <td>
                  <select
                    className="booking-filter"
                    value={t.cleaningStatus}
                    onChange={(e) => handleStatusChange(t.id || t.housekeepingId, e.target.value)}
                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
