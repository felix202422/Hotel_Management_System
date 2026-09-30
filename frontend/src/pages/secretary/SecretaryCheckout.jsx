import { useState, useEffect } from 'react'
import { LogOut, User, Bed, CreditCard, AlertCircle } from 'lucide-react'
import api from '../../api/axios'
import Modal from '../../components/Modal'

export default function SecretaryCheckout() {
  const [reservations, setReservations] = useState([])
  const [selected, setSelected] = useState(null)
  const [success, setSuccess] = useState(false)
  const [paymentModal, setPaymentModal] = useState(false)
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: 'Cash' })

  useEffect(() => {
    api.get('/reservations').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      setReservations(data.filter(r => r.reservationStatus === 'Checked-In'))
    }).catch(err => console.error(err))
  }, [])

  const isOverdue = (r) => r.checkOutDate < new Date().toISOString().split('T')[0]

  const handleCheckout = () => {
    if (!selected) return
    api.put(`/reservations/${selected.reservationId}/checkout`).catch(err => console.error(err))
    api.put(`/rooms/${selected.room?.roomId}`, { roomStatus: 'Available' }).catch(err => console.error(err))
    if (paymentModal && paymentForm.amount) {
      api.post('/payments', {
        reservationId: selected.reservationId,
        amount: Number(paymentForm.amount),
        paymentMethod: paymentForm.method,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentStatus: 'Paid',
      }).catch(err => console.error(err))
    }
    setReservations(prev => prev.filter(r => r.reservationId !== selected.reservationId))
    setSuccess(true)
    setPaymentModal(false)
    setTimeout(() => { setSuccess(false); setSelected(null) }, 2000)
  }

  const openPaymentModal = () => {
    setPaymentForm({ amount: selected?.totalPrice || '', method: 'Cash' })
    setPaymentModal(true)
  }

  if (success) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <LogOut size={40} style={{ color: '#16a34a' }} />
        </div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>Check-out Successful!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Guest has been checked out and room marked as Available.</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Check-out</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Process guest departures and finalize payments</p>
        </div>
        <span className="badge badge-yellow" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>{reservations.length} pending</span>
      </div>

      <div className="charts-row" style={{ gridTemplateColumns: '1fr 1.2fr', alignItems: 'flex-start' }}>
        <div className="card">
          <div className="chart-header">
            <h3>Departures ({reservations.length})</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reservations.length === 0 ? (
              <div className="empty-state"><LogOut size={40} style={{ color: 'var(--border)', marginBottom: 12 }} /><br />No pending check-outs</div>
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
                  {isOverdue(r) && (
                    <span className="badge badge-red" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <AlertCircle size={12} /> Overdue
                    </span>
                  )}
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
                    <CreditCard size={18} style={{ color: '#d97706' }} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Balance</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>${selected.totalPrice}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>Outstanding amount</div>
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
                    <div style={{ fontWeight: 600, color: isOverdue(selected) ? '#dc2626' : 'inherit' }}>{selected.checkOutDate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 }}>Contact</div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{selected.guest?.phone}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 }}>Status</div>
                    <span className="badge badge-yellow">Checked-In</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn-secondary" onClick={openPaymentModal} style={{ flex: 1, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <CreditCard size={18} /> Record Payment
                </button>
                <button className="btn-primary" onClick={handleCheckout} style={{ flex: 1, padding: '14px 24px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <LogOut size={20} /> Confirm Check-out
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '80px 20px' }}>
              <User size={48} style={{ color: 'var(--border)', marginBottom: 16 }} />
              <p>Select a guest to view check-out details</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={paymentModal} onClose={() => setPaymentModal(false)} title="Record Payment">
        <div className="form-group">
          <label>Amount ($)</label>
          <input type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} placeholder="Enter amount" />
        </div>
        <div className="form-group">
          <label>Payment Method</label>
          <select value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid var(--input-border)' }}>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        <button className="btn-primary" onClick={handleCheckout} style={{ width: '100%' }}>Record & Check-out</button>
      </Modal>
    </div>
  )
}