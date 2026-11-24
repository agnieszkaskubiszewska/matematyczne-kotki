import { makeEnglishTask } from './english.js'
import { pick, randInt as r, shuffle } from './random.js'

// Gracz ma drugą szansę przy każdym zadaniu, więc zadania są wymagające
// od pierwszego dnia: dodawanie i odejmowanie do 300, mnożenie i dzielenie
// na wyższych liczbach z tabliczki (np. 8 · 9).
const MAX = 300

// Zadanie: { topic, text, answer, kind, long?, clock? }
// kind: 'number' – liczba; 'time' – godzina (answer w minutach od północy);
// 'time12' – godzina z tarczy zegara (rano/wieczór bez znaczenia);
// 'weekday' – dzień tygodnia (answer to indeks w WEEKDAYS);
// 'dayTime' – dzień tygodnia i godzina (answer: { day, minutes });
// 'choice' – wybór jednej z options (answer to indeks; słówka angielskie).
// long – zadanie tekstowe, wyświetlane w karcie pod sceną zamiast w chmurce.

export const WEEKDAYS = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela']
export const WEEKDAYS_SHORT = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd']

export const TOPIC_LABELS = {
  add: 'Dodawanie',
  sub: 'Odejmowanie',
  mul: 'Mnożenie',
  div: 'Dzielenie',
  clock: 'Zegar',
  calendar: 'Kalendarz',
  travel: 'Podróż',
  money: 'Pieniądze',
  length: 'Długość',
  mass: 'Masa',
  capacity: 'Pojemność',
  roman: 'Liczby rzymskie',
  perimeter: 'Obwód',
  order: 'Kolejność działań',
  missing: 'Brakująca liczba',
  story: 'Zadanie tekstowe',
  english: 'Angielski',
}

const NAMES = ['Ola', 'Kuba', 'Zosia', 'Antek', 'Hania', 'Franek', 'Lena', 'Staś', 'Maja', 'Tymek']

// miesiące bez lutego – jego długość zależy od roku
const MONTHS = [
  { name: 'marzec', of: 'marca', days: 31 },
  { name: 'kwiecień', of: 'kwietnia', days: 30 },
  { name: 'maj', of: 'maja', days: 31 },
  { name: 'czerwiec', of: 'czerwca', days: 30 },
  { name: 'lipiec', of: 'lipca', days: 31 },
  { name: 'sierpień', of: 'sierpnia', days: 31 },
  { name: 'wrzesień', of: 'września', days: 30 },
  { name: 'październik', of: 'października', days: 31 },
  { name: 'listopad', of: 'listopada', days: 30 },
  { name: 'grudzień', of: 'grudnia', days: 31 },
]

// Polska odmiana: 1 kotek, 2 kotki, 5 kotków, 22 kotki, 12 kotków
function plural(n, one, few, many) {
  if (n === 1) return one
  const d = n % 10
  const t = n % 100
  return d >= 2 && d <= 4 && (t < 12 || t > 14) ? few : many
}

export function formatTime(minutes) {
  const m = ((minutes % 1440) + 1440) % 1440
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
}

function toRoman(n) {
  const symbols = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let out = ''
  for (const [value, symbol] of symbols) {
    while (n >= value) {
      out += symbol
      n -= value
    }
  }
  return out
}

const t = formatTime
const variant = (rng, variants) => pick(rng, variants)(rng)

