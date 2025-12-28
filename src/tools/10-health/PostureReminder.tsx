import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function PostureReminder() {
  const { t } = useTranslation()
  const [isActive, setIsActive] = useState(false)
  const [interval, setInterval_] = useState(30)
  const [lastReminder, setLastReminder] = useState<Date | null>(null)
  const [reminderCount, setReminderCount] = useState(0)
  const [timeUntilNext, setTimeUntilNext] = useState(0)
  const timerRef = useRef<number | null>(null)
  const countdownRef = useRef<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('posture-reminder')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setInterval_(data.interval || 30)
        setReminderCount(data.reminderCount || 0)
      } catch (e) {
        console.error('Failed to load posture data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('posture-reminder', JSON.stringify({ interval, reminderCount }))
  }, [interval, reminderCount])

  useEffect(() => {
    if (isActive) {
      setTimeUntilNext(interval * 60)
      countdownRef.current = window.setInterval(() => {
        setTimeUntilNext(prev => {
          if (prev <= 1) {
            showReminder()
            return interval * 60
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [isActive, interval])

  const showReminder = () => {
    setLastReminder(new Date())
    setReminderCount(prev => prev + 1)

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(t('tools.postureReminder.checkPosture'), {
        body: t('tools.postureReminder.sitStraight'),
        icon: '🧘',
      })
    }

    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1hZGRhXltsgoOKkpOVl5eTjYl/d21qaWhqbnJ2eXl4dnVycG1qZ2RiYGBhY2ZpbXF1eXx+gIGBgH58enl4d3Z1dHRzdHV2d3h5ent8fX5+fn59fXx8e3p6eXl4eHh4eHh5eXp6e3x8fX1+fn9/f39/f39/f39+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+')
    audio.volume = 0.5
    audio.play().catch(() => {})
  }

  const toggleReminder = () => {
    if (!isActive && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
    setIsActive(!isActive)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const postureTips = [
    t('tools.postureReminder.tip1'),
    t('tools.postureReminder.tip2'),
    t('tools.postureReminder.tip3'),
    t('tools.postureReminder.tip4'),
    t('tools.postureReminder.tip5'),
  ]

  const exercises = [
    { name: t('tools.postureReminder.neckRolls'), duration: '30s' },
    { name: t('tools.postureReminder.shoulderShrugs'), duration: '30s' },
    { name: t('tools.postureReminder.chestStretch'), duration: '30s' },
    { name: t('tools.postureReminder.upperBackStretch'), duration: '30s' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-6 text-center">
        <div className="text-6xl mb-4">🧘</div>
        <h2 className="text-xl font-bold mb-2">{t('tools.postureReminder.title')}</h2>

        {isActive ? (
          <>
            <div className="text-sm text-slate-500 mb-2">{t('tools.postureReminder.nextReminder')}</div>
            <div className="text-4xl font-bold text-blue-600 mb-4">{formatTime(timeUntilNext)}</div>
          </>
        ) : (
          <p className="text-sm text-slate-500 mb-4">{t('tools.postureReminder.inactive')}</p>
        )}

        <button
          onClick={toggleReminder}
          className={`w-full py-3 rounded font-medium ${
            isActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {isActive ? t('tools.postureReminder.stop') : t('tools.postureReminder.start')}
        </button>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.postureReminder.interval')}: {interval} {t('tools.postureReminder.minutes')}
        </label>
        <input
          type="range"
          min={5}
          max={60}
          step={5}
          value={interval}
          onChange={(e) => setInterval_(parseInt(e.target.value))}
          disabled={isActive}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>5min</span>
          <span>30min</span>
          <span>60min</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{reminderCount}</div>
          <div className="text-xs text-slate-500">{t('tools.postureReminder.totalReminders')}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-sm text-slate-600">
            {lastReminder ? lastReminder.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
          </div>
          <div className="text-xs text-slate-500">{t('tools.postureReminder.lastReminder')}</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.postureReminder.quickExercises')}</h3>
        <div className="space-y-2">
          {exercises.map((ex, i) => (
            <div key={i} className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="text-sm">{ex.name}</span>
              <span className="text-xs text-slate-500">{ex.duration}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.postureReminder.tips')}</h3>
        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
          {postureTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
