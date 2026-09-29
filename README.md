# Karamdeep Singh — Chasing Light

A React (Vite) photography portfolio for **Karamdeep Singh**, built around the idea that scrolling the site plays out **one full day**: the sun rises and arcs across a living background, burns into dusk, stars appear and a copper moon rises for the contact section.

All 20 photographs come from his Unsplash profile: https://unsplash.com/@karamdeepsingh_2000 (served from Unsplash's image CDN, and each one links back to its Unsplash page).

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build in /dist (deploy to Vercel, Netlify, GitHub Pages…)
```

## What's inside

| Section | What it does |
|---|---|
| **Aperture loader** | 8-blade camera iris opens from f/22 to f/1.4 while frames preload, then the shutter flashes |
| **Sky canvas (background)** | Scroll-driven day cycle: sun arc, then dusk, stars and moon, with pollen that turns into fireflies at night and scatters from the cursor |
| **Viewfinder cursor** | Focus brackets that lock onto photos and show a "shutter speed" that rises as the mouse moves faster |
| **Hero** | Name revealed letter by letter, a 3D fan of prints with mouse parallax that spreads out as you scroll |
| **Statement** | Words sharpen out of blur as you scroll through them |
| **Field Journal** | Pinned horizontal scroll through four chapters (Wings, Bloom, Light, Wild), with a colour glow for each chapter |
| **The Darkroom** | Interactive: your cursor/finger is the enlarger lamp and develops the print out of the dark. Reach 70% and it's "fixed" |
| **Marquee** | Endless type ribbons whose speed and skew react to scroll velocity |
| **Archive** | Filterable masonry with animated layout, 3D tilt, glare and blur-up loading |
| **About** | Rotating text ring portrait, counters, services list with a floating image preview |
| **Contact** | Moonlit finale, magnetic "Say hello" orb, a moving film strip |
| **Lightbox** | Circular wipe open, swipe/drag, ← → / Esc, film-strip nav, View on Unsplash + Download |

Smooth scrolling uses **Lenis** and the animations use **Framer Motion**. The site respects `prefers-reduced-motion`.

## To customise

Everything is in `src/data/photos.js`:

- `CONTACT_EMAIL`: **replace the placeholder** with Karamdeep's real email
- `INSTAGRAM_URL`: add it and the link shows up automatically
- Photo titles and captions can be edited freely. To add a new photo, copy its image id from Unsplash

The bio and statement copy (in `About.jsx` and `Manifesto.jsx`) is draft copy. Have Karamdeep review it before launch.
