import { useState } from 'react'
import { catForDay } from './game/cats.js'
import { seededRandom } from './game/random.js'
import {
  MAX_MISTAKES,
  RATS_PER_DAY,
  loadState,
  newState,
  saveState,
  todayStr,
} from './game/storage.js'
import { makeDayTasks, ratsFor } from './game/tasks.js'
import Battle from './screens/Battle.jsx'
import Cemetery from './screens/Cemetery.jsx'
import Defeat from './screens/Defeat.jsx'
import Menu from './screens/Menu.jsx'
import Mistakes from './screens/Mistakes.jsx'
import Room from './screens/Room.jsx'
import Victory from './screens/Victory.jsx'
import './App.css'

export default function App() {
  const [state, setState] = useState(loadState)
  const [screen, setScreen] = useState('menu')
  const [lastResult, setLastResult] = useState(null)

  function update(next) {
    saveState(next)
    setState(next)
  }

  function finishBattle(current, result) {
    const record = { day: current.day, date: current.date, result, cat: current.cat }
    update({
      ...current.state,
      days: [...current.state.days, record],
      mistakesLog: [...current.state.mistakesLog, ...(current.wrongAnswers ?? [])],
      battle: null,
    })
    setLastResult(record)
    setScreen(result === 'saved' ? 'victory' : 'defeat')
  }

  function resumeBattle() {
    // walka przerwana wcześniej – mogła się już rozstrzygnąć
    const { battle } = state
    if (battle.mistakes >= MAX_MISTAKES) return finishBattle({ ...battle, state }, 'lost')
    if (battle.chased >= (battle.ratsTotal ?? RATS_PER_DAY)) return finishBattle({ ...battle, state }, 'saved')
    setScreen('battle')
  }

  function startBattle(topics) {
    const day = state.days.length + 1
    const ratsTotal = ratsFor(topics, RATS_PER_DAY)
    const battle = {
      day,
      date: todayStr(),
      cat: catForDay(state.seed, day),
      topics,
      ratsTotal,
      tasks: makeDayTasks(seededRandom(Date.now()), ratsTotal, topics),
      index: 0,
      chased: 0,
      mistakes: 0,
    }
    // wybór kategorii zapamiętujemy na kolejne dni
    update({ ...state, topics, battle })
    setScreen('battle')
  }

  // Zmiana kategorii w trwającej walce: przegonione szczury i błędy zostają,
  // a pozostałe zadania losujemy od nowa z nowych kategorii.
  function changeTopics(topics) {
    const { battle } = state
    // zadanie z drugą szansą zostaje, żeby nie zgubić jego wpisu na liście trudnych
    const keep = battle.tasks.slice(0, battle.index + (battle.warned ? 1 : 0))
    const ratsTotal = ratsFor(topics, RATS_PER_DAY)
    const fresh = makeDayTasks(seededRandom(Date.now()), Math.max(1, ratsTotal - battle.chased), topics)
    update({ ...state, topics, battle: { ...battle, topics, ratsTotal, tasks: [...keep, ...fresh] } })
    setScreen('battle')
  }

  const savedCats = state.days.filter((d) => d.result === 'saved')
  const lostCats = state.days.filter((d) => d.result === 'lost')

  switch (screen) {
    case 'battle':
      return (
        <Battle
          battle={state.battle}
          onChange={(battle) => update({ ...state, battle })}
          onFinish={(battle, result) => finishBattle({ ...battle, state }, result)}
          onExit={() => setScreen('menu')}
        />
      )
    case 'victory':
      return <Victory record={lastResult} cats={savedCats} onGo={setScreen} />
    case 'defeat':
      return <Defeat record={lastResult} mourners={savedCats} onGo={setScreen} />
    case 'room':
      return <Room cats={savedCats} onBack={() => setScreen('menu')} />
    case 'cemetery':
      return <Cemetery graves={lostCats} onBack={() => setScreen('menu')} />
    case 'mistakes':
      return (
        <Mistakes
          entries={[...state.mistakesLog, ...(state.battle?.wrongAnswers ?? [])]}
          onBack={() => setScreen('menu')}
        />
      )
    default:
      return (
        <Menu
          state={state}
          onStart={startBattle}
          onResume={resumeBattle}
          onChangeTopics={changeTopics}
          onGo={setScreen}
          onReset={() => update(newState())}
          onAllowReplay={() =>
            update({ ...state, days: state.days.map((d) => ({ ...d, date: d.date === todayStr() ? 'test' : d.date })) })
          }
        />
      )
  }
}
