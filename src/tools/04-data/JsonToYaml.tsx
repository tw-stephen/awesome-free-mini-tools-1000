import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function JsonToYaml() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const { copy, copied } = useClipboard()

  const jsonToYaml = useCallback((obj: unknown, indentLevel = 0): string => {
    const spaces = ' '.repeat(indent * indentLevel)

    if (obj === null) return 'null'
    if (obj === undefined) return ''
    if (typeof obj === 'boolean') return obj.toString()
    if (typeof obj === 'number') return obj.toString()
    if (typeof obj === 'string') {
      // Check if string needs quoting
      if (
        obj.includes('\n') ||
        obj.includes(':') ||
        obj.includes('#') ||
        obj.startsWith(' ') ||
        obj.endsWith(' ') ||
        /^[0-9]/.test(obj) ||
        ['true', 'false', 'null', 'yes', 'no'].includes(obj.toLowerCase())
      ) {
        return `"${obj.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`
      }
      return obj
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]'
      return obj
        .map((item) => {
          const val = jsonToYaml(item, indentLevel + 1)
          if (typeof item === 'object' && item !== null) {
            const lines = val.split('\n')
            return `${spaces}- ${lines[0]}\n${lines.slice(1).join('\n')}`
          }
          return `${spaces}- ${val}`
        })
        .join('\n')
    }

    if (typeof obj === 'object') {
      const entries = Object.entries(obj)
      if (entries.length === 0) return '{}'
      return entries
        .map(([key, value]) => {
          const safeKey = /[:\s#]/.test(key) ? `"${key}"` : key
          if (typeof value === 'object' && value !== null) {
            const nested = jsonToYaml(value, indentLevel + 1)
            if (Array.isArray(value) && value.length > 0) {
              return `${spaces}${safeKey}:\n${nested}`
            }
            if (Object.keys(value).length > 0) {
              return `${spaces}${safeKey}:\n${nested}`
            }
            return `${spaces}${safeKey}: ${Array.isArray(value) ? '[]' : '{}'}`
          }
          return `${spaces}${safeKey}: ${jsonToYaml(value, indentLevel)}`
        })
        .join('\n')
    }

    return String(obj)
  }, [indent])

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      return
    }

    try {
      const parsed = JSON.parse(input)
      const yaml = jsonToYaml(parsed)
      setOutput(yaml)
      setError('')
    } catch (e) {
      setError(t('tools.jsonToYaml.invalidJson'))
      setOutput('')
    }
  }, [input, jsonToYaml, t])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
    } catch (e) {
      console.error('Failed to paste:', e)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.jsonToYaml.input')}
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handlePaste}>
              {t('common.paste')}
            </Button>
            <Button variant="secondary" onClick={() => setInput('')}>
              {t('common.clear')}
            </Button>
          </div>
        </div>
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.jsonToYaml.inputPlaceholder')}
          rows={10}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm text-slate-600">
            {t('tools.jsonToYaml.indent')}:
          </label>
          <select
            value={indent}
            onChange={(e) => setIndent(parseInt(e.target.value))}
            className="px-3 py-1 border border-slate-300 rounded"
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
          </select>
        </div>

        <Button variant="primary" onClick={convert}>
          {t('tools.jsonToYaml.convert')}
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
              {t('tools.jsonToYaml.output')}
            </h3>
            <Button variant="secondary" onClick={() => copy(output)}>
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
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
