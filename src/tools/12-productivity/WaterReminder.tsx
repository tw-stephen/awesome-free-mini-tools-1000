import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface WaterLog {
  date: string
  glasses: number
  ml: number
}

export default function WaterReminder() {
  const { t } = useTranslation()
  const [glassSize, setGlassSize] = useState(250) // ml
  const [dailyGoal, setDailyGoal] = useState(2000) // ml
  const [reminderInterval, setReminderInterval] = useState(60) // minutes
  const [isEnabled, setIsEnabled] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [todayIntake, setTodayIntake] = useState(0)
  const [glassesToday, setGlassesToday] = useState(0)
  const [logs, setLogs] = useState<WaterLog[]>([])
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('water-logs')
    if (saved) setLogs(JSON.parse(saved))

    const today = new Date().toISOString().split('T')[0]
    const savedIntake = localStorage.getItem(`water-intake-${today}`)
    if (savedIntake) {
      const data = JSON.parse(savedIntake)
      setTodayIntake(data.ml)
      setGlassesToday(data.glasses)
    }
  }, [])

  useEffect(() => {
    if (isEnabled && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isEnabled) {
      playReminder()
      setTimeLeft(reminderInterval * 60)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isEnabled, timeLeft, reminderInterval])

  const playReminder = () => {
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 600
      oscillator.type = 'sine'
      gainNode.gain.value = 0.2

      oscillator.start()
      setTimeout(() => {
        oscillator.frequency.value = 800
        setTimeout(() => oscillator.stop(), 150)
      }, 150)
    } catch {
      // Audio not supported
    }
  }

  const drinkWater = (amount: number = glassSize) => {
    const today = new Date().toISOString().split('T')[0]
    const newIntake = todayIntake + amount
    const newGlasses = glassesToday + 1

    setTodayIntake(newIntake)
    setGlassesToday(newGlasses)

    localStorage.setItem(`water-intake-${today}`, JSON.stringify({
      ml: newIntake,
      glasses: newGlasses
    }))

    // Update logs
    const existing = logs.find(l => l.date === today)
    let updated: WaterLog[]
    if (existing) {
      updated = logs.map(l =>
        l.date === today ? { ...l, glasses: newGlasses, ml: newIntake } : l
      )
    } else {
      updated = [...logs, { date: today, glasses: newGlasses, ml: newIntake }]
    }
    setLogs(updated)
    localStorage.setItem('water-logs', JSON.stringify(updated))

    // Reset timer
    if (isEnabled) {
      setTimeLeft(reminderInterval * 60)
    }
  }

  const startReminder = () => {
    setIsEnabled(true)
    setTimeLeft(reminderInterval * 60)
  }

  const stopReminder = () => {
    setIsEnabled(false)
    setTimeLeft(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    return Math.min((todayIntake / dailyGoal) * 100, 100)
  }

  const getWeekStats = () => {
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    const weekLogs = logs.filter(l => new Date(l.date) >= weekAgo)
    const totalMl = weekLogs.reduce((sum, l) => sum + l.ml, 0)
    const avgMl = weekLogs.length > 0 ? Math.round(totalMl / weekLogs.length) : 0
    const daysGoalMet = weekLogs.filter(l => l.ml >= dailyGoal).length

    return { totalMl, avgMl, daysGoalMet, days: weekLogs.length }
  }

  const weekStats = getWeekStats()

  const quickAmounts = [100, 150, 200, 250, 300, 500]

  return (
    <div className="space-y-4">
      <div className="card p-6 text-center">
        <div className="text-5xl mb-4">💧</div>

        <div className="relative w-48 h-48 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-slate-200"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-blue-500"
              strokeDasharray={553}
              strokeDashoffset={553 - (553 * getProgress()) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-blue-600">
              {todayIntake} <span className="text-lg">ml</span>
            </div>
            <div className="text-sm text-slate-500">
              / {dailyGoal} ml
            </div>
            <div className="text-lg font-medium mt-1">
              {Math.round(getProgress())}%
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 flex-wrap mb-4">
          {quickAmounts.map(amount => (
            <button
              key={amount}
              onClick={() => drinkWater(amount)}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200"
            >
              +{amount}ml
            </button>
          ))}
        </div>

        <button
          onClick={() => drinkWater()}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium text-lg"
        >
          {t('tools.waterReminder.drinkGlass')} ({glassSize}ml)
        </button>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">{t('tools.waterReminder.reminder')}</h3>
          {isEnabled && (
            <span className="text-sm text-blue-600 font-mono">{formatTime(timeLeft)}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.waterReminder.glassSize')}
            </label>
            <select
              value={glassSize}
              onChange={(e) => setGlassSize(parseInt(e.target.value))}
              className="w-full px-2 py-1 border border-slate-300 rounded"
            >
              {[150, 200, 250, 300, 350, 500].map(ml => (
                <option key={ml} value={ml}>{ml} ml</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.waterReminder.reminderInterval')}
            </label>
            <select
              value={reminderInterval}
              onChange={(e) => setReminderInterval(parseInt(e.target.value))}
              className="w-full px-2 py-1 border border-slate-300 rounded"
            >
              {[30, 45, 60, 90, 120].map(min => (
                <option key={min} value={min}>{min} min</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="text-sm text-slate-600 block mb-1">
            {t('tools.waterReminder.dailyGoal')}
          </label>
          <select
            value={dailyGoal}
            onChange={(e) => setDailyGoal(parseInt(e.target.value))}
            className="w-full px-2 py-1 border border-slate-300 rounded"
          >
            {[1500, 2000, 2500, 3000, 3500, 4000].map(ml => (
              <option key={ml} value={ml}>{ml} ml ({ml / 1000}L)</option>
            ))}
          </select>
        </div>

        {!isEnabled ? (
          <button
            onClick={startReminder}
            className="w-full py-2 bg-green-500 text-white rounded-lg"
          >
            {t('tools.waterReminder.startReminder')}
          </button>
        ) : (
          <button
            onClick={stopReminder}
            className="w-full py-2 bg-slate-200 rounded-lg"
          >
            {t('tools.waterReminder.stopReminder')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{glassesToday}</div>
          <div className="text-xs text-slate-500">{t('tools.waterReminder.glassesToday')}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{dailyGoal - todayIntake > 0 ? dailyGoal - todayIntake : 0}</div>
          <div className="text-xs text-slate-500">{t('tools.waterReminder.mlRemaining')}</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.waterReminder.weekStats')}</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-slate-50 rounded">
            <div className="text-lg font-bold">{(weekStats.totalMl / 1000).toFixed(1)}L</div>
            <div className="text-xs text-slate-500">{t('tools.waterReminder.totalWeek')}</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded">
            <div className="text-lg font-bold">{weekStats.avgMl}ml</div>
            <div className="text-xs text-slate-500">{t('tools.waterReminder.dailyAvg')}</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded">
            <div className="text-lg font-bold">{weekStats.daysGoalMet}/{weekStats.days}</div>
            <div className="text-xs text-slate-500">{t('tools.waterReminder.goalMet')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.waterReminder.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>- {t('tools.waterReminder.tip1')}</li>
          <li>- {t('tools.waterReminder.tip2')}</li>
          <li>- {t('tools.waterReminder.tip3')}</li>
          <li>- {t('tools.waterReminder.tip4')}</li>
        </ul>
      </div>
    </div>
  )
}
