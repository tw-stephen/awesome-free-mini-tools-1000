import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

// Convert halfwidth to fullwidth
const toFullwidth = (text: string): string => {
  if (!text) return ''
  return text.replace(/[\x21-\x7E]/g, (char) => {
    // Halfwidth ASCII to fullwidth (0x21-0x7E → 0xFF01-0xFF5E)
    return String.fromCharCode(char.charCodeAt(0) + 0xFEE0)
  }).replace(/ /g, '\u3000') // Space to fullwidth space
}

// Convert fullwidth to halfwidth
const toHalfwidth = (text: string): string => {
  if (!text) return ''
  return text.replace(/[\uFF01-\uFF5E]/g, (char) => {
    // Fullwidth ASCII to halfwidth (0xFF01-0xFF5E → 0x21-0x7E)
    return String.fromCharCode(char.charCodeAt(0) - 0xFEE0)
  }).replace(/\u3000/g, ' ') // Fullwidth space to space
}

export default function FullwidthConverter() {
  const { t } = useTranslation()
  const [halfwidthInput, setHalfwidthInput] = useState('')
  const [fullwidthInput, setFullwidthInput] = useState('')
  const { copied: halfCopied, copy: copyHalf } = useClipboard()
  const { copied: fullCopied, copy: copyFull } = useClipboard()

  const handleHalfwidthChange = (val: string) => {
    setHalfwidthInput(val)
    setFullwidthInput(toFullwidth(val))
  }

  const handleFullwidthChange = (val: string) => {
    setFullwidthInput(val)
    setHalfwidthInput(toHalfwidth(val))
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">
            {t('tools.fullwidthConverter.halfwidth')}
          </label>
        </div>
        <TextArea
          value={halfwidthInput}
          onChange={(e) => handleHalfwidthChange(e.target.value)}
          placeholder={t('tools.fullwidthConverter.halfwidthPlaceholder')}
          rows={10}
          className="font-mono"
        />
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => handleHalfwidthChange('')} disabled={!halfwidthInput}>
            {t('common.clear')}
          </Button>
          <Button onClick={() => copyHalf(halfwidthInput)} disabled={!halfwidthInput}>
            {halfCopied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">
            {t('tools.fullwidthConverter.fullwidth')}
          </label>
        </div>
        <TextArea
          value={fullwidthInput}
          onChange={(e) => handleFullwidthChange(e.target.value)}
          placeholder={t('tools.fullwidthConverter.fullwidthPlaceholder')}
          rows={10}
          className="font-mono"
        />
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => handleFullwidthChange('')} disabled={!fullwidthInput}>
            {t('common.clear')}
          </Button>
          <Button onClick={() => copyFull(fullwidthInput)} disabled={!fullwidthInput}>
            {fullCopied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
      </div>
    </div>
  )
}
