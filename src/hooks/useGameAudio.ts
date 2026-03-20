import { useCallback, useRef } from 'react'

export const useGameAudio = () => {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )()
    }
    return ctxRef.current
  }, [])

  // Call this on the same user gesture as iOS motion permission
  const initAudio = useCallback(() => { getCtx() }, [getCtx])

  const playCorrect = useCallback(() => {
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.4, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.35)
    } catch { /* ignore */ }
  }, [getCtx])

  const playPass = useCallback(() => {
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(180, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.25)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3)
    } catch { /* ignore */ }
  }, [getCtx])

  const playTimeUp = useCallback(() => {
    try {
      const ctx = getCtx()
      ;[0, 0.2, 0.4].forEach((delay, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain); gain.connect(ctx.destination)
        osc.type = 'square'
        osc.frequency.setValueAtTime(660 - i * 80, ctx.currentTime + delay)
        gain.gain.setValueAtTime(0.35, ctx.currentTime + delay)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.18)
        osc.start(ctx.currentTime + delay); osc.stop(ctx.currentTime + delay + 0.2)
      })
    } catch { /* ignore */ }
  }, [getCtx])

  const playTick = useCallback(() => {
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.1)
    } catch { /* ignore */ }
  }, [getCtx])

  return { initAudio, playCorrect, playPass, playTimeUp, playTick }
}
