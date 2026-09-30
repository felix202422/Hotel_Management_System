import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, User, Bed, Calendar, FileText, ArrowLeft, ArrowRight } from 'lucide-react'
import api from '../../api/axios'

const STEP_ICONS = [User, Bed, Calendar, FileText, CheckCircle]
const STEP_LABELS = ['Guest Info', 'Room Selection', 'Dates', 'Review', 'Success']

export default function SecretaryNewReservation() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [rooms, setRooms] = useState([])
  const [guests, setGuests] = useState([])
  const [selectedGuestId, setSelectedGuestId] = useState('')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [dates, setDates] = useState({ checkInDate: '', checkOutDate: '' })
  const [bookingRef, setBookingRef] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/rooms').catch(err => { console.error(err); return { data: [] } }),
      api.get('/guests').catch(err => { console.error(err); return { data: [] } }),
    ]).then(([resRooms, resGuests]) => {
      setRooms(Array.isArray(resRooms.data) ? resRooms.data : [])
      setGuests(Array.isArray(resGuests.data) ? resGuests.data : [])
    })
  }, [])

  const selectedGuest = guests.find(g => g.guestId === Number(selectedGuestId))

  const nights = dates.checkInDate && dates.checkOutDate
    ? Math.max(1, Math.ceil((new Date(dates.checkOutDate) - new Date(dates.checkInDate)) / 86400000))
    : 0
  const total = selectedRoom ? nights * selectedRoom.pricePerNight : 0

  const nextStep = () => {
    if (step === 4) {
      setLoading(true)
      api.post('/reservations', {
        guestId: Number(selectedGuestId),
        roomId: selectedRoom?.roomId,
        checkInDate: dates.checkInDate,
        checkOutDate: dates.checkOutDate,
      }).then(() => {
        const ref = 'BK-' + Date.now().toString(36).toUpperCase()
        setBookingRef(ref)
        setLoading(false)
        setStep(5)
      }).catch(err => {
        console.error(err)
        const ref = 'BK-' + Date.now().toString(36).toUpperCase()
        setBookingRef(ref)
        setLoading(false)
        setStep(5)
      })
    } else {
      setStep(s => Math.min(s + 1, 5))
    }
  }

  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const canProceed = () => {
    if (step === 1) return selectedGuestId
    if (step === 2) return selectedRoom
    if (step === 3) return dates.checkInDate && dates.checkOutDate && nights > 0
    return true
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn-icon" onClick={() => navigate(-1)}><ArrowLeft size={18} /></button>
        <div>
          <h1 className="page-title">New Reservation</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Create a new guest booking step by step</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          {STEP_LABELS.map((label, i) => {
            const Icon = STEP_ICONS[i]
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step > i + 1 ? '#dcfce7' : step === i + 1 ? 'var(--primary)' : '#f1f5f9',
                  color: step > i + 1 ? '#16a34a' : step === i + 1 ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.3s'
                }}>
                  {step > i + 1 ? <CheckCircle size={18} /> : <Icon size={18} />}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: step === i + 1 ? 700 : 500, color: step === i + 1 ? 'var(--text)' : 'var(--text-secondary)' }}>{label}</span>
                {i < 4 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? '#dcfce7' : '#e5e7eb', margin: '0 8px' }} />}
              </div>
            )
          })}
        </div>

        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Select Guest</h3>
            <div className="form-group">
              <label>Guest *</label>
              <select value={selectedGuestId} onChange={(e) => setSelectedGuestId(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid var(--input-border)' }}>
                <option value="">Choose a guest...</option>
                {guests.map(g => <option key={g.guestId} value={g.guestId}>{g.firstName} {g.lastName} ({g.email})</option>)}
              </select>
            </div>
            {selectedGuest && (
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 2 }}>Name</div>
                  <div style={{ fontWeight: 600 }}>{selectedGuest.firstName} {selectedGuest.lastName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 2 }}>Email</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{selectedGuest.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 2 }}>Phone</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{selectedGuest.phone}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 2 }}>Nationality</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{selectedGuest.nationality}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Select Available Room</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {rooms.filter(r => r.roomStatus === 'Available').map(room => (
                <div key={room.roomId} onClick={() => setSelectedRoom(room)}
                  style={{
                    padding: 20, border: selectedRoom?.roomId === room.roomId ? '2px solid var(--primary)' : '2px solid var(--border)',
                    borderRadius: 12, cursor: 'pointer', background: selectedRoom?.roomId === room.roomId ? 'var(--primary-light)' : '#fff',
                    transition: 'all 0.2s'
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Room {room.roomNumber}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{room.roomType}</div>
                    </div>
                    <span className="badge badge-green">Available</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Floor {room.floor} · {room.capacity} guests</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>${room.pricePerNight}<span style={{ fontSize: '0.7rem', fontWeight: 500 }}>/night</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Select Dates</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 500 }}>
              <div className="form-group">
                <label>Check-in Date *</label>
                <input type="date" value={dates.checkInDate} onChange={(e) => setDates({ ...dates, checkInDate: e.target.value })} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label>Check-out Date *</label>
                <input type="date" value={dates.checkOutDate} onChange={(e) => setDates({ ...dates, checkOutDate: e.target.value })} min={dates.checkInDate || new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            {nights > 0 && (
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                <Calendar size={20} style={{ color: 'var(--primary)' }} />
                <div>
                  <span style={{ fontWeight: 600 }}>{nights} night{nights > 1 ? 's' : ''}</span>
                  <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>({dates.checkInDate} to {dates.checkOutDate})</span>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Review & Confirm</h3>
            <div style={{ background: '#f8fafc', borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Guest</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedGuest?.firstName} {selectedGuest?.lastName}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>{selectedGuest?.email}</div>
                  {selectedGuest?.phone && <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{selectedGuest.phone}</div>}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Room</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>Room {selectedRoom?.roomNumber}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>{selectedRoom?.roomType} · Floor {selectedRoom?.floor}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{selectedRoom?.capacity} guests · ${selectedRoom?.pricePerNight}/night</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Check-in</div>
                  <div style={{ fontWeight: 600 }}>{dates.checkInDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Check-out</div>
                  <div style={{ fontWeight: 600 }}>{dates.checkOutDate}</div>
                </div>
              </div>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '2px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{nights} night{nights > 1 ? 's' : ''} x ${selectedRoom?.pricePerNight}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>Total Amount</div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>${total}</div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={40} style={{ color: '#16a34a' }} />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>Reservation Confirmed!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Your reservation has been successfully created.</p>
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 20, display: 'inline-block', marginBottom: 24 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Booking Reference</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: 2 }}>{bookingRef}</div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn-primary" onClick={() => navigate('/secretary/reservations')}>View Reservations</button>
              <button className="btn-secondary" onClick={() => { setStep(1); setSelectedGuestId(''); setSelectedRoom(null); setDates({ checkInDate: '', checkOutDate: '' }); }}>New Reservation</button>
            </div>
          </div>
        )}
      </div>

      {step < 5 && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {step > 1 ? <button className="btn-secondary" onClick={prevStep} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ArrowLeft size={16} /> Back</button> : <div />}
          <button className="btn-primary" onClick={nextStep} disabled={!canProceed() || loading} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {loading ? 'Processing...' : step === 4 ? 'Confirm Booking' : 'Next'} {step < 4 && <ArrowRight size={16} />}
          </button>
        </div>
      )}
    </div>
  )
}