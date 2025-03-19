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

    expect(JSON.stringify(formatTextInCard(raw))).toBe(
      '[{"cardId":"13947222067","card":{"header":{"title":"New App Release","subtitle":"Version: v0.0.7"},"sections":[{"widgets":[{"textParagraph":{"text":"<b>Release Notes:</b>"}},{"textParagraph":{"text":"<b>Full Changelog</b>: https://github.com/sellpy/simple-google-chat-action/compare/v0.0.6...v0.0.7\\r\\n\\r\\n<b>Test parsing markdown</b>"}},{"buttonList":{"buttons":[{"text":"View Release in Github","onClick":{"openLink":{"url":"https://github.com/sellpy/simple-google-chat-action/releases/tag/v0.0.7"}}}]}}]}]}}]',
    )
  })
})
