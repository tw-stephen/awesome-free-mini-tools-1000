import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Issue {
  type: 'grammar' | 'spelling' | 'style' | 'punctuation'
  text: string
  suggestion: string
  position: number
}

export default function GrammarChecker() {
  const { t } = useTranslation()
  const [text, setText] = useState('')

  const commonErrors: { pattern: RegExp; type: Issue['type']; suggestion: string }[] = [
    { pattern: /\bi\b/g, type: 'grammar', suggestion: 'I' },
    { pattern: /\btheir\s+(?:is|was)\b/gi, type: 'grammar', suggestion: "there's" },
    { pattern: /\byour\s+(?:welcome|going|the|a)\b/gi, type: 'grammar', suggestion: "you're" },
    { pattern: /\bits\s+(?:a|the|been|going)\b/gi, type: 'grammar', suggestion: "it's" },
    { pattern: /\balot\b/gi, type: 'spelling', suggestion: 'a lot' },
    { pattern: /\bdefinately\b/gi, type: 'spelling', suggestion: 'definitely' },
    { pattern: /\brecieve\b/gi, type: 'spelling', suggestion: 'receive' },
    { pattern: /\boccured\b/gi, type: 'spelling', suggestion: 'occurred' },
    { pattern: /\bseperate\b/gi, type: 'spelling', suggestion: 'separate' },
    { pattern: /\buntil\b/gi, type: 'spelling', suggestion: 'until' },
    { pattern: /\bwich\b/gi, type: 'spelling', suggestion: 'which' },
    { pattern: /\bteh\b/gi, type: 'spelling', suggestion: 'the' },
    { pattern: /\s{2,}/g, type: 'style', suggestion: 'single space' },
    { pattern: /[.!?]\s*[a-z]/g, type: 'punctuation', suggestion: 'capitalize after sentence' },
    { pattern: /\s+[.,!?]/g, type: 'punctuation', suggestion: 'remove space before punctuation' },
    { pattern: /\bcould of\b/gi, type: 'grammar', suggestion: 'could have' },
    { pattern: /\bshould of\b/gi, type: 'grammar', suggestion: 'should have' },
    { pattern: /\bwould of\b/gi, type: 'grammar', suggestion: 'would have' },
    { pattern: /\bthen\b\s+\bthan\b/gi, type: 'grammar', suggestion: 'check then/than usage' },
    { pattern: /\beffect\b(?=\s+(?:the|a|on))/gi, type: 'grammar', suggestion: 'affect (verb)' },
  ]

  const checkGrammar = (): Issue[] => {
    const issues: Issue[] = []

    commonErrors.forEach(({ pattern, type, suggestion }) => {
      let match
      while ((match = pattern.exec(text)) !== null) {
        issues.push({
          type,
          text: match[0],
          suggestion,
          position: match.index,
        })
      }
    })

    // Check for repeated words
    const repeatedWord = /\b(\w+)\s+\1\b/gi
    let match
    while ((match = repeatedWord.exec(text)) !== null) {
      issues.push({
        type: 'style',
        text: match[0],
        suggestion: `remove duplicate "${match[1]}"`,
        position: match.index,
      })
    }

    return issues.sort((a, b) => a.position - b.position)
  }

  const issues = checkGrammar()

  const getIssuesByType = (type: Issue['type']) => issues.filter(i => i.type === type)

  const getWordCount = () => text.split(/\s+/).filter(w => w.length > 0).length
  const getSentenceCount = () => text.split(/[.!?]+/).filter(s => s.trim().length > 0).length

  const typeColors = {
    grammar: { bg: 'bg-red-100', text: 'text-red-700', label: 'Grammar' },
    spelling: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Spelling' },
    style: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Style' },
    punctuation: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Punctuation' },
  }

  const getScore = () => {
    if (!text.trim()) return 100
    const wordCount = getWordCount()
    if (wordCount === 0) return 100
    const issueRatio = issues.length / wordCount
    return Math.max(0, Math.round(100 - issueRatio * 200))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.grammarChecker.input')}</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here to check for grammar, spelling, and style issues..."
          rows={8}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
        />
        <div className="flex justify-between mt-2 text-sm text-slate-500">
          <span>{getWordCount()} words</span>
          <span>{getSentenceCount()} sentences</span>
        </div>
      </div>

      {text.trim() && (
        <>
          <div className="grid grid-cols-4 gap-2">
            <div className="card p-3 text-center">
              <div className="text-2xl font-bold">{getScore()}</div>
              <div className="text-xs text-slate-500">Score</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-2xl font-bold text-red-600">
                {getIssuesByType('grammar').length}
              </div>
              <div className="text-xs text-slate-500">Grammar</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {getIssuesByType('spelling').length}
              </div>
              <div className="text-xs text-slate-500">Spelling</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getIssuesByType('style').length + getIssuesByType('punctuation').length}
              </div>
              <div className="text-xs text-slate-500">Style</div>
            </div>
          </div>

          {issues.length > 0 ? (
            <div className="card p-4">
              <h3 className="font-medium mb-3">{t('tools.grammarChecker.issues')} ({issues.length})</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {issues.map((issue, index) => {
                  const colors = typeColors[issue.type]
                  return (
                    <div key={index} className={`p-3 rounded ${colors.bg}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium ${colors.text}`}>{colors.label}</span>
                        <span className="text-xs text-slate-400">Position {issue.position}</span>
                      </div>
                      <div className="mt-1">
                        <span className="font-medium line-through">{issue.text}</span>
                        <span className="mx-2">→</span>
                        <span className={`font-medium ${colors.text}`}>{issue.suggestion}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center bg-green-50">
              <div className="text-green-600 font-medium">No issues found!</div>
              <div className="text-sm text-green-500 mt-1">Your text looks good.</div>
            </div>
          )}

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.grammarChecker.stats')}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Characters:</span>
                <span className="font-medium">{text.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Words:</span>
                <span className="font-medium">{getWordCount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sentences:</span>
                <span className="font-medium">{getSentenceCount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Avg. Word Length:</span>
                <span className="font-medium">
                  {getWordCount() > 0
                    ? (text.replace(/\s+/g, '').length / getWordCount()).toFixed(1)
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {!text.trim() && (
        <div className="card p-8 text-center text-slate-500">
          Enter text above to check for errors
        </div>
      )}
    </div>
  )
}
