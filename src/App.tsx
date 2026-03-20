import { useState } from 'react'
import { type TimerOption } from './data/wordLists'
import SetupScreen from './components/SetupScreen'
import CountdownScreen from './components/CountdownScreen'
import GameScreen from './components/GameScreen'
import ResultsScreen from './components/ResultsScreen'

export type Screen = 'setup' | 'countdown' | 'game' | 'results'

export interface GameResult {
  word: string
  outcome: 'correct' | 'pass'
}

function App() {
  const [screen, setScreen] = useState<Screen>('setup')
  const [timerSeconds, setTimerSeconds] = useState<TimerOption>(60)
  const [results, setResults] = useState<GameResult[]>([])

  return (
    <div className="h-full w-full bg-brand-blue overflow-hidden">
      {/* Portrait lock overlay */}
      <div className="portrait-only fixed inset-0 z-50 bg-brand-blue flex flex-col items-center justify-center text-white text-center p-8">
        <span className="text-6xl mb-4">📱</span>
        <p className="font-fredoka text-2xl">Rotate your phone sideways to play!</p>
      </div>

      <div className="landscape-content h-full w-full">
        {screen === 'setup' && (
          <SetupScreen
            timerSeconds={timerSeconds}
            onTimerChange={setTimerSeconds}
            onStart={() => setScreen('countdown')}
          />
        )}
        {screen === 'countdown' && (
          <CountdownScreen
            onReady={() => setScreen('game')}
            onBack={() => setScreen('setup')}
          />
        )}
        {screen === 'game' && (
          <GameScreen
            timerSeconds={timerSeconds}
            onComplete={(r: GameResult[]) => { setResults(r); setScreen('results') }}
          />
        )}
        {screen === 'results' && (
          <ResultsScreen
            results={results}
            onPlayAgain={() => { setResults([]); setScreen('setup') }}
          />
        )}
      </div>
    </div>
  )
}

export default App
