import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Session {
  subject: string
  duration: number
  date: string
}

export default function StudyTimer() {
  const { t } = useTranslation()
  const [subject, setSubject] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [sessions, setSessions] = useState<Session[]>([])
  const intervalRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    const saved = localStorage.getItem('study-sessions')
    if (saved) {
      try {
        setSessions(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load sessions')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('study-sessions', JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedTime * 1000
      intervalRef.current = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const saveSession = () => {
    if (elapsedTime > 0 && subject.trim()) {
      const newSession: Session = {
        subject: subject.trim(),
        duration: elapsedTime,
        date: new Date().toISOString().split('T')[0],
      }
      setSessions([newSession, ...sessions.slice(0, 49)])
    }
    setIsRunning(false)
    setElapsedTime(0)
  }

  const todayTotal = sessions
    .filter(s => s.date === new Date().toISOString().split('T')[0])
    .reduce((sum, s) => sum + s.duration, 0)

  const weekTotal = sessions
    .filter(s => {
      const date = new Date(s.date)
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return date >= weekAgo
    })
    .reduce((sum, s) => sum + s.duration, 0)

  const subjectStats = sessions.reduce((acc, s) => {
    acc[s.subject] = (acc[s.subject] || 0) + s.duration
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.studyTimer.subject')}
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t('tools.studyTimer.subjectPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
            disabled={isRunning}
          />
        </div>

        <div className="text-center py-6">
          <div className="text-5xl font-mono font-bold text-blue-600">
            {formatTime(elapsedTime)}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={!subject.trim()}
            className={`flex-1 py-3 rounded font-medium text-white ${
              isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
            } disabled:opacity-50`}
          >
            {isRunning ? t('tools.studyTimer.pause') : t('tools.studyTimer.start')}
          </button>
          {elapsedTime > 0 && (
            <button
              onClick={saveSession}
              className="flex-1 py-3 rounded font-medium bg-blue-500 text-white hover:bg-blue-600"
            >
              {t('tools.studyTimer.save')}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-blue-600">{formatTime(todayTotal)}</div>
          <div className="text-xs text-slate-500">{t('tools.studyTimer.today')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-green-600">{formatTime(weekTotal)}</div>
          <div className="text-xs text-slate-500">{t('tools.studyTimer.thisWeek')}</div>
        </div>
      </div>

      {Object.keys(subjectStats).length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.studyTimer.bySubject')}
          </h3>
          <div className="space-y-2">
            {Object.entries(subjectStats)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([subj, duration]) => (
                <div key={subj} className="flex justify-between items-center">
                  <span className="text-sm">{subj}</span>
                  <span className="text-sm text-slate-500">{formatTime(duration)}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {sessions.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.studyTimer.recentSessions')}
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sessions.slice(0, 10).map((session, i) => (
              <div key={i} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                <div>
                  <div className="font-medium">{session.subject}</div>
                  <div className="text-xs text-slate-400">{session.date}</div>
                </div>
                <div className="text-blue-600 font-mono">{formatTime(session.duration)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
