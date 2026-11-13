const TOPIC_NAMES = {
  add: 'Dodawanie',
  sub: 'Odejmowanie',
  mul: 'Mnożenie',
  div: 'Dzielenie',
}

// Lista zadań, przy których padła zła odpowiedź – najnowsze dni na górze.
export default function Mistakes({ entries, onBack }) {
  const byTopic = Object.keys(TOPIC_NAMES)
    .map((topic) => ({ topic, count: entries.filter((e) => e.topic === topic).length }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)

  const days = [...new Set(entries.map((e) => e.day))].sort((a, b) => b - a)

  return (
    <div className="screen">
      <h2 className="screen-title">Trudne zadania</h2>

      {entries.length === 0 ? (
        <p className="hint">Na razie żadnych pomyłek. Tak trzymać!</p>
      ) : (
        <>
          <p className="hint">Te zadania sprawiły kłopot. Warto je jeszcze raz przećwiczyć!</p>
          <div className="topic-summary">
            {byTopic.map((t) => (
              <span key={t.topic} className="topic-chip">
                {TOPIC_NAMES[t.topic]}: <strong>{t.count}</strong>
              </span>
            ))}
          </div>
          <div className="mistakes-list">
            {days.map((day) => (
              <section key={day} className="mistakes-day">
                <h3>Dzień {day}</h3>
                <ul>
                  {entries
                    .filter((e) => e.day === day)
                    .map((e, i) => (
                      <li key={i} className={e.fixed ? 'fixed' : 'missed'}>
                        <span className="mistake-task">
                          {e.text} = {e.answer}
                        </span>
                        <span className="mistake-given">wpisano: {e.given.join(', ')}</span>
                        <span className="mistake-result">
                          {e.fixed === undefined ? '…' : e.fixed ? '✓ poprawione za 2. razem' : '✗ szczur podszedł bliżej'}
                        </span>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}

      <button className="btn" onClick={onBack}>
        Wróć do menu
      </button>
    </div>
  )
}
