import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

const rot13 = (text: string): string => {
  if (!text) return ''
  return text.replace(/[A-Za-z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base)
  })
}

export default function Rot13Encoder() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const { copied, copy } = useClipboard()

  const output = rot13(input)

  const handleSwap = () => {
    setInput(output)
  }

  return (
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
          placeholder={t('tools.rot13Encoder.inputPlaceholder')}
          rows={10}
        />
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setInput('')} disabled={!input}>
            {t('common.clear')}
          </Button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">
            {t('common.output')} (ROT13)
          </label>
          <Button
            variant="secondary"
            onClick={handleSwap}
            disabled={!output}
            className="text-xs"
          >
            {t('tools.rot13Encoder.swap')}
          </Button>
        </div>
        <TextArea
          value={output}
          readOnly
          rows={10}
          className="font-mono bg-slate-50"
        />
        <div className="mt-3 flex justify-end gap-2">
          <Button onClick={() => copy(output)} disabled={!output}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
      </div>

      <div className="md:col-span-2 card p-4">
        <p className="text-sm text-slate-600">
          {t('tools.rot13Encoder.hint')}
        </p>
      </div>
    </div>
  )
}
