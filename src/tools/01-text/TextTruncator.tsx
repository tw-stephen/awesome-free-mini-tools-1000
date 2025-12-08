import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { truncateText } from '../../utils/textTruncator'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

export default function TextTruncator() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [limit, setLimit] = useState(100)
  const [mode, setMode] = useState<'chars' | 'bytes'>('chars')
  const [suffix, setSuffix] = useState('...')
  const { copied, copy } = useClipboard()

  const output = useMemo(() => {
    return truncateText(input, limit, mode, suffix)
  }, [input, limit, mode, suffix])

  const handleCopy = () => {
    copy(output)
  }

  const handleClear = () => {
    setInput('')
  }

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('common.settings')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t('tools.textTruncator.limit')}</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div>
             <label className="block text-xs font-medium text-slate-500 mb-1">{t('tools.textTruncator.mode')}</label>
             <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setMode('chars')}
                className={`flex-1 px-4 py-2 text-sm font-medium border rounded-l-md ${
                  mode === 'chars'
                    ? 'bg-primary-50 text-primary-700 border-primary-500 z-10'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {t('tools.textTruncator.modes.chars')}
              </button>
              <button
                onClick={() => setMode('bytes')}
                className={`flex-1 px-4 py-2 text-sm font-medium border rounded-r-md -ml-px ${
                  mode === 'bytes'
                    ? 'bg-primary-50 text-primary-700 border-primary-500 z-10'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {t('tools.textTruncator.modes.bytes')}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t('tools.textTruncator.suffix')}</label>
            <input
              type="text"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('common.input')}
            </label>
            <span className="text-xs text-slate-500">
              {mode === 'chars' ? input.length : new TextEncoder().encode(input).length} {mode === 'chars' ? t('tools.textTruncator.chars') : t('tools.textTruncator.bytes')}
            </span>
          </div>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('common.placeholder')}
            rows={10}
          />
          <div className="mt-3 flex justify-end">
            <Button variant="secondary" onClick={handleClear} disabled={!input}>
              {t('common.clear')}
            </Button>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('common.output')}
            </label>
             <span className="text-xs text-slate-500">
              {mode === 'chars' ? output.length : new TextEncoder().encode(output).length} {mode === 'chars' ? t('tools.textTruncator.chars') : t('tools.textTruncator.bytes')}
            </span>
          </div>
          <TextArea
            value={output}
            readOnly
            placeholder={t('common.noContent')}
            rows={10}
            className="bg-slate-50"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button onClick={handleCopy} disabled={!output}>
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
