export const convertIndentation = (
  text: string,
  type: 'toSpaces' | 'toTabs',
  width: number
): string => {
  if (!text) return ''

  const lines = text.split('\n')

  if (type === 'toSpaces') {
    const spaces = ' '.repeat(width)
    return lines.map(line => {
      // Replace tabs at the beginning of the line
      return line.replace(/^(\t+)/g, (match) => spaces.repeat(match.length))
    }).join('\n')
  } else {
    const spacesRegex = new RegExp(`^(\\s{${width}})+`, 'g')
    return lines.map(line => {
      // Replace groups of spaces at the beginning of the line
      return line.replace(spacesRegex, (match) => '\t'.repeat(match.length / width))
    }).join('\n')
  }
}
