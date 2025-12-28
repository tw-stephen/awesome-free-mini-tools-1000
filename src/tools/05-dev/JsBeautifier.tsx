import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function JsBeautifier() {
  const { t } = useTranslation()
  const [input, setInput] = useState(`function hello(name){const greeting="Hello, "+name+"!";console.log(greeting);return greeting;}const result=hello("World");`)
  const [output, setOutput] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [useTabs, setUseTabs] = useState(false)
  const { copy, copied } = useClipboard()

  const beautify = useCallback(() => {
    try {
      let code = input.trim()
      if (!code) {
        setOutput('')
        return
      }

      // Simple JavaScript beautifier
      const indent = useTabs ? '\t' : ' '.repeat(indentSize)
      let level = 0
      let result = ''
      let inString = false
      let stringChar = ''
      let inComment = false
      let inLineComment = false

      for (let i = 0; i < code.length; i++) {
        const char = code[i]
        const nextChar = code[i + 1]
        const prevChar = code[i - 1]

        // Handle strings
        if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
          if (!inString) {
            inString = true
            stringChar = char
          } else if (char === stringChar) {
            inString = false
          }
        }

        // Handle comments
        if (!inString) {
          if (char === '/' && nextChar === '*' && !inComment && !inLineComment) {
            inComment = true
          } else if (char === '*' && nextChar === '/' && inComment) {
            result += '*/'
            i++
            inComment = false
            continue
          } else if (char === '/' && nextChar === '/' && !inComment && !inLineComment) {
            inLineComment = true
          } else if (char === '\n' && inLineComment) {
            inLineComment = false
          }
        }

        if (inString || inComment || inLineComment) {
          result += char
          continue
        }

        // Handle braces
        if (char === '{') {
          result = result.trimEnd() + ' {\n' + indent.repeat(++level)
        } else if (char === '}') {
          level = Math.max(0, level - 1)
          result = result.trimEnd() + '\n' + indent.repeat(level) + '}'
          if (nextChar && nextChar !== ';' && nextChar !== ',' && nextChar !== ')' && nextChar !== '\n') {
            result += '\n' + indent.repeat(level)
          }
        } else if (char === ';') {
          result = result.trimEnd() + ';\n' + indent.repeat(level)
        } else if (char === ',') {
          result = result.trimEnd() + ', '
        } else if (char === ':' && nextChar !== ':') {
          result = result.trimEnd() + ': '
        } else if (char === '=' && nextChar !== '=' && prevChar !== '=' && prevChar !== '!' && prevChar !== '<' && prevChar !== '>') {
          result = result.trimEnd() + ' = '
        } else if ((char === '(' || char === '[') && result.endsWith(')')) {
          result += char
        } else {
          result += char
        }
      }

      // Clean up extra whitespace
      result = result
        .split('\n')
        .map(line => line.trimEnd())
        .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
        .join('\n')
        .trim()

      setOutput(result)
    } catch {
      setOutput(t('tools.jsBeautifier.error'))
    }
  }, [input, indentSize, useTabs, t])

  const minify = useCallback(() => {
    try {
      let code = input.trim()
      if (!code) {
        setOutput('')
        return
      }

      // Remove comments
      code = code.replace(/\/\*[\s\S]*?\*\//g, '')
      code = code.replace(/\/\/.*$/gm, '')

      // Minify
      code = code
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}()[\];,:])\s*/g, '$1')
        .replace(/\s*=\s*/g, '=')
        .replace(/;\}/g, '}')
        .trim()

      setOutput(code)
    } catch {
      setOutput(t('tools.jsBeautifier.error'))
    }
  }, [input, t])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.jsBeautifier.input')}
          </h3>
          <Button variant="secondary" onClick={() => setInput('')}>
            {t('common.clear')}
          </Button>
        </div>

        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.jsBeautifier.inputPlaceholder')}
          rows={8}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.jsBeautifier.options')}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.jsBeautifier.indentSize')}
            </label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              disabled={useTabs}
            >
              <option value="2">2 {t('tools.jsBeautifier.spaces')}</option>
              <option value="4">4 {t('tools.jsBeautifier.spaces')}</option>
              <option value="8">8 {t('tools.jsBeautifier.spaces')}</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useTabs}
                onChange={(e) => setUseTabs(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-600">
                {t('tools.jsBeautifier.useTabs')}
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="primary" onClick={beautify}>
            {t('tools.jsBeautifier.beautify')}
          </Button>
          <Button variant="secondary" onClick={minify}>
            {t('tools.jsBeautifier.minify')}
          </Button>
        </div>
      </div>

      {output && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.jsBeautifier.output')}
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
          {t('tools.jsBeautifier.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.jsBeautifier.tip1')}</li>
          <li>{t('tools.jsBeautifier.tip2')}</li>
          <li>{t('tools.jsBeautifier.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
