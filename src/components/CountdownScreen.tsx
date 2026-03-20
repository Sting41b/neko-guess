import { useState, useEffect, useCallback, useRef } from 'react'
import { requestMotionPermission, type MotionPermission, tryLockLandscape } from '../hooks/useTilt'
import { useGameAudio } from '../hooks/useGameAudio'

interface CountdownScreenProps {
  onReady: () => void
  onBack: () => void
}

// Detect whether the platform requires explicit motion permission (iOS/iPadOS)
const needsPermission =
  typeof DeviceMotionEvent !== 'undefined' &&
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof (DeviceMotionEvent as any).requestPermission === 'function'

export default function CountdownScreen({ onReady, onBack }: CountdownScreenProps) {
  const [permission, setPermission] = useState<MotionPermission>(
    () => needsPermission ? 'pending' : 'granted'
  )
  const [count, setCount] = useState<number | null>(null)
  const [requesting, setRequesting] = useState(false)
  const { initAudio } = useGameAudio()
  const onReadyRef = useRef(onReady)
  useEffect(() => { onReadyRef.current = onReady }, [onReady])

  // Start countdown once permission is granted; init audio for non-iOS
  useEffect(() => {
    if (permission !== 'granted') return
    if (!needsPermission) initAudio()
    tryLockLandscape()
    queueMicrotask(() => setCount(3))
    return () => { try { screen.orientation?.unlock() } catch { /* orientation unlock unsupported */ } }
  }, [permission, initAudio])

  // Countdown tick
  useEffect(() => {
    if (count === null) return
    if (count === 0) {
      const t = setTimeout(() => onReadyRef.current(), 600)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setCount(n => (n ?? 1) - 1), 1000)
    return () => clearTimeout(t)
  }, [count])  // onReady removed from deps

  const handleAllowMotion = useCallback(async () => {
    if (requesting) return
    setRequesting(true)
    initAudio() // initialise AudioContext on this gesture (iOS requirement)
    const result = await requestMotionPermission()
    setPermission(result)
    setRequesting(false)
  }, [initAudio, requesting])

  return (
    <div className="h-full w-full bg-brand-blue flex flex-col items-center justify-center gap-6 text-white text-center px-8">
      <span className="text-5xl">🐱</span>
      <p className="font-fredoka text-2xl">Hold phone on forehead!</p>
      <p className="font-fredoka text-white/70 text-lg">Nod down ✅ · Look up ⏭</p>

      {/* iOS permission button */}
      {permission === 'pending' && (
        <button
          onClick={handleAllowMotion}
          disabled={requesting}
          className="font-fredoka text-2xl px-8 py-4 bg-brand-yellow text-brand-blue rounded-3xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"
        >
          {requesting ? 'Requesting…' : 'Allow Motion to Play 📱'}
        </button>
      )}

      {/* Permission denied message */}
      {permission === 'denied' && (
        <div className="flex flex-col items-center gap-4">
          <p className="font-fredoka text-xl text-yellow-300">
            Motion access is needed to play. Please reload and allow motion access.
          </p>
          <button
            onClick={onBack}
            className="font-fredoka text-xl px-6 py-3 bg-white text-brand-blue rounded-2xl"
          >
            Go Back
          </button>
        </div>
      )}

      {/* Countdown */}
      {permission === 'granted' && count !== null && (
        <span className="font-fredoka text-9xl text-brand-yellow drop-shadow-lg">
          {count === 0 ? 'GO!' : count}
        </span>
      )}
    </div>
  )
}
