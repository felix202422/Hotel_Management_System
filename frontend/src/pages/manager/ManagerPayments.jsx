import { useState, useEffect } from 'react'
import { Search, DollarSign } from 'lucide-react'
import api from '../../api/axios'

const FICTIOUS = [
  { paymentId: 1, amount: 1350, paymentMethod: 'Credit Card', paymentDate: '2026-08-28', paymentStatus: 'Paid', guest: { firstName: 'Alice', lastName: 'Johnson' } },
  { paymentId: 2, amount: 1000, paymentMethod: 'Debit Card', paymentDate: '2026-08-29', paymentStatus: 'Paid', guest: { firstName: 'Robert', lastName: 'Chen' } },
  { paymentId: 3, amount: 2600, paymentMethod: 'Bank Transfer', paymentDate: '2026-08-29', paymentStatus: 'Pending', guest: { firstName: 'Maria', lastName: 'Garcia' } },
  { paymentId: 4, amount: 3600, paymentMethod: 'Credit Card', paymentDate: '2026-08-25', paymentStatus: 'Paid', guest: { firstName: 'James', lastName: 'Wilson' } },
  { paymentId: 5, amount: 720, paymentMethod: 'Cash', paymentDate: '2026-08-30', paymentStatus: 'Paid', guest: { firstName: 'Sophie', lastName: 'Turner' } },
  { paymentId: 6, amount: 1950, paymentMethod: 'Credit Card', paymentDate: '2026-08-27', paymentStatus: 'Paid', guest: { firstName: 'David', lastName: 'Kim' } },
  { paymentId: 7, amount: 1800, paymentMethod: 'Bank Transfer', paymentDate: '2026-08-31', paymentStatus: 'Pending', guest: { firstName: 'Emma', lastName: 'Brown' } },
  { paymentId: 8, amount: 750, paymentMethod: 'Debit Card', paymentDate: '2026-08-26', paymentStatus: 'Paid', guest: { firstName: 'Michael', lastName: 'Davis' } },
  { paymentId: 9, amount: 720, paymentMethod: 'Cash', paymentDate: '2026-08-28', paymentStatus: 'Paid', guest: { firstName: 'Olivia', lastName: 'Martinez' } },
  { paymentId: 10, amount: 500, paymentMethod: 'Credit Card', paymentDate: '2026-08-29', paymentStatus: 'Pending', guest: { firstName: 'William', lastName: 'Taylor' } },
  { paymentId: 11, amount: 1000, paymentMethod: 'Bank Transfer', paymentDate: '2026-08-30', paymentStatus: 'Paid', guest: { firstName: 'Sarah', lastName: 'Mitchell' } },
  { paymentId: 12, amount: 1950, paymentMethod: 'Credit Card', paymentDate: '2026-08-27', paymentStatus: 'Paid', guest: { firstName: 'Thomas', lastName: 'Anderson' } },
]

const STATUS_BADGE = {
  Paid: 'badge-green',
  Pending: 'badge-yellow',
  Refunded: 'badge-blue',
  Failed: 'badge-red',
}

export default function ManagerPayments() {
  const [payments, setPayments] = useState(FICTIOUS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    api.get('/payments').then((res) => { setPayments(Array.isArray(res.data) ? res.data : []) }).catch(err => { console.error(err) })
  }, [])

  const getGuestName = (p) => {
    const g = p.reservation?.guest || p.guest || {}
    return `${g.firstName || ''} ${g.lastName || ''}`.trim()
  }

  const filtered = payments.filter(p => {
    const guestName = getGuestName(p).toLowerCase()
    const method = (p.paymentMethod || '').toLowerCase()
    const matchesSearch = guestName.includes(search.toLowerCase()) || method.includes(search.toLowerCase()) || String(p.paymentId).includes(search)
    const matchesStatus = filterStatus === 'All' || p.paymentStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Payments</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Track and manage all payment transactions</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
            <input type="text" placeholder="Search payments..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <select className="booking-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option>All</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Refunded</option>
            <option>Failed</option>
          </select>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Guest</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="empty-state"><DollarSign size={40} style={{ color: 'var(--border)', marginBottom: 12 }} /><br />No payments found</td></tr>
            ) : filtered.map((p, i) => (
              <tr key={p.paymentId} style={{ animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.03 * i}s` }}>
                <td><span className="room-badge">#{p.paymentId}</span></td>
                <td>
                  {(() => {
                    const g = p.reservation?.guest || p.guest || {}
                    return (
                      <div className="guest-cell">
                        <div className="guest-avatar-sm">{g.firstName?.[0]}{g.lastName?.[0]}</div>
                        <span style={{ fontWeight: 500 }}>{g.firstName} {g.lastName}</span>
                      </div>
                    )
                  })()}
                </td>
                <td style={{ fontWeight: 700 }}>${p.amount?.toLocaleString()}</td>
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
    </div>
  )
}