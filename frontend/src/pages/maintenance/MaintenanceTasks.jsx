import { useState, useEffect } from 'react'
import {
  ClipboardCheck, Clock, CheckCircle2, PlayCircle,
  MessageSquare, Filter
} from 'lucide-react'
import api from '../../api/axios'

const FICTIOUS = [
  { maintenanceId: 1, room: { roomNumber: '104' }, description: 'Leaking faucet in bathroom needs repair', priority: 'High', status: 'PENDING', date: '2026-08-29', notes: '' },
  { maintenanceId: 2, room: { roomNumber: '202' }, description: 'AC unit not cooling properly', priority: 'Critical', status: 'IN_PROGRESS', date: '2026-08-28', notes: 'Checked coolant levels, ordering replacement compressor.' },
  { maintenanceId: 4, room: { roomNumber: '403' }, description: 'Carpet stain removal in living area', priority: 'Medium', status: 'IN_PROGRESS', date: '2026-08-29', notes: 'Applied stain treatment, monitoring results.' },
  { maintenanceId: 8, room: { roomNumber: '401' }, description: 'Water heater intermittent failure', priority: 'High', status: 'IN_PROGRESS', date: '2026-08-29', notes: 'Thermostat tested, replacement part on order.' },
  { maintenanceId: 9, room: { roomNumber: '102' }, description: 'Mini-fridge making unusual noise', priority: 'Medium', status: 'ASSIGNED', date: '2026-08-28', notes: '' },
  { maintenanceId: 12, room: { roomNumber: '402' }, description: 'Electrical outlet sparking intermittently', priority: 'Critical', status: 'ASSIGNED', date: '2026-08-28', notes: '' },
  { maintenanceId: 5, room: { roomNumber: '101' }, description: 'Door lock mechanism stuck', priority: 'High', status: 'COMPLETED', date: '2026-08-26', notes: 'Lubricated lock mechanism, tested 10+ times. Working perfectly.' },
  { maintenanceId: 10, room: { roomNumber: '204' }, description: 'Bathroom grout needs resealing', priority: 'Low', status: 'COMPLETED', date: '2026-08-27', notes: 'Resealed all grout lines with waterproof sealant.' },
]

const STATUS_FLOW = { PENDING: 'IN_PROGRESS', ASSIGNED: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED' }
const STATUS_NEXT_LABEL = { PENDING: 'Accept', ASSIGNED: 'Start Work', IN_PROGRESS: 'Complete' }
const STATUS_BADGE = { COMPLETED: 'badge-green', IN_PROGRESS: 'badge-yellow', ASSIGNED: 'badge-blue', PENDING: 'badge-red' }
const PRIORITY_BADGE = { Critical: 'badge-red', High: 'badge-yellow', Medium: 'badge-blue', Low: 'badge-gray' }

export default function MaintenanceTasks() {
  const [tasks, setTasks] = useState(FICTIOUS)
  const [filterStatus, setFilterStatus] = useState('All')
  const [editingNotes, setEditingNotes] = useState(null)
  const [notesText, setNotesText] = useState('')

  useEffect(() => {
    api.get('/maintenance').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      if (data.length > 0) setTasks(data)
    }).catch(err => console.error(err))
  }, [])

  const filtered = tasks.filter(t => filterStatus === 'All' || t.status === filterStatus)

  const handleAdvanceStatus = (taskId) => {
    const task = tasks.find(t => t.maintenanceId === taskId)
    if (!task) return
    const next = STATUS_FLOW[task.status]
    if (!next) return
    setTasks(prev => prev.map(t => t.maintenanceId === taskId ? { ...t, status: next } : t))
    api.put(`/maintenance/${taskId}/status`, { status: next }).catch(err => console.error(err))
  }

  const handleSaveNotes = (taskId) => {
    setTasks(prev => prev.map(t => t.maintenanceId === taskId ? { ...t, notes: notesText } : t))
    api.put(`/maintenance/${taskId}`, { notes: notesText }).catch(err => console.error(err))
    setEditingNotes(null)
    setNotesText('')
  }

  const startEditNotes = (task) => {
    setEditingNotes(task.maintenanceId)
    setNotesText(task.notes)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Manage your assigned maintenance tasks</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Filter size={16} style={{ color: 'var(--text-secondary)' }} />
          <select className="booking-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="kpi-card" style={{ animationDelay: '0ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff' }}><ClipboardCheck size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{tasks.filter(t => t.status === 'PENDING').length}</div>
            <div className="kpi-label">Pending</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '60ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><ClipboardCheck size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{tasks.filter(t => t.status === 'ASSIGNED').length}</div>
            <div className="kpi-label">Assigned</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '120ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><Clock size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</div>
            <div className="kpi-label">In Progress</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '180ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><CheckCircle2 size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{tasks.filter(t => t.status === 'COMPLETED').length}</div>
            <div className="kpi-label">Completed</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <ClipboardCheck size={48} style={{ color: 'var(--border)', marginBottom: 16 }} />
              <p>No tasks found</p>
            </div>
          </div>
        ) : filtered.map((task, i) => (
          <div key={task.maintenanceId} className="card" style={{ padding: 20, animationDelay: `${i * 50}ms` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  MR-{String(task.maintenanceId).padStart(3, '0')}
                </span>
                <span className="room-badge">Room {task.room?.roomNumber || task.room}</span>
                <span className={`badge badge-${PRIORITY_BADGE[task.priority] || 'badge-gray'}`}>{task.priority}</span>
                <span className={`badge badge-${STATUS_BADGE[task.status] || 'badge-gray'}`}>{task.status.replace('_', ' ')}</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{task.date || task.reportedDate}</span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text)', marginBottom: 12 }}>{task.description}</p>

            {task.notes && editingNotes !== task.maintenanceId && (
              <div style={{
                background: '#f8fafc', borderRadius: 10, padding: '10px 14px', marginBottom: 12,
                display: 'flex', alignItems: 'flex-start', gap: 8
              }}>
                <MessageSquare size={14} style={{ color: 'var(--text-secondary)', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{task.notes}</span>
              </div>
            )}

            {editingNotes === task.maintenanceId && (
              <div style={{ marginBottom: 12 }}>
                <textarea
                  rows={2}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Add notes about this task..."
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--input-border)', borderRadius: 'var(--radius)', fontSize: '0.85rem', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="btn btn-sm btn-primary" onClick={() => handleSaveNotes(task.maintenanceId)}>Save Notes</button>
                  <button className="btn btn-sm btn-secondary" onClick={() => setEditingNotes(null)}>Cancel</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              {task.status !== 'COMPLETED' && (
                <button className={`btn btn-sm ${task.status === 'IN_PROGRESS' ? 'btn-success' : 'btn-primary'}`} onClick={() => handleAdvanceStatus(task.maintenanceId)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {task.status === 'PENDING' && <><PlayCircle size={14} /> Accept Task</>}
                  {task.status === 'ASSIGNED' && <><PlayCircle size={14} /> Start Work</>}
                  {task.status === 'IN_PROGRESS' && <><CheckCircle2 size={14} /> Mark Complete</>}
                </button>
              )}
              {editingNotes !== task.maintenanceId && (
                <button className="btn btn-sm btn-secondary" onClick={() => startEditNotes(task)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MessageSquare size={14} /> {task.notes ? 'Edit Notes' : 'Add Notes'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
