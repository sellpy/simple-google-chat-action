export function formatMarkdown(markdown: string): string {
  markdown = markdown.replace(/^#{1,4}\s+(.*)/gm, '<b>$1</b>')
  markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
  return markdown
}
