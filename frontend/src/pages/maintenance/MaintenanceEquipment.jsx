import { useState } from 'react'
import { Search, Wrench, CheckCircle, AlertTriangle, Clock } from 'lucide-react'

const FICTIOUS = [
  { equipmentId: 1, name: 'HVAC Compressor Unit A', category: 'HVAC', condition: 'Good', lastChecked: '2026-08-15', nextService: '2026-11-15', location: 'Main Building - Roof' },
  { equipmentId: 2, name: 'Pipe Wrench Set', category: 'Plumbing', condition: 'Good', lastChecked: '2026-08-20', nextService: '2026-10-20', location: 'Maintenance Storage' },
  { equipmentId: 3, name: 'Circuit Breaker Panel B', category: 'Electrical', condition: 'Fair', lastChecked: '2026-08-10', nextService: '2026-09-10', location: 'Main Building - Basement' },
  { equipmentId: 4, name: 'Conference Room Chairs (x20)', category: 'Furniture', condition: 'Good', lastChecked: '2026-08-01', nextService: '2027-02-01', location: 'Conference Room 1' },
  { equipmentId: 5, name: 'Fire Extinguisher Set (Floor 3)', category: 'Safety', condition: 'Good', lastChecked: '2026-08-25', nextService: '2026-09-25', location: 'Floor 3 Hallway' },
  { equipmentId: 6, name: 'HVAC Thermostat Controller', category: 'HVAC', condition: 'Poor', lastChecked: '2026-08-18', nextService: '2026-09-01', location: 'Room 202' },
  { equipmentId: 7, name: 'Water Heater Element', category: 'Plumbing', condition: 'Fair', lastChecked: '2026-08-12', nextService: '2026-09-12', location: 'Room 401' },
  { equipmentId: 8, name: 'LED Flood Light Spares', category: 'Electrical', condition: 'Good', lastChecked: '2026-08-22', nextService: '2027-02-22', location: 'Maintenance Storage' },
  { equipmentId: 9, name: 'Lobby Sofa Set', category: 'Furniture', condition: 'Fair', lastChecked: '2026-07-30', nextService: '2027-01-30', location: 'Main Lobby' },
  { equipmentId: 10, name: 'Smoke Detector (Floor 4)', category: 'Safety', condition: 'Poor', lastChecked: '2026-08-05', nextService: '2026-09-05', location: 'Floor 4 Hallway' },
  { equipmentId: 11, name: 'Ductwork Inspection Camera', category: 'HVAC', condition: 'Good', lastChecked: '2026-08-28', nextService: '2026-11-28', location: 'Maintenance Storage' },
  { equipmentId: 12, name: 'Emergency Exit Signs', category: 'Safety', condition: 'Good', lastChecked: '2026-08-24', nextService: '2026-11-24', location: 'All Floors' },
]

const CATEGORIES = ['All', 'HVAC', 'Plumbing', 'Electrical', 'Furniture', 'Safety']
const CONDITIONS = ['All', 'Good', 'Fair', 'Poor']

const conditionBadge = (c) => {
  const map = { Good: 'badge-green', Fair: 'badge-yellow', Poor: 'badge-red' }
  return map[c] || 'badge-gray'
}

const categoryIcon = (cat) => {
  const map = { HVAC: '#3b82f6', Plumbing: '#06b6d4', Electrical: '#f59e0b', Furniture: '#8b5cf6', Safety: '#ef4444' }
  return map[cat] || '#64748b'
}

export default function MaintenanceEquipment() {
  const [equipment] = useState(FICTIOUS)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterCondition, setFilterCondition] = useState('All')

  const filtered = equipment.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = filterCategory === 'All' || e.category === filterCategory
    const matchesCondition = filterCondition === 'All' || e.condition === filterCondition
    return matchesSearch && matchesCategory && matchesCondition
  })

  const goodCount = equipment.filter(e => e.condition === 'Good').length
  const fairCount = equipment.filter(e => e.condition === 'Fair').length
  const poorCount = equipment.filter(e => e.condition === 'Poor').length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Equipment Inventory</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Track and manage all maintenance equipment</p>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="kpi-card" style={{ animationDelay: '0ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><Wrench size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{equipment.length}</div>
            <div className="kpi-label">Total Equipment</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '60ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><CheckCircle size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{goodCount}</div>
            <div className="kpi-label">Good Condition</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '120ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><Clock size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{fairCount}</div>
            <div className="kpi-label">Fair Condition</div>
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: '180ms' }}>
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff' }}><AlertTriangle size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{poorCount}</div>
            <div className="kpi-label">Poor Condition</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
            <input type="text" placeholder="Search equipment..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <select className="booking-filter" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
            </select>
            <select className="booking-filter" value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)}>
              {CONDITIONS.map(c => <option key={c} value={c}>{c === 'All' ? 'All Conditions' : c}</option>)}
            </select>
          </div>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Equipment ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Condition</th>
              <th>Location</th>
              <th>Last Checked</th>
              <th>Next Service</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="empty-state">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                  <Wrench size={40} style={{ color: 'var(--border)', marginBottom: 12 }} />
                  <span>No equipment found</span>
                </div>
              </td></tr>
            ) : filtered.map((e, i) => (
              <tr key={e.equipmentId} style={{ animationDelay: `${i * 40}ms` }}>
                <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>EQ-{String(e.equipmentId).padStart(3, '0')}</td>
                <td style={{ fontWeight: 500 }}>{e.name}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: categoryIcon(e.category) }} />
                    <span>{e.category}</span>
                  </div>
                </td>
                <td><span className={`badge badge-${conditionBadge(e.condition).replace('badge-', '')}`}>{e.condition}</span></td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{e.location}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{e.lastChecked}</td>
                <td style={{ fontWeight: 500 }}>{e.nextService}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
