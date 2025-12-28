import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface DayLog {
  date: string
  glasses: number
}

export default function WaterIntakeTracker() {
  const { t } = useTranslation()
  const [goal, setGoal] = useState(8)
  const [glassSize, setGlassSize] = useState(250)
  const [logs, setLogs] = useState<DayLog[]>([])
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const saved = localStorage.getItem('water-intake-tracker')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setGoal(data.goal || 8)
        setGlassSize(data.glassSize || 250)
        setLogs(data.logs || [])
      } catch (e) {
        console.error('Failed to load water data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('water-intake-tracker', JSON.stringify({ goal, glassSize, logs }))
  }, [goal, glassSize, logs])

  const todayLog = logs.find(l => l.date === today)
  const todayGlasses = todayLog?.glasses || 0
  const progress = Math.min((todayGlasses / goal) * 100, 100)
  const todayMl = todayGlasses * glassSize

  const addGlass = () => {
    setLogs(logs => {
      const existing = logs.find(l => l.date === today)
      if (existing) {
        return logs.map(l =>
          l.date === today ? { ...l, glasses: l.glasses + 1 } : l
        )
      }
      return [...logs, { date: today, glasses: 1 }]
    })
  }

  const removeGlass = () => {
    setLogs(logs => {
      const existing = logs.find(l => l.date === today)
      if (existing && existing.glasses > 0) {
        return logs.map(l =>
          l.date === today ? { ...l, glasses: l.glasses - 1 } : l
        )
      }
      return logs
    })
  }

  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const log = logs.find(l => l.date === dateStr)
      days.push({
        date: dateStr,
        day: d.toLocaleDateString('en', { weekday: 'short' }),
        glasses: log?.glasses || 0,
      })
    }
    return days
  }

  const weekData = getLast7Days()
  const weekAverage = weekData.reduce((sum, d) => sum + d.glasses, 0) / 7

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="text-center">
          <div className="relative w-48 h-48 mx-auto mb-4">
            {/* Water glass visual */}
            <svg viewBox="0 0 100 120" className="w-full h-full">
              <defs>
                <clipPath id="glassClip">
                  <path d="M20,20 L80,20 L75,110 L25,110 Z" />
                </clipPath>
              </defs>
              {/* Glass outline */}
              <path
                d="M20,20 L80,20 L75,110 L25,110 Z"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="3"
              />
              {/* Water fill */}
              <rect
                x="20"
                y={20 + 90 * (1 - progress / 100)}
                width="60"
                height={90 * (progress / 100)}
                fill="#3b82f6"
                clipPath="url(#glassClip)"
                opacity="0.6"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          </div>

          <div className="text-2xl font-bold text-slate-800 mb-1">
            {todayGlasses} / {goal} {t('tools.waterIntake.glasses')}
          </div>
          <div className="text-slate-500 mb-4">
            {todayMl} ml / {goal * glassSize} ml
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={removeGlass}
              disabled={todayGlasses === 0}
              className="w-16 h-16 rounded-full bg-slate-200 text-2xl font-bold hover:bg-slate-300 disabled:opacity-50"
            >
              -
            </button>
            <button
              onClick={addGlass}
              className="w-16 h-16 rounded-full bg-blue-500 text-white text-2xl font-bold hover:bg-blue-600"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.waterIntake.weeklyProgress')}
        </h3>
        <div className="flex items-end gap-2 h-32">
          {weekData.map(day => (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              <div className="flex-1 w-full flex items-end">
                <div
                  className={`w-full rounded-t ${
                    day.date === today ? 'bg-blue-500' : 'bg-blue-200'
                  }`}
                  style={{
                    height: `${Math.min((day.glasses / goal) * 100, 100)}%`,
                    minHeight: day.glasses > 0 ? '4px' : '0',
                  }}
                />
              </div>
              <div className="text-xs text-slate-500 mt-1">{day.day}</div>
              <div className="text-xs font-medium">{day.glasses}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 text-center text-sm text-slate-500">
          {t('tools.waterIntake.weeklyAverage')}: {weekAverage.toFixed(1)} {t('tools.waterIntake.glasses')}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.waterIntake.settings')}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.waterIntake.dailyGoal')}
            </label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(Math.max(1, parseInt(e.target.value) || 8))}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.waterIntake.glassSize')} (ml)
            </label>
            <input
              type="number"
              value={glassSize}
              onChange={(e) => setGlassSize(Math.max(50, parseInt(e.target.value) || 250))}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.waterIntake.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.waterIntake.tip1')}</li>
          <li>{t('tools.waterIntake.tip2')}</li>
          <li>{t('tools.waterIntake.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
