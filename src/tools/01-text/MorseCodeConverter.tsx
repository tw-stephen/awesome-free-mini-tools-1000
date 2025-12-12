import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toMorse, fromMorse } from '../../utils/morseCode'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

export default function MorseCodeConverter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const { copied, copy } = useClipboard()

  const handleEncode = () => {
    setOutput(toMorse(input))
  }

  const handleDecode = () => {
    setOutput(fromMorse(input))
  }

  const handleSwap = () => {
    setInput(output)
    setOutput(input)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

  const handleCopy = () => {
    copy(output)
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('common.input')}
          </label>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('tools.morseCode.inputPlaceholder')}
            rows={10}
          />
          <div className="mt-3 flex justify-end gap-2">
             <Button variant="secondary" onClick={handleClear} disabled={!input}>
              {t('common.clear')}
            </Button>
            <Button onClick={handleEncode} disabled={!input}>
              {t('tools.morseCode.encode')}
            </Button>
            <Button onClick={handleDecode} disabled={!input}>
              {t('tools.morseCode.decode')}
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
            className="bg-slate-50 font-mono"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={handleSwap} disabled={!output}>
              {t('tools.morseCode.swap')}
            </Button>
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
