import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const TEXT =
  'I photograph the patient things — a weaver returning to the nest it built by hand, a sun tangled in winter branches, a squirrel that forgets I am there. Every frame is a small act of waiting for the light to say yes.'

// words that light up in gold
const GOLD = new Set(['patient', 'weaver', 'sun', 'waiting', 'light', 'yes.'])

export default function Manifesto() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = TEXT.split(' ')
  return (
    <section className="manifesto" ref={ref}>
      <div className="section-tag">
        <span>00</span> Statement
      </div>
      <p className="manifesto__text">
        {words.map((w, i) => (
          <Word key={i} w={w} i={i} n={words.length} p={scrollYProgress} gold={GOLD.has(w.replace(/[,]/g, ''))} />
        ))}
      </p>
      <div className="manifesto__sig">— Karamdeep Singh</div>
    </section>
  )
}

function Word({ w, i, n, p, gold }) {
  const start = i / n
  const end = start + 1.5 / n
  const opacity = useTransform(p, [start, end], [0.12, 1])
  const blur = useTransform(p, [start, end], ['blur(6px)', 'blur(0px)'])
  const y = useTransform(p, [start, end], [14, 0])
  return (
    <motion.span className={gold ? 'w gold' : 'w'} style={{ opacity, filter: blur, y }}>
      {w}{' '}
    </motion.span>
  )
}
