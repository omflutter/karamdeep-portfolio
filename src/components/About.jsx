import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion'
import { photos, chapters, PROFILE_URL } from '../data/photos'

const AVATAR = 'https://images.unsplash.com/profile-1783574302399-f5ef49079431image?w=600&h=600&fit=crop&q=80'
const pick = (id) => photos.find((p) => p.id.startsWith(id))

const SERVICES = [
  { t: 'Wildlife & Birds', d: 'Field sessions built on patience and quiet.', p: pick('1775955210680') },
  { t: 'Nature & Macro', d: 'Petals, wings and the details in between.', p: pick('1787388625713') },
  { t: 'Prints & Licensing', d: 'Gallery-grade prints and image licensing.', p: pick('1781876030873') },
  { t: 'Commissions', d: 'Editorial, brand and conservation stories.', p: pick('1783351216896') },
]

function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const s = performance.now()
    let raf
    const f = (n) => {
      const t = Math.min(1, (n - s) / 1600)
      setV(Math.round(to * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(f)
    }
    raf = requestAnimationFrame(f)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return (
    <span ref={ref}>
      {String(v).padStart(2, '0')}
      {suffix}
    </span>
  )
}

export default function About() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rot = useTransform(scrollYProgress, [0, 1], [-8, 8])
  const ringRot = useTransform(scrollYProgress, [0, 1], [0, 220])

  const [hover, setHover] = useState(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const fx = useSpring(mx, { stiffness: 200, damping: 22 })
  const fy = useSpring(my, { stiffness: 200, damping: 22 })

  return (
    <section className="about" id="about" ref={ref}>
      <span className="section-tag">
        <span>04</span> Behind the lens
      </span>
      <div className="about__grid">
        <div className="about__portrait">
          <motion.svg className="about__ring" viewBox="0 0 200 200" style={{ rotate: ringRot }}>
            <defs>
              <path id="circ" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
            </defs>
            <text>
              <textPath href="#circ">KARAMDEEP SINGH · PHOTOGRAPHER · CHASING LIGHT · </textPath>
            </text>
          </motion.svg>
          <motion.img src={AVATAR} alt="Portrait of Karamdeep Singh" style={{ rotate: rot }} />
        </div>

        <div className="about__copy">
          <h2>
            A quiet eye for <em>loud colour.</em>
          </h2>
          <p>
            Karamdeep Singh is a nature and wildlife photographer drawn to the moments most people walk
            past — the weaver stitching its nest, the hoopoe raising its crown, a squirrel pausing on a
            rusted roof. His frames lean into saturated colour against deep, quiet darkness, letting a
            single subject glow.
          </p>
          <p>
            From sun-shot silhouettes to copper-coloured moons, his work is about one thing: showing up
            early, staying late, and waiting for the light to say yes.
          </p>
          <div className="about__stats">
            <div>
              <Counter to={photos.length} />
              <small>Published frames</small>
            </div>
            <div>
              <Counter to={chapters.length} />
              <small>Chapters</small>
            </div>
            <div>
              <span>∞</span>
              <small>Patience</small>
            </div>
          </div>
          <a className="link-arrow" href={PROFILE_URL} target="_blank" rel="noreferrer" data-cursor="Unsplash ↗">
            Full profile on Unsplash <span>↗</span>
          </a>
        </div>
      </div>

      <div
        className="services"
        onPointerMove={(e) => {
          mx.set(e.clientX)
          my.set(e.clientY)
        }}
        onPointerLeave={() => setHover(null)}
      >
        {SERVICES.map((s, i) => (
          <div key={s.t} className="service" onPointerEnter={() => setHover(i)} data-cursor="✦">
            <span className="service__n">0{i + 1}</span>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </div>
        ))}
        <AnimatePresence>
          {hover !== null && (
            <motion.div
              className="service__float"
              style={{ left: fx, top: fy }}
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 4 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.35 }}
            >
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={hover}
                  src={SERVICES[hover].p.thumb}
                  alt=""
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '-100%' }}
                  transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                />
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
