import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Word {
  id: number
  word: string
  definition: string
  example: string
  partOfSpeech: string
  mastery: number
}

export default function VocabularyBuilder() {
  const { t } = useTranslation()
  const [words, setWords] = useState<Word[]>([])
  const [newWord, setNewWord] = useState({
    word: '',
    definition: '',
    example: '',
    partOfSpeech: 'noun',
  })
  const [practiceMode, setPracticeMode] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDefinition, setShowDefinition] = useState(false)
  const [filter, setFilter] = useState<'all' | 'learning' | 'mastered'>('all')

  const partsOfSpeech = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'other']

  const addWord = () => {
    if (!newWord.word.trim() || !newWord.definition.trim()) return
    setWords([...words, { ...newWord, id: Date.now(), mastery: 0 }])
    setNewWord({ word: '', definition: '', example: '', partOfSpeech: 'noun' })
  }

  const removeWord = (id: number) => {
    setWords(words.filter(w => w.id !== id))
  }

  const updateMastery = (id: number, correct: boolean) => {
    setWords(words.map(w => {
      if (w.id !== id) return w
      const newMastery = correct
        ? Math.min(w.mastery + 1, 5)
        : Math.max(w.mastery - 1, 0)
      return { ...w, mastery: newMastery }
    }))
  }

  const filteredWords = words.filter(w => {
    if (filter === 'learning') return w.mastery < 3
    if (filter === 'mastered') return w.mastery >= 3
    return true
  })

  const practiceWords = filteredWords.filter(w => w.mastery < 5)

  const startPractice = () => {
    if (practiceWords.length === 0) return
    setPracticeMode(true)
    setCurrentIndex(0)
    setShowDefinition(false)
  }

  const nextWord = (correct: boolean) => {
    const currentWord = practiceWords[currentIndex]
    updateMastery(currentWord.id, correct)
    setShowDefinition(false)

    if (currentIndex + 1 < practiceWords.length) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setPracticeMode(false)
    }
  }

  const getMasteryColor = (level: number) => {
    if (level >= 4) return 'bg-green-500'
    if (level >= 2) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const exportWords = () => {
    const data = words.map(w => `${w.word}\t${w.definition}\t${w.partOfSpeech}\t${w.example}`).join('\n')
    navigator.clipboard.writeText(data)
  }

  if (practiceMode && practiceWords.length > 0) {
    const word = practiceWords[currentIndex]
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            {currentIndex + 1} / {practiceWords.length}
          </span>
          <button onClick={() => setPracticeMode(false)} className="text-blue-500 text-sm">
            Exit Practice
          </button>
        </div>

        <div className="card p-8 text-center">
          <div className="text-3xl font-bold mb-2">{word.word}</div>
          <div className="text-sm text-slate-500 mb-4">{word.partOfSpeech}</div>

          {showDefinition ? (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded">
                <div className="font-medium">{word.definition}</div>
                {word.example && (
                  <div className="text-sm text-slate-500 mt-2 italic">"{word.example}"</div>
                )}
              </div>
              <div className="text-sm text-slate-500">Did you know this word?</div>
              <div className="flex gap-3">
                <button
                  onClick={() => nextWord(false)}
                  className="flex-1 py-3 bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium"
                >
                  Still Learning
                </button>
                <button
                  onClick={() => nextWord(true)}
                  className="flex-1 py-3 bg-green-100 text-green-700 rounded hover:bg-green-200 font-medium"
                >
                  Got It!
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDefinition(true)}
              className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
            >
              Show Definition
            </button>
          )}
        </div>

        <div className="flex justify-center gap-1">
          {practiceWords.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-blue-500' : 'bg-slate-300'}`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.vocabularyBuilder.addWord')}</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={newWord.word}
              onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
              placeholder="Word"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <select
              value={newWord.partOfSpeech}
              onChange={(e) => setNewWord({ ...newWord, partOfSpeech: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {partsOfSpeech.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={newWord.definition}
            onChange={(e) => setNewWord({ ...newWord, definition: e.target.value })}
            placeholder="Definition"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={newWord.example}
            onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
            placeholder="Example sentence (optional)"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={addWord}
            disabled={!newWord.word.trim() || !newWord.definition.trim()}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
          >
            Add Word
          </button>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['all', 'learning', 'mastered'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded text-sm capitalize
                  ${filter === f ? 'bg-blue-500 text-white' : 'bg-white hover:bg-slate-100'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="font-medium">{filteredWords.length} words</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="card p-3 text-center">
          <div className="text-xl font-bold">{words.length}</div>
          <div className="text-xs text-slate-500">Total Words</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-yellow-600">
            {words.filter(w => w.mastery < 3).length}
          </div>
          <div className="text-xs text-slate-500">Learning</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-green-600">
            {words.filter(w => w.mastery >= 3).length}
          </div>
          <div className="text-xs text-slate-500">Mastered</div>
        </div>
      </div>

      <div className="space-y-2 max-h-[250px] overflow-y-auto">
        {filteredWords.map(word => (
          <div key={word.id} className="card p-3 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{word.word}</span>
                <span className="text-xs text-slate-400">{word.partOfSpeech}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i <= word.mastery ? getMasteryColor(word.mastery) : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-sm text-slate-600">{word.definition}</div>
              {word.example && (
                <div className="text-xs text-slate-400 italic mt-1">"{word.example}"</div>
              )}
            </div>
            <button onClick={() => removeWord(word.id)} className="text-red-400 hover:text-red-600">
              ×
            </button>
          </div>
        ))}
      </div>

      {words.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          Add words to build your vocabulary
        </div>
      )}

      {practiceWords.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={startPractice}
            className="flex-1 py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
          >
            {t('tools.vocabularyBuilder.practice')} ({practiceWords.length})
          </button>
          <button onClick={exportWords} className="px-4 py-3 bg-slate-200 rounded hover:bg-slate-300">
            {t('tools.vocabularyBuilder.export')}
          </button>
        </div>
      )}
    </div>
  )
}
