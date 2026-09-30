import { useState, useEffect } from 'react'
import { Bed, CheckCircle, Clock, Sparkles, RefreshCw } from 'lucide-react'
import api from '../../api/axios'

const FALLBACK_ROOMS = [
  { roomId: 1, roomNumber: '101', roomType: 'Deluxe King', floor: 1 },
  { roomId: 2, roomNumber: '102', roomType: 'Deluxe King', floor: 1 },
  { roomId: 3, roomNumber: '201', roomType: 'Suite', floor: 2 },
  { roomId: 4, roomNumber: '202', roomType: 'Suite', floor: 2 },
  { roomId: 5, roomNumber: '301', roomType: 'Executive Suite', floor: 3 },
  { roomId: 6, roomNumber: '302', roomType: 'Executive Suite', floor: 3 },
  { roomId: 7, roomNumber: '401', roomType: 'Penthouse', floor: 4 },
  { roomId: 8, roomNumber: '402', roomType: 'Penthouse', floor: 4 },
  { roomId: 9, roomNumber: '103', roomType: 'Standard Twin', floor: 1 },
  { roomId: 10, roomNumber: '104', roomType: 'Standard Twin', floor: 1 },
  { roomId: 11, roomNumber: '203', roomType: 'Deluxe King', floor: 2 },
  { roomId: 12, roomNumber: '204', roomType: 'Deluxe King', floor: 2 },
  { roomId: 13, roomNumber: '303', roomType: 'Suite', floor: 3 },
  { roomId: 14, roomNumber: '304', roomType: 'Standard Twin', floor: 3 },
  { roomId: 15, roomNumber: '403', roomType: 'Deluxe King', floor: 4 },
  { roomId: 16, roomNumber: '404', roomType: 'Suite', floor: 4 },
]

const FALLBACK_HOUSEKEEPING = [
  { id: 1, room: { roomNumber: '101' }, cleaningStatus: 'Pending', assignedStaff: 'Maria Santos' },
  { id: 2, room: { roomNumber: '102' }, cleaningStatus: 'In Progress', assignedStaff: 'John Rivera' },
  { id: 3, room: { roomNumber: '201' }, cleaningStatus: 'Completed', assignedStaff: 'Lisa Chen' },
  { id: 4, room: { roomNumber: '202' }, cleaningStatus: 'Pending', assignedStaff: 'David Park' },
  { id: 5, room: { roomNumber: '301' }, cleaningStatus: 'Completed', assignedStaff: 'Maria Santos' },
  { id: 6, room: { roomNumber: '302' }, cleaningStatus: 'In Progress', assignedStaff: 'Lisa Chen' },
  { id: 7, room: { roomNumber: '401' }, cleaningStatus: 'Completed', assignedStaff: 'David Park' },
  { id: 8, room: { roomNumber: '402' }, cleaningStatus: 'Pending', assignedStaff: 'John Rivera' },
  { id: 9, room: { roomNumber: '103' }, cleaningStatus: 'In Progress', assignedStaff: 'Maria Santos' },
  { id: 10, room: { roomNumber: '104' }, cleaningStatus: 'Pending', assignedStaff: 'Lisa Chen' },
  { id: 11, room: { roomNumber: '203' }, cleaningStatus: 'Completed', assignedStaff: 'David Park' },
  { id: 12, room: { roomNumber: '204' }, cleaningStatus: 'Completed', assignedStaff: 'John Rivera' },
  { id: 13, room: { roomNumber: '303' }, cleaningStatus: 'Pending', assignedStaff: 'Maria Santos' },
  { id: 14, room: { roomNumber: '304' }, cleaningStatus: 'Completed', assignedStaff: 'Lisa Chen' },
  { id: 15, room: { roomNumber: '403' }, cleaningStatus: 'Pending', assignedStaff: 'David Park' },
  { id: 16, room: { roomNumber: '404' }, cleaningStatus: 'In Progress', assignedStaff: 'John Rivera' },
]

