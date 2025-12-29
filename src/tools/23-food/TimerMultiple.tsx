import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Timer {
  id: number
  name: string
  duration: number
  remaining: number
  isRunning: boolean
  isComplete: boolean
}

const presetTimers = [
  { name: 'Soft Boiled Egg', minutes: 6 },
  { name: 'Hard Boiled Egg', minutes: 12 },
  { name: 'Pasta (al dente)', minutes: 10 },
  { name: 'Rice', minutes: 18 },
  { name: 'Bread Rising', minutes: 60 },
  { name: 'Marinating (quick)', minutes: 30 },
  { name: 'Resting Meat', minutes: 5 },
  { name: 'Cookies', minutes: 12 },
]

export default function TimerMultiple() {
  const { t } = useTranslation()
  const [timers, setTimers] = useState<Timer[]>([])
  const [newTimer, setNewTimer] = useState({ name: '', minutes: 5, seconds: 0 })
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio context for alarm
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+bk4l/dm1rb3Z/ipaeoZuRhHlxa2lsc3yIlZ+gnJOHe3JraGtxe4iVn6GdlIh8c21qa3F7h5Sfop6VinxzbmtsOnyHlJ+in5WKfnNubGx0fYiUn6KflYp+dG5sbXV+iJSfoZ6Vin50bmxtdX6IlJ+hn5WKfnRubG11foiUn6GflYp+dG5sbXV+iJSfoZ+Vin50bmxtdX6IlJ+hn5WKfnRubG11foiUn6GflYp+dG5sbXV+iJSfoZ+Vin50bmxtdX6IlJ+hn5WKfnRu')
    return () => {
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers =>
        prevTimers.map(timer => {
          if (!timer.isRunning || timer.remaining <= 0) return timer

          const newRemaining = timer.remaining - 1

          if (newRemaining <= 0) {
            // Play alarm sound
            if (audioRef.current) {
              audioRef.current.play().catch(() => {})
            }
            return { ...timer, remaining: 0, isRunning: false, isComplete: true }
          }

          return { ...timer, remaining: newRemaining }
        })
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const addTimer = () => {
    if (newTimer.minutes === 0 && newTimer.seconds === 0) return
    const duration = newTimer.minutes * 60 + newTimer.seconds
    const timer: Timer = {
      id: Date.now(),
      name: newTimer.name || `Timer ${timers.length + 1}`,
      duration,
      remaining: duration,
      isRunning: false,
      isComplete: false,
    }
    setTimers([...timers, timer])
    setNewTimer({ name: '', minutes: 5, seconds: 0 })
  }

  const addPresetTimer = (preset: typeof presetTimers[0]) => {
    const duration = preset.minutes * 60
    const timer: Timer = {
      id: Date.now(),
      name: preset.name,
      duration,
      remaining: duration,
      isRunning: false,
      isComplete: false,
    }
    setTimers([...timers, timer])
  }

  const toggleTimer = (id: number) => {
    setTimers(timers.map(timer =>
      timer.id === id ? { ...timer, isRunning: !timer.isRunning, isComplete: false } : timer
    ))
  }

  const resetTimer = (id: number) => {
    setTimers(timers.map(timer =>
      timer.id === id ? { ...timer, remaining: timer.duration, isRunning: false, isComplete: false } : timer
    ))
  }

  const removeTimer = (id: number) => {
    setTimers(timers.filter(timer => timer.id !== id))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = (timer: Timer) => {
    return ((timer.duration - timer.remaining) / timer.duration) * 100
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.timerMultiple.addTimer')}</h3>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={newTimer.name}
            onChange={e => setNewTimer({ ...newTimer, name: e.target.value })}
            placeholder={t('tools.timerMultiple.timerName')}
            className="flex-1 min-w-32 px-3 py-2 border border-slate-300 rounded"
          />
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={newTimer.minutes}
              onChange={e => setNewTimer({ ...newTimer, minutes: parseInt(e.target.value) || 0 })}
              min={0}
              max={999}
              className="w-16 px-3 py-2 border border-slate-300 rounded text-center"
            />
            <span className="text-slate-500">m</span>
            <input
              type="number"
              value={newTimer.seconds}
              onChange={e => setNewTimer({ ...newTimer, seconds: parseInt(e.target.value) || 0 })}
              min={0}
              max={59}
              className="w-16 px-3 py-2 border border-slate-300 rounded text-center"
            />
            <span className="text-slate-500">s</span>
          </div>
          <button
            onClick={addTimer}
            disabled={newTimer.minutes === 0 && newTimer.seconds === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
          >
            Add
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.timerMultiple.presets')}</h3>
        <div className="flex flex-wrap gap-2">
          {presetTimers.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => addPresetTimer(preset)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-sm"
            >
              {preset.name} ({preset.minutes}m)
            </button>
          ))}
        </div>
      </div>

      {timers.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          <div className="text-4xl mb-2">⏱️</div>
          {t('tools.timerMultiple.noTimers')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {timers.map(timer => (
            <div
              key={timer.id}
              className={`card p-4 ${
                timer.isComplete
                  ? 'bg-red-50 border-2 border-red-300 animate-pulse'
                  : timer.isRunning
                  ? 'bg-green-50 border-2 border-green-300'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-medium">{timer.name}</div>
                <button
                  onClick={() => removeTimer(timer.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  x
                </button>
              </div>

              <div className="text-center my-4">
                <div className={`text-5xl font-mono font-bold ${
                  timer.isComplete ? 'text-red-600' : timer.remaining < 60 ? 'text-orange-500' : ''
                }`}>
                  {formatTime(timer.remaining)}
                </div>
                {timer.isComplete && (
                  <div className="text-red-600 font-medium mt-2">
                    {t('tools.timerMultiple.done')}
                  </div>
                )}
              </div>

              <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full transition-all ${
                    timer.isComplete ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${getProgress(timer)}%` }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleTimer(timer.id)}
                  className={`flex-1 py-2 rounded ${
                    timer.isRunning
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {timer.isRunning ? t('tools.timerMultiple.pause') : t('tools.timerMultiple.start')}
                </button>
                <button
                  onClick={() => resetTimer(timer.id)}
                  className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
                >
                  {t('tools.timerMultiple.reset')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {timers.length > 0 && (
        <div className="card p-4 text-center">
          <span className="text-sm text-slate-500">
            {timers.filter(t => t.isRunning).length} {t('tools.timerMultiple.running')} / {timers.length} {t('tools.timerMultiple.total')}
          </span>
        </div>
      )}
    </div>
  )
}
