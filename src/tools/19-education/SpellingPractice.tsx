import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Word {
  word: string
  definition: string
}

export default function SpellingPractice() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'practice' | 'custom'>('practice')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [practicing, setPracticing] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState({ correct: 0, wrong: 0 })
  const [customWords, setCustomWords] = useState<Word[]>([])
  const [newWord, setNewWord] = useState({ word: '', definition: '' })

  const wordLists: { [key: string]: Word[] } = {
    easy: [
      { word: 'apple', definition: 'A round fruit that is typically red or green' },
      { word: 'house', definition: 'A building where people live' },
      { word: 'water', definition: 'A clear liquid essential for life' },
      { word: 'friend', definition: 'A person you know well and like' },
      { word: 'school', definition: 'A place for education' },
      { word: 'music', definition: 'Sounds arranged in a pleasing way' },
      { word: 'garden', definition: 'An area for growing plants' },
      { word: 'animal', definition: 'A living creature that is not a plant' },
    ],
    medium: [
      { word: 'beautiful', definition: 'Pleasing to the senses, especially sight' },
      { word: 'different', definition: 'Not the same as another' },
      { word: 'necessary', definition: 'Required or essential' },
      { word: 'beginning', definition: 'The start of something' },
      { word: 'government', definition: 'The ruling body of a country' },
      { word: 'environment', definition: 'The natural world around us' },
      { word: 'knowledge', definition: 'Information and understanding' },
      { word: 'experience', definition: 'Something that happens to you' },
    ],
    hard: [
      { word: 'accommodate', definition: 'To provide space or room for' },
      { word: 'conscientious', definition: 'Careful and thorough in work' },
      { word: 'entrepreneur', definition: 'A person who starts a business' },
      { word: 'mischievous', definition: 'Playfully causing trouble' },
      { word: 'pronunciation', definition: 'The way a word is spoken' },
      { word: 'questionnaire', definition: 'A set of written questions' },
      { word: 'surveillance', definition: 'Close observation or monitoring' },
      { word: 'unprecedented', definition: 'Never done or known before' },
    ],
  }

  const currentList = mode === 'custom' ? customWords : wordLists[difficulty]
  const currentWord = currentList[currentIndex]

  const startPractice = () => {
    if (currentList.length === 0) return
    setPracticing(true)
    setCurrentIndex(0)
    setUserInput('')
    setShowResult(false)
    setScore({ correct: 0, wrong: 0 })
  }

  const checkSpelling = () => {
    if (!currentWord) return
    const isCorrect = userInput.toLowerCase().trim() === currentWord.word.toLowerCase()
    setShowResult(true)
    if (isCorrect) {
      setScore({ ...score, correct: score.correct + 1 })
    } else {
      setScore({ ...score, wrong: score.wrong + 1 })
    }
  }

  const nextWord = () => {
    if (currentIndex + 1 >= currentList.length) {
      setPracticing(false)
    } else {
      setCurrentIndex(currentIndex + 1)
      setUserInput('')
      setShowResult(false)
    }
  }

  const addCustomWord = () => {
    if (!newWord.word.trim()) return
    setCustomWords([...customWords, { ...newWord }])
    setNewWord({ word: '', definition: '' })
  }

  const removeCustomWord = (index: number) => {
    setCustomWords(customWords.filter((_, i) => i !== index))
  }

  const speakWord = () => {
    if (!currentWord) return
    const utterance = new SpeechSynthesisUtterance(currentWord.word)
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }

  if (practicing && currentWord) {
    const isCorrect = userInput.toLowerCase().trim() === currentWord.word.toLowerCase()

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Word {currentIndex + 1} of {currentList.length}
          </span>
          <div className="flex gap-2">
            <span className="text-green-600">✓ {score.correct}</span>
            <span className="text-red-600">✗ {score.wrong}</span>
          </div>
        </div>

        <div className="w-full h-2 bg-slate-200 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: `${((currentIndex + 1) / currentList.length) * 100}%` }}
          />
        </div>

        <div className="card p-6 text-center">
          <button
            onClick={speakWord}
            className="text-4xl mb-4 hover:scale-110 transition-transform"
            title="Listen to pronunciation"
          >
            🔊
          </button>
          <p className="text-lg text-slate-600 mb-4">{currentWord.definition}</p>

          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !showResult && checkSpelling()}
            placeholder="Type the word"
            disabled={showResult}
            className={`w-full px-4 py-3 text-xl text-center border-2 rounded font-medium ${
              showResult
                ? isCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-slate-300'
            }`}
            autoFocus
          />

          {showResult && (
            <div className="mt-4">
              {isCorrect ? (
                <div className="text-green-600 text-xl font-medium">Correct!</div>
              ) : (
                <div>
                  <div className="text-red-600 text-xl font-medium">Incorrect</div>
                  <div className="text-slate-600 mt-2">
                    Correct spelling: <span className="font-bold">{currentWord.word}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!showResult ? (
          <button
            onClick={checkSpelling}
            disabled={!userInput.trim()}
            className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium disabled:bg-slate-300"
          >
            Check Spelling
          </button>
        ) : (
          <button
            onClick={nextWord}
            className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
          >
            {currentIndex + 1 >= currentList.length ? 'See Results' : 'Next Word'}
          </button>
        )}

        <button
          onClick={() => setPracticing(false)}
          className="w-full py-2 bg-slate-200 rounded hover:bg-slate-300"
        >
          End Practice
        </button>
      </div>
    )
  }

  // Results screen
  if (!practicing && score.correct + score.wrong > 0) {
    const percentage = Math.round((score.correct / (score.correct + score.wrong)) * 100)

    return (
      <div className="space-y-4">
        <div className="card p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Practice Complete!</h2>
          <div className="text-5xl font-bold mb-2">{percentage}%</div>
          <div className="text-slate-500">
            {score.correct} correct, {score.wrong} incorrect
          </div>
          <div className="mt-4 text-lg">
            {percentage >= 90 ? 'Excellent!' : percentage >= 70 ? 'Good job!' : 'Keep practicing!'}
          </div>
        </div>
        <button
          onClick={startPractice}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          Practice Again
        </button>
        <button
          onClick={() => setScore({ correct: 0, wrong: 0 })}
          className="w-full py-2 bg-slate-200 rounded hover:bg-slate-300"
        >
          Change Settings
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.spellingPractice.mode')}</h3>
        <div className="flex gap-2 mb-4">
          {(['practice', 'custom'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded capitalize ${
                mode === m ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {m === 'practice' ? 'Word Lists' : 'Custom Words'}
            </button>
          ))}
        </div>

        {mode === 'practice' && (
          <>
            <h3 className="font-medium mb-3">{t('tools.spellingPractice.difficulty')}</h3>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded capitalize ${
                    difficulty === d ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="text-center text-sm text-slate-500 mt-2">
              {wordLists[difficulty].length} words
            </div>
          </>
        )}

        {mode === 'custom' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newWord.word}
                onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                placeholder="Word"
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="text"
                value={newWord.definition}
                onChange={(e) => setNewWord({ ...newWord, definition: e.target.value })}
                placeholder="Definition (optional)"
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              <button
                onClick={addCustomWord}
                disabled={!newWord.word.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-slate-300"
              >
                Add
              </button>
            </div>
            <div className="space-y-1 max-h-[150px] overflow-y-auto">
              {customWords.map((word, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span>{word.word}</span>
                  <button onClick={() => removeCustomWord(i)} className="text-red-400 hover:text-red-600">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={startPractice}
        disabled={currentList.length === 0}
        className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium disabled:bg-slate-300"
      >
        {t('tools.spellingPractice.start')}
      </button>
    </div>
  )
}
