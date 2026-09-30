import { useState, useEffect } from 'react'
import { Bell, Check, Wrench, AlertTriangle, UserPlus, Clock, Info, Shield } from 'lucide-react'
import api from '../../api/axios'

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'New Maintenance Request', message: 'Room 104 - Leaking faucet in bathroom needs repair. Priority: High.', time: '5 minutes ago', read: false, type: 'warning', icon: Wrench },
  { id: 2, title: 'Task Assigned', message: 'You have been assigned to MR-009: Mini-fridge making unusual noise in Room 102.', time: '20 minutes ago', read: false, type: 'info', icon: UserPlus },
  { id: 3, title: 'Critical Request', message: 'Room 402 - Electrical outlet sparking intermittently. Immediate attention required.', time: '45 minutes ago', read: false, type: 'error', icon: AlertTriangle },
  { id: 4, title: 'Task Updated', message: 'MR-002 (Room 202 AC repair) status updated to In Progress by David Park.', time: '1 hour ago', read: true, type: 'success', icon: Clock },
  { id: 5, title: 'New Maintenance Request', message: 'Room 302 - Ceiling fan wobbling at high speed. Priority: Medium.', time: '2 hours ago', read: true, type: 'info', icon: Wrench },
  { id: 6, title: 'Task Completed', message: 'MR-003 (Room 301 - Light bulb replacement) has been completed by Lisa Chen.', time: '3 hours ago', read: true, type: 'success', icon: Check },
  { id: 7, title: 'Safety Alert', message: 'Room 404 - Smoke detector chirping intermittently. Priority: Critical.', time: '4 hours ago', read: true, type: 'error', icon: Shield },
  { id: 8, title: 'System Notice', message: 'Equipment service reminder: HVAC Thermostat Controller is due for service on Sep 1.', time: '5 hours ago', read: true, type: 'info', icon: Info },
]

const TYPE_STYLES = {
  info: { bg: '#eff6ff', color: '#2563eb' },
  success: { bg: '#f0fdf4', color: '#16a34a' },
  warning: { bg: '#fffbeb', color: '#d97706' },
  error: { bg: '#fef2f2', color: '#dc2626' },
}

export default function MaintenanceNotifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  useEffect(() => {
    api.get('/notifications?userId=6').then(res => {
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
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Stay updated with requests and alerts</p>
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
