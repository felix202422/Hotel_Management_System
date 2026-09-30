import { useState } from 'react'
import { FileText, Download, TrendingUp, DollarSign, Users, Star, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const PIE_COLORS = ['#1e65ff', '#d4f321', '#a3e635', '#f59e0b']

export default function Reports() {
  const [generated, setGenerated] = useState(false)

  const revenueData = [
    { month: 'Feb', revenue: 28400, expenses: 18200 },
    { month: 'Mar', revenue: 32100, expenses: 19500 },
    { month: 'Apr', revenue: 29800, expenses: 17800 },
    { month: 'May', revenue: 35600, expenses: 20100 },
    { month: 'Jun', revenue: 41200, expenses: 22400 },
    { month: 'Jul', revenue: 38500, expenses: 21000 },
  ]

  const sourceData = [
    { name: 'Booking.com', value: 42 },
    { name: 'Direct', value: 28 },
    { name: 'Expedia', value: 18 },
    { name: 'Other', value: 12 },
  ]

  const occData = [
    { month: 'Feb', rate: 68 }, { month: 'Mar', rate: 74 }, { month: 'Apr', rate: 72 },
    { month: 'May', rate: 81 }, { month: 'Jun', rate: 89 }, { month: 'Jul', rate: 85 },
  ]

  const stats = [
    { label: 'Total Revenue', value: '$205,600', change: '+18.3%', icon: DollarSign, color: '#1e65ff' },
    { label: 'Avg. Occupancy', value: '78.2%', change: '+5.1%', icon: TrendingUp, color: '#059669' },
    { label: 'Total Guests', value: '1,847', change: '+12.4%', icon: Users, color: '#d97706' },
    { label: 'Avg. Rating', value: '4.7 / 5.0', change: '+0.3', icon: Star, color: '#8b5cf6' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 className="page-title">Reports</h1>
        <button className="btn-primary" onClick={() => setGenerated(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={18} /> {generated ? 'Regenerate Report' : 'Generate Report'}
        </button>
      </div>

      {generated ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Download size={16} /> Download PDF
            </button>
          </div>

          <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Fizzo Hotels - Performance Report</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: 2 }}>Period: February - July 2026 | Generated: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="badge badge-green" style={{ fontSize: '0.8rem', padding: '6px 16px' }}>Final</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            {stats.map((s) => (
              <div className="kpi-card" key={s.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <div className="kpi-icon" style={{ background: `${s.color}15`, color: s.color }}><s.icon size={20} /></div>
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
                  <Bar dataKey="revenue" fill="#1e65ff" radius={[6, 6, 0, 0]} name="Revenue" />
                  <Bar dataKey="expenses" fill="#ff4d4d" radius={[6, 6, 0, 0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="charts-row">
            <div className="card chart-card">
              <div className="chart-header"><h3>Occupancy Rate Trend</h3></div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={occData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} formatter={(v) => [`${v}%`, 'Occupancy']} />
                  <Line type="monotone" dataKey="rate" stroke="#1e65ff" strokeWidth={3} dot={{ fill: '#1e65ff', r: 5 }} />
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

          <div className="card">
            <div className="chart-header"><h3>Key Insights</h3></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                'Revenue grew 18.3% compared to previous 6-month period, driven by increased booking volume.',
                'Occupancy rates peaked in June at 89%, indicating strong seasonal demand.',
                'Booking.com remains the largest source channel at 42%, followed by direct bookings at 28%.',
                'Average guest rating improved to 4.7/5.0, with cleanliness scoring highest at 94%.',
              ].map((insight, i) => (
                <div key={i} style={{ padding: 16, background: 'var(--bg)', borderRadius: 12, fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
                  <BarChart3 size={16} style={{ color: 'var(--primary)', marginBottom: 6 }} />
                  {insight}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '100px 40px' }}>
          <FileText size={64} style={{ color: 'var(--muted)', marginBottom: 16 }} />
          <h2 style={{ fontSize: '1.3rem', marginBottom: 8 }}>No Report Generated Yet</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto' }}>
            Click the "Generate Report" button above to create a comprehensive performance report with charts, KPIs, and insights.
          </p>
        </div>
      )}
    </div>
  )
}
