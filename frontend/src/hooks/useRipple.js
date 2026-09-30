import { useEffect } from 'react'

/**
 * Global ripple effect: attaches a material-style click ripple to every
 * element with the .ripple class (event delegation on document).
 * Elements inside dark backgrounds use .ripple (white wave);
 * on light backgrounds add .ripple-ink for a blue wave.
 */
export default function useRipple() {
  useEffect(() => {
    const handler = (e) => {
      const target = e.target.closest('.ripple')
      if (!target) return

      const rect = target.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const wave = document.createElement('span')
      wave.className = 'ripple-wave'
      wave.style.width = wave.style.height = `${size}px`
      wave.style.left = `${e.clientX - rect.left - size / 2}px`
      wave.style.top = `${e.clientY - rect.top - size / 2}px`
      target.appendChild(wave)
      setTimeout(() => wave.remove(), 700)
    }

    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])
}
