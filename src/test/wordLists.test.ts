import { describe, it, expect } from 'vitest'
import { categories } from '../data/wordLists'

describe('wordLists', () => {
  it('has at least 4 categories', () => {
    expect(categories.length).toBeGreaterThanOrEqual(4)
  })

  it('each category has at least 30 words', () => {
    categories.forEach(cat => {
      expect(cat.words.length).toBeGreaterThanOrEqual(30)
    })
  })

  it('no duplicate words within a category', () => {
    categories.forEach(cat => {
      const unique = new Set(cat.words.map(w => w.toLowerCase()))
      expect(unique.size).toBe(cat.words.length)
    })
  })

  it('each category has id, name, emoji, and words', () => {
    categories.forEach(cat => {
      expect(cat.id).toBeTruthy()
      expect(cat.name).toBeTruthy()
      expect(cat.emoji).toBeTruthy()
      expect(Array.isArray(cat.words)).toBe(true)
    })
  })
})
