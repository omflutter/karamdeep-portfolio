import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion'
import { CONTACT_EMAIL, INSTAGRAM_URL, PROFILE_URL, photos } from '../data/photos'

function Magnetic({ children, className, ...rest }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 14 })
  const sy = useSpring(y, { stiffness: 180, damping: 14 })
  return (
    <motion.a
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * 0.35)
        y.set((e.clientY - r.top - r.height / 2) * 0.35)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      {...rest}
    >
      {children}
    </motion.a>
  )
}

export default function Contact() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1])
  const letter = useTransform(scrollYProgress, [0, 1], ['0.3em', '-0.02em'])
  const strip = photos.slice().reverse()

  return (
    <section className="contact" id="contact" ref={ref}>
      <div className="contact__film" aria-hidden="true">
        <div className="contact__film-inner">
          {strip.concat(strip).map((p, i) => (
            <img key={i} src={p.thumb} alt="" loading="lazy" />
          ))}
        </div>
      </div>

      <span className="section-tag">
        <span>05</span> Night falls
      </span>
      <motion.h2 style={{ scale, letterSpacing: letter }}>
        Let’s chase <em>some light.</em>
      </motion.h2>
      <p className="contact__sub">
        Commissions, print enquiries, licensing or just a conversation about birds — the moon is up, the
        inbox is open.
      </p>

      <div className="contact__cta">
        <Magnetic className="btn-orb" href={`mailto:${CONTACT_EMAIL}`} data-cursor="Say hello">
          <span>Say hello</span>
        </Magnetic>
        <div className="contact__links">
          <a href={PROFILE_URL} target="_blank" rel="noreferrer" data-cursor="↗">
            Unsplash <span>↗</span>
          </a>
          {INSTAGRAM_URL && (
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" data-cursor="↗">
              Instagram <span>↗</span>
            </a>
          )}
          <a href={`mailto:${CONTACT_EMAIL}`} data-cursor="✉">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Karamdeep Singh</span>
        <span>All photographs by Karamdeep Singh via Unsplash</span>
        <button
          onClick={() => (window.__lenis ? window.__lenis.scrollTo(0, { duration: 2.4 }) : scrollTo({ top: 0, behavior: 'smooth' }))}
          data-cursor="Sunrise"
        >
          Back to sunrise ↑
        </button>
      </footer>
    </section>
  )
}
