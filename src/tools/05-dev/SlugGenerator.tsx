import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function SlugGenerator() {
  const { t } = useTranslation()
  const [input, setInput] = useState('Hello World! This is a Test String.')
  const [separator, setSeparator] = useState<'-' | '_' | '.'>('-')
  const [lowercase, setLowercase] = useState(true)
  const [removeStopWords, setRemoveStopWords] = useState(false)
  const [maxLength, setMaxLength] = useState(0)
  const { copy, copied } = useClipboard()

  const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were']

  const slug = useMemo(() => {
    let result = input.trim()

    // Replace accented characters
    result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    // Convert to lowercase if needed
    if (lowercase) {
      result = result.toLowerCase()
    }

    // Remove special characters except spaces
    result = result.replace(/[^\w\s-]/g, '')

    // Split into words
    let words = result.split(/\s+/).filter(Boolean)

    // Remove stop words if needed
    if (removeStopWords) {
      words = words.filter(word => !stopWords.includes(word.toLowerCase()))
    }

    // Join with separator
    result = words.join(separator)

    // Apply max length
    if (maxLength > 0 && result.length > maxLength) {
      result = result.slice(0, maxLength)
      // Don't end with separator
      if (result.endsWith(separator)) {
        result = result.slice(0, -1)
      }
    }

    return result
  }, [input, separator, lowercase, removeStopWords, maxLength])

  const variations = useMemo(() => {
    const base = input.trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .split(/\s+/)
      .filter(Boolean)

    return {
      kebab: base.join('-'),
      snake: base.join('_'),
      camel: base.map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join(''),
      pascal: base.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''),
      title: base.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    }
  }, [input])

  const generateUrlSafe = useCallback(() => {
    return encodeURIComponent(slug)
  }, [slug])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.slugGenerator.input')}
          </h3>
          <Button variant="secondary" onClick={() => setInput('')}>
            {t('common.clear')}
          </Button>
        </div>

        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.slugGenerator.inputPlaceholder')}
          rows={3}
          className="text-sm"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.slugGenerator.options')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.slugGenerator.separator')}
            </label>
            <div className="flex gap-2">
              {[
                { value: '-', label: 'Hyphen (-)' },
                { value: '_', label: 'Underscore (_)' },
                { value: '.', label: 'Dot (.)' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSeparator(value as typeof separator)}
                  className={`px-3 py-1 text-sm rounded border ${
                    separator === value
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.slugGenerator.maxLength')}: {maxLength === 0 ? t('tools.slugGenerator.noLimit') : maxLength}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={maxLength}
              onChange={(e) => setMaxLength(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
            />
            {t('tools.slugGenerator.lowercase')}
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={removeStopWords}
              onChange={(e) => setRemoveStopWords(e.target.checked)}
            />
            {t('tools.slugGenerator.removeStopWords')}
          </label>
        </div>
      </div>

      <div className="card p-4 bg-green-50 border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-green-700">
            {t('tools.slugGenerator.result')}
          </h3>
          <Button variant="secondary" onClick={() => copy(slug)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
        <code className="block p-3 bg-white rounded font-mono text-sm text-green-800 break-all">
          {slug || t('tools.slugGenerator.enterText')}
        </code>
        <p className="mt-2 text-xs text-green-600">
          {t('tools.slugGenerator.length')}: {slug.length} {t('tools.slugGenerator.characters')}
        </p>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.slugGenerator.variations')}
        </h3>
        <div className="space-y-2">
          {Object.entries(variations).map(([name, value]) => (
            <div key={name} className="flex items-center gap-3 p-2 bg-slate-50 rounded">
              <span className="text-xs text-slate-500 w-16">{name}:</span>
              <code className="flex-1 font-mono text-sm text-slate-700 break-all">{value}</code>
              <Button variant="secondary" onClick={() => copy(value)}>
                {copied ? t('common.copied') : t('common.copy')}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.slugGenerator.urlSafe')}
        </h3>
        <div className="flex items-center gap-3 p-2 bg-slate-50 rounded">
          <code className="flex-1 font-mono text-sm text-slate-700 break-all">
            {generateUrlSafe()}
          </code>
          <Button variant="secondary" onClick={() => copy(generateUrlSafe())}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.slugGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.slugGenerator.tip1')}</li>
          <li>{t('tools.slugGenerator.tip2')}</li>
          <li>{t('tools.slugGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
