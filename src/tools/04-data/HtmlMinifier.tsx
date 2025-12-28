import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function HtmlMinifier() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [stats, setStats] = useState<{ original: number; minified: number } | null>(null)
  const [removeComments, setRemoveComments] = useState(true)
  const [collapseWhitespace, setCollapseWhitespace] = useState(true)
  const [removeEmptyAttributes, setRemoveEmptyAttributes] = useState(false)
  const { copy, copied } = useClipboard()

  const minify = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setStats(null)
      return
    }

    let html = input

    if (removeComments) {
      // Remove HTML comments (but preserve conditional comments)
      html = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
    }

    if (collapseWhitespace) {
      // Collapse multiple whitespace into single space
      html = html.replace(/\s+/g, ' ')

      // Remove whitespace around tags
      html = html.replace(/>\s+</g, '><')

      // Remove leading/trailing whitespace
      html = html.trim()
    }

    if (removeEmptyAttributes) {
      // Remove empty attributes
      html = html.replace(/\s+(\w+)=["']\s*["']/g, '')
    }

    // Remove optional quotes from attributes with simple values
    html = html.replace(/(\w+)="([a-zA-Z0-9_-]+)"/g, (match, attr, value) => {
      // Keep quotes for certain attributes
      if (['class', 'id', 'style', 'href', 'src'].includes(attr)) {
        return match
      }
      return `${attr}=${value}`
    })

    // Remove type="text/javascript" and type="text/css" (they're default)
    html = html.replace(/<script[^>]*\s+type=["']?text\/javascript["']?/gi, '<script')
    html = html.replace(/<style[^>]*\s+type=["']?text\/css["']?/gi, '<style')

    // Remove optional closing tags
    // html = html.replace(/<\/(li|dt|dd|p|tr|td|th|option)>/gi, '')

    setOutput(html)
    setStats({
      original: input.length,
      minified: html.length,
    })
  }, [input, removeComments, collapseWhitespace, removeEmptyAttributes])

  const beautify = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setStats(null)
      return
    }

    let html = input.trim()
    let result = ''
    let indent = 0
    const indentStr = '  '

    // Self-closing tags
    const selfClosing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']

    // Inline tags that shouldn't have newlines
    const inlineTags = ['a', 'span', 'strong', 'em', 'b', 'i', 'u', 'small', 'sub', 'sup', 'code', 'kbd', 'samp', 'var']

    // Collapse whitespace first
    html = html.replace(/\s+/g, ' ')

    // Add newlines after closing tags
    html = html.replace(/(<\/[^>]+>)/g, '$1\n')

    // Add newlines before opening tags
    html = html.replace(/(<[^\/!][^>]*[^\/]>)/g, '\n$1')

    // Add newlines after self-closing tags
    html = html.replace(/(<[^>]+\/>)/g, '$1\n')

    // Split by newlines and process
    const lines = html.split('\n').filter((line) => line.trim())

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      // Check if it's a closing tag
      if (trimmed.startsWith('</')) {
        indent = Math.max(0, indent - 1)
        result += indentStr.repeat(indent) + trimmed + '\n'
      }
      // Check if it's a self-closing tag or inline tag
      else if (trimmed.startsWith('<')) {
        const tagMatch = trimmed.match(/<(\w+)/)
        const tagName = tagMatch ? tagMatch[1].toLowerCase() : ''

        if (selfClosing.includes(tagName) || trimmed.endsWith('/>')) {
          result += indentStr.repeat(indent) + trimmed + '\n'
        } else if (inlineTags.includes(tagName)) {
          result += indentStr.repeat(indent) + trimmed + '\n'
        } else {
          result += indentStr.repeat(indent) + trimmed + '\n'
          indent++
        }
      }
      // Text content
      else {
        result += indentStr.repeat(indent) + trimmed + '\n'
      }
    }

    // Clean up
    result = result.replace(/\n\s*\n/g, '\n')

    setOutput(result.trim())
    setStats(null)
  }, [input])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
    } catch (e) {
      console.error('Failed to paste:', e)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setInput(event.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const downloadResult = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'index.min.html'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.htmlMinifier.input')}
          </h3>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".html,.htm"
              onChange={handleFileUpload}
              className="hidden"
              id="html-file-input"
            />
            <label
              htmlFor="html-file-input"
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
            >
              {t('tools.htmlMinifier.uploadFile')}
            </label>
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
          placeholder={t('tools.htmlMinifier.inputPlaceholder')}
          rows={10}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.htmlMinifier.options')}
        </h3>

        <div className="space-y-2 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={removeComments}
              onChange={(e) => setRemoveComments(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-slate-600">
              {t('tools.htmlMinifier.removeComments')}
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={collapseWhitespace}
              onChange={(e) => setCollapseWhitespace(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-slate-600">
              {t('tools.htmlMinifier.collapseWhitespace')}
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={removeEmptyAttributes}
              onChange={(e) => setRemoveEmptyAttributes(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-slate-600">
              {t('tools.htmlMinifier.removeEmptyAttributes')}
            </span>
          </label>
        </div>

        <div className="flex gap-2">
          <Button variant="primary" onClick={minify}>
            {t('tools.htmlMinifier.minify')}
          </Button>
          <Button variant="secondary" onClick={beautify}>
            {t('tools.htmlMinifier.beautify')}
          </Button>
        </div>
      </div>

      {stats && (
        <div className="card p-4 bg-green-50 border border-green-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-slate-600">{t('tools.htmlMinifier.original')}</p>
              <p className="text-lg font-semibold text-slate-800">
                {stats.original.toLocaleString()} bytes
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">{t('tools.htmlMinifier.minified')}</p>
              <p className="text-lg font-semibold text-slate-800">
                {stats.minified.toLocaleString()} bytes
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">{t('tools.htmlMinifier.savings')}</p>
              <p className="text-lg font-semibold text-green-600">
                {((1 - stats.minified / stats.original) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {output && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.htmlMinifier.output')}
            </h3>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => copy(output)}>
                {copied ? t('common.copied') : t('common.copy')}
              </Button>
              <Button variant="primary" onClick={downloadResult}>
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
