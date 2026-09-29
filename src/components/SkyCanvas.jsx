import { useEffect, useRef } from 'react'

/**
 * A fixed, full-screen living background.
 * As you scroll the whole site plays out one day:
 * a sun rises and arcs across the sky, burns into dusk,
 * stars fade in, and a copper moon climbs for the finale.
 * Drifting pollen / fireflies float everywhere and scatter from the cursor.
 */
const lerp = (a, b, t) => a + (b - a) * t
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const mix = (c1, c2, t) => c1.map((v, i) => Math.round(lerp(v, c2[i], t)))

// sky palette keyframes [progress, top, bottom]
const SKY = [
  [0.0, [20, 12, 18], [58, 30, 26]], // dawn
  [0.3, [16, 14, 10], [36, 28, 16]], // day (kept dark for photos)
  [0.6, [30, 12, 8], [70, 26, 10]], // dusk
  [0.78, [8, 8, 16], [18, 12, 22]], // blue hour
  [1.0, [4, 5, 10], [10, 9, 16]], // night
]

function skyAt(p) {
  for (let i = 0; i < SKY.length - 1; i++) {
    const [p0, t0, b0] = SKY[i]
    const [p1, t1, b1] = SKY[i + 1]
    if (p >= p0 && p <= p1) {
      const t = (p - p0) / (p1 - p0)
      return [mix(t0, t1, t), mix(b0, b1, t)]
    }
  }
  return [SKY[4][1], SKY[4][2]]
}

export default function SkyCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w, h, dpr, raf
    let progress = 0
    let smooth = 0
    const mouse = { x: -9999, y: -9999 }

    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.75,
      r: Math.random() * 1.2 + 0.2,
      tw: Math.random() * Math.PI * 2,
      sp: 0.5 + Math.random() * 2,
    }))

    const COUNT = window.innerWidth < 700 ? 40 : 90
    const motes = Array.from({ length: COUNT }, () => spawn(true))
    function spawn(anywhere) {
      return {
        x: Math.random() * window.innerWidth,
        y: anywhere ? Math.random() * window.innerHeight : window.innerHeight + 20,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(0.1 + Math.random() * 0.35),
        r: Math.random() * 2.2 + 0.4,
        life: Math.random() * Math.PI * 2,
        glow: Math.random() < 0.25,
      }
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress = max > 0 ? clamp(window.scrollY / max) : 0
    }
    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    resize()
    onScroll()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })

    let t = 0
    const draw = () => {
      t += 1 / 60
      smooth = lerp(smooth, progress, 0.06)
      const p = smooth

      // — sky gradient —
      const [top, bot] = skyAt(p)
      const g = ctx.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, `rgb(${top})`)
      g.addColorStop(1, `rgb(${bot})`)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      // — stars (fade in at dusk) —
      const starA = clamp((p - 0.55) / 0.25)
      if (starA > 0) {
        for (const s of stars) {
          const a = starA * (0.4 + 0.6 * Math.abs(Math.sin(t * s.sp + s.tw)))
          ctx.fillStyle = `rgba(255,244,220,${a})`
          ctx.beginPath()
          ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // — sun: arcs across the sky from 0 → 0.68 —
      const sp = clamp(p / 0.68)
      const sunA = 1 - clamp((p - 0.6) / 0.1)
      if (sunA > 0) {
        const sx = lerp(-0.1 * w, 1.1 * w, sp)
        const sy = h * 0.95 - Math.sin(sp * Math.PI) * h * 0.75
        const warm = mix([255, 214, 120], [255, 110, 40], clamp((sp - 0.55) / 0.45))
        const R = Math.max(w, h) * 0.55
        const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, R)
        halo.addColorStop(0, `rgba(${warm},${0.35 * sunA})`)
        halo.addColorStop(0.12, `rgba(${warm},${0.16 * sunA})`)
        halo.addColorStop(1, `rgba(${warm},0)`)
        ctx.fillStyle = halo
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = `rgba(${warm},${0.9 * sunA})`
        ctx.beginPath()
        ctx.arc(sx, sy, Math.min(w, h) * 0.035, 0, Math.PI * 2)
        ctx.fill()
      }

      // — moon: rises 0.7 → 1 —
      const mp = clamp((p - 0.7) / 0.3)
      if (mp > 0) {
        const mx = lerp(0.82 * w, 0.72 * w, mp)
        const my = lerp(h * 1.05, h * 0.26, easeOut(mp))
        const mr = Math.min(w, h) * 0.06
        const mh = ctx.createRadialGradient(mx, my, 0, mx, my, mr * 7)
        mh.addColorStop(0, `rgba(240,140,70,${0.28 * mp})`)
        mh.addColorStop(1, 'rgba(240,140,70,0)')
        ctx.fillStyle = mh
        ctx.fillRect(0, 0, w, h)
        const body = ctx.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.1, mx, my, mr)
        body.addColorStop(0, `rgba(255,190,120,${mp})`)
        body.addColorStop(1, `rgba(200,90,40,${mp})`)
        ctx.fillStyle = body
        ctx.beginPath()
        ctx.arc(mx, my, mr, 0, Math.PI * 2)
        ctx.fill()
      }

      // — floating pollen / fireflies —
      const fire = clamp((p - 0.55) / 0.2) // turn into fireflies at night
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i]
        m.life += 0.02
        const dx = m.x - mouse.x
        const dy = m.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < 140 * 140) {
          const f = (1 - Math.sqrt(d2) / 140) * 0.6
          m.vx += (dx / (Math.sqrt(d2) + 0.01)) * f
          m.vy += (dy / (Math.sqrt(d2) + 0.01)) * f
        }
        m.vx *= 0.96
        m.vy = m.vy * 0.96 + -(0.12 + m.r * 0.05) * 0.04
        m.x += m.vx + Math.sin(m.life) * 0.25
        m.y += m.vy
        if (m.y < -20 || m.x < -40 || m.x > w + 40) motes[i] = spawn(false)

        const flick = 0.5 + 0.5 * Math.sin(m.life * 3)
        const col = fire > 0.5 ? '190,255,140' : '255,215,150'
        const a = m.glow ? 0.25 + 0.55 * flick * (0.5 + fire) : 0.18 + 0.2 * flick
        if (m.glow) {
          const gr = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 7)
          gr.addColorStop(0, `rgba(${col},${a * 0.6})`)
          gr.addColorStop(1, `rgba(${col},0)`)
          ctx.fillStyle = gr
          ctx.beginPath()
          ctx.arc(m.x, m.y, m.r * 7, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = `rgba(${col},${a})`
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reduce) raf = requestAnimationFrame(draw)
    }
    draw()
    if (reduce) {
      const redraw = () => draw()
      window.addEventListener('scroll', redraw, { passive: true })
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} className="sky" aria-hidden="true" />
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3)
}
