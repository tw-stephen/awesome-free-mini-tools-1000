import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { convertNewlines } from '../../utils/newlineConverter'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

type NewlineType = 'windows' | 'unix' | 'mac'

export default function NewlineConverter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [type, setType] = useState<NewlineType>('unix')
  const { copied, copy } = useClipboard()

  const output = useMemo(() => {
    return convertNewlines(input, type)
  }, [input, type])

  const handleCopy = () => {
    copy(output)
  }

  const handleClear = () => {
    setInput('')
  }

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.newlineConverter.targetFormat')}</h3>
        <div className="flex flex-wrap gap-2">
          {['windows', 'unix', 'mac'].map((mode) => (
             <button
              key={mode}
              onClick={() => setType(mode as NewlineType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                type === mode
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t(`tools.newlineConverter.modes.${mode}`)}
            </button>
          ))}
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
              {t('tools.newlineConverter.convertedTo', { format: t(`tools.newlineConverter.modes.${type}`) })}
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
