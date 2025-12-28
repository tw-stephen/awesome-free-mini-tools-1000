import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'

interface ValidationResult {
  valid: boolean
  error?: string
  line?: number
  stats?: {
    keys: number
    depth: number
    type: string
  }
}

// Simple YAML parser for validation
function parseYaml(yaml: string): { data: unknown; error?: string; line?: number } {
  const lines = yaml.split('\n')
  const result: Record<string, unknown> = {}
  const stack: { indent: number; obj: Record<string, unknown>; key?: string }[] = [
    { indent: -1, obj: result }
  ]

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) continue

    const indent = line.search(/\S/)
    const keyMatch = trimmed.match(/^([^:]+):\s*(.*)$/)

    if (!keyMatch) {
      if (trimmed.startsWith('- ')) {
        // Array item
        const value = trimmed.slice(2).trim()
        const parent = stack[stack.length - 1]
        if (parent.key) {
          const arr = parent.obj[parent.key]
          if (Array.isArray(arr)) {
            arr.push(parseValue(value))
          }
        }
        continue
      }
      return { data: null, error: `Invalid syntax at line ${i + 1}`, line: i + 1 }
    }

    const key = keyMatch[1].trim()
    let value: unknown = keyMatch[2].trim()

    // Pop stack until we find the right parent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop()
    }

    const parent = stack[stack.length - 1]

    if (value === '' || value === '|' || value === '>') {
      // Nested object or multiline
      const newObj: Record<string, unknown> = {}
      parent.obj[key] = newObj
      stack.push({ indent, obj: newObj, key })
    } else if (value.startsWith('[') && value.endsWith(']')) {
      // Inline array
      const items = value.slice(1, -1).split(',').map(s => parseValue(s.trim()))
      parent.obj[key] = items
    } else {
      parent.obj[key] = parseValue(value)
    }
  }

  return { data: result }
}

function parseValue(value: string): unknown {
  if (value === '' || value === 'null' || value === '~') return null
  if (value === 'true') return true
  if (value === 'false') return false
  if (/^-?\d+$/.test(value)) return parseInt(value, 10)
  if (/^-?\d*\.\d+$/.test(value)) return parseFloat(value)
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }
  return value
}

function getYamlStats(obj: unknown, depth = 0): { keys: number; depth: number } {
  if (typeof obj !== 'object' || obj === null) {
    return { keys: 0, depth }
  }

  let maxDepth = depth
  let keyCount = 0

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const stats = getYamlStats(item, depth + 1)
      maxDepth = Math.max(maxDepth, stats.depth)
      keyCount += stats.keys
    }
  } else {
    keyCount = Object.keys(obj).length
    for (const value of Object.values(obj)) {
      const stats = getYamlStats(value, depth + 1)
      maxDepth = Math.max(maxDepth, stats.depth)
      keyCount += stats.keys
    }
  }

  return { keys: keyCount, depth: maxDepth }
}

export default function YamlValidator() {
  const { t } = useTranslation()
  const [input, setInput] = useState(`name: John Doe
age: 30
address:
  street: 123 Main St
  city: New York
hobbies:
  - reading
  - coding
  - gaming`)
  const [result, setResult] = useState<ValidationResult | null>(null)

  const validate = useCallback(() => {
    const trimmed = input.trim()

    if (!trimmed) {
      setResult({ valid: false, error: 'Empty input' })
      return
    }

    const { data, error, line } = parseYaml(trimmed)

    if (error) {
      setResult({ valid: false, error, line })
      return
    }

    const stats = getYamlStats(data)
    const type = Array.isArray(data) ? 'array' : typeof data

    setResult({
      valid: true,
      stats: {
        keys: stats.keys,
        depth: stats.depth,
        type
      }
    })
  }, [input])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.yamlValidator.input')}
          </h3>
          <Button variant="secondary" onClick={() => setInput('')}>
            {t('common.clear')}
          </Button>
        </div>

        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.yamlValidator.inputPlaceholder')}
          rows={12}
          className="font-mono text-sm"
        />

        <Button variant="primary" onClick={validate} className="mt-3">
          {t('tools.yamlValidator.validate')}
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
                ? t('tools.yamlValidator.valid')
                : t('tools.yamlValidator.invalid')}
            </span>
          </div>

          {result.valid && result.stats && (
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div className="text-center p-2 bg-green-100 rounded">
                <p className="text-xl font-mono text-green-700">{result.stats.type}</p>
                <p className="text-xs text-green-600">{t('tools.yamlValidator.type')}</p>
              </div>
              <div className="text-center p-2 bg-green-100 rounded">
                <p className="text-xl font-mono text-green-700">{result.stats.keys}</p>
                <p className="text-xs text-green-600">{t('tools.yamlValidator.keys')}</p>
              </div>
              <div className="text-center p-2 bg-green-100 rounded">
                <p className="text-xl font-mono text-green-700">{result.stats.depth}</p>
                <p className="text-xs text-green-600">{t('tools.yamlValidator.depth')}</p>
              </div>
            </div>
          )}

          {!result.valid && result.error && (
            <div className="mt-2">
              <p className="text-sm text-red-700 font-mono">{result.error}</p>
              {result.line && (
                <p className="text-sm text-red-600 mt-1">
                  {t('tools.yamlValidator.errorAt', { line: result.line })}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.yamlValidator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.yamlValidator.tip1')}</li>
          <li>{t('tools.yamlValidator.tip2')}</li>
          <li>{t('tools.yamlValidator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
