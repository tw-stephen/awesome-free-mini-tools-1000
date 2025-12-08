import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { escapeHtml, unescapeHtml } from '../../utils/htmlEntityConverter'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

export default function HtmlEntityConverter() {
  const { t } = useTranslation()
  const [textInput, setTextInput] = useState('')
  const [htmlInput, setHtmlInput] = useState('')
  const { copied: textCopied, copy: copyText } = useClipboard()
  const { copied: htmlCopied, copy: copyHtml } = useClipboard()

  const handleTextChange = (val: string) => {
    setTextInput(val)
    setHtmlInput(escapeHtml(val))
  }

  const handleHtmlChange = (val: string) => {
    setHtmlInput(val)
    setTextInput(unescapeHtml(val))
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">
            {t('tools.htmlEntityConverter.text')}
          </label>
        </div>
        <TextArea
          value={textInput}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={t('tools.htmlEntityConverter.textPlaceholder')}
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
            {t('tools.htmlEntityConverter.html')}
          </label>
        </div>
        <TextArea
          value={htmlInput}
          onChange={(e) => handleHtmlChange(e.target.value)}
          placeholder={t('tools.htmlEntityConverter.htmlPlaceholder')}
          rows={10}
          className="font-mono"
        />
        <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => handleHtmlChange('')} disabled={!htmlInput}>
              {t('common.clear')}
            </Button>
          <Button onClick={() => copyHtml(htmlInput)} disabled={!htmlInput}>
            {htmlCopied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
      </div>
    </div>
  )
}
