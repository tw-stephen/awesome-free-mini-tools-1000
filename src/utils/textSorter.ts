export type SortMode = 'alphabetical' | 'natural' | 'length' | 'numeric' | 'random' | 'reverse'
export type SortOrder = 'asc' | 'desc'

export interface SortOptions {
  mode: SortMode
  order: SortOrder
  caseSensitive: boolean
  trimWhitespace: boolean
  removeEmpty: boolean
}

export interface SortResult {
  result: string
  lineCount: number
}

/**
 * Natural sort comparator using Intl.Collator
 * Handles numbers within strings correctly (e.g., "item2" < "item10")
 */
function naturalCompare(a: string, b: string, caseSensitive: boolean): number {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: caseSensitive ? 'case' : 'base',
  })
  return collator.compare(a, b)
}

/**
 * Alphabetical sort comparator
 */
function alphabeticalCompare(a: string, b: string, caseSensitive: boolean): number {
  const strA = caseSensitive ? a : a.toLowerCase()
  const strB = caseSensitive ? b : b.toLowerCase()
  return strA.localeCompare(strB)
}

/**
 * Length sort comparator
 */
function lengthCompare(a: string, b: string): number {
  return a.length - b.length
}

/**
 * Numeric sort comparator
 * Extracts and compares numbers from the beginning of strings
 */
function numericCompare(a: string, b: string): number {
  const numA = parseFloat(a) || 0
  const numB = parseFloat(b) || 0
  return numA - numB
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Sort text lines based on options
 */
export function sortLines(text: string, options: SortOptions): SortResult {
  const { mode, order, caseSensitive, trimWhitespace, removeEmpty } = options

  // Split into lines
  let lines = text.split('\n')

  // Trim whitespace if needed
  if (trimWhitespace) {
    lines = lines.map((line) => line.trim())
  }

  // Remove empty lines if needed
  if (removeEmpty) {
    lines = lines.filter((line) => line.length > 0)
  }

  // Sort based on mode
  let sortedLines: string[]

  switch (mode) {
    case 'alphabetical':
      sortedLines = [...lines].sort((a, b) => alphabeticalCompare(a, b, caseSensitive))
      break
    case 'natural':
      sortedLines = [...lines].sort((a, b) => naturalCompare(a, b, caseSensitive))
      break
    case 'length':
      sortedLines = [...lines].sort(lengthCompare)
      break
    case 'numeric':
      sortedLines = [...lines].sort(numericCompare)
      break
    case 'random':
      sortedLines = shuffleArray(lines)
      break
    case 'reverse':
      sortedLines = [...lines].reverse()
      break
    default:
      sortedLines = lines
  }

  // Apply order (except for random and reverse which have no order)
  if (order === 'desc' && mode !== 'random' && mode !== 'reverse') {
    sortedLines.reverse()
  }

  return {
    result: sortedLines.join('\n'),
    lineCount: sortedLines.length,
  }
}
