import { useState, useEffect } from 'react'
import { Search, Edit2, UserPlus, Users } from 'lucide-react'
import api from '../../api/axios'
import Modal from '../../components/Modal'

const EMPTY_FORM = { firstName: '', lastName: '', email: '', phone: '', gender: '', nationality: '', address: '' }

export default function SecretaryGuests() {
  const [guests, setGuests] = useState([])
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    api.get('/guests').then(res => {
      setGuests(Array.isArray(res.data) ? res.data : [])
    }).catch(err => console.error(err))
  }, [])

  const filtered = guests.filter(g =>
    `${g.firstName} ${g.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase()) ||
    g.phone.includes(search)
  )

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true) }
  const openEdit = (guest) => { setEditing(guest); setForm({ firstName: guest.firstName, lastName: guest.lastName, email: guest.email, phone: guest.phone || '', gender: guest.gender || '', nationality: guest.nationality || '', address: guest.address || '' }); setModalOpen(true) }

  const save = () => {
    if (editing) {
      api.put(`/guests/${editing.guestId}`, form).then(() => {
        setGuests(prev => prev.map(g => g.guestId === editing.guestId ? { ...g, ...form } : g))
      }).catch(err => {
        console.error(err)
        setGuests(prev => prev.map(g => g.guestId === editing.guestId ? { ...g, ...form } : g))
      })
    } else {
      api.post('/guests', form).then(res => {
        const newGuest = res.data || { guestId: Date.now(), ...form }
        setGuests(prev => [newGuest, ...prev])
      }).catch(err => {
        console.error(err)
        setGuests(prev => [{ guestId: Date.now(), ...form }, ...prev])
      })
    }
    setModalOpen(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Guests</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Manage guest profiles and contact information</p>
        </div>
        <button className="btn-primary" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserPlus size={18} /> Add Guest
        </button>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Guest' : 'Add New Guest'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>First Name *</label>
            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First name" />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email address" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid var(--input-border)' }}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Nationality</label>
            <input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} placeholder="Nationality" />
          </div>
        </div>
        <button className="btn-primary" onClick={save} style={{ width: '100%', marginTop: 8 }} disabled={!form.firstName || !form.lastName || !form.email}>
          {editing ? 'Update Guest' : 'Add Guest'}
        </button>
      </Modal>

      <div className="card">
        <div className="booking-search" style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Search guests by name, email, or phone..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 320 }} />
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Nationality</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="empty-state"><Users size={40} style={{ color: 'var(--border)', marginBottom: 12 }} /><br />No guests found</td></tr>
            ) : filtered.map((guest, i) => (
              <tr key={guest.guestId} style={{ animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.03 * i}s` }}>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{guest.firstName?.[0]}{guest.lastName?.[0]}</div>
                    <span style={{ fontWeight: 500 }}>{guest.firstName} {guest.lastName}</span>
                  </div>
                </td>
                <td>{guest.email}</td>
                <td>{guest.phone}</td>
                <td>{guest.gender}</td>
                <td>{guest.nationality}</td>
                <td>
                  <button className="btn-sm btn-secondary" onClick={() => openEdit(guest)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Edit2 size={14} /> Edit
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