const STATUS_CONFIG = {
  Pending: { color: '#64748B', bg: '#F1F5F9', border: '#E2E8F0', icon: Clock },
  'In Progress': { color: '#CA8A04', bg: '#FEF9C3', border: '#FDE68A', icon: Sparkles },
  Completed: { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', icon: CheckCircle },
}

export default function HousekeepingStatus() {
  const [rooms, setRooms] = useState(FALLBACK_ROOMS)
  const [tasks, setTasks] = useState(FALLBACK_HOUSEKEEPING)

  useEffect(() => {
    Promise.all([
      api.get('/rooms').catch(() => ({ data: [] })),
      api.get('/housekeeping').catch(() => ({ data: [] })),
    ]).then(([resRooms, resHK]) => {
      const roomData = Array.isArray(resRooms.data) ? resRooms.data : []
      const hkData = Array.isArray(resHK.data) ? resHK.data : []
      setRooms(roomData.length > 0 ? roomData : FALLBACK_ROOMS)
      setTasks(hkData.length > 0 ? hkData : FALLBACK_HOUSEKEEPING)
    }).catch(err => console.error(err))
  }, [])

  const getTaskForRoom = (roomNumber) => tasks.find(t => t.room?.roomNumber === roomNumber)

  const statusMap = {}
  rooms.forEach(r => {
    const task = getTaskForRoom(r.roomNumber)
    statusMap[r.roomNumber] = task ? task.cleaningStatus : 'Pending'
  })

  const counts = { Pending: 0, 'In Progress': 0, Completed: 0 }
  Object.values(statusMap).forEach(s => { if (counts[s] !== undefined) counts[s]++ })

  const total = rooms.length
  const pendingPct = total ? (counts['Pending'] / total * 100) : 0
  const inProgressPct = total ? (counts['In Progress'] / total * 100) : 0
  const completedPct = total ? (counts['Completed'] / total * 100) : 0

  const floors = [...new Set(rooms.map(r => r.floor))].sort()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Room Cleaning Status</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Overview of cleaning progress across all floors</p>
        </div>
        <button className="btn-secondary" onClick={() => {
          Promise.all([
            api.get('/rooms').catch(() => ({ data: [] })),
            api.get('/housekeeping').catch(() => ({ data: [] })),
          ]).then(([resRooms, resHK]) => {
            const roomData = Array.isArray(resRooms.data) ? resRooms.data : []
            const hkData = Array.isArray(resHK.data) ? resHK.data : []
            if (roomData.length > 0) setRooms(roomData)
            if (hkData.length > 0) setTasks(hkData)
          }).catch(err => console.error(err))
        }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {Object.entries(counts).map(([status, count], i) => {
          const cfg = STATUS_CONFIG[status]
          const Icon = cfg.icon
          return (
            <div key={status} style={{
              flex: 1, background: cfg.bg, borderRadius: 12, padding: 16,
              display: 'flex', alignItems: 'center', gap: 12,
              animationDelay: `${i * 60}ms`,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, display: 'flex',
                alignItems: 'center', justifyContent: 'center', background: cfg.color, color: '#fff',
              }}>
                <Icon size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: cfg.color }}>{count}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: cfg.color }}>{status}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 20 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 12 }}>Overall Progress</div>
        <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', background: '#F1F5F9', gap: 2 }}>
          <div style={{ width: `${completedPct}%`, background: '#16A34A', borderRadius: 6, transition: 'width 0.5s' }} />
          <div style={{ width: `${inProgressPct}%`, background: '#CA8A04', borderRadius: 6, transition: 'width 0.5s' }} />
          <div style={{ width: `${pendingPct}%`, background: '#94A3B8', borderRadius: 6, transition: 'width 0.5s' }} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color }} />
              <span style={{ color: 'var(--text-secondary)' }}>{status}</span>
              <span style={{ fontWeight: 700 }}>{counts[status]}</span>
            </div>
          ))}
        </div>
      </div>

      {floors.map(floor => (
        <div key={floor} style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>
            Floor {floor}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {rooms.filter(r => r.floor === floor).map((room, i) => {
              const status = statusMap[room.roomNumber] || 'Pending'
              const cfg = STATUS_CONFIG[status]
              const Icon = cfg.icon
              const task = getTaskForRoom(room.roomNumber)
              return (
                <div key={room.roomId} style={{
                  background: cfg.bg,
                  border: `1.5px solid ${cfg.border}`,
                  borderRadius: 12,
                  padding: 16,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  animationDelay: `${i * 40}ms`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 800 }}>{room.roomNumber}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{room.roomType}</div>
                    </div>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', background: cfg.color, color: '#fff',
                    }}>
                      <Icon size={16} />
                    </div>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem',
                    fontWeight: 600, color: cfg.color,
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%', background: cfg.color,
                    }} />
                    {status}
                  </div>
                  {task?.assignedStaff && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      {task.assignedStaff}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
