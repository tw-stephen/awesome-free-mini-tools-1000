import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { rot13, rot47 } from '../../utils/rot13'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

export default function Rot13Converter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const { copied, copy } = useClipboard()
  const [mode, setMode] = useState<'rot13' | 'rot47'>('rot13')

  const output = mode === 'rot13' ? rot13(input) : rot47(input)

  const handleCopy = () => {
    copy(output)
  }

  const handleClear = () => {
    setInput('')
  }

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.rot13.mode')}
        </label>
        <div className="flex gap-2">
          <Button
            variant={mode === 'rot13' ? 'primary' : 'secondary'}
            onClick={() => setMode('rot13')}
            className="flex-1"
          >
            ROT13
          </Button>
          <Button
            variant={mode === 'rot47' ? 'primary' : 'secondary'}
            onClick={() => setMode('rot47')}
            className="flex-1"
          >
            ROT47
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('common.input')}
          </label>
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
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('common.output')}
          </label>
          <TextArea
            value={output}
            readOnly
            placeholder={t('common.noContent')}
            rows={10}
            className="bg-slate-50"
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={handleCopy} disabled={!output}>
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 bg-slate-100 rounded-lg py-3 px-4">
        {t('common.footer.privacy')}
      </div>
    </div>
  )
}
