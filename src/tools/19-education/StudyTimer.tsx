import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Session {
  id: number
  type: 'focus' | 'short' | 'long'
  duration: number
  completedAt: string
}

export default function StudyTimer() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState({
    focusDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
  })

  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [currentMode, setCurrentMode] = useState<'focus' | 'short' | 'long'>('focus')
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [sessions, setSessions] = useState<Session[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      handleComplete()
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, timeLeft])

  const handleComplete = () => {
    setIsRunning(false)

    const session: Session = {
      id: Date.now(),
      type: currentMode,
      duration: getDuration(currentMode),
      completedAt: new Date().toLocaleTimeString(),
    }
    setSessions([session, ...sessions])

    if (currentMode === 'focus') {
      const newCompleted = completedPomodoros + 1
      setCompletedPomodoros(newCompleted)

      if (newCompleted % settings.longBreakInterval === 0) {
        setCurrentMode('long')
        setTimeLeft(settings.longBreak * 60)
      } else {
        setCurrentMode('short')
        setTimeLeft(settings.shortBreak * 60)
      }
    } else {
      setCurrentMode('focus')
      setTimeLeft(settings.focusDuration * 60)
    }
  }

  const getDuration = (mode: 'focus' | 'short' | 'long') => {
    switch (mode) {
      case 'focus': return settings.focusDuration
      case 'short': return settings.shortBreak
      case 'long': return settings.longBreak
    }
  }

  const switchMode = (mode: 'focus' | 'short' | 'long') => {
    setIsRunning(false)
    setCurrentMode(mode)
    setTimeLeft(getDuration(mode) * 60)
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(getDuration(currentMode) * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (1 - timeLeft / (getDuration(currentMode) * 60)) * 100

  const modeColors = {
    focus: { bg: 'bg-red-500', text: 'text-red-500', light: 'bg-red-50' },
    short: { bg: 'bg-green-500', text: 'text-green-500', light: 'bg-green-50' },
    long: { bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-50' },
  }

  const colors = modeColors[currentMode]

  const totalFocusTime = sessions
    .filter(s => s.type === 'focus')
    .reduce((sum, s) => sum + s.duration, 0)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['focus', 'short', 'long'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => switchMode(mode)}
            className={`flex-1 py-2 rounded text-sm font-medium transition-colors
              ${currentMode === mode ? `${modeColors[mode].bg} text-white` : 'bg-slate-100 hover:bg-slate-200'}`}
          >
            {mode === 'focus' ? 'Focus' : mode === 'short' ? 'Short Break' : 'Long Break'}
          </button>
        ))}
      </div>

      <div className={`card p-8 text-center ${colors.light}`}>
        <div className="relative inline-block">
          <svg className="w-48 h-48" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className={colors.text}
              strokeDasharray={`${progress * 2.83} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={toggleTimer}
            className={`px-8 py-3 rounded-full font-medium text-white ${colors.bg} hover:opacity-90`}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-4 py-3 rounded-full bg-slate-200 hover:bg-slate-300"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold">{completedPomodoros}</div>
          <div className="text-xs text-slate-500">Pomodoros</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold">{totalFocusTime}</div>
          <div className="text-xs text-slate-500">Focus mins</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold">{sessions.length}</div>
          <div className="text-xs text-slate-500">Sessions</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.studyTimer.settings')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-500">Focus (min)</label>
            <input
              type="number"
              value={settings.focusDuration}
              onChange={(e) => setSettings({ ...settings, focusDuration: parseInt(e.target.value) || 25 })}
              min={1}
              max={60}
              className="w-full px-2 py-1 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500">Short Break (min)</label>
            <input
              type="number"
              value={settings.shortBreak}
              onChange={(e) => setSettings({ ...settings, shortBreak: parseInt(e.target.value) || 5 })}
              min={1}
              max={30}
              className="w-full px-2 py-1 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500">Long Break (min)</label>
            <input
              type="number"
              value={settings.longBreak}
              onChange={(e) => setSettings({ ...settings, longBreak: parseInt(e.target.value) || 15 })}
              min={1}
              max={60}
              className="w-full px-2 py-1 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500">Long Break Interval</label>
            <input
              type="number"
              value={settings.longBreakInterval}
              onChange={(e) => setSettings({ ...settings, longBreakInterval: parseInt(e.target.value) || 4 })}
              min={2}
              max={10}
              className="w-full px-2 py-1 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      {sessions.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.studyTimer.history')}</h3>
          <div className="space-y-2 max-h-[150px] overflow-y-auto">
            {sessions.slice(0, 10).map(session => (
              <div key={session.id} className="flex items-center justify-between text-sm">
                <span className={`px-2 py-1 rounded text-xs ${modeColors[session.type].light} ${modeColors[session.type].text}`}>
                  {session.type}
                </span>
                <span className="text-slate-500">{session.duration} min</span>
                <span className="text-slate-400">{session.completedAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
