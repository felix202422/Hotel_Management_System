import { useState, useEffect } from 'react'
import { User, Mail, Phone, Globe, Lock, Save, CheckCircle } from 'lucide-react'
import api from '../../api/axios'

const s = {
  page: { maxWidth: 800, margin: '0 auto', padding: '32px 24px' },
  header: { marginBottom: 32 },
  title: { fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 },
  sub: { color: '#6B7280', fontSize: '0.92rem' },
  card: { background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 24 },
  cardTitle: { fontWeight: 700, fontSize: '1.1rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  input: {
    width: '100%', padding: '12px 16px', border: '1.5px solid #D1D5DB', borderRadius: 12,
    fontSize: '0.88rem', transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'inherit',
  },
  statusCard: {
    background: '#F0FDF4', borderRadius: 14, padding: 20,
    display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24,
  },
  avatar: {
    width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.4rem', fontWeight: 700, flexShrink: 0,
  },
  successToast: {
    position: 'fixed', bottom: 24, right: 24, background: '#059669', color: '#fff',
    padding: '12px 24px', borderRadius: 12, fontWeight: 600, fontSize: '0.88rem',
    display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    zIndex: 100, animation: 'slideUp 0.3s ease',
  },
}

export default function GuestProfile() {
  const [user] = useState(() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })
  const [profile, setProfile] = useState({
    firstName: '', lastName: '', email: '', phone: '', nationality: '',
  })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [showSuccess, setShowSuccess] = useState('')

  useEffect(() => {
    const storedUser = user
    if (storedUser) {
      setProfile({
        firstName: storedUser.username || storedUser.firstName || 'Guest',
        lastName: storedUser.lastName || '',
        email: storedUser.email || '',
        phone: storedUser.phone || '',
        nationality: storedUser.nationality || '',
      })
    }
    api.get('/guests/me').then(res => {
      const d = res.data
      if (d && typeof d === 'object') {
        setProfile({
          firstName: d.firstName || storedUser?.username || 'Guest',
          lastName: d.lastName || '',
          email: d.email || '',
          phone: d.phone || '',
          nationality: d.nationality || '',
        })
      }
    }).catch(err => console.error(err))
  }, [])

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await api.put('/guests/me', profile)
    } catch (err) { console.error(err) }
    setSavingProfile(false)
    setShowSuccess('Profile updated successfully')
    setTimeout(() => setShowSuccess(''), 3000)
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) return
    if (!passwords.currentPassword || !passwords.newPassword) return
    setSavingPassword(true)
    try {
      await api.put('/guests/me/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      })
    } catch (err) { console.error(err) }
    setSavingPassword(false)
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setShowSuccess('Password changed successfully')
    setTimeout(() => setShowSuccess(''), 3000)
  }

  const initials = (profile.firstName?.[0] || '') + (profile.lastName?.[0] || '')

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>My Profile</h1>
        <p style={s.sub}>Manage your account settings and personal information</p>
      </div>

      <div style={s.statusCard}>
        <div style={s.avatar}>{initials || 'G'}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{profile.firstName} {profile.lastName}</div>
          <div style={{ fontSize: '0.85rem', color: '#059669', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle size={14} /> Account Active
          </div>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}><User size={20} style={{ color: '#3B82F6' }} /> Personal Information</div>
        <form onSubmit={handleProfileSave}>
          <div style={s.formRow}>
            <div className="form-group">
              <label>First Name</label>
              <input style={s.input} value={profile.firstName} onChange={e => setProfile({ ...profile, firstName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input style={s.input} value={profile.lastName} onChange={e => setProfile({ ...profile, lastName: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input style={{ ...s.input, paddingLeft: 40 }} type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
            </div>
          </div>
          <div style={s.formRow}>
            <div className="form-group">
              <label>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input style={{ ...s.input, paddingLeft: 40 }} value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
              </div>
            </div>
            <div className="form-group">
              <label>Nationality</label>
              <div style={{ position: 'relative' }}>
                <Globe size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input style={{ ...s.input, paddingLeft: 40 }} value={profile.nationality} onChange={e => setProfile({ ...profile, nationality: e.target.value })} placeholder="e.g. American" />
              </div>
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '12px 28px', borderRadius: 12 }} disabled={savingProfile}>
            <Save size={16} /> {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}><Lock size={20} style={{ color: '#EF4444' }} /> Change Password</div>
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>Current Password</label>
            <input style={s.input} type="password" value={passwords.currentPassword}
              onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} placeholder="Enter current password" />
          </div>
          <div style={s.formRow}>
            <div className="form-group">
              <label>New Password</label>
              <input style={s.input} type="password" value={passwords.newPassword}
                onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} placeholder="Enter new password" />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input style={s.input} type="password" value={passwords.confirmPassword}
                onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} placeholder="Confirm new password" />
            </div>
          </div>
          {passwords.newPassword && passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
            <p style={{ color: '#EF4444', fontSize: '0.82rem', marginBottom: 16 }}>Passwords do not match</p>
          )}
          <button type="submit" className="btn-danger" style={{ padding: '12px 28px', borderRadius: 12 }}
            disabled={savingPassword || !passwords.currentPassword || !passwords.newPassword || passwords.newPassword !== passwords.confirmPassword}>
            <Lock size={16} /> {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {showSuccess && (
        <div style={s.successToast}>
          <CheckCircle size={18} /> {showSuccess}
        </div>
      )}
    </div>
  )
}
