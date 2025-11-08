import { useState, useEffect } from 'react'
import './App.css'
import FlagCard from './components/FlagCard'
import Leaderboard from './components/Leaderboard'
import { countries, continents } from './data/countries'

function App() {
  const [selectedCards, setSelectedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [cards, setCards] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [moves, setMoves] = useState(0)
  const [playerName, setPlayerName] = useState('Miron')
  const [showNameInput, setShowNameInput] = useState(true)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [gameMode, setGameMode] = useState('stopwatch') // 'stopwatch' or 'countdown'
  const [timeLimit, setTimeLimit] = useState(120) // seconds for countdown mode
  const [elapsedTime, setElapsedTime] = useState(0) // seconds elapsed
  const [timerActive, setTimerActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [selectedContinent, setSelectedContinent] = useState('europe') // default continent

  // Timer effect
  useEffect(() => {
    let interval = null
    if (timerActive && !gameOver) {
      interval = setInterval(() => {
        setElapsedTime(prev => {
          if (gameMode === 'countdown') {
            const remaining = timeLimit - prev - 1
            if (remaining <= 0) {
              setGameOver(true)
              setTimerActive(false)
              return timeLimit
            }
            return prev + 1
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive, gameOver, gameMode, timeLimit])

  const PAIRS_COUNT = 18 // 6x6 grid = 36 cards = 18 pairs

  const getFilteredCountries = () => {
    return countries.filter(country => country.continent === selectedContinent)
  }

  const startGame = () => {
    if (!playerName.trim()) {
      alert('Kérlek, add meg a neved!')
      return
    }

    // Get countries from selected continent
    const filteredCountries = getFilteredCountries()

    // Randomly select PAIRS_COUNT countries from the filtered list
    const shuffledCountries = [...filteredCountries].sort(() => Math.random() - 0.5)
    const selectedCountries = shuffledCountries.slice(0, PAIRS_COUNT)

    // Create pairs: one with flag, one with country name
    const gamePairs = []
    selectedCountries.forEach((country, index) => {
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
    setElapsedTime(0)
    setTimerActive(true)
    setGameOver(false)
    setGameStarted(true)
    setShowNameInput(false)
  }

  const handleCardClick = (card) => {
    if (gameOver || selectedCards.length === 2 ||
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins + ':' + (secs < 10 ? '0' : '') + secs
  }

  const getTimeRemaining = () => {
    if (gameMode === 'countdown') {
      return Math.max(0, timeLimit - elapsedTime)
    }
    return elapsedTime
  }

  const saveScore = () => {
    const scores = JSON.parse(localStorage.getItem('flagGameScores') || '[]')
    const newScore = {
      name: playerName,
      moves: moves,
      time: elapsedTime,
      gameMode: gameMode,
      timeLimit: gameMode === 'countdown' ? timeLimit : null,
      date: new Date().toISOString()
    }
    scores.push(newScore)
    // Sort by moves first, then by time
    scores.sort((a, b) => {
      if (a.moves === b.moves) {
        return a.time - b.time
      }
      return a.moves - b.moves
    })
    localStorage.setItem('flagGameScores', JSON.stringify(scores.slice(0, 10)))
  }

  useEffect(() => {
    if (matchedPairs.length === PAIRS_COUNT && matchedPairs.length > 0) {
      setTimerActive(false)
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
    setElapsedTime(0)
    setTimerActive(false)
    setGameOver(false)
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

              <div className="continent-selector">
                <label htmlFor="continent">Kontinens:</label>
                <select
                  id="continent"
                  value={selectedContinent}
                  onChange={(e) => setSelectedContinent(e.target.value)}
                >
                  {continents.map(continent => (
                    <option key={continent.id} value={continent.id}>
                      {continent.name}
                    </option>
                  ))}
                </select>
                <div className="continent-info">
                  {getFilteredCountries().length} ország
                </div>
              </div>

              <div className="game-mode-selector">
                <label>Játék mód:</label>
                <div className="mode-buttons">
                  <button
                    className={'mode-btn' + (gameMode === 'stopwatch' ? ' active' : '')}
                    onClick={() => setGameMode('stopwatch')}
                  >
                    ⏱️ Stopper
                  </button>
                  <button
                    className={'mode-btn' + (gameMode === 'countdown' ? ' active' : '')}
                    onClick={() => setGameMode('countdown')}
                  >
                    ⏳ Visszaszámláló
                  </button>
                </div>
              </div>

              {gameMode === 'countdown' && (
                <div className="time-limit-selector">
                  <label htmlFor="timeLimit">Időkorlát:</label>
                  <select
                    id="timeLimit"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                  >
                    <option value={60}>1 perc</option>
                    <option value={90}>1.5 perc</option>
                    <option value={120}>2 perc</option>
                    <option value={180}>3 perc</option>
                    <option value={240}>4 perc</option>
                    <option value={300}>5 perc</option>
                  </select>
                </div>
              )}

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
                <div className={'info-item timer-item' + (gameMode === 'countdown' && getTimeRemaining() <= 10 ? ' warning' : '')}>
                  <span className="label">
                    {gameMode === 'countdown' ? '⏳ Hátralévő idő:' : '⏱️ Eltelt idő:'}
                  </span>
                  <span className="value timer-value">{formatTime(getTimeRemaining())}</span>
                </div>
                <div className="info-item">
                  <span className="label">Talált párok:</span>
                  <span className="value">{matchedPairs.length} / {PAIRS_COUNT}</span>
                </div>
              </div>

              {(matchedPairs.length === PAIRS_COUNT && matchedPairs.length > 0) && (
                <div className="win-message">
                  <div className="win-content">
                    🎉 Gratulálok, {playerName}! 🎉
                    <div className="win-stats">
                      Teljesítetted {moves} lépésből!
                      <br />
                      Idő: {formatTime(elapsedTime)}
                    </div>
                    <div className="win-buttons">
                      <button className="start-button" onClick={startGame}>
                        Új játék
                      </button>
                      <button className="secondary-button" onClick={resetGame}>
                        Beállítások módosítása
                      </button>
                      <button className="secondary-button" onClick={() => setShowLeaderboard(true)}>
                        Toplista megtekintése
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {gameOver && matchedPairs.length < PAIRS_COUNT && (
                <div className="win-message">
                  <div className="win-content game-over">
                    ⏰ Lejárt az idő! ⏰
                    <div className="win-stats">
                      Sajnos nem sikerült időben befejezni.
                      <br />
                      Talált párok: {matchedPairs.length} / {PAIRS_COUNT}
                    </div>
                    <div className="win-buttons">
                      <button className="start-button" onClick={startGame}>
                        Új játék
                      </button>
                      <button className="secondary-button" onClick={resetGame}>
                        Beállítások módosítása
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

      <footer className="app-footer">
        Made with ❤️ by LiviLove
      </footer>
    </div>
  )
}

export default App
