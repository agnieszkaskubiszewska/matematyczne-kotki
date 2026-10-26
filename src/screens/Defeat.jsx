import { catColors } from '../game/cats.js'
import Sprite from '../pixel/Sprite.jsx'
import { CAT_CRY } from '../pixel/sprites.js'
import { Grave, Graveyard } from './Graveyard.jsx'

// Gdy nie ma jeszcze uratowanych kotków, płaczą kotki z sąsiedztwa.
const NEIGHBOURS = [{ cat: { palette: 'szary' } }, { cat: { palette: 'kremowy' } }]

export default function Defeat({ record, mourners, onGo }) {
  const crying = (mourners.length ? mourners : NEIGHBOURS).slice(-4)
  const left = crying.slice(0, Math.ceil(crying.length / 2))
  const right = crying.slice(left.length)

  return (
    <div className="screen">
      <h2 className="screen-title bad">Ojej… szczury dopadły kotka</h2>
      <Graveyard px="1.3cqw">
        <div className="mourning">
          {left.map((m, i) => (
            <Sprite key={`l${i}`} frames={CAT_CRY} colors={catColors(m.cat.palette)} fps={2} />
          ))}
          <Grave record={record} />
          {right.map((m, i) => (
            <Sprite key={`r${i}`} frames={CAT_CRY} colors={catColors(m.cat.palette)} fps={2} />
          ))}
        </div>
      </Graveyard>
      <p className="hint">
        Tu spoczywa {record.cat.name}. Nie poddawaj się – jutro czeka kolejny kotek do uratowania!
      </p>
      <div className="menu-buttons row">
        <button className="btn" onClick={() => onGo('menu')}>
          Menu
        </button>
      </div>
    </div>
  )
}
