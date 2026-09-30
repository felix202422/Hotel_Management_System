import { useState, useEffect } from 'react'
import { Search, CreditCard } from 'lucide-react'
import api from '../../api/axios'
import Modal from '../../components/Modal'

export default function SecretaryPayments() {
  const [payments, setPayments] = useState([])
  const [reservations, setReservations] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ reservationId: '', amount: '', method: 'Cash', status: 'Paid' })

  useEffect(() => {
    Promise.all([
      api.get('/payments').catch(err => { console.error(err); return { data: [] } }),
      api.get('/reservations').catch(err => { console.error(err); return { data: [] } }),
    ]).then(([resPay, resRes]) => {
      setPayments(Array.isArray(resPay.data) ? resPay.data : [])
      setReservations(Array.isArray(resRes.data) ? resRes.data : [])
    })
  }, [])

  const filtered = payments.filter(p => {
    const guestName = `${p.reservation?.guest?.firstName || ''} ${p.reservation?.guest?.lastName || ''}`.toLowerCase()
    const roomNum = `room ${p.reservation?.room?.roomNumber || ''}`.toLowerCase()
    const matchSearch = guestName.includes(search.toLowerCase()) || roomNum.includes(search.toLowerCase()) || String(p.paymentId).includes(search)
    const matchStatus = filterStatus === 'All' || p.paymentStatus === filterStatus
    return matchSearch && matchStatus
  })

  const totalPaid = payments.filter(p => p.paymentStatus === 'Paid').reduce((s, p) => s + (p.amount || 0), 0)
  const totalPending = payments.filter(p => p.paymentStatus === 'Pending').reduce((s, p) => s + (p.amount || 0), 0)

  const recordPayment = () => {
    if (!form.reservationId || !form.amount) return
    const payload = {
      reservationId: Number(form.reservationId),
      amount: Number(form.amount),
      paymentMethod: form.method,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentStatus: form.status,
    }
    api.post('/payments', payload).then(res => {
      const newPayment = res.data || { paymentId: Date.now(), ...payload, reservation: reservations.find(r => r.reservationId === Number(form.reservationId)) }
      setPayments(prev => [newPayment, ...prev])
    }).catch(err => {
      console.error(err)
      const res = reservations.find(r => r.reservationId === Number(form.reservationId))
      const newPayment = { paymentId: Date.now(), ...payload, reservation: res ? { reservationId: res.reservationId, guest: res.guest, room: res.room } : { reservationId: form.reservationId } }
      setPayments(prev => [newPayment, ...prev])
    })
    setModalOpen(false)
    setForm({ reservationId: '', amount: '', method: 'Cash', status: 'Paid' })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Payments</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Record and track guest payment transactions</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CreditCard size={18} /> Record Payment
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.1s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><CreditCard size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">${totalPaid.toLocaleString()}</span>
            <span className="kpi-label">Total Paid</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.2s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><CreditCard size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">${totalPending.toLocaleString()}</span>
            <span className="kpi-label">Pending</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.3s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><CreditCard size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{payments.length}</span>
            <span className="kpi-label">Total Transactions</span>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Record Payment">
        <div className="form-group">
          <label>Select Reservation</label>
          <select value={form.reservationId} onChange={(e) => setForm({ ...form, reservationId: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid var(--input-border)' }}>
            <option value="">Choose reservation...</option>
            {reservations.map(r => (
              <option key={r.reservationId} value={r.reservationId}>#{r.reservationId} - {r.guest?.firstName} {r.guest?.lastName} (Room {r.room?.roomNumber})</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Amount ($)</label>
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Enter amount" />
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid var(--input-border)' }}>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid var(--input-border)' }}>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <button className="btn-primary" onClick={recordPayment} style={{ width: '100%' }} disabled={!form.reservationId || !form.amount}>Record Payment</button>
      </Modal>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Search payments..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <select className="booking-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option>All</option>
            <option>Paid</option>
            <option>Pending</option>
          </select>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Guest</th>
              <th>Room</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="empty-state"><CreditCard size={40} style={{ color: 'var(--border)', marginBottom: 12 }} /><br />No payments found</td></tr>
            ) : filtered.map((p, i) => (
              <tr key={p.paymentId} style={{ animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.03 * i}s` }}>
                <td><span className="room-badge">#{p.paymentId}</span></td>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{p.reservation?.guest?.firstName?.[0]}{p.reservation?.guest?.lastName?.[0]}</div>
                    <span style={{ fontWeight: 500 }}>{p.reservation?.guest?.firstName} {p.reservation?.guest?.lastName}</span>
                  </div>
                </td>
                <td><span className="room-badge">Room {p.reservation?.room?.roomNumber}</span></td>
                <td style={{ fontWeight: 700 }}>${p.amount}</td>
                <td>{p.paymentMethod}</td>
                <td>{p.paymentDate}</td>
                <td><span className={`badge badge-${p.paymentStatus === 'Paid' ? 'green' : 'yellow'}`}>{p.paymentStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}