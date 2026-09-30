import { useState, useEffect } from 'react'
import { Search, Plus, Wrench } from 'lucide-react'
import api from '../../api/axios'

const FICTIOUS = [
  { maintenanceId: 1, room: { roomNumber: '104' }, description: 'Leaking faucet in bathroom needs repair', priority: 'High', assignedTo: 'John Kim', status: 'PENDING', date: '2026-08-29' },
  { maintenanceId: 2, room: { roomNumber: '202' }, description: 'AC unit not cooling properly', priority: 'Critical', assignedTo: 'David Park', status: 'IN_PROGRESS', date: '2026-08-28' },
  { maintenanceId: 3, room: { roomNumber: '301' }, description: 'Light bulb replacement in hallway', priority: 'Low', assignedTo: 'Lisa Chen', status: 'COMPLETED', date: '2026-08-27' },
  { maintenanceId: 4, room: { roomNumber: '403' }, description: 'Carpet stain removal in living area', priority: 'Medium', assignedTo: 'Maria Santos', status: 'IN_PROGRESS', date: '2026-08-29' },
  { maintenanceId: 5, room: { roomNumber: '101' }, description: 'Door lock mechanism stuck', priority: 'High', assignedTo: 'John Kim', status: 'COMPLETED', date: '2026-08-26' },
  { maintenanceId: 6, room: { roomNumber: '203' }, description: 'Window blinds damaged', priority: 'Low', assignedTo: '', status: 'PENDING', date: '2026-08-28' },
  { maintenanceId: 7, room: { roomNumber: '303' }, description: 'Television remote not working', priority: 'Low', assignedTo: 'Lisa Chen', status: 'COMPLETED', date: '2026-08-25' },
  { maintenanceId: 8, room: { roomNumber: '401' }, description: 'Water heater intermittent failure', priority: 'High', assignedTo: 'John Kim', status: 'IN_PROGRESS', date: '2026-08-29' },
  { maintenanceId: 9, room: { roomNumber: '102' }, description: 'Mini-fridge making unusual noise', priority: 'Medium', assignedTo: 'Maria Santos', status: 'ASSIGNED', date: '2026-08-28' },
  { maintenanceId: 10, room: { roomNumber: '204' }, description: 'Bathroom grout needs resealing', priority: 'Low', assignedTo: 'David Park', status: 'COMPLETED', date: '2026-08-27' },
]

const STATUSES = ['All', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED']
const PRIORITIES = ['All', 'Critical', 'High', 'Medium', 'Low']

const statusBadge = (s) => {
  const map = { PENDING: 'yellow', ASSIGNED: 'blue', IN_PROGRESS: 'yellow', COMPLETED: 'green' }
  return map[s] || 'gray'
}

const priorityBadge = (p) => {
  const map = { Low: 'gray', Medium: 'blue', High: 'yellow', Critical: 'red' }
  return map[p] || 'gray'
}

export default function MaintenanceRequests() {
  const [requests, setRequests] = useState(FICTIOUS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')

  useEffect(() => {
    api.get('/maintenance').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      if (data.length > 0) setRequests(data)
    }).catch(err => console.error(err))
  }, [])

  const filtered = requests.filter(r => {
    const roomNum = r.room?.roomNumber || r.room || ''
    const assigned = r.assignedTo || r.assignedStaff || ''
    const matchesSearch = r.description.toLowerCase().includes(search.toLowerCase()) ||
      `room ${roomNum}`.toLowerCase().includes(search.toLowerCase()) ||
      assigned.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus
    const matchesPriority = filterPriority === 'All' || r.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleAccept = (id) => {
    setRequests(prev => prev.map(r => r.maintenanceId === id ? { ...r, status: 'IN_PROGRESS' } : r))
    api.put(`/maintenance/${id}/status`, { status: 'IN_PROGRESS' }).catch(err => console.error(err))
  }

  const handleUpdateStatus = (id, newStatus) => {
    setRequests(prev => prev.map(r => r.maintenanceId === id ? { ...r, status: newStatus } : r))
    api.put(`/maintenance/${id}/status`, { status: newStatus }).catch(err => console.error(err))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Maintenance Requests</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Manage and track all maintenance requests</p>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="kpi-card" style={{ animationDelay: '0ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><Wrench size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{requests.length}</div>
            <div className="kpi-label">Total Requests</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '60ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><Wrench size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{requests.filter(r => r.status === 'PENDING').length}</div>
            <div className="kpi-label">Pending</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '120ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff' }}><Wrench size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{requests.filter(r => r.status === 'IN_PROGRESS').length}</div>
            <div className="kpi-label">In Progress</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '180ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><Wrench size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{requests.filter(r => r.status === 'COMPLETED').length}</div>
            <div className="kpi-label">Completed</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
            <input type="text" placeholder="Search requests..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <select className="booking-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s.replace('_', ' ')}</option>)}
            </select>
            <select className="booking-filter" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p === 'All' ? 'All Priorities' : p}</option>)}
            </select>
          </div>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Room</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Reported Date</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="empty-state">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                  <Wrench size={40} style={{ color: 'var(--border)', marginBottom: 12 }} />
                  <span>No maintenance requests found</span>
                </div>
              </td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.maintenanceId} style={{ animationDelay: `${i * 40}ms` }}>
                <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>MR-{String(r.maintenanceId).padStart(3, '0')}</td>
                <td><span className="room-badge">Room {r.room?.roomNumber || r.room}</span></td>
                <td style={{ maxWidth: 220 }}>{r.description}</td>
                <td><span className={`badge badge-${priorityBadge(r.priority)}`}>{r.priority}</span></td>
                <td><span className={`badge badge-${statusBadge(r.status)}`}>{r.status.replace('_', ' ')}</span></td>
                <td style={{ color: 'var(--text-secondary)' }}>{r.date || r.reportedDate}</td>
                <td>{r.assignedTo || r.assignedStaff || <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Unassigned</span>}</td>
                <td>
                  {r.status === 'PENDING' && (
                    <button className="btn btn-sm btn-primary" onClick={() => handleAccept(r.maintenanceId)}>
                      Accept
                    </button>
                  )}
                  {r.status === 'ASSIGNED' && (
                    <button className="btn btn-sm btn-primary" onClick={() => handleUpdateStatus(r.maintenanceId, 'IN_PROGRESS')}>
                      Start
                    </button>
                  )}
                  {r.status === 'IN_PROGRESS' && (
                    <button className="btn btn-sm btn-success" onClick={() => handleUpdateStatus(r.maintenanceId, 'COMPLETED')}>
                      Complete
                    </button>
                  )}
                  {r.status === 'COMPLETED' && (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Done</span>
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
