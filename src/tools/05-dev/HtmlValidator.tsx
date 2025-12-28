import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'

interface ValidationResult {
  valid: boolean
  warnings: string[]
  stats: {
    elements: number
    tags: string[]
    depth: number
  }
}

export default function HtmlValidator() {
  const { t } = useTranslation()
  const [input, setInput] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sample Page</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>This is a <strong>sample</strong> paragraph.</p>
</body>
</html>`)
  const [result, setResult] = useState<ValidationResult | null>(null)

  const validate = useCallback(() => {
    const trimmed = input.trim()

    if (!trimmed) {
      setResult({
        valid: false,
        warnings: ['Empty input'],
        stats: { elements: 0, tags: [], depth: 0 }
      })
      return
    }

    const warnings: string[] = []
    const parser = new DOMParser()
    const doc = parser.parseFromString(trimmed, 'text/html')

    // Count elements and find unique tags
    const tagSet = new Set<string>()
    let elementCount = 0
    let maxDepth = 0

    const traverse = (el: Element, depth: number) => {
      elementCount++
      tagSet.add(el.tagName.toLowerCase())
      maxDepth = Math.max(maxDepth, depth)

      for (let i = 0; i < el.children.length; i++) {
        traverse(el.children[i], depth + 1)
      }
    }

    traverse(doc.documentElement, 1)

    // Check for common issues
    if (!trimmed.toLowerCase().includes('<!doctype')) {
      warnings.push(t('tools.htmlValidator.missingDoctype'))
    }

    if (!doc.querySelector('html[lang]')) {
      warnings.push(t('tools.htmlValidator.missingLang'))
    }

    if (!doc.querySelector('title')) {
      warnings.push(t('tools.htmlValidator.missingTitle'))
    }

    if (!doc.querySelector('meta[charset]')) {
      warnings.push(t('tools.htmlValidator.missingCharset'))
    }

    // Check for images without alt
    const imgsWithoutAlt = doc.querySelectorAll('img:not([alt])')
    if (imgsWithoutAlt.length > 0) {
      warnings.push(t('tools.htmlValidator.imgWithoutAlt', { count: imgsWithoutAlt.length }))
    }

    // Check for empty links
    const emptyLinks = doc.querySelectorAll('a:not([href]), a[href=""], a[href="#"]')
    if (emptyLinks.length > 0) {
      warnings.push(t('tools.htmlValidator.emptyLinks', { count: emptyLinks.length }))
    }

    // Check for inline styles
    const inlineStyles = doc.querySelectorAll('[style]')
    if (inlineStyles.length > 0) {
      warnings.push(t('tools.htmlValidator.inlineStyles', { count: inlineStyles.length }))
    }

    // Check for deprecated tags
    const deprecatedTags = ['center', 'font', 'marquee', 'blink', 'strike']
    const foundDeprecated = deprecatedTags.filter(tag => doc.querySelector(tag))
    if (foundDeprecated.length > 0) {
      warnings.push(t('tools.htmlValidator.deprecatedTags', { tags: foundDeprecated.join(', ') }))
    }

    setResult({
      valid: warnings.length === 0,
      warnings,
      stats: {
        elements: elementCount,
        tags: Array.from(tagSet).sort(),
        depth: maxDepth
      }
    })
  }, [input, t])

  const format = useCallback(() => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(input.trim(), 'text/html')

      const format = (node: Node, indent: number): string => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim() || ''
          return text ? '  '.repeat(indent) + text + '\n' : ''
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return ''

        const el = node as Element
        const tag = el.tagName.toLowerCase()
        const attrs = Array.from(el.attributes)
          .map(a => `${a.name}="${a.value}"`)
          .join(' ')

        const selfClosing = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']

        if (selfClosing.includes(tag)) {
          return '  '.repeat(indent) + `<${tag}${attrs ? ' ' + attrs : ''} />\n`
        }

        let result = '  '.repeat(indent) + `<${tag}${attrs ? ' ' + attrs : ''}>\n`

        for (let i = 0; i < node.childNodes.length; i++) {
          result += format(node.childNodes[i], indent + 1)
        }

        result += '  '.repeat(indent) + `</${tag}>\n`
        return result
      }

      let formatted = '<!DOCTYPE html>\n'
      formatted += format(doc.documentElement, 0)
      setInput(formatted.trim())
    } catch {
      // Invalid HTML
    }
  }, [input])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.htmlValidator.input')}
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={format}>
              {t('tools.htmlValidator.format')}
            </Button>
            <Button variant="secondary" onClick={() => setInput('')}>
              {t('common.clear')}
            </Button>
          </div>
        </div>

        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.htmlValidator.inputPlaceholder')}
          rows={12}
          className="font-mono text-sm"
        />

        <Button variant="primary" onClick={validate} className="mt-3">
          {t('tools.htmlValidator.validate')}
        </Button>
      </div>

      {result && (
        <>
          <div
            className={`card p-4 ${
              result.valid
                ? 'bg-green-50 border border-green-200'
                : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-2xl ${result.valid ? 'text-green-600' : 'text-yellow-600'}`}
              >
                {result.valid ? '✓' : '⚠'}
              </span>
              <span
                className={`text-lg font-medium ${
                  result.valid ? 'text-green-700' : 'text-yellow-700'
                }`}
              >
                {result.valid
                  ? t('tools.htmlValidator.valid')
                  : t('tools.htmlValidator.warnings', { count: result.warnings.length })}
              </span>
            </div>

            {result.warnings.length > 0 && (
              <ul className="mt-3 space-y-1">
                {result.warnings.map((warning, i) => (
                  <li key={i} className="text-sm text-yellow-700 flex items-start gap-2">
                    <span className="text-yellow-500">•</span>
                    {warning}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-4 bg-blue-50 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-700 mb-3">
              {t('tools.htmlValidator.statistics')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-mono text-blue-600">{result.stats.elements}</p>
                <p className="text-xs text-blue-700">{t('tools.htmlValidator.totalElements')}</p>
              </div>
              <div>
                <p className="text-2xl font-mono text-blue-600">{result.stats.depth}</p>
                <p className="text-xs text-blue-700">{t('tools.htmlValidator.maxDepth')}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-blue-700 mb-1">{t('tools.htmlValidator.tagsUsed')} ({result.stats.tags.length}):</p>
              <div className="flex flex-wrap gap-1">
                {result.stats.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.htmlValidator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.htmlValidator.tip1')}</li>
          <li>{t('tools.htmlValidator.tip2')}</li>
          <li>{t('tools.htmlValidator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
