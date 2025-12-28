import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type GameState = 'waiting' | 'ready' | 'go' | 'result' | 'tooEarly'

export default function ReactionTimeTest() {
  const { t } = useTranslation()
  const [gameState, setGameState] = useState<GameState>('waiting')
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [results, setResults] = useState<number[]>([])
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startTest = () => {
    setGameState('ready')
    setReactionTime(null)

    // Random delay between 1.5 and 5 seconds
    const delay = Math.random() * 3500 + 1500
    timeoutRef.current = setTimeout(() => {
      setGameState('go')
      setStartTime(Date.now())
    }, delay)
  }

  const handleClick = () => {
    if (gameState === 'waiting' || gameState === 'result' || gameState === 'tooEarly') {
      startTest()
    } else if (gameState === 'ready') {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setGameState('tooEarly')
    } else if (gameState === 'go') {
      const time = Date.now() - startTime
      setReactionTime(time)
      setResults(prev => [...prev, time].slice(-10))
      setGameState('result')
    }
  }

  const getAverageTime = () => {
    if (results.length === 0) return 0
    return Math.round(results.reduce((a, b) => a + b, 0) / results.length)
  }

  const getBestTime = () => {
    if (results.length === 0) return 0
    return Math.min(...results)
  }

  const getReactionRating = (time: number) => {
    if (time < 200) return { text: t('tools.reactionTimeTest.incredible'), color: 'text-purple-600' }
    if (time < 250) return { text: t('tools.reactionTimeTest.excellent'), color: 'text-blue-600' }
    if (time < 300) return { text: t('tools.reactionTimeTest.good'), color: 'text-green-600' }
    if (time < 350) return { text: t('tools.reactionTimeTest.average'), color: 'text-yellow-600' }
    return { text: t('tools.reactionTimeTest.slow'), color: 'text-red-600' }
  }

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'ready': return 'bg-red-500'
      case 'go': return 'bg-green-500'
      case 'tooEarly': return 'bg-yellow-500'
      default: return 'bg-blue-500'
    }
  }

  return (
    <div className="space-y-4">
      <div
        onClick={handleClick}
        className={`card p-8 cursor-pointer select-none transition-colors ${getBackgroundColor()} text-white text-center min-h-[300px] flex flex-col items-center justify-center`}
      >
        {gameState === 'waiting' && (
          <>
            <div className="text-6xl mb-4">⚡</div>
            <h2 className="text-2xl font-bold mb-2">{t('tools.reactionTimeTest.clickToStart')}</h2>
            <p className="opacity-80">{t('tools.reactionTimeTest.testReaction')}</p>
          </>
        )}

        {gameState === 'ready' && (
          <>
            <div className="text-6xl mb-4">🔴</div>
            <h2 className="text-2xl font-bold mb-2">{t('tools.reactionTimeTest.waitForGreen')}</h2>
            <p className="opacity-80">{t('tools.reactionTimeTest.dontClickYet')}</p>
          </>
        )}

        {gameState === 'go' && (
          <>
            <div className="text-6xl mb-4">🟢</div>
            <h2 className="text-3xl font-bold">{t('tools.reactionTimeTest.clickNow')}</h2>
          </>
        )}

        {gameState === 'tooEarly' && (
          <>
            <div className="text-6xl mb-4">😬</div>
            <h2 className="text-2xl font-bold mb-2">{t('tools.reactionTimeTest.tooEarly')}</h2>
            <p className="opacity-80">{t('tools.reactionTimeTest.clickToTryAgain')}</p>
          </>
        )}

        {gameState === 'result' && reactionTime && (
          <>
            <div className="text-6xl mb-4">⏱️</div>
            <h2 className="text-4xl font-bold mb-2">{reactionTime} ms</h2>
            <p className={`text-xl font-medium ${getReactionRating(reactionTime).color.replace('text', 'text-white')}`}>
              {getReactionRating(reactionTime).text}
            </p>
            <p className="mt-4 opacity-80">{t('tools.reactionTimeTest.clickToTryAgain')}</p>
          </>
        )}
      </div>

      {results.length > 0 && (
        <div className="card p-4">
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div className="p-3 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{getAverageTime()} ms</div>
              <div className="text-sm text-slate-500">{t('tools.reactionTimeTest.average')}</div>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">{getBestTime()} ms</div>
              <div className="text-sm text-slate-500">{t('tools.reactionTimeTest.best')}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">{results.length}</div>
              <div className="text-sm text-slate-500">{t('tools.reactionTimeTest.attempts')}</div>
            </div>
          </div>

          <h3 className="font-medium mb-2">{t('tools.reactionTimeTest.recentAttempts')}</h3>
          <div className="flex flex-wrap gap-2">
            {results.map((time, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded text-sm font-mono ${
                  time === getBestTime() ? 'bg-green-100 text-green-700' : 'bg-slate-100'
                }`}
              >
                {time}ms
              </span>
            ))}
          </div>

          <button
            onClick={() => setResults([])}
            className="mt-4 w-full py-2 bg-slate-100 rounded hover:bg-slate-200 text-sm"
          >
            {t('tools.reactionTimeTest.clearResults')}
          </button>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.reactionTimeTest.benchmarks')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-white rounded flex justify-between">
            <span className="text-purple-600">{'< 200ms'}</span>
            <span>{t('tools.reactionTimeTest.incredible')}</span>
          </div>
          <div className="p-2 bg-white rounded flex justify-between">
            <span className="text-blue-600">200-250ms</span>
            <span>{t('tools.reactionTimeTest.excellent')}</span>
          </div>
          <div className="p-2 bg-white rounded flex justify-between">
            <span className="text-green-600">250-300ms</span>
            <span>{t('tools.reactionTimeTest.good')}</span>
          </div>
          <div className="p-2 bg-white rounded flex justify-between">
            <span className="text-yellow-600">300-350ms</span>
            <span>{t('tools.reactionTimeTest.average')}</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {t('tools.reactionTimeTest.averageHuman')}
        </p>
      </div>
    </div>
  )
}
