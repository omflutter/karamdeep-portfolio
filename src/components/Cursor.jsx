import { useEffect, useRef, useState } from 'react'

const SPEEDS = ['1/30', '1/60', '1/125', '1/250', '1/500', '1/1000', '1/2000', '1/4000']

/**
 * Viewfinder cursor: four focus brackets that trail the pointer,
 * snap tight on anything focusable, and read out a "shutter speed"
 * that climbs the faster you move.
 */
export default function Cursor() {
  const box = useRef(null)
  const dot = useRef(null)
  const [label, setLabel] = useState('')
  const [active, setActive] = useState(false)
  const [speed, setSpeed] = useState('1/125')
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setEnabled(fine)
    if (!fine) return
    document.documentElement.classList.add('has-cursor')

    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const target = { ...pos }
    let last = { ...pos }
    let v = 0
    let raf

    const move = (e) => {
      target.x = e.clientX
      target.y = e.clientY
      const el = e.target.closest?.('[data-cursor]')
      setActive(!!el)
      setLabel(el ? el.getAttribute('data-cursor') : '')
    }
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.18
      pos.y += (target.y - pos.y) * 0.18
      const d = Math.hypot(target.x - last.x, target.y - last.y)
      last = { ...target }
      v = v * 0.9 + d * 0.1
      if (box.current) box.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      if (dot.current) dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    const sp = setInterval(() => setSpeed(SPEEDS[Math.min(SPEEDS.length - 1, Math.floor(v / 4))]), 120)
    window.addEventListener('pointermove', move, { passive: true })
    loop()
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(sp)
      window.removeEventListener('pointermove', move)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  if (!enabled) return null
  return (
    <>
      <div ref={box} className={`vf ${active ? 'vf--on' : ''}`} aria-hidden="true">
        <div className="vf__frame">
          <i /><i /><i /><i />
        </div>
        <div className="vf__label">{label || speed}</div>
      </div>
      <div ref={dot} className="vf-dot" aria-hidden="true" />
    </>
  )
}
