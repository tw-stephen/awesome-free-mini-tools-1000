import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function NoteSummarizer() {
  const { t } = useTranslation()
  const [notes, setNotes] = useState('')
  const [summaryType, setSummaryType] = useState<'bullet' | 'paragraph' | 'outline'>('bullet')
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium')

  const summarize = (): string => {
    if (!notes.trim()) return ''

    const sentences = notes
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10)

    const words = notes.split(/\s+/)
    const targetLength = {
      short: Math.min(3, sentences.length),
      medium: Math.min(5, sentences.length),
      long: Math.min(8, sentences.length),
    }[summaryLength]

    // Simple extractive summarization based on sentence position and keyword frequency
    const wordFreq: { [key: string]: number } = {}
    words.forEach(word => {
      const w = word.toLowerCase().replace(/[^a-zA-Z]/g, '')
      if (w.length > 4) {
        wordFreq[w] = (wordFreq[w] || 0) + 1
      }
    })

    const scoredSentences = sentences.map((sentence, index) => {
      let score = 0
      const sentenceWords = sentence.toLowerCase().split(/\s+/)
      sentenceWords.forEach(word => {
        const w = word.replace(/[^a-zA-Z]/g, '')
        if (wordFreq[w]) score += wordFreq[w]
      })
      // Boost first and last sentences
      if (index === 0) score *= 1.5
      if (index === sentences.length - 1) score *= 1.2
      return { sentence, score, index }
    })

    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, targetLength)
      .sort((a, b) => a.index - b.index)
      .map(s => s.sentence)

    switch (summaryType) {
      case 'bullet':
        return topSentences.map(s => `• ${s}`).join('\n')
      case 'paragraph':
        return topSentences.join('. ') + '.'
      case 'outline':
        return topSentences.map((s, i) => `${i + 1}. ${s}`).join('\n')
    }
  }

  const getKeyTerms = (): string[] => {
    const words = notes.split(/\s+/)
    const wordFreq: { [key: string]: number } = {}

    words.forEach(word => {
      const w = word.toLowerCase().replace(/[^a-zA-Z]/g, '')
      if (w.length > 4) {
        wordFreq[w] = (wordFreq[w] || 0) + 1
      }
    })

    return Object.entries(wordFreq)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word)
  }

  const getWordCount = () => notes.split(/\s+/).filter(w => w.length > 0).length
  const getSentenceCount = () => notes.split(/[.!?]+/).filter(s => s.trim().length > 0).length

  const summary = summarize()
  const keyTerms = getKeyTerms()

  const copySummary = () => {
    navigator.clipboard.writeText(summary)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.noteSummarizer.input')}</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste your notes here to summarize..."
          rows={8}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none font-mono text-sm"
        />
        <div className="flex justify-between mt-2 text-sm text-slate-500">
          <span>{getWordCount()} words</span>
          <span>{getSentenceCount()} sentences</span>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.noteSummarizer.options')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-2">Summary Type</label>
            <div className="flex gap-2">
              {(['bullet', 'paragraph', 'outline'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSummaryType(type)}
                  className={`px-3 py-1 rounded text-sm capitalize
                    ${summaryType === type ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-2">Length</label>
            <div className="flex gap-2">
              {(['short', 'medium', 'long'] as const).map(len => (
                <button
                  key={len}
                  onClick={() => setSummaryLength(len)}
                  className={`px-3 py-1 rounded text-sm capitalize
                    ${summaryLength === len ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {notes.trim() && (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">{t('tools.noteSummarizer.summary')}</h3>
              <button onClick={copySummary} className="text-blue-500 text-sm hover:text-blue-600">
                Copy
              </button>
            </div>
            <div className="p-3 bg-slate-50 rounded whitespace-pre-line text-sm">
              {summary || 'Add more content to generate a summary'}
            </div>
          </div>

          {keyTerms.length > 0 && (
            <div className="card p-4">
              <h3 className="font-medium mb-3">{t('tools.noteSummarizer.keyTerms')}</h3>
              <div className="flex flex-wrap gap-2">
                {keyTerms.map(term => (
                  <span key={term} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <div className="card p-3 text-center">
              <div className="text-xl font-bold">
                {Math.round((summary.split(/\s+/).length / getWordCount()) * 100)}%
              </div>
              <div className="text-xs text-slate-500">Compression</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold">{summary.split(/\s+/).length}</div>
              <div className="text-xs text-slate-500">Summary Words</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold">{keyTerms.length}</div>
              <div className="text-xs text-slate-500">Key Terms</div>
            </div>
          </div>
        </>
      )}

      {!notes.trim() && (
        <div className="card p-8 text-center text-slate-500">
          Paste your notes above to generate a summary
        </div>
      )}
    </div>
  )
}
