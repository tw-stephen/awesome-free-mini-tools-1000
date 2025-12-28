import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function CsvToJson() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [delimiter, setDelimiter] = useState(',')
  const [hasHeader, setHasHeader] = useState(true)
  const [indent, setIndent] = useState(2)
  const { copy, copied } = useClipboard()

  const parseCsvLine = useCallback((line: string, delim: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === delim && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }

    result.push(current.trim())
    return result
  }, [])

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      return
    }

    try {
      const lines = input.split('\n').filter((line) => line.trim())

      if (lines.length === 0) {
        setOutput('[]')
        return
      }

      const delim = delimiter === '\\t' ? '\t' : delimiter

      if (hasHeader) {
        const headers = parseCsvLine(lines[0], delim)
        const data = lines.slice(1).map((line) => {
          const values = parseCsvLine(line, delim)
          const obj: Record<string, string | number | null> = {}

          headers.forEach((header, index) => {
            const value = values[index] || ''
            // Try to parse as number
            if (/^-?\d+$/.test(value)) {
              obj[header] = parseInt(value, 10)
            } else if (/^-?\d*\.\d+$/.test(value)) {
              obj[header] = parseFloat(value)
            } else if (value === '') {
              obj[header] = null
            } else {
              obj[header] = value
            }
          })

          return obj
        })

        setOutput(JSON.stringify(data, null, indent))
      } else {
        const data = lines.map((line) => parseCsvLine(line, delim))
        setOutput(JSON.stringify(data, null, indent))
      }

      setError('')
    } catch (e) {
      setError(t('tools.csvToJson.parseError'))
      setOutput('')
    }
  }, [input, delimiter, hasHeader, indent, parseCsvLine, t])

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

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.csvToJson.input')}
          </h3>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".csv,.tsv,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-file-input"
            />
            <label
              htmlFor="csv-file-input"
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
            >
              {t('tools.csvToJson.uploadFile')}
            </label>
            <Button variant="secondary" onClick={() => setInput('')}>
              {t('common.clear')}
            </Button>
          </div>
        </div>
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.csvToJson.inputPlaceholder')}
          rows={10}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.csvToJson.options')}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.csvToJson.delimiter')}
            </label>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value=",">{t('tools.csvToJson.comma')} (,)</option>
              <option value=";">{t('tools.csvToJson.semicolon')} (;)</option>
              <option value="\t">{t('tools.csvToJson.tab')}</option>
              <option value="|">{t('tools.csvToJson.pipe')} (|)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.csvToJson.indent')}
            </label>
            <select
              value={indent}
              onChange={(e) => setIndent(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={hasHeader}
            onChange={(e) => setHasHeader(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-slate-600">
            {t('tools.csvToJson.firstRowHeader')}
          </span>
        </label>

        <Button variant="primary" onClick={convert}>
          {t('tools.csvToJson.convert')}
        </Button>
      </div>

      {error && (
        <div className="card p-4 bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {output && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.csvToJson.output')}
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
