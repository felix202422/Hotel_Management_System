import { useState, useEffect } from 'react'
import { Search, Wrench } from 'lucide-react'
import api from '../../api/axios'

const STATUS_BADGE = {
  Completed: 'badge-green',
  'In Progress': 'badge-yellow',
  Pending: 'badge-red',
}

const PRIORITY_BADGE = {
  High: 'badge-red',
  Medium: 'badge-yellow',
  Low: 'badge-gray',
}

export default function ManagerMaintenance() {
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    api.get('/maintenance')
      .then((res) => { setTasks(Array.isArray(res.data) ? res.data : []) })
      .catch(err => { console.error(err) })
  }, [])

  const filtered = tasks.filter(t => {
    const room = `room ${t.room?.roomNumber}`.toLowerCase()
    const desc = (t.description || '').toLowerCase()
    const staff = (t.assignedTo || t.assignedStaff || '').toLowerCase()
    const matchesSearch = room.includes(search.toLowerCase()) || desc.includes(search.toLowerCase()) || staff.includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Maintenance</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Track maintenance requests and repair schedules</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
            <input type="text" placeholder="Search maintenance tasks..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <select className="booking-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option>All</option>
            <option>In Progress</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Staff</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="empty-state"><Wrench size={40} style={{ color: 'var(--border)', marginBottom: 12 }} /><br />No maintenance tasks found</td></tr>
            ) : filtered.map((t, i) => (
              <tr key={t.maintenanceId} style={{ animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.03 * i}s` }}>
                <td><span className="room-badge">Room {t.room?.roomNumber}</span></td>
                <td style={{ maxWidth: 300 }}>{t.description}</td>
                <td><span className={`badge ${PRIORITY_BADGE[t.priority] || 'badge-gray'}`}>{t.priority}</span></td>
                <td style={{ fontWeight: 500 }}>{t.assignedTo || t.assignedStaff}</td>
                <td><span className={`badge ${STATUS_BADGE[t.status] || 'badge-gray'}`}>{t.status}</span></td>
                <td>{t.reportedDate || t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}