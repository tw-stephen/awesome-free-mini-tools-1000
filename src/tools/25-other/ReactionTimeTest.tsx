import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function ReactionTimeTest() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<'waiting' | 'ready' | 'click' | 'tooSoon' | 'result'>('waiting')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [attempts, setAttempts] = useState<number[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const startTest = () => {
    setStatus('ready')
    const delay = Math.random() * 3000 + 2000 // 2-5 seconds
    timeoutRef.current = setTimeout(() => {
      setStatus('click')
      setStartTime(Date.now())
    }, delay)
  }

  const handleClick = () => {
    if (status === 'waiting') {
      startTest()
    } else if (status === 'ready') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setStatus('tooSoon')
    } else if (status === 'click') {
      const time = Date.now() - (startTime || 0)
      setReactionTime(time)
      setAttempts(prev => [...prev, time])
      setStatus('result')
    } else if (status === 'tooSoon' || status === 'result') {
      setStatus('waiting')
    }
  }

  const getAverageTime = () => {
    if (attempts.length === 0) return 0
    return Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
  }

  const getBestTime = () => {
    if (attempts.length === 0) return 0
    return Math.min(...attempts)
  }

  const clearResults = () => {
    setAttempts([])
    setStatus('waiting')
  }

  const getRating = (time: number) => {
    if (time < 200) return { label: 'Incredible!', color: 'text-purple-600', bg: 'bg-purple-100' }
    if (time < 250) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' }
    if (time < 300) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (time < 400) return { label: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { label: 'Keep practicing', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'waiting':
        return {
          bg: 'bg-blue-500',
          text: t('tools.reactionTimeTest.clickToStart'),
          subtext: t('tools.reactionTimeTest.waitForGreen'),
        }
      case 'ready':
        return {
          bg: 'bg-red-500',
          text: t('tools.reactionTimeTest.wait'),
          subtext: t('tools.reactionTimeTest.waitForGreenBg'),
        }
      case 'click':
        return {
          bg: 'bg-green-500',
          text: t('tools.reactionTimeTest.clickNow'),
          subtext: '',
        }
      case 'tooSoon':
        return {
          bg: 'bg-orange-500',
          text: t('tools.reactionTimeTest.tooSoon'),
          subtext: t('tools.reactionTimeTest.clickToTryAgain'),
        }
      case 'result':
        return {
          bg: getRating(reactionTime || 0).bg,
          text: `${reactionTime} ms`,
          subtext: getRating(reactionTime || 0).label,
        }
      default:
        return { bg: 'bg-slate-500', text: '', subtext: '' }
    }
  }

  const config = getStatusConfig()

  return (
    <div className="space-y-4">
      <button
        onClick={handleClick}
        className={`w-full h-64 rounded-xl transition-colors ${config.bg} flex flex-col items-center justify-center`}
      >
        <div className={`text-4xl font-bold ${status === 'result' ? getRating(reactionTime || 0).color : 'text-white'}`}>
          {config.text}
        </div>
        {config.subtext && (
          <div className={`text-lg mt-2 ${status === 'result' ? getRating(reactionTime || 0).color : 'text-white/80'}`}>
            {config.subtext}
          </div>
        )}
      </button>

      {attempts.length > 0 && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.reactionTimeTest.statistics')}</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="text-2xl font-bold text-blue-600">{getAverageTime()}</div>
                <div className="text-xs text-slate-500">{t('tools.reactionTimeTest.average')} (ms)</div>
              </div>
              <div className="p-3 bg-green-50 rounded text-center">
                <div className="text-2xl font-bold text-green-600">{getBestTime()}</div>
                <div className="text-xs text-slate-500">{t('tools.reactionTimeTest.best')} (ms)</div>
              </div>
              <div className="p-3 bg-purple-50 rounded text-center">
                <div className="text-2xl font-bold text-purple-600">{attempts.length}</div>
                <div className="text-xs text-slate-500">{t('tools.reactionTimeTest.attempts')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-slate-700">{t('tools.reactionTimeTest.history')}</h3>
              <button
                onClick={clearResults}
                className="text-xs text-red-500 hover:text-red-700"
              >
                {t('tools.reactionTimeTest.clear')}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {attempts.map((time, i) => {
                const rating = getRating(time)
                return (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-sm ${rating.bg} ${rating.color}`}
                  >
                    {time}ms
                  </span>
                )
              })}
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.reactionTimeTest.benchmarks')}</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
            <span className="text-purple-700">{'< 200ms'}</span>
            <span className="text-sm text-purple-600">Incredible</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-green-50 rounded">
            <span className="text-green-700">200-250ms</span>
            <span className="text-sm text-green-600">Excellent</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
            <span className="text-blue-700">250-300ms</span>
            <span className="text-sm text-blue-600">Good</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
            <span className="text-yellow-700">300-400ms</span>
            <span className="text-sm text-yellow-600">Average</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-red-50 rounded">
            <span className="text-red-700">{'> 400ms'}</span>
            <span className="text-sm text-red-600">Below average</span>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.reactionTimeTest.info')}</h3>
        <p className="text-sm text-slate-600">
          {t('tools.reactionTimeTest.infoText')}
        </p>
      </div>
    </div>
  )
}
