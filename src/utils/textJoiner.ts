export const joinText = (text: string, delimiter: string, quote: boolean = false): string => {
  if (!text) return ''
  let lines = text.split('\n')

  if (quote) {
    lines = lines.map(line => `"${line.replace(/"/g, '\\"')}"`)
  }

  return lines.join(delimiter)
}
