import { useCallback, useEffect, useRef, useState } from 'react'
import { catColors } from '../game/cats.js'
import { seededRandom } from '../game/random.js'
import { MAX_MISTAKES, RATS_PER_DAY } from '../game/storage.js'
import {
  TOPIC_LABELS,
  WEEKDAYS,
  WEEKDAYS_SHORT,
  answerText,
  checkAnswer,
  givenText,
  isComplete,
  makeExtraTask,
  needsDay,
  needsTime,
} from '../game/tasks.js'
import Sprite from '../pixel/Sprite.jsx'
import { CAT_WALK, HEART, HEART_COLORS, HEART_EMPTY_COLORS, RAT_COLORS, RAT_WALK } from '../pixel/sprites.js'

// Pozycja (w % szerokości sceny) pierwszego szczura po 0, 1, 2 i 3 błędach.
const FRONT_X = [62, 47, 32, 13]
const QUEUE_GAP = 11
const VISIBLE_RATS = 4
const PRAISE = ['Brawo!', 'Super!', 'Świetnie!', 'Tak jest!', 'Uciekaj, szczurze!', 'Ekstra!', 'Pięknie!']
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', ':']

// Co pokazać w chmurce nad szczurem. Długie zadania są w karcie pod sceną,
// a w chmurce zostaje tylko nazwa kategorii.
function cloudText(task) {
  if (task.long) return task.solved ? answerText(task) : TOPIC_LABELS[task.topic]
  if (task.text.includes('=')) return task.solved ? task.text.replace('?', answerText(task)) : task.text
  return `${task.text} = ${task.solved ? answerText(task) : '?'}`
}

function AnalogClock({ h, m }) {
  const hourAngle = ((h % 12) + m / 60) * 30
  const minuteAngle = m * 6
  return (
    <svg className="analog-clock" viewBox="-50 -50 100 100" role="img" aria-label="zegar">
      <circle r="46" fill="#fff" stroke="var(--ink)" strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => (
        <text key={i} x={36 * Math.sin((i + 1) * (Math.PI / 6))} y={-36 * Math.cos((i + 1) * (Math.PI / 6)) + 4}>
          {i + 1}
        </text>
      ))}
      <line y2="-22" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" transform={`rotate(${hourAngle})`} />
      <line y2="-34" stroke="#d94848" strokeWidth="3" strokeLinecap="round" transform={`rotate(${minuteAngle})`} />
      <circle r="4" fill="var(--ink)" />
    </svg>
  )
}

