import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Word {
  word: string
  attempts: number
  correct: number
}

export default function SpellingPractice() {
  const { t } = useTranslation()
  const [words, setWords] = useState<Word[]>([])
  const [mode, setMode] = useState<'setup' | 'practice' | 'results'>('setup')
  const [inputWords, setInputWords] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('spelling-words')
    if (saved) {
      try {
        setInputWords(saved)
      } catch (e) {
        console.error('Failed to load words')
      }
    }
  }, [])

  const startPractice = () => {
    const wordList = inputWords
      .split(/[\n,]+/)
      .map(w => w.trim().toLowerCase())
      .filter(w => w.length > 0)

    if (wordList.length > 0) {
      localStorage.setItem('spelling-words', inputWords)
      setWords(wordList.map(w => ({ word: w, attempts: 0, correct: 0 })))
      setCurrentIndex(0)
      setMode('practice')
      speakWord(wordList[0])
    }
  }

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.rate = 0.8
      speechSynthesis.cancel()
      speechSynthesis.speak(utterance)
    }
  }

  const checkAnswer = () => {
    const isCorrect = userInput.toLowerCase().trim() === words[currentIndex].word

    const updatedWords = [...words]
    updatedWords[currentIndex] = {
      ...updatedWords[currentIndex],
      attempts: updatedWords[currentIndex].attempts + 1,
      correct: updatedWords[currentIndex].correct + (isCorrect ? 1 : 0),
    }
    setWords(updatedWords)

    setFeedback(isCorrect ? 'correct' : 'wrong')
  }

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setUserInput('')
      setFeedback(null)
      setShowHint(false)
      speakWord(words[currentIndex + 1].word)
    } else {
      setMode('results')
    }
  }

  const getHint = () => {
    const word = words[currentIndex].word
    const hintLength = Math.ceil(word.length / 3)
    return word.substring(0, hintLength) + '_'.repeat(word.length - hintLength)
  }

  const totalCorrect = words.filter(w => w.correct > 0).length
  const accuracy = words.length > 0
    ? Math.round((totalCorrect / words.length) * 100)
    : 0

  return (
    <div className="space-y-4">
      {mode === 'setup' && (
        <>
          <div className="card p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.spellingPractice.enterWords')}
            </label>
            <textarea
              value={inputWords}
              onChange={(e) => setInputWords(e.target.value)}
              placeholder={t('tools.spellingPractice.placeholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={6}
            />
            <p className="text-xs text-slate-500 mt-1">
              {t('tools.spellingPractice.hint')}
            </p>
          </div>

          <button
            onClick={startPractice}
            disabled={!inputWords.trim()}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
          >
            {t('tools.spellingPractice.start')}
          </button>
        </>
      )}

      {mode === 'practice' && words.length > 0 && (
        <>
          <div className="card p-4 text-center">
            <div className="text-sm text-slate-500 mb-2">
              {currentIndex + 1} / {words.length}
            </div>
            <div className="h-2 bg-slate-200 rounded mb-4">
              <div
                className="h-full bg-blue-500 rounded"
                style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
              />
            </div>

            <button
              onClick={() => speakWord(words[currentIndex].word)}
              className="p-4 bg-blue-100 rounded-full text-4xl mb-4"
            >
              🔊
            </button>
            <p className="text-sm text-slate-500 mb-4">
              {t('tools.spellingPractice.clickToHear')}
            </p>

            {showHint && (
              <div className="p-2 bg-yellow-50 rounded text-lg font-mono mb-4">
                {getHint()}
              </div>
            )}

            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !feedback && checkAnswer()}
              placeholder={t('tools.spellingPractice.typeWord')}
              className="w-full px-4 py-3 text-xl text-center border-2 border-slate-300 rounded mb-4"
              autoFocus
              disabled={!!feedback}
            />

            {feedback && (
              <div className={`p-3 rounded mb-4 ${
                feedback === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {feedback === 'correct' ? (
                  t('tools.spellingPractice.correct')
                ) : (
                  <>
                    {t('tools.spellingPractice.wrong')}
                    <div className="font-medium">{words[currentIndex].word}</div>
                  </>
                )}
              </div>
            )}

            <div className="flex gap-2">
              {!feedback ? (
                <>
                  <button
                    onClick={() => setShowHint(true)}
                    disabled={showHint}
                    className="flex-1 py-2 bg-yellow-100 text-yellow-700 rounded disabled:opacity-50"
                  >
                    {t('tools.spellingPractice.hint')}
                  </button>
                  <button
                    onClick={checkAnswer}
                    disabled={!userInput.trim()}
                    className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    {t('tools.spellingPractice.check')}
                  </button>
                </>
              ) : (
                <button
                  onClick={nextWord}
                  className="flex-1 py-2 bg-green-500 text-white rounded"
                >
                  {currentIndex < words.length - 1
                    ? t('tools.spellingPractice.next')
                    : t('tools.spellingPractice.finish')}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {mode === 'results' && (
        <>
          <div className="card p-6 text-center bg-blue-50">
            <div className="text-sm text-slate-600">{t('tools.spellingPractice.score')}</div>
            <div className="text-4xl font-bold text-blue-600">
              {totalCorrect} / {words.length}
            </div>
            <div className="text-lg text-slate-600">
              ({accuracy}%)
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.spellingPractice.review')}
            </h3>
            <div className="space-y-2">
              {words.map((w, i) => (
                <div
                  key={i}
                  className={`p-2 rounded flex justify-between ${
                    w.correct > 0 ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <span className="font-medium">{w.word}</span>
                  <span>{w.correct > 0 ? '✓' : '✗'}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => { setMode('setup'); setWords([]) }}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            {t('tools.spellingPractice.practiceAgain')}
          </button>
        </>
      )}
    </div>
  )
}
