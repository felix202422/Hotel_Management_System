import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Modal from '../components/Modal'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default function CalendarPage() {
  const today = new Date()
  const [monthIdx, setMonthIdx] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [events, setEvents] = useState({
    5: [{ label: 'Corporate Event - Ballroom', type: 'event' }],
    12: [{ label: 'Team Meeting - 10AM', type: 'meeting' }],
    15: [{ label: 'Smith Wedding - Grand Hall', type: 'event' }],
    18: [{ label: 'Board Meeting - 2PM', type: 'meeting' }],
    22: [{ label: 'Summer Gala - Rooftop', type: 'event' }],
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [evForm, setEvForm] = useState({ day: today.getDate(), label: '', type: 'event' })

  const month = MONTHS[monthIdx]
  const firstDay = new Date(year, monthIdx, 1).getDay()
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate()

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const prevMonth = () => { if (monthIdx === 0) { setMonthIdx(11); setYear(y => y - 1) } else setMonthIdx(i => i - 1) }
  const nextMonth = () => { if (monthIdx === 11) { setMonthIdx(0); setYear(y => y + 1) } else setMonthIdx(i => i + 1) }

  const addEvent = () => {
    if (!evForm.label.trim()) return
    setEvents(prev => {
      const updated = { ...prev }
      if (!updated[evForm.day]) updated[evForm.day] = []
      updated[evForm.day] = [...updated[evForm.day], { label: evForm.label, type: evForm.type }]
      return updated
    })
    setModalOpen(false)
    setEvForm({ day: today.getDate(), label: '', type: 'event' })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 className="page-title">Calendar</h1>
        <button className="btn-primary" onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> Add Event
        </button>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Event">
        <div className="form-group">
          <label>Day</label>
          <input type="number" min={1} max={daysInMonth} value={evForm.day} onChange={(e) => setEvForm({ ...evForm, day: parseInt(e.target.value) || 1 })} />
        </div>
        <div className="form-group">
          <label>Event Label</label>
          <input value={evForm.label} onChange={(e) => setEvForm({ ...evForm, label: e.target.value })} placeholder="e.g. VIP Check-in" />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={evForm.type} onChange={(e) => setEvForm({ ...evForm, type: e.target.value })} className="booking-filter" style={{ width: '100%' }}>
            <option value="event">Event</option>
            <option value="meeting">Meeting</option>
            <option value="reminder">Reminder</option>
          </select>
        </div>
        <button className="btn-primary" onClick={addEvent} style={{ width: '100%' }}>Add Event</button>
      </Modal>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="text-btn" onClick={prevMonth}><ChevronLeft size={18} /></button>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, minWidth: 200, textAlign: 'center' }}>{month} {year}</h3>
            <button className="text-btn" onClick={nextMonth}><ChevronRight size={18} /></button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, background: 'var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {DAYS.map((d) => (
            <div key={d} style={{ background: 'var(--bg)', padding: '10px 12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textAlign: 'center' }}>{d}</div>
          ))}
          {days.map((d, i) => (
            <div key={i} style={{ background: '#fff', minHeight: 90, padding: 8, opacity: d ? 1 : 0.3 }}>
              {d && (
                <>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: d === today.getDate() && monthIdx === today.getMonth() ? 'var(--primary)' : 'var(--text)' }}>{d}</span>
                  {events[d]?.map((ev, j) => (
                    <div key={j} style={{
                      marginTop: 4, padding: '3px 6px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 600,
                      background: ev.type === 'event' ? 'var(--primary-light)' : ev.type === 'meeting' ? '#fffbeb' : '#f0fdf4',
                      color: ev.type === 'event' ? 'var(--primary)' : ev.type === 'meeting' ? '#d97706' : '#059669',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{ev.label}</div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
