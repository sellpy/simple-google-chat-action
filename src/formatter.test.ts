import { describe, test, expect } from 'bun:test'
import { formatMarkdown } from './formatter'

describe('formatter', () => {
  test('formats headers', () => {
    expect(formatMarkdown(`# Header`)).toBe('<b>Header</b>')
    expect(formatMarkdown(`## Header`)).toBe('<b>Header</b>')
    expect(formatMarkdown(`### Header`)).toBe('<b>Header</b>')
    expect(formatMarkdown(`#### Header`)).toBe('<b>Header</b>')
  })
  test('formats bold text', () => {
    expect(formatMarkdown(`**Bold**`)).toBe('<b>Bold</b>')
  })
})
