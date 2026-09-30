import { useState, useEffect } from 'react'
import { Bell, Check, Clock, AlertCircle, Info, Sparkles, UserPlus, Calendar } from 'lucide-react'
import api from '../../api/axios'

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'New Assignment', message: 'You have been assigned to clean Room 101 (Deluxe King). Priority: High.', time: '5 minutes ago', read: false, type: 'info', icon: UserPlus },
  { id: 2, title: 'Status Update', message: 'Room 201 cleaning completed by Lisa Chen. Inspection cleared.', time: '15 minutes ago', read: false, type: 'success', icon: Check },
  { id: 3, title: 'Schedule Change', message: 'Room 402 cleaning moved to tomorrow. Guest extended their stay.', time: '30 minutes ago', read: false, type: 'warning', icon: Calendar },
  { id: 4, title: 'New Assignment', message: 'Room 104 assigned for post-maintenance cleanup. Please check supply closet first.', time: '1 hour ago', read: false, type: 'info', icon: UserPlus },
  { id: 5, title: 'Room Alert', message: 'Room 103 guest requested extra towels and amenities during cleaning.', time: '2 hours ago', read: true, type: 'warning', icon: AlertCircle },
  { id: 6, title: 'Task Reminder', message: '3 rooms remaining for today\'s shift. Keep up the great work!', time: '3 hours ago', read: true, type: 'info', icon: Clock },
  { id: 7, title: 'Team Update', message: 'David Park is out sick today. His rooms have been redistributed.', time: '4 hours ago', read: true, type: 'info', icon: Info },
  { id: 8, title: 'Completed', message: 'Room 302 has been cleaned and passed inspection. Great job!', time: '5 hours ago', read: true, type: 'success', icon: Sparkles },
]

const TYPE_STYLES = {
  info: { bg: '#EFF6FF', color: '#2563EB' },
  success: { bg: '#F0FDF4', color: '#16A34A' },
  warning: { bg: '#FFF7ED', color: '#EA580C' },
  error: { bg: '#FEF2F2', color: '#DC2626' },
}

export default function HousekeepingNotifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  useEffect(() => {
    api.get('/notifications?userId=4').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      if (data.length > 0) setNotifications(data)
    }).catch(err => console.error(err))
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <h1 className="page-title">Notifications</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Stay updated with assignments and alerts</p>
          </div>
          {unreadCount > 0 && <span className="badge badge-blue">{unreadCount} unread</span>}
        </div>
        {unreadCount > 0 && (
          <button className="btn-secondary" onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Check size={16} /> Mark All Read
          </button>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {notifications.length === 0 ? (
            <div className="empty-state">
              <Bell size={48} style={{ color: 'var(--border)', marginBottom: 16 }} />
              <p>No notifications</p>
            </div>
          ) : notifications.map((n, i) => {
            const style = TYPE_STYLES[n.type] || TYPE_STYLES.info
            const Icon = n.icon || Bell
            return (
              <div key={n.id} onClick={() => markAsRead(n.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14, padding: 16, borderRadius: 12,
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: n.read ? 'transparent' : '#f8fafc',
                  opacity: n.read ? 0.7 : 1,
                  animationDelay: `${i * 40}ms`,
                }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: style.bg, color: style.color, flexShrink: 0,
                }}>
                  <Icon size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{n.title}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.message}</p>
                </div>
                {!n.read && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 6 }} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
