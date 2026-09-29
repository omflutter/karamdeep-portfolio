import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { byCat, chapters } from '../data/photos'

/**
 * A pinned, horizontally scrolling "field journal".
 * Vertical scroll drives the strip sideways through four chapters;
 * every print has its own inner parallax and the ambient glow
 * shifts to each chapter's colour.
 */
export default function Chapters({ onOpen }) {
  const section = useRef(null)
  const track = useRef(null)
  const sticky = useRef(null)
  const [dist, setDist] = useState(0)

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const eased = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 })
  const x = useTransform(eased, [0, 1], [0, -dist])
  const glow = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    chapters.map((c) => c.hue).concat(chapters[3].hue)
  )
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section
      id="chapters"
      className="chapters"
      ref={section}
      style={{ height: `calc(100vh + ${dist}px)` }}
    >
      <div className="chapters__sticky" ref={sticky}>
        <motion.div className="chapters__glow" style={{ background: glow }} />
        <div className="chapters__head">
          <span className="section-tag">
            <span>01</span> Field Journal
          </span>
          <div className="chapters__progress">
            <motion.i style={{ width: bar }} />
          </div>
        </div>
        <motion.div className="chapters__track" ref={track} style={{ x }}>
          <div className="chapters__intro">
            <h2>
              Four<br />
              <em>chapters</em>
              <br />
              of one day.
            </h2>
            <p>Keep scrolling — the journal turns its own pages.</p>
          </div>
          {chapters.map((c) => (
            <Chapter key={c.key} c={c} x={x} onOpen={onOpen} root={sticky} />
          ))}
          <div className="chapters__end">
            <span>fin.</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Chapter({ c, x, onOpen, root }) {
  const list = byCat(c.key)
  return (
    <div className="chapter">
      <div className="chapter__title" style={{ '--hue': c.hue }}>
        <span className="chapter__roman">{c.roman}</span>
        <h3>{c.name}</h3>
        <p>{c.line}</p>
        <span className="chapter__count">{String(list.length).padStart(2, '0')} frames</span>
      </div>
      {list.map((p, i) => (
        <Print key={p.id} p={p} i={i} x={x} onOpen={onOpen} root={root} />
      ))}
    </div>
  )
}

function Print({ p, i, x, onOpen, root }) {
  // inner image drifts against the strip movement → depth
  const inner = useTransform(x, (v) => `${Math.sin(v / 700 + i * 1.3) * 6}%`)
  const tall = p.ratio < 1
  return (
    <motion.figure
      className={`print ${tall ? 'print--tall' : 'print--wide'}`}
      style={{ marginTop: i % 2 ? '8vh' : '0', '--ar': p.ratio }}
      initial="hide"
      whileInView="show"
      viewport={{ once: true, amount: 0.05, root }}
    >
      <motion.button
        className="print__btn"
        variants={{ hide: { clipPath: 'inset(100% 0% 0% 0%)' }, show: { clipPath: 'inset(0% 0% 0% 0%)' } }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        onClick={() => onOpen(p)}
        data-cursor="View"
        aria-label={`Open ${p.title}`}
      >
        <motion.img src={p.src} alt={p.caption} loading="lazy" style={{ x: inner, scale: 1.22 }} />
      </motion.button>
      <figcaption>
        <span>N° {p.n}</span>
        <strong>{p.title}</strong>
      </figcaption>
    </motion.figure>
  )
}
