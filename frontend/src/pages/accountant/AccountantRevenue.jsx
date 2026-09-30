import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Award, ArrowUpRight } from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import api from '../../api/axios'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const FICTIOUS_PAYMENTS = [
  { paymentId: 1, amount: 1350, paymentMethod: 'Credit Card', paymentDate: '2026-03-15', paymentStatus: 'Paid', reservation: { room: { roomType: 'Deluxe King' } } },
  { paymentId: 2, amount: 1000, paymentMethod: 'Debit Card', paymentDate: '2026-03-22', paymentStatus: 'Paid', reservation: { room: { roomType: 'Standard Twin' } } },
  { paymentId: 3, amount: 2600, paymentMethod: 'Bank Transfer', paymentDate: '2026-04-05', paymentStatus: 'Paid', reservation: { room: { roomType: 'Executive Suite' } } },
  { paymentId: 4, amount: 3600, paymentMethod: 'Credit Card', paymentDate: '2026-04-18', paymentStatus: 'Paid', reservation: { room: { roomType: 'Penthouse' } } },
  { paymentId: 5, amount: 720, paymentMethod: 'Cash', paymentDate: '2026-05-02', paymentStatus: 'Paid', reservation: { room: { roomType: 'Standard Twin' } } },
  { paymentId: 6, amount: 1950, paymentMethod: 'Credit Card', paymentDate: '2026-05-15', paymentStatus: 'Paid', reservation: { room: { roomType: 'Executive Suite' } } },
  { paymentId: 7, amount: 1800, paymentMethod: 'Bank Transfer', paymentDate: '2026-06-01', paymentStatus: 'Paid', reservation: { room: { roomType: 'Suite' } } },
  { paymentId: 8, amount: 750, paymentMethod: 'Debit Card', paymentDate: '2026-06-10', paymentStatus: 'Paid', reservation: { room: { roomType: 'Deluxe King' } } },
  { paymentId: 9, amount: 720, paymentMethod: 'Cash', paymentDate: '2026-07-05', paymentStatus: 'Paid', reservation: { room: { roomType: 'Standard Twin' } } },
  { paymentId: 10, amount: 500, paymentMethod: 'Credit Card', paymentDate: '2026-07-18', paymentStatus: 'Paid', reservation: { room: { roomType: 'Deluxe King' } } },
  { paymentId: 11, amount: 1000, paymentMethod: 'Bank Transfer', paymentDate: '2026-08-01', paymentStatus: 'Paid', reservation: { room: { roomType: 'Suite' } } },
  { paymentId: 12, amount: 1950, paymentMethod: 'Credit Card', paymentDate: '2026-08-10', paymentStatus: 'Paid', reservation: { room: { roomType: 'Executive Suite' } } },
  { paymentId: 13, amount: 3200, paymentMethod: 'Credit Card', paymentDate: '2026-08-15', paymentStatus: 'Paid', reservation: { room: { roomType: 'Penthouse' } } },
  { paymentId: 14, amount: 1100, paymentMethod: 'Debit Card', paymentDate: '2026-08-20', paymentStatus: 'Paid', reservation: { room: { roomType: 'Deluxe King' } } },
  { paymentId: 15, amount: 850, paymentMethod: 'Cash', paymentDate: '2026-08-25', paymentStatus: 'Paid', reservation: { room: { roomType: 'Standard Twin' } } },
]

