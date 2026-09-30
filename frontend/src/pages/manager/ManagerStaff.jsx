import { useState, useEffect } from 'react'
import { Search, Users } from 'lucide-react'
import api from '../../api/axios'

const DEPARTMENTS = ['All', 'Front Desk', 'Housekeeping', 'Maintenance', 'F&B', 'Security']

const STATUS_BADGE = {
  Active: 'badge-green',
  'On Leave': 'badge-yellow',
  Inactive: 'badge-red',
}

export default function ManagerStaff() {
  const [staff, setStaff] = useState([])
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('All')

  useEffect(() => {
    api.get('/staff')
      .then((res) => { setStaff(Array.isArray(res.data) ? res.data : []) })
      .catch(err => { console.error(err) })
  }, [])

  const filtered = staff.filter(s => {
    const name = s.fullName || s.name || ''
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.position || '').toLowerCase().includes(search.toLowerCase())
    const matchDept = filterDept === 'All' || s.department === filterDept
    return matchSearch && matchDept
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Staff</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Manage hotel staff and department assignments</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
            <input type="text" placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <select className="booking-filter" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="empty-state"><Users size={40} style={{ color: 'var(--border)', marginBottom: 12 }} /><br />No staff found</td></tr>
            ) : filtered.map((s, i) => {
              const name = s.fullName || s.name || ''
              const initials = name.split(' ').map(n => n[0]).join('')
              return (
                <tr key={s.id || s.staffId} style={{ animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.03 * i}s` }}>
                  <td>
                    <div className="guest-cell">
                      <div className="guest-avatar-sm">{initials}</div>
                      <span style={{ fontWeight: 500 }}>{name}</span>
                    </div>
                  </td>
                  <td>{s.email}</td>
                  <td style={{ fontWeight: 500 }}>{s.position}</td>
                  <td>{s.department}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[s.status] || 'badge-gray'}`}>{s.status}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}