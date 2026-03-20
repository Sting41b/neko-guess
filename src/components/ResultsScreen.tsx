import type { GameResult } from '../App'

interface ResultsScreenProps {
  results: GameResult[]
  onPlayAgain: () => void
}

export default function ResultsScreen({ results, onPlayAgain }: ResultsScreenProps) {
  const correctCount = results.filter(r => r.outcome === 'correct').length

  return (
    <div className="h-full w-full bg-brand-yellow flex flex-col items-center justify-center gap-4 px-8 overflow-hidden">
      <h2 className="font-fredoka text-4xl text-brand-blue">
        You got <span className="text-5xl">{correctCount}</span> correct! 🎉
      </h2>

      {/* Scrollable word list */}
      <div className="flex-1 w-full max-w-lg overflow-y-auto rounded-2xl bg-white/50 p-4 max-h-[40vh]">
        {results.map((r, i) => (
          <div key={i} className="flex items-center gap-3 py-1 border-b border-brand-blue/10 last:border-0">
            <span className="text-xl">{r.outcome === 'correct' ? '✅' : '⏭'}</span>
            <span className="font-fredoka text-lg text-brand-blue">{r.word}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onPlayAgain}
        className="font-fredoka text-3xl px-12 py-4 bg-brand-blue text-white rounded-3xl shadow-lg active:scale-95 transition-transform"
      >
        Play Again 🐱
      </button>
    </div>
  )
}
