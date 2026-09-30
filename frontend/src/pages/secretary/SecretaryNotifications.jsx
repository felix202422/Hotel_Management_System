import { useState, useEffect } from 'react'
import { Bell, Check, Calendar, AlertCircle, Info, CreditCard, Bed, Clock } from 'lucide-react'
import api from '../../api/axios'

const TYPE_STYLES = {
  info: { bg: '#eff6ff', color: '#2563eb' },
  success: { bg: '#f0fdf4', color: '#16a34a' },
  warning: { bg: '#fffbeb', color: '#d97706' },
  error: { bg: '#fef2f2', color: '#dc2626' },
}

const ICON_MAP = {
  info: Info,
  success: Check,
  warning: AlertCircle,
  error: AlertCircle,
}

export default function SecretaryNotifications() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    api.get('/notifications?userId=3').then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      setNotifications(data.map(n => ({
        ...n,
        read: n.read || false,
        type: n.type || 'info',
        icon: ICON_MAP[n.type] || Bell,
      })))
    }).catch(err => {
      console.error(err)
      setNotifications([])
    })
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
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 className="page-title">Notifications</h1>
            {unreadCount > 0 && <span className="badge badge-blue">{unreadCount} unread</span>}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All notifications are read'}
          </p>
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
                  animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.04 * i}s`,
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