import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type BudgetCategory = 'housing' | 'food' | 'transport' | 'utilities' | 'entertainment' | 'savings' | 'other'

interface BudgetItem {
  id: string
  name: string
  category: BudgetCategory
  planned: number
  actual: number
}

interface MonthlyBudget {
  month: string
  income: number
  items: BudgetItem[]
}

export default function BudgetPlanner() {
  const { t } = useTranslation()
  const [budgets, setBudgets] = useState<Record<string, MonthlyBudget>>({})
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7))
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    category: 'other' as BudgetCategory,
    planned: 0,
    actual: 0
  })

  const categories: BudgetCategory[] = ['housing', 'food', 'transport', 'utilities', 'entertainment', 'savings', 'other']

  const categoryColors: Record<BudgetCategory, string> = {
    housing: 'bg-blue-500',
    food: 'bg-orange-500',
    transport: 'bg-green-500',
    utilities: 'bg-yellow-500',
    entertainment: 'bg-purple-500',
    savings: 'bg-emerald-500',
    other: 'bg-slate-500'
  }

  const categoryEmoji: Record<BudgetCategory, string> = {
    housing: '🏠',
    food: '🍔',
    transport: '🚗',
    utilities: '💡',
    entertainment: '🎬',
    savings: '💰',
    other: '📦'
  }

  useEffect(() => {
    const saved = localStorage.getItem('budget-planner')
    if (saved) setBudgets(JSON.parse(saved))
  }, [])

  const saveBudgets = (updated: Record<string, MonthlyBudget>) => {
    setBudgets(updated)
    localStorage.setItem('budget-planner', JSON.stringify(updated))
  }

  const getCurrentBudget = (): MonthlyBudget => {
    return budgets[currentMonth] || { month: currentMonth, income: 0, items: [] }
  }

  const updateIncome = (income: number) => {
    const budget = getCurrentBudget()
    saveBudgets({ ...budgets, [currentMonth]: { ...budget, income } })
  }

  const addItem = () => {
    if (!form.name || form.planned <= 0) return
    const budget = getCurrentBudget()
    const item: BudgetItem = {
      id: Date.now().toString(),
      name: form.name,
      category: form.category,
      planned: form.planned,
      actual: form.actual
    }
    saveBudgets({
      ...budgets,
      [currentMonth]: { ...budget, items: [...budget.items, item] }
    })
    setForm({ name: '', category: 'other', planned: 0, actual: 0 })
    setShowForm(false)
  }

  const updateItem = (id: string, field: 'planned' | 'actual', value: number) => {
    const budget = getCurrentBudget()
    saveBudgets({
      ...budgets,
      [currentMonth]: {
        ...budget,
        items: budget.items.map(item =>
          item.id === id ? { ...item, [field]: value } : item
        )
      }
    })
  }

  const deleteItem = (id: string) => {
    const budget = getCurrentBudget()
    saveBudgets({
      ...budgets,
      [currentMonth]: {
        ...budget,
        items: budget.items.filter(item => item.id !== id)
      }
    })
  }

  const budget = getCurrentBudget()

  const stats = useMemo(() => {
    const totalPlanned = budget.items.reduce((sum, i) => sum + i.planned, 0)
    const totalActual = budget.items.reduce((sum, i) => sum + i.actual, 0)
    const remaining = budget.income - totalActual
    const savingsRate = budget.income > 0 ? Math.round((remaining / budget.income) * 100) : 0
    return { totalPlanned, totalActual, remaining, savingsRate }
  }, [budget])

  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<BudgetCategory, { planned: number; actual: number }> = {
      housing: { planned: 0, actual: 0 },
      food: { planned: 0, actual: 0 },
      transport: { planned: 0, actual: 0 },
      utilities: { planned: 0, actual: 0 },
      entertainment: { planned: 0, actual: 0 },
      savings: { planned: 0, actual: 0 },
      other: { planned: 0, actual: 0 }
    }
    budget.items.forEach(item => {
      breakdown[item.category].planned += item.planned
      breakdown[item.category].actual += item.actual
    })
    return breakdown
  }, [budget])

  const navigateMonth = (direction: number) => {
    const date = new Date(currentMonth + '-01')
    date.setMonth(date.getMonth() + direction)
    setCurrentMonth(date.toISOString().slice(0, 7))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigateMonth(-1)} className="px-3 py-1 bg-slate-100 rounded">←</button>
        <span className="font-medium">
          {new Date(currentMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={() => navigateMonth(1)} className="px-3 py-1 bg-slate-100 rounded">→</button>
      </div>

      <div className="card p-4">
        <label className="text-sm text-slate-600">{t('tools.budgetPlanner.monthlyIncome')}</label>
        <input
          type="number"
          value={budget.income || ''}
          onChange={(e) => updateIncome(parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="w-full px-3 py-2 border border-slate-300 rounded text-lg font-medium mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="card p-3 text-center">
          <div className="text-xs text-slate-500">{t('tools.budgetPlanner.planned')}</div>
          <div className="text-lg font-bold">${stats.totalPlanned.toFixed(2)}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xs text-slate-500">{t('tools.budgetPlanner.actual')}</div>
          <div className="text-lg font-bold">${stats.totalActual.toFixed(2)}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xs text-slate-500">{t('tools.budgetPlanner.remaining')}</div>
          <div className={`text-lg font-bold ${stats.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${stats.remaining.toFixed(2)}
          </div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xs text-slate-500">{t('tools.budgetPlanner.savingsRate')}</div>
          <div className="text-lg font-bold">{stats.savingsRate}%</div>
        </div>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full py-2 bg-blue-500 text-white rounded font-medium"
      >
        + {t('tools.budgetPlanner.addItem')}
      </button>

      {showForm && (
        <div className="card p-4 space-y-3">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t('tools.budgetPlanner.itemName')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setForm({ ...form, category: cat })}
                className={`px-3 py-1 rounded text-sm ${
                  form.category === cat ? `${categoryColors[cat]} text-white` : 'bg-slate-100'
                }`}
              >
                {categoryEmoji[cat]} {t(`tools.budgetPlanner.${cat}`)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500">{t('tools.budgetPlanner.planned')}</label>
              <input
                type="number"
                value={form.planned || ''}
                onChange={(e) => setForm({ ...form, planned: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">{t('tools.budgetPlanner.actual')}</label>
              <input
                type="number"
                value={form.actual || ''}
                onChange={(e) => setForm({ ...form, actual: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>
          <button
            onClick={addItem}
            disabled={!form.name || form.planned <= 0}
            className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {t('tools.budgetPlanner.add')}
          </button>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.budgetPlanner.categoryBreakdown')}</h3>
        <div className="space-y-2">
          {categories.filter(cat => categoryBreakdown[cat].planned > 0 || categoryBreakdown[cat].actual > 0).map(cat => {
            const data = categoryBreakdown[cat]
            const percentage = data.planned > 0 ? Math.min((data.actual / data.planned) * 100, 100) : 0
            const isOver = data.actual > data.planned
            return (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{categoryEmoji[cat]} {t(`tools.budgetPlanner.${cat}`)}</span>
                  <span className={isOver ? 'text-red-500' : ''}>
                    ${data.actual.toFixed(0)} / ${data.planned.toFixed(0)}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded overflow-hidden">
                  <div
                    className={`h-full ${isOver ? 'bg-red-500' : categoryColors[cat]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {budget.items.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium text-slate-700 mb-3">{t('tools.budgetPlanner.items')}</h3>
          <div className="space-y-2">
            {budget.items.map(item => (
              <div key={item.id} className="p-2 bg-slate-50 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">
                    {categoryEmoji[item.category]} {item.name}
                  </span>
                  <button onClick={() => deleteItem(item.id)} className="text-red-500 text-sm">×</button>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={item.planned || ''}
                      onChange={(e) => updateItem(item.id, 'planned', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                      placeholder={t('tools.budgetPlanner.planned')}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={item.actual || ''}
                      onChange={(e) => updateItem(item.id, 'actual', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                      placeholder={t('tools.budgetPlanner.actual')}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
