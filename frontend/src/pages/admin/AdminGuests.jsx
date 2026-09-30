import { useState, useEffect } from 'react'
import { Search, Plus, Phone, Mail, Package } from 'lucide-react'
import api from '../../api/axios'
import Modal from '../../components/Modal'

const EMPTY_FORM = { firstName: '', lastName: '', email: '', phone: '', gender: 'Male', nationality: '' }

export default function AdminGuests() {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    setLoading(true)
    api.get('/guests')
      .then(res => { setGuests(Array.isArray(res.data) ? res.data : []) })
      .catch(err => { console.error(err); setGuests([]) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = guests.filter(g => {
    const q = search.toLowerCase()
    return `${g.firstName} ${g.lastName}`.toLowerCase().includes(q) || g.email?.toLowerCase().includes(q) || g.phone?.includes(q)
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/guests', { ...form })
      const newGuest = res.data
      if (newGuest) setGuests([...guests, newGuest])
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to create guest')
    }
    setModalOpen(false)
    setForm(EMPTY_FORM)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 className="page-title">Guest Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Track and manage guest profiles and contact information</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm(EMPTY_FORM); setModalOpen(true) }}><Plus size={16} /> Add Guest</button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div className="booking-search" style={{ flex: 1 }}>
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search guests by name, email, or phone..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Nationality</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="empty-state">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5}><div className="empty-state"><Package size={48} style={{opacity:0.3, marginBottom:12}} /><p>No guests found</p></div></td></tr>
            ) : filtered.map((g, i) => (
              <tr key={g.guestId || g.id} style={{ animationDelay: i * 0.03 + 's' }}>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{g.firstName?.[0]}{g.lastName?.[0]}</div>
                    <span style={{ fontWeight: 600 }}>{g.firstName} {g.lastName}</span>
                  </div>
                </td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    <Mail size={13} /> {g.email}
                  </span>
                </td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    <Phone size={13} /> {g.phone}
                  </span>
                </td>
                <td>{g.gender}</td>
                <td><span className="badge badge-blue">{g.nationality}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Guest">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>First Name</label>
              <input type="text" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="First name" />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Last Name</label>
              <input type="text" required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="guest@email.com" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1-555-0000" />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Gender</label>
              <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Nationality</label>
              <input type="text" required value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })} placeholder="e.g. American" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Create Guest</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
