import { useState, useEffect } from 'react'
import { Search, Plus, DollarSign, Clock, CheckCircle } from 'lucide-react'
import api from '../../api/axios'

const FICTIOUS = [
  { paymentId: 1, amount: 1350, paymentMethod: 'Credit Card', paymentDate: '2026-08-28', paymentStatus: 'Paid', guest: { firstName: 'Alice', lastName: 'Johnson' }, reservation: { reservationId: 1, room: { roomNumber: '201' } } },
  { paymentId: 2, amount: 1000, paymentMethod: 'Debit Card', paymentDate: '2026-08-29', paymentStatus: 'Paid', guest: { firstName: 'Robert', lastName: 'Chen' }, reservation: { reservationId: 2, room: { roomNumber: '102' } } },
  { paymentId: 3, amount: 2600, paymentMethod: 'Bank Transfer', paymentDate: '2026-08-29', paymentStatus: 'Pending', guest: { firstName: 'Maria', lastName: 'Garcia' }, reservation: { reservationId: 3, room: { roomNumber: '301' } } },
  { paymentId: 4, amount: 3600, paymentMethod: 'Credit Card', paymentDate: '2026-08-25', paymentStatus: 'Paid', guest: { firstName: 'James', lastName: 'Wilson' }, reservation: { reservationId: 4, room: { roomNumber: '402' } } },
  { paymentId: 5, amount: 720, paymentMethod: 'Cash', paymentDate: '2026-08-30', paymentStatus: 'Paid', guest: { firstName: 'Sophie', lastName: 'Turner' }, reservation: { reservationId: 5, room: { roomNumber: '103' } } },
  { paymentId: 6, amount: 1950, paymentMethod: 'Credit Card', paymentDate: '2026-08-27', paymentStatus: 'Paid', guest: { firstName: 'David', lastName: 'Kim' }, reservation: { reservationId: 6, room: { roomNumber: '302' } } },
  { paymentId: 7, amount: 1800, paymentMethod: 'Bank Transfer', paymentDate: '2026-08-31', paymentStatus: 'Pending', guest: { firstName: 'Emma', lastName: 'Brown' }, reservation: { reservationId: 7, room: { roomNumber: '404' } } },
  { paymentId: 8, amount: 750, paymentMethod: 'Debit Card', paymentDate: '2026-08-26', paymentStatus: 'Paid', guest: { firstName: 'Michael', lastName: 'Davis' }, reservation: { reservationId: 8, room: { roomNumber: '204' } } },
  { paymentId: 9, amount: 720, paymentMethod: 'Cash', paymentDate: '2026-08-28', paymentStatus: 'Paid', guest: { firstName: 'Olivia', lastName: 'Martinez' }, reservation: { reservationId: 9, room: { roomNumber: '304' } } },
  { paymentId: 10, amount: 500, paymentMethod: 'Credit Card', paymentDate: '2026-08-29', paymentStatus: 'Pending', guest: { firstName: 'William', lastName: 'Taylor' }, reservation: { reservationId: 10, room: { roomNumber: '101' } } },
  { paymentId: 11, amount: 1000, paymentMethod: 'Bank Transfer', paymentDate: '2026-08-30', paymentStatus: 'Paid', guest: { firstName: 'Sarah', lastName: 'Mitchell' }, reservation: { reservationId: 11, room: { roomNumber: '104' } } },
  { paymentId: 12, amount: 1950, paymentMethod: 'Credit Card', paymentDate: '2026-08-27', paymentStatus: 'Paid', guest: { firstName: 'Thomas', lastName: 'Anderson' }, reservation: { reservationId: 12, room: { roomNumber: '203' } } },
]

const STATUS_BADGE = {
  Paid: 'badge-green',
  Pending: 'badge-yellow',
  Refunded: 'badge-blue',
  Failed: 'badge-red',
}

const FICTIOUS_RESERVATIONS = [
  { reservationId: 1, guest: { firstName: 'Alice', lastName: 'Johnson' }, room: { roomNumber: '201' }, totalPrice: 1350 },
  { reservationId: 2, guest: { firstName: 'Robert', lastName: 'Chen' }, room: { roomNumber: '102' }, totalPrice: 1000 },
  { reservationId: 3, guest: { firstName: 'Maria', lastName: 'Garcia' }, room: { roomNumber: '301' }, totalPrice: 2600 },
  { reservationId: 4, guest: { firstName: 'James', lastName: 'Wilson' }, room: { roomNumber: '402' }, totalPrice: 3600 },
  { reservationId: 5, guest: { firstName: 'Sophie', lastName: 'Turner' }, room: { roomNumber: '103' }, totalPrice: 720 },
]

