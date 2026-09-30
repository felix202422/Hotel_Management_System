import { useState, useEffect } from 'react'
import { Search, Plus, Sparkles, Package } from 'lucide-react'
import api from '../../api/axios'
import Modal from '../../components/Modal'

const STATUS_BADGE = { Completed: 'green', COMPLETED: 'green', 'In Progress': 'yellow', IN_PROGRESS: 'yellow', Pending: 'gray', PENDING: 'gray' }

const EMPTY_FORM = { roomNumber: '', assignedStaff: '', cleaningStatus: 'PENDING' }

export default function AdminHousekeeping() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    setLoading(true)
    api.get('/housekeeping')
      .then(res => { setTasks(Array.isArray(res.data) ? res.data : []) })
      .catch(err => { console.error(err); setTasks([]) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = tasks.filter(t => {
    const roomNum = t.room?.roomNumber?.toLowerCase() || t.roomNumber?.toLowerCase() || ''
    const staff = t.assignedStaff?.toLowerCase() || ''
    const matchSearch = roomNum.includes(search.toLowerCase()) || staff.includes(search.toLowerCase())
    const status = t.cleaningStatus || t.status
    const matchStatus = statusFilter === 'All' || status === statusFilter
    return matchSearch && matchStatus
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      room: { roomNumber: form.roomNumber },
      assignedStaff: form.assignedStaff,
      cleaningStatus: form.cleaningStatus,
    }
    try {
      const res = await api.post('/housekeeping', payload)
      const newTask = res.data
      if (newTask) setTasks([...tasks, newTask])
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to create task')
    }
    setModalOpen(false)
    setForm(EMPTY_FORM)
  }

  const completedCount = tasks.filter(t => (t.cleaningStatus || t.status) === 'Completed' || (t.cleaningStatus || t.status) === 'COMPLETED').length
  const inProgressCount = tasks.filter(t => (t.cleaningStatus || t.status) === 'In Progress' || (t.cleaningStatus || t.status) === 'IN_PROGRESS').length
  const pendingCount = tasks.filter(t => (t.cleaningStatus || t.status) === 'Pending' || (t.cleaningStatus || t.status) === 'PENDING').length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 className="page-title">Housekeeping</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Manage cleaning tasks and room readiness status</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm(EMPTY_FORM); setModalOpen(true) }}><Plus size={16} /> Add Task</button>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card" style={{ animationDelay: '0.1s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><Sparkles size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{completedCount}</span>
            <span className="kpi-label">Completed</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.15s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><Sparkles size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{inProgressCount}</span>
            <span className="kpi-label">In Progress</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.2s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #64748B, #475569)', color: '#fff' }}><Sparkles size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{pendingCount}</span>
            <span className="kpi-label">Pending</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="booking-search" style={{ flex: 1, minWidth: 220 }}>
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search by room or staff..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="booking-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Assigned Staff</th>
              <th>Cleaned Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="empty-state">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4}><div className="empty-state"><Package size={48} style={{opacity:0.3, marginBottom:12}} /><p>No housekeeping tasks found</p></div></td></tr>
            ) : filtered.map((t, i) => {
              const status = t.cleaningStatus || t.status
              return (
                <tr key={t.housekeepingId || t.id} style={{ animationDelay: i * 0.03 + 's' }}>
                  <td><span className="room-badge">Room {t.room?.roomNumber || t.roomNumber}</span></td>
                  <td>
                    <div className="guest-cell">
                      <div className="guest-avatar-sm">{(t.assignedStaff || '?').split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                      <span style={{ fontWeight: 600 }}>{t.assignedStaff}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{t.cleanedDate}</td>
                  <td><span className={`badge badge-${STATUS_BADGE[status] || 'gray'}`}>{status}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Housekeeping Task">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Room Number</label>
            <input type="text" required value={form.roomNumber} onChange={e => setForm({ ...form, roomNumber: e.target.value })} placeholder="e.g. 101" />
          </div>
          <div className="form-group">
            <label>Assigned Staff</label>
            <input type="text" required value={form.assignedStaff} onChange={e => setForm({ ...form, assignedStaff: e.target.value })} placeholder="Staff name" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.cleaningStatus} onChange={e => setForm({ ...form, cleaningStatus: e.target.value })}>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Create Task</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
