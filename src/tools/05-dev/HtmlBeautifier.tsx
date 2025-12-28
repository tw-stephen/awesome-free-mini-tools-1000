import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function HtmlBeautifier() {
  const { t } = useTranslation()
  const [input, setInput] = useState(`<div class="container"><h1>Title</h1><p>This is a <strong>paragraph</strong> with some text.</p><ul><li>Item 1</li><li>Item 2</li></ul></div>`)
  const [output, setOutput] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const { copy, copied } = useClipboard()

  const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']
  const inlineTags = ['a', 'span', 'strong', 'em', 'b', 'i', 'u', 'small', 'code', 'sub', 'sup']

  const beautify = useCallback(() => {
    try {
      let html = input.trim()
      if (!html) {
        setOutput('')
        return
      }

      const indent = ' '.repeat(indentSize)
      let level = 0
      let result = ''

      // Split by tags while preserving content
      const parts = html.split(/(<[^>]+>)/g).filter(Boolean)

      for (const part of parts) {
        const trimmedPart = part.trim()
        if (!trimmedPart) continue

        if (trimmedPart.startsWith('</')) {
          // Closing tag
          level = Math.max(0, level - 1)
          const tagName = trimmedPart.match(/<\/(\w+)/)?.[1]?.toLowerCase()
          if (tagName && inlineTags.includes(tagName)) {
            result = result.trimEnd() + trimmedPart
          } else {
            result += '\n' + indent.repeat(level) + trimmedPart
          }
        } else if (trimmedPart.startsWith('<')) {
          // Opening or self-closing tag
          const tagName = trimmedPart.match(/<(\w+)/)?.[1]?.toLowerCase()
          const isSelfClosing = selfClosingTags.includes(tagName || '') || trimmedPart.endsWith('/>')

          if (tagName && inlineTags.includes(tagName)) {
            result = result.trimEnd() + trimmedPart
            if (!isSelfClosing && !trimmedPart.includes('/>')) {
              level++
            }
          } else {
            if (result) result += '\n'
            result += indent.repeat(level) + trimmedPart
            if (!isSelfClosing && !trimmedPart.startsWith('<!') && !trimmedPart.startsWith('<?')) {
              level++
            }
          }
        } else {
          // Text content
          const text = trimmedPart.trim()
          if (text) {
            if (result.endsWith('>') && !result.match(/<(a|span|strong|em|b|i|u|small|code|sub|sup)[^>]*>$/i)) {
              result += '\n' + indent.repeat(level) + text
            } else {
              result += text
            }
          }
        }
      }

      setOutput(result.trim())
    } catch {
      setOutput(t('tools.htmlBeautifier.error'))
    }
  }, [input, indentSize, t, selfClosingTags, inlineTags])

  const minify = useCallback(() => {
    try {
      let html = input.trim()
      if (!html) {
        setOutput('')
        return
      }

      html = html
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim()

      setOutput(html)
    } catch {
      setOutput(t('tools.htmlBeautifier.error'))
    }
  }, [input, t])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.htmlBeautifier.input')}
          </h3>
          <Button variant="secondary" onClick={() => setInput('')}>
            {t('common.clear')}
          </Button>
        </div>

        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.htmlBeautifier.inputPlaceholder')}
          rows={8}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.htmlBeautifier.options')}
        </h3>

        <div>
          <label className="block text-sm text-slate-600 mb-1">
            {t('tools.htmlBeautifier.indentSize')}
          </label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(parseInt(e.target.value))}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            <option value="2">2 {t('tools.htmlBeautifier.spaces')}</option>
            <option value="4">4 {t('tools.htmlBeautifier.spaces')}</option>
          </select>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="primary" onClick={beautify}>
            {t('tools.htmlBeautifier.beautify')}
          </Button>
          <Button variant="secondary" onClick={minify}>
            {t('tools.htmlBeautifier.minify')}
          </Button>
        </div>
      </div>

      {output && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.htmlBeautifier.output')}
            </h3>
            <Button variant="secondary" onClick={() => copy(output)}>
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>

          <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto">
            <code className="font-mono text-sm text-slate-800">{output}</code>
          </pre>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.htmlBeautifier.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.htmlBeautifier.tip1')}</li>
          <li>{t('tools.htmlBeautifier.tip2')}</li>
        </ul>
      </div>
    </div>
  )
}
