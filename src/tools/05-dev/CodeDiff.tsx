import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'

interface DiffLine {
  type: 'same' | 'added' | 'removed'
  content: string
  oldLineNum?: number
  newLineNum?: number
}

export default function CodeDiff() {
  const { t } = useTranslation()
  const [original, setOriginal] = useState(`function greet(name) {
  console.log("Hello, " + name);
  return name;
}`)
  const [modified, setModified] = useState(`function greet(name, greeting = "Hello") {
  const message = greeting + ", " + name + "!";
  console.log(message);
  return message;
}`)
  const [diff, setDiff] = useState<DiffLine[]>([])
  const [stats, setStats] = useState({ added: 0, removed: 0, same: 0 })

  const computeLCS = (a: string[], b: string[]): number[][] => {
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

    return dp
  }

  const computeDiff = useCallback(() => {
    const originalLines = original.split('\n')
    const modifiedLines = modified.split('\n')

    const dp = computeLCS(originalLines, modifiedLines)
    const result: DiffLine[] = []

    let i = originalLines.length
    let j = modifiedLines.length
    let oldLineNum = originalLines.length
    let newLineNum = modifiedLines.length

    const tempResult: DiffLine[] = []

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && originalLines[i - 1] === modifiedLines[j - 1]) {
        tempResult.push({
          type: 'same',
          content: originalLines[i - 1],
          oldLineNum: oldLineNum--,
          newLineNum: newLineNum--
        })
        i--
        j--
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        tempResult.push({
          type: 'added',
          content: modifiedLines[j - 1],
          newLineNum: newLineNum--
        })
        j--
      } else if (i > 0) {
        tempResult.push({
          type: 'removed',
          content: originalLines[i - 1],
          oldLineNum: oldLineNum--
        })
        i--
      }
    }

    result.push(...tempResult.reverse())
    setDiff(result)

    const added = result.filter(d => d.type === 'added').length
    const removed = result.filter(d => d.type === 'removed').length
    const same = result.filter(d => d.type === 'same').length
    setStats({ added, removed, same })
  }, [original, modified])

  const getLineClass = (type: 'same' | 'added' | 'removed') => {
    switch (type) {
      case 'added':
        return 'bg-green-100 text-green-800'
      case 'removed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-white text-slate-700'
    }
  }

  const getLinePrefix = (type: 'same' | 'added' | 'removed') => {
    switch (type) {
      case 'added':
        return '+'
      case 'removed':
        return '-'
      default:
        return ' '
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.codeDiff.original')}
            </h3>
            <Button variant="secondary" onClick={() => setOriginal('')}>
              {t('common.clear')}
            </Button>
          </div>
          <TextArea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder={t('tools.codeDiff.originalPlaceholder')}
            rows={10}
            className="font-mono text-sm"
          />
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.codeDiff.modified')}
            </h3>
            <Button variant="secondary" onClick={() => setModified('')}>
              {t('common.clear')}
            </Button>
          </div>
          <TextArea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder={t('tools.codeDiff.modifiedPlaceholder')}
            rows={10}
            className="font-mono text-sm"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button variant="primary" onClick={computeDiff}>
          {t('tools.codeDiff.compare')}
        </Button>
      </div>

      {diff.length > 0 && (
        <>
          <div className="card p-4 bg-blue-50 border border-blue-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-mono text-green-600">+{stats.added}</p>
                <p className="text-xs text-slate-600">{t('tools.codeDiff.linesAdded')}</p>
              </div>
              <div>
                <p className="text-2xl font-mono text-red-600">-{stats.removed}</p>
                <p className="text-xs text-slate-600">{t('tools.codeDiff.linesRemoved')}</p>
              </div>
              <div>
                <p className="text-2xl font-mono text-slate-600">{stats.same}</p>
                <p className="text-xs text-slate-600">{t('tools.codeDiff.linesUnchanged')}</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.codeDiff.diffOutput')}
            </h3>

            <div className="overflow-x-auto">
              <pre className="font-mono text-sm border border-slate-200 rounded">
                {diff.map((line, i) => (
                  <div key={i} className={`flex ${getLineClass(line.type)}`}>
                    <span className="w-12 px-2 text-right text-slate-400 border-r border-slate-200 select-none">
                      {line.oldLineNum || ''}
                    </span>
                    <span className="w-12 px-2 text-right text-slate-400 border-r border-slate-200 select-none">
                      {line.newLineNum || ''}
                    </span>
                    <span className="w-6 px-1 text-center border-r border-slate-200 select-none font-bold">
                      {getLinePrefix(line.type)}
                    </span>
                    <span className="flex-1 px-2 whitespace-pre">
                      {line.content || ' '}
                    </span>
                  </div>
                ))}
              </pre>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.codeDiff.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.codeDiff.tip1')}</li>
          <li>{t('tools.codeDiff.tip2')}</li>
          <li>{t('tools.codeDiff.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
