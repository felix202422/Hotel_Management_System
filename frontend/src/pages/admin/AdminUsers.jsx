import { useState, useEffect } from 'react'
import { Search, Plus, Edit2, Trash2, Shield, User, Package } from 'lucide-react'
import api from '../../api/axios'
import Modal from '../../components/Modal'

const FALLBACK_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@hasmir.com', role: 'Admin', status: 'Active', lastLogin: '2026-08-29 09:15' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@hasmir.com', role: 'Manager', status: 'Active', lastLogin: '2026-08-29 08:30' },
  { id: 3, name: 'Mike Peters', email: 'mike@hasmir.com', role: 'Receptionist', status: 'Active', lastLogin: '2026-08-28 17:45' },
  { id: 4, name: 'Lisa Chen', email: 'lisa@hasmir.com', role: 'Housekeeper', status: 'Active', lastLogin: '2026-08-29 07:00' },
  { id: 5, name: 'Tom Wilson', email: 'tom@hasmir.com', role: 'Receptionist', status: 'Inactive', lastLogin: '2026-08-15 12:00' },
  { id: 6, name: 'Anna Brown', email: 'anna@hasmir.com', role: 'Manager', status: 'Active', lastLogin: '2026-08-29 10:20' },
  { id: 7, name: 'James Davis', email: 'james@hasmir.com', role: 'Receptionist', status: 'Active', lastLogin: '2026-08-29 06:55' },
  { id: 8, name: 'Rachel Kim', email: 'rachel@hasmir.com', role: 'Housekeeper', status: 'Inactive', lastLogin: '2026-07-20 14:30' },
]

const EMPTY_FORM = { name: '', email: '', role: 'Receptionist', password: '' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    setLoading(true)
    api.get('/auth/users')
      .then(res => {
        setUsers(Array.isArray(res.data) ? res.data : FALLBACK_USERS)
      })
      .catch(err => {
        console.error(err)
        setUsers(FALLBACK_USERS)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u => {
    const matchSearch = (u.name || u.username || '').toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'All' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const openAdd = () => { setEditUser(null); setForm(EMPTY_FORM); setModalOpen(true) }
  const openEdit = (u) => { setEditUser(u); setForm({ name: u.name || u.username || '', email: u.email, role: u.role, password: '' }); setModalOpen(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editUser) {
        const payload = { name: form.name, email: form.email, role: form.role }
        if (form.password) payload.password = form.password
        await api.put(`/auth/users/${editUser.id}`, payload)
        setUsers(users.map(u => u.id === editUser.id ? { ...u, ...payload } : u))
      } else {
        const res = await api.post('/auth/users', { name: form.name, email: form.email, role: form.role, password: form.password })
        const newUser = res.data
        if (newUser) setUsers([...users, newUser])
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Operation failed')
    }
    setModalOpen(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await api.delete(`/auth/users/${id}`)
      setUsers(users.filter(u => u.id !== id))
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed')
    }
  }

  const toggleStatus = async (u) => {
    const newStatus = u.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await api.put(`/auth/users/${u.id}/status`, { status: newStatus })
      setUsers(users.map(user => user.id === u.id ? { ...user, status: newStatus } : user))
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update status')
    }
  }

  const roleIcon = (role) => {
    if (role === 'Admin') return <Shield size={14} />
    return <User size={14} />
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 className="page-title">User Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Manage system users, roles, and access permissions</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add User</button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="booking-search" style={{ flex: 1, minWidth: 220 }}>
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="booking-filter" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Housekeeper">Housekeeper</option>
          </select>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="empty-state">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6}><div className="empty-state"><Package size={48} style={{opacity:0.3, marginBottom:12}} /><p>No users found</p></div></td></tr>
            ) : filtered.map((u, i) => (
              <tr key={u.id} style={{ animationDelay: i * 0.03 + 's' }}>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{(u.name || u.username || '?').split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                    <span style={{ fontWeight: 600 }}>{u.name || u.username}</span>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge badge-${u.role === 'Admin' ? 'purple' : u.role === 'Manager' ? 'blue' : u.role === 'Receptionist' ? 'green' : 'gray'}`}>
                    {roleIcon(u.role)}&nbsp;{u.role}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => toggleStatus(u)}
                    className={`badge ${u.status === 'Active' ? 'badge-green' : 'badge-gray'}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    {u.status}
                  </button>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{u.lastLogin || '-'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-icon" onClick={() => openEdit(u)} title="Edit"><Edit2 size={15} /></button>
                    <button className="btn-icon" onClick={() => handleDelete(u.id)} title="Delete" style={{ color: 'var(--danger)' }}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editUser ? 'Edit User' : 'Add User'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Enter email" />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Housekeeper">Housekeeper</option>
            </select>
          </div>
          <div className="form-group">
            <label>{editUser ? 'New Password (leave blank to keep)' : 'Password'}</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Enter password" {...(!editUser && { required: true })} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">{editUser ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
