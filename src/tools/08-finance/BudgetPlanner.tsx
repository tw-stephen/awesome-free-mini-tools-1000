import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface BudgetCategory {
  id: number
  name: string
  budgeted: number
  spent: number
}

export default function BudgetPlanner() {
  const { t } = useTranslation()
  const [income, setIncome] = useState('')
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: 1, name: 'Housing', budgeted: 0, spent: 0 },
    { id: 2, name: 'Food', budgeted: 0, spent: 0 },
    { id: 3, name: 'Transportation', budgeted: 0, spent: 0 },
    { id: 4, name: 'Utilities', budgeted: 0, spent: 0 },
    { id: 5, name: 'Entertainment', budgeted: 0, spent: 0 },
    { id: 6, name: 'Savings', budgeted: 0, spent: 0 },
  ])
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('budget-planner')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setIncome(data.income || '')
        setCategories(data.categories || categories)
      } catch (e) {
        console.error('Failed to load budget')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('budget-planner', JSON.stringify({ income, categories }))
  }, [income, categories])

  const addCategory = () => {
    if (!newCategory) return
    setCategories([...categories, { id: Date.now(), name: newCategory, budgeted: 0, spent: 0 }])
    setNewCategory('')
  }

  const updateCategory = (id: number, field: 'budgeted' | 'spent', value: number) => {
    setCategories(categories.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ))
  }

  const deleteCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id))
  }

  const stats = useMemo(() => {
    const totalIncome = parseFloat(income) || 0
    const totalBudgeted = categories.reduce((sum, c) => sum + c.budgeted, 0)
    const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0)
    const remaining = totalIncome - totalSpent
    const unallocated = totalIncome - totalBudgeted
    return { totalIncome, totalBudgeted, totalSpent, remaining, unallocated }
  }, [income, categories])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t('tools.budgetPlanner.monthlyIncome')}
        </label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder="5000"
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
        />
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-2 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">${stats.remaining.toFixed(0)}</div>
            <div className="text-xs text-slate-500">{t('tools.budgetPlanner.remaining')}</div>
          </div>
          <div className="p-2 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-600">${stats.unallocated.toFixed(0)}</div>
            <div className="text-xs text-slate-500">{t('tools.budgetPlanner.unallocated')}</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="text-lg font-bold text-slate-600">${stats.totalBudgeted.toFixed(0)}</div>
            <div className="text-xs text-slate-500">{t('tools.budgetPlanner.budgeted')}</div>
          </div>
          <div className="p-2 bg-red-50 rounded">
            <div className="text-lg font-bold text-red-600">${stats.totalSpent.toFixed(0)}</div>
            <div className="text-xs text-slate-500">{t('tools.budgetPlanner.spent')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.budgetPlanner.categories')}
        </h3>
        <div className="space-y-3">
          {categories.map(cat => {
            const progress = cat.budgeted > 0 ? (cat.spent / cat.budgeted) * 100 : 0
            const isOver = cat.spent > cat.budgeted
            return (
              <div key={cat.id} className="p-3 bg-slate-50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">{cat.name}</span>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="text-slate-400 hover:text-red-500 text-sm"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-xs text-slate-500">{t('tools.budgetPlanner.budget')}</label>
                    <input
                      type="number"
                      value={cat.budgeted || ''}
                      onChange={(e) => updateCategory(cat.id, 'budgeted', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">{t('tools.budgetPlanner.spent')}</label>
                    <input
                      type="number"
                      value={cat.spent || ''}
                      onChange={(e) => updateCategory(cat.id, 'spent', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                  </div>
                </div>
                <div className="h-2 bg-slate-200 rounded overflow-hidden">
                  <div
                    className={`h-full ${isOver ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
                <div className="text-xs text-right mt-1 text-slate-500">
                  ${cat.spent} / ${cat.budgeted} ({progress.toFixed(0)}%)
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder={t('tools.budgetPlanner.newCategory')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={addCategory}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
