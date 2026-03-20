import { describe, it, expect } from 'vitest'
import { detectTilt } from '../hooks/useTilt'

describe('tilt detection logic', () => {
  it('detects correct when z is below threshold', () => {
    const result = detectTilt(-7, false)
    expect(result.action).toBe('correct')
    expect(result.newWaitingForNeutral).toBe(true)
  })

  it('detects pass when z is above threshold', () => {
    const result = detectTilt(7, false)
    expect(result.action).toBe('pass')
    expect(result.newWaitingForNeutral).toBe(true)
  })

  it('returns neutral when in neutral zone', () => {
    const result = detectTilt(1, false)
    expect(result.action).toBe('neutral')
    expect(result.newWaitingForNeutral).toBe(false)
  })

  it('does not fire while waiting for neutral return', () => {
    const result = detectTilt(-8, true)
    expect(result.action).toBe('neutral')
  })

  it('clears waiting flag when z enters neutral zone', () => {
    const result = detectTilt(0.5, true)
    expect(result.newWaitingForNeutral).toBe(false)
  })
})
