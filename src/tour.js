// Auto-tour used by "Tour.html": scrolls through every section on its own
// so the site can be reviewed hands-free. Not used by the real site.
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const to = (y, duration = 2.2) => {
  const l = window.__lenis
  if (l) l.scrollTo(y, { duration })
  else window.scrollTo({ top: y, behavior: 'smooth' })
}
const top = (sel) => document.querySelector(sel).getBoundingClientRect().top + window.scrollY

export async function runTour() {
  const HOLD = 7000
  await wait(4200 + HOLD) // loader + hero
  to(top('.manifesto') + 250); await wait(HOLD)
  const ch = top('#chapters'); const chLen = document.querySelector('#chapters').offsetHeight - innerHeight
  for (const f of [0.02, 0.18, 0.36, 0.55, 0.75, 0.92]) { to(ch + chLen * f, 2.6); await wait(HOLD) }
  to(top('#darkroom') + 60); await wait(3500)
  // sweep the lamp across the plate
  const plate = document.querySelector('.darkroom__plate')
  const r = plate.getBoundingClientRect()
  for (let row = 0; row < 4; row++) for (let i = 0; i <= 30; i++) {
    const x = r.left + r.width * (0.1 + (row % 2 ? 1 - i / 30 : i / 30) * 0.8)
    const y = r.top + r.height * (0.2 + row * 0.2)
    plate.dispatchEvent(new PointerEvent('pointermove', { clientX: x, clientY: y, bubbles: true }))
    await wait(25)
  }
  await wait(HOLD)
  document.querySelector('.darkroom__actions button').click(); await wait(HOLD)
  to(top('.marquee') - 100); await wait(HOLD)
  to(top('#archive') + 40); await wait(HOLD)
  to(top('#archive') + innerHeight * 0.9); await wait(HOLD)
  to(top('#about')); await wait(HOLD)
  to(top('.services') - 120); await wait(HOLD)
  to(document.documentElement.scrollHeight); await wait(HOLD + 1500)
  to(top('#archive') + 40, 1.4); await wait(2500)
  document.querySelector('.tile__inner').click(); await wait(HOLD)
  document.querySelector('.lb__nav--r').click(); await wait(HOLD)
  document.querySelector('.lb__close').click()
}
