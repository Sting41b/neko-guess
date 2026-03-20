import { useState, useEffect, useRef } from 'react'

interface UseGameTimerOptions {
  seconds: number
  running: boolean
  onExpire: () => void
}

export function useGameTimer({ seconds, running, onExpire }: UseGameTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const onExpireRef = useRef(onExpire)
  useEffect(() => { onExpireRef.current = onExpire }, [onExpire])

  // Reset when seconds prop changes (new round)
  useEffect(() => { setTimeLeft(seconds) }, [seconds])

  useEffect(() => {
    if (!running) return

    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id)
          onExpireRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [running, seconds])

  return { timeLeft }
}
