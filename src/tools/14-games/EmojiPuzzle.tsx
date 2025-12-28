import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Puzzle {
  emojis: string
  answer: string
  hint: string
  category: string
}

export default function EmojiPuzzle() {
  const { t } = useTranslation()
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null)
  const [guess, setGuess] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [usedPuzzles, setUsedPuzzles] = useState<Set<string>>(new Set())

  const puzzles: Puzzle[] = [
    // Movies
    { emojis: '🦁👑', answer: 'lion king', hint: 'Disney animated classic', category: 'movies' },
    { emojis: '⭐🔫', answer: 'star wars', hint: 'George Lucas sci-fi', category: 'movies' },
    { emojis: '🧊❄️👸', answer: 'frozen', hint: 'Let it go!', category: 'movies' },
    { emojis: '🕷️🧑', answer: 'spiderman', hint: 'Friendly neighborhood hero', category: 'movies' },
    { emojis: '🧙‍♂️💍', answer: 'lord of the rings', hint: 'One ring to rule them all', category: 'movies' },
    { emojis: '🦇🧑', answer: 'batman', hint: 'Dark Knight', category: 'movies' },
    { emojis: '🌊🔍🐟', answer: 'finding nemo', hint: 'Just keep swimming', category: 'movies' },

    // Food
    { emojis: '🍕🛒', answer: 'pizza delivery', hint: 'Hot and fresh', category: 'food' },
    { emojis: '🥜🧈', answer: 'peanut butter', hint: 'Goes with jelly', category: 'food' },
    { emojis: '🧀🍔', answer: 'cheeseburger', hint: 'Fast food classic', category: 'food' },
    { emojis: '🍎🥧', answer: 'apple pie', hint: 'American dessert', category: 'food' },
    { emojis: '🥤🧊', answer: 'iced drink', hint: 'Cold beverage', category: 'food' },

    // Places
    { emojis: '🗽🇺🇸', answer: 'new york', hint: 'The Big Apple', category: 'places' },
    { emojis: '🗼💕', answer: 'paris', hint: 'City of Love', category: 'places' },
    { emojis: '🎰🏜️', answer: 'las vegas', hint: 'Sin City', category: 'places' },
    { emojis: '🏖️☀️🌴', answer: 'hawaii', hint: 'Aloha!', category: 'places' },

    // Phrases
    { emojis: '💔💕', answer: 'heartbreak', hint: 'Emotional pain', category: 'phrases' },
    { emojis: '🌧️🐈🐕', answer: 'raining cats and dogs', hint: 'Heavy rain', category: 'phrases' },
    { emojis: '🔥🦊', answer: 'firefox', hint: 'Web browser', category: 'phrases' },
    { emojis: '🎂📅', answer: 'birthday', hint: 'Annual celebration', category: 'phrases' },
    { emojis: '☀️🌻', answer: 'sunflower', hint: 'Yellow flower', category: 'phrases' },
  ]

  const getNextPuzzle = () => {
    const available = puzzles.filter(p => !usedPuzzles.has(p.emojis))
    if (available.length === 0) {
      setUsedPuzzles(new Set())
      const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)]
      setCurrentPuzzle(randomPuzzle)
      setUsedPuzzles(new Set([randomPuzzle.emojis]))
    } else {
      const randomPuzzle = available[Math.floor(Math.random() * available.length)]
      setCurrentPuzzle(randomPuzzle)
      setUsedPuzzles(prev => new Set([...prev, randomPuzzle.emojis]))
    }
    setGuess('')
    setShowHint(false)
    setResult(null)
  }

  useEffect(() => {
    getNextPuzzle()
  }, [])

  const handleGuess = () => {
    if (!currentPuzzle) return

    const normalizedGuess = guess.toLowerCase().trim()
    const normalizedAnswer = currentPuzzle.answer.toLowerCase()

    if (normalizedGuess === normalizedAnswer) {
      setResult('correct')
      setScore(prev => prev + (showHint ? 5 : 10))
      setStreak(prev => prev + 1)
      setTimeout(getNextPuzzle, 1500)
    } else {
      setResult('wrong')
      setStreak(0)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && result !== 'correct') {
      handleGuess()
    }
  }

  const skipPuzzle = () => {
    setStreak(0)
    getNextPuzzle()
  }

  const giveUp = () => {
    if (currentPuzzle) {
      setResult('wrong')
      setStreak(0)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.emojiPuzzle.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{streak} 🔥</div>
            <div className="text-sm text-slate-500">{t('tools.emojiPuzzle.streak')}</div>
          </div>
        </div>
      </div>

      {currentPuzzle && (
        <div className={`card p-6 text-center ${
          result === 'correct' ? 'bg-green-50' :
          result === 'wrong' ? 'bg-red-50' : ''
        }`}>
          <div className="text-sm text-slate-500 mb-2 capitalize">
            {currentPuzzle.category}
          </div>

          <div className="text-6xl mb-4 tracking-wide">
            {currentPuzzle.emojis}
          </div>

          {showHint && (
            <div className="text-sm text-blue-600 mb-4 p-2 bg-blue-50 rounded">
              💡 {currentPuzzle.hint}
            </div>
          )}

          {result === 'correct' && (
            <div className="text-green-600 font-bold text-lg mb-4">
              ✓ {t('tools.emojiPuzzle.correct')}! {t('tools.emojiPuzzle.theAnswer')}: {currentPuzzle.answer}
            </div>
          )}

          {result === 'wrong' && (
            <div className="text-red-600 font-bold text-lg mb-4">
              ✗ {t('tools.emojiPuzzle.tryAgain')}
              <div className="text-sm mt-1">
                {t('tools.emojiPuzzle.theAnswer')}: <span className="font-bold">{currentPuzzle.answer}</span>
              </div>
            </div>
          )}

          {result !== 'correct' && (
            <>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('tools.emojiPuzzle.enterGuess')}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded text-center"
                />
                <button
                  onClick={handleGuess}
                  className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
                >
                  {t('tools.emojiPuzzle.check')}
                </button>
              </div>

              <div className="flex gap-2 justify-center">
                {!showHint && (
                  <button
                    onClick={() => setShowHint(true)}
                    className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200"
                  >
                    💡 {t('tools.emojiPuzzle.showHint')}
                  </button>
                )}
                <button
                  onClick={giveUp}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                >
                  🏳️ {t('tools.emojiPuzzle.giveUp')}
                </button>
                <button
                  onClick={skipPuzzle}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded text-sm hover:bg-slate-200"
                >
                  ⏭️ {t('tools.emojiPuzzle.skip')}
                </button>
              </div>
            </>
          )}

          {result === 'wrong' && (
            <button
              onClick={getNextPuzzle}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
            >
              {t('tools.emojiPuzzle.nextPuzzle')}
            </button>
          )}
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.emojiPuzzle.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.emojiPuzzle.instruction1')}</li>
          <li>• {t('tools.emojiPuzzle.instruction2')}</li>
          <li>• {t('tools.emojiPuzzle.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
