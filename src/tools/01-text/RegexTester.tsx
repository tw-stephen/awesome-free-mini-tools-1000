import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'

interface Match {
  text: string
  index: number
  groups?: Record<string, string>
}

export default function RegexTester() {
  const { t } = useTranslation()
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('')
  const [error, setError] = useState('')

  const flagOptions = [
    { value: 'g', label: 'global' },
    { value: 'i', label: 'ignoreCase' },
    { value: 'm', label: 'multiline' },
    { value: 's', label: 'dotAll' },
    { value: 'u', label: 'unicode' },
  ]

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''))
    } else {
      setFlags(flags + flag)
    }
  }

  const { matches, highlightedText } = useMemo(() => {
    if (!pattern || !testString) {
      return { matches: [], highlightedText: testString }
    }

    try {
      const regex = new RegExp(pattern, flags)
      setError('')

      const matches: Match[] = []
      let match: RegExpExecArray | null

      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.groups,
          })
          // Prevent infinite loop on zero-length matches
          if (match[0].length === 0) {
            regex.lastIndex++
          }
        }
      } else {
        match = regex.exec(testString)
        if (match) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.groups,
          })
        }
      }

      // Create highlighted text
      let result = ''
      let lastIndex = 0
      for (const m of matches) {
        result += escapeHtml(testString.slice(lastIndex, m.index))
        result += `<mark class="bg-yellow-200 px-0.5 rounded">${escapeHtml(m.text)}</mark>`
        lastIndex = m.index + m.text.length
      }
      result += escapeHtml(testString.slice(lastIndex))

      return { matches, highlightedText: result }
    } catch (e) {
      setError((e as Error).message)
      return { matches: [], highlightedText: testString }
    }
  }, [pattern, flags, testString])

  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, '<br>')
  }

  const commonPatterns = [
    { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { label: 'URL', pattern: 'https?://[^\\s]+' },
    { label: 'Phone', pattern: '\\+?[0-9][0-9\\-\\s]{7,}[0-9]' },
    { label: 'Date', pattern: '\\d{4}-\\d{2}-\\d{2}' },
    { label: 'IP', pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' },
    { label: 'Hex Color', pattern: '#[0-9A-Fa-f]{6}' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-lg font-mono text-slate-400">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder={t('tools.regexTester.patternPlaceholder')}
            className="flex-1 min-w-[200px] px-3 py-2 font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-lg font-mono text-slate-400">/</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-16 px-3 py-2 font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {flagOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleFlag(opt.value)}
              className={`px-2 py-1 text-xs rounded ${
                flags.includes(opt.value)
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.value} ({t(`tools.regexTester.flags.${opt.label}`)})
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-slate-500">{t('tools.regexTester.common')}:</span>
          {commonPatterns.map((p) => (
            <button
              key={p.label}
              onClick={() => setPattern(p.pattern)}
              className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
            >
              {p.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-3 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('tools.regexTester.testString')}
          </label>
          <TextArea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder={t('tools.regexTester.testStringPlaceholder')}
            rows={10}
            className="font-mono"
          />
        </div>

        <div className="card p-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('tools.regexTester.result')}
          </label>
          <div
            className="min-h-[250px] p-3 font-mono text-sm bg-slate-50 border border-slate-200 rounded-lg overflow-auto whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: highlightedText || `<span class="text-slate-400">${t('tools.regexTester.noMatches')}</span>` }}
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.regexTester.matches')} ({matches.length})
        </h3>
        {matches.length === 0 ? (
          <div className="text-sm text-slate-500">{t('tools.regexTester.noMatches')}</div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-auto">
            {matches.map((match, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="text-slate-400">#{i + 1}</span>
                <code className="px-2 py-1 bg-yellow-100 rounded">{match.text}</code>
                <span className="text-slate-500">
                  @ {t('tools.regexTester.index')} {match.index}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
