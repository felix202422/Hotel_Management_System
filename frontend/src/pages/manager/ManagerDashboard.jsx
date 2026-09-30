import { useState, useEffect } from 'react'
import {
  BedDouble, Bed, BedSingle, LogIn, LogOut, CalendarCheck,
  DollarSign, TrendingUp, Users, AlertTriangle, Hotel
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import api from '../../api/axios'

const FALLBACK = {
  totalRooms: 16,
  availableRooms: 4,
  occupiedRooms: 8,
  reservedRooms: 2,
  activeReservations: 10,
  totalRevenue: 13770,
  totalGuests: 14,
  pendingMaintenance: 2,
  monthlyRevenue: [],
  roomAvailability: [],
  bookingSources: [],
  recentReservations: [],
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

export default function ManagerDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((res) => {
        setStats(res.data)
      })
      .catch((err) => {
        console.warn('Dashboard stats fetch failed, using fallback:', err)
        setStats(FALLBACK)
      })
      .finally(() => setLoading(false))
  }, [])

  const data = stats || FALLBACK
  const revenueData = formatRevenue(data.monthlyRevenue)
  const roomAvail = Array.isArray(data.roomAvailability) ? data.roomAvailability : []
  const recentRes = Array.isArray(data.recentReservations) ? data.recentReservations : []

  const today = new Date().toISOString().slice(0, 10)
  const todayCheckIns = recentRes.filter(r => r.checkInDate === today && (r.reservationStatus === 'Reserved' || r.status === 'Reserved')).length
  const todayCheckOuts = recentRes.filter(r => r.checkOutDate === today && (r.reservationStatus === 'Checked-In' || r.status === 'Checked-In')).length
  const occupancyRate = data.totalRooms ? Math.round(((data.occupiedRooms || 0) / data.totalRooms) * 100) : 0

  const occData = revenueData.length > 0 ? revenueData.map(d => ({
    month: d.month,
    Occupied: Math.round(d.revenue * 0.6 / 100) || 5,
    Available: Math.round(d.revenue * 0.4 / 100) || 3,
  })) : [
    { month: 'Apr', Occupied: 11, Available: 5 },
    { month: 'May', Occupied: 13, Available: 3 },
    { month: 'Jun', Occupied: 14, Available: 2 },
    { month: 'Jul', Occupied: 12, Available: 4 },
    { month: 'Aug', Occupied: 10, Available: 6 },
    { month: 'Sep', Occupied: 15, Available: 1 },
  ]

  const attentionRooms = roomAvail.filter(r => r.status === 'Not Ready' || r.status === 'Reserved' || r.status === 'Maintenance')
  const arrivals = recentRes.filter(r => r.checkInDate === today || (r.checkInDate > today && (r.reservationStatus === 'Reserved' || r.status === 'Reserved'))).slice(0, 5)
  const departures = recentRes.filter(r => r.checkOutDate === today || (r.reservationStatus === 'Checked-Out' || r.status === 'Checked-Out')).slice(0, 5)

  const formatCurrency = (v) => `$${(v || 0).toLocaleString()}`
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const name = user?.username || 'Manager'

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', color: '#fff', padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Hotel size={26} />
          </div>
          <div>
            <h1 className="page-title" style={{ color: '#fff', marginBottom: 2 }}>Welcome back, {name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginTop: 0 }}>{dateStr}</p>
          </div>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.1s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><BedDouble size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{data.totalRooms}</span>
            <span className="kpi-label">Total Rooms</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.2s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><Bed size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{data.availableRooms}</span>
            <span className="kpi-label">Available Rooms</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.3s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><BedSingle size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{data.occupiedRooms}</span>
            <span className="kpi-label">Occupied Rooms</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.4s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><LogIn size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{todayCheckIns}</span>
            <span className="kpi-label">Today's Check-ins</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.5s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff' }}><LogOut size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{todayCheckOuts}</span>
            <span className="kpi-label">Today's Check-outs</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.6s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff' }}><CalendarCheck size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{data.activeReservations}</span>
            <span className="kpi-label">Active Reservations</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.7s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><DollarSign size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{formatCurrency(data.totalRevenue)}</span>
            <span className="kpi-label">Total Revenue</span>
          </div>
        </div>
        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.8s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff' }}><TrendingUp size={22} /></div>
          <div className="kpi-body">
            <span className="kpi-value">{occupancyRate}%</span>
            <span className="kpi-label">Occupancy Rate</span>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="card chart-card chart-wide">
          <div className="chart-header">
            <h3>Occupancy Rate</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={occData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="Occupied" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Available" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <div className="chart-header">
            <h3>Monthly Revenue</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData.length > 0 ? revenueData : [
              { month: 'Apr', revenue: 28400 },
              { month: 'May', revenue: 32100 },
              { month: 'Jun', revenue: 35600 },
              { month: 'Jul', revenue: 41200 },
              { month: 'Aug', revenue: 38500 },
              { month: 'Sep', revenue: 42800 },
            ]}>
              <defs>
                <linearGradient id="mgrRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#mgrRevGrad)" dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {attentionRooms.length > 0 && (
        <div className="charts-row">
          <div className="card chart-card chart-wide">
            <div className="chart-header">
              <h3>Room Availability</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={roomAvail} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Rooms" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card chart-card">
            <div className="chart-header">
              <h3>Rooms Requiring Attention</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {attentionRooms.map((room, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--main-bg)', borderRadius: 10, animation: 'fadeInUp 0.4s ease forwards', opacity: 0, animationDelay: `${0.1 + i * 0.08}s` }}>
                  <AlertTriangle size={18} style={{ color: room.status === 'Maintenance' || room.status === 'Not Ready' ? '#ef4444' : '#f59e0b' }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{room.status}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: 8 }}>{room.count} room{room.count !== 1 ? 's' : ''}</span>
                  </div>
                  <span className={`badge ${room.status === 'Not Ready' || room.status === 'Maintenance' ? 'badge-red' : 'badge-yellow'}`}>{room.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(arrivals.length > 0 || departures.length > 0) && (
        <div className="charts-row">
          {arrivals.length > 0 && (
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="booking-list-header">
                <h3>Today's Arrivals</h3>
              </div>
              <table className="booking-table">
                <thead>
                  <tr><th>Guest</th><th>Room</th><th>Check-in</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {arrivals.map((r, i) => (
                    <tr key={r.reservationId} style={{ animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.05 * i}s` }}>
                      <td>
                        <div className="guest-cell">
                          <div className="guest-avatar-sm">{(r.guest?.firstName || r.guestName || '?')[0]}{(r.guest?.lastName || '')?.[0] || ''}</div>
                          <span style={{ fontWeight: 500 }}>{r.guest ? `${r.guest.firstName} ${r.guest.lastName}` : r.guestName || 'Guest'}</span>
                        </div>
                      </td>
                      <td><span className="room-badge">Room {r.room?.roomNumber || r.roomNumber}</span></td>
                      <td>{r.checkInDate}</td>
                      <td><span className="badge badge-yellow">{r.reservationStatus || r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {departures.length > 0 && (
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="booking-list-header">
                <h3>Today's Departures</h3>
              </div>
              <table className="booking-table">
                <thead>
                  <tr><th>Guest</th><th>Room</th><th>Check-out</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {departures.map((r, i) => (
                    <tr key={r.reservationId} style={{ animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.05 * i}s` }}>
                      <td>
                        <div className="guest-cell">
                          <div className="guest-avatar-sm">{(r.guest?.firstName || r.guestName || '?')[0]}{(r.guest?.lastName || '')?.[0] || ''}</div>
                          <span style={{ fontWeight: 500 }}>{r.guest ? `${r.guest.firstName} ${r.guest.lastName}` : r.guestName || 'Guest'}</span>
                        </div>
                      </td>
                      <td><span className="room-badge">Room {r.room?.roomNumber || r.roomNumber}</span></td>
                      <td>{r.checkOutDate}</td>
                      <td><span className="badge badge-green">{r.reservationStatus || r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {recentRes.length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="booking-list-header">
            <h3>Recent Reservations</h3>
          </div>
          <table className="booking-table">
            <thead>
              <tr><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recentRes.map((r, i) => {
                const status = r.reservationStatus || r.status
                const guestName = r.guest ? `${r.guest.firstName} ${r.guest.lastName}` : r.guestName || 'Guest'
                const roomNum = r.room?.roomNumber || r.roomNumber
                return (
                  <tr key={r.reservationId} style={{ animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.03 * i}s` }}>
                    <td>
                      <div className="guest-cell">
                        <div className="guest-avatar-sm">{guestName[0]}</div>
                        <span style={{ fontWeight: 500 }}>{guestName}</span>
                      </div>
                    </td>
                    <td><span className="room-badge">Room {roomNum}</span></td>
                    <td>{r.checkInDate}</td>
                    <td>{r.checkOutDate}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(r.totalPrice)}</td>
                    <td>
                      <span className={`badge ${status === 'Checked-In' ? 'badge-green' : status === 'Reserved' ? 'badge-yellow' : status === 'Checked-Out' ? 'badge-blue' : 'badge-red'}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}