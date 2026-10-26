import RoomScene from './RoomScene.jsx'

export default function Victory({ record, cats, onGo }) {
  return (
    <div className="screen">
      <h2 className="screen-title good">Hurra! Kotek {record.cat.name} jest uratowany!</h2>
      <p className="hint">Wszystkie szczury przegonione. {record.cat.name} ma teraz ciepły dom.</p>
      <RoomScene cats={cats} highlightDay={record.day} />
      <div className="menu-buttons row">
        <button className="btn" onClick={() => onGo('menu')}>
          Menu
        </button>
      </div>
    </div>
  )
}
