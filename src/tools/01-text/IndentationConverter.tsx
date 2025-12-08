import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { convertIndentation } from '../../utils/indentationConverter'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

export default function IndentationConverter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [type, setType] = useState<'toSpaces' | 'toTabs'>('toSpaces')
  const [width, setWidth] = useState(2)
  const { copied, copy } = useClipboard()

  const output = useMemo(() => {
    return convertIndentation(input, type, width)
  }, [input, type, width])

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t('tools.indentationConverter.mode')}</label>
             <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setType('toSpaces')}
                className={`flex-1 px-4 py-2 text-sm font-medium border rounded-l-md ${
                  type === 'toSpaces'
                    ? 'bg-primary-50 text-primary-700 border-primary-500 z-10'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {t('tools.indentationConverter.toSpaces')}
              </button>
              <button
                onClick={() => setType('toTabs')}
                className={`flex-1 px-4 py-2 text-sm font-medium border rounded-r-md -ml-px ${
                  type === 'toTabs'
                    ? 'bg-primary-50 text-primary-700 border-primary-500 z-10'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {t('tools.indentationConverter.toTabs')}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              {type === 'toSpaces' ? t('tools.indentationConverter.tabWidth') : t('tools.indentationConverter.spacesPerTab')}
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Math.max(1, Number(e.target.value)))}
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
          </div>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('common.placeholder')}
            rows={10}
            className="font-mono"
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
          </div>
          <TextArea
            value={output}
            readOnly
            placeholder={t('common.noContent')}
            rows={10}
            className="bg-slate-50 font-mono"
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
