import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  TrendingUp, Users, UserCheck, UserMinus, DollarSign,
  CalendarCheck, CheckCircle2, Clock, ArrowUpRight
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import api from '../api/axios'
import './Dashboard.css'

const STATUS_COLORS = { Available: '#a3e635', Occupied: '#1e65ff', Reserved: '#fef08a', 'Not Ready': '#ff4d4d' }
const PIE_COLORS = ['#1e65ff', '#d4f321', '#a3e635', '#f59e0b']

const FICTIOUS = {
  rooms: [
    { roomId: 1, roomNumber: '101', roomType: 'Deluxe King', floor: 1, capacity: 2, pricePerNight: 250, roomStatus: 'Available' },
    { roomId: 2, roomNumber: '102', roomType: 'Deluxe King', floor: 1, capacity: 2, pricePerNight: 250, roomStatus: 'Occupied' },
    { roomId: 3, roomNumber: '201', roomType: 'Suite', floor: 2, capacity: 4, pricePerNight: 450, roomStatus: 'Occupied' },
    { roomId: 4, roomNumber: '202', roomType: 'Suite', floor: 2, capacity: 4, pricePerNight: 450, roomStatus: 'Available' },
    { roomId: 5, roomNumber: '301', roomType: 'Executive Suite', floor: 3, capacity: 4, pricePerNight: 650, roomStatus: 'Reserved' },
    { roomId: 6, roomNumber: '302', roomType: 'Executive Suite', floor: 3, capacity: 4, pricePerNight: 650, roomStatus: 'Occupied' },
    { roomId: 7, roomNumber: '401', roomType: 'Penthouse', floor: 4, capacity: 6, pricePerNight: 1200, roomStatus: 'Available' },
    { roomId: 8, roomNumber: '402', roomType: 'Penthouse', floor: 4, capacity: 6, pricePerNight: 1200, roomStatus: 'Occupied' },
    { roomId: 9, roomNumber: '103', roomType: 'Standard Twin', floor: 1, capacity: 2, pricePerNight: 180, roomStatus: 'Occupied' },
    { roomId: 10, roomNumber: '104', roomType: 'Standard Twin', floor: 1, capacity: 2, pricePerNight: 180, roomStatus: 'Not Ready' },
    { roomId: 11, roomNumber: '203', roomType: 'Deluxe King', floor: 2, capacity: 2, pricePerNight: 250, roomStatus: 'Available' },
    { roomId: 12, roomNumber: '204', roomType: 'Deluxe King', floor: 2, capacity: 2, pricePerNight: 250, roomStatus: 'Occupied' },
    { roomId: 13, roomNumber: '303', roomType: 'Suite', floor: 3, capacity: 4, pricePerNight: 450, roomStatus: 'Available' },
    { roomId: 14, roomNumber: '304', roomType: 'Standard Twin', floor: 3, capacity: 2, pricePerNight: 180, roomStatus: 'Occupied' },
    { roomId: 15, roomNumber: '403', roomType: 'Deluxe King', floor: 4, capacity: 2, pricePerNight: 250, roomStatus: 'Reserved' },
    { roomId: 16, roomNumber: '404', roomType: 'Suite', floor: 4, capacity: 4, pricePerNight: 450, roomStatus: 'Occupied' },
  ],
  guests: [
    { guestId: 1, firstName: 'Alice', lastName: 'Johnson', email: 'alice@email.com', phone: '+1-555-0101', gender: 'Female', nationality: 'American' },
    { guestId: 2, firstName: 'Robert', lastName: 'Chen', email: 'robert@email.com', phone: '+1-555-0102', gender: 'Male', nationality: 'Canadian' },
    { guestId: 3, firstName: 'Maria', lastName: 'Garcia', email: 'maria@email.com', phone: '+1-555-0103', gender: 'Female', nationality: 'Spanish' },
    { guestId: 4, firstName: 'James', lastName: 'Wilson', email: 'james@email.com', phone: '+1-555-0104', gender: 'Male', nationality: 'British' },
    { guestId: 5, firstName: 'Sophie', lastName: 'Turner', email: 'sophie@email.com', phone: '+1-555-0105', gender: 'Female', nationality: 'Australian' },
    { guestId: 6, firstName: 'David', lastName: 'Kim', email: 'david@email.com', phone: '+1-555-0106', gender: 'Male', nationality: 'South Korean' },
    { guestId: 7, firstName: 'Emma', lastName: 'Brown', email: 'emma@email.com', phone: '+1-555-0107', gender: 'Female', nationality: 'British' },
    { guestId: 8, firstName: 'Michael', lastName: 'Davis', email: 'michael@email.com', phone: '+1-555-0108', gender: 'Male', nationality: 'American' },
    { guestId: 9, firstName: 'Olivia', lastName: 'Martinez', email: 'olivia@email.com', phone: '+1-555-0109', gender: 'Female', nationality: 'Mexican' },
    { guestId: 10, firstName: 'William', lastName: 'Taylor', email: 'william@email.com', phone: '+1-555-0110', gender: 'Male', nationality: 'Canadian' },
  ],
  reservations: [
    { reservationId: 1, guest: { firstName: 'Alice', lastName: 'Johnson' }, room: { roomNumber: '201' }, checkInDate: '2026-07-28', checkOutDate: '2026-07-31', totalPrice: 1350, reservationStatus: 'Checked-In' },
    { reservationId: 2, guest: { firstName: 'Robert', lastName: 'Chen' }, room: { roomNumber: '102' }, checkInDate: '2026-07-29', checkOutDate: '2026-08-02', totalPrice: 1000, reservationStatus: 'Checked-In' },
    { reservationId: 3, guest: { firstName: 'Maria', lastName: 'Garcia' }, room: { roomNumber: '301' }, checkInDate: '2026-08-01', checkOutDate: '2026-08-05', totalPrice: 2600, reservationStatus: 'Reserved' },
    { reservationId: 4, guest: { firstName: 'James', lastName: 'Wilson' }, room: { roomNumber: '402' }, checkInDate: '2026-07-25', checkOutDate: '2026-07-28', totalPrice: 3600, reservationStatus: 'Checked-Out' },
    { reservationId: 5, guest: { firstName: 'Sophie', lastName: 'Turner' }, room: { roomNumber: '103' }, checkInDate: '2026-07-30', checkOutDate: '2026-08-03', totalPrice: 720, reservationStatus: 'Checked-In' },
    { reservationId: 6, guest: { firstName: 'David', lastName: 'Kim' }, room: { roomNumber: '302' }, checkInDate: '2026-07-27', checkOutDate: '2026-07-30', totalPrice: 1950, reservationStatus: 'Checked-Out' },
    { reservationId: 7, guest: { firstName: 'Emma', lastName: 'Brown' }, room: { roomNumber: '404' }, checkInDate: '2026-08-02', checkOutDate: '2026-08-06', totalPrice: 1800, reservationStatus: 'Reserved' },
    { reservationId: 8, guest: { firstName: 'Michael', lastName: 'Davis' }, room: { roomNumber: '204' }, checkInDate: '2026-07-26', checkOutDate: '2026-07-29', totalPrice: 750, reservationStatus: 'Checked-Out' },
  ],
  payments: [
    { paymentId: 1, amount: 1350, paymentMethod: 'Credit Card', paymentDate: '2026-07-28', paymentStatus: 'Paid', reservation: { reservationId: 1 } },
    { paymentId: 2, amount: 1000, paymentMethod: 'Debit Card', paymentDate: '2026-07-29', paymentStatus: 'Paid', reservation: { reservationId: 2 } },
    { paymentId: 3, amount: 2600, paymentMethod: 'Bank Transfer', paymentDate: '2026-08-01', paymentStatus: 'Pending', reservation: { reservationId: 3 } },
    { paymentId: 4, amount: 3600, paymentMethod: 'Credit Card', paymentDate: '2026-07-25', paymentStatus: 'Paid', reservation: { reservationId: 4 } },
    { paymentId: 5, amount: 720, paymentMethod: 'Cash', paymentDate: '2026-07-30', paymentStatus: 'Paid', reservation: { reservationId: 5 } },
    { paymentId: 6, amount: 1950, paymentMethod: 'Credit Card', paymentDate: '2026-07-27', paymentStatus: 'Paid', reservation: { reservationId: 6 } },
    { paymentId: 7, amount: 1800, paymentMethod: 'Bank Transfer', paymentDate: '2026-08-02', paymentStatus: 'Pending', reservation: { reservationId: 7 } },
    { paymentId: 8, amount: 750, paymentMethod: 'Debit Card', paymentDate: '2026-07-26', paymentStatus: 'Paid', reservation: { reservationId: 8 } },
  ],
}

