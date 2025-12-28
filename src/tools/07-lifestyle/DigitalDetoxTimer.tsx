import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface DetoxSession {
  id: number
  date: string
  targetMinutes: number
  completedMinutes: number
  completed: boolean
}

export default function DigitalDetoxTimer() {
  const { t } = useTranslation()
  const [sessions, setSessions] = useState<DetoxSession[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [targetMinutes, setTargetMinutes] = useState(30)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [motivationalQuote, setMotivationalQuote] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const presetDurations = [15, 30, 60, 90, 120]

  const quotes = [
    "Disconnect to reconnect with yourself.",
    "Your mind needs rest, not more content.",
    "Real life happens outside the screen.",
    "Take a breath. The digital world can wait.",
    "The best moments are lived, not scrolled.",
    "Give your eyes and mind a break.",
    "Presence is a gift to yourself.",
    "Unplug to recharge.",
  ]

  useEffect(() => {
    const saved = localStorage.getItem('digital-detox-timer')
    if (saved) {
      try {
        setSessions(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load sessions')
      }
    }
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  useEffect(() => {
    localStorage.setItem('digital-detox-timer', JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startDetox = () => {
    setIsRunning(true)
    setElapsedSeconds(0)
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)])

    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => {
        const newValue = prev + 1
        if (newValue >= targetMinutes * 60) {
          completeDetox(newValue)
        }
        return newValue
      })
    }, 1000)
  }

  const completeDetox = (seconds: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    const session: DetoxSession = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      targetMinutes,
      completedMinutes: Math.floor(seconds / 60),
      completed: seconds >= targetMinutes * 60,
    }
    setSessions([session, ...sessions])
    setIsRunning(false)
    setElapsedSeconds(0)
  }

  const endEarly = () => {
    completeDetox(elapsedSeconds)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    return Math.min((elapsedSeconds / (targetMinutes * 60)) * 100, 100)
  }

  const getStats = () => {
    const completed = sessions.filter(s => s.completed)
    const totalMinutes = sessions.reduce((sum, s) => sum + s.completedMinutes, 0)
    const todaySessions = sessions.filter(s => s.date === new Date().toISOString().split('T')[0])
    const todayMinutes = todaySessions.reduce((sum, s) => sum + s.completedMinutes, 0)

    // Calculate streak
    let streak = 0
    for (let i = 0; i < 365; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const hasSession = sessions.some(s => s.date === dateStr && s.completed)
      if (hasSession) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    return {
      totalSessions: sessions.length,
      completedSessions: completed.length,
      totalMinutes,
      todayMinutes,
      streak,
    }
  }

  const stats = getStats()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{stats.streak}</div>
            <div className="text-xs text-slate-500">{t('tools.digitalDetox.streak')}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{stats.todayMinutes}</div>
            <div className="text-xs text-slate-500">{t('tools.digitalDetox.todayMin')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{stats.completedSessions}</div>
            <div className="text-xs text-slate-500">{t('tools.digitalDetox.completed')}</div>
          </div>
        </div>
      </div>

      {!isRunning ? (
        <div className="card p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              {t('tools.digitalDetox.title')}
            </h3>
            <p className="text-slate-500 italic">"{motivationalQuote}"</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-slate-500 mb-3 text-center">
              {t('tools.digitalDetox.duration')}
            </label>
            <div className="flex gap-2 justify-center">
              {presetDurations.map(mins => (
                <button
                  key={mins}
                  onClick={() => setTargetMinutes(mins)}
                  className={`px-4 py-2 rounded ${
                    targetMinutes === mins ? 'bg-green-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startDetox}
            className="w-full py-4 bg-green-500 text-white rounded-lg font-medium text-lg hover:bg-green-600"
          >
            {t('tools.digitalDetox.start')}
          </button>
        </div>
      ) : (
        <div className="card p-6">
          <div className="text-center mb-6">
            <p className="text-slate-500 italic mb-4">"{motivationalQuote}"</p>

            <div className="relative w-48 h-48 mx-auto mb-4">
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
                  stroke="#22c55e"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - getProgress() / 100)}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-700">
                  {formatTime(elapsedSeconds)}
                </span>
                <span className="text-sm text-slate-500">
                  / {targetMinutes}:00
                </span>
              </div>
            </div>

            <p className="text-green-600 font-medium">
              {t('tools.digitalDetox.inProgress')}
            </p>
          </div>

          <button
            onClick={endEarly}
            className="w-full py-3 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200"
          >
            {t('tools.digitalDetox.endEarly')}
          </button>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.digitalDetox.suggestions')}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: '📖', label: 'Read a book' },
            { icon: '🚶', label: 'Take a walk' },
            { icon: '🧘', label: 'Meditate' },
            { icon: '✍️', label: 'Journal' },
            { icon: '🎨', label: 'Draw or create' },
            { icon: '🌿', label: 'Spend time in nature' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {sessions.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.digitalDetox.history')}
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {sessions.slice(0, 10).map(session => (
              <div key={session.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <div className="flex items-center gap-2">
                  <span className={session.completed ? 'text-green-500' : 'text-yellow-500'}>
                    {session.completed ? '✓' : '○'}
                  </span>
                  <span className="text-sm">{session.date}</span>
                </div>
                <span className="text-sm text-slate-500">
                  {session.completedMinutes} / {session.targetMinutes} min
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.digitalDetox.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.digitalDetox.tip1')}</li>
          <li>{t('tools.digitalDetox.tip2')}</li>
          <li>{t('tools.digitalDetox.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
