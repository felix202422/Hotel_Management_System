import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import Modal from '../components/Modal'

export default function Housekeeping() {
  const [tasks, setTasks] = useState([
    { housekeepingId: 1, room: { roomNumber: '101' }, assignedStaff: 'Maria Santos', cleanedDate: '2026-07-29', cleaningStatus: 'Completed' },
    { housekeepingId: 2, room: { roomNumber: '102' }, assignedStaff: 'John Kim', cleanedDate: '2026-07-30', cleaningStatus: 'In Progress' },
    { housekeepingId: 3, room: { roomNumber: '201' }, assignedStaff: 'Maria Santos', cleanedDate: '2026-07-28', cleaningStatus: 'Completed' },
    { housekeepingId: 4, room: { roomNumber: '202' }, assignedStaff: 'David Park', cleanedDate: '', cleaningStatus: 'Pending' },
    { housekeepingId: 5, room: { roomNumber: '301' }, assignedStaff: 'John Kim', cleanedDate: '2026-07-30', cleaningStatus: 'In Progress' },
    { housekeepingId: 6, room: { roomNumber: '302' }, assignedStaff: 'Maria Santos', cleanedDate: '2026-07-29', cleaningStatus: 'Completed' },
    { housekeepingId: 7, room: { roomNumber: '103' }, assignedStaff: 'David Park', cleanedDate: '', cleaningStatus: 'Pending' },
    { housekeepingId: 8, room: { roomNumber: '204' }, assignedStaff: 'Lisa Chen', cleanedDate: '2026-07-28', cleaningStatus: 'Completed' },
    { housekeepingId: 9, room: { roomNumber: '304' }, assignedStaff: 'John Kim', cleanedDate: '2026-07-30', cleaningStatus: 'Completed' },
    { housekeepingId: 10, room: { roomNumber: '402' }, assignedStaff: 'Lisa Chen', cleanedDate: '', cleaningStatus: 'Pending' },
    { housekeepingId: 11, room: { roomNumber: '404' }, assignedStaff: 'Maria Santos', cleanedDate: '2026-07-29', cleaningStatus: 'Completed' },
    { housekeepingId: 12, room: { roomNumber: '403' }, assignedStaff: 'David Park', cleanedDate: '2026-07-30', cleaningStatus: 'In Progress' },
  ])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ room: '', staff: '' })

  const addTask = () => {
    if (!form.room.trim() || !form.staff.trim()) return
    setTasks([...tasks, { housekeepingId: tasks.length + 1, room: { roomNumber: form.room }, assignedStaff: form.staff, cleanedDate: '', cleaningStatus: 'Pending' }])
    setModalOpen(false)
    setForm({ room: '', staff: '' })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 className="page-title">Housekeeping</h1>
        <button className="btn-primary" onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> New Task
        </button>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Housekeeping Task">
        <div className="form-group"><label>Room Number</label><input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="e.g. 501" /></div>
        <div className="form-group"><label>Assigned Staff</label><input value={form.staff} onChange={(e) => setForm({ ...form, staff: e.target.value })} placeholder="e.g. Staff name" /></div>
        <button className="btn-primary" onClick={addTask} style={{ width: '100%' }}>Create Task</button>
      </Modal>

      <div className="card">
        <div className="booking-search" style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--muted)' }} />
          <input type="text" placeholder="Search tasks..." style={{ paddingLeft: 36, width: 300 }} />
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Assigned Staff</th>
              <th>Cleaned Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr><td colSpan={4} className="empty-state">No housekeeping tasks found</td></tr>
            ) : tasks.map((t) => (
              <tr key={t.housekeepingId}>
                <td><span className="room-badge">Room {t.room?.roomNumber}</span></td>
                <td style={{ fontWeight: 500 }}>{t.assignedStaff}</td>
                <td>{t.cleanedDate || '—'}</td>
                <td>
                  <span className={`badge badge-${t.cleaningStatus === 'Completed' ? 'green' : t.cleaningStatus === 'In Progress' ? 'yellow' : 'gray'}`}>
                    {t.cleaningStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
