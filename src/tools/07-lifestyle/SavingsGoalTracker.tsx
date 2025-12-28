import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface SavingsGoal {
  id: number
  name: string
  targetAmount: number
  currentAmount: number
  deadline?: string
  icon: string
  contributions: Contribution[]
}

interface Contribution {
  id: number
  amount: number
  date: string
}

export default function SavingsGoalTracker() {
  const { t } = useTranslation()
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null)
  const [contributionAmount, setContributionAmount] = useState('')
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    icon: '🎯',
  })

  const icons = ['🎯', '🏠', '🚗', '✈️', '💻', '📱', '🎓', '💍', '🏖️', '🎁', '💰', '📦']

  useEffect(() => {
    const saved = localStorage.getItem('savings-goal-tracker')
    if (saved) {
      try {
        setGoals(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load goals')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('savings-goal-tracker', JSON.stringify(goals))
  }, [goals])

  const addGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) return
    const goal: SavingsGoal = {
      id: Date.now(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      deadline: newGoal.deadline || undefined,
      icon: newGoal.icon,
      contributions: [],
    }
    setGoals([...goals, goal])
    setNewGoal({ name: '', targetAmount: '', deadline: '', icon: '🎯' })
    setShowAddGoal(false)
  }

  const deleteGoal = (id: number) => {
    setGoals(goals.filter(g => g.id !== id))
    if (selectedGoal === id) setSelectedGoal(null)
  }

  const addContribution = () => {
    if (!selectedGoal || !contributionAmount) return
    const amount = parseFloat(contributionAmount)
    if (isNaN(amount) || amount <= 0) return

    setGoals(goals.map(goal => {
      if (goal.id !== selectedGoal) return goal
      const contribution: Contribution = {
        id: Date.now(),
        amount,
        date: new Date().toISOString().split('T')[0],
      }
      return {
        ...goal,
        currentAmount: goal.currentAmount + amount,
        contributions: [contribution, ...goal.contributions],
      }
    }))
    setContributionAmount('')
  }

  const getProgress = (goal: SavingsGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  }

  const getDaysRemaining = (deadline?: string) => {
    if (!deadline) return null
    const target = new Date(deadline)
    const today = new Date()
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getMonthlySavingsNeeded = (goal: SavingsGoal) => {
    if (!goal.deadline) return null
    const remaining = goal.targetAmount - goal.currentAmount
    const days = getDaysRemaining(goal.deadline) || 0
    if (days <= 0) return null
    const months = days / 30
    return remaining / months
  }

  const stats = useMemo(() => {
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
    const completed = goals.filter(g => g.currentAmount >= g.targetAmount).length

    return { totalTarget, totalSaved, completed, total: goals.length }
  }, [goals])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalSaved)}
            </div>
            <div className="text-xs text-slate-500">{t('tools.savingsGoal.totalSaved')}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.totalTarget)}
            </div>
            <div className="text-xs text-slate-500">{t('tools.savingsGoal.totalTarget')}</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-sm text-slate-500 mb-1">
            <span>{t('tools.savingsGoal.overallProgress')}</span>
            <span>{stats.totalTarget > 0 ? Math.round((stats.totalSaved / stats.totalTarget) * 100) : 0}%</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${stats.totalTarget > 0 ? (stats.totalSaved / stats.totalTarget) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {!showAddGoal ? (
        <button
          onClick={() => setShowAddGoal(true)}
          className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
        >
          + {t('tools.savingsGoal.addGoal')}
        </button>
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.savingsGoal.newGoal')}
          </h3>
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {icons.map(icon => (
                <button
                  key={icon}
                  onClick={() => setNewGoal({ ...newGoal, icon })}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    newGoal.icon === icon ? 'ring-2 ring-green-500 bg-green-50' : 'bg-slate-100'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              placeholder={t('tools.savingsGoal.goalName')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                placeholder={t('tools.savingsGoal.targetAmount')}
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
                className="flex-1 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600"
              >
                {t('tools.savingsGoal.create')}
              </button>
              <button
                onClick={() => setShowAddGoal(false)}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                {t('tools.savingsGoal.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          {t('tools.savingsGoal.noGoals')}
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map(goal => {
            const progress = getProgress(goal)
            const isComplete = goal.currentAmount >= goal.targetAmount
            const daysRemaining = getDaysRemaining(goal.deadline)
            const monthlyNeeded = getMonthlySavingsNeeded(goal)
            const isSelected = selectedGoal === goal.id

            return (
              <div key={goal.id} className="card p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{goal.icon}</span>
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {goal.name}
                        {isComplete && <span className="text-green-500">✓</span>}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">
                      {formatCurrency(goal.targetAmount - goal.currentAmount)} {t('tools.savingsGoal.remaining')}
                    </span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {goal.deadline && !isComplete && (
                  <div className="text-sm text-slate-500 mb-3">
                    {daysRemaining !== null && daysRemaining > 0 ? (
                      <>
                        {daysRemaining} {t('tools.savingsGoal.daysLeft')}
                        {monthlyNeeded && ` • ${formatCurrency(monthlyNeeded)}/month needed`}
                      </>
                    ) : (
                      <span className="text-red-500">{t('tools.savingsGoal.overdue')}</span>
                    )}
                  </div>
                )}

                {!isComplete && (
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setSelectedGoal(isSelected ? null : goal.id)}
                      className={`flex-1 py-2 rounded text-sm ${
                        isSelected ? 'bg-green-500 text-white' : 'bg-slate-100'
                      }`}
                    >
                      + {t('tools.savingsGoal.addMoney')}
                    </button>
                  </div>
                )}

                {isSelected && (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="number"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      placeholder={t('tools.savingsGoal.amount')}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
                    />
                    <button
                      onClick={addContribution}
                      className="px-4 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600"
                    >
                      {t('tools.savingsGoal.add')}
                    </button>
                  </div>
                )}

                {goal.contributions.length > 0 && (
                  <div className="text-sm">
                    <div className="text-slate-500 mb-1">{t('tools.savingsGoal.recentContributions')}</div>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {goal.contributions.slice(0, 3).map(c => (
                        <div key={c.id} className="flex justify-between text-slate-600">
                          <span>{c.date}</span>
                          <span className="text-green-600">+{formatCurrency(c.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.savingsGoal.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.savingsGoal.tip1')}</li>
          <li>{t('tools.savingsGoal.tip2')}</li>
          <li>{t('tools.savingsGoal.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
