import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface DayEntry {
  date: string
  steps: number
}

export default function StepCounter() {
  const { t } = useTranslation()
  const [todaySteps, setTodaySteps] = useState(0)
  const [dailyGoal, setDailyGoal] = useState(10000)
  const [history, setHistory] = useState<DayEntry[]>([])
  const [customAdd, setCustomAdd] = useState(1000)

  const quickAddAmounts = [500, 1000, 2000, 5000]

  const addSteps = (amount: number) => {
    setTodaySteps((prev) => prev + amount)
  }

  const removeSteps = (amount: number) => {
    setTodaySteps((prev) => Math.max(0, prev - amount))
  }

  const saveTodayAndReset = () => {
    if (todaySteps > 0) {
      const today = new Date().toISOString().split('T')[0]
      setHistory([...history.filter((h) => h.date !== today), { date: today, steps: todaySteps }])
      setTodaySteps(0)
    }
  }

  const percentage = Math.min((todaySteps / dailyGoal) * 100, 100)

  const calculateCalories = (steps: number): number => {
    // Approximate: 0.04 calories per step
    return Math.round(steps * 0.04)
  }

  const calculateDistance = (steps: number): number => {
    // Approximate: 0.762 meters per step (average stride length)
    return Math.round((steps * 0.762) / 10) / 100 // km with 2 decimals
  }

  const getWeeklyAverage = (): number => {
    if (history.length === 0) return 0
    const lastWeek = history.slice(-7)
    return Math.round(lastWeek.reduce((sum, d) => sum + d.steps, 0) / lastWeek.length)
  }

  const getMotivationalMessage = (): string => {
    if (percentage >= 100) return "Amazing! You've crushed your goal! 🎉"
    if (percentage >= 75) return "Almost there! Keep going! 💪"
    if (percentage >= 50) return "Halfway done! You got this! 🚶"
    if (percentage >= 25) return "Great start! Keep moving! 👍"
    return "Let's get stepping! 🚀"
  }

  const getStepIcon = (steps: number): string => {
    if (steps >= 15000) return '🏆'
    if (steps >= 10000) return '⭐'
    if (steps >= 7500) return '🌟'
    if (steps >= 5000) return '👟'
    return '🚶'
  }

  return (
    <div className="space-y-4">
      <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="text-6xl mb-2">{getStepIcon(todaySteps)}</div>
          <div className="text-5xl font-bold text-green-600">{todaySteps.toLocaleString()}</div>
          <div className="text-sm text-green-500 mt-1">{t('tools.stepCounter.steps')}</div>
        </div>

        <div className="relative h-4 bg-green-100 rounded-full overflow-hidden mt-4">
          <div
            className="absolute h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between mt-2 text-sm">
          <span className="text-green-600">{Math.round(percentage)}% of goal</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(parseInt(e.target.value) || 10000)}
              step={1000}
              className="w-20 px-2 py-1 text-right border border-green-300 rounded text-sm"
            />
            <span className="text-green-500">goal</span>
          </div>
        </div>

        <div className="text-center mt-3 text-green-700 font-medium">
          {getMotivationalMessage()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-3 text-center">
          <div className="text-lg font-bold text-blue-600">{calculateCalories(todaySteps)}</div>
          <div className="text-xs text-slate-500">{t('tools.stepCounter.calories')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-lg font-bold text-purple-600">{calculateDistance(todaySteps)} km</div>
          <div className="text-xs text-slate-500">{t('tools.stepCounter.distance')}</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.stepCounter.quickAdd')}</h3>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {quickAddAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => addSteps(amount)}
              className="py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 font-medium"
            >
              +{amount >= 1000 ? `${amount / 1000}k` : amount}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            value={customAdd}
            onChange={(e) => setCustomAdd(parseInt(e.target.value) || 0)}
            step={100}
            min={0}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
            placeholder="Custom amount"
          />
          <button
            onClick={() => addSteps(customAdd)}
            disabled={customAdd <= 0}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-slate-300"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => removeSteps(500)}
          className="flex-1 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
        >
          -500 steps
        </button>
        <button
          onClick={saveTodayAndReset}
          disabled={todaySteps === 0}
          className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
        >
          Save & Reset
        </button>
      </div>

      {history.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{t('tools.stepCounter.history')}</h3>
            <div className="text-sm text-slate-500">
              Weekly avg: <span className="font-medium">{getWeeklyAverage().toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history
              .slice()
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((entry) => (
                <div key={entry.date} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-sm">
                    {new Date(entry.date + 'T00:00').toLocaleDateString('default', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{entry.steps.toLocaleString()}</span>
                    {entry.steps >= dailyGoal && <span>⭐</span>}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-emerald-50">
        <h3 className="font-medium text-emerald-700 mb-2">{t('tools.stepCounter.benefits')}</h3>
        <ul className="text-sm text-emerald-600 space-y-1">
          <li>• 10,000 steps ≈ 5 miles / 8 km</li>
          <li>• Walking improves heart health</li>
          <li>• Regular walking reduces stress</li>
          <li>• Take the stairs when possible</li>
        </ul>
      </div>
    </div>
  )
}
