import { useState, useEffect } from 'react'
import { Search, FileText, Download, Plus } from 'lucide-react'
import api from '../../api/axios'

const FICTIOUS = [
  { invoiceId: 'INV-1001', guest: { firstName: 'Alice', lastName: 'Johnson' }, room: '201', amount: 1350, date: '2026-08-28', status: 'Paid' },
  { invoiceId: 'INV-1002', guest: { firstName: 'Robert', lastName: 'Chen' }, room: '102', amount: 1000, date: '2026-08-29', status: 'Paid' },
  { invoiceId: 'INV-1003', guest: { firstName: 'Maria', lastName: 'Garcia' }, room: '301', amount: 2600, date: '2026-08-29', status: 'Pending' },
  { invoiceId: 'INV-1004', guest: { firstName: 'James', lastName: 'Wilson' }, room: '402', amount: 3600, date: '2026-08-25', status: 'Paid' },
  { invoiceId: 'INV-1005', guest: { firstName: 'Sophie', lastName: 'Turner' }, room: '103', amount: 720, date: '2026-08-30', status: 'Paid' },
  { invoiceId: 'INV-1006', guest: { firstName: 'David', lastName: 'Kim' }, room: '302', amount: 1950, date: '2026-08-27', status: 'Paid' },
  { invoiceId: 'INV-1007', guest: { firstName: 'Emma', lastName: 'Brown' }, room: '404', amount: 1800, date: '2026-08-31', status: 'Pending' },
  { invoiceId: 'INV-1008', guest: { firstName: 'Michael', lastName: 'Davis' }, room: '204', amount: 750, date: '2026-08-26', status: 'Paid' },
  { invoiceId: 'INV-1009', guest: { firstName: 'Olivia', lastName: 'Martinez' }, room: '304', amount: 720, date: '2026-08-28', status: 'Paid' },
  { invoiceId: 'INV-1010', guest: { firstName: 'William', lastName: 'Taylor' }, room: '101', amount: 500, date: '2026-08-29', status: 'Pending' },
]

const STATUS_BADGE = {
  Paid: 'badge-green',
  Pending: 'badge-yellow',
  Overdue: 'badge-red',
  Cancelled: 'badge-gray',
}

export default function AccountantInvoices() {
  const [invoices, setInvoices] = useState(FICTIOUS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [newInvoice, setNewInvoice] = useState({ reservationId: '', amount: '', tax: '', invoiceDate: '', dueDate: '', status: 'Pending' })

  useEffect(() => {
    api.get('/invoices').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      if (data.length > 0) setInvoices(data)
    }).catch(err => console.error(err))
  }, [])

  const filtered = invoices.filter(inv => {
    const guestName = `${inv.guest?.firstName || ''} ${inv.guest?.lastName || ''}`.toLowerCase()
    const matchesSearch = guestName.includes(search.toLowerCase()) || (inv.invoiceId || '').toLowerCase().includes(search.toLowerCase()) || (inv.room || '').includes(search)
    const matchesStatus = filterStatus === 'All' || inv.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const fmt = (v) => `$${(v || 0).toLocaleString()}`

  const handleGenerateInvoice = () => {
    if (!newInvoice.amount) return
    const entry = {
      invoiceId: `INV-${1000 + invoices.length + 1}`,
      reservation: { reservationId: newInvoice.reservationId },
      amount: Number(newInvoice.amount),
      tax: Number(newInvoice.tax) || 0,
      totalAmount: Number(newInvoice.amount) + (Number(newInvoice.tax) || 0),
      date: newInvoice.invoiceDate || new Date().toISOString().slice(0, 10),
      dueDate: newInvoice.dueDate || '',
      status: newInvoice.status,
    }
    api.post('/invoices', entry).then(() => {
      return api.get('/invoices')
    }).then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      if (data.length > 0) setInvoices(data)
      else setInvoices(prev => [entry, ...prev])
    }).catch(err => {
      console.error(err)
      setInvoices(prev => [entry, ...prev])
    })
    setShowModal(false)
    setNewInvoice({ reservationId: '', amount: '', tax: '', invoiceDate: '', dueDate: '', status: 'Pending' })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Invoices</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Generate and manage guest invoices</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" onClick={() => {}}>
            <Download size={18} /> Export PDF
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Generate Invoice
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div className="booking-search" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
            <input type="text" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 260 }} />
          </div>
          <select className="booking-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option>All Status</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Overdue</option>
            <option>Cancelled</option>
          </select>
        </div>

        <table className="booking-table">
          <thead>
            <tr><th>Invoice #</th><th>Guest</th><th>Room</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="empty-state">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                  <FileText size={40} style={{ color: 'var(--border)', marginBottom: 12 }} />
                  <span>No invoices found</span>
                </div>
              </td></tr>
            ) : filtered.map((inv, i) => (
              <tr key={inv.invoiceId} style={{ animationDelay: `${i * 40}ms` }}>
                <td><span className="room-badge">{inv.invoiceId}</span></td>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{inv.guest?.firstName?.[0]}{inv.guest?.lastName?.[0]}</div>
                    <span style={{ fontWeight: 500 }}>{inv.guest?.firstName} {inv.guest?.lastName}</span>
                  </div>
                </td>
                <td><span className="room-badge">Room {inv.room}</span></td>
                <td style={{ fontWeight: 700 }}>{fmt(inv.amount)}</td>
                <td>{inv.date}</td>
                <td>
                  <span className={`badge ${STATUS_BADGE[inv.status] || 'badge-gray'}`}>{inv.status}</span>
                </td>
                <td>
                  <button className="btn-icon" title="Download PDF" onClick={() => {}}>
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, animation: 'fadeIn 0.2s ease' }}>
          <div className="card" style={{ width: 480, maxHeight: '90vh', overflowY: 'auto', animation: 'slideUp 0.3s ease' }}>
            <div className="booking-list-header" style={{ marginBottom: 20 }}>
              <h3>Generate Invoice</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="form-group">
              <label>Reservation ID</label>
              <input type="text" placeholder="e.g. 1" value={newInvoice.reservationId} onChange={(e) => setNewInvoice({ ...newInvoice, reservationId: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Amount ($)</label>
              <input type="number" placeholder="0.00" value={newInvoice.amount} onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Tax ($)</label>
              <input type="number" placeholder="0.00" value={newInvoice.tax} onChange={(e) => setNewInvoice({ ...newInvoice, tax: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Invoice Date</label>
              <input type="date" value={newInvoice.invoiceDate} onChange={(e) => setNewInvoice({ ...newInvoice, invoiceDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={newInvoice.dueDate} onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={newInvoice.status} onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })}>
                <option>Pending</option>
                <option>Paid</option>
                <option>Overdue</option>
                <option>Cancelled</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleGenerateInvoice}>Generate Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
