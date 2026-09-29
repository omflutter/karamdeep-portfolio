import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { photos } from '../data/photos'

const STOPS = ['f/22', 'f/16', 'f/11', 'f/8', 'f/5.6', 'f/4', 'f/2.8', 'f/1.8', 'f/1.4']

/** A camera aperture that slowly opens while the first frames load, then the shutter fires. */
export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [flash, setFlash] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    // warm the cache with the hero frames
    photos.slice(0, 6).forEach((p) => {
      const i = new Image()
      i.src = p.src
    })
    const start = performance.now()
    const D = 2400
    let raf
    const tick = (now) => {
      const t = Math.min(1, (now - start) / D)
      const e = 1 - Math.pow(1 - t, 2.2)
      setPct(Math.round(e * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else {
        setFlash(true)
        setTimeout(() => {
          setGone(true)
          onDone?.()
        }, 380)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  const r = 4 + (pct / 100) * 118 // opening radius
  const twist = (1 - pct / 100) * 38
  const stop = STOPS[Math.min(STOPS.length - 1, Math.floor((pct / 100) * STOPS.length))]

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="loader"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="loader__ring">
            <svg viewBox="-130 -130 260 260" className="aperture" aria-hidden="true">
              <defs>
                <clipPath id="lens">
                  <circle r="120" />
                </clipPath>
                <radialGradient id="glass" r="0.7">
                  <stop offset="0" stopColor="#f2b544" stopOpacity=".55" />
                  <stop offset=".6" stopColor="#7a3b10" stopOpacity=".25" />
                  <stop offset="1" stopColor="#000" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle r="120" fill="url(#glass)" />
              <g clipPath="url(#lens)">
                {Array.from({ length: 8 }).map((_, i) => (
                  <g key={i} transform={`rotate(${i * 45 + twist})`}>
                    <rect x="-60" y={r} width="320" height="260" fill="#16130f" stroke="#3b3228" strokeWidth="1.2" />
                  </g>
                ))}
              </g>
              <circle r="120" fill="none" stroke="#3b3228" strokeWidth="2" />
              <circle r="127" fill="none" stroke="#f2b544" strokeOpacity=".35" strokeDasharray="2 6" />
            </svg>
            <div className="loader__stop">{stop}</div>
          </div>

          <div className="loader__meta">
            <span>Karamdeep Singh</span>
            <span>Metering light…</span>
          </div>
          <div className="loader__count">
            {String(pct).padStart(3, '0')}
            <small>%</small>
          </div>
          <div className="loader__bar">
            <span style={{ transform: `scaleX(${pct / 100})` }} />
          </div>
          {flash && <div className="loader__flash" />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
