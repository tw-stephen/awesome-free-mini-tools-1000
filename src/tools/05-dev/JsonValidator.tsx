import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'

interface ValidationResult {
  valid: boolean
  error?: string
  line?: number
  column?: number
  stats?: {
    keys: number
    depth: number
    type: string
  }
}

export default function JsonValidator() {
  const { t } = useTranslation()
  const [input, setInput] = useState(`{
  "name": "John",
  "age": 30,
  "hobbies": ["reading", "coding"]
}`)
  const [result, setResult] = useState<ValidationResult | null>(null)

  const getJsonStats = (obj: unknown, depth = 0): { keys: number; depth: number } => {
    if (typeof obj !== 'object' || obj === null) {
      return { keys: 0, depth }
    }

    let maxDepth = depth
    let keyCount = 0

    if (Array.isArray(obj)) {
      for (const item of obj) {
        const stats = getJsonStats(item, depth + 1)
        maxDepth = Math.max(maxDepth, stats.depth)
        keyCount += stats.keys
      }
    } else {
      keyCount = Object.keys(obj).length
      for (const value of Object.values(obj)) {
        const stats = getJsonStats(value, depth + 1)
        maxDepth = Math.max(maxDepth, stats.depth)
        keyCount += stats.keys
      }
    }

    return { keys: keyCount, depth: maxDepth }
  }

  const validate = useCallback(() => {
    const trimmed = input.trim()

    if (!trimmed) {
      setResult({ valid: false, error: 'Empty input' })
      return
    }

    try {
      const parsed = JSON.parse(trimmed)
      const stats = getJsonStats(parsed)
      const type = Array.isArray(parsed) ? 'array' : typeof parsed

      setResult({
        valid: true,
        stats: {
          keys: stats.keys,
          depth: stats.depth,
          type
        }
      })
    } catch (e) {
      const error = e as SyntaxError
      const match = error.message.match(/position (\d+)/)
      let line = 1
      let column = 1

      if (match) {
        const pos = parseInt(match[1], 10)
        const lines = trimmed.slice(0, pos).split('\n')
        line = lines.length
        column = lines[lines.length - 1].length + 1
      }

      setResult({
        valid: false,
        error: error.message,
        line,
        column
      })
    }
  }, [input])

  const format = useCallback(() => {
    try {
      const parsed = JSON.parse(input)
      setInput(JSON.stringify(parsed, null, 2))
      validate()
    } catch {
      // Invalid JSON, can't format
    }
  }, [input, validate])

  const minify = useCallback(() => {
    try {
      const parsed = JSON.parse(input)
      setInput(JSON.stringify(parsed))
      validate()
    } catch {
      // Invalid JSON, can't minify
    }
  }, [input, validate])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.jsonValidator.input')}
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={format}>
              {t('tools.jsonValidator.format')}
            </Button>
            <Button variant="secondary" onClick={minify}>
              {t('tools.jsonValidator.minify')}
            </Button>
            <Button variant="secondary" onClick={() => setInput('')}>
              {t('common.clear')}
            </Button>
          </div>
        </div>

        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.jsonValidator.inputPlaceholder')}
          rows={12}
          className="font-mono text-sm"
        />

        <Button variant="primary" onClick={validate} className="mt-3">
          {t('tools.jsonValidator.validate')}
        </Button>
      </div>

      {result && (
        <div
          className={`card p-4 ${
            result.valid
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-2xl ${result.valid ? 'text-green-600' : 'text-red-600'}`}
            >
              {result.valid ? '✓' : '✗'}
            </span>
            <span
              className={`text-lg font-medium ${
                result.valid ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {result.valid
                ? t('tools.jsonValidator.valid')
                : t('tools.jsonValidator.invalid')}
            </span>
          </div>

          {result.valid && result.stats && (
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div className="text-center p-2 bg-green-100 rounded">
                <p className="text-xl font-mono text-green-700">{result.stats.type}</p>
                <p className="text-xs text-green-600">{t('tools.jsonValidator.type')}</p>
              </div>
              <div className="text-center p-2 bg-green-100 rounded">
                <p className="text-xl font-mono text-green-700">{result.stats.keys}</p>
                <p className="text-xs text-green-600">{t('tools.jsonValidator.keys')}</p>
              </div>
              <div className="text-center p-2 bg-green-100 rounded">
                <p className="text-xl font-mono text-green-700">{result.stats.depth}</p>
                <p className="text-xs text-green-600">{t('tools.jsonValidator.depth')}</p>
              </div>
            </div>
          )}

          {!result.valid && result.error && (
            <div className="mt-2">
              <p className="text-sm text-red-700 font-mono">{result.error}</p>
              {result.line && result.column && (
                <p className="text-sm text-red-600 mt-1">
                  {t('tools.jsonValidator.errorAt', { line: result.line, column: result.column })}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.jsonValidator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.jsonValidator.tip1')}</li>
          <li>{t('tools.jsonValidator.tip2')}</li>
          <li>{t('tools.jsonValidator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
