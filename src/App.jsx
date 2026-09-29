import { useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

import SkyCanvas from './components/SkyCanvas'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Chapters from './components/Chapters'
import Darkroom from './components/Darkroom'
import Marquee from './components/Marquee'
import Gallery from './components/Gallery'
import About from './components/About'
import Contact from './components/Contact'
import Lightbox from './components/Lightbox'

export default function App() {
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(null)
  const done = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
    window.__lenis = lenis
    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  useEffect(() => {
    if (window.__TOUR) import('./tour.js').then((m) => m.runTour())
  }, [])

  useEffect(() => {
    if (!ready) window.__lenis?.stop()
    else window.__lenis?.start()
  }, [ready])

  return (
    <>
      <SkyCanvas />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <Loader onDone={done} />
      <Cursor />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} onOpen={setOpen} />
        <Manifesto />
        <Chapters onOpen={setOpen} />
        <Darkroom onOpen={setOpen} />
        <Marquee />
        <Gallery onOpen={setOpen} />
        <About />
        <Contact />
      </main>
      <Lightbox photo={open} onClose={() => setOpen(null)} onChange={setOpen} />
    </>
  )
}
