// Prosty generator liczb pseudolosowych z ziarnem (mulberry32),
// żeby kotek danego dnia zawsze miał to samo imię i umaszczenie.
export function seededRandom(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function randInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1))
}

export function pick(rng, list) {
  return list[Math.floor(rng() * list.length)]
}

export function shuffle(rng, list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
