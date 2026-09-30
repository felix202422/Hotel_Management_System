import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Hotel, Eye, EyeOff } from 'lucide-react'
import api from '../api/axios'
import './Login.css'

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    nationality: '',
    address: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await api.post('/guest-auth/register', form)
      const data = res.data
      const userData = {
        token: data.token,
        username: data.username,
        role: data.role || 'GUEST',
        id: data.id,
        fullName: data.fullName || `${form.firstName} ${form.lastName}`,
        email: data.email || form.email,
        department: '',
        position: '',
      }
      localStorage.setItem('token', userData.token)
      localStorage.setItem('user', JSON.stringify(userData))
      setSuccess('Account created! Redirecting to your dashboard...')
      setTimeout(() => navigate('/guest/dashboard', { replace: true }), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card" style={{ width: 460 }}>
        <div className="login-header">
          <div className="login-icon"><Hotel size={28} /></div>
          <h1>Create Account</h1>
          <p>Register as a guest at Hasmir Hotels</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          {success && (
            <div style={{ background: '#ecfdf5', color: '#059669', padding: '12px 16px', borderRadius: 12, fontSize: '0.85rem', marginBottom: 16, textAlign: 'center', border: '1px solid #a7f3d0' }}>
              {success}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
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
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className="form-group">
            <label>Nationality</label>
            <input
              type="text"
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
              placeholder="Enter your nationality"
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <Link to="/" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 500 }}>
            ← Back to Hotel Website
          </Link>
        </div>
      </div>
    </div>
  )
}
