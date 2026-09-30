import { Component } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import RoleBasedLayout from './components/RoleBasedLayout'
import VisitorLayout from './pages/visitor/VisitorLayout'

import Login from './pages/Login'
import Register from './pages/Register'

// Visitor Pages
import VisitorHome from './pages/visitor/VisitorHome'
import VisitorRooms from './pages/visitor/VisitorRooms'
import VisitorRoomDetail from './pages/visitor/VisitorRoomDetail'
import VisitorServices from './pages/visitor/VisitorServices'
import VisitorAbout from './pages/visitor/VisitorAbout'
import VisitorContact from './pages/visitor/VisitorContact'
import VisitorBooking from './pages/visitor/VisitorBooking'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminRooms from './pages/admin/AdminRooms'
import AdminGuests from './pages/admin/AdminGuests'
import AdminReservations from './pages/admin/AdminReservations'
import AdminPayments from './pages/admin/AdminPayments'
import AdminHousekeeping from './pages/admin/AdminHousekeeping'
import AdminMaintenance from './pages/admin/AdminMaintenance'
import AdminStaff from './pages/admin/AdminStaff'
import AdminReports from './pages/admin/AdminReports'
import AdminAuditLog from './pages/admin/AdminAuditLog'
import AdminSettings from './pages/admin/AdminSettings'

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard'
import ManagerReservations from './pages/manager/ManagerReservations'
import ManagerGuests from './pages/manager/ManagerGuests'
import ManagerRooms from './pages/manager/ManagerRooms'
import ManagerHousekeeping from './pages/manager/ManagerHousekeeping'
import ManagerMaintenance from './pages/manager/ManagerMaintenance'
import ManagerStaff from './pages/manager/ManagerStaff'
import ManagerPayments from './pages/manager/ManagerPayments'
import ManagerReports from './pages/manager/ManagerReports'
import ManagerNotifications from './pages/manager/ManagerNotifications'

// Secretary Pages
import SecretaryDashboard from './pages/secretary/SecretaryDashboard'
import SecretaryReservations from './pages/secretary/SecretaryReservations'
import SecretaryNewReservation from './pages/secretary/SecretaryNewReservation'
import SecretaryGuests from './pages/secretary/SecretaryGuests'
import SecretaryCheckin from './pages/secretary/SecretaryCheckin'
import SecretaryCheckout from './pages/secretary/SecretaryCheckout'
import SecretaryRooms from './pages/secretary/SecretaryRooms'
import SecretaryPayments from './pages/secretary/SecretaryPayments'
import SecretaryNotifications from './pages/secretary/SecretaryNotifications'

// Housekeeping Pages
import HousekeepingDashboard from './pages/housekeeping/HousekeepingDashboard'
import HousekeepingRooms from './pages/housekeeping/HousekeepingRooms'
import HousekeepingTasks from './pages/housekeeping/HousekeepingTasks'
import HousekeepingStatus from './pages/housekeeping/HousekeepingStatus'
import HousekeepingHistory from './pages/housekeeping/HousekeepingHistory'
import HousekeepingNotifications from './pages/housekeeping/HousekeepingNotifications'

// Accountant Pages
import AccountantDashboard from './pages/accountant/AccountantDashboard'
import AccountantPayments from './pages/accountant/AccountantPayments'
import AccountantInvoices from './pages/accountant/AccountantInvoices'
import AccountantRevenue from './pages/accountant/AccountantRevenue'
import AccountantExpenses from './pages/accountant/AccountantExpenses'
import AccountantTransactions from './pages/accountant/AccountantTransactions'
import AccountantReports from './pages/accountant/AccountantReports'

// Maintenance Pages
import MaintenanceDashboard from './pages/maintenance/MaintenanceDashboard'
import MaintenanceRequests from './pages/maintenance/MaintenanceRequests'
import MaintenanceTasks from './pages/maintenance/MaintenanceTasks'
import MaintenanceRooms from './pages/maintenance/MaintenanceRooms'
import MaintenanceEquipment from './pages/maintenance/MaintenanceEquipment'
import MaintenanceHistory from './pages/maintenance/MaintenanceHistory'
import MaintenanceNotifications from './pages/maintenance/MaintenanceNotifications'

// Guest Pages
import GuestDashboard from './pages/guest/GuestDashboard'
import GuestBooking from './pages/guest/GuestBooking'
import GuestRooms from './pages/guest/GuestRooms'
import GuestProfile from './pages/guest/GuestProfile'

