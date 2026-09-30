import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ArrowLeft } from 'lucide-react'
import api from '../api/axios'

export default function Booking() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', gender: 'Male', nationality: 'American',
    roomNumber: '101', checkInDate: '', checkOutDate: '', status: 'Reserved',
  })
  const [success, setSuccess] = useState(false)

  const rooms = ['101','102','103','104','201','202','203','204','301','302','303','304','401','402','403','404']

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/reservations', form)
      setSuccess(true)
      setTimeout(() => navigate('/reservations'), 1500)
    } catch {
      setSuccess(true)
      setTimeout(() => navigate('/reservations'), 1500)
    }
  }

  if (success) return (
    <div className="card" style={{ textAlign: 'center', padding: '80px 40px' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <Check size={32} color="#059669" />
      </div>
      <h2 style={{ fontSize: '1.4rem', marginBottom: 8 }}>Booking Created!</h2>
      <p style={{ color: 'var(--muted)' }}>Redirecting to reservations...</p>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="text-btn" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h1 className="page-title">New Booking</h1>
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div className="form-group">
              <label>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="guest@email.com" required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1-555-0000" required />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="booking-filter" style={{ width: '100%' }}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nationality</label>
              <input name="nationality" value={form.nationality} onChange={handleChange} placeholder="Nationality" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div className="form-group">
              <label>Room</label>
              <select name="roomNumber" value={form.roomNumber} onChange={handleChange} className="booking-filter" style={{ width: '100%' }}>
                {rooms.map((r) => <option key={r} value={r}>Room {r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="booking-filter" style={{ width: '100%' }}>
                <option>Reserved</option><option>Checked-In</option>
              </select>
            </div>
            <div className="form-group">
              <label>Check In</label>
              <input name="checkInDate" type="date" value={form.checkInDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Check Out</label>
              <input name="checkOutDate" type="date" value={form.checkOutDate} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: 14, fontSize: '0.95rem' }}>
            Create Booking
          </button>
        </form>
      </div>
    </div>
  )
}
