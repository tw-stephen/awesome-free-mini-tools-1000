import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  stats: {
    rules: number
    selectors: number
    properties: number
  }
}

export default function CssValidator() {
  const { t } = useTranslation()
  const [input, setInput] = useState(`.container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #f0f0f0;
}

.header {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.button {
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}`)
  const [result, setResult] = useState<ValidationResult | null>(null)

  const validate = useCallback(() => {
    const trimmed = input.trim()

    if (!trimmed) {
      setResult({
        valid: false,
        errors: ['Empty input'],
        warnings: [],
        stats: { rules: 0, selectors: 0, properties: 0 }
      })
      return
    }

    const errors: string[] = []
    const warnings: string[] = []
    let rules = 0
    let selectors = 0
    let properties = 0

    // Remove comments
    const noComments = trimmed.replace(/\/\*[\s\S]*?\*\//g, '')

    // Split into rules
    const ruleRegex = /([^{}]+)\{([^{}]*)\}/g
    let match

    while ((match = ruleRegex.exec(noComments)) !== null) {
      rules++
      const selectorPart = match[1].trim()
      const declarationPart = match[2].trim()

      // Count selectors (split by comma)
      const selectorList = selectorPart.split(',').filter(s => s.trim())
      selectors += selectorList.length

      // Validate selectors
      for (const selector of selectorList) {
        const trimmedSelector = selector.trim()
        if (!trimmedSelector) {
          errors.push(t('tools.cssValidator.emptySelector'))
        }
      }

      // Parse declarations
      const declarations = declarationPart.split(';').filter(d => d.trim())

      for (const decl of declarations) {
        const parts = decl.split(':')
        if (parts.length < 2) {
          if (decl.trim()) {
            errors.push(t('tools.cssValidator.invalidDeclaration', { declaration: decl.trim() }))
          }
          continue
        }

        const property = parts[0].trim()
        const value = parts.slice(1).join(':').trim()

        if (!property) {
          errors.push(t('tools.cssValidator.emptyProperty'))
          continue
        }

        if (!value) {
          errors.push(t('tools.cssValidator.emptyValue', { property }))
          continue
        }

        properties++

        // Check for vendor prefixes
        if (property.startsWith('-webkit-') || property.startsWith('-moz-') || property.startsWith('-ms-') || property.startsWith('-o-')) {
          warnings.push(t('tools.cssValidator.vendorPrefix', { property }))
        }

        // Check for !important
        if (value.includes('!important')) {
          warnings.push(t('tools.cssValidator.importantUsage', { property }))
        }
      }
    }

    // Check for unmatched braces
    const openBraces = (noComments.match(/\{/g) || []).length
    const closeBraces = (noComments.match(/\}/g) || []).length
    if (openBraces !== closeBraces) {
      errors.push(t('tools.cssValidator.unmatchedBraces'))
    }

    setResult({
      valid: errors.length === 0,
      errors,
      warnings,
      stats: { rules, selectors, properties }
    })
  }, [input, t])

  const format = useCallback(() => {
    try {
      // Remove comments and extra whitespace
      let css = input.replace(/\/\*[\s\S]*?\*\//g, '')

      // Format rules
      const ruleRegex = /([^{}]+)\{([^{}]*)\}/g
      let formatted = ''
      let match

      while ((match = ruleRegex.exec(css)) !== null) {
        const selector = match[1].trim()
        const declarations = match[2]
          .split(';')
          .filter(d => d.trim())
          .map(d => {
            const [prop, ...valueParts] = d.split(':')
            if (!prop.trim() || valueParts.length === 0) return ''
            return `  ${prop.trim()}: ${valueParts.join(':').trim()};`
          })
          .filter(Boolean)
          .join('\n')

        formatted += `${selector} {\n${declarations}\n}\n\n`
      }

      setInput(formatted.trim())
    } catch {
      // Invalid CSS
    }
  }, [input])

  const minify = useCallback(() => {
    try {
      let css = input
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*{\s*/g, '{') // Remove space around {
        .replace(/\s*}\s*/g, '}') // Remove space around }
        .replace(/\s*:\s*/g, ':') // Remove space around :
        .replace(/\s*;\s*/g, ';') // Remove space around ;
        .replace(/;}/g, '}') // Remove last semicolon
        .trim()

      setInput(css)
    } catch {
      // Invalid CSS
    }
  }, [input])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.cssValidator.input')}
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={format}>
              {t('tools.cssValidator.format')}
            </Button>
            <Button variant="secondary" onClick={minify}>
              {t('tools.cssValidator.minify')}
            </Button>
            <Button variant="secondary" onClick={() => setInput('')}>
              {t('common.clear')}
            </Button>
          </div>
        </div>

        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.cssValidator.inputPlaceholder')}
          rows={12}
          className="font-mono text-sm"
        />

        <Button variant="primary" onClick={validate} className="mt-3">
          {t('tools.cssValidator.validate')}
        </Button>
      </div>

      {result && (
        <>
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
                  ? t('tools.cssValidator.valid')
                  : t('tools.cssValidator.invalid')}
              </span>
            </div>

            {result.errors.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-red-700 mb-1">
                  {t('tools.cssValidator.errors')} ({result.errors.length}):
                </p>
                <ul className="space-y-1">
                  {result.errors.map((error, i) => (
                    <li key={i} className="text-sm text-red-600 flex items-start gap-2">
                      <span>•</span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {result.warnings.length > 0 && (
            <div className="card p-4 bg-yellow-50 border border-yellow-200">
              <p className="text-sm font-medium text-yellow-700 mb-2">
                {t('tools.cssValidator.warnings')} ({result.warnings.length}):
              </p>
              <ul className="space-y-1">
                {result.warnings.map((warning, i) => (
                  <li key={i} className="text-sm text-yellow-600 flex items-start gap-2">
                    <span>⚠</span>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card p-4 bg-blue-50 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-700 mb-3">
              {t('tools.cssValidator.statistics')}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-mono text-blue-600">{result.stats.rules}</p>
                <p className="text-xs text-blue-700">{t('tools.cssValidator.rules')}</p>
              </div>
              <div>
                <p className="text-2xl font-mono text-blue-600">{result.stats.selectors}</p>
                <p className="text-xs text-blue-700">{t('tools.cssValidator.selectors')}</p>
              </div>
              <div>
                <p className="text-2xl font-mono text-blue-600">{result.stats.properties}</p>
                <p className="text-xs text-blue-700">{t('tools.cssValidator.properties')}</p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.cssValidator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.cssValidator.tip1')}</li>
          <li>{t('tools.cssValidator.tip2')}</li>
          <li>{t('tools.cssValidator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
