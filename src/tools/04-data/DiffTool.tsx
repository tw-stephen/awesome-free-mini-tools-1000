import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface DiffLine {
  type: 'unchanged' | 'added' | 'removed'
  content: string
  oldLineNum?: number
  newLineNum?: number
}

export default function DiffTool() {
  const { t } = useTranslation()
  const [original, setOriginal] = useState(`Hello World
This is a test
Keep this line
Remove this line
Another line here`)
  const [modified, setModified] = useState(`Hello World
This is a modified test
Keep this line
Added new line
Another line here`)
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('unified')
  const { copy, copied } = useClipboard()

  const diff = useMemo((): DiffLine[] => {
    const originalLines = original.split('\n')
    const modifiedLines = modified.split('\n')

    // Simple LCS-based diff algorithm
    const lcs = (a: string[], b: string[]): number[][] => {
      const m = a.length
      const n = b.length
      const dp: number[][] = Array(m + 1)
        .fill(null)
        .map(() => Array(n + 1).fill(0))

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (a[i - 1] === b[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1] + 1
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
          }
        }
      }

      return dp
    }

    const getDiff = (a: string[], b: string[]): DiffLine[] => {
      const dp = lcs(a, b)
      const result: DiffLine[] = []
      let i = a.length
      let j = b.length
      let oldLine = a.length
      let newLine = b.length

      const stack: DiffLine[] = []

      while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
          stack.push({
            type: 'unchanged',
            content: a[i - 1],
            oldLineNum: oldLine,
            newLineNum: newLine,
          })
          i--
          j--
          oldLine--
          newLine--
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
          stack.push({
            type: 'added',
            content: b[j - 1],
            newLineNum: newLine,
          })
          j--
          newLine--
        } else if (i > 0) {
          stack.push({
            type: 'removed',
            content: a[i - 1],
            oldLineNum: oldLine,
          })
          i--
          oldLine--
        }
      }

      return stack.reverse()
    }

    return getDiff(originalLines, modifiedLines)
  }, [original, modified])

  const stats = useMemo(() => {
    let added = 0
    let removed = 0
    let unchanged = 0

    for (const line of diff) {
      if (line.type === 'added') added++
      else if (line.type === 'removed') removed++
      else unchanged++
    }

    return { added, removed, unchanged, total: diff.length }
  }, [diff])

  const generatePatch = (): string => {
    let patch = '--- original\n+++ modified\n'

    for (const line of diff) {
      if (line.type === 'unchanged') {
        patch += ` ${line.content}\n`
      } else if (line.type === 'added') {
        patch += `+${line.content}\n`
      } else if (line.type === 'removed') {
        patch += `-${line.content}\n`
      }
    }

    return patch
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.diffTool.original')}
            </h3>
            <Button variant="secondary" onClick={() => setOriginal('')}>
              {t('common.clear')}
            </Button>
          </div>
          <TextArea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder={t('tools.diffTool.originalPlaceholder')}
            rows={10}
            className="font-mono text-sm"
          />
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.diffTool.modified')}
            </h3>
            <Button variant="secondary" onClick={() => setModified('')}>
              {t('common.clear')}
            </Button>
          </div>
          <TextArea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder={t('tools.diffTool.modifiedPlaceholder')}
            rows={10}
            className="font-mono text-sm"
          />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.diffTool.diff')}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('unified')}
                className={`px-2 py-1 text-xs rounded ${
                  viewMode === 'unified'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {t('tools.diffTool.unified')}
              </button>
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-2 py-1 text-xs rounded ${
                  viewMode === 'side-by-side'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {t('tools.diffTool.sideBySide')}
              </button>
            </div>
          </div>
          <Button variant="secondary" onClick={() => copy(generatePatch())}>
            {copied ? t('common.copied') : t('tools.diffTool.copyPatch')}
          </Button>
        </div>

        <div className="flex gap-4 mb-3 text-sm">
          <span className="text-green-600">+{stats.added} {t('tools.diffTool.added')}</span>
          <span className="text-red-600">-{stats.removed} {t('tools.diffTool.removed')}</span>
          <span className="text-slate-600">{stats.unchanged} {t('tools.diffTool.unchanged')}</span>
        </div>

        {viewMode === 'unified' ? (
          <div className="bg-slate-50 rounded-lg overflow-hidden font-mono text-sm">
            {diff.map((line, i) => (
              <div
                key={i}
                className={`flex ${
                  line.type === 'added'
                    ? 'bg-green-100'
                    : line.type === 'removed'
                      ? 'bg-red-100'
                      : ''
                }`}
              >
                <div className="w-8 text-right pr-2 text-slate-400 border-r border-slate-200 select-none">
                  {line.oldLineNum || ''}
                </div>
                <div className="w-8 text-right pr-2 text-slate-400 border-r border-slate-200 select-none">
                  {line.newLineNum || ''}
                </div>
                <div className="w-6 text-center text-slate-500 select-none">
                  {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                </div>
                <div
                  className={`flex-1 px-2 py-0.5 whitespace-pre ${
                    line.type === 'added'
                      ? 'text-green-800'
                      : line.type === 'removed'
                        ? 'text-red-800'
                        : 'text-slate-700'
                  }`}
                >
                  {line.content || ' '}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-0 bg-slate-50 rounded-lg overflow-hidden font-mono text-sm">
            <div className="border-r border-slate-200">
              {diff
                .filter((l) => l.type !== 'added')
                .map((line, i) => (
                  <div
                    key={i}
                    className={`flex ${line.type === 'removed' ? 'bg-red-100' : ''}`}
                  >
                    <div className="w-8 text-right pr-2 text-slate-400 border-r border-slate-200 select-none">
                      {line.oldLineNum || ''}
                    </div>
                    <div
                      className={`flex-1 px-2 py-0.5 whitespace-pre ${
                        line.type === 'removed' ? 'text-red-800' : 'text-slate-700'
                      }`}
                    >
                      {line.content || ' '}
                    </div>
                  </div>
                ))}
            </div>
            <div>
              {diff
                .filter((l) => l.type !== 'removed')
                .map((line, i) => (
                  <div
                    key={i}
                    className={`flex ${line.type === 'added' ? 'bg-green-100' : ''}`}
                  >
                    <div className="w-8 text-right pr-2 text-slate-400 border-r border-slate-200 select-none">
                      {line.newLineNum || ''}
                    </div>
                    <div
                      className={`flex-1 px-2 py-0.5 whitespace-pre ${
                        line.type === 'added' ? 'text-green-800' : 'text-slate-700'
                      }`}
                    >
                      {line.content || ' '}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
