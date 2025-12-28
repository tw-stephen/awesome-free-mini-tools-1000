import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Session {
  id: number
  date: string
  duration: number
  type: string
}

export default function MeditationTimer() {
  const { t } = useTranslation()
  const [duration, setDuration] = useState(10)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedType, setSelectedType] = useState('Mindfulness')
  const [showBell, setShowBell] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const meditationTypes = [
    'Mindfulness',
    'Breathing',
    'Body Scan',
    'Loving-Kindness',
    'Visualization',
    'Gratitude',
    'Walking',
    'Silent',
  ]

  const durations = [1, 3, 5, 10, 15, 20, 30, 45, 60]

  useEffect(() => {
    const saved = localStorage.getItem('meditation-timer')
    if (saved) {
      try {
        setSessions(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load sessions')
      }
    }

    // Create a simple bell sound using Web Audio API
    try {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQAgRqTT2K9OM0R+ycDenJaMoLy+sZJ0SDxdm7rQz8fFt6mdiHpvaW15hpWgq7K3u7u6')
    } catch (e) {
      console.log('Audio not supported')
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('meditation-timer', JSON.stringify(sessions))
  }, [sessions])

  const startMeditation = () => {
    setTimeLeft(duration * 60)
    setIsRunning(true)
    setIsPaused(false)

    if (showBell && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          completeMeditation()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const pauseMeditation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setIsPaused(true)
  }

  const resumeMeditation = () => {
    setIsPaused(false)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          completeMeditation()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const completeMeditation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (showBell && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }

    const session: Session = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      duration,
      type: selectedType,
    }
    setSessions([session, ...sessions])
    setIsRunning(false)
    setIsPaused(false)
  }

  const stopMeditation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setIsRunning(false)
    setIsPaused(false)
    setTimeLeft(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const todaySessions = sessions.filter(s => s.date === today)
    const todayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0)

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const weekSessions = sessions.filter(s => s.date >= weekAgo)
    const weekMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0)

    let streak = 0
    for (let i = 0; i < 365; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      if (sessions.some(s => s.date === dateStr)) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    return { todayMinutes, weekMinutes, weekSessions: weekSessions.length, streak }
  }

  const stats = getStats()

  return (
    <div className="space-y-4">
      {isRunning ? (
        <div className="card p-6">
          <div className="text-center">
            <h3 className="font-medium text-slate-700 mb-2">{selectedType}</h3>

            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - timeLeft / (duration * 60))}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-slate-700">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              {isPaused ? (
                <button
                  onClick={resumeMeditation}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600"
                >
                  {t('tools.meditation.resume')}
                </button>
              ) : (
                <button
                  onClick={pauseMeditation}
                  className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600"
                >
                  {t('tools.meditation.pause')}
                </button>
              )}
              <button
                onClick={stopMeditation}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              >
                {t('tools.meditation.stop')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="card p-4">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">{stats.todayMinutes}</div>
                <div className="text-xs text-slate-500">{t('tools.meditation.todayMin')}</div>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{stats.weekSessions}</div>
                <div className="text-xs text-slate-500">{t('tools.meditation.weekSessions')}</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{stats.weekMinutes}</div>
                <div className="text-xs text-slate-500">{t('tools.meditation.weekMin')}</div>
              </div>
              <div className="p-3 bg-orange-50 rounded">
                <div className="text-2xl font-bold text-orange-600">{stats.streak}</div>
                <div className="text-xs text-slate-500">{t('tools.meditation.streak')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.meditation.duration')}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {durations.map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-4 py-2 rounded ${
                    duration === d ? 'bg-purple-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>

            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.meditation.type')}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {meditationTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedType === type ? 'bg-purple-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600 mb-4">
              <input
                type="checkbox"
                checked={showBell}
                onChange={(e) => setShowBell(e.target.checked)}
                className="rounded"
              />
              {t('tools.meditation.bell')}
            </label>

            <button
              onClick={startMeditation}
              className="w-full py-4 bg-purple-500 text-white rounded-lg font-medium text-lg hover:bg-purple-600"
            >
              {t('tools.meditation.start')}
            </button>
          </div>
        </>
      )}

      {sessions.length > 0 && !isRunning && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.meditation.history')}
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sessions.slice(0, 10).map(session => (
              <div key={session.id} className="flex justify-between p-2 bg-slate-50 rounded">
                <div>
                  <span className="font-medium">{session.type}</span>
                  <span className="text-sm text-slate-500 ml-2">{session.duration} min</span>
                </div>
                <span className="text-sm text-slate-500">{session.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.meditation.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.meditation.tip1')}</li>
          <li>{t('tools.meditation.tip2')}</li>
          <li>{t('tools.meditation.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
