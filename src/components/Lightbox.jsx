import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { photos, chapters } from '../data/photos'

/** Full-screen viewer: swipe/drag, ← → keys, Esc, film-strip navigation, Unsplash + download links. */
export default function Lightbox({ photo, onClose, onChange }) {
  const [dir, setDir] = useState(0)
  const [hi, setHi] = useState(false)
  const strip = useRef(null)
  const idx = photo ? photos.findIndex((p) => p.id === photo.id) : -1

  const go = (d) => {
    setDir(d)
    setHi(false)
    onChange(photos[(idx + d + photos.length) % photos.length])
  }

  useEffect(() => {
    if (!photo) return
    window.__lenis?.stop()
    document.body.style.overflow = 'hidden'
    const k = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    addEventListener('keydown', k)
    strip.current?.querySelector('.on')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
    return () => {
      removeEventListener('keydown', k)
      window.__lenis?.start()
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo])

  const chapter = photo && chapters.find((c) => c.key === photo.cat)

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="lb"
          initial={{ clipPath: 'circle(0% at 50% 50%)' }}
          animate={{ clipPath: 'circle(150% at 50% 50%)' }}
          exit={{ clipPath: 'circle(0% at 50% 50%)' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label={photo.title}
        >
          <div className="lb__bg" style={{ backgroundImage: `url(${photo.thumb})` }} />
          <header className="lb__top">
            <span>
              N° {photo.n} <i>/</i> {String(photos.length).padStart(2, '0')}
            </span>
            <span className="lb__chapter" style={{ color: chapter?.hue }}>
              {chapter?.roman} · {chapter?.name}
            </span>
            <button onClick={onClose} data-cursor="Close" className="lb__close" aria-label="Close">
              <span />
              <span />
            </button>
          </header>

          <div className="lb__stage">
            <button className="lb__nav lb__nav--l" onClick={() => go(-1)} data-cursor="Prev" aria-label="Previous">
              ←
            </button>
            <AnimatePresence mode="popLayout" custom={dir}>
              <motion.figure
                key={photo.id}
                className="lb__fig"
                custom={dir}
                initial={(d) => ({ opacity: 0, x: d * 120, rotate: d * 3, scale: 0.94 })}
                animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                exit={(d) => ({ opacity: 0, x: d * -120, rotate: d * -3, scale: 0.94 })}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, i) => {
                  if (i.offset.x < -90) go(1)
                  else if (i.offset.x > 90) go(-1)
                }}
              >
                <img src={photo.src} alt="" className="lb__lo" draggable={false} />
                <img
                  src={photo.full}
                  alt={photo.caption}
                  className={`lb__hi ${hi ? 'on' : ''}`}
                  onLoad={() => setHi(true)}
                  draggable={false}
                />
              </motion.figure>
            </AnimatePresence>
            <button className="lb__nav lb__nav--r" onClick={() => go(1)} data-cursor="Next" aria-label="Next">
              →
            </button>
          </div>

          <footer className="lb__info">
            <div>
              <h3>{photo.title}</h3>
              <p>{photo.caption}</p>
            </div>
            <div className="lb__actions">
              <a href={photo.page} target="_blank" rel="noreferrer" data-cursor="↗">
                View on Unsplash ↗
              </a>
              <a href={`${photo.page}/download?force=true`} target="_blank" rel="noreferrer" data-cursor="↓">
                Download ↓
              </a>
            </div>
          </footer>

          <div className="lb__strip" ref={strip}>
            {photos.map((p, i) => (
              <button
                key={p.id}
                className={p.id === photo.id ? 'on' : ''}
                onClick={() => {
                  setDir(i > idx ? 1 : -1)
                  setHi(false)
                  onChange(p)
                }}
                aria-label={p.title}
              >
                <img src={p.thumb} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
