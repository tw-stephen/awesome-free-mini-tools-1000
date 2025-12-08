import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { textToUnicode, unicodeToText } from '../../utils/unicodeConverter'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

export default function UnicodeConverter() {
  const { t } = useTranslation()
  const [textInput, setTextInput] = useState('')
  const [unicodeInput, setUnicodeInput] = useState('')
  const { copied: textCopied, copy: copyText } = useClipboard()
  const { copied: unicodeCopied, copy: copyUnicode } = useClipboard()

  // Avoid circular updates
  const handleTextChange = (val: string) => {
    setTextInput(val)
    setUnicodeInput(textToUnicode(val))
  }

  const handleUnicodeChange = (val: string) => {
    setUnicodeInput(val)
    setTextInput(unicodeToText(val))
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">
            {t('tools.unicodeConverter.text')}
          </label>
        </div>
        <TextArea
          value={textInput}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={t('tools.unicodeConverter.textPlaceholder')}
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
            {t('tools.unicodeConverter.unicode')}
          </label>
        </div>
        <TextArea
          value={unicodeInput}
          onChange={(e) => handleUnicodeChange(e.target.value)}
          placeholder={t('tools.unicodeConverter.unicodePlaceholder')}
          rows={10}
          className="font-mono"
        />
        <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => handleUnicodeChange('')} disabled={!unicodeInput}>
              {t('common.clear')}
            </Button>
          <Button onClick={() => copyUnicode(unicodeInput)} disabled={!unicodeInput}>
            {unicodeCopied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
      </div>
    </div>
  )
}
