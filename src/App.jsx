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
import { makeDayTasks } from './game/tasks.js'
import Battle from './screens/Battle.jsx'
import Cemetery from './screens/Cemetery.jsx'
import Defeat from './screens/Defeat.jsx'
import Menu from './screens/Menu.jsx'
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
    update({ ...current.state, days: [...current.state.days, record], battle: null })
    setLastResult(record)
    setScreen(result === 'saved' ? 'victory' : 'defeat')
  }

  function startBattle() {
    if (state.battle) {
      // walka przerwana wcześniej – mogła się już rozstrzygnąć
      const { battle } = state
      if (battle.mistakes >= MAX_MISTAKES) return finishBattle({ ...battle, state }, 'lost')
      if (battle.chased >= RATS_PER_DAY) return finishBattle({ ...battle, state }, 'saved')
      return setScreen('battle')
    }
    const day = state.days.length + 1
    const battle = {
      day,
      date: todayStr(),
      cat: catForDay(state.seed, day),
      tasks: makeDayTasks(seededRandom(Date.now()), day),
      index: 0,
      chased: 0,
      mistakes: 0,
    }
    update({ ...state, battle })
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
    default:
      return (
        <Menu
          state={state}
          onStart={startBattle}
          onGo={setScreen}
          onReset={() => update(newState())}
          onAllowReplay={() =>
            update({ ...state, days: state.days.map((d) => ({ ...d, date: d.date === todayStr() ? 'test' : d.date })) })
          }
        />
      )
  }
}
