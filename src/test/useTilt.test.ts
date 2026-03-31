import { describe, it, expect } from 'vitest'
import { detectTilt } from '../hooks/useTilt'

describe('tilt detection logic', () => {
  it('detects correct when gamma exceeds positive threshold', () => {
    const result = detectTilt(35, false)
    expect(result.action).toBe('correct')
    expect(result.newWaitingForNeutral).toBe(true)
  })

  it('detects pass when gamma exceeds negative threshold', () => {
    const result = detectTilt(-35, false)
    expect(result.action).toBe('pass')
    expect(result.newWaitingForNeutral).toBe(true)
  })

  it('returns neutral when in neutral zone', () => {
    const result = detectTilt(5, false)
    expect(result.action).toBe('neutral')
    expect(result.newWaitingForNeutral).toBe(false)
  })

  it('does not fire while waiting for neutral return', () => {
    const result = detectTilt(40, true)
    expect(result.action).toBe('neutral')
  })

  it('clears waiting flag when gamma enters neutral zone', () => {
    const result = detectTilt(3, true)
    expect(result.newWaitingForNeutral).toBe(false)
  })

  it('returns neutral in dead zone between neutral and trigger thresholds', () => {
    const result = detectTilt(20, false)
    expect(result.action).toBe('neutral')
    expect(result.newWaitingForNeutral).toBe(false)
  })
})
