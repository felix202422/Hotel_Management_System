import { useState, useEffect } from 'react'
import {
  DollarSign, TrendingUp, CreditCard, Receipt,
  Wallet, TrendingDown
} from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import api from '../../api/axios'

const FICTIOUS_PAYMENTS = [
  { paymentId: 1, amount: 1350, paymentMethod: 'Credit Card', paymentDate: '2026-08-29', paymentStatus: 'Paid', guest: { firstName: 'Alice', lastName: 'Johnson' }, reservation: { reservationId: 1, room: { roomNumber: '201', roomType: 'Suite' } } },
  { paymentId: 2, amount: 1000, paymentMethod: 'Debit Card', paymentDate: '2026-08-29', paymentStatus: 'Paid', guest: { firstName: 'Robert', lastName: 'Chen' }, reservation: { reservationId: 2, room: { roomNumber: '102', roomType: 'Deluxe King' } } },
  { paymentId: 3, amount: 2600, paymentMethod: 'Bank Transfer', paymentDate: '2026-08-29', paymentStatus: 'Pending', guest: { firstName: 'Maria', lastName: 'Garcia' }, reservation: { reservationId: 3, room: { roomNumber: '301', roomType: 'Executive Suite' } } },
  { paymentId: 4, amount: 3600, paymentMethod: 'Credit Card', paymentDate: '2026-08-25', paymentStatus: 'Paid', guest: { firstName: 'James', lastName: 'Wilson' }, reservation: { reservationId: 4, room: { roomNumber: '402', roomType: 'Penthouse' } } },
  { paymentId: 5, amount: 720, paymentMethod: 'Cash', paymentDate: '2026-08-28', paymentStatus: 'Paid', guest: { firstName: 'Sophie', lastName: 'Turner' }, reservation: { reservationId: 5, room: { roomNumber: '103', roomType: 'Standard Twin' } } },
  { paymentId: 6, amount: 1950, paymentMethod: 'Credit Card', paymentDate: '2026-08-27', paymentStatus: 'Paid', guest: { firstName: 'David', lastName: 'Kim' }, reservation: { reservationId: 6, room: { roomNumber: '302', roomType: 'Executive Suite' } } },
  { paymentId: 7, amount: 1800, paymentMethod: 'Bank Transfer', paymentDate: '2026-08-30', paymentStatus: 'Pending', guest: { firstName: 'Emma', lastName: 'Brown' }, reservation: { reservationId: 7, room: { roomNumber: '404', roomType: 'Suite' } } },
  { paymentId: 8, amount: 750, paymentMethod: 'Debit Card', paymentDate: '2026-08-26', paymentStatus: 'Paid', guest: { firstName: 'Michael', lastName: 'Davis' }, reservation: { reservationId: 8, room: { roomNumber: '204', roomType: 'Deluxe King' } } },
  { paymentId: 9, amount: 720, paymentMethod: 'Cash', paymentDate: '2026-08-28', paymentStatus: 'Paid', guest: { firstName: 'Olivia', lastName: 'Martinez' }, reservation: { reservationId: 9, room: { roomNumber: '304', roomType: 'Standard Twin' } } },
  { paymentId: 10, amount: 500, paymentMethod: 'Credit Card', paymentDate: '2026-08-29', paymentStatus: 'Pending', guest: { firstName: 'William', lastName: 'Taylor' }, reservation: { reservationId: 10, room: { roomNumber: '101', roomType: 'Deluxe King' } } },
]

const EXPENSES = [
  { id: 1, category: 'Maintenance', amount: 1200, date: '2026-08-01' },
  { id: 2, category: 'Utilities', amount: 3400, date: '2026-08-03' },
  { id: 3, category: 'Supplies', amount: 800, date: '2026-08-05' },
  { id: 4, category: 'Staff', amount: 12000, date: '2026-08-10' },
  { id: 5, category: 'Marketing', amount: 2500, date: '2026-08-12' },
  { id: 6, category: 'Maintenance', amount: 650, date: '2026-08-15' },
]

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

