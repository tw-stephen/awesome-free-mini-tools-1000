import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function JsMinifier() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [stats, setStats] = useState<{ original: number; minified: number } | null>(null)
  const [removeComments, setRemoveComments] = useState(true)
  const { copy, copied } = useClipboard()

  const minify = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setStats(null)
      return
    }

    let js = input

    // Preserve strings and regex patterns
    const strings: string[] = []
    const stringPlaceholder = '___STRING_PLACEHOLDER___'

    // Replace strings with placeholders
    js = js.replace(/(["'`])(?:(?!\1|\\).|\\.)*\1/g, (match) => {
      strings.push(match)
      return `${stringPlaceholder}${strings.length - 1}${stringPlaceholder}`
    })

    if (removeComments) {
      // Remove single-line comments
      js = js.replace(/\/\/[^\n]*/g, '')

      // Remove multi-line comments
      js = js.replace(/\/\*[\s\S]*?\*\//g, '')
    }

    // Remove newlines and multiple spaces
    js = js.replace(/\s+/g, ' ')

    // Remove spaces around operators
    js = js.replace(/\s*([{}\[\]();,:<>+\-*/%&|^!~?=])\s*/g, '$1')

    // Add space after keywords that need it
    const keywords = ['return', 'throw', 'new', 'delete', 'typeof', 'void', 'in', 'instanceof', 'case']
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}([^\\s])`, 'g')
      js = js.replace(regex, `${kw} $1`)
    })

    // Fix edge cases
    js = js.replace(/\}\s*else/g, '}else')
    js = js.replace(/else\s*\{/g, 'else{')
    js = js.replace(/\}\s*catch/g, '}catch')
    js = js.replace(/\}\s*finally/g, '}finally')
    js = js.replace(/\)\s*\{/g, '){')
    js = js.replace(/\}\s*\(/g, '}(')

    // Restore strings
    js = js.replace(
      new RegExp(`${stringPlaceholder}(\\d+)${stringPlaceholder}`, 'g'),
      (_, index) => strings[parseInt(index)]
    )

    // Trim
    js = js.trim()

    setOutput(js)
    setStats({
      original: input.length,
      minified: js.length,
    })
  }, [input, removeComments])

  const beautify = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setStats(null)
      return
    }

    let js = input.trim()
    let result = ''
    let indent = 0
    let inString = false
    let stringChar = ''
    let newLine = true
    const indentStr = '  '

    for (let i = 0; i < js.length; i++) {
      const char = js[i]
      const prev = js[i - 1] || ''
      const next = js[i + 1] || ''

      // Track string state
      if ((char === '"' || char === "'" || char === '`') && prev !== '\\') {
        if (!inString) {
          inString = true
          stringChar = char
        } else if (char === stringChar) {
          inString = false
        }
      }

      if (inString) {
        result += char
        continue
      }

      if (char === '{') {
        result += ' {\n'
        indent++
        result += indentStr.repeat(indent)
        newLine = true
      } else if (char === '}') {
        indent = Math.max(0, indent - 1)
        result += '\n' + indentStr.repeat(indent) + '}'
        if (next !== ',' && next !== ';' && next !== ')' && next !== 'e') {
          result += '\n' + indentStr.repeat(indent)
          newLine = true
        }
      } else if (char === ';') {
        result += ';\n' + indentStr.repeat(indent)
        newLine = true
      } else if (char === ',') {
        result += ', '
      } else if (char === ':' && next !== ':' && prev !== ':') {
        result += ': '
      } else if (char === ' ' || char === '\n' || char === '\t') {
        if (!newLine && result[result.length - 1] !== ' ') {
          result += ' '
        }
      } else {
        result += char
        newLine = false
      }
    }

    // Clean up
    result = result.replace(/\n\s*\n/g, '\n')
    result = result.replace(/\s+$/gm, '')

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
    const blob = new Blob([output], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'script.min.js'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.jsMinifier.input')}
          </h3>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".js,.mjs,.cjs"
              onChange={handleFileUpload}
              className="hidden"
              id="js-file-input"
            />
            <label
              htmlFor="js-file-input"
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
            >
              {t('tools.jsMinifier.uploadFile')}
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
          placeholder={t('tools.jsMinifier.inputPlaceholder')}
          rows={10}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={removeComments}
            onChange={(e) => setRemoveComments(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-slate-600">
            {t('tools.jsMinifier.removeComments')}
          </span>
        </label>

        <div className="flex gap-2">
          <Button variant="primary" onClick={minify}>
            {t('tools.jsMinifier.minify')}
          </Button>
          <Button variant="secondary" onClick={beautify}>
            {t('tools.jsMinifier.beautify')}
          </Button>
        </div>
      </div>

      {stats && (
        <div className="card p-4 bg-green-50 border border-green-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-slate-600">{t('tools.jsMinifier.original')}</p>
              <p className="text-lg font-semibold text-slate-800">
                {stats.original.toLocaleString()} bytes
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">{t('tools.jsMinifier.minified')}</p>
              <p className="text-lg font-semibold text-slate-800">
                {stats.minified.toLocaleString()} bytes
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">{t('tools.jsMinifier.savings')}</p>
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
              {t('tools.jsMinifier.output')}
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
