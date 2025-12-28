import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Goal {
  id: number
  name: string
  targetAmount: number
  currentAmount: number
  deadline?: string
  monthlyContribution?: number
}

export default function SavingsGoalTracker() {
  const { t } = useTranslation()
  const [goals, setGoals] = useState<Goal[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '' })

  useEffect(() => {
    const saved = localStorage.getItem('savings-goals')
    if (saved) {
      try {
        setGoals(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load goals')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('savings-goals', JSON.stringify(goals))
  }, [goals])

  const addGoal = () => {
    if (!newGoal.name || !newGoal.target) return
    const goal: Goal = {
      id: Date.now(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.target),
      currentAmount: 0,
      deadline: newGoal.deadline || undefined,
    }
    setGoals([...goals, goal])
    setNewGoal({ name: '', target: '', deadline: '' })
    setShowAdd(false)
  }

  const addSavings = (id: number, amount: number) => {
    setGoals(goals.map(g =>
      g.id === id ? { ...g, currentAmount: Math.max(0, g.currentAmount + amount) } : g
    ))
  }

  const deleteGoal = (id: number) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  const getProgress = (goal: Goal) => {
    return Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
  }

  const totalStats = useMemo(() => {
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
    const completed = goals.filter(g => g.currentAmount >= g.targetAmount).length
    return { totalTarget, totalSaved, completed }
  }, [goals])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-600">${totalStats.totalSaved.toFixed(0)}</div>
            <div className="text-xs text-slate-500">{t('tools.savingsGoalTracker.saved')}</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="text-lg font-bold text-slate-600">${totalStats.totalTarget.toFixed(0)}</div>
            <div className="text-xs text-slate-500">{t('tools.savingsGoalTracker.target')}</div>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">{totalStats.completed}</div>
            <div className="text-xs text-slate-500">{t('tools.savingsGoalTracker.completed')}</div>
          </div>
        </div>
      </div>

      {!showAdd ? (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          + {t('tools.savingsGoalTracker.addGoal')}
        </button>
      ) : (
        <div className="card p-4 space-y-3">
          <input
            type="text"
            value={newGoal.name}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            placeholder={t('tools.savingsGoalTracker.goalName')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              placeholder={t('tools.savingsGoalTracker.targetAmount')}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={addGoal}
              className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t('tools.savingsGoalTracker.add')}
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
            >
              {t('tools.savingsGoalTracker.cancel')}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {goals.map(goal => (
          <div key={goal.id} className="card p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium">{goal.name}</div>
                {goal.deadline && (
                  <div className="text-xs text-slate-500">
                    {t('tools.savingsGoalTracker.deadline')}: {goal.deadline}
                  </div>
                )}
              </div>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="text-slate-400 hover:text-red-500"
              >
                ×
              </button>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</span>
                <span>{getProgress(goal).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded overflow-hidden">
                <div
                  className={`h-full ${getProgress(goal) >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${getProgress(goal)}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              {[10, 50, 100].map(amount => (
                <button
                  key={amount}
                  onClick={() => addSavings(goal.id, amount)}
                  className="flex-1 py-1 bg-green-100 text-green-600 rounded text-sm hover:bg-green-200"
                >
                  +${amount}
                </button>
              ))}
              <button
                onClick={() => addSavings(goal.id, -10)}
                className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
              >
                -$10
              </button>
            </div>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          {t('tools.savingsGoalTracker.noGoals')}
        </div>
      )}
    </div>
  )
}
