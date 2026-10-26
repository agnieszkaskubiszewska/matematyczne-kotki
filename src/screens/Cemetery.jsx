import { Grave, Graveyard } from './Graveyard.jsx'

export default function Cemetery({ graves, onBack }) {
  return (
    <div className="screen">
      <h2 className="screen-title">Cmentarz kotków</h2>
      <Graveyard>
        <div className="graves">
          {graves.map((record) => (
            <Grave key={record.day} record={record} />
          ))}
        </div>
        {graves.length === 0 && <p className="empty-graveyard">Na cmentarzu jest pusto. Oby tak zostało!</p>}
      </Graveyard>
      <button className="btn" onClick={onBack}>
        Wróć do menu
      </button>
    </div>
  )
}
