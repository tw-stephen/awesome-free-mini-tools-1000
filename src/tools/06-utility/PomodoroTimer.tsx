import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Session {
  type: 'work' | 'shortBreak' | 'longBreak'
  completed: boolean
  duration: number
}

export default function PomodoroTimer() {
  const { t } = useTranslation()
  const [workDuration, setWorkDuration] = useState(25)
  const [shortBreakDuration, setShortBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4)

  const [timeLeft, setTimeLeft] = useState(workDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [currentSession, setCurrentSession] = useState<'work' | 'shortBreak' | 'longBreak'>('work')
  const [completedSessions, setCompletedSessions] = useState(0)
  const [history, setHistory] = useState<Session[]>([])
  const [showSettings, setShowSettings] = useState(false)

  const audioRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      playNotification()
      handleSessionComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const playNotification = () => {
    try {
      audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      const ctx = audioRef.current

      const playTone = (freq: number, time: number) => {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)

        oscillator.frequency.value = freq
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0.2, time)
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.4)

        oscillator.start(time)
        oscillator.stop(time + 0.4)
      }

      playTone(523, ctx.currentTime)
      playTone(659, ctx.currentTime + 0.2)
      playTone(784, ctx.currentTime + 0.4)
    } catch (e) {
      console.log('Audio not supported')
    }
  }

  const handleSessionComplete = () => {
    setHistory((prev) => [
      { type: currentSession, completed: true, duration: getDuration(currentSession) },
      ...prev,
    ])

    if (currentSession === 'work') {
      const newCompletedSessions = completedSessions + 1
      setCompletedSessions(newCompletedSessions)

      if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
        setCurrentSession('longBreak')
        setTimeLeft(longBreakDuration * 60)
      } else {
        setCurrentSession('shortBreak')
        setTimeLeft(shortBreakDuration * 60)
      }
    } else {
      setCurrentSession('work')
      setTimeLeft(workDuration * 60)
    }
  }

  const getDuration = (session: typeof currentSession) => {
    switch (session) {
      case 'work': return workDuration
      case 'shortBreak': return shortBreakDuration
      case 'longBreak': return longBreakDuration
    }
  }

  const toggleTimer = useCallback(() => {
    setIsRunning(!isRunning)
  }, [isRunning])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(getDuration(currentSession) * 60)
  }, [currentSession, workDuration, shortBreakDuration, longBreakDuration])

  const skipSession = () => {
    setIsRunning(false)
    handleSessionComplete()
  }

  const setSession = (session: typeof currentSession) => {
    setIsRunning(false)
    setCurrentSession(session)
    setTimeLeft(getDuration(session) * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getSessionColor = () => {
    switch (currentSession) {
      case 'work': return 'bg-red-500'
      case 'shortBreak': return 'bg-green-500'
      case 'longBreak': return 'bg-blue-500'
    }
  }

  const progress = (1 - timeLeft / (getDuration(currentSession) * 60)) * 100

  const todayStats = history.filter((s) => s.type === 'work').length

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setSession('work')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentSession === 'work'
                ? 'bg-red-500 text-white'
                : 'bg-slate-200 hover:bg-slate-300'
            }`}
          >
            {t('tools.pomodoroTimer.work')}
          </button>
          <button
            onClick={() => setSession('shortBreak')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentSession === 'shortBreak'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 hover:bg-slate-300'
            }`}
          >
            {t('tools.pomodoroTimer.shortBreak')}
          </button>
          <button
            onClick={() => setSession('longBreak')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentSession === 'longBreak'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 hover:bg-slate-300'
            }`}
          >
            {t('tools.pomodoroTimer.longBreak')}
          </button>
        </div>

        <div className="relative mb-8">
          <div className="text-center">
            <div className="text-7xl font-mono font-bold text-slate-800">
              {formatTime(timeLeft)}
            </div>
            <div className={`text-sm font-medium mt-2 ${
              currentSession === 'work'
                ? 'text-red-500'
                : currentSession === 'shortBreak'
                ? 'text-green-500'
                : 'text-blue-500'
            }`}>
              {currentSession === 'work'
                ? t('tools.pomodoroTimer.focusTime')
                : t('tools.pomodoroTimer.breakTime')
              }
            </div>
          </div>

          <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${getSessionColor()}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={toggleTimer}
            className={`flex-1 py-3 rounded-lg font-medium text-white ${
              isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isRunning ? t('tools.pomodoroTimer.pause') : t('tools.pomodoroTimer.start')}
          </button>
          <button
            onClick={resetTimer}
            className="py-3 px-4 bg-slate-200 rounded-lg font-medium hover:bg-slate-300"
          >
            {t('tools.pomodoroTimer.reset')}
          </button>
          <button
            onClick={skipSession}
            className="py-3 px-4 bg-slate-200 rounded-lg font-medium hover:bg-slate-300"
          >
            {t('tools.pomodoroTimer.skip')}
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: sessionsBeforeLongBreak }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${
                i < completedSessions % sessionsBeforeLongBreak
                  ? 'bg-red-500'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.pomodoroTimer.todayStats')}
          </h3>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            {t('tools.pomodoroTimer.settings')}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-red-50 rounded text-center">
            <div className="text-2xl font-bold text-red-600">{todayStats}</div>
            <div className="text-xs text-slate-500">{t('tools.pomodoroTimer.pomodoros')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded text-center">
            <div className="text-2xl font-bold text-green-600">
              {todayStats * workDuration}
            </div>
            <div className="text-xs text-slate-500">{t('tools.pomodoroTimer.focusMinutes')}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor(todayStats / sessionsBeforeLongBreak)}
            </div>
            <div className="text-xs text-slate-500">{t('tools.pomodoroTimer.cycles')}</div>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">
            {t('tools.pomodoroTimer.settings')}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.pomodoroTimer.workDuration')} ({t('tools.pomodoroTimer.minutes')})
              </label>
              <input
                type="number"
                value={workDuration}
                onChange={(e) => setWorkDuration(parseInt(e.target.value) || 25)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.pomodoroTimer.shortBreakDuration')} ({t('tools.pomodoroTimer.minutes')})
              </label>
              <input
                type="number"
                value={shortBreakDuration}
                onChange={(e) => setShortBreakDuration(parseInt(e.target.value) || 5)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.pomodoroTimer.longBreakDuration')} ({t('tools.pomodoroTimer.minutes')})
              </label>
              <input
                type="number"
                value={longBreakDuration}
                onChange={(e) => setLongBreakDuration(parseInt(e.target.value) || 15)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.pomodoroTimer.sessionsBeforeLongBreak')}
              </label>
              <input
                type="number"
                value={sessionsBeforeLongBreak}
                onChange={(e) => setSessionsBeforeLongBreak(parseInt(e.target.value) || 4)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.pomodoroTimer.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.pomodoroTimer.tip1')}</li>
          <li>{t('tools.pomodoroTimer.tip2')}</li>
          <li>{t('tools.pomodoroTimer.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
