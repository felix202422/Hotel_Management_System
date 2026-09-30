import { useState } from 'react'
import { FileText, Download, Printer, DollarSign, TrendingUp, Users, Star, BarChart3 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts'

const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

const revenueData = [
  { month: 'Feb', revenue: 28400, expenses: 18200 },
  { month: 'Mar', revenue: 32100, expenses: 19500 },
  { month: 'Apr', revenue: 29800, expenses: 17800 },
  { month: 'May', revenue: 35600, expenses: 20100 },
  { month: 'Jun', revenue: 41200, expenses: 22400 },
  { month: 'Jul', revenue: 38500, expenses: 21000 },
  { month: 'Aug', revenue: 42800, expenses: 23100 },
]

const occupancyData = [
  { month: 'Feb', rate: 68 }, { month: 'Mar', rate: 74 }, { month: 'Apr', rate: 72 },
  { month: 'May', rate: 81 }, { month: 'Jun', rate: 89 }, { month: 'Jul', rate: 85 },
  { month: 'Aug', rate: 91 },
]

const sourceData = [
  { name: 'Booking.com', value: 42 },
  { name: 'Direct', value: 28 },
  { name: 'Expedia', value: 18 },
  { name: 'Other', value: 12 },
]

const monthlyRevenueData = [
  { month: 'Feb', revenue: 28400 },
  { month: 'Mar', revenue: 32100 },
  { month: 'Apr', revenue: 29800 },
  { month: 'May', revenue: 35600 },
  { month: 'Jun', revenue: 41200 },
  { month: 'Jul', revenue: 38500 },
  { month: 'Aug', revenue: 42800 },
]

const stats = [
  { label: 'Total Revenue', value: '$248,400', change: '+18.3%', icon: DollarSign, color: '#3b82f6' },
  { label: 'Avg. Occupancy', value: '80.0%', change: '+5.1%', icon: TrendingUp, color: '#22c55e' },
  { label: 'Total Guests', value: '1,847', change: '+12.4%', icon: Users, color: '#f59e0b' },
  { label: 'Avg. Rating', value: '4.7 / 5.0', change: '+0.3', icon: Star, color: '#9333ea' },
]

export default function ManagerReports() {
  const [dateFrom, setDateFrom] = useState('2026-02-01')
  const [dateTo, setDateTo] = useState('2026-08-31')
  const [generated, setGenerated] = useState(true)

  const handlePrint = () => { window.print() }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Reports</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Analyze hotel performance, revenue, and occupancy trends</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Printer size={16} /> Print
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            style={{ padding: '8px 12px', border: '1.5px solid var(--input-border)', borderRadius: 10, fontSize: '0.85rem' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            style={{ padding: '8px 12px', border: '1.5px solid var(--input-border)', borderRadius: 10, fontSize: '0.85rem' }} />
        </div>
        <button className="btn-primary btn-sm" onClick={() => setGenerated(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FileText size={14} /> Generate
        </button>
      </div>

      {generated && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            {stats.map((s, i) => (
              <div className="kpi-card" key={s.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: `${0.1 + i * 0.1}s` }}>
                <div className="kpi-icon" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}dd)`, color: '#fff' }}><s.icon size={20} /></div>
                <div>
                  <div className="kpi-value">{s.value}</div>
                  <div className="kpi-label">{s.label} <span style={{ color: '#059669', fontWeight: 600 }}>{s.change}</span></div>
                </div>
              </div>
            ))}
          </div>

          <div className="charts-row">
            <div className="card chart-card chart-wide">
              <div className="chart-header"><h3>Revenue vs Expenses</h3></div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Revenue" />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="charts-row">
            <div className="card chart-card">
              <div className="chart-header"><h3>Occupancy Rate Trend</h3></div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} formatter={(v) => [`${v}%`, 'Occupancy']} />
                  <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card chart-card">
              <div className="chart-header"><h3>Booking Sources</h3></div>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={4} dataKey="value">
                    {sourceData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="source-legend" style={{ marginTop: 8 }}>
                {sourceData.map((item, i) => (
                  <div key={item.name} className="source-item">
                    <span className="source-dot" style={{ background: PIE_COLORS[i] }} />
                    <span className="source-name">{item.name}</span>
                    <span className="source-pct">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="charts-row">
            <div className="card chart-card chart-wide">
              <div className="chart-header"><h3>Monthly Revenue</h3></div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyRevenueData}>
                  <defs>
                    <linearGradient id="reportRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#reportRevGrad)" dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="chart-header"><h3>Key Insights</h3></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                'Revenue grew 18.3% compared to previous 6-month period, driven by increased booking volume and premium room upgrades.',
                'Occupancy rates peaked in August at 91%, indicating strong seasonal demand ahead of the fall period.',
                'Booking.com remains the largest source channel at 42%, followed by direct bookings at 28% — consider boosting direct booking incentives.',
                'Average guest rating improved to 4.7/5.0, with cleanliness scoring highest at 94%. Continue investing in housekeeping standards.',
              ].map((insight, i) => (
                <div key={i} style={{ padding: 16, background: 'var(--main-bg)', borderRadius: 12, fontSize: '0.82rem', color: '#475569', lineHeight: 1.6, animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.1 + i * 0.08}s` }}>
                  <BarChart3 size={16} style={{ color: 'var(--primary)', marginBottom: 6 }} />
                  {insight}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}