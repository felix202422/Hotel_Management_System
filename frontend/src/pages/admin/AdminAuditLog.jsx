import { useState, useEffect } from 'react'
import { Search, Shield, Download, Package } from 'lucide-react'
import api from '../../api/axios'

const ACTION_TYPES = [
  'All', 'Login', 'Logout', 'Reservation Created', 'Reservation Approved',
  'Payment Recorded', 'Room Status Changed', 'User Created', 'Check-in', 'Check-out'
]

const actionBadge = (action) => {
  const map = {
    Login: 'green', Logout: 'gray',
    'Reservation Created': 'blue', 'Reservation Approved': 'green',
    'Payment Recorded': 'green', 'Room Status Changed': 'yellow',
    'User Created': 'purple', 'Check-in': 'blue', 'Check-out': 'yellow'
  }
  return map[action] || 'gray'
}

export default function AdminAuditLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterAction, setFilterAction] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    setLoading(true)
    api.get('/audit')
      .then(res => { setLogs(Array.isArray(res.data) ? res.data : []) })
      .catch(err => { console.error(err); setLogs([]) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = logs.filter(l => {
    const username = l.username || l.user || ''
    const desc = l.description || ''
    const ip = l.ipAddress || l.ip || ''
    const matchesSearch = username.toLowerCase().includes(search.toLowerCase()) ||
      desc.toLowerCase().includes(search.toLowerCase()) ||
      ip.includes(search)
    const matchesAction = filterAction === 'All' || l.action === filterAction
    const ts = l.timestamp || ''
    const matchesDateFrom = !dateFrom || ts >= dateFrom
    const matchesDateTo = !dateTo || ts <= dateTo + ' 23:59:59'
    return matchesSearch && matchesAction && matchesDateFrom && matchesDateTo
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Audit Log</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Monitor system activity and user actions for compliance</p>
        </div>
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="kpi-card" style={{ animationDelay: '0.1s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><Shield size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{logs.length}</div>
            <div className="kpi-label">Total Events</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.15s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><Shield size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{logs.filter(l => l.action === 'Login').length}</div>
            <div className="kpi-label">Logins</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.2s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff' }}><Shield size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{logs.filter(l => l.action?.includes('Reservation')).length}</div>
            <div className="kpi-label">Reservations</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '0.25s' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><Shield size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{logs.filter(l => l.action?.includes('Payment')).length}</div>
            <div className="kpi-label">Payments</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
            <input type="text" placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <select className="booking-filter" value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
              {ACTION_TYPES.map(a => <option key={a} value={a}>{a === 'All' ? 'All Actions' : a}</option>)}
            </select>
            <input
              type="date"
              className="booking-filter"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>to</span>
            <input
              type="date"
              className="booking-filter"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Description</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="empty-state">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5}><div className="empty-state"><Package size={48} style={{opacity:0.3, marginBottom:12}} /><p>No audit log entries found</p></div></td></tr>
            ) : filtered.map((l, i) => (
              <tr key={l.auditId || l.id} style={{ animationDelay: i * 0.03 + 's' }}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{l.timestamp}</td>
                <td style={{ fontWeight: 500 }}>{l.username || l.user}</td>
                <td><span className={`badge badge-${actionBadge(l.action)}`}>{l.action}</span></td>
                <td style={{ maxWidth: 300 }}>{l.description}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{l.ipAddress || l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
