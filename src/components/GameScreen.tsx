import { useState, useEffect, useCallback, useRef } from 'react'
import { categories, type TimerOption } from '../data/wordLists'
import { useTilt } from '../hooks/useTilt'
import { useGameTimer } from '../hooks/useGameTimer'
import { useGameAudio } from '../hooks/useGameAudio'
import type { GameResult } from '../App'

interface GameScreenProps {
  timerSeconds: TimerOption
  onComplete: (results: GameResult[]) => void
}

function shuffleAll(): string[] {
  const arr = categories.flatMap(c => c.words)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function GameScreen({ timerSeconds, onComplete }: GameScreenProps) {
  const [words] = useState<string[]>(shuffleAll)
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<GameResult[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'pass' | null>(null)
  const [frozen, setFrozen] = useState(false)

  const feedbackTimeout = useRef<number | null>(null)
  const expireTimeout = useRef<number | null>(null)
  const { playCorrect, playPass, playTimeUp, playTick } = useGameAudio()
  const resultsRef = useRef(results)
  useEffect(() => { resultsRef.current = results }, [results])

  const handleExpire = useCallback(() => {
    if (feedbackTimeout.current) {
      clearTimeout(feedbackTimeout.current)
      feedbackTimeout.current = null
    }
    playTimeUp()
    setFrozen(true)
    expireTimeout.current = window.setTimeout(() => onComplete(resultsRef.current), 1000)
  }, [playTimeUp, onComplete])

  const { timeLeft } = useGameTimer({
    seconds: timerSeconds,
    running: !frozen,
    onExpire: handleExpire,
  })

  useEffect(() => {
    if (timeLeft <= 5 && timeLeft > 0 && !frozen) playTick()
  }, [timeLeft, frozen, playTick])

  const advance = useCallback(() => {
    setIndex(i => {
      const next = i + 1
      if (next >= words.length) {
        // All words exhausted — end the game early
        setTimeout(() => onComplete(resultsRef.current), 0)
        return i
      }
      return next
    })
  }, [words.length, onComplete])

  const handleCorrect = useCallback(() => {
    if (feedback || frozen) return
    const word = words[index]
    setResults(r => [...r, { word, outcome: 'correct' }])
    setFeedback('correct')
    playCorrect()
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current)
    feedbackTimeout.current = window.setTimeout(() => {
      setFeedback(null)
      advance()
    }, 600)
  }, [feedback, frozen, words, index, playCorrect, advance])

  const handlePass = useCallback(() => {
    if (feedback || frozen) return
    const word = words[index]
    setResults(r => [...r, { word, outcome: 'pass' }])
    setFeedback('pass')
    playPass()
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current)
    feedbackTimeout.current = window.setTimeout(() => {
      setFeedback(null)
      advance()
    }, 600)
  }, [feedback, frozen, words, index, playPass, advance])

  useTilt({ onCorrect: handleCorrect, onPass: handlePass, enabled: !frozen })

  useEffect(() => () => {
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current)
    if (expireTimeout.current) clearTimeout(expireTimeout.current)
  }, [])

  const timerPct = timeLeft / timerSeconds
  const bgClass = feedback === 'correct'
    ? 'bg-green-500'
    : feedback === 'pass'
      ? 'bg-red-500'
      : 'bg-brand-blue'

  const correctCount = results.filter(r => r.outcome === 'correct').length
  const passCount = results.filter(r => r.outcome === 'pass').length

  return (
    <div className={`h-full w-full relative flex flex-col items-center justify-center transition-colors duration-300 ${bgClass}`}>
      {/* Timer bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-1000 ease-linear"
          style={{ width: `${timerPct * 100}%` }}
        />
      </div>

      {/* Timer number top-left */}
      <div className="absolute top-3 left-4">
        <span className={`font-fredoka text-3xl font-bold text-white ${timeLeft <= 5 ? 'animate-pulse' : ''}`}>
          {timeLeft}s
        </span>
      </div>

      {/* Score top-right */}
      <div className="absolute top-3 right-4 flex gap-3">
        <span className="font-fredoka text-xl text-white">✅ {correctCount}</span>
        <span className="font-fredoka text-xl text-white">⏭ {passCount}</span>
      </div>

      {/* Word */}
      <h1 className="game-word text-white text-center px-8 drop-shadow-lg">
        {feedback === 'correct' ? '✅ CORRECT!' : feedback === 'pass' ? '⏭ PASS' : words[index]}
      </h1>

      {/* Touch fallback buttons */}
      <div className="absolute inset-x-0 bottom-0 flex">
        <button
          onPointerDown={handlePass}
          className="flex-1 py-4 font-fredoka text-xl text-white/60 active:bg-white/10 select-none touch-none"
        >
          ⏭ PASS
        </button>
        <div className="w-px bg-white/20" />
        <button
          onPointerDown={handleCorrect}
          className="flex-1 py-4 font-fredoka text-xl text-white/60 active:bg-white/10 select-none touch-none"
        >
          ✅ CORRECT
        </button>
      </div>
    </div>
  )
}
