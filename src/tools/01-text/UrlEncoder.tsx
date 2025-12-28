import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

const encodeUrl = (text: string): string => {
  if (!text) return ''
  try {
    return encodeURIComponent(text)
  } catch {
    return text
  }
}

const decodeUrl = (text: string): string => {
  if (!text) return ''
  try {
    return decodeURIComponent(text)
  } catch {
    return text
  }
}

export default function UrlEncoder() {
  const { t } = useTranslation()
  const [textInput, setTextInput] = useState('')
  const [encodedInput, setEncodedInput] = useState('')
  const { copied: textCopied, copy: copyText } = useClipboard()
  const { copied: encodedCopied, copy: copyEncoded } = useClipboard()

  const handleTextChange = (val: string) => {
    setTextInput(val)
    setEncodedInput(encodeUrl(val))
  }

  const handleEncodedChange = (val: string) => {
    setEncodedInput(val)
    setTextInput(decodeUrl(val))
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">
            {t('tools.urlEncoder.text')}
          </label>
        </div>
        <TextArea
          value={textInput}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={t('tools.urlEncoder.textPlaceholder')}
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
            {t('tools.urlEncoder.encoded')}
          </label>
        </div>
        <TextArea
          value={encodedInput}
          onChange={(e) => handleEncodedChange(e.target.value)}
          placeholder={t('tools.urlEncoder.encodedPlaceholder')}
          rows={10}
          className="font-mono"
        />
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => handleEncodedChange('')} disabled={!encodedInput}>
            {t('common.clear')}
          </Button>
          <Button onClick={() => copyEncoded(encodedInput)} disabled={!encodedInput}>
            {encodedCopied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
      </div>
    </div>
  )
}
