import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

type GameState = 'waiting' | 'ready' | 'go' | 'tooEarly' | 'result'

export default function ReflexTestGame() {
  const { t } = useTranslation()
  const [gameState, setGameState] = useState<GameState>('waiting')
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [attempts, setAttempts] = useState<number[]>([])
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [timerId, setTimerId] = useState<number | null>(null)

  const startGame = useCallback(() => {
    setGameState('ready')
    setReactionTime(null)

    // Random delay between 1 and 5 seconds
    const delay = Math.random() * 4000 + 1000
    const id = window.setTimeout(() => {
      setGameState('go')
      setStartTime(Date.now())
    }, delay)

    setTimerId(id)
  }, [])

  const handleClick = useCallback(() => {
    if (gameState === 'waiting') {
      startGame()
    } else if (gameState === 'ready') {
      // Clicked too early
      if (timerId) clearTimeout(timerId)
      setGameState('tooEarly')
    } else if (gameState === 'go' && startTime) {
      const reaction = Date.now() - startTime
      setReactionTime(reaction)
      setAttempts(prev => [...prev, reaction])
      setGameState('result')

      if (!bestTime || reaction < bestTime) {
        setBestTime(reaction)
      }
    } else if (gameState === 'tooEarly' || gameState === 'result') {
      startGame()
    }
  }, [gameState, startTime, timerId, bestTime, startGame])

  useEffect(() => {
    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [timerId])

  const getAverageTime = (): number | null => {
    if (attempts.length === 0) return null
    return Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
  }

  const getBackgroundColor = (): string => {
    switch (gameState) {
      case 'waiting':
        return 'bg-blue-500'
      case 'ready':
        return 'bg-red-500'
      case 'go':
        return 'bg-green-500'
      case 'tooEarly':
        return 'bg-orange-500'
      case 'result':
        return 'bg-blue-500'
      default:
        return 'bg-blue-500'
    }
  }

  const getMessage = (): string => {
    switch (gameState) {
      case 'waiting':
        return t('tools.reflexTestGame.clickToStart')
      case 'ready':
        return t('tools.reflexTestGame.waitForGreen')
      case 'go':
        return t('tools.reflexTestGame.clickNow')
      case 'tooEarly':
        return t('tools.reflexTestGame.tooEarly')
      case 'result':
        return t('tools.reflexTestGame.yourTime')
      default:
        return ''
    }
  }

  const getReactionRating = (time: number): string => {
    if (time < 200) return t('tools.reflexTestGame.incredible')
    if (time < 250) return t('tools.reflexTestGame.excellent')
    if (time < 300) return t('tools.reflexTestGame.great')
    if (time < 350) return t('tools.reflexTestGame.good')
    if (time < 400) return t('tools.reflexTestGame.average')
    return t('tools.reflexTestGame.slow')
  }

  const averageTime = getAverageTime()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {bestTime ? `${bestTime}ms` : '-'}
            </div>
            <div className="text-sm text-slate-500">{t('tools.reflexTestGame.best')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              {averageTime ? `${averageTime}ms` : '-'}
            </div>
            <div className="text-sm text-slate-500">{t('tools.reflexTestGame.average')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{attempts.length}</div>
            <div className="text-sm text-slate-500">{t('tools.reflexTestGame.attempts')}</div>
          </div>
        </div>
      </div>

      <button
        onClick={handleClick}
        className={`w-full min-h-[300px] rounded-xl text-white transition-all cursor-pointer ${getBackgroundColor()}`}
      >
        <div className="text-center p-8">
          {gameState === 'result' && reactionTime ? (
            <>
              <div className="text-6xl font-bold mb-2">{reactionTime}ms</div>
              <div className="text-2xl mb-4">{getReactionRating(reactionTime)}</div>
              <div className="text-lg opacity-80">{t('tools.reflexTestGame.clickToRetry')}</div>
            </>
          ) : gameState === 'tooEarly' ? (
            <>
              <div className="text-4xl mb-4">😅</div>
              <div className="text-2xl mb-2">{getMessage()}</div>
              <div className="text-lg opacity-80">{t('tools.reflexTestGame.clickToRetry')}</div>
            </>
          ) : gameState === 'go' ? (
            <>
              <div className="text-4xl mb-4">⚡</div>
              <div className="text-4xl font-bold">{getMessage()}</div>
            </>
          ) : gameState === 'ready' ? (
            <>
              <div className="text-4xl mb-4">🔴</div>
              <div className="text-2xl">{getMessage()}</div>
            </>
          ) : (
            <>
              <div className="text-4xl mb-4">🎯</div>
              <div className="text-2xl">{getMessage()}</div>
            </>
          )}
        </div>
      </button>

      {attempts.length > 0 && (
        <div className="card p-4">
          <h4 className="font-medium mb-3">{t('tools.reflexTestGame.history')}</h4>
          <div className="flex flex-wrap gap-2">
            {attempts.slice(-10).map((time, index) => (
              <div
                key={index}
                className={`px-3 py-1 rounded text-sm font-mono ${
                  time === bestTime
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {time}ms
              </div>
            ))}
          </div>
          {attempts.length > 0 && (
            <button
              onClick={() => {
                setAttempts([])
                setBestTime(null)
              }}
              className="mt-3 text-sm text-red-500 hover:text-red-600"
            >
              {t('tools.reflexTestGame.clearHistory')}
            </button>
          )}
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.reflexTestGame.reference')}</h4>
        <div className="text-sm text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span>{t('tools.reflexTestGame.incredible')}</span>
            <span className="font-mono">&lt; 200ms</span>
          </div>
          <div className="flex justify-between">
            <span>{t('tools.reflexTestGame.excellent')}</span>
            <span className="font-mono">200-250ms</span>
          </div>
          <div className="flex justify-between">
            <span>{t('tools.reflexTestGame.great')}</span>
            <span className="font-mono">250-300ms</span>
          </div>
          <div className="flex justify-between">
            <span>{t('tools.reflexTestGame.good')}</span>
            <span className="font-mono">300-350ms</span>
          </div>
          <div className="flex justify-between">
            <span>{t('tools.reflexTestGame.average')}</span>
            <span className="font-mono">350-400ms</span>
          </div>
        </div>
      </div>
    </div>
  )
}
