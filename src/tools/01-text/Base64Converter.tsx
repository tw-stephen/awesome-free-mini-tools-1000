import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toBase64, fromBase64 } from '../../utils/base64Converter'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

export default function Base64Converter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const { copied, copy } = useClipboard()

  const handleEncode = () => {
    setOutput(toBase64(input))
  }

  const handleDecode = () => {
    setOutput(fromBase64(input))
  }

  const handleSwap = () => {
    setInput(output)
    setOutput(input)
  }

  const handleCopy = () => {
    copy(output)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="card p-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('common.input')}
          </label>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('tools.base64Converter.inputPlaceholder')}
            rows={10}
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={handleClear} disabled={!input}>
              {t('common.clear')}
            </Button>
            <Button onClick={handleEncode} disabled={!input}>
              {t('tools.base64Converter.encode')}
            </Button>
            <Button onClick={handleDecode} disabled={!input}>
              {t('tools.base64Converter.decode')}
            </Button>
          </div>
        </div>

        {/* Output Section */}
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
          <div className="mt-3 flex justify-end gap-2">
             <Button variant="secondary" onClick={handleSwap} disabled={!output}>
              {t('tools.base64Converter.swap')}
            </Button>
            <Button onClick={handleCopy} disabled={!output}>
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="text-center text-xs text-slate-500 bg-slate-100 rounded-lg py-3 px-4">
        <svg
          className="inline-block w-4 h-4 mr-1 -mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        {t('common.footer.privacy')}
      </div>
    </div>
  )
}
