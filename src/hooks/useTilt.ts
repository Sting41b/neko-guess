import { useEffect, useRef } from 'react'

const CORRECT_THRESHOLD = 30   // gamma > 30° = nod down = correct
const PASS_THRESHOLD = -30     // gamma < -30° = look up = pass
const NEUTRAL_THRESHOLD = 15   // |gamma| < 15° = neutral zone
const LOCKOUT_MS = 1000

// Pure function — exported for unit testing
export function detectTilt(gamma: number, waitingForNeutral: boolean): {
  action: 'correct' | 'pass' | 'neutral'
  newWaitingForNeutral: boolean
} {
  if (Math.abs(gamma) < NEUTRAL_THRESHOLD) {
    return { action: 'neutral', newWaitingForNeutral: false }
  }
  if (waitingForNeutral) {
    return { action: 'neutral', newWaitingForNeutral: true }
  }
  if (gamma > CORRECT_THRESHOLD) {
    return { action: 'correct', newWaitingForNeutral: true }
  }
  if (gamma < PASS_THRESHOLD) {
    return { action: 'pass', newWaitingForNeutral: true }
  }
  return { action: 'neutral', newWaitingForNeutral: false }
}

export type MotionPermission = 'unknown' | 'pending' | 'granted' | 'denied'

interface UseTiltOptions {
  onCorrect: () => void
  onPass: () => void
  enabled: boolean
}

export async function requestMotionPermission(): Promise<MotionPermission> {
  // iOS requires explicit permission for DeviceOrientationEvent
  if (
    typeof DeviceOrientationEvent !== 'undefined' &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (DeviceOrientationEvent as any).requestPermission === 'function'
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (DeviceOrientationEvent as any).requestPermission()
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
  const lockoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
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

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma
      if (gamma === null || gamma === undefined) return

      const { action, newWaitingForNeutral } = detectTilt(gamma, waitingForNeutral.current)
      waitingForNeutral.current = newWaitingForNeutral

      if (action === 'correct' && !lockedOut.current) {
        lockedOut.current = true
        onCorrectRef.current()
        lockoutTimer.current = setTimeout(() => { lockedOut.current = false }, LOCKOUT_MS)
      } else if (action === 'pass' && !lockedOut.current) {
        lockedOut.current = true
        onPassRef.current()
        lockoutTimer.current = setTimeout(() => { lockedOut.current = false }, LOCKOUT_MS)
      }
    }

    window.addEventListener('deviceorientation', handleOrientation)
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      if (lockoutTimer.current !== null) clearTimeout(lockoutTimer.current)
    }
  }, [enabled])
}

export function tryLockLandscape() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(screen.orientation as any)?.lock('landscape').catch(() => { /* iOS doesn't support this */ })
  } catch { /* ignore */ }
}
