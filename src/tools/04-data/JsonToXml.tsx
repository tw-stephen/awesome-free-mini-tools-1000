import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function JsonToXml() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const [rootElement, setRootElement] = useState('root')
  const [declaration, setDeclaration] = useState(true)
  const { copy, copied } = useClipboard()

  const escapeXml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  const jsonToXml = useCallback(
    (obj: unknown, tagName: string, level: number): string => {
      const spaces = ' '.repeat(indent * level)

      if (obj === null || obj === undefined) {
        return `${spaces}<${tagName}/>`
      }

      if (typeof obj === 'boolean' || typeof obj === 'number') {
        return `${spaces}<${tagName}>${obj}</${tagName}>`
      }

      if (typeof obj === 'string') {
        return `${spaces}<${tagName}>${escapeXml(obj)}</${tagName}>`
      }

      if (Array.isArray(obj)) {
        return obj
          .map((item) => {
            const itemTag = tagName.endsWith('s')
              ? tagName.slice(0, -1)
              : `${tagName}_item`
            return jsonToXml(item, itemTag, level)
          })
          .join('\n')
      }

      if (typeof obj === 'object') {
        const entries = Object.entries(obj)

        // Handle @attributes
        const attrs = obj as Record<string, unknown>
        let attrStr = ''
        if (attrs['@attributes'] && typeof attrs['@attributes'] === 'object') {
          const attrObj = attrs['@attributes'] as Record<string, string>
          attrStr = Object.entries(attrObj)
            .map(([key, value]) => ` ${key}="${escapeXml(String(value))}"`)
            .join('')
        }

        // Handle #text
        const textContent = attrs['#text']

        // Filter out special keys
        const childEntries = entries.filter(
          ([key]) => key !== '@attributes' && key !== '#text'
        )

        if (childEntries.length === 0) {
          if (textContent !== undefined) {
            return `${spaces}<${tagName}${attrStr}>${escapeXml(String(textContent))}</${tagName}>`
          }
          return `${spaces}<${tagName}${attrStr}/>`
        }

        const children = childEntries
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return value.map((item) => jsonToXml(item, key, level + 1)).join('\n')
            }
            return jsonToXml(value, key, level + 1)
          })
          .join('\n')

        if (textContent !== undefined) {
          return `${spaces}<${tagName}${attrStr}>\n${children}\n${spaces}${escapeXml(String(textContent))}</${tagName}>`
        }

        return `${spaces}<${tagName}${attrStr}>\n${children}\n${spaces}</${tagName}>`
      }

      return `${spaces}<${tagName}>${String(obj)}</${tagName}>`
    },
    [indent]
  )

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      return
    }

    try {
      const parsed = JSON.parse(input)
      let xml = ''

      if (declaration) {
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
      }

      // Check if the root key exists in parsed object
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        const keys = Object.keys(parsed)
        if (keys.length === 1) {
          xml += jsonToXml(parsed[keys[0]], keys[0], 0)
        } else {
          xml += jsonToXml(parsed, rootElement, 0)
        }
      } else {
        xml += jsonToXml(parsed, rootElement, 0)
      }

      setOutput(xml)
      setError('')
    } catch (e) {
      setError(t('tools.jsonToXml.invalidJson'))
      setOutput('')
    }
  }, [input, rootElement, declaration, jsonToXml, t])

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
            {t('tools.jsonToXml.input')}
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
          placeholder={t('tools.jsonToXml.inputPlaceholder')}
          rows={10}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.jsonToXml.options')}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.jsonToXml.rootElement')}
            </label>
            <input
              type="text"
              value={rootElement}
              onChange={(e) => setRootElement(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.jsonToXml.indent')}
            </label>
            <select
              value={indent}
              onChange={(e) => setIndent(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={declaration}
            onChange={(e) => setDeclaration(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-slate-600">
            {t('tools.jsonToXml.includeDeclaration')}
          </span>
        </label>

        <Button variant="primary" onClick={convert}>
          {t('tools.jsonToXml.convert')}
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
              {t('tools.jsonToXml.output')}
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
