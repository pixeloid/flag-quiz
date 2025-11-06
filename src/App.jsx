import { useState, useEffect } from 'react'
import './App.css'
import FlagCard from './components/FlagCard'
import Leaderboard from './components/Leaderboard'
import { countries } from './data/countries'

function App() {
  const [selectedCards, setSelectedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [cards, setCards] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [moves, setMoves] = useState(0)
  const [playerName, setPlayerName] = useState('Miron')
  const [showNameInput, setShowNameInput] = useState(true)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const startGame = () => {
    if (!playerName.trim()) {
      alert('Kérlek, add meg a neved!')
      return
    }

    // Create pairs: one with flag, one with country name
    const gamePairs = []
    countries.forEach((country, index) => {
      gamePairs.push({
        id: index * 2,
        countryCode: country.code,
        countryName: country.name,
        type: 'flag',
        isMatched: false
      })
      gamePairs.push({
        id: index * 2 + 1,
        countryCode: country.code,
        countryName: country.name,
        type: 'name',
        isMatched: false
      })
    })

    // Shuffle cards
    const shuffled = gamePairs.sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setSelectedCards([])
    setMatchedPairs([])
    setMoves(0)
    setGameStarted(true)
    setShowNameInput(false)
  }

  const handleCardClick = (card) => {
    if (selectedCards.length === 2 ||
        selectedCards.find(c => c.id === card.id) ||
        matchedPairs.includes(card.countryCode)) {
      return
    }

    const newSelected = [...selectedCards, card]
    setSelectedCards(newSelected)

    if (newSelected.length === 2) {
      setMoves(moves + 1)

      // Check if cards match
      if (newSelected[0].countryCode === newSelected[1].countryCode &&
          newSelected[0].type !== newSelected[1].type) {
        // Match found!
        setMatchedPairs([...matchedPairs, card.countryCode])
        setTimeout(() => setSelectedCards([]), 500)
      } else {
        // No match
        setTimeout(() => setSelectedCards([]), 1000)
      }
    }
  }

  const isCardFlipped = (card) => {
    return selectedCards.find(c => c.id === card.id) ||
           matchedPairs.includes(card.countryCode)
  }

  const saveScore = () => {
    const scores = JSON.parse(localStorage.getItem('flagGameScores') || '[]')
    const newScore = {
      name: playerName,
      moves: moves,
      date: new Date().toISOString()
    }
    scores.push(newScore)
    scores.sort((a, b) => a.moves - b.moves)
    localStorage.setItem('flagGameScores', JSON.stringify(scores.slice(0, 10)))
  }

  useEffect(() => {
    if (matchedPairs.length === countries.length && matchedPairs.length > 0) {
      saveScore()
    }
  }, [matchedPairs])

  const resetGame = () => {
    setGameStarted(false)
    setShowNameInput(true)
    setCards([])
    setSelectedCards([])
    setMatchedPairs([])
    setMoves(0)
  }

  return (
    <div className="app">
      <h1>🌍 Zászló Memória Játék 🎮</h1>
      <p className="subtitle">Párosítsd a zászlókat az országnevekkel!</p>

      <button
        className="leaderboard-toggle"
        onClick={() => setShowLeaderboard(!showLeaderboard)}
      >
        {showLeaderboard ? '🎮 Játék' : '🏆 Toplista'}
      </button>

      {showLeaderboard ? (
        <Leaderboard />
      ) : (
        <>
          {showNameInput ? (
            <div className="name-input-container">
              <label htmlFor="playerName">Játékos neve:</label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Add meg a neved"
                maxLength={20}
              />
              <button className="start-button" onClick={startGame}>
                Játék indítása
              </button>
            </div>
          ) : (
            <>
              <div className="game-info">
                <div className="info-item">
                  <span className="label">Játékos:</span>
                  <span className="value">{playerName}</span>
                </div>
                <div className="info-item">
                  <span className="label">Lépések:</span>
                  <span className="value">{moves}</span>
                </div>
                <div className="info-item">
                  <span className="label">Talált párok:</span>
                  <span className="value">{matchedPairs.length} / {countries.length}</span>
                </div>
              </div>

              {matchedPairs.length === countries.length && matchedPairs.length > 0 && (
                <div className="win-message">
                  <div className="win-content">
                    🎉 Gratulálok, {playerName}! 🎉
                    <div className="win-stats">
                      Teljesítetted {moves} lépésből!
                    </div>
                    <div className="win-buttons">
                      <button className="start-button" onClick={startGame}>
                        Új játék
                      </button>
                      <button className="secondary-button" onClick={resetGame}>
                        Név megváltoztatása
                      </button>
                      <button className="secondary-button" onClick={() => setShowLeaderboard(true)}>
                        Toplista megtekintése
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="game-board">
                {cards.map(card => (
                  <FlagCard
                    key={card.id}
                    card={card}
                    isFlipped={isCardFlipped(card)}
                    onClick={() => handleCardClick(card)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default App
