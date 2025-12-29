import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

type GameMode = '10sec' | '30sec' | '100clicks'

export default function SpeedClickerGame() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<GameMode>('10sec')
  const [clicks, setClicks] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCountdown, setIsCountdown] = useState(false)
  const [countdownValue, setCountdownValue] = useState(3)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [cps, setCps] = useState(0)
  const [highScores, setHighScores] = useState<Record<GameMode, number>>({
    '10sec': 0,
    '30sec': 0,
    '100clicks': Infinity
  })

  const modeSettings = {
    '10sec': { time: 10, target: null, label: '10 Seconds' },
    '30sec': { time: 30, target: null, label: '30 Seconds' },
    '100clicks': { time: null, target: 100, label: '100 Clicks' }
  }

  const startCountdown = () => {
    setIsCountdown(true)
    setCountdownValue(3)
    setClicks(0)
    setCps(0)
    setEndTime(null)
  }

  useEffect(() => {
    let timer: number
    if (isCountdown && countdownValue > 0) {
      timer = window.setTimeout(() => {
        setCountdownValue(prev => prev - 1)
      }, 1000)
    } else if (isCountdown && countdownValue === 0) {
      setIsCountdown(false)
      setIsPlaying(true)
      setStartTime(Date.now())
      if (mode !== '100clicks') {
        setTimeLeft(modeSettings[mode].time!)
      }
    }
    return () => clearTimeout(timer)
  }, [isCountdown, countdownValue, mode])

  useEffect(() => {
    let timer: number
    if (isPlaying && mode !== '100clicks' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, timeLeft, mode])

  const endGame = useCallback(() => {
    setIsPlaying(false)
    const end = Date.now()
    setEndTime(end)

    if (mode === '100clicks' && startTime) {
      const timeInSeconds = (end - startTime) / 1000
      setCps(Number((100 / timeInSeconds).toFixed(2)))
      if (timeInSeconds < highScores['100clicks']) {
        setHighScores(prev => ({ ...prev, '100clicks': timeInSeconds }))
      }
    } else if (startTime) {
      const timeInSeconds = (end - startTime) / 1000
      const clicksPerSecond = Number((clicks / timeInSeconds).toFixed(2))
      setCps(clicksPerSecond)
      if (clicks > highScores[mode]) {
        setHighScores(prev => ({ ...prev, [mode]: clicks }))
      }
    }
  }, [mode, startTime, clicks, highScores])

  useEffect(() => {
    if (mode === '100clicks' && clicks >= 100 && isPlaying) {
      endGame()
    }
  }, [clicks, mode, isPlaying, endGame])

  const handleClick = () => {
    if (!isPlaying) return
    setClicks(prev => prev + 1)
  }

  const getButtonContent = () => {
    if (isCountdown) {
      return <span className="text-6xl font-bold">{countdownValue}</span>
    }
    if (isPlaying) {
      return (
        <div>
          <div className="text-6xl font-bold">{clicks}</div>
          <div className="text-lg text-blue-100">{t('tools.speedClickerGame.clickNow')}</div>
        </div>
      )
    }
    if (endTime) {
      return (
        <div>
          <div className="text-4xl font-bold mb-2">{cps}</div>
          <div className="text-lg text-blue-100">{t('tools.speedClickerGame.cps')}</div>
        </div>
      )
    }
    return (
      <div>
        <div className="text-2xl font-bold">{t('tools.speedClickerGame.startGame')}</div>
        <div className="text-sm text-blue-100 mt-2">{t('tools.speedClickerGame.clickToStart')}</div>
      </div>
    )
  }

  const formatTime = (seconds: number): string => {
    if (seconds === Infinity) return '-'
    return `${seconds.toFixed(2)}s`
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(Object.keys(modeSettings) as GameMode[]).map(m => (
            <button
              key={m}
              onClick={() => {
                if (!isPlaying) {
                  setMode(m)
                  setClicks(0)
                  setEndTime(null)
                }
              }}
              disabled={isPlaying}
              className={`flex-1 py-2 rounded text-sm ${
                mode === m ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {modeSettings[m].label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{clicks}</div>
            <div className="text-sm text-slate-500">{t('tools.speedClickerGame.clicks')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              {mode === '100clicks' && endTime && startTime
                ? formatTime((endTime - startTime) / 1000)
                : `${timeLeft}s`}
            </div>
            <div className="text-sm text-slate-500">{t('tools.speedClickerGame.time')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">
              {mode === '100clicks'
                ? formatTime(highScores['100clicks'])
                : highScores[mode]}
            </div>
            <div className="text-sm text-slate-500">{t('tools.speedClickerGame.best')}</div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <button
          onClick={isPlaying ? handleClick : startCountdown}
          disabled={isCountdown}
          className={`w-full aspect-square max-w-xs mx-auto rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-blue-500 hover:bg-blue-600 active:scale-95 active:bg-blue-700'
              : isCountdown
                ? 'bg-yellow-500'
                : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {getButtonContent()}
        </button>

        {mode === '100clicks' && isPlaying && (
          <div className="mt-4">
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${(clicks / 100) * 100}%` }}
              />
            </div>
            <div className="text-center text-sm text-slate-500 mt-1">
              {clicks}/100 {t('tools.speedClickerGame.clicks')}
            </div>
          </div>
        )}
      </div>

      {endTime && !isPlaying && (
        <div className="card p-4 bg-green-50 text-center">
          <h3 className="text-xl font-bold text-green-700 mb-2">
            {t('tools.speedClickerGame.results')}
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-white rounded">
              <div className="text-2xl font-bold text-blue-600">{clicks}</div>
              <div className="text-sm text-slate-500">{t('tools.speedClickerGame.totalClicks')}</div>
            </div>
            <div className="p-3 bg-white rounded">
              <div className="text-2xl font-bold text-green-600">{cps}</div>
              <div className="text-sm text-slate-500">{t('tools.speedClickerGame.cps')}</div>
            </div>
          </div>
          <button
            onClick={startCountdown}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('tools.speedClickerGame.playAgain')}
          </button>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.speedClickerGame.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.speedClickerGame.tip1')}</li>
          <li>* {t('tools.speedClickerGame.tip2')}</li>
          <li>* {t('tools.speedClickerGame.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
