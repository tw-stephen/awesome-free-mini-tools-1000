import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { sortLines, SortMode, SortOrder, SortResult } from '../../utils/textSorter'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

const sortModes: SortMode[] = ['alphabetical', 'natural', 'length', 'numeric', 'random', 'reverse']

export default function TextSorter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<SortMode>('alphabetical')
  const [order, setOrder] = useState<SortOrder>('asc')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [trimWhitespace, setTrimWhitespace] = useState(true)
  const [removeEmpty, setRemoveEmpty] = useState(true)
  const { copied, copy } = useClipboard()

  const result: SortResult | null = useMemo(() => {
    if (!input.trim()) return null
    return sortLines(input, {
      mode,
      order,
      caseSensitive,
      trimWhitespace,
      removeEmpty,
    })
  }, [input, mode, order, caseSensitive, trimWhitespace, removeEmpty])

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
    a.download = `sorted-${mode}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const showOrderToggle = mode !== 'random' && mode !== 'reverse'

  return (
    <div className="space-y-6">
      {/* Sort Mode Selection */}
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          {t('tools.textSorter.modeLabel')}
        </label>
        <div className="flex flex-wrap gap-2">
          {sortModes.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === m
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t(`tools.textSorter.modes.${m}`)}
            </button>
          ))}
        </div>

        {/* Order & Options */}
        <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-slate-200">
          {/* Order Toggle */}
          {showOrderToggle && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">{t('tools.textSorter.order')}:</span>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setOrder('asc')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    order === 'asc'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {t('tools.textSorter.ascending')}
                </button>
                <button
                  onClick={() => setOrder('desc')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    order === 'desc'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {t('tools.textSorter.descending')}
                </button>
              </div>
            </div>
          )}

          {/* Checkboxes */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700">
              {t('tools.textSorter.caseSensitive')}
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
              {t('tools.textSorter.trimWhitespace')}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeEmpty}
              onChange={(e) => setRemoveEmpty(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700">
              {t('tools.textSorter.removeEmpty')}
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
            {input && (
              <span className="text-xs text-slate-500">
                {t('tools.textSorter.linesCount', { count: input.split('\n').length })}
              </span>
            )}
          </div>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('tools.textSorter.inputPlaceholder')}
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
                {t('tools.textSorter.linesCount', { count: result.lineCount })}
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
