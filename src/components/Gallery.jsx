import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { photos, chapters } from '../data/photos'

const FILTERS = [{ key: 'all', name: 'Everything' }, ...chapters]

function useCols() {
  const get = () => (innerWidth < 640 ? 2 : innerWidth < 1100 ? 3 : 4)
  const [n, setN] = useState(get)
  useEffect(() => {
    const f = () => setN(get())
    addEventListener('resize', f)
    return () => removeEventListener('resize', f)
  }, [])
  return n
}

export default function Gallery({ onOpen }) {
  const [filter, setFilter] = useState('all')
  const n = useCols()
  const list = useMemo(() => (filter === 'all' ? photos : photos.filter((p) => p.cat === filter)), [filter])

  // shortest-column masonry so layout animations stay smooth
  const cols = useMemo(() => {
    const c = Array.from({ length: n }, () => ({ h: 0, items: [] }))
    list.forEach((p) => {
      const s = c.reduce((a, b) => (b.h < a.h ? b : a))
      s.items.push(p)
      s.h += 1 / p.ratio
    })
    return c
  }, [list, n])

  return (
    <section className="archive" id="archive">
      <div className="archive__head">
        <span className="section-tag">
          <span>03</span> The Archive
        </span>
        <h2>
          Every frame, <em>unfiltered</em> — <span className="muted">or filtered, your call.</span>
        </h2>
        <LayoutGroup>
          <div className="chips" role="tablist">
            {FILTERS.map((f) => {
              const count = f.key === 'all' ? photos.length : photos.filter((p) => p.cat === f.key).length
              return (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={filter === f.key}
                  className={filter === f.key ? 'on' : ''}
                  onClick={() => setFilter(f.key)}
                  data-cursor={f.name}
                >
                  {filter === f.key && <motion.span layoutId="chip" className="chip-bg" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  <span className="chip-t">{f.name}</span>
                  <sup>{count}</sup>
                </button>
              )
            })}
          </div>
        </LayoutGroup>
      </div>

      <div className="masonry" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {cols.map((col, ci) => (
          <div className="masonry__col" key={ci}>
            <AnimatePresence mode="popLayout">
              {col.items.map((p, i) => (
                <Tile key={p.id} p={p} delay={(ci + i) * 0.05} onOpen={onOpen} />
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}

function Tile({ p, delay, onOpen }) {
  const ref = useRef(null)
  const [loaded, setLoaded] = useState(false)

  const tilt = (e) => {
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${-y * 10}deg`)
    el.style.setProperty('--ry', `${x * 12}deg`)
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
    el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  const leave = () => {
    const el = ref.current
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <motion.figure
      layout
      className="tile"
      initial={{ opacity: 0, y: 60, clipPath: 'inset(20% 10% 20% 10% round 18px)' }}
      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 6px)' }}
      viewport={{ once: true, amount: 0.15 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.3 } }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1], layout: { type: 'spring', stiffness: 200, damping: 28 } }}
    >
      <button
        ref={ref}
        className="tile__inner"
        onPointerMove={tilt}
        onPointerLeave={leave}
        onClick={() => onOpen(p)}
        data-cursor="View"
        style={{ aspectRatio: p.ratio }}
        aria-label={`Open ${p.title}`}
      >
        <img
          src={p.src}
          alt={p.caption}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={loaded ? 'is-loaded' : ''}
        />
        <span className="tile__glare" />
        <span className="tile__meta">
          <span className="tile__n">N° {p.n}</span>
          <span className="tile__t">{p.title}</span>
          <span className="tile__c">{p.cat}</span>
        </span>
      </button>
    </motion.figure>
  )
}
