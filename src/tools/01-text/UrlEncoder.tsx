import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { encodeUrl, decodeUrl, encodeFullUrl, decodeFullUrl } from '../../utils/urlEncoder'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

type Mode = 'encode' | 'decode' | 'encodeFull' | 'decodeFull'

export default function UrlEncoder() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const { copied, copy } = useClipboard()

  const handleProcess = (mode: Mode) => {
    let result = ''
    switch (mode) {
      case 'encode':
        result = encodeUrl(input)
        break
      case 'decode':
        result = decodeUrl(input)
        break
      case 'encodeFull':
        result = encodeFullUrl(input)
        break
      case 'decodeFull':
        result = decodeFullUrl(input)
        break
    }
    setOutput(result)
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
            placeholder={t('tools.urlEncoder.inputPlaceholder')}
            rows={8}
          />
          <div className="mt-3 flex justify-end">
            <Button variant="secondary" onClick={handleClear} disabled={!input}>
              {t('common.clear')}
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
            rows={8}
            className="bg-slate-50"
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={handleCopy} disabled={!output}>
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          {t('tools.urlEncoder.actions')}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button onClick={() => handleProcess('encode')} disabled={!input}>
            {t('tools.urlEncoder.encode')}
          </Button>
          <Button onClick={() => handleProcess('decode')} disabled={!input}>
            {t('tools.urlEncoder.decode')}
          </Button>
          <Button variant="secondary" onClick={() => handleProcess('encodeFull')} disabled={!input}>
            {t('tools.urlEncoder.encodeFull')}
          </Button>
          <Button variant="secondary" onClick={() => handleProcess('decodeFull')} disabled={!input}>
            {t('tools.urlEncoder.decodeFull')}
          </Button>
        </div>
        <div className="mt-4 text-xs text-slate-500 space-y-1">
          <p>{t('tools.urlEncoder.encodeDesc')}</p>
          <p>{t('tools.urlEncoder.encodeFullDesc')}</p>
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
