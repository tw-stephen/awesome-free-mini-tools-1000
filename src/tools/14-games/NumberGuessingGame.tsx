import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function NumberGuessingGame() {
  const { t } = useTranslation()
  const [targetNumber, setTargetNumber] = useState(0)
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [history, setHistory] = useState<{ guess: number; hint: string }[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [range, setRange] = useState({ min: 1, max: 100 })

  const difficultySettings = {
    easy: { min: 1, max: 50, maxAttempts: 10 },
    medium: { min: 1, max: 100, maxAttempts: 7 },
    hard: { min: 1, max: 500, maxAttempts: 9 },
  }

  const startNewGame = () => {
    const settings = difficultySettings[difficulty]
    const target = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min
    setTargetNumber(target)
    setRange({ min: settings.min, max: settings.max })
    setGuess('')
    setMessage('')
    setAttempts(0)
    setHistory([])
    setGameOver(false)
  }

  useEffect(() => {
    startNewGame()
  }, [difficulty])

  const handleGuess = () => {
    const guessNum = parseInt(guess)
    if (isNaN(guessNum) || guessNum < range.min || guessNum > range.max) {
      setMessage(t('tools.numberGuessingGame.invalidRange', { min: range.min, max: range.max }))
      return
    }

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    let hint: string
    if (guessNum === targetNumber) {
      hint = t('tools.numberGuessingGame.correct')
      setMessage(t('tools.numberGuessingGame.youWon', { attempts: newAttempts }))
      setGameOver(true)
    } else if (guessNum < targetNumber) {
      const diff = targetNumber - guessNum
      if (diff > 50) hint = t('tools.numberGuessingGame.muchHigher')
      else if (diff > 20) hint = t('tools.numberGuessingGame.higher')
      else if (diff > 5) hint = t('tools.numberGuessingGame.slightlyHigher')
      else hint = t('tools.numberGuessingGame.almostHigher')
      setMessage(hint)
    } else {
      const diff = guessNum - targetNumber
      if (diff > 50) hint = t('tools.numberGuessingGame.muchLower')
      else if (diff > 20) hint = t('tools.numberGuessingGame.lower')
      else if (diff > 5) hint = t('tools.numberGuessingGame.slightlyLower')
      else hint = t('tools.numberGuessingGame.almostLower')
      setMessage(hint)
    }

    setHistory(prev => [{ guess: guessNum, hint }, ...prev])
    setGuess('')

    // Check if out of attempts
    const maxAttempts = difficultySettings[difficulty].maxAttempts
    if (newAttempts >= maxAttempts && guessNum !== targetNumber) {
      setMessage(t('tools.numberGuessingGame.gameOver', { number: targetNumber }))
      setGameOver(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGuess()
    }
  }

  const maxAttempts = difficultySettings[difficulty].maxAttempts
  const attemptsLeft = maxAttempts - attempts

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['easy', 'medium', 'hard'] as const).map(level => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`flex-1 py-2 rounded capitalize ${
                difficulty === level ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {t(`tools.numberGuessingGame.${level}`)}
            </button>
          ))}
        </div>
        <div className="text-center text-sm text-slate-500">
          {t('tools.numberGuessingGame.rangeInfo', { min: range.min, max: range.max })}
          {' • '}
          {t('tools.numberGuessingGame.attemptsAllowed', { max: maxAttempts })}
        </div>
      </div>

      <div className="card p-4">
        <div className="text-center mb-4">
          <div className="text-6xl mb-2">🎯</div>
          <h3 className="text-lg font-medium">
            {t('tools.numberGuessingGame.guessNumber')}
          </h3>
          <p className="text-slate-500">
            {t('tools.numberGuessingGame.between', { min: range.min, max: range.max })}
          </p>
        </div>

        {!gameOver ? (
          <>
            <div className="flex gap-2 mb-4">
              <input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={handleKeyPress}
                min={range.min}
                max={range.max}
                placeholder={t('tools.numberGuessingGame.enterGuess')}
                className="flex-1 px-4 py-3 border border-slate-300 rounded text-lg text-center"
              />
              <button
                onClick={handleGuess}
                className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
              >
                {t('tools.numberGuessingGame.guess')}
              </button>
            </div>

            <div className="flex justify-between items-center text-sm text-slate-500">
              <span>{t('tools.numberGuessingGame.attempts')}: {attempts}</span>
              <span className={attemptsLeft <= 2 ? 'text-red-500 font-bold' : ''}>
                {t('tools.numberGuessingGame.attemptsLeft')}: {attemptsLeft}
              </span>
            </div>
          </>
        ) : (
          <div className="text-center">
            <button
              onClick={startNewGame}
              className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
            >
              {t('tools.numberGuessingGame.playAgain')}
            </button>
          </div>
        )}

        {message && (
          <div className={`mt-4 p-4 rounded-lg text-center font-medium ${
            message.includes(t('tools.numberGuessingGame.correct')) || message.includes('won')
              ? 'bg-green-100 text-green-700'
              : message.includes('Game over')
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
          }`}>
            {message}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.numberGuessingGame.guessHistory')}</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.map((item, i) => (
              <div
                key={i}
                className={`flex justify-between items-center p-2 rounded ${
                  item.hint.includes('Correct') || item.hint.includes('正確')
                    ? 'bg-green-50'
                    : item.hint.includes('higher') || item.hint.includes('高')
                      ? 'bg-blue-50'
                      : 'bg-orange-50'
                }`}
              >
                <span className="font-mono font-bold text-lg">{item.guess}</span>
                <span className="text-sm">{item.hint}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.numberGuessingGame.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.numberGuessingGame.tip1')}</li>
          <li>• {t('tools.numberGuessingGame.tip2')}</li>
          <li>• {t('tools.numberGuessingGame.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
