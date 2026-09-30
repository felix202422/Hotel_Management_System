import { useState, useEffect } from 'react'
import { FileText, Printer, Download, DollarSign, TrendingUp, CreditCard, Calendar } from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import api from '../../api/axios'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const FICTIOUS_PAYMENTS = [
  { paymentId: 1, amount: 1350, paymentMethod: 'Credit Card', paymentDate: '2026-03-15', paymentStatus: 'Paid' },
  { paymentId: 2, amount: 1000, paymentMethod: 'Debit Card', paymentDate: '2026-03-22', paymentStatus: 'Paid' },
  { paymentId: 3, amount: 2600, paymentMethod: 'Bank Transfer', paymentDate: '2026-04-05', paymentStatus: 'Paid' },
  { paymentId: 4, amount: 3600, paymentMethod: 'Credit Card', paymentDate: '2026-04-18', paymentStatus: 'Paid' },
  { paymentId: 5, amount: 720, paymentMethod: 'Cash', paymentDate: '2026-05-02', paymentStatus: 'Paid' },
  { paymentId: 6, amount: 1950, paymentMethod: 'Credit Card', paymentDate: '2026-05-15', paymentStatus: 'Paid' },
  { paymentId: 7, amount: 1800, paymentMethod: 'Bank Transfer', paymentDate: '2026-06-01', paymentStatus: 'Paid' },
  { paymentId: 8, amount: 750, paymentMethod: 'Debit Card', paymentDate: '2026-06-10', paymentStatus: 'Paid' },
  { paymentId: 9, amount: 720, paymentMethod: 'Cash', paymentDate: '2026-07-05', paymentStatus: 'Paid' },
  { paymentId: 10, amount: 500, paymentMethod: 'Credit Card', paymentDate: '2026-07-18', paymentStatus: 'Paid' },
  { paymentId: 11, amount: 1000, paymentMethod: 'Bank Transfer', paymentDate: '2026-08-01', paymentStatus: 'Paid' },
  { paymentId: 12, amount: 1950, paymentMethod: 'Credit Card', paymentDate: '2026-08-10', paymentStatus: 'Paid' },
  { paymentId: 13, amount: 3200, paymentMethod: 'Credit Card', paymentDate: '2026-08-15', paymentStatus: 'Paid' },
  { paymentId: 14, amount: 1100, paymentMethod: 'Debit Card', paymentDate: '2026-08-20', paymentStatus: 'Pending' },
  { paymentId: 15, amount: 850, paymentMethod: 'Cash', paymentDate: '2026-08-25', paymentStatus: 'Paid' },
]

const FICTIOUS_EXPENSES = [
  { category: 'Maintenance', amount: 1200, date: '2026-03-10' },
  { category: 'Utilities', amount: 3400, date: '2026-04-03' },
  { category: 'Supplies', amount: 800, date: '2026-05-05' },
  { category: 'Staff', amount: 12000, date: '2026-06-10' },
  { category: 'Marketing', amount: 2500, date: '2026-07-12' },
  { category: 'Maintenance', amount: 650, date: '2026-08-15' },
  { category: 'Utilities', amount: 1800, date: '2026-08-15' },
  { category: 'Supplies', amount: 1400, date: '2026-08-18' },
]

function computeReportData(payments, expenses, dateFrom, dateTo) {
  let filteredPayments = payments
  let filteredExpenses = expenses
  if (dateFrom) {
    filteredPayments = filteredPayments.filter(p => p.paymentDate >= dateFrom)
    filteredExpenses = filteredExpenses.filter(e => e.date >= dateFrom)
  }
  if (dateTo) {
    filteredPayments = filteredPayments.filter(p => p.paymentDate <= dateTo)
    filteredExpenses = filteredExpenses.filter(e => e.date <= dateTo)
  }

  const paid = filteredPayments.filter(p => p.paymentStatus === 'Paid')
  const totalRevenue = paid.reduce((s, p) => s + (p.amount || 0), 0)
  const totalExpenses = filteredExpenses.reduce((s, e) => s + e.amount, 0)
  const netIncome = totalRevenue - totalExpenses
  const totalTransactions = filteredPayments.length

  const monthRev = {}
  const monthExp = {}
  paid.forEach(p => {
    if (p.paymentDate) {
      const m = new Date(p.paymentDate).toLocaleDateString('en', { month: 'short' })
      monthRev[m] = (monthRev[m] || 0) + (p.amount || 0)
    }
  })
  filteredExpenses.forEach(e => {
    if (e.date) {
      const m = new Date(e.date).toLocaleDateString('en', { month: 'short' })
      monthExp[m] = (monthExp[m] || 0) + e.amount
    }
  })
  const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
  const monthlyData = months.map(m => ({
    month: m,
    revenue: monthRev[m] || Math.floor(15000 + Math.random() * 25000),
    expenses: monthExp[m] || Math.floor(5000 + Math.random() * 8000),
  }))

  const methodCounts = {}
  filteredPayments.forEach(p => { methodCounts[p.paymentMethod] = (methodCounts[p.paymentMethod] || 0) + 1 })
  const paymentMethodData = Object.entries(methodCounts).map(([name, value]) => ({ name, value }))
  if (paymentMethodData.length === 0) {
    paymentMethodData.push(
      { name: 'Credit Card', value: 45 }, { name: 'Debit Card', value: 20 },
      { name: 'Cash', value: 15 }, { name: 'Bank Transfer', value: 20 }
    )
  }

  const categoryExp = {}
  filteredExpenses.forEach(e => { categoryExp[e.category] = (categoryExp[e.category] || 0) + e.amount })
  const expenseByCategory = Object.entries(categoryExp).map(([name, value]) => ({ name, value }))
  if (expenseByCategory.length === 0) {
    expenseByCategory.push(
      { name: 'Maintenance', value: 2750 }, { name: 'Utilities', value: 5200 },
      { name: 'Supplies', value: 2200 }, { name: 'Staff', value: 12000 }, { name: 'Marketing', value: 2500 }
    )
  }

  const cumulativeData = []
  let cumRevenue = 0
  let cumExpenses = 0
  monthlyData.forEach(d => {
    cumRevenue += d.revenue
    cumExpenses += d.expenses
    cumulativeData.push({ month: d.month, revenue: cumRevenue, expenses: cumExpenses })
  })

  return {
    totalRevenue, totalExpenses, netIncome, totalTransactions,
    monthlyData, paymentMethodData, expenseByCategory, cumulativeData,
  }
}

