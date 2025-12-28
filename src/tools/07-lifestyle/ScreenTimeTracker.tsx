import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Session {
  id: number
  date: string
  duration: number
  category: string
}

interface DailyLimit {
  category: string
  limitMinutes: number
}

export default function ScreenTimeTracker() {
  const { t } = useTranslation()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isTracking, setIsTracking] = useState(false)
  const [currentCategory, setCurrentCategory] = useState('General')
  const [elapsedTime, setElapsedTime] = useState(0)
  const [limits, setLimits] = useState<DailyLimit[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  const categories = ['General', 'Social Media', 'Work', 'Entertainment', 'Gaming', 'News', 'Other']

  useEffect(() => {
    const saved = localStorage.getItem('screen-time-tracker')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setSessions(data.sessions || [])
        setLimits(data.limits || [])
      } catch (e) {
        console.error('Failed to load data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('screen-time-tracker', JSON.stringify({ sessions, limits }))
  }, [sessions, limits])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startTracking = () => {
    setIsTracking(true)
    startTimeRef.current = Date.now()
    setElapsedTime(0)

    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
  }

  const stopTracking = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    const duration = Math.floor((Date.now() - startTimeRef.current) / 60000) // minutes
    if (duration > 0) {
      const session: Session = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        duration,
        category: currentCategory,
      }
      setSessions([session, ...sessions])
    }

    setIsTracking(false)
    setElapsedTime(0)
  }

  const setLimit = (category: string, minutes: number) => {
    setLimits(limits => {
      const existing = limits.findIndex(l => l.category === category)
      if (existing >= 0) {
        const updated = [...limits]
        updated[existing] = { category, limitMinutes: minutes }
        return updated
      }
      return [...limits, { category, limitMinutes: minutes }]
    })
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatMinutes = (minutes: number) => {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hrs > 0) {
      return `${hrs}h ${mins}m`
    }
    return `${mins}m`
  }

  const todayStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const todaySessions = sessions.filter(s => s.date === today)

    const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0)

    const byCategory: Record<string, number> = {}
    todaySessions.forEach(s => {
      byCategory[s.category] = (byCategory[s.category] || 0) + s.duration
    })

    return { totalMinutes, byCategory, sessionCount: todaySessions.length }
  }, [sessions])

  const weekStats = useMemo(() => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const weekSessions = sessions.filter(s => s.date >= weekAgo)

    const totalMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0)
    const avgDaily = totalMinutes / 7

    return { totalMinutes, avgDaily }
  }, [sessions])

  const isOverLimit = (category: string) => {
    const limit = limits.find(l => l.category === category)
    if (!limit) return false
    return (todayStats.byCategory[category] || 0) >= limit.limitMinutes
  }

  const getLimitProgress = (category: string) => {
    const limit = limits.find(l => l.category === category)
    if (!limit) return null
    const used = todayStats.byCategory[category] || 0
    return Math.min((used / limit.limitMinutes) * 100, 100)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {formatMinutes(todayStats.totalMinutes)}
            </div>
            <div className="text-xs text-slate-500">{t('tools.screenTime.today')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">
              {formatMinutes(Math.round(weekStats.avgDaily))}
            </div>
            <div className="text-xs text-slate-500">{t('tools.screenTime.dailyAvg')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{todayStats.sessionCount}</div>
            <div className="text-xs text-slate-500">{t('tools.screenTime.sessions')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        {!isTracking ? (
          <>
            <div className="mb-4">
              <label className="block text-xs text-slate-500 mb-2">
                {t('tools.screenTime.category')}
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCurrentCategory(cat)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      currentCategory === cat
                        ? 'bg-blue-500 text-white'
                        : isOverLimit(cat)
                        ? 'bg-red-100 text-red-600'
                        : 'bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startTracking}
              className="w-full py-4 bg-green-500 text-white rounded-lg font-medium text-lg hover:bg-green-600"
            >
              {t('tools.screenTime.startTracking')}
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-700 mb-2">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-slate-500 mb-4">{currentCategory}</div>
            <button
              onClick={stopTracking}
              className="w-full py-4 bg-red-500 text-white rounded-lg font-medium text-lg hover:bg-red-600"
            >
              {t('tools.screenTime.stopTracking')}
            </button>
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.screenTime.todayBreakdown')}
        </h3>
        {Object.keys(todayStats.byCategory).length === 0 ? (
          <p className="text-sm text-slate-500">{t('tools.screenTime.noData')}</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(todayStats.byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([category, minutes]) => {
                const progress = getLimitProgress(category)
                const over = isOverLimit(category)

                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={over ? 'text-red-600 font-medium' : ''}>{category}</span>
                      <span className={over ? 'text-red-600 font-medium' : ''}>
                        {formatMinutes(minutes)}
                      </span>
                    </div>
                    {progress !== null && (
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${over ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.screenTime.dailyLimits')}
        </h3>
        <div className="space-y-2">
          {categories.slice(0, 4).map(category => {
            const limit = limits.find(l => l.category === category)
            return (
              <div key={category} className="flex items-center gap-2">
                <span className="flex-1 text-sm">{category}</span>
                <select
                  value={limit?.limitMinutes || 0}
                  onChange={(e) => setLimit(category, parseInt(e.target.value))}
                  className="px-2 py-1 border border-slate-300 rounded text-sm"
                >
                  <option value="0">{t('tools.screenTime.noLimit')}</option>
                  <option value="30">30 min</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="180">3 hours</option>
                  <option value="240">4 hours</option>
                </select>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.screenTime.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.screenTime.tip1')}</li>
          <li>{t('tools.screenTime.tip2')}</li>
          <li>{t('tools.screenTime.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
