// Every photograph published by Karamdeep Singh on Unsplash
// Profile: https://unsplash.com/@karamdeepsingh_2000
// `id` is the Unsplash image id (used for the CDN url), `slug` is the photo page path.

export const PROFILE_URL = 'https://unsplash.com/@karamdeepsingh_2000'
export const CONTACT_EMAIL = 'karmdeep236@gmail.com'
export const INSTAGRAM_URL = '' // TODO: add Instagram link if available

const raw = [
  // ——— WINGS ———
  { id: '1783682143923-ab62af66d749', slug: 'a-yellow-bird-flying-near-its-intricately-woven-nest-8GSu7xzGEWQ', w: 3377, h: 3508, cat: 'wings', title: 'The Architect', caption: 'A yellow weaver in flight beside its intricately woven nest' },
  { id: '1775955210680-d8e21ca0a39c', slug: 'a-hoopoe-bird-with-a-distinctive-crest-sits-perched-LnOxS0yhAEA', w: 2560, h: 3840, cat: 'wings', title: 'Crowned', caption: 'A hoopoe perched, its distinctive crest catching the light' },
  { id: '1783351216896-e21ff9cbc26d', slug: 'b4V-xh_8R2k', w: 4000, h: 6000, cat: 'wings', title: 'Emerald Tail', caption: 'A rose-ringed parakeet resting on a bare branch' },
  { id: '1777988266805-9fa2b57db577', slug: 'a-yellow-bird-perched-on-a-tree-branch-_LwQzSsg7cg', w: 3510, h: 3529, cat: 'wings', title: 'Gold on Bark', caption: 'A yellow bird perched on a tree branch' },
  { id: '1783147480425-33dd9adb2440', slug: 'I-vWKoDZX9E', w: 6000, h: 4000, cat: 'wings', title: 'Woven Home', caption: 'A hanging weaver nest swaying among the leaves' },
  { id: '1787388625713-792c2698d4b6', slug: 'swallowtail-butterfly-on-orange-flower-o0R9D3xXFrU', w: 6000, h: 4000, cat: 'wings', title: 'Swallowtail', caption: 'A black swallowtail butterfly on a vibrant orange flower' },

  // ——— BLOOM ———
  { id: '1787051067254-dde73f5c942d', slug: 'yellow-chrysanthemum-flower-with-curled-petals-6MD0pGUVOzo', w: 4000, h: 6000, cat: 'bloom', title: 'Unfurling', caption: 'A yellow chrysanthemum with curled petals against the dark' },
  { id: '1783950778020-2c3a0bc71aee', slug: 'a-vibrant-pink-flower-with-a-yellow-center-blooms-cHUmYzJeW6Y', w: 6000, h: 4000, cat: 'bloom', title: 'Pink Hour', caption: 'A vibrant pink flower with a yellow heart in full bloom' },
  { id: '1775612179717-bbcb8fb2712e', slug: 'a-single-orange-flower-with-a-green-center-d6xtfpnK85U', w: 3200, h: 2128, cat: 'bloom', title: 'Solitaire', caption: 'A single orange flower with a green centre' },

  // ——— LIGHT ———
  { id: '1787387726284-8a9ffc55f3d7', slug: 'yellow-sun-behind-silhouetted-tree-branches-f6qmdQBTEI4', w: 4000, h: 6000, cat: 'light', title: 'Caged Sun', caption: 'A bright yellow sun behind silhouetted branches' },
  { id: '1781876030873-a03b7d21c917', slug: 'bright-sun-obscured-by-silhouetted-tree-leaves-at-sunset-7mT3XCGoVN0', w: 4000, h: 6000, cat: 'light', title: 'Last Flare', caption: 'The sun slipping through silhouetted leaves at sunset' },
  { id: '1783351827305-b6fb6004d1b3', slug: 'ji0Nm1CCpXs', w: 4000, h: 6000, cat: 'light', title: 'Burning Clouds', caption: 'A molten sun breaking through clouds over a bare tree' },
  { id: '1776322283369-69a752d91194', slug: 'full-orange-moon-in-the-dark-night-sky-w-KZziWUcMA', w: 6000, h: 4000, cat: 'light', title: 'Harvest Moon', caption: 'A full orange moon hanging in the dark night sky' },
  { id: '1783147025330-70d6bd4edd37', slug: 'Ly6CHUmuTME', w: 6000, h: 4000, cat: 'light', title: 'Ember Moon', caption: 'A lone copper moon in an ink-black sky' },

  // ——— WILD ———
  { id: '1787050595467-a2274bc53f77', slug: 'calico-cat-on-dry-grass-niPJ-aPFMNg', w: 4000, h: 6000, cat: 'wild', title: 'Green Eyes', caption: 'A calico cat with green eyes on dry grass' },
  { id: '1788615079915-94a4484b9171', slug: 'uuB3MUFk4E8', w: 4000, h: 6000, cat: 'wild', title: 'Hideout', caption: 'A curious kitten peeking out from its shaded hideout' },
  { id: '1777618039980-ab7cba6ef2b6', slug: 'PjxJUqdA0Ok', w: 4000, h: 6000, cat: 'wild', title: 'Breakfast', caption: 'A palm squirrel nibbling among fresh green leaves' },
  { id: '1781875087230-b2a31ded4c70', slug: 'a-small-squirrel-eats-on-the-ground-amidst-grass-CDEtA6NcYJc', w: 4000, h: 6000, cat: 'wild', title: 'Forager', caption: 'A small squirrel eating on the ground amidst the grass' },
  { id: '1780028837907-4247fa7ba4f9', slug: 'a-small-squirrel-sits-on-a-rusty-corrugated-roof-0OoyAazj654', w: 4000, h: 6000, cat: 'wild', title: 'Rust & Fur', caption: 'A small squirrel on a rusty corrugated roof' },
  { id: '1775612458136-97f9eb128d68', slug: 'a-small-squirrel-sits-on-a-brown-surface-Uqc8hJTegl0', w: 6000, h: 4000, cat: 'wild', title: 'Stillness', caption: 'A small squirrel sitting perfectly still' },
]

export const img = (id, w = 1200, q = 80) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=${q}&auto=format&fit=crop`

export const photos = raw.map((p, i) => ({
  ...p,
  n: String(i + 1).padStart(2, '0'),
  ratio: p.w / p.h,
  src: img(p.id, 1200),
  thumb: img(p.id, 600, 70),
  full: img(p.id, 2400, 85),
  page: `https://unsplash.com/photos/${p.slug}`,
}))

export const byCat = (c) => photos.filter((p) => p.cat === c)

export const chapters = [
  { key: 'wings', roman: 'I', name: 'Wings', line: 'Weavers, hoopoes and parakeets — the ones that never wait for you.', hue: '#e8c14a' },
  { key: 'bloom', roman: 'II', name: 'Bloom', line: 'Petals that open for a single morning, held forever.', hue: '#e86a8a' },
  { key: 'light', roman: 'III', name: 'Light', line: 'Suns caught in branches. Moons the colour of embers.', hue: '#f08a2c' },
  { key: 'wild', roman: 'IV', name: 'Wild', line: 'Small lives on rooftops, in grass, in the shade of things.', hue: '#9bc26b' },
]
