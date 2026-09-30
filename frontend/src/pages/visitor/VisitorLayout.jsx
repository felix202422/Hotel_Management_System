import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router'
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Rooms', to: '/rooms' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'My Booking', to: '/booking/track' },
]

const s = {
  topBar: {
    background: '#1E3A5F',
    color: 'rgba(255,255,255,0.85)',
    fontSize: '0.78rem',
    padding: '6px 0',
  },
  topBarInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarInfo: {
    display: 'flex',
    gap: 20,
    alignItems: 'center',
  },
  topBarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  header: {
    background: 'rgba(255,255,255,0.97)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
  },
  headerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 68,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontWeight: 800,
    fontSize: '1.3rem',
    color: '#3B82F6',
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: 800,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  navLink: (active) => ({
    padding: '8px 16px',
    borderRadius: 10,
    fontSize: '0.88rem',
    fontWeight: active ? 700 : 500,
    color: active ? '#3B82F6' : '#374151',
    background: active ? '#EAF3FF' : 'transparent',
    transition: 'all 0.2s',
  }),
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  mobileMenu: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 200,
  },
  mobileMenuPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 280,
    height: '100%',
    background: '#fff',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  footer: {
    background: '#0F172A',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 80,
  },
  footerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '48px 24px 24px',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 40,
    marginBottom: 40,
  },
  footerColTitle: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '1rem',
    marginBottom: 16,
  },
  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: 20,
    textAlign: 'center',
    fontSize: '0.82rem',
  },
}

export default function VisitorLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={s.topBar}>
        <div style={s.topBarInner}>
          <div style={s.topBarInfo}>
            <span style={s.topBarItem}><Phone size={13} /> +1 (555) 123-4567</span>
            <span style={s.topBarItem}><Mail size={13} /> info@fizzohotels.com</span>
          </div>
          <div style={s.topBarItem}>
            <MapPin size={13} /> 123 Luxury Avenue, Metro City
          </div>
        </div>
      </div>

      <header style={s.header}>
        <div style={s.headerInner}>
          <Link to="/" style={s.logo}>
            <div style={s.logoIcon}>H</div>
            Fizzo Hotels
          </Link>

          <nav style={s.nav} className="visitor-nav">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={s.navLink(location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to)))}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div style={s.navActions}>
            <Link to="/login" className="btn-secondary btn-sm">Login</Link>
            <Link to="/register" className="btn-primary btn-sm">Register</Link>
            <button className="btn-icon" style={{ display: 'none' }} id="mobile-toggle" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div style={s.mobileMenu} onClick={() => setMobileOpen(false)}>
          <div style={s.mobileMenuPanel} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#3B82F6' }}>Fizzo Hotels</span>
              <button onClick={() => setMobileOpen(false)} style={{ padding: 4 }}><X size={22} /></button>
            </div>
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  fontWeight: location.pathname === link.to ? 700 : 500,
                  color: location.pathname === link.to ? '#3B82F6' : '#374151',
                  background: location.pathname === link.to ? '#EAF3FF' : 'transparent',
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/login" className="btn-secondary" style={{ justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Register</Link>
            </div>
          </div>
        </div>
      )}

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.footerGrid}>
            <div>
              <div style={{ ...s.footerColTitle, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ ...s.logoIcon, width: 32, height: 32, fontSize: '0.85rem' }}>H</div>
                Fizzo Hotels
              </div>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.7, marginBottom: 16 }}>
                Experience luxury and comfort at its finest. Where every stay becomes a cherished memory.
              </p>
            </div>
            <div>
              <h4 style={s.footerColTitle}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {NAV_LINKS.map(link => (
                  <Link key={link.to} to={link.to} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 style={s.footerColTitle}>Contact</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={15} /> 123 Luxury Avenue, Metro City</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={15} /> +1 (555) 123-4567</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={15} /> info@fizzohotels.com</span>
              </div>
            </div>
            <div>
              <h4 style={s.footerColTitle}>Opening Hours</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem' }}>
                <span>Front Desk: 24/7</span>
                <span>Restaurant: 6:00 AM - 11:00 PM</span>
                <span>Spa: 9:00 AM - 9:00 PM</span>
                <span>Gym: 5:00 AM - 11:00 PM</span>
              </div>
            </div>
          </div>
          <div style={s.footerBottom}>
            &copy; {new Date().getFullYear()} Fizzo Hotels. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
