import { motion, useScroll, useSpring } from 'framer-motion'
import { PROFILE_URL } from '../data/photos'

const links = [
  ['Chapters', '#chapters'],
  ['Darkroom', '#darkroom'],
  ['Archive', '#archive'],
  ['About', '#about'],
  ['Contact', '#contact'],
]

export default function Nav({ ready }) {
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  const go = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: 0, duration: 1.6 })
    else el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      className="nav"
      initial={{ y: -80, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : {}}
      transition={{ delay: 1.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <a href="#top" className="nav__logo" onClick={(e) => go(e, '#top')} data-cursor="Top">
        <svg viewBox="0 0 40 40" className="nav__mark">
          <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <motion.circle
            cx="20" cy="20" r="17" fill="none" stroke="var(--sun)" strokeWidth="2"
            style={{ pathLength: p, rotate: -90, transformOrigin: 'center' }}
          />
          <circle cx="20" cy="20" r="4" fill="var(--sun)" />
        </svg>
        <span>K<em>S</em></span>
      </a>
      <nav className="nav__links">
        {links.map(([t, h]) => (
          <a key={h} href={h} onClick={(e) => go(e, h)} data-cursor={t}>
            <span data-text={t}>{t}</span>
          </a>
        ))}
      </nav>
      <a className="nav__cta" href={PROFILE_URL} target="_blank" rel="noreferrer" data-cursor="Unsplash ↗">
        Unsplash ↗
      </a>
    </motion.header>
  )
}
