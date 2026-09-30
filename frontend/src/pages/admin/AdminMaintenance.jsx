import { useState, useEffect } from 'react'
import { Search, Plus, Wrench, Package } from 'lucide-react'
import api from '../../api/axios'
import Modal from '../../components/Modal'

const STATUSES = ['All', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
const PRIORITIES = ['All', 'Low', 'Medium', 'High', 'Critical']
const CATEGORIES = ['Plumbing', 'Electrical', 'HVAC', 'Furniture', 'Appliance', 'Structural', 'Other']

const statusBadge = (s) => {
  const map = { PENDING: 'yellow', ASSIGNED: 'blue', IN_PROGRESS: 'yellow', COMPLETED: 'green', CANCELLED: 'red' }
  return map[s] || 'gray'
}

const priorityBadge = (p) => {
  const map = { Low: 'gray', Medium: 'blue', High: 'yellow', Critical: 'red' }
  return map[p] || 'gray'
}

const EMPTY_FORM = { roomNumber: '', description: '', priority: 'Medium', assignedTo: '', category: 'Other' }

export default function AdminMaintenance() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    setLoading(true)
    api.get('/maintenance')
      .then(res => { setRequests(Array.isArray(res.data) ? res.data : []) })
      .catch(err => { console.error(err); setRequests([]) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = requests.filter(r => {
    const desc = r.description?.toLowerCase() || ''
    const roomNum = r.room?.roomNumber?.toLowerCase() || ''
    const assigned = r.assignedTo?.toLowerCase() || ''
    const matchesSearch = desc.includes(search.toLowerCase()) ||
      `room ${roomNum}`.includes(search.toLowerCase()) ||
      assigned.includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus
    const matchesPriority = filterPriority === 'All' || r.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const addRequest = async () => {
    if (!form.roomNumber.trim() || !form.description.trim()) return
    const payload = {
      room: { roomNumber: form.roomNumber },
      description: form.description,
      priority: form.priority,
      assignedTo: form.assignedTo,
      category: form.category,
    }
    try {
      const res = await api.post('/maintenance', payload)
      const newReq = res.data
      if (newReq) setRequests([...requests, newReq])
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to create request')
    }
    setModalOpen(false)
    setForm(EMPTY_FORM)
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/maintenance/${id}/status`, { status: newStatus })
      setRequests(requests.map(r => (r.maintenanceId || r.id) === id ? { ...r, status: newStatus } : r))
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update status')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Maintenance Requests</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Track and resolve maintenance issues across all rooms</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> New Request
        </button>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="kpi-card" style={{ animationDelay: '0.1s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><Wrench size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{requests.length}</div>
            <div className="kpi-label">Total Requests</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.15s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><Wrench size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{requests.filter(r => r.status === 'PENDING').length}</div>
            <div className="kpi-label">Pending</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.2s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff' }}><Wrench size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{requests.filter(r => r.status === 'IN_PROGRESS').length}</div>
            <div className="kpi-label">In Progress</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.25s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><Wrench size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{requests.filter(r => r.status === 'COMPLETED').length}</div>
            <div className="kpi-label">Completed</div>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Maintenance Request" wide>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Room Number</label>
            <input value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} placeholder="e.g. 201" />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              {PRIORITIES.filter(p => p !== 'All').map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the maintenance issue..." />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Assign To (optional)</label>
            <input value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} placeholder="e.g. Staff name" />
          </div>
        </div>
        <button className="btn-primary" onClick={addRequest} style={{ width: '100%' }}>Submit Request</button>
      </Modal>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
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
              <th>ID</th>
              <th>Room</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Reported</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="empty-state">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7}><div className="empty-state"><Package size={48} style={{opacity:0.3, marginBottom:12}} /><p>No maintenance requests found</p></div></td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.maintenanceId || r.id} style={{ animationDelay: i * 0.03 + 's' }}>
                <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>MR-{String(r.maintenanceId || r.id).padStart(3, '0')}</td>
                <td><span className="room-badge">Room {r.room?.roomNumber || '-'}</span></td>
                <td style={{ maxWidth: 250 }}>{r.description}</td>
                <td><span className={`badge badge-${priorityBadge(r.priority)}`}>{r.priority}</span></td>
                <td>{r.assignedTo || <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Unassigned</span>}</td>
                <td>
                  {r.status === 'COMPLETED' ? (
                    <span className={`badge badge-${statusBadge(r.status)}`}>COMPLETED</span>
                  ) : (
                    <select
                      className="booking-filter"
                      value={r.status}
                      onChange={(e) => updateStatus(r.maintenanceId || r.id, e.target.value)}
                      style={{ fontSize: '0.78rem', padding: '2px 6px' }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  )}
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{r.reportedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
