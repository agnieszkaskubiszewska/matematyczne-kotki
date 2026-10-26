import { catColors } from '../game/cats.js'
import { TOTAL_DAYS, isTestMode, playedToday } from '../game/storage.js'
import Sprite from '../pixel/Sprite.jsx'
import { CAT_SIT, CAT_WALK, GRAVE, GRAVE_COLORS, RAT_COLORS, RAT_WALK } from '../pixel/sprites.js'

export default function Menu({ state, onStart, onGo, onReset, onAllowReplay }) {
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
        <Sprite frames={CAT_WALK} colors={catColors('rudy')} fps={3} />
        <span className="vs">VS</span>
        <Sprite frames={RAT_WALK} colors={RAT_COLORS} fps={3} />
      </div>

      <p className="day-info">{dayInfo}</p>

      <div className="menu-buttons">
        {!finished && (
          <button className="btn btn-big btn-start" disabled={doneToday} onClick={onStart}>
            {state.battle ? 'Wróć do walki!' : doneToday ? 'Wróć jutro' : 'Ratuj kotka!'}
          </button>
        )}
        <button className="btn" onClick={() => onGo('room')}>
          Odwiedź kotki ({saved})
        </button>
        <button className="btn" onClick={() => onGo('cemetery')}>
          Odwiedź cmentarz ({lost})
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
