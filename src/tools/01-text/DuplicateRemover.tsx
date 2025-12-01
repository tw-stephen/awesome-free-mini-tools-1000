import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { removeDuplicates, RemoveMode, KeepMode, RemoveResult } from '../../utils/duplicateRemover'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

export default function DuplicateRemover() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<RemoveMode>('lines')
  const [keepMode, setKeepMode] = useState<KeepMode>('first')
  const [caseSensitive, setCaseSensitive] = useState(true)
  const [trimWhitespace, setTrimWhitespace] = useState(true)
  const { copied, copy } = useClipboard()

  const result: RemoveResult | null = useMemo(() => {
    if (!input.trim()) return null
    return removeDuplicates(input, {
      mode,
      keepMode,
      caseSensitive,
      trimWhitespace,
    })
  }, [input, mode, keepMode, caseSensitive, trimWhitespace])

  const handleCopy = () => {
    if (result) {
      copy(result.result)
    }
  }

  const handleClear = () => {
    setInput('')
  }

  const handleDownload = () => {
    if (!result) return
    const blob = new Blob([result.result], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `deduplicated-${mode}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="card p-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.duplicateRemover.modeLabel')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode('lines')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'lines'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('tools.duplicateRemover.modes.lines')}
              </button>
              <button
                onClick={() => setMode('words')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'words'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('tools.duplicateRemover.modes.words')}
              </button>
            </div>
          </div>

          {/* Keep Mode */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.duplicateRemover.keepLabel')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setKeepMode('first')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  keepMode === 'first'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('tools.duplicateRemover.keep.first')}
              </button>
              <button
                onClick={() => setKeepMode('last')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  keepMode === 'last'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('tools.duplicateRemover.keep.last')}
              </button>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700">
              {t('tools.duplicateRemover.caseSensitive')}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700">
              {t('tools.duplicateRemover.trimWhitespace')}
            </span>
          </label>
        </div>
      </div>

      {/* Input/Output Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('common.input')}
            </label>
            {result && (
              <span className="text-xs text-slate-500">
                {mode === 'lines'
                  ? t('tools.duplicateRemover.linesCount', { count: result.originalCount })
                  : t('tools.duplicateRemover.wordsCount', { count: result.originalCount })}
              </span>
            )}
          </div>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('tools.duplicateRemover.inputPlaceholder')}
            rows={12}
          />
          <div className="mt-3 flex justify-end">
            <Button variant="secondary" onClick={handleClear} disabled={!input}>
              {t('common.clear')}
            </Button>
          </div>
        </div>

        {/* Output Section */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('common.output')}
            </label>
            {result && (
              <span className="text-xs text-slate-500">
                {mode === 'lines'
                  ? t('tools.duplicateRemover.linesCount', { count: result.uniqueCount })
                  : t('tools.duplicateRemover.wordsCount', { count: result.uniqueCount })}
              </span>
            )}
          </div>
          <TextArea
            value={result?.result || ''}
            readOnly
            placeholder={t('common.noContent')}
            rows={12}
            className="bg-slate-50"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={handleDownload} disabled={!result}>
              {t('common.download')}
            </Button>
            <Button onClick={handleCopy} disabled={!result}>
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {result && result.removedCount > 0 && (
        <div className="card p-4">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-sm text-slate-600">
                {t('tools.duplicateRemover.removed')}:
                <span className="font-medium text-red-600 ml-1">{result.removedCount}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-sm text-slate-600">
                {t('tools.duplicateRemover.unique')}:
                <span className="font-medium text-green-600 ml-1">{result.uniqueCount}</span>
              </span>
            </div>
          </div>

          {result.duplicates.length > 0 && (
            <div>
              <div className="text-sm font-medium text-slate-700 mb-2">
                {t('tools.duplicateRemover.duplicatesFound')}:
              </div>
              <div className="max-h-32 overflow-auto bg-slate-50 rounded-lg p-3">
                <div className="flex flex-wrap gap-2">
                  {result.duplicates.slice(0, 20).map((dup, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-mono"
                    >
                      {dup.length > 30 ? dup.slice(0, 30) + '...' : dup}
                    </span>
                  ))}
                  {result.duplicates.length > 20 && (
                    <span className="px-2 py-1 text-slate-500 text-xs">
                      +{result.duplicates.length - 20} {t('tools.duplicateRemover.more')}
                    </span>
                  )}
                </div>
              </div>
            </div>
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
