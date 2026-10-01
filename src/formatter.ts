const HEADING = /^#{1,4}\s+(.*)/gm
const BOLD = /\*\*(.*?)\*\*/g
const MARKDOWN_LINK = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
const BARE_LINK = /(^|[^"'\w>])(https?:\/\/[^\s<"']*[^\s<"'\.,;:!?)])/g
const NEWLINE = /\r?\n/g

export function formatMarkdown(markdown: string): string {
  if (markdown.startsWith('"') && markdown.endsWith('"')) {
    markdown = markdown.slice(1, -1)
  }
  return markdown
    .replace(HEADING, '<b>$1</b>')
    .replace(BOLD, '<b>$1</b>')
    .replace(MARKDOWN_LINK, '<a href="$2">$1</a>')
    .replace(BARE_LINK, '$1<a href="$2">$2</a>')
    .replace(NEWLINE, '<br>')
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
