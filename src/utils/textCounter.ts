export interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  lines: number
  readingTime: number // in minutes
  speakingTime: number // in minutes
}

/**
 * Count characters including spaces
 */
export function countCharacters(text: string): number {
  return text.length
}

/**
 * Count characters excluding spaces
 */
export function countCharactersNoSpaces(text: string): number {
  return text.replace(/\s/g, '').length
}

/**
 * Count words (supports CJK and Western languages)
 */
export function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0

  // Count CJK characters (Chinese, Japanese, Korean)
  const cjkChars = trimmed.match(/[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g)
  const cjkCount = cjkChars ? cjkChars.length : 0

  // Remove CJK characters and count Western words
  const westernText = trimmed.replace(/[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g, ' ')
  const westernWords = westernText.trim().split(/\s+/).filter(word => word.length > 0)
  const westernCount = westernWords.length

  return cjkCount + westernCount
}

/**
 * Count sentences (ends with . ! ? or CJK punctuation)
 */
export function countSentences(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0

  // Match sentence endings: . ! ? and CJK punctuation
  const sentences = trimmed.match(/[.!?。！？]+/g)
  return sentences ? sentences.length : (trimmed.length > 0 ? 1 : 0)
}

/**
 * Count paragraphs (separated by blank lines)
 */
export function countParagraphs(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0

  // Split by one or more blank lines
  const paragraphs = trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  return paragraphs.length || (trimmed.length > 0 ? 1 : 0)
}

/**
 * Count lines
 */
export function countLines(text: string): number {
  if (!text) return 0
  return text.split('\n').length
}

/**
 * Calculate reading time in minutes
 * Average reading speed: 200 words/min for English, 300 chars/min for CJK
 */
export function calculateReadingTime(text: string): number {
  const words = countWords(text)
  // Assuming average reading speed of 200 words per minute
  return Math.ceil(words / 200)
}

/**
 * Calculate speaking time in minutes
 * Average speaking speed: 150 words/min
 */
export function calculateSpeakingTime(text: string): number {
  const words = countWords(text)
  // Assuming average speaking speed of 150 words per minute
  return Math.ceil(words / 150)
}

/**
 * Get all text statistics
 */
export function getTextStats(text: string): TextStats {
  return {
    characters: countCharacters(text),
    charactersNoSpaces: countCharactersNoSpaces(text),
    words: countWords(text),
    sentences: countSentences(text),
    paragraphs: countParagraphs(text),
    lines: countLines(text),
    readingTime: calculateReadingTime(text),
    speakingTime: calculateSpeakingTime(text),
  }
}
