export const textToUnicode = (text: string): string => {
  if (!text) return ''
  return text.split('')
    .map(char => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`)
    .join('')
}

export const unicodeToText = (text: string): string => {
  if (!text) return ''
  try {
    return text.replace(/\\u[\dA-F]{4}/gi, (match) => {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    })
  } catch (e) {
    return text
  }
}
