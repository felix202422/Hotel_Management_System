import { useLocation, useNavigate } from 'react-router'
import { Search, Bell, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Header.css'

const PAGE_NAMES = {
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/users': 'User Management',
  '/admin/rooms': 'Room Management',
  '/admin/guests': 'Guest Management',
  '/admin/reservations': 'Reservations',
  '/admin/payments': 'Payments',
  '/admin/housekeeping': 'Housekeeping',
  '/admin/maintenance': 'Maintenance',
  '/admin/staff': 'Staff Management',
  '/admin/reports': 'Reports',
  '/admin/audit': 'Audit Log',
  '/admin/settings': 'Settings',
  '/admin/profile': 'My Profile',
  '/manager/dashboard': 'Manager Dashboard',
  '/manager/reservations': 'Reservations',
  '/manager/guests': 'Guests',
  '/manager/rooms': 'Rooms',
  '/manager/housekeeping': 'Housekeeping',
  '/manager/maintenance': 'Maintenance',
  '/manager/staff': 'Staff',
  '/manager/payments': 'Payments',
  '/manager/reports': 'Reports',
  '/manager/notifications': 'Notifications',
  '/manager/profile': 'My Profile',
  '/secretary/dashboard': 'Reception Dashboard',
  '/secretary/reservations': 'Reservations',
  '/secretary/new-reservation': 'New Reservation',
  '/secretary/guests': 'Guests',
  '/secretary/checkin': 'Check-in',
  '/secretary/checkout': 'Check-out',
  '/secretary/rooms': 'Rooms',
  '/secretary/payments': 'Payments',
  '/secretary/notifications': 'Notifications',
  '/secretary/profile': 'My Profile',
  '/housekeeping/dashboard': 'Housekeeping Dashboard',
  '/housekeeping/rooms': 'Assigned Rooms',
  '/housekeeping/tasks': 'Cleaning Tasks',
  '/housekeeping/status': 'Room Status',
  '/housekeeping/history': 'History',
  '/housekeeping/notifications': 'Notifications',
  '/housekeeping/profile': 'My Profile',
  '/accountant/dashboard': 'Accountant Dashboard',
  '/accountant/payments': 'Payments',
  '/accountant/invoices': 'Invoices',
  '/accountant/revenue': 'Revenue',
  '/accountant/expenses': 'Expenses',
  '/accountant/transactions': 'Transactions',
  '/accountant/reports': 'Reports',
  '/accountant/profile': 'My Profile',
  '/maintenance/dashboard': 'Maintenance Dashboard',
  '/maintenance/requests': 'Maintenance Requests',
  '/maintenance/tasks': 'Assigned Tasks',
  '/maintenance/rooms': 'Rooms',
  '/maintenance/equipment': 'Equipment',
  '/maintenance/history': 'History',
  '/maintenance/notifications': 'Notifications',
  '/maintenance/profile': 'My Profile',
  '/guest/dashboard': 'Guest Dashboard',
  '/guest/booking': 'My Bookings',
  '/guest/rooms': 'Browse Rooms',
  '/guest/profile': 'My Profile',
}

const ROLE_LABELS = {
  ADMIN: 'Administrator',
  MANAGER: 'Manager',
  SECRETARY: 'Secretary',
  HOUSEKEEPER: 'Housekeeping',
  HOUSEKEEPING_STAFF: 'Housekeeping',
  ACCOUNTANT: 'Accountant',
  MAINTENANCE: 'Maintenance',
  MAINTENANCE_STAFF: 'Maintenance',
  GUEST: 'Guest',
}

export default function Header({ toggleSidebar, collapsed, role }) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const pageTitle = PAGE_NAMES[location.pathname] || 'Dashboard'
  const firstName = user?.username || 'User'
  const roleLabel = ROLE_LABELS[user?.role] || user?.role || 'Staff'

  const formatDate = () => {
    const d = new Date()
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getProfilePath = () => {
    const map = {
      ADMIN: '/admin/profile', MANAGER: '/manager/profile', SECRETARY: '/secretary/profile',
      HOUSEKEEPER: '/housekeeping/profile', HOUSEKEEPING_STAFF: '/housekeeping/profile',
      ACCOUNTANT: '/accountant/profile', MAINTENANCE: '/maintenance/profile',
      MAINTENANCE_STAFF: '/maintenance/profile', GUEST: '/guest/profile',
    }
    return map[user?.role] || '/admin/profile'
  }

  return (
    <header className="header">
      <div className="header-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
          <div>
            <h1 className="header-title">{pageTitle}</h1>
            <span className="header-date">{formatDate()}</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search rooms, guests, bookings..." />
        </div>
      </div>

      <div className="header-right">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="dot" />
        </button>
        <div className="user-profile" onClick={() => navigate(getProfilePath())} style={{ cursor: 'pointer' }}>
          <div className="avatar">
            <span>{firstName[0]?.toUpperCase()}</span>
          </div>
          <div className="user-info">
            <span className="user-name">{firstName}</span>
            <span className="user-role">{roleLabel}</span>
          </div>
        </div>
        <button className="icon-btn" onClick={handleLogout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