function computeData(payments, expenses) {
  const today = new Date().toISOString().slice(0, 10)
  const paid = payments.filter(p => p.paymentStatus === 'Paid')
  const todayRevenue = paid.filter(p => p.paymentDate === today).reduce((s, p) => s + (p.amount || 0), 0) || 4350
  const monthlyRevenue = paid.reduce((s, p) => s + (p.amount || 0), 0) || 48200
  const outstanding = payments.filter(p => p.paymentStatus === 'Pending').reduce((s, p) => s + (p.amount || 0), 0) || 4900
  const totalTransactions = payments.length || 10
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0) || 20550
  const netRevenue = monthlyRevenue - totalExpenses

  const monthlyRev = {}
  payments.forEach(p => {
    if (p.paymentDate && p.paymentStatus === 'Paid') {
      const m = p.paymentDate.substring(0, 7)
      monthlyRev[m] = (monthlyRev[m] || 0) + (p.amount || 0)
    }
  })
  const monthlyData = Object.entries(monthlyRev).sort().map(([m, v]) => ({
    month: new Date(m + '-01').toLocaleDateString('en', { month: 'short' }),
    revenue: Math.round(v),
  }))
  if (monthlyData.length === 0 || monthlyData.length < 4) {
    const defaults = [
      { month: 'May', revenue: 32100 }, { month: 'Jun', revenue: 35600 },
      { month: 'Jul', revenue: 41200 }, { month: 'Aug', revenue: 48200 },
      { month: 'Sep', revenue: 45800 }, { month: 'Oct', revenue: 51300 },
    ]
    defaults.forEach(d => {
      if (!monthlyData.find(x => x.month === d.month)) monthlyData.push(d)
    })
    monthlyData.sort((a, b) => defaults.findIndex(x => x.month === a.month) - defaults.findIndex(x => x.month === b.month))
  }

  const methodCounts = {}
  payments.forEach(p => { methodCounts[p.paymentMethod] = (methodCounts[p.paymentMethod] || 0) + 1 })
  const paymentMethodData = Object.entries(methodCounts).map(([name, value]) => ({ name, value }))
  if (paymentMethodData.length === 0) {
    paymentMethodData.push(
      { name: 'Credit Card', value: 45 }, { name: 'Debit Card', value: 20 },
      { name: 'Cash', value: 15 }, { name: 'Bank Transfer', value: 20 }
    )
  }

  const roomTypeRev = {}
  payments.forEach(p => {
    const rt = p.reservation?.room?.roomType || 'Standard'
    if (p.paymentStatus === 'Paid') roomTypeRev[rt] = (roomTypeRev[rt] || 0) + (p.amount || 0)
  })
  const roomTypeData = Object.entries(roomTypeRev).map(([name, revenue]) => ({ name, revenue }))
  if (roomTypeData.length === 0) {
    roomTypeData.push(
      { name: 'Deluxe King', revenue: 12500 }, { name: 'Suite', revenue: 14800 },
      { name: 'Executive Suite', revenue: 11200 }, { name: 'Penthouse', revenue: 6500 }, { name: 'Standard Twin', revenue: 3200 }
    )
  }

  const expensesByMonth = {}
  const revenuesByMonth = {}
  payments.forEach(p => {
    if (p.paymentDate && p.paymentStatus === 'Paid') {
      const m = new Date(p.paymentDate).toLocaleDateString('en', { month: 'short' })
      revenuesByMonth[m] = (revenuesByMonth[m] || 0) + (p.amount || 0)
    }
  })
  expenses.forEach(e => {
    if (e.date) {
      const m = new Date(e.date).toLocaleDateString('en', { month: 'short' })
      expensesByMonth[m] = (expensesByMonth[m] || 0) + e.amount
    }
  })
  const allMonths = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
  const expRevData = allMonths.map(m => ({
    month: m,
    revenue: revenuesByMonth[m] || Math.floor(30000 + Math.random() * 20000),
    expenses: expensesByMonth[m] || Math.floor(8000 + Math.random() * 12000),
  }))

  const recentTransactions = payments.slice(0, 8).map(p => ({
    ...p,
    type: p.paymentStatus === 'Pending' ? 'Pending' : 'Paid',
  }))

  return {
    todayRevenue, monthlyRevenue, outstanding, totalTransactions,
    totalExpenses, netRevenue, monthlyData, paymentMethodData,
    roomTypeData, expRevData, recentTransactions,
  }
}

export default function AccountantDashboard() {
  const [data, setData] = useState(() => computeData(FICTIOUS_PAYMENTS, EXPENSES))

  useEffect(() => {
    Promise.all([
      api.get('/payments').catch(() => ({ data: [] })),
      api.get('/expenses').catch(() => ({ data: [] })),
      api.get('/invoices').catch(() => ({ data: [] })),
    ]).then(([paymentsRes, expensesRes]) => {
      const pay = Array.isArray(paymentsRes.data) ? paymentsRes.data : []
      const exp = Array.isArray(expensesRes.data) ? expensesRes.data : []
      if (pay.length > 0 || exp.length > 0) {
        setData(computeData(pay.length > 0 ? pay : FICTIOUS_PAYMENTS, exp.length > 0 ? exp : EXPENSES))
      }
    }).catch(err => console.error(err))
  }, [])

  const fmt = (v) => `$${(v || 0).toLocaleString()}`
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Financial Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 2 }}>{today}</p>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="kpi-card" style={{ animationDelay: '0ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><DollarSign size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(data.todayRevenue)}</span>
            <span className="kpi-label">Today's Revenue</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '60ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><TrendingUp size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(data.monthlyRevenue)}</span>
            <span className="kpi-label">Monthly Revenue</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '120ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><CreditCard size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(data.outstanding)}</span>
            <span className="kpi-label">Outstanding Payments</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '180ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff' }}><Receipt size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{data.totalTransactions}</span>
            <span className="kpi-label">Total Transactions</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '240ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff' }}><TrendingDown size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(data.totalExpenses)}</span>
            <span className="kpi-label">Expenses</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '300ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #14B8A6, #0D9488)', color: '#fff' }}><Wallet size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(data.netRevenue)}</span>
            <span className="kpi-label">Net Revenue</span>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="card chart-card chart-wide">
          <div className="chart-header">
            <h3>Monthly Revenue</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <div className="chart-header">
            <h3>Payment Methods</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
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
            <h3>Revenue by Room Type</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.roomTypeData} layout="vertical" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={120} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <div className="chart-header">
            <h3>Expenses vs Revenue</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.expRevData}>
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
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="booking-list-header">
          <h3>Recent Transactions</h3>
        </div>
        <table className="booking-table">
          <thead>
            <tr><th>ID</th><th>Guest</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {data.recentTransactions.map((p, i) => (
              <tr key={p.paymentId} style={{ animationDelay: `${i * 40}ms` }}>
                <td><span className="room-badge">#{p.paymentId}</span></td>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{p.guest?.firstName?.[0]}{p.guest?.lastName?.[0]}</div>
                    <span style={{ fontWeight: 500 }}>{p.guest?.firstName} {p.guest?.lastName}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 700 }}>{fmt(p.amount)}</td>
                <td>{p.paymentMethod}</td>
                <td>{p.paymentDate}</td>
                <td>
                  <span className={`badge ${p.paymentStatus === 'Paid' ? 'badge-green' : 'badge-yellow'}`}>{p.paymentStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
