import { useEffect, useState, useRef } from 'react'

/**
 * Animated count-up number. Counts from 0 to `end` when scrolled into view.
 *
 * <CountUp end={150} suffix="+" duration={1600} />
 */
export default function CountUp({ end, duration = 1500, prefix = '', suffix = '', decimals = 0, className = '' }) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if ((entry.isIntersecting || entry.boundingClientRect.top < 0) && !started.current) {
          started.current = true
          const t0 = performance.now()
          const tick = (now) => {
            const p = Math.min((now - t0) / duration, 1)
            // easeOutCubic
            const eased = 1 - Math.pow(1 - p, 3)
            setValue(end * eased)
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref} className={`count-up ${className}`.trim()}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
