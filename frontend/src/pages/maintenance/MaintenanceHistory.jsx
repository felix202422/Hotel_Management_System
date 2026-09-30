import { useState, useEffect } from 'react'
import { Search, History, DollarSign, Clock, Calendar } from 'lucide-react'
import api from '../../api/axios'

const FICTIOUS = [
  { maintenanceId: 1, room: { roomNumber: '101' }, description: 'Door lock mechanism repair', completedDate: '2026-08-26', duration: '2.5 hours', cost: 120 },
  { maintenanceId: 10, room: { roomNumber: '204' }, description: 'Bathroom grout resealing', completedDate: '2026-08-27', duration: '3 hours', cost: 85 },
  { maintenanceId: 3, room: { roomNumber: '301' }, description: 'Light bulb replacement in hallway', completedDate: '2026-08-27', duration: '0.5 hours', cost: 25 },
  { maintenanceId: 7, room: { roomNumber: '303' }, description: 'Television remote replacement', completedDate: '2026-08-25', duration: '0.25 hours', cost: 35 },
  { maintenanceId: 5, room: { roomNumber: '103' }, description: 'AC filter cleaning and replacement', completedDate: '2026-08-24', duration: '1.5 hours', cost: 60 },
]

export default function MaintenanceHistory() {
  const [history, setHistory] = useState(FICTIOUS)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    api.get('/maintenance').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      const completed = data.filter(r => r.status === 'COMPLETED')
      if (completed.length > 0) setHistory(completed.map(r => ({
        ...r,
        room: r.room || { roomNumber: r.roomNumber },
        completedDate: r.completedDate || r.date || '',
        duration: r.duration || 'N/A',
        cost: r.cost || 0,
      })))
    }).catch(err => console.error(err))
  })

  const filtered = history.filter(h => {
    const roomNum = h.room?.roomNumber || ''
    const matchesSearch = h.description.toLowerCase().includes(search.toLowerCase()) ||
      `room ${roomNum}`.toLowerCase().includes(search.toLowerCase())
    let matchesDate = true
    if (dateFrom) matchesDate = matchesDate && h.completedDate >= dateFrom
    if (dateTo) matchesDate = matchesDate && h.completedDate <= dateTo
    return matchesSearch && matchesDate
  })

  const totalCost = filtered.reduce((s, h) => s + (h.cost || 0), 0)
  const totalTasks = filtered.length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Maintenance History</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Review completed maintenance work and costs</p>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <div className="kpi-card" style={{ animationDelay: '0ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><History size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{totalTasks}</div>
            <div className="kpi-label">Completed Tasks</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '60ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><DollarSign size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">${totalCost.toLocaleString()}</div>
            <div className="kpi-label">Total Cost</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '120ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff' }}><Clock size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{totalTasks > 0 ? (totalCost / totalTasks).toFixed(0) : 0}</div>
            <div className="kpi-label">Avg Cost per Task ($)</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
            <input type="text" placeholder="Search history..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={14} style={{ color: 'var(--text-secondary)' }} />
              <input type="date" className="booking-filter" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>to</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="date" className="booking-filter" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Description</th>
              <th>Completed Date</th>
              <th>Duration</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="empty-state">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                  <History size={40} style={{ color: 'var(--border)', marginBottom: 12 }} />
                  <span>No history records found</span>
                </div>
              </td></tr>
            ) : filtered.map((h, i) => (
              <tr key={h.maintenanceId} style={{ animationDelay: `${i * 40}ms` }}>
                <td><span className="room-badge">Room {h.room?.roomNumber}</span></td>
                <td style={{ maxWidth: 300 }}>{h.description}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{h.completedDate}</td>
                <td style={{ fontWeight: 500 }}>{h.duration}</td>
                <td style={{ fontWeight: 700, color: 'var(--text)' }}>${h.cost || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
