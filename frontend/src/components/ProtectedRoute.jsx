import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (roles && !roles.includes(user.role)) {
    const redirect = ROLE_ROUTES[user.role] || '/login'
    return <Navigate to={redirect} replace />
  }

  return children
}

export function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  const redirect = ROLE_ROUTES[user.role] || '/login'
  return <Navigate to={redirect} replace />
}
