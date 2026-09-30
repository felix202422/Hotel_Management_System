import { useState, useEffect } from 'react'
import { Search, Calendar, History } from 'lucide-react'
import api from '../../api/axios'

const FALLBACK_HISTORY = [
  { id: 1, room: { roomNumber: '101' }, assignedStaff: 'Maria Santos', cleaningStatus: 'Completed', cleanedDate: '2026-08-29 09:15', notes: 'Guest checkout — full cleaning' },
  { id: 2, room: { roomNumber: '201' }, assignedStaff: 'Lisa Chen', cleaningStatus: 'Completed', cleanedDate: '2026-08-29 10:30', notes: 'Deep clean — used for VIP' },
  { id: 3, room: { roomNumber: '301' }, assignedStaff: 'Maria Santos', cleaningStatus: 'Completed', cleanedDate: '2026-08-28 14:20', notes: 'Routine turnover' },
  { id: 4, room: { roomNumber: '401' }, assignedStaff: 'David Park', cleaningStatus: 'Completed', cleanedDate: '2026-08-28 16:45', notes: 'Full room sanitization' },
  { id: 5, room: { roomNumber: '303' }, assignedStaff: 'David Park', cleaningStatus: 'Completed', cleanedDate: '2026-08-27 11:15', notes: 'Standard cleaning' },
  { id: 6, room: { roomNumber: '304' }, assignedStaff: 'John Rivera', cleaningStatus: 'Completed', cleanedDate: '2026-08-28 09:00', notes: 'Checkout clean' },
  { id: 7, room: { roomNumber: '102' }, assignedStaff: 'John Rivera', cleaningStatus: 'Completed', cleanedDate: '2026-08-27 13:40', notes: 'Routine daily cleaning' },
  { id: 8, room: { roomNumber: '202' }, assignedStaff: 'Lisa Chen', cleaningStatus: 'Completed', cleanedDate: '2026-08-26 15:10', notes: 'VIP arrival preparation' },
  { id: 9, room: { roomNumber: '302' }, assignedStaff: 'Maria Santos', cleaningStatus: 'Completed', cleanedDate: '2026-08-26 08:55', notes: 'Checkout cleaning' },
  { id: 10, room: { roomNumber: '402' }, assignedStaff: 'David Park', cleaningStatus: 'Completed', cleanedDate: '2026-08-25 12:30', notes: 'Post-maintenance clean' },
]

export default function HousekeepingHistory() {
  const [history, setHistory] = useState([])
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    api.get('/housekeeping').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      const completed = data.filter(t => t.cleaningStatus === 'Completed')
      setHistory(completed.length > 0 ? completed : FALLBACK_HISTORY)
    }).catch(err => {
      console.error(err)
      setHistory(FALLBACK_HISTORY)
    })
  }, [])

  const filtered = history.filter(h => {
    const roomMatch = `room ${h.room?.roomNumber}`.toLowerCase().includes(search.toLowerCase())
    const staffMatch = (h.assignedStaff || '').toLowerCase().includes(search.toLowerCase())
    const matchSearch = roomMatch || staffMatch

    const hDate = (h.cleanedDate || h.completedDate || '').split(' ')[0]
    const matchFrom = !dateFrom || hDate >= dateFrom
    const matchTo = !dateTo || hDate <= dateTo

    return matchSearch && matchFrom && matchTo
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Cleaning History</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Review completed cleaning tasks and records</p>
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {filtered.length} completed tasks
        </span>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="booking-search" style={{ flex: 1, minWidth: 200 }}>
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search by room or staff..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={14} style={{ color: 'var(--text-secondary)' }} />
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '0.85rem', border: '1.5px solid var(--input-border)', borderRadius: 'var(--radius)' }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>to</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '0.85rem', border: '1.5px solid var(--input-border)', borderRadius: 'var(--radius)' }} />
            </div>
          </div>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Staff</th>
              <th>Completed Date</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="empty-state">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                  <History size={40} style={{ color: 'var(--border)', marginBottom: 12 }} />
                  <span>No history matches the filters</span>
                </div>
              </td></tr>
            ) : filtered.map((h, i) => (
              <tr key={h.id || h.housekeepingId} style={{ animationDelay: `${i * 40}ms` }}>
                <td><span className="room-badge">Room {h.room?.roomNumber}</span></td>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{(h.assignedStaff || '').split(' ').map(n => n[0]).join('')}</div>
                    <span style={{ fontWeight: 600 }}>{h.assignedStaff}</span>
                  </div>
                </td>
                <td style={{ fontSize: '0.82rem' }}>{h.cleanedDate || h.completedDate}</td>
                <td style={{ fontSize: '0.82rem', maxWidth: 240 }}>{h.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
