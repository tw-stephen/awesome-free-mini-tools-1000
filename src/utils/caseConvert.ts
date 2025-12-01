export type CaseMode =
  | 'uppercase'
  | 'lowercase'
  | 'capitalize'
  | 'sentence'
  | 'alternating'
  | 'inverse'

/**
 * Convert text to uppercase
 */
export function toUpperCase(text: string): string {
  return text.toUpperCase()
}

/**
 * Convert text to lowercase
 */
export function toLowerCase(text: string): string {
  return text.toLowerCase()
}

/**
 * Capitalize the first letter of each word
 */
export function toCapitalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/(?:^|\s|[^\p{L}\p{N}])(\p{L})/gu, (match) => match.toUpperCase())
}

/**
 * Convert to sentence case (capitalize first letter of each sentence)
 */
export function toSentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (match) => match.toUpperCase())
}

/**
 * Convert to alternating case (aLtErNaTiNg)
 */
export function toAlternatingCase(text: string): string {
  let letterIndex = 0
  return text
    .split('')
    .map((char) => {
      if (/\p{L}/u.test(char)) {
        const result = letterIndex % 2 === 0
          ? char.toLowerCase()
          : char.toUpperCase()
        letterIndex++
        return result
      }
      return char
    })
    .join('')
}

/**
 * Invert the case of each character
 */
export function toInverseCase(text: string): string {
  return text
    .split('')
    .map((char) => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase()
      }
      return char.toUpperCase()
    })
    .join('')
}

/**
 * Convert text based on mode
 */
export function convertCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case 'uppercase':
      return toUpperCase(text)
    case 'lowercase':
      return toLowerCase(text)
    case 'capitalize':
      return toCapitalize(text)
    case 'sentence':
      return toSentenceCase(text)
    case 'alternating':
      return toAlternatingCase(text)
    case 'inverse':
      return toInverseCase(text)
    default:
      return text
  }
}

/**
 * Count characters in text
 */
export function countCharacters(text: string): number {
  return text.length
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}
