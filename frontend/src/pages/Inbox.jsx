import { useState } from 'react'
import { InboxIcon, Mail, MailOpen, Send, Trash2, ArrowLeft, Reply, Trash } from 'lucide-react'

const MESSAGES = [
  { id: 1, from: 'john.doe@email.com', name: 'John Doe', subject: 'Room upgrade request - Booking #104', date: '2 hours ago', unread: true, body: 'Dear Hasmir Hotels team,\n\nI would like to request a complimentary upgrade to a suite for my upcoming stay (Booking #104, check-in August 5th). It is our wedding anniversary and we would greatly appreciate the gesture.\n\nBest regards,\nJohn Doe' },
  { id: 2, from: 'maria@travelagency.com', name: 'Maria Rodriguez', subject: 'Group booking inquiry - 15 rooms', date: '5 hours ago', unread: true, body: 'Hello,\n\nWe are organizing a corporate retreat for 30 people and would like to inquire about a group booking for 15 rooms (double occupancy) from September 12-15. Could you please provide a group rate quote?\n\nThank you,\nMaria Rodriguez\nTravelWise Agency' },
  { id: 3, from: 'feedback@tripadvisor.com', name: 'TripAdvisor', subject: 'New review posted for Hasmir Hotels', date: 'Yesterday', unread: true, body: 'A new guest review has been posted on TripAdvisor.\n\nRating: 5/5\nReviewer: Alice J.\n\n"Absolutely wonderful stay! The staff went above and beyond to make us feel welcome. Will definitely return."' },
  { id: 4, from: 'supplies@vendor.com', name: 'Vendor Supplies Co.', subject: 'Monthly inventory restock order', date: 'Yesterday', unread: false, body: 'Dear Team,\n\nThis is your monthly reminder to place the inventory restock order for August. Current low-stock items include: bathroom cleaner (3 bottles), light bulbs (8 pcs), and coffee packets (15 boxes).\n\nPlease submit the order by August 5th.\n\nBest,\nSupplies Co.' },
  { id: 5, from: 'no-reply@booking.com', name: 'Booking.com', subject: 'New reservation confirmed - #132', date: '2 days ago', unread: false, body: 'A new reservation has been confirmed via Booking.com.\n\nGuest: Sarah Mitchell\nRoom: Deluxe King (Room 203)\nCheck-in: August 10, 2026\nCheck-out: August 14, 2026\nTotal: $1,000\n\nPlease ensure the room is prepared.' },
  { id: 6, from: 'hr@hasmir.com', name: 'HR Department', subject: 'Staff schedule for August 2026', date: '3 days ago', unread: false, body: 'Dear Managers,\n\nPlease find attached the proposed staff schedule for August 2026. Key changes include:\n- Two new front desk hires starting August 7\n- Shift rotations updated for the maintenance team\n- Holiday requests approved for Aug 15-20 (Jackson, Park)\n\nPlease review and confirm by August 1st.\n\nHR Team' },
  { id: 7, from: 'finance@bank.com', name: 'First National Bank', subject: 'Monthly statement - July 2026', date: '5 days ago', unread: false, body: 'Dear Hasmir Hotels,\n\nYour monthly account statement for July 2026 is now available.\n\nAccount: ****4532\nOpening Balance: $124,500.00\nTotal Deposits: $89,200.00\nTotal Withdrawals: $52,300.00\nClosing Balance: $161,400.00\n\nThank you for banking with us.' },
  { id: 8, from: 'noreply@expedia.com', name: 'Expedia', subject: 'Commission invoice - July 2026', date: '1 week ago', unread: false, body: 'Dear Partner,\n\nPlease find attached the commission invoice for bookings made through Expedia in July 2026.\n\nTotal Bookings: 24\nCommission Amount: $3,840.00\nPayment Due: August 15, 2026\n\nThank you for your partnership.' },
]

export default function Inbox() {
  const [selected, setSelected] = useState(null)
  const [msgs, setMsgs] = useState(MESSAGES)

  const openMsg = (id) => {
    setSelected(id)
    setMsgs(msgs.map(m => m.id === id ? { ...m, unread: false } : m))
  }

  const deleteMsg = (id) => {
    setMsgs(msgs.filter(m => m.id !== id))
    if (selected === id) setSelected(null)
  }

  const msg = msgs.find(m => m.id === selected)

  const stats = [
    { label: 'Inbox', count: msgs.length, icon: Mail },
    { label: 'Unread', count: msgs.filter(m => m.unread).length, icon: MailOpen },
    { label: 'Sent', count: 12, icon: Send },
    { label: 'Trash', count: 0, icon: Trash2 },
  ]

  if (msg) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button className="text-btn" onClick={() => setSelected(null)}><ArrowLeft size={20} /></button>
          <h1 className="page-title" style={{ marginBottom: 0 }}>Inbox</h1>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 4 }}>{msg.subject}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>From: {msg.from} ({msg.name})</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{msg.date}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="text-btn" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Reply size={14} /> Reply</button>
              <button className="text-btn" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#dc2626' }} onClick={() => deleteMsg(msg.id)}><Trash size={14} /> Delete</button>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            {msg.body.split('\n').map((line, i) => (
              <p key={i} style={{ marginBottom: 8, lineHeight: 1.7, color: '#475569', fontSize: '0.9rem' }}>{line}</p>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 20, paddingTop: 16 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <input type="text" placeholder="Type your reply..." style={{ flex: 1, padding: '10px 16px', border: '1px solid var(--border)', borderRadius: 12, fontSize: '0.85rem' }} />
              <button className="btn-primary">Send</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: 24 }}>Inbox</h1>
      <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
        {stats.map((item) => (
          <div className="kpi-card" key={item.label} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <div className="kpi-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}><item.icon size={20} /></div>
            <div>
              <div className="kpi-value">{item.count}</div>
              <div className="kpi-label">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <table className="booking-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}><input type="checkbox" /></th>
              <th>From</th>
              <th>Subject</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {msgs.map((msg) => (
              <tr key={msg.id} onClick={() => openMsg(msg.id)} style={{ cursor: 'pointer', fontWeight: msg.unread ? 700 : 400 }}>
                <td><input type="checkbox" onClick={(e) => e.stopPropagation()} /></td>
                <td>
                  <div className="guest-cell">
                    <div className="guest-avatar-sm">{msg.name.split(' ').map((n) => n[0]).join('')}</div>
                    <span>{msg.name}</span>
                  </div>
                </td>
                <td>
                  {msg.subject}
                  {msg.unread && <span className="badge badge-blue" style={{ marginLeft: 8, fontSize: '0.6rem', padding: '2px 6px' }}>New</span>}
                </td>
                <td style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{msg.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
