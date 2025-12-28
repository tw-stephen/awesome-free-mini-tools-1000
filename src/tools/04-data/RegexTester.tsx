import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface Match {
  match: string
  index: number
  groups: string[]
}

export default function RegexTester() {
  const { t } = useTranslation()
  const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b')
  const [flags, setFlags] = useState('gi')
  const [testString, setTestString] = useState(
    'Contact us at hello@example.com or support@company.org for assistance.'
  )
  const [error, setError] = useState('')
  const { copy, copied } = useClipboard()

  const results = useMemo(() => {
    if (!pattern) {
      setError('')
      return null
    }

    try {
      const regex = new RegExp(pattern, flags)
      setError('')

      const matches: Match[] = []
      let match: RegExpExecArray | null

      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          })
        }
      } else {
        match = regex.exec(testString)
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          })
        }
      }

      return {
        matches,
        regex,
        isMatch: matches.length > 0,
      }
    } catch (e) {
      setError(t('tools.regexTester.invalidRegex'))
      return null
    }
  }, [pattern, flags, testString, t])

  const highlightedText = useMemo(() => {
    if (!results || results.matches.length === 0) return testString

    let lastIndex = 0
    const parts: { text: string; isMatch: boolean }[] = []

    for (const match of results.matches) {
      if (match.index > lastIndex) {
        parts.push({ text: testString.slice(lastIndex, match.index), isMatch: false })
      }
      parts.push({ text: match.match, isMatch: true })
      lastIndex = match.index + match.match.length
    }

    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), isMatch: false })
    }

    return parts
  }, [testString, results])

  const commonPatterns = [
    { name: t('tools.regexTester.email'), pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b' },
    { name: t('tools.regexTester.url'), pattern: 'https?:\\/\\/[^\\s]+' },
    { name: t('tools.regexTester.phone'), pattern: '\\+?[0-9]{1,4}?[-.\\s]?\\(?[0-9]{1,3}\\)?[-.\\s]?[0-9]{1,4}[-.\\s]?[0-9]{1,9}' },
    { name: t('tools.regexTester.ipv4'), pattern: '\\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b' },
    { name: t('tools.regexTester.date'), pattern: '\\d{4}[-/]\\d{2}[-/]\\d{2}' },
    { name: t('tools.regexTester.hexColor'), pattern: '#[0-9A-Fa-f]{6}\\b' },
  ]

  const flagOptions = [
    { flag: 'g', label: t('tools.regexTester.global') },
    { flag: 'i', label: t('tools.regexTester.ignoreCase') },
    { flag: 'm', label: t('tools.regexTester.multiline') },
    { flag: 's', label: t('tools.regexTester.dotAll') },
  ]

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''))
    } else {
      setFlags(flags + flag)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.regexTester.pattern')}
        </h3>

        <div className="flex gap-2 mb-2">
          <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder={t('tools.regexTester.patternPlaceholder')}
            className="flex-1 px-3 py-1 border border-slate-300 rounded font-mono text-sm"
          />
          <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">/</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-16 px-2 py-1 border border-slate-300 rounded font-mono text-sm text-center"
          />
          <Button variant="secondary" onClick={() => copy(`/${pattern}/${flags}`)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <div className="flex gap-2 flex-wrap">
          {flagOptions.map(({ flag, label }) => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              className={`px-2 py-1 text-xs rounded ${
                flags.includes(flag)
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {flag} - {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.regexTester.testString')}
        </h3>
        <TextArea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder={t('tools.regexTester.testPlaceholder')}
          rows={4}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.regexTester.highlighted')}
        </h3>

        <div className="p-3 bg-slate-50 rounded-lg font-mono text-sm whitespace-pre-wrap">
          {Array.isArray(highlightedText) ? (
            highlightedText.map((part, i) => (
              <span
                key={i}
                className={part.isMatch ? 'bg-yellow-300 text-yellow-900' : ''}
              >
                {part.text}
              </span>
            ))
          ) : (
            highlightedText
          )}
        </div>
      </div>

      {results && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            {t('tools.regexTester.matches')} ({results.matches.length})
          </h3>

          {results.matches.length === 0 ? (
            <p className="text-sm text-slate-500 italic">
              {t('tools.regexTester.noMatches')}
            </p>
          ) : (
            <div className="space-y-2">
              {results.matches.map((match, i) => (
                <div key={i} className="p-2 bg-slate-50 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Match {i + 1} @ index {match.index}
                    </span>
                    <button
                      onClick={() => copy(match.match)}
                      className="text-blue-500 hover:text-blue-700 text-xs"
                    >
                      {t('common.copy')}
                    </button>
                  </div>
                  <p className="font-mono text-sm text-slate-800 mt-1">"{match.match}"</p>
                  {match.groups.length > 0 && (
                    <div className="mt-1 text-xs text-slate-600">
                      Groups: {match.groups.map((g, j) => `$${j + 1}="${g}"`).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.regexTester.commonPatterns')}
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {commonPatterns.map((cp) => (
            <button
              key={cp.name}
              onClick={() => setPattern(cp.pattern)}
              className="p-2 text-left bg-slate-50 rounded hover:bg-slate-100"
            >
              <span className="text-sm text-slate-700">{cp.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.regexTester.cheatsheet')}
        </h3>

        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div><code>.</code> - {t('tools.regexTester.anyChar')}</div>
          <div><code>\d</code> - {t('tools.regexTester.digit')}</div>
          <div><code>\w</code> - {t('tools.regexTester.word')}</div>
          <div><code>\s</code> - {t('tools.regexTester.whitespace')}</div>
          <div><code>^</code> - {t('tools.regexTester.start')}</div>
          <div><code>$</code> - {t('tools.regexTester.end')}</div>
          <div><code>*</code> - 0+ times</div>
          <div><code>+</code> - 1+ times</div>
          <div><code>?</code> - 0-1 times</div>
          <div><code>[abc]</code> - char class</div>
          <div><code>(abc)</code> - group</div>
          <div><code>a|b</code> - or</div>
        </div>
      </div>
    </div>
  )
}
