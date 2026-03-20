import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameTimer } from '../hooks/useGameTimer'

describe('useGameTimer', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('counts down from the given seconds', () => {
    const onExpire = vi.fn()
    const { result } = renderHook(() =>
      useGameTimer({ seconds: 3, running: true, onExpire })
    )
    expect(result.current.timeLeft).toBe(3)
    act(() => { vi.advanceTimersByTime(1000) })
    expect(result.current.timeLeft).toBe(2)
    act(() => { vi.advanceTimersByTime(1000) })
    expect(result.current.timeLeft).toBe(1)
  })

  it('calls onExpire when timer reaches 0', () => {
    const onExpire = vi.fn()
    renderHook(() => useGameTimer({ seconds: 2, running: true, onExpire }))
    act(() => { vi.advanceTimersByTime(2000) })
    expect(onExpire).toHaveBeenCalledOnce()
  })

  it('does not tick when running is false', () => {
    const onExpire = vi.fn()
    const { result } = renderHook(() =>
      useGameTimer({ seconds: 5, running: false, onExpire })
    )
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.timeLeft).toBe(5)
    expect(onExpire).not.toHaveBeenCalled()
  })
})
