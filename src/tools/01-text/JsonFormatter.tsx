import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

export default function JsonFormatter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const { copied, copy } = useClipboard()

  const format = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      return
    }

    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, indent)
      setOutput(formatted)
      setError('')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }, [input, indent])

  const minify = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      return
    }

    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError('')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }, [input])

  const validate = useCallback(() => {
    if (!input.trim()) {
      setError('')
      return
    }

    try {
      JSON.parse(input)
      setError('')
      alert(t('tools.jsonFormatter.valid'))
    } catch (e) {
      setError((e as Error).message)
    }
  }, [input, t])

  const getStats = () => {
    if (!output) return null
    try {
      const parsed = JSON.parse(output)
      const isArray = Array.isArray(parsed)
      const count = isArray ? parsed.length : Object.keys(parsed).length
      return {
        type: isArray ? t('tools.jsonFormatter.array') : t('tools.jsonFormatter.object'),
        count,
        size: new Blob([output]).size,
      }
    } catch {
      return null
    }
  }

  const stats = getStats()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">{t('tools.jsonFormatter.indent')}:</label>
            <select
              value={indent}
              onChange={(e) => setIndent(parseInt(e.target.value))}
              className="px-2 py-1 border border-slate-200 rounded"
            >
              <option value={2}>2 {t('tools.jsonFormatter.spaces')}</option>
              <option value={4}>4 {t('tools.jsonFormatter.spaces')}</option>
              <option value={1}>1 {t('tools.jsonFormatter.tab')}</option>
            </select>
          </div>
          <Button onClick={format} variant="primary">
            {t('tools.jsonFormatter.format')}
          </Button>
          <Button onClick={minify} variant="secondary">
            {t('tools.jsonFormatter.minify')}
          </Button>
          <Button onClick={validate} variant="secondary">
            {t('tools.jsonFormatter.validate')}
          </Button>
          <Button onClick={() => copy(output)} disabled={!output}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        {error && (
          <div className="mt-3 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg">
            {t('tools.jsonFormatter.error')}: {error}
          </div>
        )}

        {stats && (
          <div className="mt-3 flex gap-4 text-sm text-slate-600">
            <span>
              {t('tools.jsonFormatter.type')}: <strong>{stats.type}</strong>
            </span>
            <span>
              {t('tools.jsonFormatter.items')}: <strong>{stats.count}</strong>
            </span>
            <span>
              {t('tools.jsonFormatter.size')}: <strong>{stats.size} bytes</strong>
            </span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('tools.jsonFormatter.input')}
          </label>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('tools.jsonFormatter.inputPlaceholder')}
            rows={20}
            className="font-mono text-sm"
          />
        </div>

        <div className="card p-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('tools.jsonFormatter.output')}
          </label>
          <TextArea
            value={output}
            readOnly
            placeholder={t('tools.jsonFormatter.outputPlaceholder')}
            rows={20}
            className="font-mono text-sm"
          />
        </div>
      </div>
    </div>
  )
}
