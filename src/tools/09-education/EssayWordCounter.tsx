import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function EssayWordCounter() {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const [targetWords, setTargetWords] = useState('')

  const stats = useMemo(() => {
    if (!text.trim()) return null

    const words = text.trim().split(/\s+/).filter(Boolean)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim())
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim())
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length

    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words.length / 200)

    // Speaking time (average 130 words per minute)
    const speakingTime = Math.ceil(words.length / 130)

    // Average word length
    const avgWordLength = charactersNoSpaces / words.length

    // Average sentence length
    const avgSentenceLength = words.length / sentences.length

    // Unique words
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-zA-Z]/g, '')))

    // Word frequency
    const wordFreq: Record<string, number> = {}
    words.forEach(w => {
      const normalized = w.toLowerCase().replace(/[^a-zA-Z]/g, '')
      if (normalized) {
        wordFreq[normalized] = (wordFreq[normalized] || 0) + 1
      }
    })
    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    return {
      words: words.length,
      characters,
      charactersNoSpaces,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      readingTime,
      speakingTime,
      avgWordLength,
      avgSentenceLength,
      uniqueWords: uniqueWords.size,
      topWords,
    }
  }, [text])

  const target = parseInt(targetWords) || 0
  const progress = stats && target > 0 ? Math.min((stats.words / target) * 100, 100) : 0

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-slate-700">
            {t('tools.essayWordCounter.yourText')}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{t('tools.essayWordCounter.target')}:</span>
            <input
              type="number"
              value={targetWords}
              onChange={(e) => setTargetWords(e.target.value)}
              placeholder="500"
              className="w-20 px-2 py-1 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('tools.essayWordCounter.placeholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
          rows={8}
        />
        {target > 0 && stats && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>{stats.words} / {target} {t('tools.essayWordCounter.words')}</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded overflow-hidden">
              <div
                className={`h-full transition-all ${
                  stats.words >= target ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="card p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.words}</div>
              <div className="text-xs text-slate-500">{t('tools.essayWordCounter.words')}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.characters}</div>
              <div className="text-xs text-slate-500">{t('tools.essayWordCounter.characters')}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.sentences}</div>
              <div className="text-xs text-slate-500">{t('tools.essayWordCounter.sentences')}</div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.essayWordCounter.details')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('tools.essayWordCounter.paragraphs')}</span>
                <span>{stats.paragraphs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('tools.essayWordCounter.charsNoSpaces')}</span>
                <span>{stats.charactersNoSpaces}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('tools.essayWordCounter.uniqueWords')}</span>
                <span>{stats.uniqueWords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('tools.essayWordCounter.avgWordLength')}</span>
                <span>{stats.avgWordLength.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('tools.essayWordCounter.avgSentenceLength')}</span>
                <span>{stats.avgSentenceLength.toFixed(1)} {t('tools.essayWordCounter.words')}</span>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.essayWordCounter.readingTime')}</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-xl font-bold text-blue-600">{stats.readingTime} min</div>
                <div className="text-xs text-slate-500">{t('tools.essayWordCounter.toRead')}</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-xl font-bold text-green-600">{stats.speakingTime} min</div>
                <div className="text-xs text-slate-500">{t('tools.essayWordCounter.toSpeak')}</div>
              </div>
            </div>
          </div>

          {stats.topWords.length > 0 && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.essayWordCounter.topWords')}</h3>
              <div className="flex flex-wrap gap-2">
                {stats.topWords.map(([word, count]) => (
                  <span key={word} className="px-2 py-1 bg-slate-100 rounded text-sm">
                    {word} <span className="text-slate-400">({count})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
