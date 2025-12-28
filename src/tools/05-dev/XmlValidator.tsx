import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'

interface ValidationResult {
  valid: boolean
  error?: string
  line?: number
  stats?: {
    elements: number
    attributes: number
    depth: number
  }
}

export default function XmlValidator() {
  const { t } = useTranslation()
  const [input, setInput] = useState(`<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title>The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <price>10.99</price>
  </book>
</bookstore>`)
  const [result, setResult] = useState<ValidationResult | null>(null)

  const getXmlStats = (doc: Document): { elements: number; attributes: number; depth: number } => {
    let elements = 0
    let attributes = 0
    let maxDepth = 0

    const traverse = (node: Element, depth: number) => {
      elements++
      attributes += node.attributes.length
      maxDepth = Math.max(maxDepth, depth)

      for (let i = 0; i < node.children.length; i++) {
        traverse(node.children[i], depth + 1)
      }
    }

    if (doc.documentElement) {
      traverse(doc.documentElement, 1)
    }

    return { elements, attributes, depth: maxDepth }
  }

  const validate = useCallback(() => {
    const trimmed = input.trim()

    if (!trimmed) {
      setResult({ valid: false, error: 'Empty input' })
      return
    }

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(trimmed, 'application/xml')

      const parseError = doc.querySelector('parsererror')
      if (parseError) {
        const errorText = parseError.textContent || 'XML parsing error'
        const lineMatch = errorText.match(/line (\d+)/i)
        setResult({
          valid: false,
          error: errorText.split('\n')[0],
          line: lineMatch ? parseInt(lineMatch[1], 10) : undefined
        })
        return
      }

      const stats = getXmlStats(doc)
      setResult({
        valid: true,
        stats
      })
    } catch (e) {
      setResult({
        valid: false,
        error: (e as Error).message
      })
    }
  }, [input])

  const format = useCallback(() => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(input.trim(), 'application/xml')

      if (doc.querySelector('parsererror')) {
        return
      }

      const serializer = new XMLSerializer()
      const xmlStr = serializer.serializeToString(doc)

      // Simple formatting
      let formatted = ''
      let indent = 0
      const lines = xmlStr.replace(/></g, '>\n<').split('\n')

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (trimmedLine.startsWith('</')) {
          indent--
        }
        formatted += '  '.repeat(Math.max(0, indent)) + trimmedLine + '\n'
        if (trimmedLine.startsWith('<') && !trimmedLine.startsWith('</') && !trimmedLine.startsWith('<?') && !trimmedLine.endsWith('/>') && !trimmedLine.includes('</')) {
          indent++
        }
      }

      setInput(formatted.trim())
      validate()
    } catch {
      // Invalid XML
    }
  }, [input, validate])

  const minify = useCallback(() => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(input.trim(), 'application/xml')

      if (doc.querySelector('parsererror')) {
        return
      }

      const serializer = new XMLSerializer()
      const xmlStr = serializer.serializeToString(doc)
      setInput(xmlStr.replace(/>\s+</g, '><').trim())
      validate()
    } catch {
      // Invalid XML
    }
  }, [input, validate])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.xmlValidator.input')}
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={format}>
              {t('tools.xmlValidator.format')}
            </Button>
            <Button variant="secondary" onClick={minify}>
              {t('tools.xmlValidator.minify')}
            </Button>
            <Button variant="secondary" onClick={() => setInput('')}>
              {t('common.clear')}
            </Button>
          </div>
        </div>

        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.xmlValidator.inputPlaceholder')}
          rows={12}
          className="font-mono text-sm"
        />

        <Button variant="primary" onClick={validate} className="mt-3">
          {t('tools.xmlValidator.validate')}
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
                ? t('tools.xmlValidator.valid')
                : t('tools.xmlValidator.invalid')}
            </span>
          </div>

          {result.valid && result.stats && (
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div className="text-center p-2 bg-green-100 rounded">
                <p className="text-xl font-mono text-green-700">{result.stats.elements}</p>
                <p className="text-xs text-green-600">{t('tools.xmlValidator.elements')}</p>
              </div>
              <div className="text-center p-2 bg-green-100 rounded">
                <p className="text-xl font-mono text-green-700">{result.stats.attributes}</p>
                <p className="text-xs text-green-600">{t('tools.xmlValidator.attributes')}</p>
              </div>
              <div className="text-center p-2 bg-green-100 rounded">
                <p className="text-xl font-mono text-green-700">{result.stats.depth}</p>
                <p className="text-xs text-green-600">{t('tools.xmlValidator.depth')}</p>
              </div>
            </div>
          )}

          {!result.valid && result.error && (
            <div className="mt-2">
              <p className="text-sm text-red-700 font-mono">{result.error}</p>
              {result.line && (
                <p className="text-sm text-red-600 mt-1">
                  {t('tools.xmlValidator.errorAt', { line: result.line })}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.xmlValidator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.xmlValidator.tip1')}</li>
          <li>{t('tools.xmlValidator.tip2')}</li>
          <li>{t('tools.xmlValidator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
