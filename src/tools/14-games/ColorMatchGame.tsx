import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface ColorWord {
  text: string
  color: string
}

export default function ColorMatchGame() {
  const { t } = useTranslation()
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [currentWord, setCurrentWord] = useState<ColorWord | null>(null)
  const [gameActive, setGameActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const colors = [
    { name: 'RED', hex: '#ef4444' },
    { name: 'BLUE', hex: '#3b82f6' },
    { name: 'GREEN', hex: '#22c55e' },
    { name: 'YELLOW', hex: '#eab308' },
    { name: 'PURPLE', hex: '#a855f7' },
    { name: 'ORANGE', hex: '#f97316' },
  ]

  const generateWord = (): ColorWord => {
    const textColor = colors[Math.floor(Math.random() * colors.length)]
    const displayColor = colors[Math.floor(Math.random() * colors.length)]
    return {
      text: textColor.name,
      color: displayColor.hex,
    }
  }

  const startGame = () => {
    setScore(0)
    setTimeLeft(30)
    setGameActive(true)
    setFeedback(null)
    setCurrentWord(generateWord())

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const endGame = () => {
    setGameActive(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    if (score > highScore) {
      setHighScore(score)
    }
  }

  const handleAnswer = (isMatch: boolean) => {
    if (!currentWord || !gameActive) return

    const actualMatch = currentWord.text === colors.find(c => c.hex === currentWord.color)?.name
    const isCorrect = isMatch === actualMatch

    if (isCorrect) {
      setScore(prev => prev + 1)
      setFeedback('correct')
    } else {
      setScore(prev => Math.max(0, prev - 1))
      setFeedback('wrong')
    }

    setTimeout(() => {
      setFeedback(null)
      setCurrentWord(generateWord())
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.colorMatchGame.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{highScore}</div>
            <div className="text-sm text-slate-500">{t('tools.colorMatchGame.highScore')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-purple-600'}`}>
              {timeLeft}s
            </div>
            <div className="text-sm text-slate-500">{t('tools.colorMatchGame.time')}</div>
          </div>
        </div>
      </div>

      <div className={`card p-8 text-center min-h-[250px] flex flex-col items-center justify-center ${
        feedback === 'correct' ? 'bg-green-50' :
        feedback === 'wrong' ? 'bg-red-50' : ''
      }`}>
        {!gameActive ? (
          <>
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-xl font-bold mb-2">{t('tools.colorMatchGame.title')}</h2>
            <p className="text-slate-500 mb-4">{t('tools.colorMatchGame.description')}</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.colorMatchGame.startGame')}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-2">
              {t('tools.colorMatchGame.doesColorMatch')}
            </p>
            <div
              className="text-6xl font-bold mb-6"
              style={{ color: currentWord?.color }}
            >
              {currentWord?.text}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className="px-8 py-4 bg-green-500 text-white rounded-lg font-bold text-xl hover:bg-green-600"
              >
                {t('tools.colorMatchGame.match')}
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="px-8 py-4 bg-red-500 text-white rounded-lg font-bold text-xl hover:bg-red-600"
              >
                {t('tools.colorMatchGame.noMatch')}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.colorMatchGame.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.colorMatchGame.instruction1')}</li>
          <li>• {t('tools.colorMatchGame.instruction2')}</li>
          <li>• {t('tools.colorMatchGame.instruction3')}</li>
        </ul>
      </div>

      <div className="card p-4">
        <h4 className="font-medium mb-2">{t('tools.colorMatchGame.example')}</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded text-center">
            <span className="text-2xl font-bold" style={{ color: '#ef4444' }}>RED</span>
            <p className="text-sm text-green-600 mt-1">✓ {t('tools.colorMatchGame.matchExample')}</p>
          </div>
          <div className="p-3 bg-red-50 rounded text-center">
            <span className="text-2xl font-bold" style={{ color: '#3b82f6' }}>RED</span>
            <p className="text-sm text-red-600 mt-1">✗ {t('tools.colorMatchGame.noMatchExample')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