export default function AccountantPayments() {
  const [payments, setPayments] = useState(FICTIOUS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterMethod, setFilterMethod] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [newPayment, setNewPayment] = useState({ reservationId: '', amount: '', paymentMethod: 'Credit Card', paymentStatus: 'Paid' })
  const [reservations, setReservations] = useState(FICTIOUS_RESERVATIONS)

  useEffect(() => {
    api.get('/payments').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      setPayments(data.length > 0 ? data : FICTIOUS)
    }).catch(err => console.error(err))
  }, [])

  const filtered = payments.filter(p => {
    const guestName = `${p.guest?.firstName || ''} ${p.guest?.lastName || ''}`.toLowerCase()
    const method = (p.paymentMethod || '').toLowerCase()
    const matchesSearch = guestName.includes(search.toLowerCase()) || method.includes(search.toLowerCase()) || String(p.paymentId).includes(search)
    const matchesStatus = filterStatus === 'All' || p.paymentStatus === filterStatus
    const matchesMethod = filterMethod === 'All' || p.paymentMethod === filterMethod
    return matchesSearch && matchesStatus && matchesMethod
  })

  const totalPaid = payments.filter(p => p.paymentStatus === 'Paid').reduce((s, p) => s + (p.amount || 0), 0)
  const totalPending = payments.filter(p => p.paymentStatus === 'Pending').reduce((s, p) => s + (p.amount || 0), 0)
  const totalAmount = payments.reduce((s, p) => s + (p.amount || 0), 0)

  const fmt = (v) => `$${(v || 0).toLocaleString()}`

  const handleRecordPayment = () => {
    if (!newPayment.reservationId || !newPayment.amount) return
    const res = reservations.find(r => r.reservationId === Number(newPayment.reservationId))
    const entry = {
      paymentId: payments.length + 1,
      amount: Number(newPayment.amount),
      paymentMethod: newPayment.paymentMethod,
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentStatus: newPayment.paymentStatus,
      guest: res?.guest || { firstName: 'Guest', lastName: 'New' },
      reservation: res || { reservationId: newPayment.reservationId, room: { roomNumber: '---' } },
    }
    api.post('/payments', entry).then(() => {
      return api.get('/payments')
    }).then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      if (data.length > 0) setPayments(data)
      else setPayments(prev => [entry, ...prev])
    }).catch(err => {
      console.error(err)
      setPayments(prev => [entry, ...prev])
    })
    setShowModal(false)
    setNewPayment({ reservationId: '', amount: '', paymentMethod: 'Credit Card', paymentStatus: 'Paid' })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Payments</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Track and record all guest payments</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Record Payment
        </button>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="kpi-card" style={{ animationDelay: '0ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><CheckCircle size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(totalPaid)}</span>
            <span className="kpi-label">Total Paid</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '60ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><Clock size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(totalPending)}</span>
            <span className="kpi-label">Total Pending</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '120ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><DollarSign size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(totalAmount)}</span>
            <span className="kpi-label">Total Amount</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
            <input type="text" placeholder="Search payments..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <select className="booking-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option>All Status</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Refunded</option>
              <option>Failed</option>
            </select>
            <select className="booking-filter" value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
              <option>All Methods</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
            </select>
          </div>
        </div>

        <table className="booking-table">
          <thead>
            <tr><th>ID</th><th>Guest</th><th>Reservation</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="empty-state">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                  <DollarSign size={40} style={{ color: 'var(--border)', marginBottom: 12 }} />
                  <span>No payments found</span>
                </div>
              </td></tr>
            ) : filtered.map((p, i) => (
              <tr key={p.paymentId} style={{ animationDelay: `${i * 40}ms` }}>
                <td><span className="room-badge">#{p.paymentId}</span></td>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{p.guest?.firstName?.[0]}{p.guest?.lastName?.[0]}</div>
                    <span style={{ fontWeight: 500 }}>{p.guest?.firstName} {p.guest?.lastName}</span>
                  </div>
                </td>
                <td><span className="room-badge">RES-{p.reservation?.reservationId || p.paymentId}</span></td>
                <td style={{ fontWeight: 700 }}>{fmt(p.amount)}</td>
                <td>{p.paymentMethod}</td>
                <td>{p.paymentDate}</td>
                <td>
                  <span className={`badge ${STATUS_BADGE[p.paymentStatus] || 'badge-gray'}`}>{p.paymentStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, animation: 'fadeIn 0.2s ease' }}>
          <div className="card" style={{ width: 480, maxHeight: '90vh', overflowY: 'auto', animation: 'slideUp 0.3s ease' }}>
            <div className="booking-list-header" style={{ marginBottom: 20 }}>
              <h3>Record Payment</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="form-group">
              <label>Reservation</label>
              <select value={newPayment.reservationId} onChange={(e) => setNewPayment({ ...newPayment, reservationId: e.target.value })}>
                <option value="">Select reservation</option>
                {reservations.map(r => (
                  <option key={r.reservationId} value={r.reservationId}>
                    RES-{r.reservationId} - {r.guest.firstName} {r.guest.lastName} (Room {r.room.roomNumber})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Amount ($)</label>
              <input type="number" placeholder="0.00" value={newPayment.amount} onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select value={newPayment.paymentMethod} onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Cash</option>
                <option>Bank Transfer</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={newPayment.paymentStatus} onChange={(e) => setNewPayment({ ...newPayment, paymentStatus: e.target.value })}>
                <option>Paid</option>
                <option>Pending</option>
                <option>Refunded</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleRecordPayment}>Record Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
