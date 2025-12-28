import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function PomodoroTimer() {
  const { t } = useTranslation()
  const [workMinutes, setWorkMinutes] = useState(25)
  const [breakMinutes, setBreakMinutes] = useState(5)
  const [longBreakMinutes, setLongBreakMinutes] = useState(15)
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4)

  const [timeLeft, setTimeLeft] = useState(workMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(isBreak ? (completedSessions % sessionsUntilLongBreak === 0 ? longBreakMinutes : breakMinutes) * 60 : workMinutes * 60)
    }
  }, [workMinutes, breakMinutes, longBreakMinutes, isBreak, isRunning, completedSessions, sessionsUntilLongBreak])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer complete
            if (!isBreak) {
              setCompletedSessions(c => c + 1)
            }
            setIsBreak(!isBreak)
            setIsRunning(false)
            // Play sound
            try {
              const audioContext = new AudioContext()
              const oscillator = audioContext.createOscillator()
              oscillator.type = 'sine'
              oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
              oscillator.connect(audioContext.destination)
              oscillator.start()
              oscillator.stop(audioContext.currentTime + 0.3)
            } catch (e) {
              console.log('Audio not available')
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isBreak])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(workMinutes * 60)
  }

  const progress = isBreak
    ? (1 - timeLeft / ((completedSessions % sessionsUntilLongBreak === 0 ? longBreakMinutes : breakMinutes) * 60)) * 100
    : (1 - timeLeft / (workMinutes * 60)) * 100

  return (
    <div className="space-y-4">
      <div className={`card p-6 text-center ${isBreak ? 'bg-green-50' : 'bg-blue-50'}`}>
        <div className={`text-sm font-medium mb-2 ${isBreak ? 'text-green-600' : 'text-blue-600'}`}>
          {isBreak ? t('tools.pomodoroTimer.breakTime') : t('tools.pomodoroTimer.workTime')}
        </div>
        <div className={`text-6xl font-bold mb-4 ${isBreak ? 'text-green-600' : 'text-blue-600'}`}>
          {formatTime(timeLeft)}
        </div>
        <div className="h-2 bg-slate-200 rounded overflow-hidden mb-4">
          <div
            className={`h-full transition-all ${isBreak ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-2 rounded font-medium text-white ${isBreak ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isRunning ? t('tools.pomodoroTimer.pause') : t('tools.pomodoroTimer.start')}
          </button>
          <button
            onClick={resetTimer}
            className="px-6 py-2 rounded font-medium bg-slate-200 hover:bg-slate-300"
          >
            {t('tools.pomodoroTimer.reset')}
          </button>
        </div>
      </div>

      <div className="card p-4 text-center">
        <div className="text-sm text-slate-600">{t('tools.pomodoroTimer.sessionsCompleted')}</div>
        <div className="text-2xl font-bold text-slate-800">{completedSessions}</div>
        <div className="flex justify-center gap-1 mt-2">
          {[...Array(sessionsUntilLongBreak)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${i < (completedSessions % sessionsUntilLongBreak) ? 'bg-blue-500' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="text-sm font-medium text-slate-700">{t('tools.pomodoroTimer.settings')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.pomodoroTimer.workDuration')}</label>
            <input
              type="number"
              value={workMinutes}
              onChange={(e) => setWorkMinutes(parseInt(e.target.value) || 25)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              min="1"
              max="60"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.pomodoroTimer.breakDuration')}</label>
            <input
              type="number"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(parseInt(e.target.value) || 5)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              min="1"
              max="30"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.pomodoroTimer.longBreak')}</label>
            <input
              type="number"
              value={longBreakMinutes}
              onChange={(e) => setLongBreakMinutes(parseInt(e.target.value) || 15)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              min="1"
              max="60"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.pomodoroTimer.sessionsForLong')}</label>
            <input
              type="number"
              value={sessionsUntilLongBreak}
              onChange={(e) => setSessionsUntilLongBreak(parseInt(e.target.value) || 4)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              min="2"
              max="8"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
