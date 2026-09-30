import { useState } from 'react'
import { Save, Building, Bell, Palette, Globe } from 'lucide-react'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ar', label: 'Arabic' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'pt', label: 'Portuguese' },
]

export default function AdminSettings() {
  const [hotel, setHotel] = useState({
    name: 'Fizzo Hotels',
    tagline: 'Where Luxury Meets Comfort',
    email: 'info@fizzohotels.com',
    phone: '+1-555-0100',
    address: '123 Grand Avenue, Downtown City, DC 10001',
  })

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    reservationUpdates: true,
    paymentAlerts: true,
    maintenanceAlerts: false,
    dailyReports: true,
  })

  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('en')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggleNotif = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Settings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>Configure hotel preferences, notifications, and system settings</p>
        </div>
        <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Save size={18} /> Save Changes
        </button>
      </div>

      {saved && (
        <div className="card" style={{ marginBottom: 20, borderLeft: '4px solid #059669', background: '#ecfdf5' }}>
          <p style={{ color: '#059669', fontWeight: 600, fontSize: '0.9rem' }}>Settings saved successfully!</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Hotel Settings */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#fff' }}><Building size={20} /></div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Hotel Settings</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Basic hotel information and contact details</p>
            </div>
          </div>
          <div className="form-group">
            <label>Hotel Name</label>
            <input value={hotel.name} onChange={(e) => setHotel({ ...hotel, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Tagline</label>
            <input value={hotel.tagline} onChange={(e) => setHotel({ ...hotel, tagline: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Contact Email</label>
              <input type="email" value={hotel.email} onChange={(e) => setHotel({ ...hotel, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Contact Phone</label>
              <input value={hotel.phone} onChange={(e) => setHotel({ ...hotel, phone: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input value={hotel.address} onChange={(e) => setHotel({ ...hotel, address: e.target.value })} />
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#fff' }}><Bell size={20} /></div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Notification Preferences</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Choose how you want to be notified</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { key: 'email', label: 'Email Notifications', sub: 'Receive updates via email' },
              { key: 'sms', label: 'SMS Notifications', sub: 'Receive text message alerts' },
              { key: 'push', label: 'Push Notifications', sub: 'Browser push notifications' },
              { key: 'reservationUpdates', label: 'Reservation Updates', sub: 'Alerts on booking changes' },
              { key: 'paymentAlerts', label: 'Payment Alerts', sub: 'Notifications for payments' },
              { key: 'maintenanceAlerts', label: 'Maintenance Alerts', sub: 'Maintenance request updates' },
              { key: 'dailyReports', label: 'Daily Reports', sub: 'Daily summary reports' },
            ].map(({ key, label, sub }) => (
              <div
                key={key}
                onClick={() => toggleNotif(key)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 'var(--radius)',
                  border: `1.5px solid ${notifications[key] ? 'var(--primary)' : 'var(--border)'}`,
                  background: notifications[key] ? 'var(--primary-light)' : 'var(--card)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>{sub}</div>
                </div>
                <div style={{
                  width: 44, height: 24, borderRadius: 12, position: 'relative',
                  background: notifications[key] ? 'var(--primary)' : '#d1d5db',
                  transition: 'background 0.2s',
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: 3,
                    left: notifications[key] ? 23 : 3,
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Theme */}
          <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff' }}><Palette size={20} /></div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Theme</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Select your preferred theme</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {['light', 'dark'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  style={{
                    flex: 1, padding: '16px', borderRadius: 'var(--radius)',
                    border: `2px solid ${theme === t ? 'var(--primary)' : 'var(--border)'}`,
                    background: theme === t ? 'var(--primary-light)' : 'var(--card)',
                    fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                    color: theme === t ? 'var(--primary)' : 'var(--text-secondary)',
                    textTransform: 'capitalize', transition: 'all 0.15s',
                  }}
                >
                  {t === 'light' ? '☀️' : '🌙'} {t}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}><Globe size={20} /></div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Language</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Choose your preferred language</p>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 'var(--radius)',
                  border: '1.5px solid var(--input-border)', fontSize: '0.9rem',
                  background: 'var(--card)', cursor: 'pointer',
                }}
              >
                {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
