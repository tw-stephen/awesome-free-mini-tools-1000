import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { reverseText, ReverseMode } from '../../utils/textReverser'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

const reverseModes: ReverseMode[] = ['text', 'words', 'lines']

export default function TextReverser() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<ReverseMode>('text')
  const { copied, copy } = useClipboard()

  const output = useMemo(() => {
    return reverseText(input, mode)
  }, [input, mode])

  const handleCopy = () => {
    copy(output)
  }

  const handleClear = () => {
    setInput('')
  }

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <div className="flex flex-wrap gap-2">
          {reverseModes.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === m
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t(`tools.textReverser.modes.${m}`)}
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
