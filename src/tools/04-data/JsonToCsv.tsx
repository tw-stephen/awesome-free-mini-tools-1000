import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function JsonToCsv() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [delimiter, setDelimiter] = useState(',')
  const [includeHeader, setIncludeHeader] = useState(true)
  const { copy, copied } = useClipboard()

  const escapeValue = useCallback((value: unknown, delim: string): string => {
    if (value === null || value === undefined) return ''
    const str = String(value)
    if (str.includes(delim) || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }, [])

  const flattenObject = useCallback(
    (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
      const result: Record<string, unknown> = {}

      for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(result, flattenObject(value as Record<string, unknown>, newKey))
        } else if (Array.isArray(value)) {
          result[newKey] = JSON.stringify(value)
        } else {
          result[newKey] = value
        }
      }

      return result
    },
    []
  )

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      return
    }

    try {
      const parsed = JSON.parse(input)
      const delim = delimiter === '\\t' ? '\t' : delimiter

      let data: Record<string, unknown>[]

      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          setOutput('')
          return
        }

        // Check if array of primitives
        if (typeof parsed[0] !== 'object' || parsed[0] === null) {
          const csv = parsed.map((item) => escapeValue(item, delim)).join('\n')
          setOutput(csv)
          return
        }

        data = parsed.map((item) =>
          typeof item === 'object' && item !== null
            ? flattenObject(item as Record<string, unknown>)
            : { value: item }
        )
      } else if (typeof parsed === 'object' && parsed !== null) {
        data = [flattenObject(parsed)]
      } else {
        setOutput(String(parsed))
        return
      }

      // Get all unique headers
      const headers = [...new Set(data.flatMap((item) => Object.keys(item)))]

      const lines: string[] = []

      if (includeHeader) {
        lines.push(headers.map((h) => escapeValue(h, delim)).join(delim))
      }

      for (const row of data) {
        const values = headers.map((header) => escapeValue(row[header], delim))
        lines.push(values.join(delim))
      }

      setOutput(lines.join('\n'))
      setError('')
    } catch (e) {
      setError(t('tools.jsonToCsv.invalidJson'))
      setOutput('')
    }
  }, [input, delimiter, includeHeader, escapeValue, flattenObject, t])

  const downloadCsv = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'data.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.jsonToCsv.input')}
          </h3>
          <Button variant="secondary" onClick={() => setInput('')}>
            {t('common.clear')}
          </Button>
        </div>
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.jsonToCsv.inputPlaceholder')}
          rows={10}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.jsonToCsv.options')}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.jsonToCsv.delimiter')}
            </label>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value=",">{t('tools.jsonToCsv.comma')} (,)</option>
              <option value=";">{t('tools.jsonToCsv.semicolon')} (;)</option>
              <option value="\t">{t('tools.jsonToCsv.tab')}</option>
              <option value="|">{t('tools.jsonToCsv.pipe')} (|)</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={includeHeader}
            onChange={(e) => setIncludeHeader(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-slate-600">
            {t('tools.jsonToCsv.includeHeader')}
          </span>
        </label>

        <Button variant="primary" onClick={convert}>
          {t('tools.jsonToCsv.convert')}
        </Button>
      </div>

      {error && (
        <div className="card p-4 bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {output && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.jsonToCsv.output')}
            </h3>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => copy(output)}>
                {copied ? t('common.copied') : t('common.copy')}
              </Button>
              <Button variant="primary" onClick={downloadCsv}>
                {t('common.download')}
              </Button>
            </div>
          </div>
          <TextArea
            value={output}
            readOnly
            rows={10}
            className="font-mono text-sm bg-slate-50"
          />
        </div>
      )}
    </div>
  )
}