function computeDashboardData(r, g, res, pay) {
  const revenueByMonth = {}
  pay.forEach(p => {
    if (p.paymentDate && p.paymentStatus === 'Paid') {
      const m = p.paymentDate.substring(0, 7)
      revenueByMonth[m] = (revenueByMonth[m] || 0) + (p.amount || 0)
    }
  })
  const revenueData = Object.entries(revenueByMonth).sort().map(([m, v]) => ({
    month: new Date(m + '-01').toLocaleDateString('en', { month: 'short' }),
    revenue: Math.round(v)
  }))

  const monthlyOcc = {}
  res.forEach(r => {
    if (r.checkInDate) {
      const m = r.checkInDate.substring(0, 7)
      if (!monthlyOcc[m]) monthlyOcc[m] = { occupied: 0, available: 0 }
      if (r.reservationStatus === 'Checked-In' || r.reservationStatus === 'Reserved') monthlyOcc[m].occupied++
      else monthlyOcc[m].available++
    }
  })
  const occData = Object.entries(monthlyOcc).sort().slice(-6).map(([m, v]) => ({
    month: new Date(m + '-01').toLocaleDateString('en', { month: 'short' }),
    Occupied: v.occupied || 0,
    Available: v.available || 0,
  }))

  const roomStatusCounts = {}
  r.forEach(room => {
    const s = room.roomStatus || 'Available'
    roomStatusCounts[s] = (roomStatusCounts[s] || 0) + 1
  })
  const roomAvailData = Object.entries(roomStatusCounts).map(([name, value]) => ({ name, value }))
  const totalRooms = r.length
  const occupiedRooms = roomStatusCounts['Occupied'] || 0

  const methodCounts = {}
  pay.forEach(p => { methodCounts[p.paymentMethod] = (methodCounts[p.paymentMethod] || 0) + 1 })
  const sourceData = Object.entries(methodCounts).slice(0, 4).map(([n, v]) => ({ name: n, value: v }))

  const checkedIn = res.filter(r => r.reservationStatus === 'Checked-In').length
  const checkedOut = res.filter(r => r.reservationStatus === 'Checked-Out').length
  const newRes = res.filter(r => r.reservationStatus === 'Reserved').length
  const totalRevenue = pay.filter(p => p.paymentStatus === 'Paid').reduce((s, p) => s + (p.amount || 0), 0)

  return {
    rooms: r, guests: g, reservations: res, payments: pay,
    totalRooms, occupiedRooms, totalGuests: g.length,
    checkedIn, checkedOut, newRes, totalRevenue,
    revenueData, occData, roomAvailData, sourceData,
    occupancyRate: totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
    prevRevenue: totalRevenue * 0.82,
    revenueGrowth: 18.25,
  }
}

