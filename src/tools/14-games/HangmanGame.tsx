import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function HangmanGame() {
  const { t } = useTranslation()
  const [word, setWord] = useState('')
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [category, setCategory] = useState('')

  const maxWrong = 6

  const wordLists: Record<string, string[]> = {
    animals: ['ELEPHANT', 'GIRAFFE', 'PENGUIN', 'DOLPHIN', 'KANGAROO', 'BUTTERFLY', 'OCTOPUS', 'CROCODILE'],
    countries: ['AUSTRALIA', 'BRAZIL', 'CANADA', 'GERMANY', 'JAPAN', 'MEXICO', 'SWEDEN', 'THAILAND'],
    fruits: ['STRAWBERRY', 'PINEAPPLE', 'WATERMELON', 'BLUEBERRY', 'RASPBERRY', 'BLACKBERRY', 'GRAPEFRUIT'],
    sports: ['BASKETBALL', 'FOOTBALL', 'VOLLEYBALL', 'SWIMMING', 'GYMNASTICS', 'BADMINTON', 'WRESTLING'],
    movies: ['TITANIC', 'AVATAR', 'INCEPTION', 'GLADIATOR', 'FROZEN', 'SHREK', 'MATRIX'],
  }

  const startNewGame = (cat?: string) => {
    const selectedCategory = cat || Object.keys(wordLists)[Math.floor(Math.random() * Object.keys(wordLists).length)]
    const words = wordLists[selectedCategory]
    const selectedWord = words[Math.floor(Math.random() * words.length)]

    setWord(selectedWord)
    setCategory(selectedCategory)
    setGuessedLetters(new Set())
    setWrongGuesses(0)
    setGameOver(false)
    setWon(false)
  }

  useEffect(() => {
    startNewGame()
  }, [])

  const handleGuess = (letter: string) => {
    if (gameOver || guessedLetters.has(letter)) return

    const newGuessed = new Set(guessedLetters)
    newGuessed.add(letter)
    setGuessedLetters(newGuessed)

    if (!word.includes(letter)) {
      const newWrong = wrongGuesses + 1
      setWrongGuesses(newWrong)
      if (newWrong >= maxWrong) {
        setGameOver(true)
        setWon(false)
      }
    } else {
      // Check if won
      const isWon = word.split('').every(l => newGuessed.has(l))
      if (isWon) {
        setGameOver(true)
        setWon(true)
      }
    }
  }

  const displayWord = word.split('').map(letter =>
    guessedLetters.has(letter) ? letter : '_'
  ).join(' ')

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const hangmanParts = [
    // Head
    <circle key="head" cx="50" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="2" />,
    // Body
    <line key="body" x1="50" y1="40" x2="50" y2="70" stroke="currentColor" strokeWidth="2" />,
    // Left arm
    <line key="leftArm" x1="50" y1="50" x2="30" y2="60" stroke="currentColor" strokeWidth="2" />,
    // Right arm
    <line key="rightArm" x1="50" y1="50" x2="70" y2="60" stroke="currentColor" strokeWidth="2" />,
    // Left leg
    <line key="leftLeg" x1="50" y1="70" x2="30" y2="90" stroke="currentColor" strokeWidth="2" />,
    // Right leg
    <line key="rightLeg" x1="50" y1="70" x2="70" y2="90" stroke="currentColor" strokeWidth="2" />,
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 flex-wrap">
          {Object.keys(wordLists).map(cat => (
            <button
              key={cat}
              onClick={() => startNewGame(cat)}
              className={`px-3 py-1 rounded text-sm capitalize ${
                category === cat ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-slate-500 capitalize">
            {t('tools.hangmanGame.category')}: {category}
          </span>
          <span className="text-sm text-slate-500">
            {t('tools.hangmanGame.wrongGuesses')}: {wrongGuesses}/{maxWrong}
          </span>
        </div>

        <div className="flex justify-center mb-4">
          <svg viewBox="0 0 100 110" className="w-32 h-32 text-slate-800">
            {/* Gallows */}
            <line x1="10" y1="100" x2="90" y2="100" stroke="currentColor" strokeWidth="3" />
            <line x1="30" y1="100" x2="30" y2="10" stroke="currentColor" strokeWidth="3" />
            <line x1="30" y1="10" x2="50" y2="10" stroke="currentColor" strokeWidth="3" />
            <line x1="50" y1="10" x2="50" y2="20" stroke="currentColor" strokeWidth="2" />
            {/* Person parts based on wrong guesses */}
            {hangmanParts.slice(0, wrongGuesses)}
          </svg>
        </div>

        <div className="text-center mb-4">
          <div className="text-3xl font-mono tracking-widest mb-2">{displayWord}</div>
          <div className="text-sm text-slate-500">
            {word.length} {t('tools.hangmanGame.letters')}
          </div>
        </div>

        {gameOver && (
          <div className={`p-4 rounded-lg text-center mb-4 ${won ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="text-2xl mb-1">{won ? '🎉' : '😢'}</div>
            <div className="font-bold">
              {won ? t('tools.hangmanGame.youWon') : t('tools.hangmanGame.gameOver')}
            </div>
            {!won && (
              <div className="text-sm mt-1">
                {t('tools.hangmanGame.theWord')}: <span className="font-bold">{word}</span>
              </div>
            )}
            <button
              onClick={() => startNewGame()}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t('tools.hangmanGame.playAgain')}
            </button>
          </div>
        )}

        {!gameOver && (
          <div className="grid grid-cols-7 gap-2">
            {alphabet.map(letter => (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={guessedLetters.has(letter)}
                className={`py-2 rounded font-bold text-sm ${
                  guessedLetters.has(letter)
                    ? word.includes(letter)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.hangmanGame.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.hangmanGame.instruction1')}</li>
          <li>• {t('tools.hangmanGame.instruction2')}</li>
          <li>• {t('tools.hangmanGame.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
