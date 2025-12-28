import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface WordData {
  word: string
  hint: string
  category: string
}

export default function WordScramble() {
  const { t } = useTranslation()
  const [currentWord, setCurrentWord] = useState<WordData | null>(null)
  const [scrambledWord, setScrambledWord] = useState('')
  const [guess, setGuess] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [category, setCategory] = useState('all')

  const wordLists: Record<string, WordData[]> = {
    animals: [
      { word: 'ELEPHANT', hint: 'Largest land animal', category: 'animals' },
      { word: 'GIRAFFE', hint: 'Tallest animal', category: 'animals' },
      { word: 'PENGUIN', hint: 'Bird that cannot fly', category: 'animals' },
      { word: 'DOLPHIN', hint: 'Smart ocean mammal', category: 'animals' },
      { word: 'KANGAROO', hint: 'Jumping Australian animal', category: 'animals' },
    ],
    food: [
      { word: 'PIZZA', hint: 'Italian round dish', category: 'food' },
      { word: 'HAMBURGER', hint: 'Patty in a bun', category: 'food' },
      { word: 'CHOCOLATE', hint: 'Sweet brown treat', category: 'food' },
      { word: 'SPAGHETTI', hint: 'Long Italian pasta', category: 'food' },
      { word: 'SANDWICH', hint: 'Filling between bread', category: 'food' },
    ],
    countries: [
      { word: 'AUSTRALIA', hint: 'Land down under', category: 'countries' },
      { word: 'CANADA', hint: 'North of USA', category: 'countries' },
      { word: 'BRAZIL', hint: 'Largest South American country', category: 'countries' },
      { word: 'JAPAN', hint: 'Land of the rising sun', category: 'countries' },
      { word: 'GERMANY', hint: 'European industrial powerhouse', category: 'countries' },
    ],
    sports: [
      { word: 'BASKETBALL', hint: 'Shoot through a hoop', category: 'sports' },
      { word: 'FOOTBALL', hint: 'Kicked around the world', category: 'sports' },
      { word: 'SWIMMING', hint: 'Water sport', category: 'sports' },
      { word: 'TENNIS', hint: 'Racket and ball sport', category: 'sports' },
      { word: 'VOLLEYBALL', hint: 'Net and ball team sport', category: 'sports' },
    ],
  }

  const getAllWords = () => {
    return Object.values(wordLists).flat()
  }

  const scrambleWord = (word: string): string => {
    const arr = word.split('')
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    // Make sure it's actually scrambled
    if (arr.join('') === word) {
      return scrambleWord(word)
    }
    return arr.join('')
  }

  const nextWord = () => {
    const words = category === 'all' ? getAllWords() : wordLists[category]
    const randomWord = words[Math.floor(Math.random() * words.length)]
    setCurrentWord(randomWord)
    setScrambledWord(scrambleWord(randomWord.word))
    setGuess('')
    setShowHint(false)
    setResult(null)
  }

  useEffect(() => {
    nextWord()
  }, [category])

  const handleGuess = () => {
    if (!currentWord) return

    if (guess.toUpperCase() === currentWord.word) {
      setResult('correct')
      setScore(prev => prev + (showHint ? 5 : 10))
      setStreak(prev => prev + 1)
      setTimeout(nextWord, 1500)
    } else {
      setResult('wrong')
      setStreak(0)
      setTimeout(() => setResult(null), 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGuess()
    }
  }

  const skipWord = () => {
    setStreak(0)
    nextWord()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 flex-wrap mb-4">
          {['all', ...Object.keys(wordLists)].map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded text-sm capitalize ${
                category === cat ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? t('tools.wordScramble.allCategories') : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.wordScramble.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{streak} 🔥</div>
            <div className="text-sm text-slate-500">{t('tools.wordScramble.streak')}</div>
          </div>
        </div>
      </div>

      <div className={`card p-6 text-center ${
        result === 'correct' ? 'bg-green-50' :
        result === 'wrong' ? 'bg-red-50' : ''
      }`}>
        <div className="text-sm text-slate-500 mb-2 capitalize">
          {currentWord?.category}
        </div>

        <div className="text-4xl font-bold tracking-widest mb-4 font-mono">
          {scrambledWord}
        </div>

        {showHint && currentWord && (
          <div className="text-sm text-blue-600 mb-4 p-2 bg-blue-50 rounded">
            💡 {currentWord.hint}
          </div>
        )}

        {result === 'correct' && (
          <div className="text-green-600 font-bold text-lg mb-4">
            ✓ {t('tools.wordScramble.correct')}!
          </div>
        )}

        {result === 'wrong' && (
          <div className="text-red-600 font-bold text-lg mb-4">
            ✗ {t('tools.wordScramble.tryAgain')}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder={t('tools.wordScramble.enterGuess')}
            className="flex-1 px-4 py-3 border border-slate-300 rounded text-center text-lg font-mono uppercase"
            disabled={result === 'correct'}
          />
          <button
            onClick={handleGuess}
            disabled={result === 'correct'}
            className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:bg-blue-300"
          >
            {t('tools.wordScramble.check')}
          </button>
        </div>

        <div className="flex gap-2 justify-center">
          {!showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200"
            >
              💡 {t('tools.wordScramble.showHint')} (-5 pts)
            </button>
          )}
          <button
            onClick={skipWord}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded text-sm hover:bg-slate-200"
          >
            ⏭️ {t('tools.wordScramble.skip')}
          </button>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.wordScramble.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.wordScramble.instruction1')}</li>
          <li>• {t('tools.wordScramble.instruction2')}</li>
          <li>• {t('tools.wordScramble.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
