import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Search, CheckCircle, XCircle, CalendarCheck } from 'lucide-react'
import api from '../../api/axios'
import Modal from '../../components/Modal'

export default function SecretaryReservations() {
  const [reservations, setReservations] = useState([])
  const [guests, setGuests] = useState([])
  const [rooms, setRooms] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ guestId: '', roomId: '', checkInDate: '', checkOutDate: '' })
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/reservations').catch(err => { console.error(err); return { data: [] } }),
      api.get('/guests').catch(err => { console.error(err); return { data: [] } }),
      api.get('/rooms').catch(err => { console.error(err); return { data: [] } }),
    ]).then(([resR, resG, resRo]) => {
      setReservations(Array.isArray(resR.data) ? resR.data : [])
      setGuests(Array.isArray(resG.data) ? resG.data : [])
      setRooms(Array.isArray(resRo.data) ? resRo.data : [])
    })
  }, [])

  const filtered = reservations.filter(r => {
    const name = `${r.guest?.firstName || ''} ${r.guest?.lastName || ''}`.toLowerCase()
    const room = `room ${r.room?.roomNumber}`.toLowerCase()
    const matchesSearch = name.includes(search.toLowerCase()) || room.includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'All' || r.reservationStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleApprove = (id) => {
    setReservations(prev => prev.map(r => r.reservationId === id ? { ...r, reservationStatus: 'Checked-In' } : r))
  }

  const handleCancel = (id) => {
    setReservations(prev => prev.map(r => r.reservationId === id ? { ...r, reservationStatus: 'Cancelled' } : r))
  }

  const openModal = () => {
    setForm({ guestId: '', roomId: '', checkInDate: '', checkOutDate: '' })
    setStep(1)
    setModalOpen(true)
  }

  const nextStep = () => setStep(s => Math.min(s + 1, 4))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const selectedGuest = guests.find(g => g.guestId === Number(form.guestId))
  const selectedRoom = rooms.find(r => r.roomId === Number(form.roomId))

  const calcTotal = () => {
    if (!selectedRoom || !form.checkInDate || !form.checkOutDate) return 0
    const nights = Math.max(1, Math.ceil((new Date(form.checkOutDate) - new Date(form.checkInDate)) / 86400000))
    return nights * selectedRoom.pricePerNight
  }

  const confirmReservation = () => {
    api.post('/reservations', {
      guestId: Number(form.guestId),
      roomId: Number(form.roomId),
      checkInDate: form.checkInDate,
      checkOutDate: form.checkOutDate,
    }).then(res => {
      const newRes = res.data || {
        reservationId: Date.now(),
        guest: selectedGuest ? { firstName: selectedGuest.firstName, lastName: selectedGuest.lastName, email: selectedGuest.email } : { firstName: 'New', lastName: 'Guest' },
        room: selectedRoom ? { roomNumber: selectedRoom.roomNumber, roomType: selectedRoom.roomType } : { roomNumber: 'TBD' },
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        totalPrice: calcTotal(),
        reservationStatus: 'Reserved',
      }
      setReservations(prev => [newRes, ...prev])
      setModalOpen(false)
    }).catch(err => {
      console.error(err)
      const newRes = {
        reservationId: Date.now(),
        guest: selectedGuest ? { firstName: selectedGuest.firstName, lastName: selectedGuest.lastName, email: selectedGuest.email } : { firstName: 'New', lastName: 'Guest' },
        room: selectedRoom ? { roomNumber: selectedRoom.roomNumber, roomType: selectedRoom.roomType } : { roomNumber: 'TBD' },
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        totalPrice: calcTotal(),
        reservationStatus: 'Reserved',
      }
      setReservations(prev => [newRes, ...prev])
      setModalOpen(false)
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Reservations</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Manage guest bookings and reservations</p>
        </div>
        <button className="btn-primary" onClick={openModal}>+ New Reservation</button>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Reservation" wide>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: step >= s ? 'var(--primary)' : '#f1f5f9', color: step >= s ? '#fff' : 'var(--text-secondary)',
                fontWeight: 700, fontSize: '0.8rem', marginBottom: 4
              }}>{s}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                {s === 1 ? 'Guest' : s === 2 ? 'Room' : s === 3 ? 'Dates' : 'Confirm'}
              </div>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="form-group">
            <label>Select Guest</label>
            <select value={form.guestId} onChange={(e) => setForm({ ...form, guestId: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid var(--input-border)' }}>
              <option value="">Choose a guest...</option>
              {guests.map(g => <option key={g.guestId} value={g.guestId}>{g.firstName} {g.lastName}</option>)}
            </select>
          </div>
        )}

        {step === 2 && (
          <div className="form-group">
            <label>Select Room</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {rooms.filter(r => r.roomStatus === 'Available').map(r => (
                <div key={r.roomId} onClick={() => setForm({ ...form, roomId: r.roomId })}
                  style={{
                    padding: 16, border: form.roomId === String(r.roomId) ? '2px solid var(--primary)' : '2px solid var(--border)',
                    borderRadius: 12, cursor: 'pointer', background: form.roomId === String(r.roomId) ? 'var(--primary-light)' : '#fff'
                  }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>Room {r.roomNumber}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>{r.roomType}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginTop: 8 }}>${r.pricePerNight}/night</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Check-in Date</label>
              <input type="date" value={form.checkInDate} onChange={(e) => setForm({ ...form, checkInDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Check-out Date</label>
              <input type="date" value={form.checkOutDate} onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Guest</div>
                  <div style={{ fontWeight: 600 }}>{selectedGuest?.firstName} {selectedGuest?.lastName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Room</div>
                  <div style={{ fontWeight: 600 }}>{selectedRoom?.roomNumber} - {selectedRoom?.roomType}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Check-in</div>
                  <div style={{ fontWeight: 600 }}>{form.checkInDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Check-out</div>
                  <div style={{ fontWeight: 600 }}>{form.checkOutDate}</div>
                </div>
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Total</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>${calcTotal()}</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          {step > 1 ? <button className="btn-secondary" onClick={prevStep}>Back</button> : <div />}
          {step < 4 ? (
            <button className="btn-primary" onClick={nextStep} disabled={step === 1 && !form.guestId}>Next</button>
          ) : (
            <button className="btn-primary" onClick={confirmReservation}>Confirm Reservation</button>
          )}
        </div>
      </Modal>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Search reservations..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <select className="booking-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option>All</option>
            <option>Checked-In</option>
            <option>Reserved</option>
            <option>Checked-Out</option>
            <option>Cancelled</option>
          </select>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="empty-state"><CalendarCheck size={40} style={{ color: 'var(--border)', marginBottom: 12 }} /><br />No reservations found</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.reservationId} style={{ animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.03 * i}s` }}>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{r.guest?.firstName?.[0]}{r.guest?.lastName?.[0]}</div>
                    <span style={{ fontWeight: 500 }}>{r.guest?.firstName} {r.guest?.lastName}</span>
                  </div>
                </td>
                <td><span className="room-badge">Room {r.room?.roomNumber}</span></td>
                <td>{r.checkInDate}</td>
                <td>{r.checkOutDate}</td>
                <td style={{ fontWeight: 700 }}>${r.totalPrice}</td>
                <td>
                  <span className={`badge badge-${r.reservationStatus === 'Checked-In' ? 'yellow' : r.reservationStatus === 'Reserved' ? 'blue' : r.reservationStatus === 'Cancelled' ? 'red' : 'green'}`}>
                    {r.reservationStatus}
                  </span>
                </td>
                <td>
                  {r.reservationStatus === 'Reserved' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-sm btn-success" onClick={() => handleApprove(r.reservationId)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button className="btn-sm btn-danger" onClick={() => handleCancel(r.reservationId)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <XCircle size={14} /> Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}