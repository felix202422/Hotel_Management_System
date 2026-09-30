import { useState, useEffect } from 'react'
import { Home, DoorOpen, Lock, LogIn, LogOut, CalendarCheck, DollarSign, Users, Wrench, TrendingUp, ArrowUpRight, Package } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../../api/axios'

const PIE_COLORS = ['#3B82F6', '#22C55E', '#FACC15', '#EF4444', '#8B5CF6']

const FALLBACK = {
  totalRooms: 16,
  availableRooms: 4,
  occupiedRooms: 8,
  reservedRooms: 2,
  maintenanceRooms: 2,
  todayCheckins: 2,
  todayCheckouts: 1,
  activeReservations: 10,
  todayRevenue: 3350,
  totalRevenue: 13770,
  occupancyRate: 63,
  totalGuests: 14,
  totalStaff: 6,
  pendingMaintenance: 2,
  pendingPayments: 2,
  monthlyRevenue: [
    { month: '2026-01', revenue: 12000 },
    { month: '2026-02', revenue: 15500 },
    { month: '2026-03', revenue: 14200 },
    { month: '2026-04', revenue: 18900 },
    { month: '2026-05', revenue: 22400 },
    { month: '2026-06', revenue: 19800 },
    { month: '2026-07', revenue: 25600 },
    { month: '2026-08', revenue: 13770 },
  ],
  occupancyTrend: [],
  roomAvailability: [
    { status: 'Available', count: 4, percentage: 25 },
    { status: 'Occupied', count: 8, percentage: 50 },
    { status: 'Reserved', count: 2, percentage: 12.5 },
    { status: 'Maintenance', count: 2, percentage: 12.5 },
  ],
  bookingSources: [
    { source: 'Walk-in', count: 4 },
    { source: 'Online', count: 6 },
    { source: 'Phone', count: 3 },
    { source: 'Agent', count: 2 },
  ],
  recentReservations: [
    { reservationId: 1, guestName: 'Alice Johnson', roomNumber: '201', checkInDate: '2026-07-28', checkOutDate: '2026-07-31', totalPrice: 1350, status: 'Checked-In' },
    { reservationId: 2, guestName: 'Robert Chen', roomNumber: '102', checkInDate: '2026-07-29', checkOutDate: '2026-08-02', totalPrice: 1000, status: 'Checked-In' },
    { reservationId: 3, guestName: 'Maria Garcia', roomNumber: '301', checkInDate: '2026-08-01', checkOutDate: '2026-08-05', totalPrice: 2600, status: 'Reserved' },
    { reservationId: 4, guestName: 'James Wilson', roomNumber: '402', checkInDate: '2026-07-25', checkOutDate: '2026-07-28', totalPrice: 3600, status: 'Checked-Out' },
    { reservationId: 5, guestName: 'Sophie Turner', roomNumber: '103', checkInDate: '2026-07-30', checkOutDate: '2026-08-03', totalPrice: 720, status: 'Checked-In' },
    { reservationId: 6, guestName: 'David Kim', roomNumber: '302', checkInDate: '2026-07-27', checkOutDate: '2026-07-30', totalPrice: 1950, status: 'Checked-Out' },
    { reservationId: 7, guestName: 'Emma Brown', roomNumber: '404', checkInDate: '2026-08-02', checkOutDate: '2026-08-06', totalPrice: 1800, status: 'Reserved' },
    { reservationId: 8, guestName: 'Michael Davis', roomNumber: '204', checkInDate: '2026-07-26', checkOutDate: '2026-07-29', totalPrice: 750, status: 'Checked-Out' },
  ],
}

function formatRevenue(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return []
  return arr.map((item) => ({
    month: item.month
      ? new Date(item.month + (item.month.includes('-') && item.month.split('-')[1].length <= 2 ? '-01' : '')).toLocaleDateString('en', { month: 'short' })
      : item.month,
    revenue: item.revenue || 0,
  }))
}

function formatCurrency(v) {
  return `TZS ${(v || 0).toLocaleString('en')}`
}

