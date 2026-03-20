import { useState, useEffect, useRef } from 'react'

interface UseGameTimerOptions {
  seconds: number
  running: boolean
  onExpire: () => void
}

export function useGameTimer({ seconds, running, onExpire }: UseGameTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const onExpireRef = useRef(onExpire)
  const firedRef = useRef(false)
  useEffect(() => { onExpireRef.current = onExpire }, [onExpire])

  // Reset when seconds prop changes (new round)
  useEffect(() => {
    queueMicrotask(() => setTimeLeft(seconds))
    firedRef.current = false
  }, [seconds])

  // Tick down every second while running
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setTimeLeft(prev => (prev <= 0 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  // Fire onExpire when timeLeft hits 0 while running
  useEffect(() => {
    if (running && timeLeft === 0 && !firedRef.current) {
      firedRef.current = true
      onExpireRef.current()
    }
  }, [running, timeLeft])

  return { timeLeft }
}