export default function Battle({ battle, onChange, onFinish, onExit }) {
  const [input, setInput] = useState('')
  const [day, setDay] = useState(null)
  // idle – czekamy na odpowiedź; warn – pierwsza zła odpowiedź, jest druga szansa;
  // hit – szczur ucieka; miss – szczur się zbliża; caught – koniec
  const [phase, setPhase] = useState('idle')
  const [shownTask, setShownTask] = useState(null)
  const [fleeingRat, setFleeingRat] = useState(null)
  const [message, setMessage] = useState(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))

  const task = shownTask ?? battle.tasks[battle.index]
  const step = Math.min(battle.mistakes, MAX_MISTAKES)
  const frontX = phase === 'caught' ? FRONT_X[3] : FRONT_X[Math.min(step, 2)]

  const submit = useCallback(() => {
    const current = battle.tasks[battle.index]
    if (phase !== 'idle' || !isComplete(current, input, day)) return
    const given = givenText(current, input, day)
    const correct = checkAnswer(current, input, day)
    const wrongAnswers = battle.wrongAnswers ?? []
    setInput('')
    setDay(null)

    // Pierwsza zła odpowiedź na to zadanie: tylko ostrzeżenie i druga szansa.
    if (!correct && !battle.warned) {
      const entry = {
        day: battle.day,
        topic: current.topic,
        text: current.text,
        answer: answerText(current),
        long: current.long,
        given: [given],
      }
      onChange({ ...battle, warned: true, wrongAnswers: [...wrongAnswers, entry] })
      setPhase('warn')
      setMessage({ kind: 'warn', text: 'Zła odpowiedź! Spróbuj jeszcze raz' })
      later(() => setPhase('idle'), 900)
      return
    }

    const next = {
      ...battle,
      index: battle.index + 1,
      chased: battle.chased + (correct ? 1 : 0),
      mistakes: battle.mistakes + (correct ? 0 : 1),
      warned: false,
    }
    if (battle.warned) {
      // druga próba – dopisujemy jej wynik do wpisu z pierwszej
      const last = wrongAnswers[wrongAnswers.length - 1]
      const updated = { ...last, fixed: correct, given: correct ? last.given : [...last.given, given] }
      next.wrongAnswers = [...wrongAnswers.slice(0, -1), updated]
    }
    if (next.index >= next.tasks.length) {
      next.tasks = [...next.tasks, makeExtraTask(seededRandom(Date.now()), next.tasks, battle.topics)]
    }
    onChange(next)

    if (correct) {
      setFleeingRat(battle.chased)
      setPhase('hit')
      setMessage({ kind: 'good', text: PRAISE[Math.floor(Math.random() * PRAISE.length)] })
      later(() => {
        setFleeingRat(null)
        setMessage(null)
        if (next.chased >= RATS_PER_DAY) onFinish(next, 'saved')
        else setPhase('idle')
      }, 800)
    } else {
      setShownTask({ ...current, solved: true })
      setPhase('miss')
      setMessage({ kind: 'bad', text: `Ojej! Dobra odpowiedź: ${answerText(current)}` })
      if (next.mistakes >= MAX_MISTAKES) {
        later(() => setPhase('caught'), 2400)
        later(() => onFinish(next, 'lost'), 4200)
      } else {
        later(() => {
          setShownTask(null)
          setMessage(null)
          setPhase('idle')
        }, current.long ? 3600 : 2400)
      }
    }
  }, [phase, input, day, battle, onChange, onFinish])

  const press = useCallback(
    (key) => {
      if (phase !== 'idle') return
      if (key === 'ok') return submit()
      if (key === 'del') return setInput((v) => v.slice(0, -1))
      const current = battle.tasks[battle.index]
      if (key === ':' && (!needsTime(current) || input.includes(':'))) return
      setInput((v) => {
        if (v.length >= 5) return v
        // zera na początku liczby są zbędne, ale w godzinie "08:30" już nie
        return needsTime(current) ? v + key : (v + key).replace(/^0+(?=\d)/, '')
      })
    },
    [phase, submit, battle, input],
  )

  useEffect(() => {
    function onKey(e) {
      const key = /^\d$/.test(e.key) ? e.key : { Backspace: 'del', Enter: 'ok', ':': ':', '.': ':' }[e.key]
      if (!key) return
      // bez tego Enter "kliknąłby" też przycisk klawiatury ekranowej
      e.preventDefault()
      press(key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [press])

  const rats = []
  for (let i = 0; i < VISIBLE_RATS; i++) {
    const id = battle.chased + i
    if (id >= RATS_PER_DAY || id === fleeingRat) continue
    rats.push({ id, x: frontX + i * QUEUE_GAP })
  }
  const ratsLeft = RATS_PER_DAY - battle.chased
  const current = battle.tasks[battle.index]
  const timeMode = needsTime(current)
  const dayMode = needsDay(current)

  return (
    <div className="screen battle">
      <div className="battle-hud">
        <button className="btn btn-small" onClick={onExit}>
          Menu
        </button>
        <span className="hud-day">Dzień {battle.day}</span>
        <span className="hud-hearts" style={{ '--px': '3px' }}>
          {Array.from({ length: MAX_MISTAKES }, (_, i) => (
            <Sprite key={i} frames={[HEART]} colors={i < MAX_MISTAKES - battle.mistakes ? HEART_COLORS : HEART_EMPTY_COLORS} />
          ))}
        </span>
      </div>

      <div className={`stage ${phase === 'miss' || phase === 'warn' ? 'shake' : ''} ${task.long ? 'compact' : ''}`}>
        <div className="stage-inner" style={{ '--px': '0.68cqw' }}>
          <div className="moon" />
          <div className={`battle-cat ${phase === 'hit' ? 'pounce' : ''} ${phase === 'caught' ? 'caught' : ''}`}>
            <Sprite frames={CAT_WALK} colors={catColors(battle.cat.palette)} fps={phase === 'hit' ? 8 : 0} />
            <span className="name-tag">{battle.cat.name}</span>
          </div>

          {rats.map((rat) => (
            <div key={rat.id} className="rat" style={{ left: `${rat.x}%` }}>
              <Sprite frames={RAT_WALK} colors={RAT_COLORS} fps={3} />
            </div>
          ))}
          {fleeingRat !== null && (
            <div key={`flee-${fleeingRat}`} className="rat fleeing" style={{ left: `${frontX}%` }}>
              <Sprite frames={RAT_WALK} colors={RAT_COLORS} fps={10} flip />
            </div>
          )}

          {/* przy zadaniu tekstowym chmurka ma tylko nazwę kategorii, więc ustępuje miejsca komunikatom */}
          {phase !== 'caught' && phase !== 'hit' && !(task.long && message) && (
            <div
              className={`cloud ${task.solved ? 'cloud-solved' : battle.warned ? 'cloud-retry' : ''}`}
              style={{ left: `${frontX + 7}%` }}
            >
              {cloudText(task)}
            </div>
          )}

          {message && <div className={`battle-message ${message.kind}`}>{message.text}</div>}
          <div className="rats-left">Szczury: {ratsLeft}</div>
        </div>
      </div>

      {task.long && phase !== 'caught' && (
        <div className={`task-card ${battle.warned && !task.solved ? 'cloud-retry' : ''}`}>
          <span className="task-topic">{TOPIC_LABELS[task.topic]}</span>
          {task.clock && <AnalogClock {...task.clock} />}
          <p className="task-text">{task.text}</p>
          {task.solved && <p className="task-solution">Dobra odpowiedź: {answerText(task)}</p>}
        </div>
      )}

      <div className="answer-box">
        {dayMode && (
          <div className="weekdays">
            {WEEKDAYS_SHORT.map((label, i) => (
              <button
                key={label}
                className={`btn key weekday ${day === i ? 'on' : ''}`}
                title={WEEKDAYS[i]}
                disabled={phase !== 'idle'}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setDay(i)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <div className={`answer-display ${current.kind === 'dayTime' ? 'small' : ''}`}>
          {dayMode && <span className={day === null ? 'placeholder' : ''}>{day === null ? 'dzień?' : WEEKDAYS[day]}</span>}
          {dayMode && current.kind === 'dayTime' && ', '}
          {current.kind !== 'weekday' && (input || <span className="placeholder">{timeMode ? 'godz:min' : '?'}</span>)}
        </div>
        {current.kind !== 'weekday' && (
          <div className="keypad">
            {KEYS.map((key) => (
              <button
                key={key}
                className="btn key"
                disabled={phase !== 'idle' || (key === ':' && !timeMode)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => press(key)}
              >
                {key === 'del' ? '⌫' : key}
              </button>
            ))}
          </div>
        )}
        <button
          className="btn key key-ok"
          disabled={phase !== 'idle' || !isComplete(current, input, day)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => press('ok')}
        >
          OK
        </button>
      </div>
    </div>
  )
}
