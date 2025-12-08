import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { splitText } from '../../utils/textSplitter'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

export default function TextSplitter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [separator, setSeparator] = useState(',')
  const [ignoreEmpty, setIgnoreEmpty] = useState(true)
  const [trimItems, setTrimItems] = useState(true)
  const { copied, copy } = useClipboard()

  const outputItems = useMemo(() => {
    return splitText(input, separator, ignoreEmpty, trimItems)
  }, [input, separator, ignoreEmpty, trimItems])

  const output = outputItems.join('\n')

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
            <label className="block text-xs font-medium text-slate-500 mb-1">{t('tools.textSplitter.separator')}</label>
            <input
              type="text"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              placeholder={t('tools.textSplitter.separatorPlaceholder')}
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-slate-400">{t('tools.textSplitter.separatorHint')}</p>
          </div>
          <div className="flex flex-col gap-2 pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ignoreEmpty}
                onChange={() => setIgnoreEmpty(!ignoreEmpty)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-slate-700">{t('tools.textSplitter.ignoreEmpty')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={trimItems}
                onChange={() => setTrimItems(!trimItems)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-slate-700">{t('tools.textSplitter.trimItems')}</span>
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
              {outputItems.length} {t('tools.textSplitter.items')}
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
