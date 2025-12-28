import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function SqlFormatter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState(2)
  const [uppercase, setUppercase] = useState(true)
  const { copy, copied } = useClipboard()

  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
    'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS', 'ON',
    'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL',
    'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
    'ALTER', 'DROP', 'INDEX', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES',
    'NULL', 'NOT NULL', 'DEFAULT', 'UNIQUE', 'CHECK', 'CONSTRAINT',
    'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'CASE', 'WHEN',
    'THEN', 'ELSE', 'END', 'EXISTS', 'ANY', 'IS', 'ASC', 'DESC', 'NULLS',
    'FIRST', 'LAST', 'WITH', 'RECURSIVE', 'OVER', 'PARTITION BY', 'ROWS',
    'RANGE', 'UNBOUNDED', 'PRECEDING', 'FOLLOWING', 'CURRENT ROW'
  ]

  const newLineKeywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN',
    'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'GROUP BY',
    'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'INSERT', 'INTO',
    'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'ALTER', 'DROP'
  ]

  const format = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    let sql = input.trim()
    const indentStr = ' '.repeat(indent)

    // Normalize whitespace
    sql = sql.replace(/\s+/g, ' ')

    // Handle keywords case
    if (uppercase) {
      keywords.forEach((kw) => {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi')
        sql = sql.replace(regex, kw.toUpperCase())
      })
    } else {
      keywords.forEach((kw) => {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi')
        sql = sql.replace(regex, kw.toLowerCase())
      })
    }

    // Add newlines before major keywords
    newLineKeywords.forEach((kw) => {
      const kwCase = uppercase ? kw.toUpperCase() : kw.toLowerCase()
      const regex = new RegExp(`\\s+${kwCase}\\b`, 'gi')
      sql = sql.replace(regex, `\n${kwCase}`)
    })

    // Format SELECT columns
    sql = sql.replace(/,\s*/g, ',\n' + indentStr)

    // Clean up multiple newlines
    sql = sql.replace(/\n\s*\n/g, '\n')

    // Indent lines after SELECT, FROM, WHERE, etc.
    const lines = sql.split('\n')
    const formattedLines: string[] = []
    let currentIndent = 0

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim()

      // Check if line starts with a major keyword
      const startsWithMajorKeyword = newLineKeywords.some((kw) => {
        return line.toUpperCase().startsWith(kw.toUpperCase())
      })

      if (startsWithMajorKeyword) {
        currentIndent = 0
        formattedLines.push(line)
        currentIndent = 1
      } else if (line.startsWith(')')) {
        currentIndent = Math.max(0, currentIndent - 1)
        formattedLines.push(indentStr.repeat(currentIndent) + line)
      } else if (line.includes('(')) {
        formattedLines.push(indentStr.repeat(currentIndent) + line)
        currentIndent++
      } else {
        formattedLines.push(indentStr.repeat(currentIndent) + line)
      }
    }

    setOutput(formattedLines.join('\n'))
  }, [input, indent, uppercase])

  const minify = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    let sql = input.trim()
    sql = sql.replace(/\s+/g, ' ')
    sql = sql.replace(/\s*,\s*/g, ',')
    sql = sql.replace(/\s*\(\s*/g, '(')
    sql = sql.replace(/\s*\)\s*/g, ')')
    sql = sql.replace(/\s*=\s*/g, '=')

    setOutput(sql)
  }, [input])

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
            {t('tools.sqlFormatter.input')}
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
          placeholder={t('tools.sqlFormatter.inputPlaceholder')}
          rows={10}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.sqlFormatter.options')}
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm text-slate-600">
            {t('tools.sqlFormatter.indent')}:
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
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-slate-600">
            {t('tools.sqlFormatter.uppercaseKeywords')}
          </span>
        </label>

        <div className="flex gap-2">
          <Button variant="primary" onClick={format}>
            {t('tools.sqlFormatter.format')}
          </Button>
          <Button variant="secondary" onClick={minify}>
            {t('tools.sqlFormatter.minify')}
          </Button>
        </div>
      </div>

      {output && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.sqlFormatter.output')}
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
