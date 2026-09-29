import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'framer-motion'

/** Endless typographic ribbon whose speed & skew react to how hard you scroll. */
function Row({ children, base = 3, dir = 1 }) {
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(vel, [-2000, 0, 2000], [-4, 0, 4], { clamp: false })
  const skew = useTransform(vel, [-2500, 2500], [12, -12])
  const pos = useTransform(x, (v) => `${wrap(-50, 0, v)}%`)
  const d = useRef(dir)

  useAnimationFrame((_, delta) => {
    const f = factor.get()
    if (f < -0.05) d.current = -dir
    else if (f > 0.05) d.current = dir
    const move = base * (delta / 1000) * d.current * (1 + Math.abs(f))
    x.set(x.get() + move)
  })

  return (
    <div className="marquee__row">
      <motion.div className="marquee__inner" style={{ x: pos, skewX: skew }}>
        {children}
        {children}
      </motion.div>
    </div>
  )
}

const A = ['Patience', 'Golden hour', 'Wings', 'Stillness', 'Blooms', 'Copper moons']
const B = ['Available for commissions', 'Prints & licensing', 'Wildlife', 'Macro', 'Nature']

export default function Marquee() {
  return (
    <section className="marquee" aria-hidden="true">
      <Row base={2.2} dir={-1}>
        <span className="marquee__set">
          {A.map((t) => (
            <span key={t}>
              <em>{t}</em>
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /></svg>
            </span>
          ))}
        </span>
      </Row>
      <Row base={1.6} dir={1}>
        <span className="marquee__set marquee__set--outline">
          {B.map((t) => (
            <span key={t}>
              {t}
              <b>✦</b>
            </span>
          ))}
        </span>
      </Row>
    </section>
  )
}
