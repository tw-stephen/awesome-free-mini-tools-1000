import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function WhackAMole() {
  const { t } = useTranslation()
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeMole, setActiveMole] = useState<number | null>(null)
  const [highScore, setHighScore] = useState(0)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const moleRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const difficultySettings = {
    easy: { showTime: 1200, hideTime: 800 },
    medium: { showTime: 800, hideTime: 600 },
    hard: { showTime: 500, hideTime: 400 },
  }

  const startGame = () => {
    setScore(0)
    setTimeLeft(30)
    setIsPlaying(true)
    setActiveMole(null)

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    showMole()
  }

  const endGame = () => {
    setIsPlaying(false)
    setActiveMole(null)
    if (timerRef.current) clearInterval(timerRef.current)
    if (moleRef.current) clearTimeout(moleRef.current)
    if (score > highScore) setHighScore(score)
  }

  const showMole = () => {
    if (!isPlaying) return

    const settings = difficultySettings[difficulty]
    const randomHole = Math.floor(Math.random() * 9)
    setActiveMole(randomHole)

    moleRef.current = setTimeout(() => {
      setActiveMole(null)
      moleRef.current = setTimeout(showMole, settings.hideTime)
    }, settings.showTime)
  }

  useEffect(() => {
    if (isPlaying && activeMole === null) {
      const settings = difficultySettings[difficulty]
      moleRef.current = setTimeout(showMole, settings.hideTime)
    }
    return () => {
      if (moleRef.current) clearTimeout(moleRef.current)
    }
  }, [isPlaying])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (moleRef.current) clearTimeout(moleRef.current)
    }
  }, [])

  const whackMole = (holeIndex: number) => {
    if (activeMole === holeIndex) {
      setScore(prev => prev + 1)
      setActiveMole(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['easy', 'medium', 'hard'] as const).map(level => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              disabled={isPlaying}
              className={`flex-1 py-2 rounded capitalize ${
                difficulty === level ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              } disabled:opacity-50`}
            >
              {t(`tools.whackAMole.${level}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.whackAMole.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{highScore}</div>
            <div className="text-sm text-slate-500">{t('tools.whackAMole.highScore')}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-orange-600'}`}>
              {timeLeft}s
            </div>
            <div className="text-sm text-slate-500">{t('tools.whackAMole.time')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        {!isPlaying && timeLeft === 30 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🐹</div>
            <h2 className="text-xl font-bold mb-2">{t('tools.whackAMole.title')}</h2>
            <p className="text-slate-500 mb-4">{t('tools.whackAMole.description')}</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.whackAMole.startGame')}
            </button>
          </div>
        )}

        {(isPlaying || timeLeft < 30) && (
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            {Array.from({ length: 9 }, (_, i) => (
              <button
                key={i}
                onClick={() => whackMole(i)}
                disabled={!isPlaying}
                className={`aspect-square rounded-full text-4xl transition-all ${
                  activeMole === i
                    ? 'bg-brown-400 transform scale-110'
                    : 'bg-slate-200'
                }`}
                style={{ backgroundColor: activeMole === i ? '#8B4513' : undefined }}
              >
                {activeMole === i ? '🐹' : '🕳️'}
              </button>
            ))}
          </div>
        )}

        {!isPlaying && timeLeft === 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
            <div className="text-4xl mb-2">🎮</div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">
              {t('tools.whackAMole.gameOver')}
            </h3>
            <p className="text-blue-600 text-lg">{t('tools.whackAMole.finalScore', { score })}</p>
            {score === highScore && score > 0 && (
              <p className="text-green-600 font-bold">🏆 {t('tools.whackAMole.newHighScore')}</p>
            )}
            <button
              onClick={startGame}
              className="mt-4 px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.whackAMole.playAgain')}
            </button>
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.whackAMole.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.whackAMole.instruction1')}</li>
          <li>• {t('tools.whackAMole.instruction2')}</li>
          <li>• {t('tools.whackAMole.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
