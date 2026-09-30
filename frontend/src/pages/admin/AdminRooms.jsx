import { useState, useEffect } from 'react'
import { Search, Plus, Edit2, Trash2, Package } from 'lucide-react'
import api from '../../api/axios'
import Modal from '../../components/Modal'

const EMPTY_FORM = { roomNumber: '', roomType: 'Deluxe King', floor: 1, capacity: 2, pricePerNight: '', roomStatus: 'Available' }

const STATUS_BADGE = { Available: 'green', Occupied: 'red', Reserved: 'yellow', 'Not Ready': 'gray' }

export default function AdminRooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editRoom, setEditRoom] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    setLoading(true)
    api.get('/rooms')
      .then(res => { setRooms(Array.isArray(res.data) ? res.data : []) })
      .catch(err => { console.error(err); setRooms([]) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = rooms.filter(r => {
    const matchSearch = r.roomNumber?.toLowerCase().includes(search.toLowerCase()) || r.roomType?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || r.roomStatus === statusFilter
    return matchSearch && matchStatus
  })

  const openAdd = () => { setEditRoom(null); setForm(EMPTY_FORM); setModalOpen(true) }
  const openEdit = (r) => { setEditRoom(r); setForm({ roomNumber: r.roomNumber, roomType: r.roomType, floor: r.floor, capacity: r.capacity, pricePerNight: r.pricePerNight, roomStatus: r.roomStatus }); setModalOpen(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, pricePerNight: Number(form.pricePerNight), floor: Number(form.floor), capacity: Number(form.capacity) }
    try {
      if (editRoom) {
        await api.put(`/rooms/${editRoom.roomId || editRoom.id}`, payload)
        setRooms(rooms.map(r => (r.roomId || r.id) === (editRoom.roomId || editRoom.id) ? { ...r, ...payload } : r))
      } else {
        const res = await api.post('/rooms', payload)
        const newRoom = res.data
        if (newRoom) setRooms([...rooms, newRoom])
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Operation failed')
    }
    setModalOpen(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this room?')) return
    try {
      await api.delete(`/rooms/${id}`)
      setRooms(rooms.filter(r => (r.roomId || r.id) !== id))
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 className="page-title">Room Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Manage room inventory, pricing, and availability</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Room</button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="booking-search" style={{ flex: 1, minWidth: 220 }}>
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search by room number or type..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="booking-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Reserved">Reserved</option>
            <option value="Not Ready">Not Ready</option>
          </select>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Room #</th>
              <th>Type</th>
              <th>Floor</th>
              <th>Capacity</th>
              <th>Price/Night</th>
              <th>Status</th>
              <th style={{ width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="empty-state">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7}><div className="empty-state"><Package size={48} style={{opacity:0.3, marginBottom:12}} /><p>No rooms found</p></div></td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.roomId || r.id} style={{ animationDelay: i * 0.03 + 's' }}>
                <td><span className="room-badge">Room {r.roomNumber}</span></td>
                <td style={{ fontWeight: 600 }}>{r.roomType}</td>
                <td>{r.floor}</td>
                <td>{r.capacity} guests</td>
                <td>${(r.pricePerNight || 0).toLocaleString()}</td>
                <td><span className={`badge badge-${STATUS_BADGE[r.roomStatus] || 'gray'}`}>{r.roomStatus}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-icon" onClick={() => openEdit(r)} title="Edit"><Edit2 size={15} /></button>
                    <button className="btn-icon" onClick={() => handleDelete(r.roomId || r.id)} title="Delete" style={{ color: 'var(--danger)' }}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editRoom ? 'Edit Room' : 'Add Room'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Room Number</label>
            <input type="text" required value={form.roomNumber} onChange={e => setForm({ ...form, roomNumber: e.target.value })} placeholder="e.g. 101" />
          </div>
          <div className="form-group">
            <label>Room Type</label>
            <select value={form.roomType} onChange={e => setForm({ ...form, roomType: e.target.value })}>
              <option>Standard Twin</option>
              <option>Deluxe King</option>
              <option>Suite</option>
              <option>Executive Suite</option>
              <option>Penthouse</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Floor</label>
              <input type="number" required min={1} value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Capacity</label>
              <input type="number" required min={1} value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Price/Night ($)</label>
            <input type="number" required min={0} value={form.pricePerNight} onChange={e => setForm({ ...form, pricePerNight: e.target.value })} placeholder="e.g. 250" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.roomStatus} onChange={e => setForm({ ...form, roomStatus: e.target.value })}>
              <option>Available</option>
              <option>Occupied</option>
              <option>Reserved</option>
              <option>Not Ready</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">{editRoom ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
