import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import {
  User, Mail, Shield, Building2, Briefcase, Phone, Calendar,
  Save, ArrowLeft, Camera, Key, CheckCircle
} from 'lucide-react'

const ROLE_LABELS = {
  ADMIN: 'Administrator',
  MANAGER: 'Manager',
  SECRETARY: 'Secretary',
  HOUSEKEEPER: 'Housekeeper',
  HOUSEKEEPING_STAFF: 'Housekeeper',
  ACCOUNTANT: 'Accountant',
  MAINTENANCE: 'Maintenance',
  MAINTENANCE_STAFF: 'Maintenance',
  GUEST: 'Guest',
}

const ROLE_COLORS = {
  ADMIN: { bg: '#EFF6FF', color: '#2563EB', gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' },
  MANAGER: { bg: '#F5F3FF', color: '#7C3AED', gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' },
  SECRETARY: { bg: '#ECFDF5', color: '#059669', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
  HOUSEKEEPER: { bg: '#FFF7ED', color: '#EA580C', gradient: 'linear-gradient(135deg, #F97316, #EA580C)' },
  HOUSEKEEPING_STAFF: { bg: '#FFF7ED', color: '#EA580C', gradient: 'linear-gradient(135deg, #F97316, #EA580C)' },
  ACCOUNTANT: { bg: '#F0FDFA', color: '#0D9488', gradient: 'linear-gradient(135deg, #14B8A6, #0D9488)' },
  MAINTENANCE: { bg: '#FEF2F2', color: '#DC2626', gradient: 'linear-gradient(135deg, #EF4444, #DC2626)' },
  MAINTENANCE_STAFF: { bg: '#FEF2F2', color: '#DC2626', gradient: 'linear-gradient(135deg, #EF4444, #DC2626)' },
  GUEST: { bg: '#FFFBEB', color: '#D97706', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
}

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    fullName: user?.fullName || user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    position: user?.position || '',
  })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [changingPassword, setChangingPassword] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)

  const role = user?.role || 'ADMIN'
  const roleLabel = ROLE_LABELS[role] || role
  const roleStyle = ROLE_COLORS[role] || ROLE_COLORS.ADMIN

  const getRolePrefix = () => {
    const map = {
      ADMIN: '/admin', MANAGER: '/manager', SECRETARY: '/secretary',
      HOUSEKEEPER: '/housekeeping', HOUSEKEEPING_STAFF: '/housekeeping',
      ACCOUNTANT: '/accountant', MAINTENANCE: '/maintenance',
      MAINTENANCE_STAFF: '/maintenance', GUEST: '/guest',
    }
    return map[role] || '/admin'
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      await api.put(`/auth/users/${user.id}`, {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        department: form.department,
        position: form.position,
      })
      const updatedUser = { ...user, ...form }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return
    setChangingPassword(true)
    try {
      const token = localStorage.getItem('token')
      await api.put(`/auth/users/${user.id}/password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPwSaved(true)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPwSaved(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setChangingPassword(false)
    }
  }

  const initials = (form.fullName || user?.username || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 0 40px' }}>
      <button
        onClick={() => navigate(getRolePrefix() + '/dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.84rem', fontWeight: 500, marginBottom: 20, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Profile Header */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ background: roleStyle.gradient, padding: '40px 32px 60px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ position: 'absolute', bottom: 20, left: 40, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        </div>
        <div style={{ padding: '0 32px 32px', position: 'relative', marginTop: -44 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginBottom: 20 }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%', background: roleStyle.gradient,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', fontWeight: 800, border: '4px solid var(--card)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)', flexShrink: 0, fontFamily: 'Inter, sans-serif'
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, paddingBottom: 4, minWidth: 0 }}>
              <h2 style={{
                fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)',
                letterSpacing: '-0.025em', marginBottom: 4,
                whiteSpace: 'nowrap', overflow: 'visible'
              }}>
                {form.fullName || user?.username}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '3px 12px', borderRadius: 20, fontSize: '0.76rem',
                  fontWeight: 600, background: roleStyle.bg, color: roleStyle.color,
                  whiteSpace: 'nowrap'
                }}>
                  <Shield size={12} /> {roleLabel}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  @{user?.username}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Personal Information
          </h3>
          {!editing ? (
            <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
              <User size={14} /> Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-sm" onClick={() => setEditing(false)} style={{ background: 'var(--main-bg)', color: 'var(--text-secondary)' }}>
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><User size={14} /> Full Name</label>
            {editing ? (
              <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
            ) : (
              <div style={{ padding: '10px 0', fontSize: '0.9rem', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
                {form.fullName || '—'}
              </div>
            )}
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} /> Email</label>
            {editing ? (
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            ) : (
              <div style={{ padding: '10px 0', fontSize: '0.9rem', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
                {form.email || '—'}
              </div>
            )}
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={14} /> Phone</label>
            {editing ? (
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            ) : (
              <div style={{ padding: '10px 0', fontSize: '0.9rem', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
                {form.phone || '—'}
              </div>
            )}
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={14} /> Department</label>
            {editing ? (
              <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
            ) : (
              <div style={{ padding: '10px 0', fontSize: '0.9rem', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
                {form.department || '—'}
              </div>
            )}
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Briefcase size={14} /> Position</label>
            {editing ? (
              <input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
            ) : (
              <div style={{ padding: '10px 0', fontSize: '0.9rem', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
                {form.position || '—'}
              </div>
            )}
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Shield size={14} /> Role</label>
            <div style={{ padding: '10px 0', fontSize: '0.9rem', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 8px', borderRadius: 6, fontSize: '0.78rem',
                fontWeight: 600, background: roleStyle.bg, color: roleStyle.color
              }}>
                {roleLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 20 }}>
          Change Password
        </h3>
        {pwSaved && (
          <div style={{ background: 'var(--success-light)', color: '#059669', padding: '10px 16px', borderRadius: 10, fontSize: '0.84rem', marginBottom: 16, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={16} /> Password updated successfully
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Key size={14} /> Current Password</label>
            <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} placeholder="Enter current password" />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Key size={14} /> New Password</label>
            <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="Enter new password" />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Key size={14} /> Confirm Password</label>
            <input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} placeholder="Confirm new password" />
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={handlePasswordChange}
          disabled={changingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
          style={{ marginTop: 8 }}
        >
          {changingPassword ? 'Updating...' : <><Key size={14} /> Update Password</>}
        </button>
      </div>
    </div>
  )
}
