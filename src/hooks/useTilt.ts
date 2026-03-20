import { useEffect, useRef } from 'react'

const CORRECT_THRESHOLD = -6.0
const PASS_THRESHOLD = 6.0
const NEUTRAL_THRESHOLD = 2.5
const LOCKOUT_MS = 1000

// Pure function — exported for unit testing
export function detectTilt(z: number, waitingForNeutral: boolean): {
  action: 'correct' | 'pass' | 'neutral'
  newWaitingForNeutral: boolean
} {
  if (Math.abs(z) < NEUTRAL_THRESHOLD) {
    return { action: 'neutral', newWaitingForNeutral: false }
  }
  if (waitingForNeutral) {
    return { action: 'neutral', newWaitingForNeutral: true }
  }
  if (z < CORRECT_THRESHOLD) {
    return { action: 'correct', newWaitingForNeutral: true }
  }
  if (z > PASS_THRESHOLD) {
    return { action: 'pass', newWaitingForNeutral: true }
  }
  return { action: 'neutral', newWaitingForNeutral: false }
}

export type MotionPermission = 'unknown' | 'granted' | 'denied'

interface UseTiltOptions {
  onCorrect: () => void
  onPass: () => void
  enabled: boolean
}

export async function requestMotionPermission(): Promise<MotionPermission> {
  // iOS requires explicit permission
  if (
    typeof DeviceMotionEvent !== 'undefined' &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (DeviceMotionEvent as any).requestPermission === 'function'
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (DeviceMotionEvent as any).requestPermission()
      return result === 'granted' ? 'granted' : 'denied'
    } catch {
      return 'denied'
    }
  }
  // Android and desktop grant automatically
  return 'granted'
}

export function useTilt({ onCorrect, onPass, enabled }: UseTiltOptions) {
  const waitingForNeutral = useRef(true)
  const lockedOut = useRef(false)
  const onCorrectRef = useRef(onCorrect)
  const onPassRef = useRef(onPass)

  useEffect(() => { onCorrectRef.current = onCorrect }, [onCorrect])
  useEffect(() => { onPassRef.current = onPass }, [onPass])

  // Reset neutral flag when enabled (new round start)
  useEffect(() => {
    if (enabled) waitingForNeutral.current = true
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const handleMotion = (e: DeviceMotionEvent) => {
      const accel = e.accelerationIncludingGravity
      if (!accel) return
      let az = accel.z
      if (az === null || az === undefined) return

      // Chrome/Android inverts Z at 270° landscape
      const angle =
        screen.orientation?.angle ??
        (typeof window.orientation === 'number' ? window.orientation : 0)
      if (angle === 270 || angle === -90) az = -az

      const { action, newWaitingForNeutral } = detectTilt(az, waitingForNeutral.current)
      waitingForNeutral.current = newWaitingForNeutral

      if (action === 'correct' && !lockedOut.current) {
        lockedOut.current = true
        onCorrectRef.current()
        setTimeout(() => { lockedOut.current = false }, LOCKOUT_MS)
      } else if (action === 'pass' && !lockedOut.current) {
        lockedOut.current = true
        onPassRef.current()
        setTimeout(() => { lockedOut.current = false }, LOCKOUT_MS)
      }
    }

    window.addEventListener('devicemotion', handleMotion)
    return () => window.removeEventListener('devicemotion', handleMotion)
  }, [enabled])
}

export function tryLockLandscape() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(screen.orientation as any)?.lock('landscape').catch(() => { /* iOS doesn't support this */ })
  } catch { /* ignore */ }
}
