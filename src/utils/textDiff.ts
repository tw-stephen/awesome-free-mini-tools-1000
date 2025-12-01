export type DiffType = 'equal' | 'insert' | 'delete'

export interface DiffSegment {
  type: DiffType
  value: string
}

export interface LineDiff {
  type: DiffType
  lineNumber: { old?: number; new?: number }
  content: string
  segments?: DiffSegment[]
}

export interface DiffStats {
  additions: number
  deletions: number
  unchanged: number
}

/**
 * Simple diff algorithm using Longest Common Subsequence (LCS)
 * Compares two arrays and returns diff segments
 */
function lcs<T>(a: T[], b: T[]): T[] {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack to find LCS
  const result: T[] = []
  let i = m, j = n
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1])
      i--
      j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }

  return result
}

/**
 * Compute character-level diff between two strings
 */
export function diffChars(oldStr: string, newStr: string): DiffSegment[] {
  const oldChars = oldStr.split('')
  const newChars = newStr.split('')
  const common = lcs(oldChars, newChars)

  const result: DiffSegment[] = []
  let oi = 0, ni = 0, ci = 0

  while (oi < oldChars.length || ni < newChars.length) {
    // Collect deletions
    let deleted = ''
    while (oi < oldChars.length && (ci >= common.length || oldChars[oi] !== common[ci])) {
      deleted += oldChars[oi]
      oi++
    }
    if (deleted) {
      result.push({ type: 'delete', value: deleted })
    }

    // Collect insertions
    let inserted = ''
    while (ni < newChars.length && (ci >= common.length || newChars[ni] !== common[ci])) {
      inserted += newChars[ni]
      ni++
    }
    if (inserted) {
      result.push({ type: 'insert', value: inserted })
    }

    // Collect equal parts
    let equal = ''
    while (ci < common.length && oi < oldChars.length && ni < newChars.length &&
           oldChars[oi] === common[ci] && newChars[ni] === common[ci]) {
      equal += common[ci]
      oi++
      ni++
      ci++
    }
    if (equal) {
      result.push({ type: 'equal', value: equal })
    }
  }

  return result
}

/**
 * Compute line-level diff between two texts
 */
export function diffLines(oldText: string, newText: string): LineDiff[] {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  const common = lcs(oldLines, newLines)

  const result: LineDiff[] = []
  let oi = 0, ni = 0, ci = 0
  let oldLineNum = 1, newLineNum = 1

  while (oi < oldLines.length || ni < newLines.length) {
    // Collect deletions
    while (oi < oldLines.length && (ci >= common.length || oldLines[oi] !== common[ci])) {
      result.push({
        type: 'delete',
        lineNumber: { old: oldLineNum },
        content: oldLines[oi],
      })
      oi++
      oldLineNum++
    }

    // Collect insertions
    while (ni < newLines.length && (ci >= common.length || newLines[ni] !== common[ci])) {
      result.push({
        type: 'insert',
        lineNumber: { new: newLineNum },
        content: newLines[ni],
      })
      ni++
      newLineNum++
    }

    // Collect equal parts
    while (ci < common.length && oi < oldLines.length && ni < newLines.length &&
           oldLines[oi] === common[ci] && newLines[ni] === common[ci]) {
      result.push({
        type: 'equal',
        lineNumber: { old: oldLineNum, new: newLineNum },
        content: common[ci],
      })
      oi++
      ni++
      ci++
      oldLineNum++
      newLineNum++
    }
  }

  return result
}

/**
 * Compute inline diff for changed lines (shows character-level changes)
 */
export function diffLinesWithInline(oldText: string, newText: string): LineDiff[] {
  const lineDiffs = diffLines(oldText, newText)
  const result: LineDiff[] = []

  let i = 0
  while (i < lineDiffs.length) {
    const current = lineDiffs[i]

    if (current.type === 'equal') {
      result.push(current)
      i++
      continue
    }

    // Look for delete-insert pairs to show inline diff
    if (current.type === 'delete' && i + 1 < lineDiffs.length && lineDiffs[i + 1].type === 'insert') {
      const deleteLine = current
      const insertLine = lineDiffs[i + 1]

      // Add character-level diff segments
      const segments = diffChars(deleteLine.content, insertLine.content)

      result.push({
        ...deleteLine,
        segments: segments.filter(s => s.type !== 'insert'),
      })
      result.push({
        ...insertLine,
        segments: segments.filter(s => s.type !== 'delete'),
      })
      i += 2
    } else {
      result.push(current)
      i++
    }
  }

  return result
}

/**
 * Calculate diff statistics
 */
export function getDiffStats(diffs: LineDiff[]): DiffStats {
  return {
    additions: diffs.filter(d => d.type === 'insert').length,
    deletions: diffs.filter(d => d.type === 'delete').length,
    unchanged: diffs.filter(d => d.type === 'equal').length,
  }
}
