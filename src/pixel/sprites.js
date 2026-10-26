// Pikselowe obrazki zapisane jako siatki znaków. Każdy znak to kolor
// z palety, a '.' to przezroczysty piksel.

// ---------- Kotek z boku (patrzy w prawo) ----------
const CAT_SIDE_BODY = [
  '.............O...O..',
  '............OPO.OPO.',
  '............OBBBBBBO',
  '............OBEBBEBO',
  '..OO........OBEBBEBO',
  '.OBO........OWWPPWWO',
  '.OBO.OOOOOOOOWWWWWWO',
  '.OBO.OBBDBBDBOWWWWO.',
  '.OBOOBBBDBBDBBOOOO..',
  '..OBBBBBBBBBBBBBBO..',
  '...OBBBBBBBBBBBBBO..',
  '....OBWWWWWWWWWBO...',
]

export const CAT_WALK = [
  [...CAT_SIDE_BODY, '....OBOOBO..OBOOBO..', '....OOOOOO..OOOOOO..'],
  [...CAT_SIDE_BODY, '...OBO..OBOOBO..OBO.', '...OOO..OOOOOO..OOO.'],
]

// Kotek z menu: cały czarny, tylko mała biała łatka na klatce piersiowej.
const CHEST_PATCH = { 9: [14], 10: [14] }

export const CAT_WALK_BLACK = CAT_WALK.map((frame) =>
  frame.map((row, y) =>
    [...row.replace(/[WD]/g, 'B')].map((ch, x) => (CHEST_PATCH[y]?.includes(x) ? 'W' : ch)).join(''),
  ),
)

// ---------- Kotek siedzący, przodem ----------
const CAT_SIT_HEAD = ['OO........OO', 'OPO......OPO', 'OBBOOOOOOBBO', 'OBBBBDDBBBBO']
const CAT_SIT_BODY = [
  '..OBBBBBBO..',
  '.OBBWWWWBBO.',
  'OBBBWWWWBBBO',
  'OBBBWWWWBBBO',
  'OBWWOBBOWWBO',
  'OOOOOOOOOOOO',
]

export const CAT_SIT = [
  [...CAT_SIT_HEAD, 'OBEEBBBBEEBO', 'OBEEBPPBEEBO', 'OWWWWWWWWWWO', '.OWWWWWWWWO.', ...CAT_SIT_BODY],
  // mrugnięcie
  [...CAT_SIT_HEAD, 'OBBBBBBBBBBO', 'OBOOBPPBOOBO', 'OWWWWWWWWWWO', '.OWWWWWWWWO.', ...CAT_SIT_BODY],
]

export const CAT_CRY = [
  [...CAT_SIT_HEAD, 'OBOOBBBBOOBO', 'OBTBBPPBBTBO', 'OWTWWWWWWTWO', '.OWWWWWWWWO.', ...CAT_SIT_BODY],
  [...CAT_SIT_HEAD, 'OBOOBBBBOOBO', 'OBBBBPPBBBBO', 'OWTWWWWWWTWO', '.OTWWWWWWTO.', ...CAT_SIT_BODY],
]

// ---------- Szczur (patrzy w lewo) ----------
const RAT_BODY = [
  '....OO..............',
  '...OPPO.OOOOOO......',
  '..OGPGOOGGGGGGOO....',
  '.OGRGGGGGGGGGGGGO...',
  'OPGGGGGGGGGGGGGGGO..',
  '.OWOGGGGGGGGGGGGGOPP',
  '..O.OgGGGGGGGGGgO..P',
]

export const RAT_WALK = [
  [...RAT_BODY, '...OPO..OPO..OPO...P', '..................P.'],
  [...RAT_BODY, '....OPO.OPO...OPO..P', '..................P.'],
]

export const RAT_COLORS = {
  O: '#1c1620',
  G: '#7a6f78',
  g: '#5a5058',
  P: '#e88aa0',
  R: '#ff2b2b',
  W: '#fffbe6',
}

// ---------- Nagrobek ----------
export const GRAVE = [
  '....OOOOOO....',
  '...OSSSSSSO...',
  '..OSSSSSSSSO..',
  '.OSSSSDSSSSSO.',
  '.OSSSDDDSSSSO.',
  '.OSSSSDSSSSSO.',
  '.OSSSSDSSSSSO.',
  '.OSSSSSSSSSSO.',
  '.OSSSSSSSSSSO.',
  '.OSSSSSSSSSSO.',
  '.OSSSSSSSSSSO.',
  'OOOOOOOOOOOOOO',
  'GGFGGGGGGGGFGG',
]

export const GRAVE_COLORS = {
  O: '#2b2833',
  S: '#a3a3b3',
  D: '#6c6c7a',
  G: '#4c9a3c',
  F: '#ff6f91',
}

