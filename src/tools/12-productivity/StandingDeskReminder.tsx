import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface PositionLog {
  date: string
  sittingMinutes: number
  standingMinutes: number
}

export default function StandingDeskReminder() {
  const { t } = useTranslation()
  const [position, setPosition] = useState<'sitting' | 'standing' | 'idle'>('idle')
  const [sitDuration, setSitDuration] = useState(30)
  const [standDuration, setStandDuration] = useState(15)
  const [timeLeft, setTimeLeft] = useState(0)
  const [todayStats, setTodayStats] = useState({ sitting: 0, standing: 0 })
  const [logs, setLogs] = useState<PositionLog[]>([])
  const [isEnabled, setIsEnabled] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const trackingRef = useRef<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('standing-desk-logs')
    if (saved) setLogs(JSON.parse(saved))

    const today = new Date().toISOString().split('T')[0]
    const savedStats = localStorage.getItem(`desk-stats-${today}`)
    if (savedStats) setTodayStats(JSON.parse(savedStats))
  }, [])

  useEffect(() => {
    if (isEnabled && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isEnabled && position !== 'idle') {
      playNotification()
      if (position === 'sitting') {
        setPosition('standing')
        setTimeLeft(standDuration * 60)
      } else {
        setPosition('sitting')
        setTimeLeft(sitDuration * 60)
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isEnabled, timeLeft, position, sitDuration, standDuration])

  useEffect(() => {
    if (isEnabled && position !== 'idle') {
      trackingRef.current = window.setInterval(() => {
        updateStats()
      }, 60000) // Update every minute
    }

    return () => {
      if (trackingRef.current) clearInterval(trackingRef.current)
    }
  }, [isEnabled, position])

  const playNotification = () => {
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 600
      oscillator.type = 'sine'
      gainNode.gain.value = 0.3

      oscillator.start()
      setTimeout(() => {
        oscillator.frequency.value = 800
        setTimeout(() => oscillator.stop(), 200)
      }, 200)
    } catch {
      // Audio not supported
    }
  }

  const updateStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const newStats = {
      sitting: todayStats.sitting + (position === 'sitting' ? 1 : 0),
      standing: todayStats.standing + (position === 'standing' ? 1 : 0)
    }
    setTodayStats(newStats)
    localStorage.setItem(`desk-stats-${today}`, JSON.stringify(newStats))

    // Update logs
    const existing = logs.find(l => l.date === today)
    let updated: PositionLog[]
    if (existing) {
      updated = logs.map(l =>
        l.date === today
          ? { ...l, sittingMinutes: newStats.sitting, standingMinutes: newStats.standing }
          : l
      )
    } else {
      updated = [...logs, { date: today, sittingMinutes: newStats.sitting, standingMinutes: newStats.standing }]
    }
    setLogs(updated)
    localStorage.setItem('standing-desk-logs', JSON.stringify(updated))
  }

  const start = (startPosition: 'sitting' | 'standing') => {
    setPosition(startPosition)
    setTimeLeft(startPosition === 'sitting' ? sitDuration * 60 : standDuration * 60)
    setIsEnabled(true)
  }

  const stop = () => {
    setIsEnabled(false)
    setPosition('idle')
    setTimeLeft(0)
  }

  const switchPosition = () => {
    if (position === 'sitting') {
      setPosition('standing')
      setTimeLeft(standDuration * 60)
    } else {
      setPosition('sitting')
      setTimeLeft(sitDuration * 60)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    const total = position === 'sitting' ? sitDuration * 60 : standDuration * 60
    return ((total - timeLeft) / total) * 100
  }

  const getStandingRatio = () => {
    const total = todayStats.sitting + todayStats.standing
    if (total === 0) return 0
    return Math.round((todayStats.standing / total) * 100)
  }

  const getWeekStats = () => {
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    return logs
      .filter(l => new Date(l.date) >= weekAgo)
      .reduce((sum, l) => ({
        sitting: sum.sitting + l.sittingMinutes,
        standing: sum.standing + l.standingMinutes
      }), { sitting: 0, standing: 0 })
  }

  const weekStats = getWeekStats()

  return (
    <div className="space-y-4">
      <div className="card p-6 text-center">
        <div className={`text-lg font-medium mb-2 ${
          position === 'standing' ? 'text-green-600' : position === 'sitting' ? 'text-blue-600' : 'text-slate-600'
        }`}>
          {position === 'standing' && t('tools.standingDeskReminder.standingMode')}
          {position === 'sitting' && t('tools.standingDeskReminder.sittingMode')}
          {position === 'idle' && t('tools.standingDeskReminder.idle')}
        </div>

        <div className="relative w-48 h-48 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-200"
            />
            {isEnabled && (
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className={position === 'standing' ? 'text-green-500' : 'text-blue-500'}
                strokeDasharray={553}
                strokeDashoffset={553 - (553 * getProgress()) / 100}
                strokeLinecap="round"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl mb-2">
              {position === 'standing' ? '🧍' : position === 'sitting' ? '🪑' : '⏸️'}
            </div>
            <div className="text-3xl font-mono font-bold">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {!isEnabled ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600 block mb-1">
                  {t('tools.standingDeskReminder.sitDuration')}
                </label>
                <select
                  value={sitDuration}
                  onChange={(e) => setSitDuration(parseInt(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded"
                >
                  {[15, 20, 25, 30, 45, 60].map(m => (
                    <option key={m} value={m}>{m} min</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">
                  {t('tools.standingDeskReminder.standDuration')}
                </label>
                <select
                  value={standDuration}
                  onChange={(e) => setStandDuration(parseInt(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded"
                >
                  {[10, 15, 20, 30].map(m => (
                    <option key={m} value={m}>{m} min</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => start('sitting')}
                className="py-3 bg-blue-500 text-white rounded-lg font-medium"
              >
                {t('tools.standingDeskReminder.startSitting')}
              </button>
              <button
                onClick={() => start('standing')}
                className="py-3 bg-green-500 text-white rounded-lg font-medium"
              >
                {t('tools.standingDeskReminder.startStanding')}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center gap-2">
            <button
              onClick={switchPosition}
              className={`px-6 py-2 rounded-lg font-medium ${
                position === 'sitting' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
              }`}
            >
              {position === 'sitting'
                ? t('tools.standingDeskReminder.switchToStanding')
                : t('tools.standingDeskReminder.switchToSitting')}
            </button>
            <button
              onClick={stop}
              className="px-6 py-2 bg-slate-200 rounded-lg"
            >
              {t('tools.standingDeskReminder.stop')}
            </button>
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.standingDeskReminder.todayStats')}</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="text-xl font-bold text-blue-600">{todayStats.sitting}</div>
            <div className="text-xs text-slate-500">{t('tools.standingDeskReminder.sittingMins')}</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-xl font-bold text-green-600">{todayStats.standing}</div>
            <div className="text-xs text-slate-500">{t('tools.standingDeskReminder.standingMins')}</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <div className="text-xl font-bold text-purple-600">{getStandingRatio()}%</div>
            <div className="text-xs text-slate-500">{t('tools.standingDeskReminder.standingRatio')}</div>
          </div>
        </div>
        <div className="mt-3 bg-slate-200 rounded-full h-4 overflow-hidden flex">
          <div
            className="bg-blue-500 h-full"
            style={{ width: `${100 - getStandingRatio()}%` }}
          />
          <div
            className="bg-green-500 h-full"
            style={{ width: `${getStandingRatio()}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>{t('tools.standingDeskReminder.sitting')}</span>
          <span>{t('tools.standingDeskReminder.standing')}</span>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.standingDeskReminder.weekStats')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(weekStats.sitting / 60 * 10) / 10}h</div>
            <div className="text-xs text-slate-500">{t('tools.standingDeskReminder.sittingWeek')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{Math.round(weekStats.standing / 60 * 10) / 10}h</div>
            <div className="text-xs text-slate-500">{t('tools.standingDeskReminder.standingWeek')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4 bg-green-50">
        <h3 className="font-medium mb-2">{t('tools.standingDeskReminder.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>- {t('tools.standingDeskReminder.tip1')}</li>
          <li>- {t('tools.standingDeskReminder.tip2')}</li>
          <li>- {t('tools.standingDeskReminder.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
