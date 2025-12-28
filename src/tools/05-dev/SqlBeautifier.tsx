import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function SqlBeautifier() {
  const { t } = useTranslation()
  const [input, setInput] = useState(`SELECT u.id, u.name, u.email, o.order_id, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND o.created_at > '2024-01-01' ORDER BY o.total DESC LIMIT 10;`)
  const [output, setOutput] = useState('')
  const [keywordCase, setKeywordCase] = useState<'upper' | 'lower'>('upper')
  const { copy, copied } = useClipboard()

  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL',
    'LIKE', 'BETWEEN', 'EXISTS', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER',
    'FULL', 'CROSS', 'ON', 'AS', 'ORDER', 'BY', 'GROUP', 'HAVING',
    'LIMIT', 'OFFSET', 'UNION', 'ALL', 'DISTINCT', 'INSERT', 'INTO',
    'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER',
    'DROP', 'INDEX', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'ASC', 'DESC',
    'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX'
  ]

  const newLineKeywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING',
    'LIMIT', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN',
    'ON', 'UNION', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE'
  ]

  const beautify = useCallback(() => {
    try {
      let sql = input.trim()
      if (!sql) {
        setOutput('')
        return
      }

      // Normalize whitespace
      sql = sql.replace(/\s+/g, ' ')

      // Apply keyword case
      const caseFunc = keywordCase === 'upper' ? (s: string) => s.toUpperCase() : (s: string) => s.toLowerCase()

      // Replace keywords with proper case
      for (const kw of keywords) {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi')
        sql = sql.replace(regex, caseFunc(kw))
      }

      // Add newlines before certain keywords
      for (const kw of newLineKeywords) {
        const kwProcessed = caseFunc(kw)
        const regex = new RegExp(`\\s*\\b${kw.replace(' ', '\\s+')}\\b`, 'gi')
        sql = sql.replace(regex, '\n' + kwProcessed)
      }

      // Indent after SELECT, FROM, etc.
      const lines = sql.split('\n')
      let formatted = ''
      let indent = 0

      for (let line of lines) {
        line = line.trim()
        if (!line) continue

        const upperLine = line.toUpperCase()

        // Check for closing keywords
        if (upperLine.startsWith('FROM') || upperLine.startsWith('WHERE') ||
            upperLine.startsWith('ORDER') || upperLine.startsWith('GROUP') ||
            upperLine.startsWith('HAVING') || upperLine.startsWith('LIMIT')) {
          indent = 0
        }

        formatted += '  '.repeat(indent) + line + '\n'

        // Check for opening keywords
        if (upperLine.startsWith('SELECT') || upperLine.startsWith('FROM') ||
            upperLine.startsWith('WHERE') || upperLine.startsWith('SET')) {
          indent = 1
        }
      }

      setOutput(formatted.trim())
    } catch {
      setOutput(t('tools.sqlBeautifier.error'))
    }
  }, [input, keywordCase, t, keywords, newLineKeywords])

  const minify = useCallback(() => {
    try {
      let sql = input.trim()
      if (!sql) {
        setOutput('')
        return
      }

      sql = sql.replace(/\s+/g, ' ').trim()
      setOutput(sql)
    } catch {
      setOutput(t('tools.sqlBeautifier.error'))
    }
  }, [input, t])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.sqlBeautifier.input')}
          </h3>
          <Button variant="secondary" onClick={() => setInput('')}>
            {t('common.clear')}
          </Button>
        </div>

        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.sqlBeautifier.inputPlaceholder')}
          rows={8}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.sqlBeautifier.options')}
        </h3>

        <div>
          <label className="block text-sm text-slate-600 mb-1">
            {t('tools.sqlBeautifier.keywordCase')}
          </label>
          <select
            value={keywordCase}
            onChange={(e) => setKeywordCase(e.target.value as 'upper' | 'lower')}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            <option value="upper">{t('tools.sqlBeautifier.uppercase')}</option>
            <option value="lower">{t('tools.sqlBeautifier.lowercase')}</option>
          </select>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="primary" onClick={beautify}>
            {t('tools.sqlBeautifier.beautify')}
          </Button>
          <Button variant="secondary" onClick={minify}>
            {t('tools.sqlBeautifier.minify')}
          </Button>
        </div>
      </div>

      {output && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.sqlBeautifier.output')}
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
          {t('tools.sqlBeautifier.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.sqlBeautifier.tip1')}</li>
          <li>{t('tools.sqlBeautifier.tip2')}</li>
          <li>{t('tools.sqlBeautifier.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
