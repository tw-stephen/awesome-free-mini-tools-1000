import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

const encodeBase64 = (text: string): string => {
  if (!text) return ''
  try {
    return btoa(unescape(encodeURIComponent(text)))
  } catch {
    return ''
  }
}

const decodeBase64 = (text: string): string => {
  if (!text) return ''
  try {
    return decodeURIComponent(escape(atob(text)))
  } catch {
    return ''
  }
}

export default function Base64Encoder() {
  const { t } = useTranslation()
  const [textInput, setTextInput] = useState('')
  const [base64Input, setBase64Input] = useState('')
  const { copied: textCopied, copy: copyText } = useClipboard()
  const { copied: base64Copied, copy: copyBase64 } = useClipboard()

  const handleTextChange = (val: string) => {
    setTextInput(val)
    setBase64Input(encodeBase64(val))
  }

  const handleBase64Change = (val: string) => {
    setBase64Input(val)
    setTextInput(decodeBase64(val))
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">
            {t('tools.base64Encoder.text')}
          </label>
        </div>
        <TextArea
          value={textInput}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={t('tools.base64Encoder.textPlaceholder')}
          rows={10}
        />
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => handleTextChange('')} disabled={!textInput}>
            {t('common.clear')}
          </Button>
          <Button onClick={() => copyText(textInput)} disabled={!textInput}>
            {textCopied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">
            {t('tools.base64Encoder.base64')}
          </label>
        </div>
        <TextArea
          value={base64Input}
          onChange={(e) => handleBase64Change(e.target.value)}
          placeholder={t('tools.base64Encoder.base64Placeholder')}
          rows={10}
          className="font-mono"
        />
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => handleBase64Change('')} disabled={!base64Input}>
            {t('common.clear')}
          </Button>
          <Button onClick={() => copyBase64(base64Input)} disabled={!base64Input}>
            {base64Copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
      </div>
    </div>
  )
}
