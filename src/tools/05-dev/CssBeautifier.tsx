import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function CssBeautifier() {
  const { t } = useTranslation()
  const [input, setInput] = useState(`.container{display:flex;flex-direction:column;padding:20px;}.header{font-size:24px;color:#333;}.button{padding:10px 20px;border-radius:4px;}`)
  const [output, setOutput] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const { copy, copied } = useClipboard()

  const beautify = useCallback(() => {
    try {
      let css = input.trim()
      if (!css) {
        setOutput('')
        return
      }

      const indent = ' '.repeat(indentSize)

      // Remove comments
      css = css.replace(/\/\*[\s\S]*?\*\//g, '')

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
            return `${indent}${prop.trim()}: ${valueParts.join(':').trim()};`
          })
          .filter(Boolean)
          .join('\n')

        if (formatted) formatted += '\n\n'
        formatted += `${selector} {\n${declarations}\n}`
      }

      setOutput(formatted || css)
    } catch {
      setOutput(t('tools.cssBeautifier.error'))
    }
  }, [input, indentSize, t])

  const minify = useCallback(() => {
    try {
      let css = input.trim()
      if (!css) {
        setOutput('')
        return
      }

      css = css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*;\s*/g, ';')
        .replace(/;}/g, '}')
        .trim()

      setOutput(css)
    } catch {
      setOutput(t('tools.cssBeautifier.error'))
    }
  }, [input, t])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.cssBeautifier.input')}
          </h3>
          <Button variant="secondary" onClick={() => setInput('')}>
            {t('common.clear')}
          </Button>
        </div>

        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.cssBeautifier.inputPlaceholder')}
          rows={8}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.cssBeautifier.options')}
        </h3>

        <div>
          <label className="block text-sm text-slate-600 mb-1">
            {t('tools.cssBeautifier.indentSize')}
          </label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(parseInt(e.target.value))}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            <option value="2">2 {t('tools.cssBeautifier.spaces')}</option>
            <option value="4">4 {t('tools.cssBeautifier.spaces')}</option>
          </select>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="primary" onClick={beautify}>
            {t('tools.cssBeautifier.beautify')}
          </Button>
          <Button variant="secondary" onClick={minify}>
            {t('tools.cssBeautifier.minify')}
          </Button>
        </div>
      </div>

      {output && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.cssBeautifier.output')}
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
          {t('tools.cssBeautifier.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.cssBeautifier.tip1')}</li>
          <li>{t('tools.cssBeautifier.tip2')}</li>
        </ul>
      </div>
    </div>
  )
}
