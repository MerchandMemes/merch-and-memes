'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`
      requestAnimationFrame(animate)
    }

    const handleEnter = () => {
      dot.style.transform += ' scale(2.5)'
      dot.style.boxShadow = '0 0 20px rgba(98,126,234,0.8), 0 0 40px rgba(220,31,255,0.4)'
    }

    const handleLeave = () => {
      dot.style.boxShadow = '0 0 10px rgba(98,126,234,0.6)'
    }

    window.addEventListener('mousemove', handleMove)
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', handleEnter)
      el.addEventListener('mouseleave', handleLeave)
    })

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMove)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #627EEA, #DC1FFF)',
          boxShadow: '0 0 10px rgba(98,126,234,0.6)',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'box-shadow 0.2s',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '1px solid #627EEA',
          opacity: 0.4,
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />
    </>
  )
}