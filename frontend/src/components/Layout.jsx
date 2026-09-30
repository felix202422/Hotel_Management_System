import { useState } from 'react'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import Header from './Header'
import './Layout.css'

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const toggle = () => setCollapsed((c) => !c)

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} />
      <div className={`main-area${collapsed ? ' expanded' : ''}`}>
        <Header toggleSidebar={toggle} collapsed={collapsed} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
