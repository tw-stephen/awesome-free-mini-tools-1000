import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { cleanWhitespace } from '../../utils/whitespaceCleaner'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

export default function WhitespaceCleaner() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [options, setOptions] = useState({
    trimLines: true,
    removeEmptyLines: true,
    removeExtraSpaces: true,
    trimText: true,
  })
  const { copied, copy } = useClipboard()

  const output = useMemo(() => {
    return cleanWhitespace(input, options)
  }, [input, options])

  const handleCopy = () => {
    copy(output)
  }

  const handleClear = () => {
    setInput('')
  }

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('common.options')}</h3>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.trimLines}
              onChange={() => toggleOption('trimLines')}
              className="rounded text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700">{t('tools.whitespaceCleaner.options.trimLines')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.removeEmptyLines}
              onChange={() => toggleOption('removeEmptyLines')}
              className="rounded text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700">{t('tools.whitespaceCleaner.options.removeEmptyLines')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.removeExtraSpaces}
              onChange={() => toggleOption('removeExtraSpaces')}
              className="rounded text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700">{t('tools.whitespaceCleaner.options.removeExtraSpaces')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.trimText}
              onChange={() => toggleOption('trimText')}
              className="rounded text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700">{t('tools.whitespaceCleaner.options.trimText')}</span>
          </label>
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
