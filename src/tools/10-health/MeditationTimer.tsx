import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Session {
  id: number
  duration: number
  date: string
}

export default function MeditationTimer() {
  const { t } = useTranslation()
  const [sessions, setSessions] = useState<Session[]>([])
  const [mode, setMode] = useState<'setup' | 'running' | 'done'>('setup')
  const [duration, setDuration] = useState(10)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [ambientSound, setAmbientSound] = useState('none')
  const intervalRef = useRef<number | null>(null)

  const durations = [5, 10, 15, 20, 30, 45, 60]
  const sounds = ['none', 'rain', 'ocean', 'forest', 'silence']

  useEffect(() => {
    const saved = localStorage.getItem('meditation-timer')
    if (saved) {
      try {
        setSessions(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load meditation data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('meditation-timer', JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    if (mode === 'running' && !isPaused && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            playBell()
            setMode('done')
            saveSession()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [mode, isPaused, timeLeft])

  const playBell = () => {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(528, ctx.currentTime)
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 2)
  }

  const startMeditation = () => {
    setTimeLeft(duration * 60)
    setMode('running')
    setIsPaused(false)
    playBell()
  }

  const saveSession = () => {
    const session: Session = {
      id: Date.now(),
      duration,
      date: new Date().toISOString().split('T')[0],
    }
    setSessions([session, ...sessions])
  }

  const stopMeditation = () => {
    setMode('setup')
    setIsPaused(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0)
  const thisWeek = sessions.filter(s => {
    const date = new Date(s.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return date >= weekAgo
  })
  const weeklyMinutes = thisWeek.reduce((sum, s) => sum + s.duration, 0)

  return (
    <div className="space-y-4">
      {mode === 'setup' && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.meditationTimer.duration')}</h3>
            <div className="flex flex-wrap gap-2">
              {durations.map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-4 py-2 rounded ${duration === d ? 'bg-purple-500 text-white' : 'bg-slate-100'}`}
                >
                  {d} {t('tools.meditationTimer.min')}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.meditationTimer.ambientSound')}</h3>
            <div className="flex flex-wrap gap-2">
              {sounds.map(s => (
                <button
                  key={s}
                  onClick={() => setAmbientSound(s)}
                  className={`px-4 py-2 rounded ${ambientSound === s ? 'bg-purple-500 text-white' : 'bg-slate-100'}`}
                >
                  {t(`tools.meditationTimer.${s}`)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startMeditation}
            className="w-full py-4 bg-purple-500 text-white rounded-lg font-medium text-lg"
          >
            {t('tools.meditationTimer.start')}
          </button>

          {sessions.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="card p-4 text-center bg-purple-50">
                  <div className="text-2xl font-bold text-purple-600">{weeklyMinutes}</div>
                  <div className="text-xs text-slate-500">{t('tools.meditationTimer.weeklyMinutes')}</div>
                </div>
                <div className="card p-4 text-center bg-purple-50">
                  <div className="text-2xl font-bold text-purple-600">{totalMinutes}</div>
                  <div className="text-xs text-slate-500">{t('tools.meditationTimer.totalMinutes')}</div>
                </div>
              </div>

              <div className="card p-4">
                <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.meditationTimer.recentSessions')}</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {sessions.slice(0, 10).map(s => (
                    <div key={s.id} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">{s.date}</span>
                      <span className="text-purple-600 font-medium">{s.duration} {t('tools.meditationTimer.min')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {mode === 'running' && (
        <div className="card p-8 text-center">
          <div className="text-sm text-slate-500 mb-8">{t('tools.meditationTimer.meditating')}</div>

          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="#a855f7"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - timeLeft / (duration * 60))}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl font-light text-purple-600">{formatTime(timeLeft)}</div>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-6 py-3 bg-purple-100 text-purple-700 rounded-lg font-medium"
            >
              {isPaused ? t('tools.meditationTimer.resume') : t('tools.meditationTimer.pause')}
            </button>
            <button
              onClick={stopMeditation}
              className="px-6 py-3 bg-slate-200 rounded-lg font-medium"
            >
              {t('tools.meditationTimer.stop')}
            </button>
          </div>
        </div>
      )}

      {mode === 'done' && (
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">🧘‍♀️</div>
          <div className="text-2xl font-bold text-purple-600 mb-2">{t('tools.meditationTimer.complete')}</div>
          <p className="text-slate-600 mb-2">
            {duration} {t('tools.meditationTimer.minutesCompleted')}
          </p>
          <p className="text-sm text-slate-500 mb-6">{t('tools.meditationTimer.namaste')}</p>
          <button
            onClick={() => setMode('setup')}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium"
          >
            {t('tools.meditationTimer.done')}
          </button>
        </div>
      )}
    </div>
  )
}
