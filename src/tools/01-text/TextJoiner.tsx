import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { joinText } from '../../utils/textJoiner'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

export default function TextJoiner() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [delimiter, setDelimiter] = useState(',')
  const [quote, setQuote] = useState(false)
  const { copied, copy } = useClipboard()

  const output = useMemo(() => {
    return joinText(input, delimiter, quote)
  }, [input, delimiter, quote])

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
            <label className="block text-xs font-medium text-slate-500 mb-1">{t('tools.textJoiner.delimiter')}</label>
            <input
              type="text"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              placeholder={t('tools.textJoiner.delimiterPlaceholder')}
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={quote}
                onChange={() => setQuote(!quote)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-slate-700">{t('tools.textJoiner.quoteItems')}</span>
            </label>
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
              {input ? input.split('\n').length : 0} {t('tools.textJoiner.lines')}
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
