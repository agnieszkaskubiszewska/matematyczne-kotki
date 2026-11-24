import { useState } from 'react'
import { catColors } from '../game/cats.js'
import { ALL_TOPICS, ENGLISH_EXTRA, MATH_TOPICS, TOPIC_GROUPS, TOPIC_LABELS } from '../game/tasks.js'

const CHIP_LABELS = { ...TOPIC_LABELS, english: `Słówka (+${ENGLISH_EXTRA} szczurów)` }
import { TOTAL_DAYS, isTestMode, playedToday } from '../game/storage.js'
import Sprite from '../pixel/Sprite.jsx'
import { CAT_SIT, CAT_WALK_BLACK, GRAVE, GRAVE_COLORS, RAT_COLORS, RAT_WALK } from '../pixel/sprites.js'

// Wybór kategorii zadań, rozwijany pod przyciskiem „Ratuj kotka!”.
function TopicPicker({ initial, onStart }) {
  const [chosen, setChosen] = useState(() => new Set(initial.filter((t) => ALL_TOPICS.includes(t))))

  const toggle = (topics, on) =>
    setChosen((prev) => {
      const next = new Set(prev)
      topics.forEach((t) => (on ? next.add(t) : next.delete(t)))
      return next
    })

  // słówka są tylko dodatkiem – potrzebna jest chociaż jedna kategoria z matematyki
  const hasMath = MATH_TOPICS.some((t) => chosen.has(t))

  return (
    <div className="topic-picker">
      <p className="picker-title">Wybierz kategorie zadań:</p>
      {TOPIC_GROUPS.map((group) => {
        const all = group.topics.every((t) => chosen.has(t))
        return (
          <div key={group.label} className="picker-group">
            <button className="picker-group-label" onClick={() => toggle(group.topics, !all)}>
              {group.label} {all ? '(odznacz)' : '(zaznacz)'}
            </button>
            <div className="picker-chips">
              {group.topics.map((t) => (
                <button
                  key={t}
                  className={`chip ${chosen.has(t) ? 'on' : ''}`}
                  aria-pressed={chosen.has(t)}
                  onClick={() => toggle([t], !chosen.has(t))}
                >
                  {chosen.has(t) ? '✓ ' : ''}
                  {CHIP_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
        )
      })}
      <button
        className="btn btn-start"
        disabled={!hasMath}
        onClick={() => onStart(ALL_TOPICS.filter((t) => chosen.has(t)))}
      >
        {hasMath ? 'Do walki!' : 'Zaznacz chociaż jedną kategorię z matematyki'}
      </button>
    </div>
  )
}

export default function Menu({ state, onStart, onResume, onChangeTopics, onGo, onReset, onAllowReplay }) {
  const [picking, setPicking] = useState(false)
  const test = isTestMode()
  const finished = state.days.length >= TOTAL_DAYS && !state.battle
  const doneToday = playedToday(state) && !test
  const day = state.battle ? state.battle.day : state.days.length + 1
  const saved = state.days.filter((d) => d.result === 'saved').length
  const lost = state.days.length - saved

  let dayInfo
  if (finished) dayInfo = `Wyzwanie ukończone! Uratowane kotki: ${saved} z ${TOTAL_DAYS}`
  else if (state.battle) dayInfo = `Dzień ${day} z ${TOTAL_DAYS} – kotek wciąż czeka na pomoc!`
  else if (doneToday) dayInfo = `Na dziś to wszystko. Kolejny kotek (dzień ${day}) czeka jutro!`
  else dayInfo = `Dzień ${day} z ${TOTAL_DAYS}`

  return (
    <div className="screen menu">
      <h1 className="title">Matematyczne Kotki</h1>

      <div className="menu-hero" style={{ '--px': 'min(1.1vw, 8px)' }}>
        <Sprite frames={CAT_WALK_BLACK} colors={{ ...catColors('czarny'), W: '#ffffff' }} fps={3} />
        <span className="vs">VS</span>
        <Sprite frames={RAT_WALK} colors={RAT_COLORS} fps={3} />
      </div>

      <p className="day-info">{dayInfo}</p>

      <div className="menu-buttons">
        {!finished && (
          <button
            className="btn btn-big btn-start"
            disabled={doneToday}
            onClick={() => (state.battle ? onResume() : setPicking((p) => !p))}
          >
            {state.battle ? 'Wróć do walki!' : doneToday ? 'Wróć jutro' : 'Ratuj kotka!'}
          </button>
        )}
        {state.battle && (
          <button className="btn btn-small" onClick={() => setPicking((p) => !p)}>
            {picking ? 'Schowaj kategorie' : 'Zmień kategorie zadań'}
          </button>
        )}
        {picking && !doneToday && !finished && (
          <TopicPicker
            initial={state.battle?.topics ?? state.topics ?? MATH_TOPICS}
            onStart={state.battle ? onChangeTopics : onStart}
          />
        )}
        <button className="btn" onClick={() => onGo('room')}>
          Odwiedź kotki ({saved})
        </button>
        <button className="btn" onClick={() => onGo('cemetery')}>
          Odwiedź cmentarz ({lost})
        </button>
        <button className="btn" onClick={() => onGo('mistakes')}>
          Trudne zadania ({state.mistakesLog.length + (state.battle?.wrongAnswers?.length ?? 0)})
        </button>
        {finished && (
          <button
            className="btn"
            onClick={() => confirm('Na pewno zacząć nowe wyzwanie? Kotki i cmentarz zostaną wyczyszczone.') && onReset()}
          >
            Nowe wyzwanie
          </button>
        )}
      </div>

      <DaysTrack state={state} />

      {test && (
        <div className="test-panel">
          <strong>Tryb testowy</strong>
          <button className="btn btn-small" onClick={onAllowReplay}>
            Pozwól zagrać jeszcze raz dziś
          </button>
          <button className="btn btn-small" onClick={() => confirm('Wyczyścić cały postęp?') && onReset()}>
            Wyczyść postęp
          </button>
        </div>
      )}
    </div>
  )
}

function DaysTrack({ state }) {
  return (
    <div className="days-track" style={{ '--px': '3px' }}>
      {Array.from({ length: TOTAL_DAYS }, (_, i) => {
        const record = state.days[i]
        const current = !record && i === state.days.length
        return (
          <div key={i} className={`day-slot ${current ? 'current' : ''}`} title={`Dzień ${i + 1}`}>
            {record?.result === 'saved' && <Sprite frames={[CAT_SIT[0]]} colors={catColors(record.cat.palette)} />}
            {record?.result === 'lost' && <Sprite frames={[GRAVE]} colors={GRAVE_COLORS} />}
            {!record && <span>{i + 1}</span>}
          </div>
        )
      })}
    </div>
  )
}
