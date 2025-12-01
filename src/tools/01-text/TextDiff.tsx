import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { diffLinesWithInline, getDiffStats, LineDiff } from '../../utils/textDiff'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

type ViewMode = 'split' | 'unified'

function DiffLine({ diff, showLineNumbers = true }: { diff: LineDiff; showLineNumbers?: boolean }) {
  const bgColor = {
    equal: 'bg-white',
    insert: 'bg-green-50',
    delete: 'bg-red-50',
  }[diff.type]

  const textColor = {
    equal: 'text-slate-700',
    insert: 'text-green-800',
    delete: 'text-red-800',
  }[diff.type]

  const lineNumColor = {
    equal: 'text-slate-400',
    insert: 'text-green-600',
    delete: 'text-red-600',
  }[diff.type]

  const prefix = {
    equal: ' ',
    insert: '+',
    delete: '-',
  }[diff.type]

  const renderContent = () => {
    if (!diff.segments) {
      return <span>{diff.content || ' '}</span>
    }

    return diff.segments.map((seg, i) => {
      if (seg.type === 'equal') {
        return <span key={i}>{seg.value}</span>
      }
      const highlight = seg.type === 'insert' ? 'bg-green-200' : 'bg-red-200'
      return (
        <span key={i} className={`${highlight} rounded px-0.5`}>
          {seg.value}
        </span>
      )
    })
  }

  return (
    <div className={`${bgColor} flex font-mono text-sm border-b border-slate-100`}>
      {showLineNumbers && (
        <div className={`${lineNumColor} w-12 flex-shrink-0 text-right pr-2 py-1 select-none border-r border-slate-200 bg-slate-50`}>
          {diff.lineNumber.old || diff.lineNumber.new || ''}
        </div>
      )}
      <div className={`${textColor} flex-1 py-1 pl-2 whitespace-pre-wrap break-all`}>
        <span className={`${lineNumColor} mr-2 select-none`}>{prefix}</span>
        {renderContent()}
      </div>
    </div>
  )
}

function SplitView({ diffs }: { diffs: LineDiff[] }) {
  const leftLines: (LineDiff | null)[] = []
  const rightLines: (LineDiff | null)[] = []

  let i = 0
  while (i < diffs.length) {
    const diff = diffs[i]

    if (diff.type === 'equal') {
      leftLines.push(diff)
      rightLines.push(diff)
      i++
    } else if (diff.type === 'delete') {
      // Check if next is insert (paired change)
      if (i + 1 < diffs.length && diffs[i + 1].type === 'insert') {
        leftLines.push(diff)
        rightLines.push(diffs[i + 1])
        i += 2
      } else {
        leftLines.push(diff)
        rightLines.push(null)
        i++
      }
    } else if (diff.type === 'insert') {
      leftLines.push(null)
      rightLines.push(diff)
      i++
    }
  }

  return (
    <div className="grid grid-cols-2 gap-0 border border-slate-200 rounded-lg overflow-hidden">
      <div className="border-r border-slate-200">
        <div className="bg-red-50 text-red-700 text-xs font-medium px-3 py-2 border-b border-slate-200">
          Original
        </div>
        <div className="max-h-96 overflow-auto">
          {leftLines.map((diff, i) => (
            diff ? (
              <DiffLine key={i} diff={diff} />
            ) : (
              <div key={i} className="bg-slate-50 h-7 border-b border-slate-100" />
            )
          ))}
        </div>
      </div>
      <div>
        <div className="bg-green-50 text-green-700 text-xs font-medium px-3 py-2 border-b border-slate-200">
          Modified
        </div>
        <div className="max-h-96 overflow-auto">
          {rightLines.map((diff, i) => (
            diff ? (
              <DiffLine key={i} diff={{ ...diff, type: diff.type === 'delete' ? 'equal' : diff.type }} />
            ) : (
              <div key={i} className="bg-slate-50 h-7 border-b border-slate-100" />
            )
          ))}
        </div>
      </div>
    </div>
  )
}

function UnifiedView({ diffs }: { diffs: LineDiff[] }) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="max-h-96 overflow-auto">
        {diffs.length === 0 ? (
          <div className="text-center text-slate-400 py-8">No differences</div>
        ) : (
          diffs.map((diff, i) => <DiffLine key={i} diff={diff} />)
        )}
      </div>
    </div>
  )
}

export default function TextDiff() {
  const { t } = useTranslation()
  const [oldText, setOldText] = useState('')
  const [newText, setNewText] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('split')

  const diffs = useMemo(() => {
    if (!oldText && !newText) return []
    return diffLinesWithInline(oldText, newText)
  }, [oldText, newText])

  const stats = useMemo(() => getDiffStats(diffs), [diffs])

  const handleClear = () => {
    setOldText('')
    setNewText('')
  }

  const handleSwap = () => {
    const temp = oldText
    setOldText(newText)
    setNewText(temp)
  }

  const hasDiff = oldText || newText

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('tools.textDiff.original')}
          </label>
          <TextArea
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            placeholder={t('tools.textDiff.originalPlaceholder')}
            rows={8}
          />
        </div>
        <div className="card p-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('tools.textDiff.modified')}
          </label>
          <TextArea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder={t('tools.textDiff.modifiedPlaceholder')}
            rows={8}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleSwap} disabled={!hasDiff}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            {t('tools.textDiff.swap')}
          </Button>
          <Button variant="secondary" onClick={handleClear} disabled={!hasDiff}>
            {t('common.clear')}
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'split'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            {t('tools.textDiff.splitView')}
          </button>
          <button
            onClick={() => setViewMode('unified')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'unified'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            {t('tools.textDiff.unifiedView')}
          </button>
        </div>
      </div>

      {/* Stats */}
      {hasDiff && (
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-slate-600">
              {t('tools.textDiff.additions')}: <span className="font-medium text-green-600">+{stats.additions}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-slate-600">
              {t('tools.textDiff.deletions')}: <span className="font-medium text-red-600">-{stats.deletions}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400"></span>
            <span className="text-slate-600">
              {t('tools.textDiff.unchanged')}: <span className="font-medium">{stats.unchanged}</span>
            </span>
          </div>
        </div>
      )}

      {/* Diff Result */}
      {hasDiff && (
        <div>
          {viewMode === 'split' ? (
            <SplitView diffs={diffs} />
          ) : (
            <UnifiedView diffs={diffs} />
          )}
        </div>
      )}

      {/* Privacy Notice */}
      <div className="text-center text-xs text-slate-500 bg-slate-100 rounded-lg py-3 px-4">
        <svg
          className="inline-block w-4 h-4 mr-1 -mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        {t('common.footer.privacy')}
      </div>
    </div>
  )
}
