import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface FastingSession {
  id: number
  startTime: number
  endTime: number | null
  targetHours: number
  completed: boolean
}

export default function FastingTimer() {
  const { t } = useTranslation()
  const [sessions, setSessions] = useState<FastingSession[]>([])
  const [currentSession, setCurrentSession] = useState<FastingSession | null>(null)
  const [targetHours, setTargetHours] = useState(16)
  const [elapsedTime, setElapsedTime] = useState(0)
  const intervalRef = useRef<number | null>(null)

  const fastingPlans = [
    { name: '16:8', hours: 16 },
    { name: '18:6', hours: 18 },
    { name: '20:4', hours: 20 },
    { name: '24h', hours: 24 },
    { name: '36h', hours: 36 },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('fasting-timer')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setSessions(data.sessions || [])
        if (data.current && !data.current.endTime) {
          setCurrentSession(data.current)
        }
      } catch (e) {
        console.error('Failed to load fasting data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('fasting-timer', JSON.stringify({ sessions, current: currentSession }))
  }, [sessions, currentSession])

  useEffect(() => {
    if (currentSession) {
      const updateTimer = () => {
        setElapsedTime(Date.now() - currentSession.startTime)
      }
      updateTimer()
      intervalRef.current = window.setInterval(updateTimer, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [currentSession])

  const startFasting = () => {
    const session: FastingSession = {
      id: Date.now(),
      startTime: Date.now(),
      endTime: null,
      targetHours,
      completed: false,
    }
    setCurrentSession(session)
  }

  const endFasting = () => {
    if (!currentSession) return

    const endTime = Date.now()
    const duration = endTime - currentSession.startTime
    const targetMs = currentSession.targetHours * 60 * 60 * 1000
    const completed = duration >= targetMs

    const finishedSession: FastingSession = {
      ...currentSession,
      endTime,
      completed,
    }
    setSessions([finishedSession, ...sessions])
    setCurrentSession(null)
    setElapsedTime(0)
  }

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const targetMs = currentSession ? currentSession.targetHours * 60 * 60 * 1000 : targetHours * 60 * 60 * 1000
  const progress = currentSession ? Math.min(100, (elapsedTime / targetMs) * 100) : 0
  const remaining = Math.max(0, targetMs - elapsedTime)

  const completedSessions = sessions.filter(s => s.completed).length
  const totalSessions = sessions.length

  return (
    <div className="space-y-4">
      {!currentSession ? (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.fastingTimer.selectPlan')}</h3>
            <div className="flex gap-2 flex-wrap">
              {fastingPlans.map(plan => (
                <button
                  key={plan.hours}
                  onClick={() => setTargetHours(plan.hours)}
                  className={`px-4 py-2 rounded ${targetHours === plan.hours ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
                >
                  {plan.name}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-sm text-slate-600">{t('tools.fastingTimer.customHours')}</label>
              <input
                type="number"
                value={targetHours}
                onChange={(e) => setTargetHours(parseInt(e.target.value) || 16)}
                min={1}
                max={72}
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          <button
            onClick={startFasting}
            className="w-full py-3 bg-green-500 text-white rounded font-medium text-lg"
          >
            {t('tools.fastingTimer.startFast')}
          </button>

          {sessions.length > 0 && (
            <>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{completedSessions} / {totalSessions}</div>
                <div className="text-sm text-slate-500">{t('tools.fastingTimer.completedFasts')}</div>
              </div>

              <div className="card p-4">
                <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.fastingTimer.history')}</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {sessions.slice(0, 10).map(session => (
                    <div key={session.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                      <div>
                        <div className="text-sm font-medium">
                          {session.targetHours}h {session.completed ? '✓' : '✗'}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(session.startTime).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`text-sm ${session.completed ? 'text-green-600' : 'text-red-600'}`}>
                        {formatDuration(session.endTime! - session.startTime)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="card p-6 text-center">
          <div className="text-sm text-slate-500 mb-2">
            {t('tools.fastingTimer.fasting')} • {currentSession.targetHours}h
          </div>

          <div className="relative w-48 h-48 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="12"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke={progress >= 100 ? '#22c55e' : '#3b82f6'}
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <div className="text-3xl font-bold">{formatDuration(elapsedTime)}</div>
                <div className="text-sm text-slate-500">{progress.toFixed(0)}%</div>
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-600 mb-4">
            {progress >= 100 ? (
              <span className="text-green-600 font-medium">{t('tools.fastingTimer.goalReached')} 🎉</span>
            ) : (
              <span>{t('tools.fastingTimer.remaining')}: {formatDuration(remaining)}</span>
            )}
          </div>

          <div className="text-xs text-slate-500 mb-4">
            {t('tools.fastingTimer.started')}: {new Date(currentSession.startTime).toLocaleString()}
          </div>

          <button
            onClick={endFasting}
            className="w-full py-3 bg-red-500 text-white rounded font-medium"
          >
            {t('tools.fastingTimer.endFast')}
          </button>
        </div>
      )}
    </div>
  )
}
