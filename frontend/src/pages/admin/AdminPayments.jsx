import { useState, useEffect } from 'react'
import { Search, DollarSign, CreditCard, Package } from 'lucide-react'
import api from '../../api/axios'

const fmt = (v) => `$${(v || 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    setLoading(true)
    api.get('/payments')
      .then(res => { setPayments(Array.isArray(res.data) ? res.data : []) })
      .catch(err => { console.error(err); setPayments([]) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = payments.filter(p => {
    const guest = `${p.reservation?.guest?.firstName || ''} ${p.reservation?.guest?.lastName || ''}`.toLowerCase()
    const method = p.paymentMethod?.toLowerCase() || ''
    const matchSearch = guest.includes(search.toLowerCase()) || method.includes(search.toLowerCase()) || String(p.paymentId || p.id).includes(search)
    const matchStatus = statusFilter === 'All' || p.paymentStatus === statusFilter
    return matchSearch && matchStatus
  })

  const totalPaid = filtered.filter(p => p.paymentStatus === 'Paid').reduce((s, p) => s + (p.amount || 0), 0)
  const totalPending = filtered.filter(p => p.paymentStatus === 'Pending').reduce((s, p) => s + (p.amount || 0), 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 className="page-title">Payments</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Track payment transactions and pending balances</p>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><DollarSign size={15} style={{ color: '#22C55E' }} /> Paid: <strong>{fmt(totalPaid)}</strong></span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CreditCard size={15} style={{ color: '#FACC15' }} /> Pending: <strong>{fmt(totalPending)}</strong></span>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="booking-search" style={{ flex: 1, minWidth: 220 }}>
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search by guest, method, or ID..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="booking-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Reservation</th>
              <th>Guest</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="empty-state">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7}><div className="empty-state"><Package size={48} style={{opacity:0.3, marginBottom:12}} /><p>No payments found</p></div></td></tr>
            ) : filtered.map((p, i) => (
              <tr key={p.paymentId || p.id} style={{ animationDelay: i * 0.03 + 's' }}>
                <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>#{p.paymentId || p.id}</td>
                <td><span className="room-badge">#{p.reservation?.reservationId || p.reservation?.id || '-'}</span></td>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{p.reservation?.guest?.firstName?.[0]}{p.reservation?.guest?.lastName?.[0]}</div>
                    <span style={{ fontWeight: 600 }}>{p.reservation?.guest?.firstName} {p.reservation?.guest?.lastName}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 700 }}>{fmt(p.amount)}</td>
                <td>{p.paymentMethod}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{p.paymentDate}</td>
                <td>
                  <span className={`badge badge-${p.paymentStatus === 'Paid' ? 'green' : 'yellow'}`}>
                    {p.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
