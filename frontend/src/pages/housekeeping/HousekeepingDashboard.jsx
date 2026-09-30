import { useState, useEffect } from 'react'
import {
  Sparkles, Play, CheckCircle, Clock, AlertTriangle,
  Wrench, RefreshCw, Home
} from 'lucide-react'
import api from '../../api/axios'

const FALLBACK_ROOMS = [
  { roomId: 1, roomNumber: '101', roomType: 'Deluxe King', floor: 1, roomStatus: 'Occupied' },
  { roomId: 2, roomNumber: '102', roomType: 'Deluxe King', floor: 1, roomStatus: 'Occupied' },
  { roomId: 3, roomNumber: '201', roomType: 'Suite', floor: 2, roomStatus: 'Occupied' },
  { roomId: 4, roomNumber: '202', roomType: 'Suite', floor: 2, roomStatus: 'Available' },
  { roomId: 5, roomNumber: '301', roomType: 'Executive Suite', floor: 3, roomStatus: 'Occupied' },
  { roomId: 6, roomNumber: '302', roomType: 'Executive Suite', floor: 3, roomStatus: 'Occupied' },
  { roomId: 7, roomNumber: '401', roomType: 'Penthouse', floor: 4, roomStatus: 'Available' },
  { roomId: 8, roomNumber: '402', roomType: 'Penthouse', floor: 4, roomStatus: 'Occupied' },
  { roomId: 9, roomNumber: '103', roomType: 'Standard Twin', floor: 1, roomStatus: 'Occupied' },
  { roomId: 10, roomNumber: '104', roomType: 'Standard Twin', floor: 1, roomStatus: 'Not Ready' },
]

const FALLBACK_TASKS = [
  { id: 1, room: { roomNumber: '101' }, assignedStaff: 'Maria Santos', cleaningStatus: 'Pending', assignedDate: '2026-08-29', notes: 'Guest checkout — full cleaning' },
  { id: 2, room: { roomNumber: '102' }, assignedStaff: 'John Rivera', cleaningStatus: 'In Progress', assignedDate: '2026-08-29', notes: 'Routine cleaning' },
  { id: 3, room: { roomNumber: '201' }, assignedStaff: 'Lisa Chen', cleaningStatus: 'Pending', assignedDate: '2026-08-29', notes: 'Deep clean requested' },
  { id: 4, room: { roomNumber: '301' }, assignedStaff: 'Maria Santos', cleaningStatus: 'Completed', assignedDate: '2026-08-29', notes: 'VIP guest — extra attention' },
  { id: 5, room: { roomNumber: '302' }, assignedStaff: 'David Park', cleaningStatus: 'Pending', assignedDate: '2026-08-29', notes: 'Checkout cleaning' },
  { id: 6, room: { roomNumber: '402' }, assignedStaff: 'Lisa Chen', cleaningStatus: 'Completed', assignedDate: '2026-08-29', notes: 'Routine cleaning' },
  { id: 7, room: { roomNumber: '104' }, assignedStaff: 'John Rivera', cleaningStatus: 'Inspection', assignedDate: '2026-08-28', notes: 'Damage reported — inspect before cleaning' },
  { id: 8, room: { roomNumber: '103' }, assignedStaff: 'David Park', cleaningStatus: 'Maintenance', assignedDate: '2026-08-29', notes: 'AC unit malfunction — maintenance needed' },
  { id: 9, room: { roomNumber: '202' }, assignedStaff: 'Maria Santos', cleaningStatus: 'Pending', assignedDate: '2026-08-29', notes: 'New guest arrival — priority clean' },
  { id: 10, room: { roomNumber: '303' }, assignedStaff: 'Lisa Chen', cleaningStatus: 'In Progress', assignedDate: '2026-08-29', notes: 'Routine turnover' },
]

const STATUS_CONFIG = {
  Pending: { color: '#64748B', bg: '#F1F5F9', badge: 'badge-gray' },
  'In Progress': { color: '#CA8A04', bg: '#FEF9C3', badge: 'badge-yellow' },
  Completed: { color: '#16A34A', bg: '#F0FDF4', badge: 'badge-green' },
  Inspection: { color: '#2563EB', bg: '#EFF6FF', badge: 'badge-blue' },
  Maintenance: { color: '#DC2626', bg: '#FEF2F2', badge: 'badge-red' },
}

