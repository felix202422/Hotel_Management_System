import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Hotel, Eye, EyeOff, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './Login.css'

const ROLE_ROUTES = {
  ADMIN: '/admin/dashboard',
  MANAGER: '/manager/dashboard',
  SECRETARY: '/secretary/dashboard',
  HOUSEKEEPER: '/housekeeping/dashboard',
  HOUSEKEEPING_STAFF: '/housekeeping/dashboard',
  ACCOUNTANT: '/accountant/dashboard',
  MAINTENANCE: '/maintenance/dashboard',
  MAINTENANCE_STAFF: '/maintenance/dashboard',
  GUEST: '/guest/dashboard',
}

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginType, setLoginType] = useState('staff')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (loginType === 'guest') {
        const res = await api.post('/guest-auth/login', { username, password })
        const data = res.data
        const userData = {
          token: data.token,
          username: data.username,
          role: data.role || 'GUEST',
          id: data.id,
          fullName: data.fullName || data.username,
          email: data.email || '',
          department: '',
          position: '',
        }
        localStorage.setItem('token', userData.token)
        localStorage.setItem('user', JSON.stringify(userData))
        navigate('/guest/dashboard', { replace: true })
      } else {
        const userData = await login(username, password)
        const redirect = ROLE_ROUTES[userData.role] || '/admin/dashboard'
        navigate(redirect, { replace: true })
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon"><Hotel size={28} /></div>
          <h1>Hasmir Hotels</h1>
          <p>Sign in to your account</p>
        </div>

        {/* Login Type Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--main-bg)', borderRadius: 10, padding: 4 }}>
          <button
            type="button"
            onClick={() => { setLoginType('staff'); setError('') }}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8, fontSize: '0.84rem', fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: loginType === 'staff' ? 'var(--card)' : 'transparent',
              color: loginType === 'staff' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: loginType === 'staff' ? 'var(--shadow-sm)' : 'none',
              fontFamily: 'inherit',
            }}
          >
            Staff / Admin
          </button>
          <button
            type="button"
            onClick={() => { setLoginType('guest'); setError('') }}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8, fontSize: '0.84rem', fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: loginType === 'guest' ? 'var(--card)' : 'transparent',
              color: loginType === 'guest' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: loginType === 'guest' ? 'var(--shadow-sm)' : 'none',
              fontFamily: 'inherit',
            }}
          >
            Guest
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          <div className="form-group">
            <label>{loginType === 'guest' ? 'Email' : 'Username'}</label>
            <input
              type={loginType === 'guest' ? 'email' : 'text'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={loginType === 'guest' ? 'Enter your email' : 'Enter username'}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)', padding: 4
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {loginType === 'guest' && (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                Register here
              </Link>
            </p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 500 }}>
            ← Back to Hotel Website
          </Link>
        </div>

        {loginType === 'staff' && (
          <div style={{ marginTop: 20, padding: 16, background: 'var(--main-bg)', borderRadius: 12, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>Demo Accounts:</p>
            <p>Admin: admin / admin123</p>
            <p>Manager: manager / manager123</p>
            <p>Secretary: secretary / secretary123</p>
          </div>
        )}
        {loginType === 'guest' && (
          <div style={{ marginTop: 20, padding: 16, background: 'var(--main-bg)', borderRadius: 12, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>New Guest?</p>
            <p>Register a new account to book rooms and manage your stays.</p>
          </div>
        )}
      </div>
    </div>
  )
}
