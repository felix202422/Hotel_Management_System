import { useEffect, useRef, useState } from 'react'

/**
 * Reveals children when scrolled into view using IntersectionObserver.
 * Pairs with the .reveal / .is-visible CSS classes.
 *
 * <Reveal variant="left" delay={100}><Card/></Reveal>
 */
export default function Reveal({ children, variant = '', delay = 0, className = '', as: Tag = 'div', ...rest }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Reveal when entering the viewport OR when already scrolled past
        // (fast scrolls can jump an element from below-viewport to
        // above-viewport without ever reporting isIntersecting).
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const cls = `reveal ${variant ? `reveal-${variant}` : ''} ${visible ? 'is-visible' : ''} ${className}`.trim()

  return (
    <Tag ref={ref} className={cls} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}
