// Postęp gry trzymamy w localStorage przeglądarki – GitHub Pages
// to statyczna strona, więc nie ma serwera ani bazy danych.
const KEY = 'matematyczne-kotki-v1'

export const TOTAL_DAYS = 30
export const RATS_PER_DAY = 30
export const MAX_MISTAKES = 3

export function todayStr(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function newState() {
  return {
    seed: Math.floor(Math.random() * 1e9),
    // { day, date, result: 'saved' | 'lost', cat: { name, palette } }
    days: [],
    // trwająca walka: { day, date, cat, tasks, index, chased, mistakes }
    battle: null,
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...newState(), ...JSON.parse(raw) }
  } catch {
    // uszkodzony zapis – zaczynamy od nowa
  }
  return newState()
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // brak miejsca albo tryb prywatny – gra działa dalej bez zapisu
  }
}

export function isTestMode() {
  return new URLSearchParams(window.location.search).has('test')
}

export function playedToday(state) {
  return state.days.some((d) => d.date === todayStr())
}