export default function Dashboard() {
  const [data, setData] = useState(() => computeDashboardData(FICTIOUS.rooms, FICTIOUS.guests, FICTIOUS.reservations, FICTIOUS.payments))
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/rooms').catch(() => ({ data: [] })),
      api.get('/guests').catch(() => ({ data: [] })),
      api.get('/reservations').catch(() => ({ data: [] })),
      api.get('/payments').catch(() => ({ data: [] })),
    ]).then(([rooms, guests, reservations, payments]) => {
      const r = rooms.data, g = guests.data, res = reservations.data, pay = payments.data
      if (r.length || res.length || g.length) {
        setData(computeDashboardData(r.length ? r : FICTIOUS.rooms, g.length ? g : FICTIOUS.guests, res.length ? res : FICTIOUS.reservations, pay.length ? pay : FICTIOUS.payments))
      }
    })
  }, [])

  const formatCurrency = (v) => `$${(v || 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const firstName = user?.username || 'Admin'

  return (
    <div className="dashboard">
      <div className="dash-main">
        <div className="greeting">
          <div>
            <h2>Hi, {firstName}</h2>
            <p>{today}</p>
          </div>
          <div className="greeting-actions">
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => navigate('/booking')}>
              <CalendarCheck size={16} /> New Booking
            </button>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => navigate('/reports')}>
              <TrendingUp size={16} /> Generate Report
            </button>
          </div>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card kpi-hero">
            <div className="kpi-hero-top">
              <span className="kpi-hero-label">Total Revenue</span>
              <span className="kpi-growth">
                <ArrowUpRight size={14} /> {data.revenueGrowth}%
              </span>
            </div>
            <div className="kpi-hero-value">{formatCurrency(data.totalRevenue)}</div>
            <div className="kpi-hero-sub">vs {formatCurrency(data.prevRevenue)} last period</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: '#eff6ff', color: '#1e65ff' }}>
              <CalendarCheck size={22} />
            </div>
            <div className="kpi-body">
              <span className="kpi-value">{data.newRes}</span>
              <span className="kpi-label">New Reservations</span>
            </div>
            <span className="kpi-trend" style={{ background: '#ecfdf5', color: '#059669' }}>+12%</span>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
              <UserCheck size={22} />
            </div>
            <div className="kpi-body">
              <span className="kpi-value">{data.checkedIn}</span>
              <span className="kpi-label">Checked In</span>
            </div>
            <span className="kpi-trend" style={{ background: '#fffbeb', color: '#d97706' }}>+8%</span>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: '#fef2f2', color: '#dc2626' }}>
              <UserMinus size={22} />
            </div>
            <div className="kpi-body">
              <span className="kpi-value">{data.checkedOut}</span>
              <span className="kpi-label">Checked Out</span>
            </div>
            <span className="kpi-trend" style={{ background: '#fef2f2', color: '#dc2626' }}>-3%</span>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <Users size={22} />
            </div>
            <div className="kpi-body">
              <span className="kpi-value">{data.totalGuests}</span>
              <span className="kpi-label">Total Guests</span>
            </div>
            <span className="kpi-trend" style={{ background: '#ecfdf5', color: '#059669' }}>+5%</span>
          </div>
        </div>

        <div className="charts-row">
          <div className="card chart-card chart-wide">
            <div className="chart-header">
              <h3>Revenue Overview</h3>
              <select className="chart-filter" defaultValue="6">
                <option value="3">Last 3 months</option>
                <option value="6">Last 6 months</option>
                <option value="12">Last year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e65ff" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1e65ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(v) => [formatCurrency(v), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1e65ff" strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: '#1e65ff', strokeWidth: 0, r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card chart-card">
            <div className="chart-header">
              <h3>Room Availability</h3>
            </div>
            <div className="room-avail">
              <div className="room-avail-meter">
                <div className="room-avail-bar">
                  {data.roomAvailData.map((item, i) => (
                    <div key={item.name} className="avail-segment" style={{
                      width: `${(item.value / data.totalRooms) * 100}%`,
                      background: STATUS_COLORS[item.name] || '#94a3b8'
                    }} />
                  ))}
                </div>
                <div className="avail-stats">
                  {data.roomAvailData.map((item, i) => (
                    <div key={item.name} className="avail-stat">
                      <span className="avail-dot" style={{ background: STATUS_COLORS[item.name] || '#94a3b8' }} />
                      <span className="avail-label">{item.name}</span>
                      <span className="avail-count">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="charts-row">
          <div className="card chart-card chart-wide">
            <div className="chart-header">
              <h3>Occupancy Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.occData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="Occupied" fill="#1e65ff" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Available" fill="#a3e635" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card chart-card">
            <div className="chart-header">
              <h3>Booking Sources</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.sourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4} dataKey="value">
                  {data.sourceData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="source-legend">
              {data.sourceData.map((item, i) => (
                <div key={item.name} className="source-item">
                  <span className="source-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="source-name">{item.name}</span>
                  <span className="source-pct">{Math.round((item.value / data.sourceData.reduce((s, d) => s + d.value, 0)) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="charts-row">
          <div className="card chart-card chart-wide">
            <div className="chart-header">
              <h3>Overall Rating</h3>
              <div className="rating-big">
                <span className="rating-score">4.7</span>
                <span className="rating-total">/ 5.0</span>
              </div>
            </div>
            <div className="rating-bars">
              {[
                { label: 'Cleanliness', score: 94 },
                { label: 'Comfort', score: 88 },
                { label: 'Service', score: 92 },
                { label: 'Facilities', score: 85 },
                { label: 'Location', score: 90 },
              ].map((item) => (
                <div key={item.label} className="rating-row">
                  <span className="rating-row-label">{item.label}</span>
                  <div className="rating-bar-track">
                    <div className="rating-bar-fill" style={{ width: `${item.score}%`, background: item.score >= 90 ? '#a3e635' : item.score >= 80 ? '#1e65ff' : '#f59e0b' }} />
                  </div>
                  <span className="rating-row-score">{item.score}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card chart-card">
            <div className="chart-header">
              <h3>Quick Stats</h3>
            </div>
            <div className="quick-stats">
              <div className="qs-item">
                <div className="qs-icon" style={{ background: '#eff6ff', color: '#1e65ff' }}><DollarSign size={20} /></div>
                <div className="qs-info">
                  <span className="qs-value">{formatCurrency(data.totalRevenue)}</span>
                  <span className="qs-label">Total Revenue</span>
                </div>
              </div>
              <div className="qs-item">
                <div className="qs-icon" style={{ background: '#ecfdf5', color: '#059669' }}><TrendingUp size={20} /></div>
                <div className="qs-info">
                  <span className="qs-value">{data.occupancyRate}%</span>
                  <span className="qs-label">Occupancy Rate</span>
                </div>
              </div>
              <div className="qs-item">
                <div className="qs-icon" style={{ background: '#fffbeb', color: '#d97706' }}><Users size={20} /></div>
                <div className="qs-info">
                  <span className="qs-value">{data.checkedIn}</span>
                  <span className="qs-label">Current Guests</span>
                </div>
              </div>
              <div className="qs-item">
                <div className="qs-icon" style={{ background: '#fef2f2', color: '#dc2626' }}><Clock size={20} /></div>
                <div className="qs-info">
                  <span className="qs-value">{data.newRes}</span>
                  <span className="qs-label">Pending Reservations</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          <div className="booking-list-header">
            <h3>Booking List</h3>
            <div className="booking-actions">
              <div className="booking-search">
                <input type="text" placeholder="Search bookings..." />
              </div>
              <select className="booking-filter">
                <option>All Status</option>
                <option>Checked-In</option>
                <option>Reserved</option>
                <option>Checked-Out</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
          <table className="booking-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Duration</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.reservations.length === 0 ? (
                <tr><td colSpan={6} className="empty-state">No bookings found</td></tr>
              ) : data.reservations.slice(0, 8).map((r) => (
                <tr key={r.reservationId}>
                  <td>
                    <div className="guest-cell">
                      <div className="guest-avatar-sm">{r.guest?.firstName?.[0]}{r.guest?.lastName?.[0]}</div>
                      <span>{r.guest?.firstName} {r.guest?.lastName}</span>
                    </div>
                  </td>
                  <td><span className="room-badge">Room {r.room?.roomNumber}</span></td>
                  <td>{(() => { const n = Math.max(1, (new Date(r.checkOutDate) - new Date(r.checkInDate)) / 86400000); return `${n} night${n > 1 ? 's' : ''}` })()}</td>
                  <td>{r.checkInDate}</td>
                  <td>{r.checkOutDate}</td>
                  <td>
                    <span className={`badge badge-${r.reservationStatus === 'Checked-In' ? 'yellow' : r.reservationStatus === 'Reserved' ? 'blue' : r.reservationStatus === 'Cancelled' ? 'red' : 'green'}`}>
                      {r.reservationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="dash-right">
        <div className="card">
          <div className="chart-header">
            <h3>Tasks</h3>
            <button className="text-btn">View All</button>
          </div>
          <div className="task-list">
            {[
              { label: 'Review pending bookings', subtitle: 'Front Desk', date: 'Today', done: false },
              { label: 'Room 204 maintenance check', subtitle: 'Housekeeping', date: 'Today', done: true },
              { label: 'Update room inventory', subtitle: 'Inventory', date: 'Tomorrow', done: false },
              { label: 'Prepare monthly report', subtitle: 'Finance', date: 'Jul 30', done: false },
              { label: 'Staff schedule review', subtitle: 'HR', date: 'Jul 28', done: true },
            ].map((task, i) => (
              <label key={i} className={`task-item${task.done ? ' done' : ''}`}>
                <input type="checkbox" defaultChecked={task.done} className="task-check" />
                <span className="task-checkmark">
                  {task.done && <CheckCircle2 size={18} />}
                </span>
                <div className="task-info">
                  <span className="task-label">{task.label}</span>
                  <span className="task-sub">{task.subtitle} · {task.date}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <div className="chart-header">
            <h3>Recent Activity</h3>
            <button className="text-btn">View All</button>
          </div>
          <div className="activity-feed">
            {[
              { user: 'FD', name: 'Front Desk', action: 'Checked in guest #1042', time: '2 min ago', color: '#1e65ff' },
              { user: 'HK', name: 'Housekeeping', action: 'Room 305 cleaning completed', time: '15 min ago', color: '#a3e635' },
              { user: 'MG', name: 'Manager', action: 'Approved discount request', time: '42 min ago', color: '#f59e0b' },
              { user: 'SY', name: 'System', action: 'Database backup completed', time: '1 hr ago', color: '#94a3b8' },
              { user: 'FD', name: 'Front Desk', action: 'New reservation #1083', time: '2 hr ago', color: '#1e65ff' },
              { user: 'HK', name: 'Housekeeping', action: 'Room 201 flagged for deep clean', time: '3 hr ago', color: '#a3e635' },
              { user: 'MG', name: 'Manager', action: 'Weekly report generated', time: '4 hr ago', color: '#f59e0b' },
            ].map((act, i) => (
              <div key={i} className="activity-item">
                <div className="activity-avatar" style={{ background: act.color }}>{act.user}</div>
                <div className="activity-body">
                  <p>{act.action}</p>
                  <span className="activity-time">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}
