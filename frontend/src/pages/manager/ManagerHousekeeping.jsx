import { useState, useEffect } from 'react'
import { Search, Sparkles } from 'lucide-react'
import api from '../../api/axios'

const FICTIOUS = [
  { housekeepingId: 1, room: { roomNumber: '101' }, assignedStaff: 'Maria Santos', cleanedDate: '2026-08-29', cleaningStatus: 'Completed' },
  { housekeepingId: 2, room: { roomNumber: '102' }, assignedStaff: 'John Kim', cleanedDate: '2026-08-28', cleaningStatus: 'Completed' },
  { housekeepingId: 3, room: { roomNumber: '201' }, assignedStaff: 'Maria Santos', cleanedDate: '', cleaningStatus: 'In Progress' },
  { housekeepingId: 4, room: { roomNumber: '202' }, assignedStaff: 'David Park', cleanedDate: '', cleaningStatus: 'Pending' },
  { housekeepingId: 5, room: { roomNumber: '301' }, assignedStaff: 'John Kim', cleanedDate: '2026-08-27', cleaningStatus: 'Completed' },
  { housekeepingId: 6, room: { roomNumber: '302' }, assignedStaff: 'Maria Santos', cleanedDate: '2026-08-29', cleaningStatus: 'Completed' },
  { housekeepingId: 7, room: { roomNumber: '303' }, assignedStaff: 'David Park', cleanedDate: '', cleaningStatus: 'In Progress' },
  { housekeepingId: 8, room: { roomNumber: '104' }, assignedStaff: 'Lisa Chen', cleanedDate: '', cleaningStatus: 'Pending' },
  { housekeepingId: 9, room: { roomNumber: '304' }, assignedStaff: 'John Kim', cleanedDate: '2026-08-28', cleaningStatus: 'Completed' },
  { housekeepingId: 10, room: { roomNumber: '402' }, assignedStaff: 'Lisa Chen', cleanedDate: '', cleaningStatus: 'Pending' },
  { housekeepingId: 11, room: { roomNumber: '404' }, assignedStaff: 'Maria Santos', cleanedDate: '2026-08-29', cleaningStatus: 'Completed' },
  { housekeepingId: 12, room: { roomNumber: '403' }, assignedStaff: 'David Park', cleanedDate: '', cleaningStatus: 'Pending' },
]

const STATUS_BADGE = {
  Completed: 'badge-green',
  'In Progress': 'badge-yellow',
  Pending: 'badge-gray',
}

export default function ManagerHousekeeping() {
  const [tasks, setTasks] = useState(FICTIOUS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    api.get('/housekeeping').then((res) => { setTasks(Array.isArray(res.data) ? res.data : []) }).catch(err => { console.error(err) })
  }, [])

  const filtered = tasks.filter(t => {
    const room = `room ${t.room?.roomNumber}`.toLowerCase()
    const staff = (t.assignedStaff || '').toLowerCase()
    const matchesSearch = room.includes(search.toLowerCase()) || staff.includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'All' || t.cleaningStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Housekeeping</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Monitor cleaning schedules and room readiness</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
            <input type="text" placeholder="Search by room or staff..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <select className="booking-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option>All</option>
            <option>Completed</option>
            <option>In Progress</option>
            <option>Pending</option>
          </select>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Staff</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="empty-state"><Sparkles size={40} style={{ color: 'var(--border)', marginBottom: 12 }} /><br />No housekeeping tasks found</td></tr>
            ) : filtered.map((t, i) => (
              <tr key={t.housekeepingId} style={{ animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.03 * i}s` }}>
                <td><span className="room-badge">Room {t.room?.roomNumber}</span></td>
                <td style={{ fontWeight: 500 }}>{t.assignedStaff}</td>
                <td>
                  <span className={`badge ${STATUS_BADGE[t.cleaningStatus] || 'badge-gray'}`}>
                    {t.cleaningStatus}
                  </span>
                </td>
                <td>{t.cleanedDate || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}