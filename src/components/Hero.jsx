import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { photos } from '../data/photos'

const pick = (id) => photos.find((p) => p.id.startsWith(id))
// fanned "contact prints" around the hero
const CARDS = [
  { p: pick('1775955210680'), x: -34, y: -6, r: -12, z: 1, s: 0.78 }, // hoopoe
  { p: pick('1787051067254'), x: 33, y: -10, r: 9, z: 1, s: 0.74 }, // chrysanthemum
  { p: pick('1787387726284'), x: -20, y: 16, r: -4, z: 2, s: 0.8 }, // caged sun
  { p: pick('1787050595467'), x: 21, y: 18, r: 6, z: 2, s: 0.82 }, // calico
  { p: pick('1783682143923'), x: 0, y: 2, r: 0, z: 3, s: 1 }, // weaver — hero
]

const ease = [0.22, 1, 0.36, 1]

function Letters({ text, delay = 0, className }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span className="ch-mask" key={i} aria-hidden="true">
          <motion.span
            className="ch"
            initial={{ y: '110%', rotate: 8 }}
            animate={{ y: '0%', rotate: 0 }}
            transition={{ delay: delay + i * 0.045, duration: 1.1, ease }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export default function Hero({ ready, onOpen }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })
  const rotY = useTransform(sx, [-1, 1], [10, -10])
  const rotX = useTransform(sy, [-1, 1], [-8, 8])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const spread = useTransform(scrollYProgress, [0, 1], [1, 2.3])
  const lift = useTransform(scrollYProgress, [0, 1], [0, -180])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 260])

  useEffect(() => {
    const onMove = (e) => {
      mx.set((e.clientX / innerWidth) * 2 - 1)
      my.set((e.clientY / innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my])

  return (
    <section className="hero" id="top" ref={ref}>
      <motion.div className="hero__stage" style={{ rotateX: rotX, rotateY: rotY, y: lift, opacity: fade }}>
        {CARDS.map((c, i) => (
          <Card key={c.p.id} c={c} i={i} ready={ready} spread={spread} sx={sx} sy={sy} onOpen={onOpen} />
        ))}
      </motion.div>

      <motion.div className="hero__title" style={{ y: titleY }}>
        {ready && (
          <>
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1, ease }}
            >
              <span className="rec" /> Wildlife · Nature · Light
            </motion.p>
            <h1>
              <Letters text="Karamdeep" delay={0.25} className="h1-a" />
              <Letters text="Singh" delay={0.6} className="h1-b" />
            </h1>
          </>
        )}
      </motion.div>

      <motion.div
        className="hero__foot"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <p>
          Chasing light across <em>wings</em>, <em>blooms</em>,<br />
          burning suns &amp; quiet copper moons.
        </p>
        <div className="scroll-cue">
          <span>Scroll to begin the day</span>
          <i />
        </div>
        <div className="hero__exif">
          <span>ISO 200</span>
          <span>f/5.6</span>
          <span>1/1000s</span>
          <span>{photos.length} frames</span>
        </div>
      </motion.div>
    </section>
  )
}

function Card({ c, i, ready, spread, sx, sy, onOpen }) {
  const x = useTransform(spread, (s) => `${c.x * s}vw`)
  const y = useTransform(spread, (s) => `${c.y * s}vh`)
  const px = useTransform(sx, (v) => v * c.z * -14)
  const py = useTransform(sy, (v) => v * c.z * -10)
  return (
    <motion.div className="hero__card-pos" style={{ x, y, zIndex: c.z * 10 }}>
      <motion.button
        className="hero__card"
        style={{ x: px, y: py, width: `calc(var(--card) * ${c.s})`, aspectRatio: c.p.ratio }}
        initial={{ opacity: 0, scale: 0.6, rotate: c.r * 3, y: 120 }}
        animate={ready ? { opacity: 1, scale: 1, rotate: c.r, y: 0 } : {}}
        transition={{ delay: 0.15 + (4 - i) * 0.12, duration: 1.4, ease }}
        whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
        onClick={() => onOpen(c.p)}
        data-cursor="Open"
        aria-label={`Open ${c.p.title}`}
      >
        <img src={c.p.src} alt={c.p.caption} />
        {c.z === 3 && <span className="hero__card-tag">N° {c.p.n} — {c.p.title}</span>}
      </motion.button>
    </motion.div>
  )
}
