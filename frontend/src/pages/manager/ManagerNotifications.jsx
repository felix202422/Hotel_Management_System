import { useState, useEffect } from 'react'
import {
  Bell, CheckCircle, AlertTriangle, Info, DollarSign, Users,
  CalendarCheck, MessageSquare, Star, Settings, Clock
} from 'lucide-react'
import api from '../../api/axios'

const ICON_MAP = {
  CHECKIN: CheckCircle,
  CHECK_OUT: CheckCircle,
  CLEANING: CheckCircle,
  CLEANED: CheckCircle,
  MAINTENANCE: AlertTriangle,
  PAYMENT: DollarSign,
  RESERVATION: CalendarCheck,
  REVIEW: Star,
  SYSTEM: Settings,
  INFO: Info,
  BOOKING: CalendarCheck,
  GUEST: Users,
  MESSAGE: MessageSquare,
  ALERT: AlertTriangle,
}

const COLOR_MAP = {
  CHECKIN: '#22c55e',
  CHECK_OUT: '#22c55e',
  CLEANING: '#22c55e',
  CLEANED: '#22c55e',
  MAINTENANCE: '#ef4444',
  PAYMENT: '#3b82f6',
  RESERVATION: '#9333ea',
  REVIEW: '#22c55e',
  SYSTEM: '#64748b',
  INFO: '#3b82f6',
  BOOKING: '#9333ea',
  GUEST: '#f59e0b',
  MESSAGE: '#3b82f6',
  ALERT: '#f59e0b',
}

const FALLBACK = [
  { id: 1, icon: CheckCircle, color: '#22c55e', message: 'Room 201 has been cleaned and inspected successfully.', time: '5 min ago', read: false },
  { id: 2, icon: AlertTriangle, color: '#ef4444', message: 'Maintenance issue reported in Room 104 — leaking faucet.', time: '15 min ago', read: false },
  { id: 3, icon: DollarSign, color: '#3b82f6', message: 'Payment of $2,600 received from Maria Garcia for reservation #3.', time: '1 hour ago', read: false },
  { id: 4, icon: Users, color: '#f59e0b', message: 'New guest check-in: Robert Chen assigned to Room 102.', time: '2 hours ago', read: true },
  { id: 5, icon: CalendarCheck, color: '#9333ea', message: 'Reservation #7 (Emma Brown) confirmed for Room 404, Aug 31–Sep 4.', time: '3 hours ago', read: true },
  { id: 6, icon: MessageSquare, color: '#3b82f6', message: 'New guest review received — 5 stars from Alice Johnson.', time: '5 hours ago', read: true },
  { id: 7, icon: AlertTriangle, color: '#f59e0b', message: 'Room 403 maintenance scheduled for tomorrow at 10:00 AM.', time: '6 hours ago', read: true },
  { id: 8, icon: Star, color: '#22c55e', message: 'Hotel occupancy rate exceeded 90% this week — great performance!', time: 'Yesterday', read: true },
  { id: 9, icon: Settings, color: '#64748b', message: 'System update completed. All modules are functioning normally.', time: 'Yesterday', read: true },
  { id: 10, icon: Bell, color: '#3b82f6', message: 'Reminder: Weekly staff meeting tomorrow at 9:00 AM in Conference Room A.', time: '2 days ago', read: true },
]

function normalizeNotification(n) {
  const type = n.type || n.notificationType || 'INFO'
  return {
    id: n.id || n.notificationId,
    icon: ICON_MAP[type] || Bell,
    color: COLOR_MAP[type] || '#3b82f6',
    message: n.message || n.text || n.content || '',
    time: n.time || n.createdAt || n.timestamp || '',
    read: n.read || n.isRead || false,
    type,
  }
}

export default function ManagerNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/notifications?userId=2')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : []
        if (data.length > 0) {
          setNotifications(data.map(normalizeNotification))
        } else {
          setNotifications(FALLBACK)
        }
      })
      .catch(err => {
        console.warn('Notifications fetch failed, using fallback:', err)
        setNotifications(FALLBACK)
      })
      .finally(() => setLoading(false))
  }, [])

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Loading notifications...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Notifications</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="btn-secondary" onClick={markAllAsRead} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={16} /> Mark All as Read
          </button>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {notifications.length === 0 ? (
            <div className="empty-state">
              <Bell size={48} style={{ color: 'var(--border)', marginBottom: 16 }} />
              <p>No notifications yet</p>
            </div>
          ) : notifications.map((n, i) => {
            const Icon = n.icon
            return (
              <div key={n.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '16px 14px',
                borderBottom: '1px solid #f1f5f9',
                background: n.read ? 'transparent' : '#f8fafc',
                borderRadius: 8,
                transition: 'background 0.2s',
                animation: 'fadeIn 0.3s ease forwards', opacity: 0, animationDelay: `${0.04 * i}s`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${n.color}15`, color: n.color, flexShrink: 0,
                }}>
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: n.read ? 400 : 600, color: 'var(--text)', lineHeight: 1.5 }}>
                    {n.message}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <Clock size={12} style={{ color: 'var(--text-secondary)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{n.time}</span>
                  </div>
                </div>
                {!n.read && (
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => markAsRead(n.id)}
                    style={{ flexShrink: 0, fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    Mark Read
                  </button>
                )}
                {!n.read && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--primary)', flexShrink: 0, marginTop: 6,
                  }} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}