import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  monthlyContribution: number
  interestRate: number
  deadline: string
  category: string
  priority: 'high' | 'medium' | 'low'
  notes: string
  createdAt: string
}

export default function SavingsGoalCalculator() {
  const { t } = useTranslation()
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [calculatorMode, setCalculatorMode] = useState<'howMuch' | 'howLong' | 'whatRate'>('howMuch')
  const [form, setForm] = useState<{
    name: string
    targetAmount: number
    currentAmount: number
    monthlyContribution: number
    interestRate: number
    deadline: string
    category: string
    priority: 'high' | 'medium' | 'low'
    notes: string
  }>({
    name: '',
    targetAmount: 10000,
    currentAmount: 0,
    monthlyContribution: 500,
    interestRate: 5,
    deadline: '',
    category: 'general',
    priority: 'medium',
    notes: ''
  })

  const categories = ['general', 'emergency', 'vacation', 'home', 'car', 'education', 'retirement', 'other']

  useEffect(() => {
    const saved = localStorage.getItem('savings-goals')
    if (saved) setGoals(JSON.parse(saved))
  }, [])

  const saveGoals = (updated: SavingsGoal[]) => {
    setGoals(updated)
    localStorage.setItem('savings-goals', JSON.stringify(updated))
  }

  const calculateMonthlyNeeded = (target: number, current: number, months: number, rate: number): number => {
    if (months <= 0) return 0
    const monthlyRate = rate / 100 / 12
    const remaining = target - current * Math.pow(1 + monthlyRate, months)
    if (monthlyRate === 0) return remaining / months
    return remaining * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1)
  }

  const calculateMonthsNeeded = (target: number, current: number, monthly: number, rate: number): number => {
    if (monthly <= 0) return Infinity
    const monthlyRate = rate / 100 / 12
    if (monthlyRate === 0) return Math.ceil((target - current) / monthly)
    return Math.ceil(Math.log((target * monthlyRate + monthly) / (current * monthlyRate + monthly)) / Math.log(1 + monthlyRate))
  }

  const calculateFutureValue = (current: number, monthly: number, months: number, rate: number): number => {
    const monthlyRate = rate / 100 / 12
    const fvPresent = current * Math.pow(1 + monthlyRate, months)
    const fvContributions = monthly * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate
    return fvPresent + (monthlyRate > 0 ? fvContributions : monthly * months)
  }

  const calculations = useMemo(() => {
    const monthsToDeadline = form.deadline
      ? Math.max(0, Math.ceil((new Date(form.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)))
      : 0

    const monthlyNeeded = monthsToDeadline > 0
      ? calculateMonthlyNeeded(form.targetAmount, form.currentAmount, monthsToDeadline, form.interestRate)
      : 0

    const monthsNeeded = calculateMonthsNeeded(form.targetAmount, form.currentAmount, form.monthlyContribution, form.interestRate)

    const projectedDate = new Date()
    projectedDate.setMonth(projectedDate.getMonth() + monthsNeeded)

    const remaining = form.targetAmount - form.currentAmount
    const progress = form.targetAmount > 0 ? (form.currentAmount / form.targetAmount) * 100 : 0

    return {
      monthsToDeadline,
      monthlyNeeded,
      monthsNeeded: isFinite(monthsNeeded) ? monthsNeeded : 0,
      projectedDate: projectedDate.toISOString().split('T')[0],
      remaining,
      progress,
      futureValue: calculateFutureValue(form.currentAmount, form.monthlyContribution, 12, form.interestRate)
    }
  }, [form])

  const addGoal = () => {
    if (!form.name) return
    const goal: SavingsGoal = {
      id: editingId || Date.now().toString(),
      ...form,
      createdAt: new Date().toISOString()
    }
    if (editingId) {
      saveGoals(goals.map(g => g.id === editingId ? goal : g))
    } else {
      saveGoals([...goals, goal])
    }
    resetForm()
  }

  const resetForm = () => {
    setForm({
      name: '',
      targetAmount: 10000,
      currentAmount: 0,
      monthlyContribution: 500,
      interestRate: 5,
      deadline: '',
      category: 'general',
      priority: 'medium',
      notes: ''
    })
    setShowForm(false)
    setEditingId(null)
  }

  const startEdit = (goal: SavingsGoal) => {
    setForm({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      monthlyContribution: goal.monthlyContribution,
      interestRate: goal.interestRate,
      deadline: goal.deadline,
      category: goal.category,
      priority: goal.priority,
      notes: goal.notes
    })
    setEditingId(goal.id)
    setShowForm(true)
  }

  const updateGoalAmount = (id: string, amount: number) => {
    saveGoals(goals.map(g => g.id === id ? { ...g, currentAmount: Math.max(0, g.currentAmount + amount) } : g))
  }

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter(g => g.id !== id))
  }

  const totalSavings = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)

  const priorityColors: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-blue-600">{goals.length}</div>
          <div className="text-xs text-slate-500">{t('tools.savingsGoalCalculator.goals')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-green-600">{formatCurrency(totalSavings)}</div>
          <div className="text-xs text-slate-500">{t('tools.savingsGoalCalculator.saved')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-purple-600">{formatCurrency(totalTarget)}</div>
          <div className="text-xs text-slate-500">{t('tools.savingsGoalCalculator.target')}</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.savingsGoalCalculator.calculator')}</h3>
        <div className="flex gap-2 mb-4">
          {(['howMuch', 'howLong', 'whatRate'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setCalculatorMode(mode)}
              className={`flex-1 py-2 rounded text-sm ${
                calculatorMode === mode ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.savingsGoalCalculator.${mode}`)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500 block mb-1">{t('tools.savingsGoalCalculator.targetAmount')}</label>
              <input
                type="number"
                value={form.targetAmount}
                onChange={(e) => setForm({ ...form, targetAmount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">{t('tools.savingsGoalCalculator.currentSavings')}</label>
              <input
                type="number"
                value={form.currentAmount}
                onChange={(e) => setForm({ ...form, currentAmount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500 block mb-1">{t('tools.savingsGoalCalculator.monthlyContribution')}</label>
              <input
                type="number"
                value={form.monthlyContribution}
                onChange={(e) => setForm({ ...form, monthlyContribution: parseFloat(e.target.value) || 0 })}
                disabled={calculatorMode === 'howMuch'}
                className="w-full px-3 py-2 border border-slate-300 rounded disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">{t('tools.savingsGoalCalculator.interestRate')} (%)</label>
              <input
                type="number"
                value={form.interestRate}
                onChange={(e) => setForm({ ...form, interestRate: parseFloat(e.target.value) || 0 })}
                step="0.1"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>
          {calculatorMode !== 'howLong' && (
            <div>
              <label className="text-xs text-slate-500 block mb-1">{t('tools.savingsGoalCalculator.deadline')}</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded">
          {calculatorMode === 'howMuch' && calculations.monthsToDeadline > 0 && (
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-1">{t('tools.savingsGoalCalculator.monthlyNeeded')}</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(Math.max(0, calculations.monthlyNeeded))}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {calculations.monthsToDeadline} {t('tools.savingsGoalCalculator.monthsRemaining')}
              </div>
            </div>
          )}
          {calculatorMode === 'howLong' && (
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-1">{t('tools.savingsGoalCalculator.timeToGoal')}</div>
              <div className="text-2xl font-bold text-blue-600">
                {calculations.monthsNeeded} {t('tools.savingsGoalCalculator.monthsText')}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {t('tools.savingsGoalCalculator.projectedDate')}: {calculations.projectedDate}
              </div>
            </div>
          )}
          {calculatorMode === 'whatRate' && (
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-1">{t('tools.savingsGoalCalculator.oneYearValue')}</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(calculations.futureValue)}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {t('tools.savingsGoalCalculator.withInterest')}: {formatCurrency(calculations.futureValue - form.currentAmount - form.monthlyContribution * 12)}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full py-2 bg-blue-500 text-white rounded"
      >
        + {t('tools.savingsGoalCalculator.addGoal')}
      </button>

      {showForm && (
        <div className="card p-4 space-y-3">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t('tools.savingsGoalCalculator.goalName')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {categories.map(c => (
                <option key={c} value={c}>{t(`tools.savingsGoalCalculator.${c}`)}</option>
              ))}
            </select>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as SavingsGoal['priority'] })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              <option value="high">{t('tools.savingsGoalCalculator.high')}</option>
              <option value="medium">{t('tools.savingsGoalCalculator.medium')}</option>
              <option value="low">{t('tools.savingsGoalCalculator.low')}</option>
            </select>
          </div>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder={t('tools.savingsGoalCalculator.notes')}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <button onClick={resetForm} className="py-2 bg-slate-100 rounded">
              {t('tools.savingsGoalCalculator.cancel')}
            </button>
            <button
              onClick={addGoal}
              disabled={!form.name}
              className="py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {editingId ? t('tools.savingsGoalCalculator.update') : t('tools.savingsGoalCalculator.save')}
            </button>
          </div>
        </div>
      )}

      {goals.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium text-slate-700 mb-3">{t('tools.savingsGoalCalculator.yourGoals')}</h3>
          <div className="space-y-3">
            {goals.map(goal => {
              const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
              return (
                <div key={goal.id} className="p-3 bg-slate-50 rounded">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{goal.name}</div>
                      <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[goal.priority]}`}>
                        {goal.priority}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{formatCurrency(goal.currentAmount)}</div>
                      <div className="text-xs text-slate-500">of {formatCurrency(goal.targetAmount)}</div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="h-2 bg-slate-200 rounded overflow-hidden">
                      <div
                        className={`h-full ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(100, progress)}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{progress.toFixed(1)}%</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateGoalAmount(goal.id, 100)}
                      className="text-green-500 text-xs"
                    >
                      +$100
                    </button>
                    <button onClick={() => startEdit(goal)} className="text-blue-500 text-xs">
                      {t('tools.savingsGoalCalculator.edit')}
                    </button>
                    <button onClick={() => deleteGoal(goal.id)} className="text-red-500 text-xs">
                      {t('tools.savingsGoalCalculator.delete')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
