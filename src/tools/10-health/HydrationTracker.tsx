import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface HydrationLog {
  date: string
  intakes: { time: string; amount: number; type: string }[]
}

export default function HydrationTracker() {
  const { t } = useTranslation()
  const [log, setLog] = useState<HydrationLog | null>(null)
  const [goal, setGoal] = useState(2000)
  const [today] = useState(new Date().toISOString().split('T')[0])

  const drinkTypes = [
    { id: 'water', icon: '💧', amount: 250 },
    { id: 'coffee', icon: '☕', amount: 150 },
    { id: 'tea', icon: '🍵', amount: 200 },
    { id: 'juice', icon: '🧃', amount: 200 },
    { id: 'milk', icon: '🥛', amount: 250 },
    { id: 'soda', icon: '🥤', amount: 330 },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('hydration-tracker')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setGoal(data.goal || 2000)
        if (data.log?.date === today) {
          setLog(data.log)
        } else {
          setLog({ date: today, intakes: [] })
        }
      } catch (e) {
        console.error('Failed to load hydration data')
      }
    } else {
      setLog({ date: today, intakes: [] })
    }
  }, [today])

  useEffect(() => {
    localStorage.setItem('hydration-tracker', JSON.stringify({ log, goal }))
  }, [log, goal])

  const addIntake = (type: string, amount: number) => {
    if (!log) return
    const intake = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount,
      type,
    }
    setLog({ ...log, intakes: [...log.intakes, intake] })
  }

  const removeIntake = (index: number) => {
    if (!log) return
    setLog({ ...log, intakes: log.intakes.filter((_, i) => i !== index) })
  }

  const totalIntake = log?.intakes.reduce((sum, i) => sum + i.amount, 0) || 0
  const percentage = Math.min((totalIntake / goal) * 100, 100)

  const hourlyData = Array(24).fill(0)
  log?.intakes.forEach(intake => {
    const hour = parseInt(intake.time.split(':')[0])
    hourlyData[hour] += intake.amount
  })

  return (
    <div className="space-y-4">
      <div className="card p-6 text-center">
        <div className="relative w-48 h-48 mx-auto mb-4">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <path
              d="M50 5 C50 5, 85 40, 85 60 C85 80, 70 95, 50 95 C30 95, 15 80, 15 60 C15 40, 50 5, 50 5"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            <clipPath id="waterClip">
              <path d="M50 5 C50 5, 85 40, 85 60 C85 80, 70 95, 50 95 C30 95, 15 80, 15 60 C15 40, 50 5, 50 5" />
            </clipPath>
            <rect
              x="0"
              y={100 - percentage}
              width="100"
              height={percentage}
              fill="#3b82f6"
              clipPath="url(#waterClip)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col pt-8">
            <div className="text-2xl font-bold">{totalIntake}</div>
            <div className="text-xs text-slate-500">/ {goal} ml</div>
          </div>
        </div>

        <div className={`text-lg font-medium ${percentage >= 100 ? 'text-green-600' : 'text-blue-600'}`}>
          {percentage >= 100 ? t('tools.hydrationTracker.goalReached') : `${percentage.toFixed(0)}%`}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.hydrationTracker.quickAdd')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {drinkTypes.map(drink => (
            <button
              key={drink.id}
              onClick={() => addIntake(drink.id, drink.amount)}
              className="p-3 bg-slate-50 rounded text-center hover:bg-slate-100"
            >
              <div className="text-2xl">{drink.icon}</div>
              <div className="text-xs text-slate-500">{drink.amount}ml</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.hydrationTracker.dailyGoal')} (ml)
        </label>
        <input
          type="range"
          min={1000}
          max={4000}
          step={250}
          value={goal}
          onChange={(e) => setGoal(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm mt-1">
          <span className="text-slate-500">1L</span>
          <span className="text-blue-600 font-medium">{(goal / 1000).toFixed(1)}L</span>
          <span className="text-slate-500">4L</span>
        </div>
      </div>

      {log && log.intakes.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.hydrationTracker.todayLog')}</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {log.intakes.slice().reverse().map((intake, i) => {
              const drink = drinkTypes.find(d => d.id === intake.type)
              return (
                <div key={i} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{drink?.icon || '💧'}</span>
                    <div>
                      <div className="text-sm font-medium">{intake.amount}ml</div>
                      <div className="text-xs text-slate-500">{intake.time}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeIntake(log.intakes.length - 1 - i)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.hydrationTracker.tips')}</h3>
        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.hydrationTracker.tip1')}</li>
          <li>{t('tools.hydrationTracker.tip2')}</li>
          <li>{t('tools.hydrationTracker.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
