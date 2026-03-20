import { type TimerOption, TIMER_OPTIONS } from '../data/wordLists'

interface SetupScreenProps {
  timerSeconds: TimerOption
  onTimerChange: (t: TimerOption) => void
  onStart: () => void
}

export default function SetupScreen({ timerSeconds, onTimerChange, onStart }: SetupScreenProps) {
  return (
    <div className="h-full w-full bg-brand-yellow flex flex-col items-center justify-center gap-6 px-8">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-6xl">🐱</span>
        <h1 className="font-fredoka text-5xl text-brand-blue drop-shadow">Neko Guess</h1>
        <p className="font-fredoka text-brand-blue/70 text-lg">Hold phone on forehead · Nod down ✅ · Look up ⏭</p>
      </div>

      {/* Timer picker */}
      <div className="flex flex-col items-center gap-3">
        <p className="font-fredoka text-brand-blue text-xl">Choose time:</p>
        <div className="flex gap-3">
          {TIMER_OPTIONS.map(t => (
            <button
              key={t}
              onClick={() => onTimerChange(t)}
              className={`font-fredoka text-2xl px-6 py-3 rounded-2xl border-4 transition-all ${
                timerSeconds === t
                  ? 'bg-brand-blue text-white border-brand-blue scale-110'
                  : 'bg-white text-brand-blue border-brand-blue/30 hover:border-brand-blue'
              }`}
            >
              {t}s
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        className="font-fredoka text-3xl px-12 py-4 bg-brand-blue text-white rounded-3xl shadow-lg active:scale-95 transition-transform"
      >
        Start Game 🎮
      </button>
    </div>
  )
}
