import Sprite from '../pixel/Sprite.jsx'
import { GRAVE, GRAVE_COLORS } from '../pixel/sprites.js'

// Nocna sceneria cmentarza – wspólna dla ekranu porażki i cmentarza.
export function Graveyard({ children, px = '0.9cqw' }) {
  return (
    <div className="graveyard">
      <div className="graveyard-inner" style={{ '--px': px }}>
        <div className="moon" />
        <div className="fence" />
        {children}
      </div>
    </div>
  )
}

export function Grave({ record }) {
  return (
    <div className="grave">
      <Sprite frames={[GRAVE]} colors={GRAVE_COLORS} />
      <span className="grave-name">{record.cat.name}</span>
      <span className="grave-day">dzień {record.day}</span>
    </div>
  )
}