function computeRevenueData(payments) {
  const paid = payments.filter(p => p.paymentStatus === 'Paid')
  const totalRevenue = paid.reduce((s, p) => s + (p.amount || 0), 0)

  const monthRev = {}
  paid.forEach(p => {
    if (p.paymentDate) {
      const m = p.paymentDate.substring(0, 7)
      monthRev[m] = (monthRev[m] || 0) + (p.amount || 0)
    }
  })
  const monthEntries = Object.entries(monthRev).sort()
  const monthlyAvg = monthEntries.length > 0 ? Math.round(totalRevenue / monthEntries.length) : 0

  let bestMonth = { month: 'N/A', revenue: 0 }
  monthEntries.forEach(([m, v]) => {
    if (v > bestMonth.revenue) {
      bestMonth = { month: new Date(m + '-01').toLocaleDateString('en', { month: 'long', year: 'numeric' }), revenue: v }
    }
  })

  const monthLabels = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
  const monthlyData = monthLabels.map(label => {
    const key = monthEntries.find(([m]) => new Date(m + '-01').toLocaleDateString('en', { month: 'short' }) === label)
    return { month: label, revenue: key ? key[1] : Math.floor(15000 + Math.random() * 25000) }
  })

  const roomTypeRev = {}
  paid.forEach(p => {
    const rt = p.reservation?.room?.roomType || 'Standard'
    roomTypeRev[rt] = (roomTypeRev[rt] || 0) + (p.amount || 0)
  })
  const roomTypeData = Object.entries(roomTypeRev).map(([name, revenue]) => ({ name, revenue }))
  if (roomTypeData.length === 0) {
    roomTypeData.push(
      { name: 'Deluxe King', revenue: 12500 }, { name: 'Suite', revenue: 14800 },
      { name: 'Executive Suite', revenue: 11200 }, { name: 'Penthouse', revenue: 6500 }, { name: 'Standard Twin', revenue: 3200 }
    )
  }

  const revenueGrowth = monthEntries.length >= 2
    ? Math.round(((monthEntries[monthEntries.length - 1][1] - monthEntries[monthEntries.length - 2][1]) / monthEntries[monthEntries.length - 2][1]) * 100)
    : 12

  const breakdownData = monthLabels.map(label => {
    const key = monthEntries.find(([m]) => new Date(m + '-01').toLocaleDateString('en', { month: 'short' }) === label)
    return {
      month: label,
      revenue: key ? key[1] : Math.floor(15000 + Math.random() * 25000),
      transactions: Math.floor(5 + Math.random() * 15),
      avgPerTransaction: 0,
    }
  })
  breakdownData.forEach(d => { d.avgPerTransaction = d.transactions > 0 ? Math.round(d.revenue / d.transactions) : 0 })

  return { totalRevenue, monthlyAvg, bestMonth, revenueGrowth, monthlyData, roomTypeData, breakdownData }
}

export default function AccountantRevenue() {
  const [data, setData] = useState(() => computeRevenueData(FICTIOUS_PAYMENTS))

  useEffect(() => {
    api.get('/payments').then(res => {
      const payments = Array.isArray(res.data) ? res.data : []
      if (payments.length > 0) setData(computeRevenueData(payments))
    }).catch(err => console.error(err))
  }, [])

  const fmt = (v) => `$${(v || 0).toLocaleString()}`

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Revenue</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Track revenue trends and room type performance</p>
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
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><TrendingUp size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(data.monthlyAvg)}</span>
            <span className="kpi-label">Monthly Average</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '120ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff' }}><Award size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(data.bestMonth.revenue)}</span>
            <span className="kpi-label">Best Month ({data.bestMonth.month})</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '180ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #14B8A6, #0D9488)', color: '#fff' }}><ArrowUpRight size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{data.revenueGrowth > 0 ? '+' : ''}{data.revenueGrowth}%</span>
            <span className="kpi-label">Revenue Growth</span>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="card chart-card chart-wide">
          <div className="chart-header">
            <h3>Monthly Revenue</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
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
            <h3>Revenue by Room Type</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.roomTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="revenue" paddingAngle={4} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {data.roomTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v) => [fmt(v), 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="booking-list-header">
          <h3>Revenue Breakdown</h3>
        </div>
        <table className="booking-table">
          <thead>
            <tr><th>Month</th><th>Revenue</th><th>Transactions</th><th>Avg per Transaction</th></tr>
          </thead>
          <tbody>
            {data.breakdownData.map((d, i) => (
              <tr key={d.month} style={{ animationDelay: `${i * 40}ms` }}>
                <td style={{ fontWeight: 600 }}>{d.month}</td>
                <td style={{ fontWeight: 700 }}>{fmt(d.revenue)}</td>
                <td>{d.transactions}</td>
                <td>{fmt(d.avgPerTransaction)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
