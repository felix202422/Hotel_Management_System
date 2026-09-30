import { useState } from 'react'
import { Megaphone, TrendingUp, Users, MousePointer, Plus } from 'lucide-react'
import Modal from '../components/Modal'

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([
    { name: 'Summer Getaway Sale', status: 'Active', reach: '12.4K', clicks: '1.8K', conv: '4.2%', spend: '$2,400', roi: '+320%' },
    { name: 'Weekend Special Offer', status: 'Active', reach: '8.1K', clicks: '940', conv: '3.8%', spend: '$1,200', roi: '+280%' },
    { name: 'Corporate Travel Package', status: 'Draft', reach: '—', clicks: '—', conv: '—', spend: '—', roi: '—' },
    { name: 'Holiday Booking Early Bird', status: 'Scheduled', reach: '—', clicks: '—', conv: '—', spend: '—', roi: '—' },
    { name: 'Loyalty Rewards Program', status: 'Active', reach: '5.3K', clicks: '620', conv: '5.1%', spend: '$800', roi: '+450%' },
  ])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', budget: '', target: '' })

  const addCampaign = () => {
    if (!form.name.trim()) return
    setCampaigns([...campaigns, { name: form.name, status: 'Draft', reach: '—', clicks: '—', conv: '—', spend: form.budget ? `$${form.budget}` : '—', roi: '—' }])
    setModalOpen(false)
    setForm({ name: '', budget: '', target: '' })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 className="page-title">Campaigns</h1>
        <button className="btn-primary" onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> New Campaign
        </button>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create New Campaign">
        <div className="form-group">
          <label>Campaign Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Fall Special" />
        </div>
        <div className="form-group">
          <label>Budget ($)</label>
          <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="e.g. 5000" />
        </div>
        <div className="form-group">
          <label>Target Audience</label>
          <input value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} placeholder="e.g. Business travelers" />
        </div>
        <button className="btn-primary" onClick={addCampaign} style={{ width: '100%' }}>Create Campaign</button>
      </Modal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Active Campaigns', value: campaigns.filter(c => c.status === 'Active').length, icon: Megaphone, color: 'var(--primary)' },
          { label: 'Total Reach', value: '25.8K', icon: Users, color: '#059669' },
          { label: 'Avg. CTR', value: '3.4%', icon: MousePointer, color: '#d97706' },
          { label: 'Total ROI', value: '+316%', icon: TrendingUp, color: '#8b5cf6' },
        ].map((s) => (
          <div className="kpi-card" key={s.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <div className="kpi-icon" style={{ background: `${s.color}15`, color: s.color }}><s.icon size={20} /></div>
            <div><div className="kpi-value">{s.value}</div><div className="kpi-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="card">
        <table className="booking-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Status</th>
              <th>Reach</th>
              <th>Clicks</th>
              <th>Conv. Rate</th>
              <th>Spend</th>
              <th>ROI</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td><span className={`badge badge-${c.status === 'Active' ? 'green' : c.status === 'Draft' ? 'gray' : 'blue'}`}>{c.status}</span></td>
                <td>{c.reach}</td>
                <td>{c.clicks}</td>
                <td>{c.conv}</td>
                <td>{c.spend}</td>
                <td style={{ color: c.roi.startsWith('+') ? '#059669' : 'inherit', fontWeight: 700 }}>{c.roi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
