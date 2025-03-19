export function formatMarkdown(markdown: string): string {
  markdown = markdown.replace(/^#{1,4}\s+(.*)/gm, '<b>$1</b>')
  markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
  return markdown
}

export function formatTextInCard<T>(cardsV2: T): T {
  const clone = JSON.parse(JSON.stringify(cardsV2))
  for (const { card } of clone as any[]) {
    if (card.sections) {
      for (const section of card.sections) {
        if (section.widgets) {
          for (const widget of section.widgets) {
            if (widget.textParagraph) {
              widget.textParagraph.text = formatMarkdown(widget.textParagraph.text)
            }
          }
        }
      }
    }
  }

  return clone
}
