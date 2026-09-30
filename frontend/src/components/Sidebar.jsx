import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Inbox, Calendar, Megaphone, Hotel, Shield,
  Package, CreditCard, Star, LogIn, LogOut, ChevronRight,
  PlusSquare, FileText
} from 'lucide-react'
import './Sidebar.css'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/booking', label: 'New Booking', icon: <PlusSquare size={20} />, badge: 'Hot' },
  { to: '/inbox', label: 'Inbox', icon: <Inbox size={20} />, badge: '12' },
  { to: '/calendar', label: 'Calendar', icon: <Calendar size={20} /> },
  { to: '/campaigns', label: 'Campaigns', icon: <Megaphone size={20} />, badge: 'New' },
  { to: '/rooms', label: 'Rooms', icon: <Hotel size={20} /> },
  { to: '/housekeeping', label: 'Housekeeping', icon: <Shield size={20} /> },
  { to: '/inventory', label: 'Inventory', icon: <Package size={20} /> },
  { to: '/finance', label: 'Finance', icon: <CreditCard size={20} /> },
  { to: '/reviews', label: 'Reviews', icon: <Star size={20} />, badge: '8' },
  { to: '/register', label: 'Register & Login', icon: <LogIn size={20} /> },
  { to: '/reports', label: 'Reports', icon: <FileText size={20} /> },
]

export default function Sidebar({ collapsed }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
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
            {!collapsed && link.badge && <span className={`nav-badge ${link.badge === 'New' || link.badge === 'Hot' ? 'badge-new' : ''}`}>{link.badge}</span>}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
      {collapsed && (
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout} style={{ justifyContent: 'center' }}>
            <LogOut size={18} />
          </button>
        </div>
      )}
    </aside>
  )
}
