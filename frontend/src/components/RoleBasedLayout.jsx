import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import RoleBasedSidebar from './RoleBasedSidebar'
import Header from './Header'
import './Layout.css'

export default function RoleBasedLayout({ role }) {
  const [collapsed, setCollapsed] = useState(false)
  const toggle = () => setCollapsed((c) => !c)

  return (
    <div className="app-layout">
      <RoleBasedSidebar collapsed={collapsed} role={role} />
      <div className={`main-area${collapsed ? ' expanded' : ''}`}>
        <Header toggleSidebar={toggle} collapsed={collapsed} role={role} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
