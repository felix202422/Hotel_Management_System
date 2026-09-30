import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Wraps page content with an enter animation that replays on every route change.
 * Also scrolls to top on navigation.
 */
export default function PageTransition({ children, className = '' }) {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <div key={location.pathname} className={`page-enter ${className}`.trim()}>
      {children}
    </div>
  )
}
