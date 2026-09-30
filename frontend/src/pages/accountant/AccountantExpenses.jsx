import { useState, useEffect } from 'react'
import { Search, Plus, DollarSign, TrendingDown, AlertTriangle } from 'lucide-react'
import api from '../../api/axios'

const CATEGORIES = ['Maintenance', 'Supplies', 'Utilities', 'Staff', 'Marketing', 'Other']

const FICTIOUS = [
  { expenseId: 1, category: 'Maintenance', description: 'AC unit repair - Room 301', amount: 1200, date: '2026-08-01', status: 'Approved' },
  { expenseId: 2, category: 'Utilities', description: 'Monthly electricity bill', amount: 3400, date: '2026-08-03', status: 'Approved' },
  { expenseId: 3, category: 'Supplies', description: 'Bathroom amenities restock', amount: 800, date: '2026-08-05', status: 'Approved' },
  { expenseId: 4, category: 'Staff', description: 'Monthly payroll - August', amount: 12000, date: '2026-08-10', status: 'Approved' },
  { expenseId: 5, category: 'Marketing', description: 'Online advertising campaign', amount: 2500, date: '2026-08-12', status: 'Pending' },
  { expenseId: 6, category: 'Maintenance', description: 'Pool filter replacement', amount: 650, date: '2026-08-15', status: 'Approved' },
  { expenseId: 7, category: 'Utilities', description: 'Water and sewage bill', amount: 1800, date: '2026-08-15', status: 'Approved' },
  { expenseId: 8, category: 'Supplies', description: 'Linen and towels purchase', amount: 1400, date: '2026-08-18', status: 'Approved' },
  { expenseId: 9, category: 'Other', description: 'Insurance premium', amount: 2200, date: '2026-08-20', status: 'Pending' },
  { expenseId: 10, category: 'Staff', description: 'Overtime bonus payments', amount: 1500, date: '2026-08-22', status: 'Approved' },
  { expenseId: 11, category: 'Marketing', description: 'Brochure printing', amount: 350, date: '2026-08-25', status: 'Approved' },
  { expenseId: 12, category: 'Maintenance', description: 'Elevator inspection fee', amount: 900, date: '2026-08-28', status: 'Pending' },
]

const CATEGORY_COLORS = {
  Maintenance: '#ef4444',
  Supplies: '#f59e0b',
  Utilities: '#3b82f6',
  Staff: '#8b5cf6',
  Marketing: '#ec4899',
  Other: '#64748b',
}

const STATUS_BADGE = {
  Approved: 'badge-green',
  Pending: 'badge-yellow',
  Rejected: 'badge-red',
}

export default function AccountantExpenses() {
  const [expenses, setExpenses] = useState(FICTIOUS)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [newExpense, setNewExpense] = useState({ category: 'Maintenance', description: '', amount: '', status: 'Pending' })

  useEffect(() => {
    api.get('/expenses').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      if (data.length > 0) setExpenses(data)
    }).catch(err => console.error(err))
  }, [])

  const filtered = expenses.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()) || String(e.expenseId).includes(search)
    const matchesCategory = filterCategory === 'All' || e.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const monthlyAvg = expenses.length > 0 ? Math.round(totalExpenses / 3) : 0
  const largestExpense = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0

  const fmt = (v) => `$${(v || 0).toLocaleString()}`

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) return
    const entry = {
      expenseId: expenses.length + 1,
      category: newExpense.category,
      description: newExpense.description,
      amount: Number(newExpense.amount),
      date: new Date().toISOString().slice(0, 10),
      status: newExpense.status,
    }
    api.post('/expenses', entry).then(() => {
      return api.get('/expenses')
    }).then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      if (data.length > 0) setExpenses(data)
      else setExpenses(prev => [entry, ...prev])
    }).catch(err => {
      console.error(err)
      setExpenses(prev => [entry, ...prev])
    })
    setShowModal(false)
    setNewExpense({ category: 'Maintenance', description: '', amount: '', status: 'Pending' })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Expenses</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Monitor and categorize hotel expenses</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Expense
        </button>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="kpi-card" style={{ animationDelay: '0ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff' }}><DollarSign size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(totalExpenses)}</span>
            <span className="kpi-label">Total Expenses</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '60ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><TrendingDown size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(monthlyAvg)}</span>
            <span className="kpi-label">Monthly Average</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '120ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><AlertTriangle size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(largestExpense)}</span>
            <span className="kpi-label">Largest Expense</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
            <input type="text" placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <select className="booking-filter" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option>All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <table className="booking-table">
          <thead>
            <tr><th>ID</th><th>Category</th><th>Description</th><th>Amount</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="empty-state">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                  <DollarSign size={40} style={{ color: 'var(--border)', marginBottom: 12 }} />
                  <span>No expenses found</span>
                </div>
              </td></tr>
            ) : filtered.map((e, i) => (
              <tr key={e.expenseId} style={{ animationDelay: `${i * 40}ms` }}>
                <td><span className="room-badge">EXP-{e.expenseId}</span></td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[e.category] || '#64748b' }} />
                    {e.category}
                  </span>
                </td>
                <td>{e.description}</td>
                <td style={{ fontWeight: 700, color: '#dc2626' }}>{fmt(e.amount)}</td>
                <td>{e.date}</td>
                <td>
                  <span className={`badge ${STATUS_BADGE[e.status] || 'badge-gray'}`}>{e.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, animation: 'fadeIn 0.2s ease' }}>
          <div className="card" style={{ width: 460, maxHeight: '90vh', overflowY: 'auto', animation: 'slideUp 0.3s ease' }}>
            <div className="booking-list-header" style={{ marginBottom: 20 }}>
              <h3>Add Expense</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" placeholder="Enter description" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Amount ($)</label>
              <input type="number" placeholder="0.00" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={newExpense.status} onChange={(e) => setNewExpense({ ...newExpense, status: e.target.value })}>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddExpense}>Add Expense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
