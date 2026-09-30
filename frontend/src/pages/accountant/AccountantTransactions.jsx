import { useState, useEffect } from 'react'
import { Search, Download, ArrowUpRight, ArrowDownLeft, RotateCcw } from 'lucide-react'
import api from '../../api/axios'

const FICTIOUS = [
  { transactionId: 'TXN-001', type: 'Payment', description: 'Payment from Alice Johnson - Room 201', amount: 1350, date: '2026-08-29', balance: 48200 },
  { transactionId: 'TXN-002', type: 'Payment', description: 'Payment from Robert Chen - Room 102', amount: 1000, date: '2026-08-29', balance: 47200 },
  { transactionId: 'TXN-003', type: 'Expense', description: 'AC unit repair - Room 301', amount: -1200, date: '2026-08-29', balance: 46200 },
  { transactionId: 'TXN-004', type: 'Payment', description: 'Payment from Maria Garcia - Room 301', amount: 2600, date: '2026-08-28', balance: 47400 },
  { transactionId: 'TXN-005', type: 'Refund', description: 'Refund to James Wilson - Room 402', amount: -500, date: '2026-08-28', balance: 44800 },
  { transactionId: 'TXN-006', type: 'Payment', description: 'Payment from Sophie Turner - Room 103', amount: 720, date: '2026-08-28', balance: 45300 },
  { transactionId: 'TXN-007', type: 'Expense', description: 'Monthly electricity bill', amount: -3400, date: '2026-08-27', balance: 44580 },
  { transactionId: 'TXN-008', type: 'Payment', description: 'Payment from David Kim - Room 302', amount: 1950, date: '2026-08-27', balance: 47980 },
]

const TYPE_ICON = {
  Payment: { icon: ArrowDownLeft, color: '#22c55e', badge: 'badge-green' },
  Expense: { icon: ArrowUpRight, color: '#ef4444', badge: 'badge-red' },
  Refund: { icon: RotateCcw, color: '#f59e0b', badge: 'badge-yellow' },
}

export default function AccountantTransactions() {
  const [transactions, setTransactions] = useState(FICTIOUS)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/payments').catch(() => ({ data: [] })),
      api.get('/expenses').catch(() => ({ data: [] })),
    ]).then(([paymentsRes, expensesRes]) => {
      const payments = Array.isArray(paymentsRes.data) ? paymentsRes.data : []
      const expenses = Array.isArray(expensesRes.data) ? expensesRes.data : []
      if (payments.length > 0 || expenses.length > 0) {
        const combined = []
        let balance = 0
        payments.forEach(p => {
          const amount = p.paymentStatus === 'Paid' ? (p.amount || 0) : -(p.amount || 0)
          balance += amount
          combined.push({
            transactionId: `TXN-${String(combined.length + 1).padStart(3, '0')}`,
            type: p.paymentStatus === 'Paid' ? 'Payment' : 'Refund',
            description: `Payment from ${p.guest?.firstName || ''} ${p.guest?.lastName || ''} - Room ${p.reservation?.room?.roomNumber || 'N/A'}`,
            amount,
            date: p.paymentDate,
            balance,
          })
        })
        expenses.forEach(e => {
          balance -= (e.amount || 0)
          combined.push({
            transactionId: `TXN-${String(combined.length + 1).padStart(3, '0')}`,
            type: 'Expense',
            description: e.description || e.category,
            amount: -(e.amount || 0),
            date: e.date || e.expenseDate,
            balance,
          })
        })
        combined.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
        setTransactions(combined)
      }
    }).catch(err => console.error(err))
  }, [])

  const filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.transactionId.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'All' || t.type === filterType
    let matchesDate = true
    if (dateFrom) matchesDate = matchesDate && t.date >= dateFrom
    if (dateTo) matchesDate = matchesDate && t.date <= dateTo
    return matchesSearch && matchesType && matchesDate
  })

  const fmt = (v) => `${v < 0 ? '-' : ''}$${Math.abs(v || 0).toLocaleString()}`

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Transactions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Complete transaction history with balance tracking</p>
        </div>
        <button className="btn-secondary" onClick={() => {}}>
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
            <input type="text" placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <select className="booking-filter" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option>All Types</option>
              <option>Payment</option>
              <option>Expense</option>
              <option>Refund</option>
            </select>
            <input type="date" className="booking-filter" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ padding: '8px 12px' }} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>to</span>
            <input type="date" className="booking-filter" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ padding: '8px 12px' }} />
          </div>
        </div>

        <table className="booking-table">
          <thead>
            <tr><th>Transaction ID</th><th>Type</th><th>Description</th><th>Amount</th><th>Date</th><th>Balance</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="empty-state">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                  <ArrowDownLeft size={40} style={{ color: 'var(--border)', marginBottom: 12 }} />
                  <span>No transactions found</span>
                </div>
              </td></tr>
            ) : filtered.map((t, i) => {
              const typeInfo = TYPE_ICON[t.type] || TYPE_ICON.Payment
              const Icon = typeInfo.icon
              return (
                <tr key={t.transactionId} style={{ animationDelay: `${i * 40}ms` }}>
                  <td><span className="room-badge">{t.transactionId}</span></td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: typeInfo.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={14} style={{ color: typeInfo.color }} />
                      </span>
                      <span className={`badge ${typeInfo.badge}`}>{t.type}</span>
                    </span>
                  </td>
                  <td>{t.description}</td>
                  <td style={{ fontWeight: 700, color: t.amount >= 0 ? '#22c55e' : '#ef4444' }}>
                    {t.amount >= 0 ? '+' : ''}{fmt(t.amount)}
                  </td>
                  <td>{t.date}</td>
                  <td style={{ fontWeight: 600 }}>{fmt(t.balance)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
