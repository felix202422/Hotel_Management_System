import { useState, useEffect } from 'react'
import { Search, Plus, Users, Package } from 'lucide-react'
import api from '../../api/axios'
import Modal from '../../components/Modal'

const DEPARTMENTS = ['Front Desk', 'Housekeeping', 'Finance', 'Maintenance', 'Management']
const POSITIONS = ['Manager', 'Secretary', 'Housekeeper', 'Accountant', 'Maintenance Staff']
const ROLES = ['Admin', 'Staff']

const EMPTY_FORM = { fullName: '', email: '', phone: '', position: '', department: '', role: 'Staff', username: '', password: '' }

export default function AdminStaff() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('All')
  const [filterPosition, setFilterPosition] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    setLoading(true)
    api.get('/staff')
      .then(res => { setStaff(Array.isArray(res.data) ? res.data : []) })
      .catch(err => { console.error(err); setStaff([]) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = staff.filter(s => {
    const name = s.fullName?.toLowerCase() || ''
    const email = s.email?.toLowerCase() || ''
    const phone = s.phone?.toLowerCase() || ''
    const matchesSearch = name.includes(search.toLowerCase()) || email.includes(search.toLowerCase()) || phone.includes(search.toLowerCase())
    const matchesDept = filterDept === 'All' || s.department === filterDept
    const matchesPosition = filterPosition === 'All' || s.position === filterPosition
    return matchesSearch && matchesDept && matchesPosition
  })

  const addStaff = async () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.position || !form.department) return
    const payload = { ...form, status: 'Active' }
    try {
      const res = await api.post('/staff', payload)
      const newStaff = res.data
      if (newStaff) setStaff([...staff, newStaff])
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to add staff')
    }
    setModalOpen(false)
    setForm(EMPTY_FORM)
  }

  const toggleStatus = async (s) => {
    const newStatus = s.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await api.put(`/staff/${s.id}`, { ...s, status: newStatus })
      setStaff(staff.map(st => st.id === s.id ? { ...st, status: newStatus } : st))
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update status')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Staff Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Manage staff accounts, departments, and roles</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> Add Staff
        </button>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="kpi-card" style={{ animationDelay: '0.1s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><Users size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{staff.length}</div>
            <div className="kpi-label">Total Staff</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.15s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><Users size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{staff.filter(s => s.status === 'Active').length}</div>
            <div className="kpi-label">Active</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.2s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #64748B, #475569)', color: '#fff' }}><Users size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{staff.filter(s => s.status === 'Inactive').length}</div>
            <div className="kpi-label">Inactive</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.25s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff' }}><Users size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{DEPARTMENTS.length}</div>
            <div className="kpi-label">Departments</div>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Staff" wide>
        <div className="form-group">
          <label>Full Name</label>
          <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. John Doe" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Username</label>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="e.g. johndoe" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter password" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. john@hasmir.com" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. +1-555-0123" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Position</label>
            <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>
              <option value="">Select position</option>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Department</label>
            <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
              <option value="">Select department</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <button className="btn-primary" onClick={addStaff} style={{ width: '100%' }}>Add Staff Member</button>
      </Modal>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
            <input type="text" placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <select className="booking-filter" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
              <option value="All">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select className="booking-filter" value={filterPosition} onChange={(e) => setFilterPosition(e.target.value)}>
              <option value="All">All Positions</option>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Department</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="empty-state">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8}><div className="empty-state"><Package size={48} style={{opacity:0.3, marginBottom:12}} /><p>No staff members found</p></div></td></tr>
            ) : filtered.map((s, i) => (
              <tr key={s.id} style={{ animationDelay: i * 0.03 + 's' }}>
                <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>STF-{String(s.id).padStart(3, '0')}</td>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{(s.fullName || '?').split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                    <span style={{ fontWeight: 500 }}>{s.fullName}</span>
                  </div>
                </td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>{s.position}</td>
                <td><span className="room-badge">{s.department}</span></td>
                <td><span className={`badge badge-${s.role === 'Admin' ? 'purple' : 'blue'}`}>{s.role}</span></td>
                <td>
                  <button
                    onClick={() => toggleStatus(s)}
                    className={`badge ${s.status === 'Active' ? 'badge-green' : 'badge-gray'}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    {s.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
