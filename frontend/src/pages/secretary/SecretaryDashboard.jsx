import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  LogIn, LogOut, BedDouble, Bed, Clock, CreditCard,
  CalendarCheck, Users, ArrowUpRight, Hotel
} from 'lucide-react'
import api from '../../api/axios'

const STATUS_COLORS = { Available: '#a3e635', Occupied: '#1e65ff', Reserved: '#fef08a', 'Not Ready': '#ff4d4d' }

function getToday() {
  return new Date().toISOString().split('T')[0]
}

export default function SecretaryDashboard() {
  const [data, setData] = useState({
    arrivals: [], departures: [], available: 0, occupied: 0, pending: 0, todayPayments: [], reservations: [], rooms: [],
  })
  const navigate = useNavigate()

  useEffect(() => {
    const today = getToday()
    Promise.all([
      api.get('/reservations').catch(err => { console.error(err); return { data: [] } }),
      api.get('/rooms').catch(err => { console.error(err); return { data: [] } }),
      api.get('/payments').catch(err => { console.error(err); return { data: [] } }),
    ]).then(([resRes, resRooms, resPay]) => {
      const reservations = Array.isArray(resRes.data) ? resRes.data : []
      const rooms = Array.isArray(resRooms.data) ? resRooms.data : []
      const payments = Array.isArray(resPay.data) ? resPay.data : []

      const arrivals = reservations.filter(r => r.checkInDate === today && r.reservationStatus === 'Reserved')
      const departures = reservations.filter(r => r.checkOutDate === today && r.reservationStatus === 'Checked-In')
      const available = rooms.filter(r => r.roomStatus === 'Available').length
      const occupied = rooms.filter(r => r.roomStatus === 'Occupied').length
      const pending = reservations.filter(r => r.reservationStatus === 'Reserved').length
      const todayPayments = payments.filter(p => p.paymentDate === today)

      setData({ arrivals, departures, available, occupied, pending, todayPayments, reservations, rooms })
    })
  }, [])

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div>
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', color: '#fff', padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hotel size={26} />
            </div>
            <div>
              <h1 className="page-title" style={{ color: '#fff', marginBottom: 2 }}>Front Desk Dashboard</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginTop: 0 }}>{today}</p>
            </div>
          </div>
          <div className="greeting-actions">
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => navigate('/secretary/new-reservation')}>
              <CalendarCheck size={16} /> New Reservation
            </button>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => navigate('/secretary/checkin')}>
              <LogIn size={16} /> Check-in
            </button>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#059669' }} onClick={() => navigate('/secretary/checkout')}>
              <LogOut size={16} /> Check-out
            </button>
          </div>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.1s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}>
            <LogIn size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-value">{data.arrivals.length}</span>
            <span className="kpi-label">Today's Arrivals</span>
          </div>
        </div>

        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.2s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff' }}>
            <LogOut size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-value">{data.departures.length}</span>
            <span className="kpi-label">Today's Departures</span>
          </div>
        </div>

        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.3s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}>
            <BedDouble size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-value">{data.available}</span>
            <span className="kpi-label">Available Rooms</span>
          </div>
        </div>

        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.4s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}>
            <Bed size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-value">{data.occupied}</span>
            <span className="kpi-label">Occupied Rooms</span>
          </div>
        </div>

        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.5s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}>
            <Clock size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-value">{data.pending}</span>
            <span className="kpi-label">Pending Reservations</span>
          </div>
        </div>

        <div className="kpi-card" style={{ animation: 'fadeInUp 0.5s ease forwards', opacity: 0, animationDelay: '0.6s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff' }}>
            <CreditCard size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-value">{data.todayPayments.length}</span>
            <span className="kpi-label">Today's Payments</span>
          </div>
        </div>
      </div>

      <div className="charts-row" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 20 }}>
        <div className="card">
          <div className="chart-header">
            <h3>Today's Arrivals</h3>
            <button className="text-btn" onClick={() => navigate('/secretary/checkin')}>View All</button>
          </div>
          <table className="booking-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.arrivals.length === 0 ? (
                <tr><td colSpan={4} className="empty-state"><LogIn size={40} style={{ color: 'var(--border)', marginBottom: 12 }} /><br />No arrivals today</td></tr>
              ) : data.arrivals.map((r, i) => (
                <tr key={r.reservationId} style={{ animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.05 * i}s` }}>
                  <td>
                    <div className="guest-cell">
                      <div className="guest-avatar-sm">{r.guest?.firstName?.[0]}{r.guest?.lastName?.[0]}</div>
                      <span style={{ fontWeight: 500 }}>{r.guest?.firstName} {r.guest?.lastName}</span>
                    </div>
                  </td>
                  <td><span className="room-badge">Room {r.room?.roomNumber}</span></td>
                  <td>{r.checkInDate}</td>
                  <td><span className="badge badge-blue">{r.reservationStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="chart-header">
            <h3>Today's Departures</h3>
            <button className="text-btn" onClick={() => navigate('/secretary/checkout')}>View All</button>
          </div>
          <table className="booking-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Checkout</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.departures.length === 0 ? (
                <tr><td colSpan={4} className="empty-state"><LogOut size={40} style={{ color: 'var(--border)', marginBottom: 12 }} /><br />No departures today</td></tr>
              ) : data.departures.map((r, i) => (
                <tr key={r.reservationId} style={{ animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.05 * i}s` }}>
                  <td>
                    <div className="guest-cell">
                      <div className="guest-avatar-sm">{r.guest?.firstName?.[0]}{r.guest?.lastName?.[0]}</div>
                      <span style={{ fontWeight: 500 }}>{r.guest?.firstName} {r.guest?.lastName}</span>
                    </div>
                  </td>
                  <td><span className="room-badge">Room {r.room?.roomNumber}</span></td>
                  <td>{r.checkOutDate}</td>
                  <td><span className="badge badge-yellow">Checked-In</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="chart-header">
          <h3>Recent Reservations</h3>
          <button className="text-btn" onClick={() => navigate('/secretary/reservations')}>View All</button>
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
            {data.reservations.slice(0, 6).map((r, i) => (
              <tr key={r.reservationId} style={{ animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.03 * i}s` }}>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{r.guest?.firstName?.[0]}{r.guest?.lastName?.[0]}</div>
                    <span style={{ fontWeight: 500 }}>{r.guest?.firstName} {r.guest?.lastName}</span>
                  </div>
                </td>
                <td><span className="room-badge">Room {r.room?.roomNumber}</span></td>
                <td>{r.checkInDate}</td>
                <td>{r.checkOutDate}</td>
                <td style={{ fontWeight: 700 }}>${r.totalPrice}</td>
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
  )
}