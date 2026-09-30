import { useState, useEffect } from 'react'
import { LogIn, User, Bed, CreditCard, ArrowRight } from 'lucide-react'
import api from '../../api/axios'

export default function SecretaryCheckin() {
  const [reservations, setReservations] = useState([])
  const [selected, setSelected] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    api.get('/reservations').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      setReservations(data.filter(r => r.reservationStatus === 'Reserved'))
    }).catch(err => console.error(err))
  }, [])

  const handleCheckin = () => {
    if (!selected) return
    api.put(`/reservations/${selected.reservationId}/checkin`).catch(err => console.error(err))
    api.put(`/rooms/${selected.room?.roomId}`, { roomStatus: 'Occupied' }).catch(err => console.error(err))
    setReservations(prev => prev.filter(r => r.reservationId !== selected.reservationId))
    setSuccess(true)
    setTimeout(() => { setSuccess(false); setSelected(null) }, 2000)
  }

  if (success) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <LogIn size={40} style={{ color: '#16a34a' }} />
        </div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>Check-in Successful!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Guest has been checked in and room marked as Occupied.</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Check-in</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Process guest arrivals and room assignments</p>
        </div>
        <span className="badge badge-blue" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>{reservations.length} pending</span>
      </div>

      <div className="charts-row" style={{ gridTemplateColumns: '1fr 1.2fr', alignItems: 'flex-start' }}>
        <div className="card">
          <div className="chart-header">
            <h3>Arrivals ({reservations.length})</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reservations.length === 0 ? (
              <div className="empty-state"><LogIn size={40} style={{ color: 'var(--border)', marginBottom: 12 }} /><br />No pending check-ins</div>
            ) : reservations.map((r, i) => (
              <div key={r.reservationId} onClick={() => setSelected(r)}
                style={{
                  padding: 16, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                  border: selected?.reservationId === r.reservationId ? '2px solid var(--primary)' : '2px solid var(--border)',
                  background: selected?.reservationId === r.reservationId ? 'var(--primary-light)' : '#fff',
                  animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.05 * i}s`,
                }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="guest-avatar-sm" style={{ width: 40, height: 40, fontSize: '0.85rem' }}>{r.guest?.firstName?.[0]}{r.guest?.lastName?.[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.guest?.firstName} {r.guest?.lastName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Room {r.room?.roomNumber} · {r.room?.roomType}</div>
                    </div>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-secondary)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          {selected ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div className="guest-avatar-sm" style={{ width: 56, height: 56, fontSize: '1.1rem' }}>{selected.guest?.firstName?.[0]}{selected.guest?.lastName?.[0]}</div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selected.guest?.firstName} {selected.guest?.lastName}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{selected.guest?.email}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Bed size={18} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Room</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Room {selected.room?.roomNumber}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>{selected.room?.roomType} · Floor {selected.room?.floor}</div>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <CreditCard size={18} style={{ color: '#16a34a' }} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Payment</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>${selected.totalPrice}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>Full stay total</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 }}>Check-in</div>
                    <div style={{ fontWeight: 600 }}>{selected.checkInDate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 }}>Check-out</div>
                    <div style={{ fontWeight: 600 }}>{selected.checkOutDate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 }}>Contact</div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{selected.guest?.phone}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 }}>Status</div>
                    <span className="badge badge-blue">Reserved</span>
                  </div>
                </div>
              </div>

              <button className="btn-primary" onClick={handleCheckin} style={{ width: '100%', padding: '14px 24px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <LogIn size={20} /> Confirm Check-in
              </button>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '80px 20px' }}>
              <User size={48} style={{ color: 'var(--border)', marginBottom: 16 }} />
              <p>Select a guest to view check-in details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}