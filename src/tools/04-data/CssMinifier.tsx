import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function CssMinifier() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [stats, setStats] = useState<{ original: number; minified: number } | null>(null)
  const { copy, copied } = useClipboard()

  const minify = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setStats(null)
      return
    }

    let css = input

    // Remove comments
    css = css.replace(/\/\*[\s\S]*?\*\//g, '')

    // Remove newlines and multiple spaces
    css = css.replace(/\s+/g, ' ')

    // Remove spaces around selectors and properties
    css = css.replace(/\s*{\s*/g, '{')
    css = css.replace(/\s*}\s*/g, '}')
    css = css.replace(/\s*;\s*/g, ';')
    css = css.replace(/\s*:\s*/g, ':')
    css = css.replace(/\s*,\s*/g, ',')

    // Remove last semicolon before closing brace
    css = css.replace(/;}/g, '}')

    // Remove spaces around operators in calc()
    css = css.replace(/calc\(\s*/g, 'calc(')
    css = css.replace(/\s*\)/g, ')')

    // Trim leading/trailing whitespace
    css = css.trim()

    setOutput(css)
    setStats({
      original: input.length,
      minified: css.length,
    })
  }, [input])

  const beautify = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setStats(null)
      return
    }

    let css = input.trim()

    // Normalize whitespace
    css = css.replace(/\s+/g, ' ')

    // Add newlines after closing braces
    css = css.replace(/}\s*/g, '}\n\n')

    // Add newlines after opening braces
    css = css.replace(/{\s*/g, ' {\n  ')

    // Add newlines after semicolons (properties)
    css = css.replace(/;\s*/g, ';\n  ')

    // Clean up extra whitespace before closing braces
    css = css.replace(/;\n  }/g, ';\n}')
    css = css.replace(/{\n  }/g, '{ }')

    // Remove trailing whitespace
    css = css.replace(/\s+$/gm, '')

    // Remove extra blank lines
    css = css.replace(/\n\n\n+/g, '\n\n')

    setOutput(css.trim())
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
    const blob = new Blob([output], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'styles.min.css'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.cssMinifier.input')}
          </h3>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".css"
              onChange={handleFileUpload}
              className="hidden"
              id="css-file-input"
            />
            <label
              htmlFor="css-file-input"
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
            >
              {t('tools.cssMinifier.uploadFile')}
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
          placeholder={t('tools.cssMinifier.inputPlaceholder')}
          rows={10}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <div className="flex gap-2">
          <Button variant="primary" onClick={minify}>
            {t('tools.cssMinifier.minify')}
          </Button>
          <Button variant="secondary" onClick={beautify}>
            {t('tools.cssMinifier.beautify')}
          </Button>
        </div>
      </div>

      {stats && (
        <div className="card p-4 bg-green-50 border border-green-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-slate-600">{t('tools.cssMinifier.original')}</p>
              <p className="text-lg font-semibold text-slate-800">
                {stats.original.toLocaleString()} bytes
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">{t('tools.cssMinifier.minified')}</p>
              <p className="text-lg font-semibold text-slate-800">
                {stats.minified.toLocaleString()} bytes
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">{t('tools.cssMinifier.savings')}</p>
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
              {t('tools.cssMinifier.output')}
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