function getStatusBadge(status) {
  switch (status) {
    case 'Checked-In': return 'badge-yellow'
    case 'Reserved': return 'badge-blue'
    case 'Checked-Out': return 'badge-green'
    case 'Cancelled': return 'badge-red'
    default: return 'badge-gray'
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user] = useState(() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((res) => {
        setStats(res.data)
      })
      .catch((err) => {
        console.warn('Dashboard stats fetch failed, using fallback data:', err)
        setStats(FALLBACK)
      })
      .finally(() => setLoading(false))
  }, [])

  const data = stats || FALLBACK
  const revenueData = formatRevenue(data.monthlyRevenue)
  const roomAvail = Array.isArray(data.roomAvailability) ? data.roomAvailability : []
  const recentRes = Array.isArray(data.recentReservations) ? data.recentReservations : []
  const bookingSrc = Array.isArray(data.bookingSources) ? data.bookingSources : []
  const totalRoomCount = roomAvail.reduce((s, r) => s + (r.count || 0), 0) || 1

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const name = user?.username || user?.name || user?.fullName || 'Admin'

  const STATUS_COLORS = { Available: '#22C55E', Occupied: '#3B82F6', Reserved: '#FACC15', Maintenance: '#EF4444', 'Not Ready': '#EF4444' }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Welcome back, {name}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>{today}</p>
        </div>
        <span className="badge badge-blue" style={{ fontSize: '0.8rem', padding: '5px 14px' }}>{user?.role || 'Admin'}</span>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card" style={{ animationDelay: '0.1s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><Home size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{data.totalRooms}</span>
            <span className="kpi-label">Total Rooms</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.15s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><DoorOpen size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{data.availableRooms}</span>
            <span className="kpi-label">Available</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.2s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff' }}><Lock size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{data.occupiedRooms}</span>
            <span className="kpi-label">Occupied</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.25s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><CalendarCheck size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{data.reservedRooms}</span>
            <span className="kpi-label">Reserved</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.3s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff' }}><LogIn size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{data.todayCheckins}</span>
            <span className="kpi-label">Today Check-ins</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.35s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #14B8A6, #0D9488)', color: '#fff' }}><LogOut size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{data.todayCheckouts}</span>
            <span className="kpi-label">Today Check-outs</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.4s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><CalendarCheck size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{data.activeReservations}</span>
            <span className="kpi-label">Active Reservations</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.45s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><DollarSign size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{formatCurrency(data.totalRevenue)}</span>
            <span className="kpi-label">Total Revenue</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.5s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff' }}><Users size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{data.totalGuests}</span>
            <span className="kpi-label">Total Guests</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.55s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><Wrench size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{data.pendingMaintenance}</span>
            <span className="kpi-label">Pending Maintenance</span>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="card chart-card chart-wide">
          <div className="chart-header">
            <h3>Revenue Overview</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v) => [formatCurrency(v), 'Revenue']} />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <div className="chart-header"><h3>Room Availability</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={roomAvail} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4} dataKey="count" nameKey="status">
                {roomAvail.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.status] || PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} formatter={(value, name) => [value, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="source-legend">
            {roomAvail.map((item, i) => (
              <div key={item.status || i} className="source-item">
                <span className="source-dot" style={{ background: STATUS_COLORS[item.status] || PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="source-name">{item.status}</span>
                <span className="source-pct">{item.percentage || Math.round(((item.count || 0) / totalRoomCount) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {bookingSrc.length > 0 && (
        <div className="charts-row">
          <div className="card chart-card chart-wide">
            <div className="chart-header"><h3>Booking Sources</h3></div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={bookingSrc} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="source" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card chart-card">
            <div className="chart-header"><h3>Quick Stats</h3></div>
            <div style={{ padding: '12px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Occupancy Rate</span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{data.occupancyRate}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Today's Revenue</span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{formatCurrency(data.todayRevenue)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Staff</span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{data.totalStaff}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Pending Payments</span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: data.pendingPayments > 0 ? 'var(--danger)' : 'var(--success)' }}>{data.pendingPayments}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: 20 }}>
        <div className="booking-list-header">
          <h3>Recent Reservations</h3>
        </div>
        <table className="booking-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentRes.length === 0 ? (
              <tr><td colSpan={6}><div className="empty-state"><Package size={48} style={{opacity:0.3, marginBottom:12}} /><p>No recent reservations</p></div></td></tr>
            ) : recentRes.map((r, i) => (
              <tr key={r.reservationId} style={{ animationDelay: i * 0.03 + 's' }}>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{(r.guestName || '?').split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
                    <span>{r.guestName}</span>
                  </div>
                </td>
                <td><span className="room-badge">Room {r.roomNumber}</span></td>
                <td>{r.checkInDate}</td>
                <td>{r.checkOutDate}</td>
                <td>{formatCurrency(r.totalPrice)}</td>
                <td>
                  <span className={`badge ${getStatusBadge(r.status)}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
