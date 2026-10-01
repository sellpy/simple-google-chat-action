import { describe, test, expect } from 'bun:test'
import { formatMarkdown, formatTextInCard } from './formatter'

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
  test('formats markdown links as anchors', () => {
    expect(formatMarkdown(`[see the PR](https://github.com/sellpy/ai-tools/pull/84)`)).toBe(
      '<a href="https://github.com/sellpy/ai-tools/pull/84">see the PR</a>',
    )
  })
  test('formats bare urls as anchors', () => {
    expect(formatMarkdown(`Fixed in https://github.com/sellpy/ai-tools/pull/84`)).toBe(
      'Fixed in <a href="https://github.com/sellpy/ai-tools/pull/84">https://github.com/sellpy/ai-tools/pull/84</a>',
    )
  })
  test('keeps trailing punctuation outside the anchor', () => {
    expect(formatMarkdown(`See https://example.com/a, then https://example.com/b.`)).toBe(
      'See <a href="https://example.com/a">https://example.com/a</a>, then <a href="https://example.com/b">https://example.com/b</a>.',
    )
  })
  test('does not double-wrap a url already inside an anchor', () => {
    expect(formatMarkdown(`[x](https://example.com/a)`)).toBe(
      '<a href="https://example.com/a">x</a>',
    )
  })
  test('formats windows line endings as line breaks', () => {
    expect(formatMarkdown(`a\r\nb`)).toBe('a<br>b')
  })
})

describe('formatTextInCard', () => {
  test('formats text in card', () => {
    const raw = [
      {
        cardId: '13947222067',
        card: {
          header: {
            title: 'New App Release',
            subtitle: 'Version: v0.0.7',
          },
          sections: [
            {
              widgets: [
                {
                  textParagraph: {
                    text: '<b>Release Notes:</b>',
                  },
                },
                {
                  textParagraph: {
                    text: '**Full Changelog**: https://github.com/sellpy/simple-google-chat-action/compare/v0.0.6...v0.0.7\r\n\r\n## Test parsing markdown',
                  },
                },
                {
                  buttonList: {
                    buttons: [
                      {
                        text: 'View Release in Github',
                        onClick: {
                          openLink: {
                            url: 'https://github.com/sellpy/simple-google-chat-action/releases/tag/v0.0.7',
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
    ]

    const [card] = formatTextInCard(raw) as any[]
    expect(card.card.sections[0].widgets[1].textParagraph.text).toBe(
      '<b>Full Changelog</b>: <a href="https://github.com/sellpy/simple-google-chat-action/compare/v0.0.6...v0.0.7">https://github.com/sellpy/simple-google-chat-action/compare/v0.0.6...v0.0.7</a><br><br><b>Test parsing markdown</b>',
    )
  })
})