const TOPICS = {
  add(rng) {
    const a = r(rng, 40, MAX - 40)
    const b = r(rng, 15, MAX - a)
    return { text: `${a} + ${b}`, answer: a + b }
  },
  sub(rng) {
    const a = r(rng, 100, MAX)
    const b = r(rng, 15, a - 10)
    return { text: `${a} − ${b}`, answer: a - b }
  },
  mul(rng) {
    const a = r(rng, 6, 9)
    const b = r(rng, 4, 9)
    return rng() < 0.5
      ? { text: `${a} · ${b}`, answer: a * b }
      : { text: `${b} · ${a}`, answer: a * b }
  },
  div(rng) {
    const divisor = r(rng, 6, 9)
    const result = r(rng, 4, 9)
    return { text: `${divisor * result} : ${divisor}`, answer: result }
  },

  clock: (rng) =>
    variant(rng, [
      (rng) => {
        const h = r(rng, 1, 12)
        const m = r(rng, 0, 11) * 5
        return { text: 'Która godzina jest na zegarze?', kind: 'time12', answer: h * 60 + m, clock: { h, m } }
      },
      (rng) => {
        const start = r(rng, 6, 20) * 60 + r(rng, 0, 11) * 5
        const add = r(rng, 3, 19) * 5
        return { text: `Jest ${t(start)}. Która godzina będzie za ${add} minut?`, kind: 'time', answer: (start + add) % 1440 }
      },
      (rng) => {
        const start = r(rng, 8, 18) * 60 + r(rng, 0, 11) * 5
        const length = r(rng, 6, 30) * 5
        const event = pick(rng, ['Film', 'Mecz', 'Koncert', 'Przedstawienie'])
        return {
          text: `${event} zaczyna się o ${t(start)}, a kończy o ${t(start + length)}. Ile minut trwa?`,
          answer: length,
        }
      },
      (rng) => {
        const start = r(rng, 0, 23) * 60
        const hours = r(rng, 25, 100)
        return {
          text: `Jest ${t(start)}. Która godzina będzie za ${hours} ${plural(hours, 'godzinę', 'godziny', 'godzin')}?`,
          kind: 'time',
          answer: (start + hours * 60) % 1440,
        }
      },
      (rng) => {
        const h = r(rng, 2, 5)
        const m = r(rng, 1, 11) * 5
        return { text: `Ile minut to ${h} ${plural(h, 'godzina', 'godziny', 'godzin')} i ${m} minut?`, answer: h * 60 + m }
      },
    ]),

  calendar: (rng) =>
    variant(rng, [
      (rng) => {
        const day = r(rng, 0, 6)
        const n = r(rng, 8, 40)
        return {
          text: `Dziś jest ${WEEKDAYS[day]}. Jaki dzień tygodnia będzie za ${n} dni?`,
          kind: 'weekday',
          answer: (day + n) % 7,
        }
      },
      (rng) => {
        const i = r(rng, 0, MONTHS.length - 2)
        const [a, b] = [MONTHS[i], MONTHS[i + 1]]
        return { text: `Ile dni mają razem ${a.name} i ${b.name}?`, answer: a.days + b.days }
      },
      (rng) => {
        const w = r(rng, 2, 6)
        const d = r(rng, 1, 6)
        return {
          text: `Ile dni to ${w} ${plural(w, 'tydzień', 'tygodnie', 'tygodni')} i ${d} ${plural(d, 'dzień', 'dni', 'dni')}?`,
          answer: w * 7 + d,
        }
      },
      (rng) => {
        const i = r(rng, 0, MONTHS.length - 2)
        const d1 = r(rng, 10, MONTHS[i].days)
        const d2 = r(rng, 1, 20)
        return {
          text: `Dziś jest ${d1} ${MONTHS[i].of}. Za ile dni będzie ${d2} ${MONTHS[i + 1].of}?`,
          answer: MONTHS[i].days - d1 + d2,
        }
      },
      (rng) => {
        const n = r(rng, 2, 9)
        return { text: `Ile godzin mają ${n} ${plural(n, 'doba', 'doby', 'dób')}?`, answer: n * 24 }
      },
    ]),

  // dzień tygodnia i godzina po długiej podróży
  travel: (rng) => {
    const day = r(rng, 0, 6)
    const who = pick(rng, NAMES)
    const done = (start, plus, text) => {
      const total = start + plus
      return {
        text,
        kind: 'dayTime',
        answer: { day: (day + Math.floor(total / 1440)) % 7, minutes: total % 1440 },
      }
    }
    return variant(rng, [
      () => {
        const start = r(rng, 6, 20) * 60
        const days = r(rng, 1, 6)
        const hours = r(rng, 1, 12)
        return done(
          start,
          days * 1440 + hours * 60,
          `Jest ${WEEKDAYS[day]}, godzina ${t(start)}. ${who} wyrusza w podróż, która trwa ${days} ` +
            `${plural(days, 'dzień', 'dni', 'dni')} i ${hours} ${plural(hours, 'godzinę', 'godziny', 'godzin')}. ` +
            'W jaki dzień tygodnia i o której godzinie dociera na miejsce?',
        )
      },
      () => {
        const start = r(rng, 0, 23) * 60
        const hours = r(rng, 20, 80)
        return done(
          start,
          hours * 60,
          `Jest ${WEEKDAYS[day]}, godzina ${t(start)}. Pociąg jedzie ${hours} ` +
            `${plural(hours, 'godzinę', 'godziny', 'godzin')}. W jaki dzień tygodnia i o której godzinie dojeżdża?`,
        )
      },
      () => {
        const start = r(rng, 6, 20) * 60 + pick(rng, [0, 15, 30, 45])
        const days = r(rng, 2, 9)
        return done(
          start,
          days * 1440,
          `Jest ${WEEKDAYS[day]}, godzina ${t(start)}. ${who} podróżuje przez ${days} dni bez przerwy. ` +
            'Jaki będzie dzień tygodnia i która godzina, gdy podróż się skończy?',
        )
      },
    ])
  },

  money: (rng) =>
    variant(rng, [
      (rng) => {
        const budget = pick(rng, [20, 50, 100, 200])
        const [item1, item2] = shuffle(rng, ['książkę', 'piórnik', 'zabawkę', 'farby', 'puzzle', 'kredki'])
        const p1 = r(rng, 3, Math.floor(budget * 0.4))
        const p2 = r(rng, 3, Math.floor(budget * 0.4))
        return {
          text: `${pick(rng, NAMES)} ma ${budget} zł. Kupuje ${item1} za ${p1} zł i ${item2} za ${p2} zł. Ile złotych reszty dostaje?`,
          answer: budget - p1 - p2,
        }
      },
      (rng) => {
        const price = r(rng, 2, 9)
        const n = r(rng, 3, 9)
        return {
          text: `Zeszyt kosztuje ${price} zł. Ile złotych trzeba zapłacić za ${n} ${plural(n, 'zeszyt', 'zeszyty', 'zeszytów')}?`,
          answer: price * n,
        }
      },
      (rng) => {
        const zl = r(rng, 1, 9)
        const gr = r(rng, 1, 19) * 5
        return { text: `Ile groszy to ${zl} zł ${gr} gr?`, answer: zl * 100 + gr }
      },
      (rng) => {
        const gr = r(rng, 2, 9) * 10
        const n = r(rng, 2, 9)
        return {
          text: `Lizak kosztuje ${gr} gr. Ile groszy trzeba zapłacić za ${n} ${plural(n, 'lizak', 'lizaki', 'lizaków')}?`,
          answer: gr * n,
        }
      },
      (rng) => {
        const a = r(rng, 1, 4)
        const b = r(rng, 1, 6)
        const c = r(rng, 1, 5)
        return {
          text:
            `${pick(rng, NAMES)} ma ${a} ${plural(a, 'banknot', 'banknoty', 'banknotów')} po 20 zł, ` +
            `${b} ${plural(b, 'monetę', 'monety', 'monet')} po 5 zł i ${c} ${plural(c, 'monetę', 'monety', 'monet')} po 2 zł. ` +
            'Ile ma złotych?',
          answer: a * 20 + b * 5 + c * 2,
        }
      },
    ]),

  length: (rng) =>
    variant(rng, [
      (rng) => {
        const m = r(rng, 1, 4)
        const cm = r(rng, 1, 99)
        return { text: `Ile centymetrów to ${m} m ${cm} cm?`, answer: m * 100 + cm }
      },
      (rng) => {
        const cm = r(rng, 2, 30)
        const mm = r(rng, 1, 9)
        return { text: `Ile milimetrów to ${cm} cm ${mm} mm?`, answer: cm * 10 + mm }
      },
      (rng) => {
        const n = r(rng, 2, 6)
        const lap = pick(rng, [100, 200, 250, 400])
        return {
          text: `${pick(rng, NAMES)} biegnie ${n} ${plural(n, 'okrążenie', 'okrążenia', 'okrążeń')} po ${lap} m. Ile metrów przebiega?`,
          answer: n * lap,
        }
      },
      (rng) => {
        const km = r(rng, 1, 5)
        const m = r(rng, 1, 9) * 100
        return { text: `Ile metrów to ${km} km ${m} m?`, answer: km * 1000 + m }
      },
      (rng) => {
        const m = r(rng, 1, 2)
        const cut = r(rng, 15, 85)
        return {
          text: `Wstążka ma ${m} m długości. Odcinamy ${cut} cm. Ile centymetrów wstążki zostaje?`,
          answer: m * 100 - cut,
        }
      },
    ]),

  mass: (rng) =>
    variant(rng, [
      (rng) => {
        const kg = r(rng, 1, 4)
        const dag = r(rng, 1, 99)
        return { text: `Ile dekagramów to ${kg} kg ${dag} dag?`, answer: kg * 100 + dag }
      },
      (rng) => {
        const dag = r(rng, 2, 30)
        return { text: `Ile gramów to ${dag} dag?`, answer: dag * 10 }
      },
      (rng) => {
        const kg = r(rng, 2, 5)
        const kg2 = r(rng, 1, kg - 1)
        const dag = r(rng, 1, 19) * 5
        return {
          text: `Torba z jabłkami waży ${kg} kg, a torba z gruszkami ${kg2} kg ${dag} dag. O ile dekagramów cięższa jest torba z jabłkami?`,
          answer: kg * 100 - kg2 * 100 - dag,
        }
      },
      (rng) => {
        const n = r(rng, 2, 9)
        const kg = pick(rng, [5, 10, 15, 20, 25])
        return { text: `Ile kilogramów mąki jest w ${n} workach po ${kg} kg?`, answer: n * kg }
      },
      (rng) => {
        const kg = r(rng, 1, 3)
        return { text: `Ile dekagramów to ${kg} i pół kilograma?`, answer: kg * 100 + 50 }
      },
    ]),

  capacity: (rng) =>
    variant(rng, [
      (rng) => {
        const l = r(rng, 2, 6)
        return { text: `Ile szklanek po ćwierć litra można napełnić z ${l} litrów soku?`, answer: l * 4 }
      },
      (rng) => {
        const l = r(rng, 2, 9)
        return { text: `Ile półlitrowych butelek można napełnić z ${l} litrów wody?`, answer: l * 2 }
      },
      (rng) => {
        const times = r(rng, 2, 4)
        const each = r(rng, 1, 3)
        const total = r(rng, times * each + 2, 20)
        return {
          text: `W wiadrze jest ${total} litrów wody. Wylewamy ${times} razy po ${each} ${plural(each, 'litr', 'litry', 'litrów')}. Ile litrów zostaje?`,
          answer: total - times * each,
        }
      },
      (rng) => {
        const n = r(rng, 2, 9)
        const l = r(rng, 5, 12)
        return { text: `Ile litrów wody mieści się w ${n} wiadrach po ${l} litrów?`, answer: n * l }
      },
    ]),

  roman: (rng) =>
    variant(rng, [
      (rng) => {
        const n = r(rng, 4, 39)
        return { text: `Jaką liczbę zapisano cyframi rzymskimi jako ${toRoman(n)}?`, answer: n }
      },
      (rng) => {
        const month = r(rng, 1, 12)
        return {
          text: `Na liście jest data ${r(rng, 1, 28)}.${toRoman(month)}. Który to miesiąc? Podaj jego numer.`,
          answer: month,
        }
      },
    ]),

  perimeter: (rng) =>
    variant(rng, [
      (rng) => {
        const a = r(rng, 3, 15)
        const b = r(rng, 2, a - 1)
        return { text: `Prostokąt ma boki ${a} cm i ${b} cm. Ile centymetrów ma jego obwód?`, answer: 2 * (a + b) }
      },
      (rng) => {
        const a = r(rng, 3, 25)
        return { text: `Kwadrat ma bok ${a} cm. Ile centymetrów ma jego obwód?`, answer: 4 * a }
      },
      (rng) => {
        const a = r(rng, 3, 15)
        return { text: `Kwadrat ma obwód ${4 * a} cm. Ile centymetrów ma jego bok?`, answer: a }
      },
      (rng) => {
        const a = r(rng, 3, 15)
        const b = r(rng, 3, 15)
        const c = r(rng, Math.abs(a - b) + 1, a + b - 1)
        return { text: `Trójkąt ma boki ${a} cm, ${b} cm i ${c} cm. Ile centymetrów ma jego obwód?`, answer: a + b + c }
      },
      (rng) => {
        const a = r(rng, 5, 20)
        const b = r(rng, 3, a - 1)
        return {
          text: `Ogródek ma kształt prostokąta o bokach ${a} m i ${b} m. Ile metrów siatki potrzeba na płot dookoła?`,
          answer: 2 * (a + b),
        }
      },
    ]),

  order: (rng) =>
    variant(rng, [
      (rng) => {
        const [a, b, c] = [r(rng, 10, 60), r(rng, 2, 9), r(rng, 2, 9)]
        return { text: `${a} + ${b} · ${c}`, answer: a + b * c }
      },
      (rng) => {
        const [a, b] = [r(rng, 3, 9), r(rng, 3, 9)]
        const c = r(rng, 2, Math.min(30, a * b - 1))
        return { text: `${a} · ${b} − ${c}`, answer: a * b - c }
      },
      (rng) => {
        const [a, b, c] = [r(rng, 2, 12), r(rng, 2, 12), r(rng, 2, 6)]
        return { text: `(${a} + ${b}) · ${c}`, answer: (a + b) * c }
      },
      (rng) => {
        const [c, q] = [r(rng, 2, 9), r(rng, 2, 9)]
        const a = r(rng, q + 1, q + 60)
        return { text: `${a} − ${c * q} : ${c}`, answer: a - q }
      },
      (rng) => {
        const b = r(rng, 10, 20)
        const [a, c] = [r(rng, 2, 9), r(rng, 2, b - 1)]
        return { text: `${a} · (${b} − ${c})`, answer: a * (b - c) }
      },
    ]),

  // równania z okienkiem – w tekście jest już znak "=" i "?"
  missing: (rng) =>
    variant(rng, [
      (rng) => {
        const a = r(rng, 20, 200)
        const b = r(rng, 15, MAX - a)
        return { text: `? + ${b} = ${a + b}`, answer: a }
      },
      (rng) => {
        const a = r(rng, 50, MAX)
        const x = r(rng, 10, a - 5)
        return { text: `${a} − ? = ${a - x}`, answer: x }
      },
      (rng) => {
        const [x, b] = [r(rng, 3, 9), r(rng, 4, 9)]
        return { text: `? · ${b} = ${x * b}`, answer: x }
      },
      (rng) => {
        const [b, c] = [r(rng, 2, 9), r(rng, 3, 9)]
        return { text: `? : ${b} = ${c}`, answer: b * c }
      },
      (rng) => {
        const [a, x] = [r(rng, 4, 9), r(rng, 3, 9)]
        return { text: `${a} · ? = ${a * x}`, answer: x }
      },
    ]),

  story: (rng) => {
    const [n1, n2] = shuffle(rng, NAMES)
    return variant(rng, [
      () => {
        const total = r(rng, 20, 30)
        const girls = r(rng, 8, total - 8)
        return { text: `W klasie jest ${total} dzieci. Dziewczynek jest ${girls}. Ilu jest chłopców?`, answer: total - girls }
      },
      () => {
        const [n, k] = [r(rng, 3, 9), r(rng, 4, 12)]
        return {
          text: `${n1} ma ${n} ${plural(n, 'pudełko', 'pudełka', 'pudełek')} kredek, w każdym po ${k} ${plural(k, 'kredka', 'kredki', 'kredek')}. Ile kredek ma razem?`,
          answer: n * k,
        }
      },
      () => {
        const [friends, each] = [r(rng, 3, 9), r(rng, 3, 9)]
        const total = friends * each
        return {
          text: `${n1} ma ${total} ${plural(total, 'naklejkę', 'naklejki', 'naklejek')} i dzieli je po równo między ${friends} kolegów. Ile naklejek dostaje każdy?`,
          answer: each,
        }
      },
      () => {
        const [a, diff] = [r(rng, 60, 150), r(rng, 10, 50)]
        return { text: `${n1} ma ${a} zł, a ${n2} o ${diff} zł mniej. Ile złotych mają razem?`, answer: 2 * a - diff }
      },
      () => {
        const [base, k] = [r(rng, 3, 12), r(rng, 2, 5)]
        return {
          text: `${n1} ma ${base} ${plural(base, 'kulkę', 'kulki', 'kulek')}, a ${n2} ${k} razy więcej. Ile kulek ma ${n2}?`,
          answer: base * k,
        }
      },
      () => {
        const [rows, per] = [r(rng, 4, 9), r(rng, 5, 9)]
        const done = r(rng, 5, rows * per - 5)
        return {
          text: `W sadzie rośnie ${rows} ${plural(rows, 'rząd', 'rzędy', 'rzędów')} drzew, po ${per} drzew w każdym rzędzie. Zerwano już jabłka z ${done} drzew. Z ilu drzew trzeba jeszcze zerwać jabłka?`,
          answer: rows * per - done,
        }
      },
    ])
  },
}

