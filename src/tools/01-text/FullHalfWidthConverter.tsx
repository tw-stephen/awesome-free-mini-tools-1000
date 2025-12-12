import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toFullWidth, toHalfWidth } from '../../utils/fullHalfWidth'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

export default function FullHalfWidthConverter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const { copied, copy } = useClipboard()

  const handleToFull = () => {
    setInput(toFullWidth(input))
  }

  const handleToHalf = () => {
    setInput(toHalfWidth(input))
  }

  const handleCopy = () => {
    copy(input)
  }

  const handleClear = () => {
    setInput('')
  }

  return (
    <div className="space-y-6">
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
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <Button variant="secondary" onClick={handleClear} disabled={!input}>
            {t('common.clear')}
          </Button>
          <Button onClick={handleToFull} disabled={!input}>
            {t('tools.fullHalfWidth.toFull')}
          </Button>
          <Button onClick={handleToHalf} disabled={!input}>
            {t('tools.fullHalfWidth.toHalf')}
          </Button>
          <Button variant="secondary" onClick={handleCopy} disabled={!input}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 bg-slate-100 rounded-lg py-3 px-4">
        {t('common.footer.privacy')}
      </div>
    </div>
  )
}
