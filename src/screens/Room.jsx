import RoomScene from './RoomScene.jsx'

export default function Room({ cats, onBack }) {
  return (
    <div className="screen">
      <h2 className="screen-title">Pokój kotków</h2>
      <RoomScene cats={cats} />
      <p className="hint">
        {cats.length === 0
          ? 'Pokój czeka na pierwszego kotka. Uratuj go!'
          : 'Kliknij kotka, żeby zobaczyć, jak ma na imię.'}
      </p>
      <button className="btn" onClick={onBack}>
        Wróć do menu
      </button>
    </div>
  )
}
