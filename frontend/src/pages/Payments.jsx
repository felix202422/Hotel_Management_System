import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import api from '../api/axios'

const FICTIOUS = [
  { paymentId: 1, amount: 1350, paymentMethod: 'Credit Card', paymentDate: '2026-07-28', paymentStatus: 'Paid', reservation: { reservationId: 1 } },
  { paymentId: 2, amount: 1000, paymentMethod: 'Debit Card', paymentDate: '2026-07-29', paymentStatus: 'Paid', reservation: { reservationId: 2 } },
  { paymentId: 3, amount: 2600, paymentMethod: 'Bank Transfer', paymentDate: '2026-08-01', paymentStatus: 'Pending', reservation: { reservationId: 3 } },
  { paymentId: 4, amount: 3600, paymentMethod: 'Credit Card', paymentDate: '2026-07-25', paymentStatus: 'Paid', reservation: { reservationId: 4 } },
  { paymentId: 5, amount: 720, paymentMethod: 'Cash', paymentDate: '2026-07-30', paymentStatus: 'Paid', reservation: { reservationId: 5 } },
  { paymentId: 6, amount: 1950, paymentMethod: 'Credit Card', paymentDate: '2026-07-27', paymentStatus: 'Paid', reservation: { reservationId: 6 } },
  { paymentId: 7, amount: 1800, paymentMethod: 'Bank Transfer', paymentDate: '2026-08-02', paymentStatus: 'Pending', reservation: { reservationId: 7 } },
  { paymentId: 8, amount: 750, paymentMethod: 'Debit Card', paymentDate: '2026-07-26', paymentStatus: 'Paid', reservation: { reservationId: 8 } },
  { paymentId: 9, amount: 720, paymentMethod: 'Cash', paymentDate: '2026-07-28', paymentStatus: 'Paid', reservation: { reservationId: 9 } },
  { paymentId: 10, amount: 1350, paymentMethod: 'Credit Card', paymentDate: '2026-08-05', paymentStatus: 'Pending', reservation: { reservationId: 10 } },
  { paymentId: 11, amount: 1000, paymentMethod: 'Bank Transfer', paymentDate: '2026-08-10', paymentStatus: 'Pending', reservation: { reservationId: 11 } },
  { paymentId: 12, amount: 1950, paymentMethod: 'Credit Card', paymentDate: '2026-08-03', paymentStatus: 'Paid', reservation: { reservationId: 12 } },
]

export default function Payments() {
  const [payments, setPayments] = useState(FICTIOUS)

  useEffect(() => {
    api.get('/payments').then((res) => { if (res.data.length) setPayments(res.data) }).catch(() => {})
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 className="page-title">Payments</h1>
      </div>

      <div className="card">
        <div className="booking-search" style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
          <input type="text" placeholder="Search payments..." style={{ paddingLeft: 36, width: 300 }} />
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Reservation</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr><td colSpan={6} className="empty-state">No payments found</td></tr>
            ) : payments.map((p) => (
              <tr key={p.paymentId}>
                <td><span className="room-badge">#{p.paymentId}</span></td>
                <td>Reservation #{p.reservation?.reservationId}</td>
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
