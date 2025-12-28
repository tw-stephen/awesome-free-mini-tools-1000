import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type TimerState = 'idle' | 'work' | 'break' | 'longBreak'

interface PomodoroSession {
  date: string
  completedPomodoros: number
}

export default function PomodoroTimer() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState({
    workMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
    longBreakInterval: 4
  })
  const [timeLeft, setTimeLeft] = useState(settings.workMinutes * 60)
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [isRunning, setIsRunning] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('pomodoro-sessions')
    if (saved) setSessions(JSON.parse(saved))

    const savedSettings = localStorage.getItem('pomodoro-settings')
    if (savedSettings) {
      const s = JSON.parse(savedSettings)
      setSettings(s)
      setTimeLeft(s.workMinutes * 60)
    }
  }, [])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && timerState !== 'idle') {
      handleTimerComplete()
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, timeLeft, timerState])

  const playSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gainNode.gain.value = 0.3

      oscillator.start()
      setTimeout(() => oscillator.stop(), 200)
    } catch {
      // Audio not supported
    }
  }

  const handleTimerComplete = () => {
    playSound()
    setIsRunning(false)

    if (timerState === 'work') {
      const newCompleted = completedPomodoros + 1
      setCompletedPomodoros(newCompleted)
      saveTodaySession(newCompleted)

      if (newCompleted % settings.longBreakInterval === 0) {
        setTimerState('longBreak')
        setTimeLeft(settings.longBreakMinutes * 60)
      } else {
        setTimerState('break')
        setTimeLeft(settings.breakMinutes * 60)
      }
    } else {
      setTimerState('work')
      setTimeLeft(settings.workMinutes * 60)
    }
  }

  const saveTodaySession = (count: number) => {
    const today = new Date().toISOString().split('T')[0]
    const existing = sessions.find(s => s.date === today)
    let updated: PomodoroSession[]

    if (existing) {
      updated = sessions.map(s =>
        s.date === today ? { ...s, completedPomodoros: count } : s
      )
    } else {
      updated = [...sessions, { date: today, completedPomodoros: count }]
    }

    setSessions(updated)
    localStorage.setItem('pomodoro-sessions', JSON.stringify(updated))
  }

  const startTimer = () => {
    if (timerState === 'idle') {
      setTimerState('work')
      setTimeLeft(settings.workMinutes * 60)
    }
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimerState('idle')
    setTimeLeft(settings.workMinutes * 60)
  }

  const skipToNext = () => {
    setIsRunning(false)
    if (timerState === 'work') {
      if ((completedPomodoros + 1) % settings.longBreakInterval === 0) {
        setTimerState('longBreak')
        setTimeLeft(settings.longBreakMinutes * 60)
      } else {
        setTimerState('break')
        setTimeLeft(settings.breakMinutes * 60)
      }
    } else {
      setTimerState('work')
      setTimeLeft(settings.workMinutes * 60)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    const totalSeconds = timerState === 'work'
      ? settings.workMinutes * 60
      : timerState === 'longBreak'
        ? settings.longBreakMinutes * 60
        : settings.breakMinutes * 60
    return ((totalSeconds - timeLeft) / totalSeconds) * 100
  }

  const getStateColor = () => {
    switch (timerState) {
      case 'work': return 'text-red-500'
      case 'break': return 'text-green-500'
      case 'longBreak': return 'text-blue-500'
      default: return 'text-slate-700'
    }
  }

  const getBgColor = () => {
    switch (timerState) {
      case 'work': return 'bg-red-500'
      case 'break': return 'bg-green-500'
      case 'longBreak': return 'bg-blue-500'
      default: return 'bg-slate-300'
    }
  }

  const saveSettings = () => {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings))
    if (timerState === 'idle') {
      setTimeLeft(settings.workMinutes * 60)
    }
    setShowSettings(false)
  }

  const getTodayPomodoros = () => {
    const today = new Date().toISOString().split('T')[0]
    return sessions.find(s => s.date === today)?.completedPomodoros || completedPomodoros
  }

  const getWeekTotal = () => {
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    return sessions
      .filter(s => new Date(s.date) >= weekAgo)
      .reduce((sum, s) => sum + s.completedPomodoros, 0)
  }

  return (
    <div className="space-y-4">
      <div className="card p-8 text-center">
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
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className={getBgColor().replace('bg-', 'text-')}
              strokeDasharray={553}
              strokeDashoffset={553 - (553 * getProgress()) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-4xl font-mono font-bold ${getStateColor()}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {timerState === 'idle' && t('tools.pomodoroTimer.ready')}
              {timerState === 'work' && t('tools.pomodoroTimer.focusTime')}
              {timerState === 'break' && t('tools.pomodoroTimer.shortBreak')}
              {timerState === 'longBreak' && t('tools.pomodoroTimer.longBreak')}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium"
            >
              {timerState === 'idle' ? t('tools.pomodoroTimer.start') : t('tools.pomodoroTimer.resume')}
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-medium"
            >
              {t('tools.pomodoroTimer.pause')}
            </button>
          )}
          <button
            onClick={resetTimer}
            className="px-6 py-2 bg-slate-200 rounded-lg font-medium"
          >
            {t('tools.pomodoroTimer.reset')}
          </button>
          {timerState !== 'idle' && (
            <button
              onClick={skipToNext}
              className="px-6 py-2 bg-slate-200 rounded-lg font-medium"
            >
              {t('tools.pomodoroTimer.skip')}
            </button>
          )}
        </div>

        <div className="flex justify-center gap-1">
          {Array.from({ length: settings.longBreakInterval }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < (completedPomodoros % settings.longBreakInterval)
                  ? 'bg-red-500'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold text-red-500">{getTodayPomodoros()}</div>
          <div className="text-xs text-slate-500">{t('tools.pomodoroTimer.today')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold">{getWeekTotal()}</div>
          <div className="text-xs text-slate-500">{t('tools.pomodoroTimer.thisWeek')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold">
            {Math.round(getTodayPomodoros() * settings.workMinutes / 60 * 10) / 10}h
          </div>
          <div className="text-xs text-slate-500">{t('tools.pomodoroTimer.focusHours')}</div>
        </div>
      </div>

      <button
        onClick={() => setShowSettings(!showSettings)}
        className="w-full py-2 bg-slate-100 rounded text-sm"
      >
        {showSettings ? t('tools.pomodoroTimer.hideSettings') : t('tools.pomodoroTimer.showSettings')}
      </button>

      {showSettings && (
        <div className="card p-4 space-y-3">
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.pomodoroTimer.workDuration')} ({t('tools.pomodoroTimer.minutes')})
            </label>
            <input
              type="number"
              value={settings.workMinutes}
              onChange={(e) => setSettings({ ...settings, workMinutes: parseInt(e.target.value) || 25 })}
              min="1"
              max="60"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.pomodoroTimer.shortBreakDuration')} ({t('tools.pomodoroTimer.minutes')})
            </label>
            <input
              type="number"
              value={settings.breakMinutes}
              onChange={(e) => setSettings({ ...settings, breakMinutes: parseInt(e.target.value) || 5 })}
              min="1"
              max="30"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.pomodoroTimer.longBreakDuration')} ({t('tools.pomodoroTimer.minutes')})
            </label>
            <input
              type="number"
              value={settings.longBreakMinutes}
              onChange={(e) => setSettings({ ...settings, longBreakMinutes: parseInt(e.target.value) || 15 })}
              min="1"
              max="60"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.pomodoroTimer.longBreakInterval')}
            </label>
            <input
              type="number"
              value={settings.longBreakInterval}
              onChange={(e) => setSettings({ ...settings, longBreakInterval: parseInt(e.target.value) || 4 })}
              min="2"
              max="10"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <button
            onClick={saveSettings}
            className="w-full py-2 bg-blue-500 text-white rounded"
          >
            {t('tools.pomodoroTimer.saveSettings')}
          </button>
        </div>
      )}

      <div className="card p-4 bg-red-50">
        <h3 className="font-medium text-slate-700 mb-2">{t('tools.pomodoroTimer.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.pomodoroTimer.tip1')}</li>
          <li>• {t('tools.pomodoroTimer.tip2')}</li>
          <li>• {t('tools.pomodoroTimer.tip3')}</li>
        </ul>
      </div>

      <audio ref={audioRef} />
    </div>
  )
}
