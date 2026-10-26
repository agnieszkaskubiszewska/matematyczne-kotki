import { randInt, shuffle } from './random.js'

// Poziom trudności rośnie z dniami wyzwania.
function levelForDay(day) {
  if (day <= 7) return { addMax: 50, tableMax: 5 }
  if (day <= 15) return { addMax: 100, tableMax: 7 }
  return { addMax: 100, tableMax: 10 }
}

// Każdy dział to osobny generator. Kolejne działy (zegar, kilogramy...)
// wystarczy dopisać tutaj i dodać do DAY_MIX.
const TOPICS = {
  add(rng, level) {
    const a = randInt(rng, 10, level.addMax - 2)
    const b = randInt(rng, 2, level.addMax - a)
    return { text: `${a} + ${b}`, answer: a + b }
  },
  sub(rng, level) {
    const a = randInt(rng, 10, level.addMax)
    const b = randInt(rng, 2, a - 1)
    return { text: `${a} − ${b}`, answer: a - b }
  },
  mul(rng, level) {
    const a = randInt(rng, 2, level.tableMax)
    const b = randInt(rng, 2, 10)
    return rng() < 0.5
      ? { text: `${a} · ${b}`, answer: a * b }
      : { text: `${b} · ${a}`, answer: a * b }
  },
  div(rng, level) {
    const divisor = randInt(rng, 2, level.tableMax)
    const result = randInt(rng, 2, 10)
    return { text: `${divisor * result} : ${divisor}`, answer: result }
  },
}

const DAY_MIX = [
  ['add', 8],
  ['sub', 8],
  ['mul', 7],
  ['div', 7],
]

export function makeTask(rng, day, topic, used = new Set()) {
  const level = levelForDay(day)
  let task
  for (let tries = 0; tries < 50; tries++) {
    task = { topic, ...TOPICS[topic](rng, level) }
    if (!used.has(task.text)) break
  }
  used.add(task.text)
  return task
}

export function makeDayTasks(rng, day) {
  const used = new Set()
  const topics = DAY_MIX.flatMap(([topic, count]) => Array(count).fill(topic))
  return shuffle(rng, topics).map((topic) => makeTask(rng, day, topic, used))
}

export function makeExtraTask(rng, day, tasks) {
  const used = new Set(tasks.map((t) => t.text))
  const topic = DAY_MIX[randInt(rng, 0, DAY_MIX.length - 1)][0]
  return makeTask(rng, day, topic, used)
}
