import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface Match {
  match: string
  index: number
  groups: string[]
}

export default function RegexBuilder() {
  const { t } = useTranslation()
  const [pattern, setPattern] = useState('(\\w+)@(\\w+\\.\\w+)')
  const [flags, setFlags] = useState('gi')
  const [testText, setTestText] = useState('Contact us at support@example.com or sales@company.org for more information.')
  const [error, setError] = useState('')
  const { copy, copied } = useClipboard()

  const flagOptions = [
    { flag: 'g', name: 'global', desc: t('tools.regexBuilder.flagGlobal') },
    { flag: 'i', name: 'ignoreCase', desc: t('tools.regexBuilder.flagIgnoreCase') },
    { flag: 'm', name: 'multiline', desc: t('tools.regexBuilder.flagMultiline') },
    { flag: 's', name: 'dotAll', desc: t('tools.regexBuilder.flagDotAll') },
    { flag: 'u', name: 'unicode', desc: t('tools.regexBuilder.flagUnicode') },
  ]

  const commonPatterns = [
    { name: t('tools.regexBuilder.patternEmail'), pattern: '[\\w.-]+@[\\w.-]+\\.\\w+' },
    { name: t('tools.regexBuilder.patternUrl'), pattern: 'https?://[\\w.-]+(?:/[\\w.-]*)*' },
    { name: t('tools.regexBuilder.patternPhone'), pattern: '\\+?\\d{1,3}[-.\\s]?\\d{3,4}[-.\\s]?\\d{3,4}' },
    { name: t('tools.regexBuilder.patternIp'), pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' },
    { name: t('tools.regexBuilder.patternDate'), pattern: '\\d{4}[-/]\\d{2}[-/]\\d{2}' },
    { name: t('tools.regexBuilder.patternHex'), pattern: '#[0-9a-fA-F]{3,6}' },
  ]

  const matches = useMemo((): Match[] => {
    if (!pattern || !testText) return []

    try {
      setError('')
      const regex = new RegExp(pattern, flags)
      const results: Match[] = []

      if (flags.includes('g')) {
        let match
        while ((match = regex.exec(testText)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          })
          if (!match[0]) break // Prevent infinite loop on zero-length matches
        }
      } else {
        const match = testText.match(regex)
        if (match) {
          results.push({
            match: match[0],
            index: testText.indexOf(match[0]),
            groups: match.slice(1)
          })
        }
      }

      return results
    } catch (e) {
      setError((e as Error).message)
      return []
    }
  }, [pattern, flags, testText])

  const toggleFlag = useCallback((flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''))
    } else {
      setFlags(flags + flag)
    }
  }, [flags])

  const highlightedText = useMemo(() => {
    if (!pattern || !testText || error || matches.length === 0) return testText

    try {
      const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
      return testText.replace(regex, '<mark class="bg-yellow-300 px-0.5 rounded">$&</mark>')
    } catch {
      return testText
    }
  }, [pattern, testText, flags, error, matches])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.regexBuilder.pattern')}
        </h3>

        <div className="flex gap-2 items-center">
          <span className="text-slate-400 font-mono">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder={t('tools.regexBuilder.patternPlaceholder')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-sm"
          />
          <span className="text-slate-400 font-mono">/</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-16 px-2 py-2 border border-slate-300 rounded font-mono text-sm text-center"
          />
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {flagOptions.map(({ flag, desc }) => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              className={`px-3 py-1 text-sm rounded border ${
                flags.includes(flag)
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-slate-50 border-slate-300 text-slate-600'
              }`}
              title={desc}
            >
              {flag} - {desc}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.regexBuilder.commonPatterns')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {commonPatterns.map(({ name, pattern: p }) => (
            <Button
              key={name}
              variant="secondary"
              onClick={() => setPattern(p)}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.regexBuilder.testText')}
          </h3>
          <Button variant="secondary" onClick={() => setTestText('')}>
            {t('common.clear')}
          </Button>
        </div>

        <TextArea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder={t('tools.regexBuilder.testTextPlaceholder')}
          rows={4}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.regexBuilder.highlighted')}
        </h3>
        <div
          className="p-3 bg-slate-50 rounded font-mono text-sm whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.regexBuilder.matches')} ({matches.length})
          </h3>
          <Button
            variant="secondary"
            onClick={() => copy(`/${pattern}/${flags}`)}
          >
            {copied ? t('common.copied') : t('tools.regexBuilder.copyRegex')}
          </Button>
        </div>

        {matches.length > 0 ? (
          <div className="space-y-2">
            {matches.map((match, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-slate-800">
                    {t('tools.regexBuilder.match')} {i + 1}: "<span className="text-blue-600">{match.match}</span>"
                  </span>
                  <span className="text-xs text-slate-500">
                    {t('tools.regexBuilder.index')}: {match.index}
                  </span>
                </div>
                {match.groups.length > 0 && (
                  <div className="mt-2 pl-4 border-l-2 border-slate-300">
                    {match.groups.map((group, j) => (
                      <p key={j} className="text-xs text-slate-600">
                        {t('tools.regexBuilder.group')} {j + 1}: "{group}"
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-4">
            {pattern ? t('tools.regexBuilder.noMatches') : t('tools.regexBuilder.enterPattern')}
          </p>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.regexBuilder.cheatsheet')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[
            { pattern: '.', desc: t('tools.regexBuilder.cheatAny') },
            { pattern: '\\d', desc: t('tools.regexBuilder.cheatDigit') },
            { pattern: '\\w', desc: t('tools.regexBuilder.cheatWord') },
            { pattern: '\\s', desc: t('tools.regexBuilder.cheatSpace') },
            { pattern: '^', desc: t('tools.regexBuilder.cheatStart') },
            { pattern: '$', desc: t('tools.regexBuilder.cheatEnd') },
            { pattern: '*', desc: t('tools.regexBuilder.cheatZeroMore') },
            { pattern: '+', desc: t('tools.regexBuilder.cheatOneMore') },
            { pattern: '?', desc: t('tools.regexBuilder.cheatOptional') },
            { pattern: '{n}', desc: t('tools.regexBuilder.cheatExact') },
            { pattern: '[abc]', desc: t('tools.regexBuilder.cheatClass') },
            { pattern: '()', desc: t('tools.regexBuilder.cheatGroup') },
          ].map(({ pattern: p, desc }) => (
            <div key={p} className="p-2 bg-slate-50 rounded">
              <code className="text-blue-600">{p}</code>
              <span className="text-slate-600 ml-2">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
