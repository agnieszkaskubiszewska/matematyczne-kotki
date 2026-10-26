import { useEffect, useRef, useState } from 'react'
import { catColors } from '../game/cats.js'
import Sprite from '../pixel/Sprite.jsx'
import {
  ARMCHAIR,
  ARMCHAIR_COLORS,
  BOWL,
  BOWL_COLORS,
  CAT_SIT,
  CAT_WALK,
  FIREPLACE,
  FIREPLACE_COLORS,
  SCRATCHER,
  SCRATCHER_COLORS,
  SOFA,
  SOFA_COLORS,
} from '../pixel/sprites.js'

// Kotki chodzą po podłodze: x i y w % sceny (y liczone od dołu).
const FLOOR = { minX: 2, maxX: 84, minY: 2, maxY: 20 }
const SPEED = 9 // % na sekundę

const rand = (min, max) => min + Math.random() * (max - min)

function RoomCat({ cat, highlight }) {
  const [view, setView] = useState(() => ({
    x: rand(FLOOR.minX, FLOOR.maxX),
    y: rand(FLOOR.minY, FLOOR.maxY),
    mode: 'sit',
    dir: 1,
    duration: 0,
  }))
  const pos = useRef(view)
  const [showName, setShowName] = useState(highlight)

  useEffect(() => {
    let timer
    function act() {
      if (Math.random() < 0.4) {
        setView((v) => ({ ...v, mode: 'sit', duration: 0 }))
        timer = setTimeout(act, rand(2500, 6000))
        return
      }
      const from = pos.current
      const to = { x: rand(FLOOR.minX, FLOOR.maxX), y: rand(FLOOR.minY, FLOOR.maxY) }
      const duration = (Math.hypot(to.x - from.x, to.y - from.y) / SPEED) * 1000
      pos.current = to
      setView({ ...to, mode: 'walk', dir: to.x >= from.x ? 1 : -1, duration })
      timer = setTimeout(() => {
        setView((v) => ({ ...v, mode: 'stand', duration: 0 }))
        timer = setTimeout(act, rand(600, 2000))
      }, duration)
    }
    timer = setTimeout(act, rand(500, 2500))
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!showName) return
    const t = setTimeout(() => setShowName(false), highlight ? 6000 : 2500)
    return () => clearTimeout(t)
  }, [showName, highlight])

  return (
    <div
      className="room-cat"
      onClick={() => setShowName(true)}
      style={{
        left: `${view.x}%`,
        bottom: `${view.y}%`,
        zIndex: Math.round(100 - view.y),
        transition: `left ${view.duration}ms linear, bottom ${view.duration}ms linear`,
      }}
    >
      {showName && (
        <span className="name-tag room-name">
          ♥ {cat.cat.name}
          <small>dzień {cat.day}</small>
        </span>
      )}
      {view.mode === 'sit' ? (
        <Sprite frames={CAT_SIT} colors={catColors(cat.cat.palette)} fps={0.4} />
      ) : (
        <Sprite
          frames={CAT_WALK}
          colors={catColors(cat.cat.palette)}
          fps={view.mode === 'walk' ? 5 : 0}
          flip={view.dir < 0}
        />
      )}
    </div>
  )
}

export default function RoomScene({ cats, highlightDay }) {
  return (
    <div className="room">
      <div className="room-inner" style={{ '--px': '0.7cqw' }}>
        <div className="window" />
        <div className="picture" />
        <div className="rug" />
        <div className="furniture" style={{ left: '3%', bottom: '32%' }}>
          <Sprite frames={FIREPLACE} colors={FIREPLACE_COLORS} fps={5} />
        </div>
        <div className="furniture" style={{ left: '30%', bottom: '28%' }}>
          <Sprite frames={[SOFA]} colors={SOFA_COLORS} />
        </div>
        <div className="furniture" style={{ left: '66%', bottom: '28%' }}>
          <Sprite frames={[ARMCHAIR]} colors={ARMCHAIR_COLORS} />
        </div>
        <div className="furniture" style={{ left: '88%', bottom: '25%' }}>
          <Sprite frames={[SCRATCHER]} colors={SCRATCHER_COLORS} />
        </div>
        <div className="furniture" style={{ left: '24%', bottom: '18%' }}>
          <Sprite frames={[BOWL]} colors={BOWL_COLORS} />
        </div>
        {cats.map((cat) => (
          <RoomCat key={cat.day} cat={cat} highlight={cat.day === highlightDay} />
        ))}
      </div>
    </div>
  )
}
