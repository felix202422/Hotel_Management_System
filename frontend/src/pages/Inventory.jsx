import { useState } from 'react'
import { Package, AlertTriangle, RefreshCw, TrendingDown, Plus } from 'lucide-react'
import Modal from '../components/Modal'

const CATEGORIES = ['Linen', 'Amenities', 'Maintenance', 'Cleaning']

export default function Inventory() {
  const [items, setItems] = useState([
    { id: 1, name: 'Twin Sheets (King)', cat: 'Linen', stock: 48, min: 30, unit: 'sets', status: 'OK' },
    { id: 2, name: 'Towels (Bath)', cat: 'Linen', stock: 120, min: 80, unit: 'pcs', status: 'OK' },
    { id: 3, name: 'Twin Sheets (Queen)', cat: 'Linen', stock: 22, min: 25, unit: 'sets', status: 'Low' },
    { id: 4, name: 'Mini Shampoo', cat: 'Amenities', stock: 340, min: 100, unit: 'bottles', status: 'OK' },
    { id: 5, name: 'Coffee Packets', cat: 'Amenities', stock: 15, min: 40, unit: 'boxes', status: 'Low' },
    { id: 6, name: 'Light Bulbs (LED)', cat: 'Maintenance', stock: 8, min: 20, unit: 'pcs', status: 'Low' },
    { id: 7, name: 'Bathroom Cleaner', cat: 'Cleaning', stock: 3, min: 10, unit: 'bottles', status: 'Critical' },
    { id: 8, name: 'Trash Bags (Large)', cat: 'Cleaning', stock: 200, min: 50, unit: 'rolls', status: 'OK' },
    { id: 9, name: 'Pillows (Standard)', cat: 'Linen', stock: 45, min: 20, unit: 'pcs', status: 'OK' },
    { id: 10, name: 'Dish Soap', cat: 'Cleaning', stock: 12, min: 15, unit: 'bottles', status: 'Low' },
  ])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', cat: 'Linen', stock: 10, min: 5, unit: 'pcs' })

  const addItem = () => {
    if (!form.name.trim()) return
    setItems([...items, { id: items.length + 1, name: form.name, cat: form.cat, stock: Number(form.stock), min: Number(form.min), unit: form.unit, status: Number(form.stock) >= Number(form.min) ? 'OK' : 'Low' }])
    setModalOpen(false)
    setForm({ name: '', cat: 'Linen', stock: 10, min: 5, unit: 'pcs' })
  }

  const lowStock = items.filter((i) => i.status !== 'OK').length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 className="page-title">Inventory</h1>
        <button className="btn-primary" onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> Add Item
        </button>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Inventory Item">
        <div className="form-group"><label>Item Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Hand Soap" /></div>
        <div className="form-group">
          <label>Category</label>
          <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })} className="booking-filter" style={{ width: '100%' }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group"><label>Stock</label><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
          <div className="form-group"><label>Min Required</label><input type="number" value={form.min} onChange={(e) => setForm({ ...form, min: e.target.value })} /></div>
        </div>
        <div className="form-group"><label>Unit</label><input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="e.g. bottles, pcs" /></div>
        <button className="btn-primary" onClick={addItem} style={{ width: '100%' }}>Add Item</button>
      </Modal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <div className="kpi-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <div className="kpi-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}><Package size={20} /></div>
          <div><div className="kpi-value">{items.length}</div><div className="kpi-label">Total Items</div></div>
        </div>
        <div className="kpi-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <div className="kpi-icon" style={{ background: '#fef2f2', color: '#dc2626' }}><AlertTriangle size={20} /></div>
          <div><div className="kpi-value">{lowStock}</div><div className="kpi-label">Low Stock Items</div></div>
        </div>
        <div className="kpi-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <div className="kpi-icon" style={{ background: '#ecfdf5', color: '#059669' }}><RefreshCw size={20} /></div>
          <div><div className="kpi-value">{CATEGORIES.length}</div><div className="kpi-label">Categories</div></div>
        </div>
        <div className="kpi-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <div className="kpi-icon" style={{ background: '#fffbeb', color: '#d97706' }}><TrendingDown size={20} /></div>
          <div><div className="kpi-value">{items.filter(i => i.status === 'Critical').length}</div><div className="kpi-label">Critical Items</div></div>
        </div>
      </div>

      <div className="card">
        <table className="booking-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>In Stock</th>
              <th>Min. Required</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 600 }}>{item.name}</td>
                <td><span className="room-badge">{item.cat}</span></td>
                <td style={{ fontWeight: 700 }}>{item.stock} {item.unit}</td>
                <td>{item.min} {item.unit}</td>
                <td><span className={`badge badge-${item.status === 'OK' ? 'green' : item.status === 'Low' ? 'yellow' : 'red'}`}>{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
