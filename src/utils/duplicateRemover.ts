export type RemoveMode = 'lines' | 'words'
export type KeepMode = 'first' | 'last'

export interface RemoveOptions {
  mode: RemoveMode
  keepMode: KeepMode
  caseSensitive: boolean
  trimWhitespace: boolean
}

export interface RemoveResult {
  result: string
  originalCount: number
  uniqueCount: number
  removedCount: number
  duplicates: string[]
}

/**
 * Remove duplicate lines from text
 */
export function removeDuplicateLines(
  text: string,
  options: Omit<RemoveOptions, 'mode'>
): RemoveResult {
  const { keepMode, caseSensitive, trimWhitespace } = options
  const lines = text.split('\n')
  const seen = new Map<string, number>()
  const duplicates: string[] = []

  // First pass: find all occurrences
  lines.forEach((line, index) => {
    let key = trimWhitespace ? line.trim() : line
    if (!caseSensitive) key = key.toLowerCase()

    if (seen.has(key)) {
      if (!duplicates.includes(line)) {
        duplicates.push(line)
      }
    } else {
      seen.set(key, index)
    }
  })

  // Second pass: keep first or last occurrence
  const resultLines: string[] = []
  const addedKeys = new Set<string>()

  if (keepMode === 'first') {
    lines.forEach((line) => {
      let key = trimWhitespace ? line.trim() : line
      if (!caseSensitive) key = key.toLowerCase()

      if (!addedKeys.has(key)) {
        addedKeys.add(key)
        resultLines.push(line)
      }
    })
  } else {
    // Keep last: iterate in reverse
    const reversedLines = [...lines].reverse()
    reversedLines.forEach((line) => {
      let key = trimWhitespace ? line.trim() : line
      if (!caseSensitive) key = key.toLowerCase()

      if (!addedKeys.has(key)) {
        addedKeys.add(key)
        resultLines.unshift(line)
      }
    })
  }

  return {
    result: resultLines.join('\n'),
    originalCount: lines.length,
    uniqueCount: resultLines.length,
    removedCount: lines.length - resultLines.length,
    duplicates,
  }
}

/**
 * Remove duplicate words from text
 */
export function removeDuplicateWords(
  text: string,
  options: Omit<RemoveOptions, 'mode'>
): RemoveResult {
  const { keepMode, caseSensitive, trimWhitespace } = options

  // Split by whitespace while preserving structure
  const processedText = trimWhitespace ? text.trim() : text
  const words = processedText.split(/(\s+)/)

  const seen = new Map<string, number>()
  const duplicates: string[] = []
  const actualWords: string[] = []

  // Separate words from whitespace
  words.forEach((word) => {
    if (!/^\s*$/.test(word)) {
      actualWords.push(word)
    }
  })

  // Find duplicates
  actualWords.forEach((word, index) => {
    const key = caseSensitive ? word : word.toLowerCase()
    if (seen.has(key)) {
      if (!duplicates.includes(word)) {
        duplicates.push(word)
      }
    } else {
      seen.set(key, index)
    }
  })

  // Remove duplicates
  const addedKeys = new Set<string>()
  const resultWords: string[] = []

  if (keepMode === 'first') {
    actualWords.forEach((word) => {
      const key = caseSensitive ? word : word.toLowerCase()
      if (!addedKeys.has(key)) {
        addedKeys.add(key)
        resultWords.push(word)
      }
    })
  } else {
    const reversedWords = [...actualWords].reverse()
    reversedWords.forEach((word) => {
      const key = caseSensitive ? word : word.toLowerCase()
      if (!addedKeys.has(key)) {
        addedKeys.add(key)
        resultWords.unshift(word)
      }
    })
  }

  return {
    result: resultWords.join(' '),
    originalCount: actualWords.length,
    uniqueCount: resultWords.length,
    removedCount: actualWords.length - resultWords.length,
    duplicates,
  }
}

/**
 * Remove duplicates based on options
 */
export function removeDuplicates(
  text: string,
  options: RemoveOptions
): RemoveResult {
  if (options.mode === 'lines') {
    return removeDuplicateLines(text, options)
  }
  return removeDuplicateWords(text, options)
}
