import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface DayLog {
  date: string
  steps: number
}

export default function StepCounter() {
  const { t } = useTranslation()
  const [logs, setLogs] = useState<DayLog[]>([])
  const [todaySteps, setTodaySteps] = useState(0)
  const [goal, setGoal] = useState(10000)
  const [addAmount, setAddAmount] = useState('')
  const [today] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    const saved = localStorage.getItem('step-counter')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setLogs(data.logs || [])
        setGoal(data.goal || 10000)
        const todayLog = data.logs?.find((l: DayLog) => l.date === today)
        if (todayLog) setTodaySteps(todayLog.steps)
      } catch (e) {
        console.error('Failed to load step data')
      }
    }
  }, [today])

  useEffect(() => {
    const updatedLogs = logs.filter(l => l.date !== today)
    if (todaySteps > 0) {
      updatedLogs.unshift({ date: today, steps: todaySteps })
    }
    localStorage.setItem('step-counter', JSON.stringify({ logs: updatedLogs, goal }))
  }, [todaySteps, logs, goal, today])

  const addSteps = (amount: number) => {
    setTodaySteps(prev => prev + amount)
  }

  const resetToday = () => {
    setTodaySteps(0)
  }

  const percentage = Math.min((todaySteps / goal) * 100, 100)
  const calories = Math.round(todaySteps * 0.04)
  const distance = (todaySteps * 0.0008).toFixed(2)

  const last7Days = logs.slice(0, 7)
  const weeklyTotal = last7Days.reduce((sum, l) => sum + l.steps, 0) + todaySteps
  const avgSteps = Math.round(weeklyTotal / Math.max(last7Days.length + 1, 1))

  const quickAddAmounts = [500, 1000, 2000, 5000]

  return (
    <div className="space-y-4">
      <div className="card p-6 text-center">
        <div className="relative w-48 h-48 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="12"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke={percentage >= 100 ? '#22c55e' : '#3b82f6'}
              strokeWidth="12"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="text-4xl font-bold">{todaySteps.toLocaleString()}</div>
            <div className="text-sm text-slate-500">{t('tools.stepCounter.steps')}</div>
          </div>
        </div>

        <div className="text-sm text-slate-600 mb-4">
          {percentage >= 100 ? (
            <span className="text-green-600 font-medium">{t('tools.stepCounter.goalReached')} 🎉</span>
          ) : (
            <span>{(goal - todaySteps).toLocaleString()} {t('tools.stepCounter.stepsToGo')}</span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-bold text-orange-600">{calories}</div>
            <div className="text-xs text-slate-500">{t('tools.stepCounter.calories')}</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-bold text-blue-600">{distance}</div>
            <div className="text-xs text-slate-500">{t('tools.stepCounter.km')}</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-bold text-green-600">{Math.round(todaySteps / 1.4)}</div>
            <div className="text-xs text-slate-500">{t('tools.stepCounter.minutes')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.stepCounter.addSteps')}</h3>
        <div className="flex gap-2 flex-wrap mb-3">
          {quickAddAmounts.map(amount => (
            <button
              key={amount}
              onClick={() => addSteps(amount)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              +{amount.toLocaleString()}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            placeholder={t('tools.stepCounter.customAmount')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={() => { addSteps(parseInt(addAmount) || 0); setAddAmount('') }}
            disabled={!addAmount}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {t('tools.stepCounter.add')}
          </button>
        </div>
        <button
          onClick={resetToday}
          className="w-full mt-2 py-2 text-red-500 text-sm"
        >
          {t('tools.stepCounter.resetToday')}
        </button>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.stepCounter.dailyGoal')}</h3>
          <span className="text-blue-600 font-medium">{goal.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={1000}
          max={20000}
          step={1000}
          value={goal}
          onChange={(e) => setGoal(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>1,000</span>
          <span>20,000</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="card p-4 text-center bg-green-50">
          <div className="text-2xl font-bold text-green-600">{weeklyTotal.toLocaleString()}</div>
          <div className="text-xs text-slate-500">{t('tools.stepCounter.weeklyTotal')}</div>
        </div>
        <div className="card p-4 text-center bg-blue-50">
          <div className="text-2xl font-bold text-blue-600">{avgSteps.toLocaleString()}</div>
          <div className="text-xs text-slate-500">{t('tools.stepCounter.dailyAverage')}</div>
        </div>
      </div>

      {last7Days.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.stepCounter.history')}</h3>
          <div className="space-y-2">
            {last7Days.map(log => (
              <div key={log.date} className="flex justify-between items-center">
                <span className="text-sm text-slate-600">{log.date}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min((log.steps / goal) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-16 text-right">{log.steps.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