// Shared Profile
import Profile from './components/Profile'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace' }}>
          <h1 style={{ color: '#EF4444' }}>Something went wrong</h1>
          <pre style={{ background: '#f3f4f6', padding: 16, borderRadius: 8, overflow: 'auto' }}>
            {this.state.error?.message}
          </pre>
          <pre style={{ background: '#f3f4f6', padding: 16, borderRadius: 8, overflow: 'auto', fontSize: '0.8rem', marginTop: 12 }}>
            {this.state.error?.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

function LoginRedirect() {
  const { user } = useAuth()
  if (user) {
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
    const redirect = ROLE_ROUTES[user.role]
    if (redirect) return <Navigate to={redirect} replace />
  }
  return <Login />
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginRedirect />} />
          <Route path="/register" element={<Register />} />

          {/* Visitor Portal */}
          <Route path="/" element={<VisitorLayout />}>
            <Route index element={<VisitorHome />} />
            <Route path="rooms" element={<VisitorRooms />} />
            <Route path="rooms/:id" element={<VisitorRoomDetail />} />
            <Route path="services" element={<VisitorServices />} />
            <Route path="about" element={<VisitorAbout />} />
            <Route path="contact" element={<VisitorContact />} />
            <Route path="my-booking" element={<VisitorBooking />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><RoleBasedLayout role="ADMIN" /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="guests" element={<AdminGuests />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="housekeeping" element={<AdminHousekeeping />} />
            <Route path="maintenance" element={<AdminMaintenance />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="audit" element={<AdminAuditLog />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Manager Routes */}
          <Route path="/manager" element={<ProtectedRoute roles={['MANAGER', 'ADMIN']}><RoleBasedLayout role="MANAGER" /></ProtectedRoute>}>
            <Route index element={<Navigate to="/manager/dashboard" replace />} />
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="reservations" element={<ManagerReservations />} />
            <Route path="guests" element={<ManagerGuests />} />
            <Route path="rooms" element={<ManagerRooms />} />
            <Route path="housekeeping" element={<ManagerHousekeeping />} />
            <Route path="maintenance" element={<ManagerMaintenance />} />
            <Route path="staff" element={<ManagerStaff />} />
            <Route path="payments" element={<ManagerPayments />} />
            <Route path="reports" element={<ManagerReports />} />
            <Route path="notifications" element={<ManagerNotifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Secretary Routes */}
          <Route path="/secretary" element={<ProtectedRoute roles={['SECRETARY', 'ADMIN']}><RoleBasedLayout role="SECRETARY" /></ProtectedRoute>}>
            <Route index element={<Navigate to="/secretary/dashboard" replace />} />
            <Route path="dashboard" element={<SecretaryDashboard />} />
            <Route path="reservations" element={<SecretaryReservations />} />
            <Route path="new-reservation" element={<SecretaryNewReservation />} />
            <Route path="guests" element={<SecretaryGuests />} />
            <Route path="checkin" element={<SecretaryCheckin />} />
            <Route path="checkout" element={<SecretaryCheckout />} />
            <Route path="rooms" element={<SecretaryRooms />} />
            <Route path="payments" element={<SecretaryPayments />} />
            <Route path="notifications" element={<SecretaryNotifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Housekeeping Routes */}
          <Route path="/housekeeping" element={<ProtectedRoute roles={['HOUSEKEEPER', 'HOUSEKEEPING_STAFF', 'ADMIN']}><RoleBasedLayout role="HOUSEKEEPING" /></ProtectedRoute>}>
            <Route index element={<Navigate to="/housekeeping/dashboard" replace />} />
            <Route path="dashboard" element={<HousekeepingDashboard />} />
            <Route path="rooms" element={<HousekeepingRooms />} />
            <Route path="tasks" element={<HousekeepingTasks />} />
            <Route path="status" element={<HousekeepingStatus />} />
            <Route path="history" element={<HousekeepingHistory />} />
            <Route path="notifications" element={<HousekeepingNotifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Accountant Routes */}
          <Route path="/accountant" element={<ProtectedRoute roles={['ACCOUNTANT', 'ADMIN']}><RoleBasedLayout role="ACCOUNTANT" /></ProtectedRoute>}>
            <Route index element={<Navigate to="/accountant/dashboard" replace />} />
            <Route path="dashboard" element={<AccountantDashboard />} />
            <Route path="payments" element={<AccountantPayments />} />
            <Route path="invoices" element={<AccountantInvoices />} />
            <Route path="revenue" element={<AccountantRevenue />} />
            <Route path="expenses" element={<AccountantExpenses />} />
            <Route path="transactions" element={<AccountantTransactions />} />
            <Route path="reports" element={<AccountantReports />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Maintenance Routes */}
          <Route path="/maintenance" element={<ProtectedRoute roles={['MAINTENANCE', 'MAINTENANCE_STAFF', 'ADMIN']}><RoleBasedLayout role="MAINTENANCE" /></ProtectedRoute>}>
            <Route index element={<Navigate to="/maintenance/dashboard" replace />} />
            <Route path="dashboard" element={<MaintenanceDashboard />} />
            <Route path="requests" element={<MaintenanceRequests />} />
            <Route path="tasks" element={<MaintenanceTasks />} />
            <Route path="rooms" element={<MaintenanceRooms />} />
            <Route path="equipment" element={<MaintenanceEquipment />} />
            <Route path="history" element={<MaintenanceHistory />} />
            <Route path="notifications" element={<MaintenanceNotifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Guest Routes */}
          <Route path="/guest" element={<ProtectedRoute roles={['GUEST']}><RoleBasedLayout role="GUEST" /></ProtectedRoute>}>
            <Route index element={<Navigate to="/guest/dashboard" replace />} />
            <Route path="dashboard" element={<GuestDashboard />} />
            <Route path="booking" element={<GuestBooking />} />
            <Route path="rooms" element={<GuestRooms />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  )
}
