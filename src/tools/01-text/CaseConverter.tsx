import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { convertCase, countCharacters, countWords, CaseMode } from '../../utils/caseConvert'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

const caseModes: CaseMode[] = [
  'uppercase',
  'lowercase',
  'capitalize',
  'sentence',
  'alternating',
  'inverse',
]

export default function CaseConverter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<CaseMode>('uppercase')
  const { copied, copy } = useClipboard()

  const output = useMemo(() => {
    return convertCase(input, mode)
  }, [input, mode])

  const charCount = useMemo(() => countCharacters(input), [input])
  const wordCount = useMemo(() => countWords(input), [input])

  const handleCopy = () => {
    copy(output)
  }

  const handleClear = () => {
    setInput('')
  }

  const handleDownload = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted-text-${mode}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-2">
          {caseModes.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === m
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t(`tools.caseConverter.modes.${m}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Input/Output Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('common.input')}
            </label>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{t('tools.caseConverter.charCount')}: {charCount}</span>
              <span className="text-slate-300">|</span>
              <span>{t('tools.caseConverter.wordCount')}: {wordCount}</span>
            </div>
          </div>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('common.placeholder')}
            rows={10}
          />
          <div className="mt-3 flex justify-end">
            <Button variant="secondary" onClick={handleClear} disabled={!input}>
              {t('common.clear')}
            </Button>
          </div>
        </div>

        {/* Output Section */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('common.output')}
            </label>
          </div>
          <TextArea
            value={output}
            readOnly
            placeholder={t('common.noContent')}
            rows={10}
            className="bg-slate-50"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={handleDownload} disabled={!output}>
              {t('common.download')}
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
