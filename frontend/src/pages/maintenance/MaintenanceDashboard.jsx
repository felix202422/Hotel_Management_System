import { useState, useEffect } from 'react'
import {
  Wrench, Clock, CheckCircle2, AlertTriangle, Hammer,
  ArrowRight, Plus, ClipboardList, BarChart3
} from 'lucide-react'
import api from '../../api/axios'

const FICTIOUS = [
  { maintenanceId: 1, room: { roomNumber: '104', roomType: 'Standard Twin' }, description: 'Leaking faucet in bathroom needs repair', priority: 'High', assignedStaff: 'John Kim', status: 'PENDING', date: '2026-08-29' },
  { maintenanceId: 2, room: { roomNumber: '202', roomType: 'Suite' }, description: 'AC unit not cooling properly', priority: 'Critical', assignedStaff: 'David Park', status: 'IN_PROGRESS', date: '2026-08-28' },
  { maintenanceId: 3, room: { roomNumber: '301', roomType: 'Executive Suite' }, description: 'Light bulb replacement in hallway', priority: 'Low', assignedStaff: 'Lisa Chen', status: 'COMPLETED', date: '2026-08-27' },
  { maintenanceId: 4, room: { roomNumber: '403', roomType: 'Deluxe King' }, description: 'Carpet stain removal in living area', priority: 'Medium', assignedStaff: 'Maria Santos', status: 'IN_PROGRESS', date: '2026-08-29' },
  { maintenanceId: 5, room: { roomNumber: '101', roomType: 'Deluxe King' }, description: 'Door lock mechanism stuck', priority: 'High', assignedStaff: 'John Kim', status: 'COMPLETED', date: '2026-08-26' },
  { maintenanceId: 6, room: { roomNumber: '203', roomType: 'Deluxe King' }, description: 'Window blinds damaged', priority: 'Low', assignedStaff: 'David Park', status: 'PENDING', date: '2026-08-28' },
  { maintenanceId: 7, room: { roomNumber: '303', roomType: 'Suite' }, description: 'Television remote not working', priority: 'Low', assignedStaff: 'Lisa Chen', status: 'COMPLETED', date: '2026-08-25' },
  { maintenanceId: 8, room: { roomNumber: '401', roomType: 'Penthouse' }, description: 'Water heater intermittent failure', priority: 'High', assignedStaff: 'John Kim', status: 'IN_PROGRESS', date: '2026-08-29' },
  { maintenanceId: 9, room: { roomNumber: '102', roomType: 'Deluxe King' }, description: 'Mini-fridge making unusual noise', priority: 'Medium', assignedStaff: 'Maria Santos', status: 'ASSIGNED', date: '2026-08-28' },
  { maintenanceId: 10, room: { roomNumber: '204', roomType: 'Deluxe King' }, description: 'Bathroom grout needs resealing', priority: 'Low', assignedStaff: 'David Park', status: 'COMPLETED', date: '2026-08-27' },
]

const STATUS_BADGE = {
  COMPLETED: 'badge-green',
  IN_PROGRESS: 'badge-yellow',
  ASSIGNED: 'badge-blue',
  PENDING: 'badge-red',
}

const PRIORITY_BADGE = {
  Critical: 'badge-red',
  High: 'badge-yellow',
  Medium: 'badge-blue',
  Low: 'badge-gray',
}

export default function MaintenanceDashboard() {
  const [requests, setRequests] = useState(FICTIOUS)
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  useEffect(() => {
    Promise.all([
      api.get('/maintenance').catch(() => ({ data: [] })),
      api.get('/rooms').catch(() => ({ data: [] })),
    ]).then(([maintenanceRes, roomsRes]) => {
      const maintData = Array.isArray(maintenanceRes.data) ? maintenanceRes.data : []
      if (maintData.length > 0) setRequests(maintData)
    }).catch(err => console.error(err))
  }, [])

  const pending = requests.filter(r => r.status === 'PENDING').length
  const inProgress = requests.filter(r => r.status === 'IN_PROGRESS').length
  const completed = requests.filter(r => r.status === 'COMPLETED').length
  const totalActive = pending + requests.filter(r => r.status === 'ASSIGNED').length

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const name = user?.username || 'Technician'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #F59E0B, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Wrench size={22} />
            </div>
            <div>
              <h1 className="page-title" style={{ marginBottom: 0 }}>Maintenance Dashboard</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 2 }}>{today}</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClipboardList size={16} /> My Tasks
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={16} /> New Request
          </button>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="kpi-card" style={{ animationDelay: '0ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff' }}><AlertTriangle size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{pending}</div>
            <div className="kpi-label">Pending Requests</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '60ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><Clock size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{inProgress}</div>
            <div className="kpi-label">In Progress</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '120ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><CheckCircle2 size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{completed}</div>
            <div className="kpi-label">Completed This Month</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '180ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><Hammer size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{totalActive}</div>
            <div className="kpi-label">Rooms Under Maintenance</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px' }}>
          <ClipboardList size={16} /> View My Tasks <ArrowRight size={14} />
        </button>
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px' }}>
          <Wrench size={16} /> Equipment Inventory <ArrowRight size={14} />
        </button>
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px' }}>
          <BarChart3 size={16} /> Maintenance History <ArrowRight size={14} />
        </button>
      </div>

      <div className="card">
        <div className="booking-list-header">
          <h3>Recent Maintenance Requests</h3>
        </div>
        <table className="booking-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r, i) => (
              <tr key={r.maintenanceId} style={{ animationDelay: `${i * 40}ms` }}>
                <td>
                  <span className="room-badge">Room {r.room?.roomNumber}</span>
                </td>
                <td style={{ maxWidth: 280 }}>{r.description}</td>
                <td><span className={`badge ${PRIORITY_BADGE[r.priority] || 'badge-gray'}`}>{r.priority}</span></td>
                <td style={{ fontWeight: 500 }}>{r.assignedStaff || r.assignedTo || <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Unassigned</span>}</td>
                <td><span className={`badge ${STATUS_BADGE[r.status] || 'badge-gray'}`}>{r.status.replace('_', ' ')}</span></td>
                <td style={{ color: 'var(--text-secondary)' }}>{r.date || r.reportedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
