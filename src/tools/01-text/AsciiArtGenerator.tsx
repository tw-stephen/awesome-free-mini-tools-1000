import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generateAsciiArt } from '../../utils/asciiArt'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import TextArea from '../../components/ui/TextArea'

export default function AsciiArtGenerator() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const { copied, copy } = useClipboard()

  const art = generateAsciiArt(input)

  const handleCopy = () => {
    copy(art)
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
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.asciiArt.inputPlaceholder')}
          maxLength={20}
        />
        <div className="mt-2 text-xs text-slate-500">
          {t('tools.asciiArt.limitNotice')}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-slate-700">
            {t('common.output')}
          </label>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleClear} disabled={!input}>
              {t('common.clear')}
            </Button>
            <Button onClick={handleCopy} disabled={!art}>
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>
        <TextArea
          value={art}
          readOnly
          rows={8}
          className="font-mono text-xs whitespace-pre overflow-x-auto leading-none tracking-tighter"
          placeholder={t('common.noContent')}
        />
      </div>

      <div className="text-center text-xs text-slate-500 bg-slate-100 rounded-lg py-3 px-4">
        {t('common.footer.privacy')}
      </div>
    </div>
  )
}
