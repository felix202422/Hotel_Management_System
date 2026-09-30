import { useState } from 'react'
import { Download, FileText, TrendingUp, Users, DollarSign, Package } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const COLORS = ['#3B82F6', '#22C55E', '#FACC15', '#EF4444', '#8B5CF6']

const revenueData = [
  { month: 'Jan', revenue: 42000, expenses: 28000 },
  { month: 'Feb', revenue: 38000, expenses: 26000 },
  { month: 'Mar', revenue: 51000, expenses: 30000 },
  { month: 'Apr', revenue: 47000, expenses: 29000 },
  { month: 'May', revenue: 55000, expenses: 32000 },
  { month: 'Jun', revenue: 62000, expenses: 34000 },
  { month: 'Jul', revenue: 58000, expenses: 31000 },
  { month: 'Aug', revenue: 67000, expenses: 35000 },
]

const occupancyData = [
  { month: 'Jan', occupancy: 72 },
  { month: 'Feb', occupancy: 68 },
  { month: 'Mar', occupancy: 78 },
  { month: 'Apr', occupancy: 74 },
  { month: 'May', occupancy: 82 },
  { month: 'Jun', occupancy: 88 },
  { month: 'Jul', occupancy: 85 },
  { month: 'Aug', occupancy: 91 },
]

const sourceData = [
  { name: 'Direct', value: 35 },
  { name: 'Booking.com', value: 28 },
  { name: 'Expedia', value: 18 },
  { name: 'Corporate', value: 12 },
  { name: 'Walk-in', value: 7 },
]

const roomTypeData = [
  { type: 'Standard Twin', bookings: 45 },
  { type: 'Deluxe King', bookings: 62 },
  { type: 'Suite', bookings: 38 },
  { type: 'Executive', bookings: 24 },
  { type: 'Penthouse', bookings: 12 },
]

const fmt = (v) => `$${(v || 0).toLocaleString()}`

export default function AdminReports() {
  const [reportType, setReportType] = useState('overview')

  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0)
  const avgOccupancy = Math.round(occupancyData.reduce((s, d) => s + d.occupancy, 0) / occupancyData.length)
  const totalBookings = roomTypeData.reduce((s, d) => s + d.bookings, 0)

  const handleDownload = () => {
    alert('PDF download would be generated here. This is a UI placeholder.')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 className="page-title">Reports</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Generate and download detailed business analytics reports</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select className="booking-filter" value={reportType} onChange={e => setReportType(e.target.value)}>
            <option value="overview">Overview Report</option>
            <option value="revenue">Revenue Report</option>
            <option value="occupancy">Occupancy Report</option>
            <option value="bookings">Booking Report</option>
          </select>
          <button className="btn-primary" onClick={handleDownload}><Download size={16} /> Download PDF</button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card" style={{ animationDelay: '0.1s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><DollarSign size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{fmt(totalRevenue)}</span>
            <span className="kpi-label">Total Revenue (YTD)</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.15s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><TrendingUp size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{avgOccupancy}%</span>
            <span className="kpi-label">Avg Occupancy Rate</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.2s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><Users size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{totalBookings}</span>
            <span className="kpi-label">Total Bookings</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.25s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff' }}><FileText size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">4.7</span>
            <span className="kpi-label">Guest Rating</span>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="card chart-card chart-wide">
          <div className="chart-header">
            <h3>Revenue vs Expenses</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v) => [fmt(v)]} />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <div className="chart-header">
            <h3>Booking Sources</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-row">
        <div className="card chart-card chart-wide">
          <div className="chart-header">
            <h3>Occupancy Rate Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v) => [`${v}%`, 'Occupancy']} />
              <Line type="monotone" dataKey="occupancy" stroke="#22C55E" strokeWidth={2.5} dot={{ fill: '#22C55E', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <div className="chart-header">
            <h3>Bookings by Room Type</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={roomTypeData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="type" type="category" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="bookings" fill="#3B82F6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="chart-header">
          <h3>Report Summary</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ padding: 16, background: 'var(--main-bg)', borderRadius: 12 }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Highest Revenue Month</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>August</div>
            <div style={{ fontSize: '0.82rem', color: '#22C55E', fontWeight: 600 }}>$67,000</div>
          </div>
          <div style={{ padding: 16, background: 'var(--main-bg)', borderRadius: 12 }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Peak Occupancy</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>August</div>
            <div style={{ fontSize: '0.82rem', color: '#22C55E', fontWeight: 600 }}>91%</div>
          </div>
          <div style={{ padding: 16, background: 'var(--main-bg)', borderRadius: 12 }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Most Booked Room</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Deluxe King</div>
            <div style={{ fontSize: '0.82rem', color: '#3B82F6', fontWeight: 600 }}>62 bookings</div>
          </div>
          <div style={{ padding: 16, background: 'var(--main-bg)', borderRadius: 12 }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Top Booking Source</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Direct</div>
            <div style={{ fontSize: '0.82rem', color: '#3B82F6', fontWeight: 600 }}>35%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