// ---------- Meble do pokoju ----------
function stretch(grid, col, extra) {
  return grid.map((row) => row.slice(0, col) + row[col].repeat(extra + 1) + row.slice(col + 1))
}

export const ARMCHAIR = [
  '..OOOOOOOOOOOO..',
  '.OAAAAAAAAAAAAO.',
  '.OAAAAAAAAAAAAO.',
  '.OAAAAAAAAAAAAO.',
  'OOOAAAAAAAAAAOOO',
  'OAAOaaaaaaaaOAAO',
  'OAAOaaaaaaaaOAAO',
  'OAAOOOOOOOOOOAAO',
  'OAAAAAAAAAAAAAAO',
  'OAAAAAAAAAAAAAAO',
  'OOOOOOOOOOOOOOOO',
  '.OL..........LO.',
  '.OO..........OO.',
]

export const SOFA = stretch(ARMCHAIR, 7, 16)

export const ARMCHAIR_COLORS = { O: '#2a1f2b', A: '#c0504d', a: '#9b3a38', L: '#7a4a2a' }
export const SOFA_COLORS = { O: '#2a1f2b', A: '#4f7cc0', a: '#3b5f99', L: '#7a4a2a' }

export const BOWL = [
  '..FFFFFF..',
  '.OFFFFFFO.',
  'ORRRRRRRRO',
  '.ORRRRRRO.',
  '..OOOOOO..',
]

export const BOWL_COLORS = { O: '#2a1f2b', F: '#9c6233', R: '#e0453a' }

export const SCRATCHER = [
  'OOOOOOOOOO',
  'OKKKKKKKKO',
  'OOOOOOOOOO',
  ...Array.from({ length: 16 }, (_, i) => (i % 2 ? '...OyyO...' : '...OYYO...')),
  '...OYYO..O',
  '.OOOOOOOOP',
  'OKKKKKKKKO',
  'OOOOOOOOOO',
]

export const SCRATCHER_COLORS = { O: '#2a1f2b', K: '#8e6bbf', Y: '#e0c58a', y: '#c2a266', P: '#ff6f91' }

// Kominek rysujemy w pętli – cegły, palenisko i płomienie.
const FIRE_W = 26
const FIRE_H = 22
const FLAMES = [
  [2, 4, 6, 5, 8, 7, 5, 6, 4, 2],
  [3, 5, 4, 7, 6, 8, 6, 4, 5, 3],
  [2, 3, 6, 8, 5, 6, 7, 5, 3, 2],
]

function fireplaceFrame(flames) {
  const rows = []
  for (let y = 0; y < FIRE_H; y++) {
    let row = ''
    for (let x = 0; x < FIRE_W; x++) {
      let c
      if (y === 0 || y === 3 || y === FIRE_H - 1) c = 'O'
      else if (y < 3) c = x === 0 || x === FIRE_W - 1 ? 'O' : 'M'
      else if (x === 1 || x === FIRE_W - 2) c = 'O'
      else if (x < 1 || x > FIRE_W - 2) c = '.'
      else if (y >= 8 && x >= 6 && x <= 19) {
        // palenisko
        if (y === 8 || x === 6 || x === 19) c = 'O'
        else if (y >= FIRE_H - 3 && x >= 8 && x <= 17) c = 'L'
        else {
          const col = x - 8
          const fromBottom = FIRE_H - 3 - y
          const h = col >= 0 && col < flames.length ? flames[col] : 0
          if (fromBottom < h) c = fromBottom < h - 2 && col > 1 && col < 8 ? 'Y' : 'F'
          else c = 'K'
        }
      } else {
        const shift = Math.floor(y / 3) % 2 ? 3 : 0
        c = y % 3 === 0 || (x + shift) % 6 === 0 ? 'r' : 'R'
      }
      row += c
    }
    rows.push(row)
  }
  return rows
}

export const FIREPLACE = FLAMES.map(fireplaceFrame)

export const FIREPLACE_COLORS = {
  O: '#2a1f2b',
  M: '#8a5a3b',
  R: '#b5523b',
  r: '#d9c3a5',
  K: '#1a1418',
  L: '#6b3f22',
  F: '#ff7a1a',
  Y: '#ffd93b',
}

// Serduszko i trumienka do paska postępu w menu
export const HEART = [
  '.OO.OO.',
  'ORROrRO',
  'ORRRRRO',
  '.ORRRO.',
  '..ORO..',
  '...O...',
]

export const HEART_COLORS = { O: '#2a1f2b', R: '#ff4d6d', r: '#ffb3c1' }
export const HEART_EMPTY_COLORS = { O: '#2a1f2b', R: '#5b4b5c', r: '#5b4b5c' }
