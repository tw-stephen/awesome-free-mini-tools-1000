import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Word {
  id: number
  word: string
  definition: string
  example: string
  mastered: boolean
  reviewCount: number
}

export default function VocabularyBuilder() {
  const { t } = useTranslation()
  const [words, setWords] = useState<Word[]>([])
  const [mode, setMode] = useState<'add' | 'review' | 'list'>('add')
  const [newWord, setNewWord] = useState('')
  const [newDefinition, setNewDefinition] = useState('')
  const [newExample, setNewExample] = useState('')
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('vocabulary-words')
    if (saved) {
      try {
        setWords(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load vocabulary')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('vocabulary-words', JSON.stringify(words))
  }, [words])

  const addWord = () => {
    if (newWord.trim() && newDefinition.trim()) {
      setWords([
        ...words,
        {
          id: Date.now(),
          word: newWord.trim(),
          definition: newDefinition.trim(),
          example: newExample.trim(),
          mastered: false,
          reviewCount: 0,
        }
      ])
      setNewWord('')
      setNewDefinition('')
      setNewExample('')
    }
  }

  const deleteWord = (id: number) => {
    setWords(words.filter(w => w.id !== id))
  }

  const toggleMastered = (id: number) => {
    setWords(words.map(w => w.id === id ? { ...w, mastered: !w.mastered } : w))
  }

  const reviewWords = words.filter(w => !w.mastered)

  const nextReview = (knew: boolean) => {
    if (reviewWords.length > 0) {
      const currentWord = reviewWords[currentReviewIndex]
      setWords(words.map(w =>
        w.id === currentWord.id
          ? { ...w, reviewCount: w.reviewCount + 1, mastered: knew && w.reviewCount >= 2 }
          : w
      ))
    }
    setShowAnswer(false)
    if (currentReviewIndex < reviewWords.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1)
    } else {
      setCurrentReviewIndex(0)
    }
  }

  const masteredCount = words.filter(w => w.mastered).length
  const progress = words.length > 0 ? (masteredCount / words.length) * 100 : 0

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['add', 'review', 'list'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setCurrentReviewIndex(0); setShowAnswer(false) }}
            className={`flex-1 py-2 rounded font-medium text-sm ${
              mode === m ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t(`tools.vocabularyBuilder.${m}`)}
            {m === 'review' && ` (${reviewWords.length})`}
          </button>
        ))}
      </div>

      {words.length > 0 && (
        <div className="card p-4">
          <div className="flex justify-between text-sm mb-2">
            <span>{masteredCount} / {words.length} {t('tools.vocabularyBuilder.mastered')}</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {mode === 'add' && (
        <div className="card p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.vocabularyBuilder.word')}
            </label>
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder={t('tools.vocabularyBuilder.wordPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.vocabularyBuilder.definition')}
            </label>
            <textarea
              value={newDefinition}
              onChange={(e) => setNewDefinition(e.target.value)}
              placeholder={t('tools.vocabularyBuilder.definitionPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.vocabularyBuilder.example')}
            </label>
            <input
              type="text"
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              placeholder={t('tools.vocabularyBuilder.examplePlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <button
            onClick={addWord}
            className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            + {t('tools.vocabularyBuilder.addWord')}
          </button>
        </div>
      )}

      {mode === 'review' && (
        <>
          {reviewWords.length > 0 ? (
            <div className="card p-6 text-center">
              <div className="text-xs text-slate-400 mb-4">
                {currentReviewIndex + 1} / {reviewWords.length}
              </div>
              <div className="text-2xl font-bold mb-4">
                {reviewWords[currentReviewIndex].word}
              </div>

              {showAnswer ? (
                <>
                  <div className="p-4 bg-blue-50 rounded mb-4">
                    <p className="text-slate-700">{reviewWords[currentReviewIndex].definition}</p>
                    {reviewWords[currentReviewIndex].example && (
                      <p className="text-sm text-slate-500 mt-2 italic">
                        "{reviewWords[currentReviewIndex].example}"
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => nextReview(false)}
                      className="flex-1 py-2 bg-red-100 text-red-600 rounded font-medium"
                    >
                      {t('tools.vocabularyBuilder.didntKnow')}
                    </button>
                    <button
                      onClick={() => nextReview(true)}
                      className="flex-1 py-2 bg-green-100 text-green-600 rounded font-medium"
                    >
                      {t('tools.vocabularyBuilder.knew')}
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="w-full py-3 bg-blue-500 text-white rounded font-medium"
                >
                  {t('tools.vocabularyBuilder.showAnswer')}
                </button>
              )}
            </div>
          ) : (
            <div className="card p-6 text-center text-slate-500">
              {words.length === 0
                ? t('tools.vocabularyBuilder.noWords')
                : t('tools.vocabularyBuilder.allMastered')}
            </div>
          )}
        </>
      )}

      {mode === 'list' && (
        <div className="space-y-2">
          {words.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.vocabularyBuilder.noWords')}
            </div>
          ) : (
            words.map(word => (
              <div key={word.id} className={`card p-3 ${word.mastered ? 'bg-green-50' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium">{word.word}</div>
                    <div className="text-sm text-slate-600">{word.definition}</div>
                    {word.example && (
                      <div className="text-xs text-slate-400 mt-1">"{word.example}"</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleMastered(word.id)}
                      className={`px-2 py-1 rounded text-xs ${
                        word.mastered ? 'bg-green-100 text-green-600' : 'bg-slate-100'
                      }`}
                    >
                      {word.mastered ? '✓' : '○'}
                    </button>
                    <button
                      onClick={() => deleteWord(word.id)}
                      className="px-2 py-1 text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
