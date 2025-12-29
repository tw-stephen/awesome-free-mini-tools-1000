import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface BreakLog {
  date: string
  breaks: number
  totalMinutes: number
}

export default function BreakReminder() {
  const { t } = useTranslation()
  const [workDuration, setWorkDuration] = useState(50)
  const [breakDuration, setBreakDuration] = useState(10)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isWorking, setIsWorking] = useState(false)
  const [isOnBreak, setIsOnBreak] = useState(false)
  const [breaksToday, setBreaksToday] = useState(0)
  const [breaksTaken, setBreaksTaken] = useState(0)
  const [logs, setLogs] = useState<BreakLog[]>([])
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('break-logs')
    if (saved) setLogs(JSON.parse(saved))

    const today = new Date().toISOString().split('T')[0]
    const savedBreaks = localStorage.getItem(`breaks-${today}`)
    if (savedBreaks) setBreaksTaken(parseInt(savedBreaks))
  }, [])

  useEffect(() => {
    if ((isWorking || isOnBreak) && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && (isWorking || isOnBreak)) {
      handleTimerEnd()
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isWorking, isOnBreak, timeLeft])

  const playSound = (type: 'break' | 'work') => {
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = type === 'break' ? 500 : 700
      oscillator.type = 'sine'
      gainNode.gain.value = 0.3

      oscillator.start()
      setTimeout(() => oscillator.stop(), 300)
    } catch {
      // Audio not supported
    }
  }

  const handleTimerEnd = () => {
    if (isWorking) {
      playSound('break')
      setIsWorking(false)
      setIsOnBreak(true)
      setTimeLeft(breakDuration * 60)
      setBreaksToday(breaksToday + 1)

      // Log the break
      const today = new Date().toISOString().split('T')[0]
      const newBreaksTaken = breaksTaken + 1
      setBreaksTaken(newBreaksTaken)
      localStorage.setItem(`breaks-${today}`, newBreaksTaken.toString())

      updateLogs(today, newBreaksTaken)
    } else if (isOnBreak) {
      playSound('work')
      setIsOnBreak(false)
      setIsWorking(true)
      setTimeLeft(workDuration * 60)
    }
  }

  const updateLogs = (date: string, breaks: number) => {
    const existing = logs.find(l => l.date === date)
    let updated: BreakLog[]

    if (existing) {
      updated = logs.map(l =>
        l.date === date
          ? { ...l, breaks, totalMinutes: breaks * breakDuration }
          : l
      )
    } else {
      updated = [...logs, { date, breaks, totalMinutes: breaks * breakDuration }]
    }

    setLogs(updated)
    localStorage.setItem('break-logs', JSON.stringify(updated))
  }

  const startWorking = () => {
    setIsWorking(true)
    setIsOnBreak(false)
    setTimeLeft(workDuration * 60)
  }

  const startBreak = () => {
    setIsWorking(false)
    setIsOnBreak(true)
    setTimeLeft(breakDuration * 60)
  }

  const stop = () => {
    setIsWorking(false)
    setIsOnBreak(false)
    setTimeLeft(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    const total = isWorking ? workDuration * 60 : breakDuration * 60
    return ((total - timeLeft) / total) * 100
  }

  const getWeekStats = () => {
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    return logs
      .filter(l => new Date(l.date) >= weekAgo)
      .reduce((sum, l) => ({
        breaks: sum.breaks + l.breaks,
        minutes: sum.minutes + l.totalMinutes
      }), { breaks: 0, minutes: 0 })
  }

  const weekStats = getWeekStats()

  const breakActivities = [
    t('tools.breakReminder.activities.stretch'),
    t('tools.breakReminder.activities.walk'),
    t('tools.breakReminder.activities.water'),
    t('tools.breakReminder.activities.eyes'),
    t('tools.breakReminder.activities.breathe'),
    t('tools.breakReminder.activities.stand')
  ]

  return (
    <div className="space-y-4">
      <div className="card p-6 text-center">
        <div className={`text-lg font-medium mb-2 ${
          isOnBreak ? 'text-green-600' : isWorking ? 'text-blue-600' : 'text-slate-600'
        }`}>
          {isOnBreak && t('tools.breakReminder.breakTime')}
          {isWorking && t('tools.breakReminder.workTime')}
          {!isOnBreak && !isWorking && t('tools.breakReminder.ready')}
        </div>

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
            {(isWorking || isOnBreak) && (
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className={isOnBreak ? 'text-green-500' : 'text-blue-500'}
                strokeDasharray={553}
                strokeDashoffset={553 - (553 * getProgress()) / 100}
                strokeLinecap="round"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-mono font-bold">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {!isWorking && !isOnBreak ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600 block mb-1">
                  {t('tools.breakReminder.workDuration')}
                </label>
                <select
                  value={workDuration}
                  onChange={(e) => setWorkDuration(parseInt(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded"
                >
                  {[25, 30, 45, 50, 60, 90].map(m => (
                    <option key={m} value={m}>{m} min</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">
                  {t('tools.breakReminder.breakDuration')}
                </label>
                <select
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(parseInt(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded"
                >
                  {[5, 10, 15, 20].map(m => (
                    <option key={m} value={m}>{m} min</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={startWorking}
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium"
            >
              {t('tools.breakReminder.startWorking')}
            </button>
          </div>
        ) : (
          <div className="flex justify-center gap-2">
            {isWorking && (
              <button
                onClick={startBreak}
                className="px-6 py-2 bg-green-500 text-white rounded-lg"
              >
                {t('tools.breakReminder.takeBreakNow')}
              </button>
            )}
            <button
              onClick={stop}
              className="px-6 py-2 bg-slate-200 rounded-lg"
            >
              {t('tools.breakReminder.stop')}
            </button>
          </div>
        )}
      </div>

      {isOnBreak && (
        <div className="card p-4 bg-green-50">
          <h3 className="font-medium mb-2">{t('tools.breakReminder.suggestedActivities')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {breakActivities.map((activity, index) => (
              <div key={index} className="p-2 bg-white rounded text-sm">
                {activity}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{breaksTaken}</div>
          <div className="text-xs text-slate-500">{t('tools.breakReminder.breaksToday')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{breaksTaken * breakDuration}</div>
          <div className="text-xs text-slate-500">{t('tools.breakReminder.minutesToday')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">{weekStats.breaks}</div>
          <div className="text-xs text-slate-500">{t('tools.breakReminder.breaksWeek')}</div>
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.breakReminder.whyBreaks')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>- {t('tools.breakReminder.benefit1')}</li>
          <li>- {t('tools.breakReminder.benefit2')}</li>
          <li>- {t('tools.breakReminder.benefit3')}</li>
          <li>- {t('tools.breakReminder.benefit4')}</li>
        </ul>
      </div>
    </div>
  )
}
