import { NavLink, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Hotel, Users, CalendarCheck, CreditCard, Shield,
  FileText, Settings, LogOut, Bell, UserCheck,
  ClipboardList, Wrench, BarChart3,
  Package, BookOpen, ArrowLeftRight,
  User, Sparkles, CircleDollarSign,
  Receipt, TrendingUp, Wallet, AlertTriangle
} from 'lucide-react'
import './Sidebar.css'

const ADMIN_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/admin/users', label: 'Users', icon: <Users size={20} /> },
  { to: '/admin/rooms', label: 'Rooms', icon: <Hotel size={20} /> },
  { to: '/admin/guests', label: 'Guests', icon: <UserCheck size={20} /> },
  { to: '/admin/reservations', label: 'Reservations', icon: <CalendarCheck size={20} /> },
  { to: '/admin/payments', label: 'Payments', icon: <CreditCard size={20} /> },
  { to: '/admin/housekeeping', label: 'Housekeeping', icon: <Shield size={20} /> },
  { to: '/admin/maintenance', label: 'Maintenance', icon: <Wrench size={20} /> },
  { to: '/admin/staff', label: 'Staff', icon: <ClipboardList size={20} /> },
  { to: '/admin/reports', label: 'Reports', icon: <FileText size={20} /> },
  { to: '/admin/audit', label: 'Audit Log', icon: <BarChart3 size={20} /> },
  { to: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
]

const MANAGER_LINKS = [
  { to: '/manager/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/manager/reservations', label: 'Reservations', icon: <CalendarCheck size={20} /> },
  { to: '/manager/guests', label: 'Guests', icon: <Users size={20} /> },
  { to: '/manager/rooms', label: 'Rooms', icon: <Hotel size={20} /> },
  { to: '/manager/housekeeping', label: 'Housekeeping', icon: <Shield size={20} /> },
  { to: '/manager/maintenance', label: 'Maintenance', icon: <Wrench size={20} /> },
  { to: '/manager/staff', label: 'Staff', icon: <ClipboardList size={20} /> },
  { to: '/manager/payments', label: 'Payments', icon: <CreditCard size={20} /> },
  { to: '/manager/reports', label: 'Reports', icon: <FileText size={20} /> },
  { to: '/manager/notifications', label: 'Notifications', icon: <Bell size={20} /> },
]

const SECRETARY_LINKS = [
  { to: '/secretary/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/secretary/reservations', label: 'Reservations', icon: <CalendarCheck size={20} /> },
  { to: '/secretary/new-reservation', label: 'New Reservation', icon: <Sparkles size={20} /> },
  { to: '/secretary/guests', label: 'Guests', icon: <Users size={20} /> },
  { to: '/secretary/checkin', label: 'Check-in', icon: <ArrowLeftRight size={20} /> },
  { to: '/secretary/checkout', label: 'Check-out', icon: <ArrowLeftRight size={20} /> },
  { to: '/secretary/rooms', label: 'Rooms', icon: <Hotel size={20} /> },
  { to: '/secretary/payments', label: 'Payments', icon: <CreditCard size={20} /> },
  { to: '/secretary/notifications', label: 'Notifications', icon: <Bell size={20} /> },
]

const HOUSEKEEPING_LINKS = [
  { to: '/housekeeping/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/housekeeping/rooms', label: 'Assigned Rooms', icon: <Hotel size={20} /> },
  { to: '/housekeeping/tasks', label: 'Cleaning Tasks', icon: <ClipboardList size={20} /> },
  { to: '/housekeeping/status', label: 'Room Status', icon: <Package size={20} /> },
  { to: '/housekeeping/history', label: 'History', icon: <BarChart3 size={20} /> },
  { to: '/housekeeping/notifications', label: 'Notifications', icon: <Bell size={20} /> },
]

const ACCOUNTANT_LINKS = [
  { to: '/accountant/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/accountant/payments', label: 'Payments', icon: <CreditCard size={20} /> },
  { to: '/accountant/invoices', label: 'Invoices', icon: <Receipt size={20} /> },
  { to: '/accountant/revenue', label: 'Revenue', icon: <TrendingUp size={20} /> },
  { to: '/accountant/expenses', label: 'Expenses', icon: <CircleDollarSign size={20} /> },
  { to: '/accountant/transactions', label: 'Transactions', icon: <Wallet size={20} /> },
  { to: '/accountant/reports', label: 'Reports', icon: <FileText size={20} /> },
]

const MAINTENANCE_LINKS = [
  { to: '/maintenance/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/maintenance/requests', label: 'Requests', icon: <AlertTriangle size={20} /> },
  { to: '/maintenance/tasks', label: 'Assigned Tasks', icon: <ClipboardList size={20} /> },
  { to: '/maintenance/rooms', label: 'Rooms', icon: <Hotel size={20} /> },
  { to: '/maintenance/equipment', label: 'Equipment', icon: <Wrench size={20} /> },
  { to: '/maintenance/history', label: 'History', icon: <BarChart3 size={20} /> },
  { to: '/maintenance/notifications', label: 'Notifications', icon: <Bell size={20} /> },
]

const GUEST_LINKS = [
  { to: '/guest/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/guest/booking', label: 'My Bookings', icon: <BookOpen size={20} /> },
  { to: '/guest/rooms', label: 'Browse Rooms', icon: <Hotel size={20} /> },
  { to: '/guest/profile', label: 'Profile', icon: <User size={20} /> },
]

const LINKS_MAP = {
  ADMIN: ADMIN_LINKS,
  MANAGER: MANAGER_LINKS,
  SECRETARY: SECRETARY_LINKS,
  HOUSEKEEPER: HOUSEKEEPING_LINKS,
  HOUSEKEEPING_STAFF: HOUSEKEEPING_LINKS,
  ACCOUNTANT: ACCOUNTANT_LINKS,
  MAINTENANCE: MAINTENANCE_LINKS,
  MAINTENANCE_STAFF: MAINTENANCE_LINKS,
  GUEST: GUEST_LINKS,
}

export default function RoleBasedSidebar({ collapsed, role }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const links = LINKS_MAP[role] || ADMIN_LINKS

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon"><Hotel size={24} /></div>
        {!collapsed && <h2>Hasmir Hotels</h2>}
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            {!collapsed && <span className="nav-label">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout} style={collapsed ? { justifyContent: 'center' } : {}}>
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
