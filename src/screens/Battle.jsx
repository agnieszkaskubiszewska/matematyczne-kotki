import { useCallback, useEffect, useRef, useState } from 'react'
import { catColors } from '../game/cats.js'
import { seededRandom } from '../game/random.js'
import { MAX_MISTAKES, RATS_PER_DAY } from '../game/storage.js'
import { makeExtraTask } from '../game/tasks.js'
import Sprite from '../pixel/Sprite.jsx'
import { CAT_WALK, HEART, HEART_COLORS, HEART_EMPTY_COLORS, RAT_COLORS, RAT_WALK } from '../pixel/sprites.js'

// Pozycja (w % szerokości sceny) pierwszego szczura po 0, 1, 2 i 3 błędach.
const FRONT_X = [62, 47, 32, 13]
const QUEUE_GAP = 11
const VISIBLE_RATS = 4
const PRAISE = ['Brawo!', 'Super!', 'Świetnie!', 'Tak jest!', 'Uciekaj, szczurze!', 'Ekstra!', 'Pięknie!']

export default function Battle({ battle, onChange, onFinish, onExit }) {
  const [input, setInput] = useState('')
  // idle – czekamy na odpowiedź; hit – szczur ucieka; miss – szczur się zbliża; caught – koniec
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
    if (phase !== 'idle' || input === '') return
    const current = battle.tasks[battle.index]
    const correct = Number(input) === current.answer
    const next = {
      ...battle,
      index: battle.index + 1,
      chased: battle.chased + (correct ? 1 : 0),
      mistakes: battle.mistakes + (correct ? 0 : 1),
    }
    if (next.index >= next.tasks.length) {
      next.tasks = [...next.tasks, makeExtraTask(seededRandom(Date.now()), battle.day, next.tasks)]
    }
    setInput('')
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
      setMessage({ kind: 'bad', text: `Ojej! Dobry wynik to ${current.answer}` })
      if (next.mistakes >= MAX_MISTAKES) {
        later(() => setPhase('caught'), 1800)
        later(() => onFinish(next, 'lost'), 3600)
      } else {
        later(() => {
          setShownTask(null)
          setMessage(null)
          setPhase('idle')
        }, 2400)
      }
    }
  }, [phase, input, battle, onChange, onFinish])

  const press = useCallback(
    (key) => {
      if (phase !== 'idle') return
      if (key === 'ok') return submit()
      if (key === 'del') return setInput((v) => v.slice(0, -1))
      setInput((v) => (v.length >= 3 ? v : (v + key).replace(/^0+(?=\d)/, '')))
    },
    [phase, submit],
  )

  useEffect(() => {
    function onKey(e) {
      const key = /^\d$/.test(e.key) ? e.key : { Backspace: 'del', Enter: 'ok' }[e.key]
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

      <div className={`stage ${phase === 'miss' ? 'shake' : ''}`}>
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

          {phase !== 'caught' && phase !== 'hit' && (
            <div className={`cloud ${task.solved ? 'cloud-solved' : ''}`} style={{ left: `${frontX + 7}%` }}>
              {task.text} = {task.solved ? task.answer : '?'}
            </div>
          )}

          {message && <div className={`battle-message ${message.kind}`}>{message.text}</div>}
          <div className="rats-left">Szczury: {ratsLeft}</div>
        </div>
      </div>

      <div className="answer-box">
        <div className="answer-display">{input || <span className="placeholder">?</span>}</div>
        <div className="keypad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'].map((key) => (
            <button
              key={key}
              className={`btn key ${key === 'ok' ? 'key-ok' : ''}`}
              disabled={phase !== 'idle'}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => press(key)}
            >
              {key === 'del' ? '⌫' : key === 'ok' ? 'OK' : key}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
