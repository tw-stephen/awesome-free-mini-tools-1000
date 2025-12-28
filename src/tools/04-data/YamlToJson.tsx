import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function YamlToJson() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const { copy, copied } = useClipboard()

  const parseYaml = useCallback((yaml: string): unknown => {
    const lines = yaml.split('\n')
    const result: Record<string, unknown> = {}
    const stack: { indent: number; obj: Record<string, unknown>; key?: string }[] = [
      { indent: -1, obj: result },
    ]

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim() || line.trim().startsWith('#')) continue

      const indent = line.search(/\S/)
      const content = line.trim()

      // Handle array items
      if (content.startsWith('- ')) {
        const value = content.slice(2).trim()

        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
          stack.pop()
        }

        const parent = stack[stack.length - 1]
        const parentKey = parent.key

        if (parentKey) {
          if (!Array.isArray(parent.obj[parentKey])) {
            parent.obj[parentKey] = []
          }
          const arr = parent.obj[parentKey] as unknown[]

          if (value.includes(':')) {
            const colonIdx = value.indexOf(':')
            const key = value.slice(0, colonIdx).trim()
            const val = value.slice(colonIdx + 1).trim()
            const newObj: Record<string, unknown> = {}
            newObj[key] = parseValue(val)
            arr.push(newObj)
            stack.push({ indent, obj: newObj, key })
          } else {
            arr.push(parseValue(value))
          }
        }
        continue
      }

      // Handle key-value pairs
      const colonIdx = content.indexOf(':')
      if (colonIdx === -1) continue

      const key = content.slice(0, colonIdx).trim().replace(/^["']|["']$/g, '')
      const value = content.slice(colonIdx + 1).trim()

      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop()
      }

      const parent = stack[stack.length - 1].obj

      if (value === '' || value === '|' || value === '>') {
        // Nested object or multiline string
        parent[key] = {}
        stack.push({ indent, obj: parent[key] as Record<string, unknown>, key })
      } else if (value === '[]') {
        parent[key] = []
      } else if (value === '{}') {
        parent[key] = {}
      } else {
        parent[key] = parseValue(value)
        stack.push({ indent, obj: parent, key })
      }
    }

    return result
  }, [])

  const parseValue = (value: string): unknown => {
    if (!value || value === '~' || value === 'null') return null
    if (value === 'true' || value === 'yes') return true
    if (value === 'false' || value === 'no') return false

    // Check for quoted strings
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1).replace(/\\n/g, '\n').replace(/\\"/g, '"')
    }

    // Check for numbers
    if (/^-?\d+$/.test(value)) return parseInt(value, 10)
    if (/^-?\d*\.\d+$/.test(value)) return parseFloat(value)

    return value
  }

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      return
    }

    try {
      const parsed = parseYaml(input)
      setOutput(JSON.stringify(parsed, null, indent))
      setError('')
    } catch (e) {
      setError(t('tools.yamlToJson.invalidYaml'))
      setOutput('')
    }
  }, [input, parseYaml, indent, t])

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
            {t('tools.yamlToJson.input')}
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
          placeholder={t('tools.yamlToJson.inputPlaceholder')}
          rows={10}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm text-slate-600">
            {t('tools.yamlToJson.indent')}:
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
          {t('tools.yamlToJson.convert')}
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
              {t('tools.yamlToJson.output')}
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