// Kategorie do wyboru przed walką, pogrupowane jak w menu.
export const TOPIC_GROUPS = [
  { label: 'Liczenie', topics: ['add', 'sub', 'mul', 'div', 'order', 'missing'] },
  { label: 'Czas', topics: ['clock', 'calendar', 'travel'] },
  { label: 'Pieniądze i miary', topics: ['money', 'length', 'mass', 'capacity'] },
  { label: 'Inne', topics: ['roman', 'perimeter', 'story'] },
  { label: 'Angielski', topics: ['english'] },
]

export const ALL_TOPICS = TOPIC_GROUPS.flatMap((g) => g.topics)
export const MATH_TOPICS = ALL_TOPICS.filter((t) => t !== 'english')

// Słówka nie zabierają miejsca zadaniom matematycznym – dochodzą do nich
// jako dodatkowe szczury.
export const ENGLISH_EXTRA = 10

const SHORT_TOPICS = new Set(['add', 'sub', 'mul', 'div', 'order', 'missing'])

export function makeTask(rng, topic, used = new Set()) {
  let task
  for (let tries = 0; tries < 50; tries++) {
    task = { topic, kind: 'number', ...(topic === 'english' ? makeEnglishTask(rng) : TOPICS[topic](rng)) }
    if (!SHORT_TOPICS.has(topic)) task.long = true
    if (!used.has(taskKey(task))) break
  }
  used.add(taskKey(task))
  return task
}

