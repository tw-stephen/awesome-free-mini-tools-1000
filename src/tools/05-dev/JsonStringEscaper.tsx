import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function JsonStringEscaper() {
  const { t } = useTranslation()
  const [input, setInput] = useState(`Hello "World"!
This is a multi-line string.
It has	tabs and special characters: \\ / `)
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape')
  const { copy, copied } = useClipboard()

  const output = useMemo(() => {
    if (mode === 'escape') {
      try {
        // Escape special characters for JSON string
        return JSON.stringify(input)
      } catch {
        return t('tools.jsonStringEscaper.error')
      }
    } else {
      try {
        // Try to parse as JSON string
        if (input.startsWith('"') && input.endsWith('"')) {
          return JSON.parse(input)
        }
        // Try to unescape common escape sequences
        return input
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\')
          .replace(/\\b/g, '\b')
          .replace(/\\f/g, '\f')
      } catch {
        return t('tools.jsonStringEscaper.invalidEscaped')
      }
    }
  }, [input, mode, t])

  const escapeSequences = [
    { escaped: '\\n', char: 'Newline', example: 'Line1\\nLine2' },
    { escaped: '\\t', char: 'Tab', example: 'Col1\\tCol2' },
    { escaped: '\\r', char: 'Carriage Return', example: 'Line1\\rLine2' },
    { escaped: '\\"', char: 'Double Quote', example: '\\"Hello\\"' },
    { escaped: '\\\\', char: 'Backslash', example: 'C:\\\\Users' },
    { escaped: '\\/', char: 'Forward Slash', example: 'http:\\/\\/' },
    { escaped: '\\b', char: 'Backspace', example: '(rarely used)' },
    { escaped: '\\f', char: 'Form Feed', example: '(rarely used)' },
    { escaped: '\\uXXXX', char: 'Unicode', example: '\\u0041 = A' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.jsonStringEscaper.mode')}
          </h3>
          <div className="flex gap-2">
            {(['escape', 'unescape'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 text-sm rounded border ${
                  mode === m
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-slate-50 border-slate-300 text-slate-600'
                }`}
              >
                {t(`tools.jsonStringEscaper.${m}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {mode === 'escape'
              ? t('tools.jsonStringEscaper.rawString')
              : t('tools.jsonStringEscaper.escapedString')}
          </h3>
          <Button variant="secondary" onClick={() => setInput('')}>
            {t('common.clear')}
          </Button>
        </div>

        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'escape'
            ? t('tools.jsonStringEscaper.rawPlaceholder')
            : t('tools.jsonStringEscaper.escapedPlaceholder')}
          rows={6}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4 bg-green-50 border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-green-700">
            {mode === 'escape'
              ? t('tools.jsonStringEscaper.escapedString')
              : t('tools.jsonStringEscaper.rawString')}
          </h3>
          <Button variant="secondary" onClick={() => copy(output)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        <pre className="p-3 bg-white rounded overflow-x-auto">
          <code className="font-mono text-sm text-green-800 whitespace-pre-wrap break-all">{output}</code>
        </pre>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.jsonStringEscaper.escapeSequences')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-2 font-medium text-slate-600">
                  {t('tools.jsonStringEscaper.sequence')}
                </th>
                <th className="text-left p-2 font-medium text-slate-600">
                  {t('tools.jsonStringEscaper.character')}
                </th>
                <th className="text-left p-2 font-medium text-slate-600">
                  {t('tools.jsonStringEscaper.example')}
                </th>
              </tr>
            </thead>
            <tbody>
              {escapeSequences.map(({ escaped, char, example }) => (
                <tr key={escaped} className="border-t border-slate-100">
                  <td className="p-2 font-mono text-blue-600">{escaped}</td>
                  <td className="p-2 text-slate-700">{char}</td>
                  <td className="p-2 font-mono text-slate-500 text-xs">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.jsonStringEscaper.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.jsonStringEscaper.tip1')}</li>
          <li>{t('tools.jsonStringEscaper.tip2')}</li>
          <li>{t('tools.jsonStringEscaper.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
