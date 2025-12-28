import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function XmlToJson() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const [preserveAttributes, setPreserveAttributes] = useState(true)
  const { copy, copied } = useClipboard()

  const parseXmlNode = useCallback(
    (node: Element): unknown => {
      const result: Record<string, unknown> = {}

      // Handle attributes
      if (preserveAttributes && node.attributes.length > 0) {
        const attrs: Record<string, string> = {}
        for (let i = 0; i < node.attributes.length; i++) {
          const attr = node.attributes[i]
          attrs[attr.name] = attr.value
        }
        result['@attributes'] = attrs
      }

      // Handle child nodes
      const children = Array.from(node.childNodes)
      const textContent = children
        .filter((child) => child.nodeType === Node.TEXT_NODE)
        .map((child) => child.textContent?.trim())
        .filter(Boolean)
        .join('')

      const elementChildren = children.filter(
        (child) => child.nodeType === Node.ELEMENT_NODE
      ) as Element[]

      if (elementChildren.length === 0) {
        // Leaf node with text content
        if (Object.keys(result).length === 0) {
          return textContent || null
        }
        if (textContent) {
          result['#text'] = textContent
        }
        return result
      }

      // Group children by tag name
      const childGroups: Record<string, unknown[]> = {}
      for (const child of elementChildren) {
        const tagName = child.tagName
        if (!childGroups[tagName]) {
          childGroups[tagName] = []
        }
        childGroups[tagName].push(parseXmlNode(child))
      }

      // Add children to result
      for (const [tagName, values] of Object.entries(childGroups)) {
        result[tagName] = values.length === 1 ? values[0] : values
      }

      if (textContent && elementChildren.length > 0) {
        result['#text'] = textContent
      }

      return result
    },
    [preserveAttributes]
  )

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      return
    }

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(input, 'text/xml')

      // Check for parsing errors
      const parseError = doc.querySelector('parsererror')
      if (parseError) {
        setError(t('tools.xmlToJson.invalidXml'))
        setOutput('')
        return
      }

      const root = doc.documentElement
      const result = {
        [root.tagName]: parseXmlNode(root),
      }

      setOutput(JSON.stringify(result, null, indent))
      setError('')
    } catch (e) {
      setError(t('tools.xmlToJson.invalidXml'))
      setOutput('')
    }
  }, [input, indent, parseXmlNode, t])

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
            {t('tools.xmlToJson.input')}
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
          placeholder={t('tools.xmlToJson.inputPlaceholder')}
          rows={10}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.xmlToJson.options')}
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm text-slate-600">
            {t('tools.xmlToJson.indent')}:
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

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={preserveAttributes}
            onChange={(e) => setPreserveAttributes(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-slate-600">
            {t('tools.xmlToJson.preserveAttributes')}
          </span>
        </label>

        <Button variant="primary" onClick={convert}>
          {t('tools.xmlToJson.convert')}
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
              {t('tools.xmlToJson.output')}
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