function taskKey(task) {
  return task.clock ? `${task.text} ${task.clock.h}:${task.clock.m}` : task.text
}

// Ile szczurów przychodzi danego dnia: 30 z zadaniami z matematyki
// i 10 więcej, jeśli zaznaczono angielski.
export function ratsFor(topics, mathRats) {
  return mathRats + (topics.includes('english') ? ENGLISH_EXTRA : 0)
}

// Wybrane kategorie matematyczne dzielą się zadaniami po równo; przy nierównym
// podziale losujemy, które kategorie dostaną jedno zadanie więcej.
// Słówka angielskie to co czwarte zadanie (10 z 40), wymieszane z resztą.
export function makeDayTasks(rng, count, topics = MATH_TOPICS) {
  const used = new Set()
  const math = topics.filter((t) => t !== 'english')
  const english = topics.includes('english') ? Math.round((count * ENGLISH_EXTRA) / (30 + ENGLISH_EXTRA)) : 0
  const order = shuffle(rng, math)
  const list = Array.from({ length: count - english }, (_, i) => order[i % order.length])
  for (let i = 0; i < english; i++) list.push('english')
  return shuffle(rng, list).map((topic) => makeTask(rng, topic, used))
}

// Zapasowe zadanie, gdy po błędach zabraknie zadań – zawsze z matematyki.
export function makeExtraTask(rng, tasks, topics = MATH_TOPICS) {
  const used = new Set(tasks.map(taskKey))
  const math = topics.filter((t) => t !== 'english')
  return makeTask(rng, pick(rng, math.length ? math : MATH_TOPICS), used)
}

