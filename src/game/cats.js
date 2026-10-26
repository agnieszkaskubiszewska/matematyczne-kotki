import { seededRandom, shuffle } from './random.js'

const NAMES = [
  'Tajfun', 'Puszek', 'Filemon', 'Kicia', 'Łatka', 'Gacek', 'Bonifacy',
  'Rudy', 'Pusia', 'Tygrys', 'Kluska', 'Pączek', 'Śnieżka', 'Behemot',
  'Fruzia', 'Miodek', 'Psotka', 'Figa', 'Kropka', 'Sushi', 'Cynamon',
  'Mgiełka', 'Felek', 'Bursztyn', 'Iskierka', 'Leon', 'Nutka', 'Kajtek',
  'Pestka', 'Bąbel',
]

// B – futro, D – pręgi/łatki, W – brzuszek i pyszczek, E – oczy, O – kontur
export const CAT_PALETTES = {
  rudy: { B: '#f0a040', D: '#c86a1e', W: '#fbe3c0', E: '#3a7d2c' },
  szary: { B: '#9aa3ad', D: '#6b737d', W: '#e6e9ec', E: '#e5b72a' },
  czarny: { B: '#3a3440', D: '#26222b', W: '#4f4757', E: '#f2d23c', O: '#0d0b0e' },
  smoking: { B: '#3a3440', D: '#3a3440', W: '#f4f1ea', E: '#7cc96a', O: '#0d0b0e' },
  bialy: { B: '#f7f4ef', D: '#e2dcd2', W: '#ffffff', E: '#5aa0e6' },
  kremowy: { B: '#ecd2a6', D: '#d0ab73', W: '#fff3dc', E: '#c07a2a' },
  brazowy: { B: '#8a5a3b', D: '#5e3b25', W: '#d9b48f', E: '#e8c547' },
  niebieski: { B: '#7d8fa8', D: '#5f7189', W: '#b6c4d6', E: '#7ad08a' },
  trikolor: { B: '#f7f2ea', D: '#e08a3c', W: '#ffffff', E: '#d6a22a' },
  pregowany: { B: '#b08a5a', D: '#5e4630', W: '#e8d6b8', E: '#6fbf4a' },
}

const BASE = { O: '#2a1f2b', P: '#f29bb0', T: '#7fd3ff' }

export function catColors(paletteKey) {
  return { ...BASE, ...CAT_PALETTES[paletteKey] }
}

export function catForDay(seed, day) {
  const names = shuffle(seededRandom(seed), NAMES)
  const palettes = Object.keys(CAT_PALETTES)
  const rng = seededRandom(seed * 31 + day)
  return {
    name: names[(day - 1) % names.length],
    palette: palettes[Math.floor(rng() * palettes.length)],
  }
}