export default function HousekeepingDashboard() {
  const [tasks, setTasks] = useState(FALLBACK_TASKS)
  const [rooms, setRooms] = useState(FALLBACK_ROOMS)

  useEffect(() => {
    Promise.all([
      api.get('/housekeeping').catch(() => ({ data: [] })),
      api.get('/rooms').catch(() => ({ data: [] })),
    ]).then(([resHK, resRooms]) => {
      const hkData = Array.isArray(resHK.data) ? resHK.data : []
      const roomData = Array.isArray(resRooms.data) ? resRooms.data : []
      setTasks(hkData.length > 0 ? hkData : FALLBACK_TASKS)
      setRooms(roomData.length > 0 ? roomData : FALLBACK_ROOMS)
    }).catch(err => console.error(err))
  }, [])

  const pendingCount = tasks.filter(t => t.cleaningStatus === 'Pending').length
  const inProgressCount = tasks.filter(t => t.cleaningStatus === 'In Progress').length
  const completedCount = tasks.filter(t => t.cleaningStatus === 'Completed').length
  const inspectionCount = tasks.filter(t => t.cleaningStatus === 'Inspection').length
  const maintenanceCount = tasks.filter(t => t.cleaningStatus === 'Maintenance').length

  const handleStatusUpdate = (taskId, newStatus) => {
    const updated = tasks.map(t =>
      t.id === taskId ? { ...t, cleaningStatus: newStatus } : t
    )
    setTasks(updated)
    api.patch(`/housekeeping/${taskId}`, { cleaningStatus: newStatus }).catch(err => console.error(err))
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div>
      <div className="greeting">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Home size={22} />
            </div>
            <div>
              <h2>Housekeeping Dashboard</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 2 }}>{today}</p>
            </div>
          </div>
        </div>
        <button className="btn-primary" onClick={() => {
          api.get('/housekeeping').then(res => { setTasks(Array.isArray(res.data) ? res.data : []) }).catch(err => console.error(err))
        }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="kpi-card" style={{ animationDelay: '0ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #64748B, #475569)', color: '#fff' }}>
            <Clock size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-value">{pendingCount}</span>
            <span className="kpi-label">Rooms to Clean</span>
          </div>
        </div>

        <div className="kpi-card" style={{ animationDelay: '60ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}>
            <Sparkles size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-value">{inProgressCount}</span>
            <span className="kpi-label">In Progress</span>
          </div>
        </div>

        <div className="kpi-card" style={{ animationDelay: '120ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}>
            <CheckCircle size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-value">{completedCount}</span>
            <span className="kpi-label">Cleaned</span>
          </div>
        </div>

        <div className="kpi-card" style={{ animationDelay: '180ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}>
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-value">{inspectionCount}</span>
            <span className="kpi-label">Inspection Required</span>
          </div>
        </div>

        <div className="kpi-card" style={{ animationDelay: '240ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff' }}>
            <Wrench size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-value">{maintenanceCount}</span>
            <span className="kpi-label">Maintenance Rooms</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="chart-header">
          <h3>Assigned Rooms</h3>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{tasks.length} total tasks</span>
        </div>
        <table className="booking-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Status</th>
              <th>Assigned Date</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => {
              const cfg = STATUS_CONFIG[t.cleaningStatus] || STATUS_CONFIG.Pending
              return (
                <tr key={t.id || t.housekeepingId} style={{ animationDelay: `${i * 40}ms` }}>
                  <td><span className="room-badge">Room {t.room?.roomNumber}</span></td>
                  <td>
                    <span className={`badge ${cfg.badge}`}>{t.cleaningStatus}</span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t.assignedDate || t.cleanedDate}</td>
                  <td style={{ fontSize: '0.82rem', maxWidth: 240 }}>{t.notes}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {t.cleaningStatus === 'Pending' && (
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleStatusUpdate(t.id || t.housekeepingId, 'In Progress')}
                          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <Play size={12} /> Start
                        </button>
                      )}
                      {t.cleaningStatus === 'In Progress' && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleStatusUpdate(t.id || t.housekeepingId, 'Completed')}
                          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <CheckCircle size={12} /> Complete
                        </button>
                      )}
                      {t.cleaningStatus === 'Completed' && (
                        <span style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 600 }}>Done</span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