// ---------- Sprawdzanie i wyświetlanie odpowiedzi ----------

// "14:05", "14.05" albo "1405" → minuty od północy; "14" → 14:00
export function parseTime(input) {
  const parts = input.split(':')
  let h
  let m
  if (parts.length === 2) [h, m] = parts.map((p) => (p === '' ? NaN : Number(p)))
  else if (input.length <= 2) [h, m] = [Number(input), 0]
  else [h, m] = [Number(input.slice(0, -2)), Number(input.slice(-2))]
  if (!Number.isInteger(h) || !Number.isInteger(m) || h > 24 || m > 59) return null
  return (h * 60 + m) % 1440
}

export function needsTime(task) {
  return task.kind === 'time' || task.kind === 'time12' || task.kind === 'dayTime'
}

export function needsDay(task) {
  return task.kind === 'weekday' || task.kind === 'dayTime'
}

export function needsChoice(task) {
  return task.kind === 'choice'
}

// Trzeci parametr to wybrany przycisk: dzień tygodnia albo odpowiedź do wyboru.
export function isComplete(task, input, day) {
  if ((needsDay(task) || needsChoice(task)) && day === null) return false
  if (task.kind === 'weekday' || task.kind === 'choice') return true
  return input !== ''
}

export function checkAnswer(task, input, day) {
  switch (task.kind) {
    case 'time':
      return parseTime(input) === task.answer
    case 'time12':
      return parseTime(input) !== null && parseTime(input) % 720 === task.answer % 720
    case 'weekday':
    case 'choice':
      return day === task.answer
    case 'dayTime':
      return day === task.answer.day && parseTime(input) === task.answer.minutes
    default:
      return !input.includes(':') && Number(input) === task.answer
  }
}

export function answerText(task) {
  switch (task.kind) {
    case 'time':
    case 'time12':
      return formatTime(task.answer)
    case 'weekday':
      return WEEKDAYS[task.answer]
    case 'choice':
      return task.options[task.answer]
    case 'dayTime':
      return `${WEEKDAYS[task.answer.day]}, ${formatTime(task.answer.minutes)}`
    default:
      return String(task.answer)
  }
}

export function givenText(task, input, day) {
  if (task.kind === 'weekday') return WEEKDAYS[day]
  if (task.kind === 'choice') return task.options[day]
  if (task.kind === 'dayTime') return `${WEEKDAYS[day]}, ${input}`
  return input
}
