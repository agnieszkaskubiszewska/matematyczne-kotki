import { useEffect, useState } from 'react'

const cache = new Map()

function gridToUrl(grid, colors) {
  const key = grid.join('/') + JSON.stringify(colors)
  if (cache.has(key)) return cache.get(key)
  const width = Math.max(...grid.map((row) => row.length))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = grid.length
  const ctx = canvas.getContext('2d')
  grid.forEach((row, y) => {
    ;[...row].forEach((ch, x) => {
      if (ch === '.' || !colors[ch]) return
      ctx.fillStyle = colors[ch]
      ctx.fillRect(x, y, 1, 1)
    })
  })
  const url = canvas.toDataURL()
  cache.set(key, url)
  return url
}

// Rysuje siatkę pikseli jako obrazek. Rozmiar jednego piksela bierze
// ze zmiennej CSS --px, więc cała scena skaluje się razem.
// `frames` to lista siatek – przy kilku klatkach sprite się animuje.
export default function Sprite({ frames, colors, fps = 4, flip = false, className = '', style }) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (frames.length < 2 || !fps) return
    const id = setInterval(() => setFrame((f) => (f + 1) % frames.length), 1000 / fps)
    return () => clearInterval(id)
  }, [frames.length, fps])

  const grid = frames[frame % frames.length]
  const width = Math.max(...grid.map((row) => row.length))

  return (
    <img
      src={gridToUrl(grid, colors)}
      alt=""
      draggable="false"
      className={`sprite ${className}`}
      style={{
        width: `calc(${width} * var(--px, 4px))`,
        transform: flip ? 'scaleX(-1)' : undefined,
        ...style,
      }}
    />
  )
}
