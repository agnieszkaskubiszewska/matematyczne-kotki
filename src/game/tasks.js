import { randInt, shuffle } from './random.js'

// Gracz ma drugą szansę przy każdym zadaniu, więc zadania są wymagające
// od pierwszego dnia: dodawanie i odejmowanie do 300, mnożenie i dzielenie
// na wyższych liczbach z tabliczki (np. 8 · 9).
const MAX = 300

// Każdy dział to osobny generator. Kolejne działy (zegar, kilogramy...)
// wystarczy dopisać tutaj i dodać do DAY_MIX.
const TOPICS = {
  add(rng) {
    const a = randInt(rng, 40, MAX - 40)
    const b = randInt(rng, 15, MAX - a)
    return { text: `${a} + ${b}`, answer: a + b }
  },
  sub(rng) {
    const a = randInt(rng, 100, MAX)
    const b = randInt(rng, 15, a - 10)
    return { text: `${a} − ${b}`, answer: a - b }
  },
  mul(rng) {
    const a = randInt(rng, 6, 9)
    const b = randInt(rng, 4, 9)
    return rng() < 0.5
      ? { text: `${a} · ${b}`, answer: a * b }
      : { text: `${b} · ${a}`, answer: a * b }
  },
  div(rng) {
    const divisor = randInt(rng, 6, 9)
    const result = randInt(rng, 4, 9)
    return { text: `${divisor * result} : ${divisor}`, answer: result }
  },
}

// najwięcej odejmowania – to sprawia najwięcej kłopotu
const DAY_MIX = [
  ['add', 7],
  ['sub', 10],
  ['mul', 7],
  ['div', 6],
]

export function makeTask(rng, topic, used = new Set()) {
  let task
  for (let tries = 0; tries < 50; tries++) {
    task = { topic, ...TOPICS[topic](rng) }
    if (!used.has(task.text)) break
  }
  used.add(task.text)
  return task
}

export function makeDayTasks(rng) {
  const used = new Set()
  const topics = DAY_MIX.flatMap(([topic, count]) => Array(count).fill(topic))
  return shuffle(rng, topics).map((topic) => makeTask(rng, topic, used))
}

export function makeExtraTask(rng, tasks) {
  const used = new Set(tasks.map((t) => t.text))
  const topic = DAY_MIX[randInt(rng, 0, DAY_MIX.length - 1)][0]
  return makeTask(rng, topic, used)
}