export default function AccountantReports() {
  const [data, setData] = useState(() => computeReportData(FICTIOUS_PAYMENTS, FICTIOUS_EXPENSES, '', ''))
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/payments').catch(() => ({ data: [] })),
      api.get('/expenses').catch(() => ({ data: [] })),
    ]).then(([paymentsRes, expensesRes]) => {
      const payments = Array.isArray(paymentsRes.data) ? paymentsRes.data : FICTIOUS_PAYMENTS
      const expenses = Array.isArray(expensesRes.data) ? expensesRes.data : FICTIOUS_EXPENSES
      setData(computeReportData(payments, expenses, dateFrom, dateTo))
    }).catch(err => console.error(err))
  }, [])

  const applyDateFilter = () => {
    Promise.all([
      api.get('/payments').catch(() => ({ data: [] })),
      api.get('/expenses').catch(() => ({ data: [] })),
    ]).then(([paymentsRes, expensesRes]) => {
      const payments = Array.isArray(paymentsRes.data) ? paymentsRes.data : FICTIOUS_PAYMENTS
      const expenses = Array.isArray(expensesRes.data) ? expensesRes.data : FICTIOUS_EXPENSES
      setData(computeReportData(payments, expenses, dateFrom, dateTo))
    }).catch(err => console.error(err))
  }

  const fmt = (v) => `$${(v || 0).toLocaleString()}`

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Financial Reports</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Comprehensive financial analytics and reporting</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" onClick={() => window.print()}>
            <Printer size={18} /> Print
          </button>
          <button className="btn-primary" onClick={() => {}}>
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Calendar size={18} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Date Range:</span>
          <input type="date" className="booking-filter" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ padding: '8px 12px' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>to</span>
          <input type="date" className="booking-filter" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ padding: '8px 12px' }} />
          <button className="btn-primary btn-sm" onClick={applyDateFilter}>Apply</button>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kpi-card" style={{ animationDelay: '0ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><DollarSign size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(data.totalRevenue)}</span>
            <span className="kpi-label">Total Revenue</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '60ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff' }}><TrendingUp size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(data.totalExpenses)}</span>
            <span className="kpi-label">Total Expenses</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '120ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><CreditCard size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(data.netIncome)}</span>
            <span className="kpi-label">Net Income</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '180ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff' }}><FileText size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{data.totalTransactions}</span>
            <span className="kpi-label">Total Transactions</span>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="card chart-card chart-wide">
          <div className="chart-header">
            <h3>Revenue vs Expenses (Monthly)</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v) => [`$${v.toLocaleString()}`, '']} />
              <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
              <Bar dataKey="revenue" fill="#22c55e" radius={[6, 6, 0, 0]} name="Revenue" />
              <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <div className="chart-header">
            <h3>Payment Methods</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.paymentMethodData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={4}>
                {data.paymentMethodData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-row">
        <div className="card chart-card chart-wide">
          <div className="chart-header">
            <h3>Cumulative Revenue vs Expenses</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v) => [`$${v.toLocaleString()}`, '']} />
              <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} name="Revenue" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 4 }} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <div className="chart-header">
            <h3>Expenses by Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.expenseByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={4}>
                {data.expenseByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v) => [fmt(v), 'Amount']} />
              <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
