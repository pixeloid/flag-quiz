# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flag Memory Game (Zászló Memória Játék) - An educational memory card game for children to learn world flags paired with Hungarian country names. Features two game modes (stopwatch/countdown timer), move tracking, and a persistent leaderboard with time tracking. Built with React and Vite. All UI text is in Hungarian.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
flag-quiz/
├── src/
│   ├── components/
│   │   ├── FlagCard.jsx      # Memory card component with flip animation
│   │   ├── FlagCard.css      # Card styling
│   │   ├── Leaderboard.jsx   # Top 10 scores display with localStorage
│   │   └── Leaderboard.css   # Leaderboard styling
│   ├── data/
│   │   └── countries.js      # Country data (ISO codes + Hungarian names)
│   ├── App.jsx               # Main game logic, state, and scoring
│   ├── App.css               # App-level styling
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── public/                   # Static assets
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration
└── package.json              # Dependencies and scripts
```

## Architecture

### Game Logic (App.jsx)

- **Player Management**: Collects player name before game starts (default: "Miron")
- **Game Mode Selection**: Two modes available:
  - **Stopwatch (⏱️)**: Tracks elapsed time from 0 upwards
  - **Countdown (⏳)**: Counts down from selectable time limit (1-5 minutes). Game ends when time runs out.
- **Timer System**: 1-second interval timer with live display. Countdown shows warning animation when ≤10 seconds remain.
- **Card Generation**: Creates pairs of cards - one showing the flag (SVG), one showing the Hungarian country name
- **Shuffle Algorithm**: Randomizes card positions on game start
- **Match Detection**: Compares selected cards by country code and ensures they're different types (flag vs name)
- **Move Counter**: Increments when two cards are flipped (regardless of match)
- **Score Persistence**: Saves completed games to localStorage with player name, moves, time, game mode, and timestamp
- **State Management**: Tracks selected cards, matched pairs, game progress, player stats, and timer state

### Card Component (FlagCard.jsx)

- **3D Flip Animation**: CSS transforms with perspective for card flipping
- **Dynamic Flag Rendering**: Uses country-flag-icons library to render SVG flags based on ISO 3166-1-alpha-2 codes
- **Dual Display Mode**: Shows either flag SVG or country name text depending on card type

### Leaderboard Component (Leaderboard.jsx)

- **Score Display**: Shows top 10 scores sorted by moves (then by time as tiebreaker)
- **LocalStorage**: Reads from `flagGameScores` key
- **Formatting**: Displays rank, player name, moves, time (with mode icon), and timestamp in Hungarian format
- **Medal System**: Shows 🥇🥈🥉 for top 3 players
- **Game Mode Icons**: ⏱️ for stopwatch, ⏳ for countdown
- **Time Display**: Formatted as MM:SS with monospace font
- **Clear Function**: Allows resetting the leaderboard with confirmation

### Country Data (countries.js)

Format: `{ code: 'ISO-CODE', name: 'Magyar Név' }`
- **code**: ISO 3166-1-alpha-2 country code (maps to flag-icons library)
- **name**: Hungarian translation of country name

## Key Dependencies

- **react**: UI framework
- **country-flag-icons**: SVG flag library (3x2 aspect ratio)
- **vite**: Build tool and dev server

## Game Features

### Player Experience
- **Name Input**: Players enter their name before starting (defaults to "Miron")
- **Game Mode Selection**: Choose between Stopwatch or Countdown mode
- **Time Limit Selection**: For countdown mode, choose from 1, 1.5, 2, 3, 4, or 5 minutes
- **Move Tracking**: Counts every pair of cards flipped
- **Time Tracking**: Live timer display with MM:SS format
- **Live Stats**: Displays player name, moves, time, and matched pairs during gameplay
- **Win Screen**: Shows completion message with final moves and time
- **Timeout Screen**: For countdown mode, shows failure message if time expires
- **Leaderboard**: Toggle between game and top 10 scores

### Data Persistence
- **localStorage Key**: `flagGameScores`
- **Score Format**: `{ name: string, moves: number, time: number, gameMode: string, timeLimit: number|null, date: ISO string }`
- **Sorting**: Ascending by moves (fewer is better), with time as tiebreaker
- **Limit**: Top 10 scores retained

### Visual Features
- **Warning Animation**: Timer pulses red when countdown reaches 10 seconds or less
- **Win Modal**: Full-screen overlay with game statistics
- **Game Over Modal**: Displayed when countdown expires before completion
- **Footer**: "Made with ❤️ by LiviLove" at bottom of page

## Adding New Countries

Edit `src/data/countries.js`:

```javascript
{ code: 'AT', name: 'Ausztria' }  // ISO code + Hungarian name
```

Valid country codes: https://www.iso.org/iso-3166-country-codes.html

## UI Language

All user-facing text is in Hungarian:
- "Játékos neve" (Player name)
- "Lépések" (Moves)
- "Talált párok" (Matched pairs)
- "Toplista" (Leaderboard)
- "Játék indítása" (Start game)
