import { ALL_TOPICS, TOPIC_LABELS } from '../game/tasks.js'

// Treść zadania razem z dobrą odpowiedzią. Starsze wpisy mają tylko
// działania typu "7 · 8", nowe mogą mieć okienko "?" albo dłuższą treść.
function solvedTask(e) {
  if (e.long) return e.text
  if (e.text.includes('=')) return e.text.replace('?', e.answer)
  return `${e.text} = ${e.answer}`
}

// Lista zadań, przy których padła zła odpowiedź – najnowsze dni na górze.
export default function Mistakes({ entries, onBack }) {
  const byTopic = ALL_TOPICS.map((topic) => ({ topic, count: entries.filter((e) => e.topic === topic).length }))
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
                {TOPIC_LABELS[t.topic]}: <strong>{t.count}</strong>
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
                      <li key={i} className={`${e.fixed ? 'fixed' : 'missed'} ${e.long ? 'long' : ''}`}>
                        <span className="mistake-topic">{TOPIC_LABELS[e.topic]}</span>
                        <span className="mistake-task">{solvedTask(e)}</span>
                        {e.long && <span className="mistake-answer">dobra odpowiedź: {e.answer}</span>}
                        <span className="mistake-given">wpisano: {e.given.join(' / ')}</span>
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
