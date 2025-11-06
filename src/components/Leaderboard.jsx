import { useState, useEffect } from 'react'
import './Leaderboard.css'

function Leaderboard() {
  const [scores, setScores] = useState([])

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('flagGameScores') || '[]')
    setScores(savedScores)
  }, [])

  const clearScores = () => {
    if (window.confirm('Biztosan törölni szeretnéd a toplistát?')) {
      localStorage.removeItem('flagGameScores')
      setScores([])
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMedalEmoji = (idx) => {
    if (idx === 0) return '🥇'
    if (idx === 1) return '🥈'
    if (idx === 2) return '🥉'
    return (idx + 1) + '.'
  }

  return (
    <div className="leaderboard">
      <h2>🏆 Toplista 🏆</h2>
      <p className="leaderboard-subtitle">A legjobb eredmények (legkevesebb lépés)</p>

      {scores.length === 0 ? (
        <div className="no-scores">
          <p>Még nincsenek eredmények!</p>
          <p>Játssz egy kört és kerülj fel a toplistára!</p>
        </div>
      ) : (
        <>
          <div className="scores-table">
            <div className="table-header">
              <div className="rank-col">Helyezés</div>
              <div className="name-col">Név</div>
              <div className="moves-col">Lépések</div>
              <div className="date-col">Dátum</div>
            </div>
            {scores.map((score, idx) => (
              <div
                key={idx}
                className={'table-row' + (idx < 3 ? ' top-three' : '') + (idx === 0 ? ' first-place' : '')}
              >
                <div className="rank-col">
                  {getMedalEmoji(idx)}
                </div>
                <div className="name-col">{score.name}</div>
                <div className="moves-col">{score.moves}</div>
                <div className="date-col">{formatDate(score.date)}</div>
              </div>
            ))}
          </div>
          <button className="clear-button" onClick={clearScores}>
            Toplista törlése
          </button>
        </>
      )}
    </div>
  )
}

export default Leaderboard
