import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { photos } from '../data/photos'

const pick = (id) => photos.find((p) => p.id.startsWith(id))
const PLATES = [pick('1787051067254'), pick('1787050595467'), pick('1776322283369')]
const SCALE = 4 // mask canvas runs at 1/4 resolution – cheap & soft

/**
 * THE DARKROOM — the print sits in darkness under a red safelight.
 * Your cursor (or finger) is the enlarger lamp: wherever it passes,
 * the image develops permanently. Develop 70% and the print is fixed.
 */
export default function Darkroom({ onOpen }) {
  const [idx, setIdx] = useState(0)
  const [dev, setDev] = useState(0)
  const [done, setDone] = useState(false)
  const wrap = useRef(null)
  const mask = useRef(null)
  const lamp = useRef(null)
  const moves = useRef(0)
  const plate = PLATES[idx]

  const reset = useCallback(() => {
    const c = mask.current
    if (!c || !wrap.current) return
    const r = wrap.current.getBoundingClientRect()
    c.width = Math.ceil(r.width / SCALE)
    c.height = Math.ceil(r.height / SCALE)
    const ctx = c.getContext('2d')
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = '#070202'
    ctx.fillRect(0, 0, c.width, c.height)
    setDev(0)
    setDone(false)
  }, [])

  useEffect(() => {
    reset()
    let lastW = window.innerWidth
    const onResize = () => {
      if (window.innerWidth !== lastW) {
        lastW = window.innerWidth
        reset()
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [reset, idx])

  const measure = () => {
    const c = mask.current
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data
    let clear = 0
    for (let i = 3; i < d.length; i += 16) if (d[i] < 60) clear++
    const pct = Math.min(100, Math.round((clear / (d.length / 16)) * 100))
    setDev(pct)
    if (pct >= 70) setDone(true)
  }

  const paint = (e) => {
    const r = wrap.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    if (lamp.current) {
      lamp.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      lamp.current.style.opacity = 1
    }
    if (done) return
    const ctx = mask.current.getContext('2d')
    const cx = x / SCALE
    const cy = y / SCALE
    const R = Math.max(r.width, r.height) / SCALE / 7
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R)
    g.addColorStop(0, 'rgba(0,0,0,0.5)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.fill()
    if (++moves.current % 10 === 0) measure()
  }

  const developAll = () => {
    const c = mask.current
    const ctx = c.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, c.width, c.height)
    setDev(100)
    setDone(true)
  }

  return (
    <section className="darkroom" id="darkroom">
      <div className="darkroom__head">
        <span className="section-tag">
          <span>02</span> The Darkroom
        </span>
        <h2>
          Develop a print <em>with your own light.</em>
        </h2>
        <p>
          Move your cursor — or drag a finger — across the dark plate. Everywhere the lamp passes,
          the photograph comes up out of the chemistry. Develop 70% to fix it.
        </p>
        <div className="darkroom__plates">
          {PLATES.map((p, i) => (
            <button
              key={p.id}
              className={i === idx ? 'on' : ''}
              onClick={() => setIdx(i)}
              data-cursor="Load plate"
            >
              <img src={p.thumb} alt="" />
              <span>Plate {i + 1}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        className={`darkroom__plate ${done ? 'is-done' : ''}`}
        ref={wrap}
        onPointerMove={paint}
        onPointerDown={paint}
        onPointerLeave={() => lamp.current && (lamp.current.style.opacity = 0)}
        data-cursor={done ? 'Open' : 'Expose'}
        onClick={() => done && onOpen(plate)}
        style={{ aspectRatio: plate.ratio > 1 ? '3 / 2' : '4 / 5', maxWidth: plate.ratio > 1 ? '100%' : 'min(100%, calc(76vh * 0.8))' }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={plate.id}
            src={plate.src}
            alt={plate.caption}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            draggable={false}
          />
        </AnimatePresence>
        <canvas ref={mask} className="darkroom__mask" />
        <div className="darkroom__safelight" />
        <div ref={lamp} className="darkroom__lamp" />
        <AnimatePresence>
          {done && (
            <motion.div
              className="darkroom__stamp"
              initial={{ opacity: 0, scale: 1.6, rotate: -14 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              Fixed · N° {plate.n}
              <small>{plate.title}</small>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="darkroom__meter">
        <div className="darkroom__gauge">
          <span>Development</span>
          <div>
            <i style={{ width: `${dev}%` }} />
            <b style={{ left: '70%' }} />
          </div>
          <strong>{dev}%</strong>
        </div>
        <div className="darkroom__actions">
          <button onClick={developAll} data-cursor="Develop">Develop fully</button>
          <button onClick={reset} data-cursor="Reset">Back to dark</button>
        </div>
      </div>
    </section>
  )
}
