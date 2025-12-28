import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type Category = 'food' | 'transport' | 'entertainment' | 'shopping' | 'bills' | 'health' | 'education' | 'other'

interface Expense {
  id: string
  description: string
  amount: number
  category: Category
  date: string
  notes: string
}

export default function ExpenseTracker() {
  const { t } = useTranslation()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all')
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7))
  const [form, setForm] = useState({
    description: '',
    amount: 0,
    category: 'other' as Category,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const categories: Category[] = ['food', 'transport', 'entertainment', 'shopping', 'bills', 'health', 'education', 'other']

  const categoryColors: Record<Category, string> = {
    food: 'bg-orange-500',
    transport: 'bg-blue-500',
    entertainment: 'bg-purple-500',
    shopping: 'bg-pink-500',
    bills: 'bg-red-500',
    health: 'bg-green-500',
    education: 'bg-indigo-500',
    other: 'bg-slate-500'
  }

  const categoryEmoji: Record<Category, string> = {
    food: '🍔',
    transport: '🚗',
    entertainment: '🎬',
    shopping: '🛍️',
    bills: '📄',
    health: '💊',
    education: '📚',
    other: '📦'
  }

  useEffect(() => {
    const saved = localStorage.getItem('expense-tracker')
    if (saved) setExpenses(JSON.parse(saved))
  }, [])

  const saveExpenses = (updated: Expense[]) => {
    setExpenses(updated)
    localStorage.setItem('expense-tracker', JSON.stringify(updated))
  }

  const addExpense = () => {
    if (!form.description || form.amount <= 0) return
    const expense: Expense = {
      id: Date.now().toString(),
      ...form
    }
    saveExpenses([...expenses, expense])
    setForm({
      description: '',
      amount: 0,
      category: 'other',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    })
    setShowForm(false)
  }

  const deleteExpense = (id: string) => {
    saveExpenses(expenses.filter(e => e.id !== id))
  }

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchCategory = filterCategory === 'all' || e.category === filterCategory
      const matchMonth = e.date.startsWith(filterMonth)
      return matchCategory && matchMonth
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [expenses, filterCategory, filterMonth])

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<Category, number> = {
      food: 0, transport: 0, entertainment: 0, shopping: 0,
      bills: 0, health: 0, education: 0, other: 0
    }
    filteredExpenses.forEach(e => {
      breakdown[e.category] += e.amount
    })
    return breakdown
  }, [filteredExpenses])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded text-sm"
        >
          {Array.from({ length: 12 }, (_, i) => {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            const value = date.toISOString().slice(0, 7)
            return (
              <option key={value} value={value}>
                {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </option>
            )
          })}
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as Category | 'all')}
          className="px-3 py-2 border border-slate-300 rounded text-sm"
        >
          <option value="all">{t('tools.expenseTracker.allCategories')}</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {categoryEmoji[cat]} {t(`tools.expenseTracker.${cat}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="card p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="text-sm opacity-80">{t('tools.expenseTracker.totalExpenses')}</div>
        <div className="text-3xl font-bold">${totalExpenses.toFixed(2)}</div>
        <div className="text-sm opacity-80 mt-1">
          {filteredExpenses.length} {t('tools.expenseTracker.transactions')}
        </div>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        + {t('tools.expenseTracker.addExpense')}
      </button>

      {showForm && (
        <div className="card p-4 space-y-3">
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder={t('tools.expenseTracker.description')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={form.amount || ''}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              placeholder={t('tools.expenseTracker.amount')}
              min="0"
              step="0.01"
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setForm({ ...form, category: cat })}
                className={`px-3 py-1.5 rounded text-sm ${
                  form.category === cat ? `${categoryColors[cat]} text-white` : 'bg-slate-100'
                }`}
              >
                {categoryEmoji[cat]} {t(`tools.expenseTracker.${cat}`)}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder={t('tools.expenseTracker.notes')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="py-2 bg-slate-100 rounded"
            >
              {t('tools.expenseTracker.cancel')}
            </button>
            <button
              onClick={addExpense}
              disabled={!form.description || form.amount <= 0}
              className="py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.expenseTracker.add')}
            </button>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.expenseTracker.breakdown')}</h3>
        <div className="space-y-2">
          {categories.filter(cat => categoryBreakdown[cat] > 0).map(cat => (
            <div key={cat} className="flex items-center gap-2">
              <span className="w-8">{categoryEmoji[cat]}</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{t(`tools.expenseTracker.${cat}`)}</span>
                  <span>${categoryBreakdown[cat].toFixed(2)}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded overflow-hidden">
                  <div
                    className={`h-full ${categoryColors[cat]}`}
                    style={{ width: `${(categoryBreakdown[cat] / totalExpenses) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-slate-500 w-12 text-right">
                {((categoryBreakdown[cat] / totalExpenses) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.expenseTracker.recentExpenses')}</h3>
        {filteredExpenses.length === 0 ? (
          <p className="text-center text-slate-500 py-4">{t('tools.expenseTracker.noExpenses')}</p>
        ) : (
          <div className="space-y-2">
            {filteredExpenses.slice(0, 10).map(expense => (
              <div key={expense.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded flex items-center justify-center text-white ${categoryColors[expense.category]}`}>
                    {categoryEmoji[expense.category]}
                  </span>
                  <div>
                    <div className="text-sm font-medium">{expense.description}</div>
                    <div className="text-xs text-slate-500">{expense.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">${expense.amount.toFixed(2)}</span>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="text-red-500 text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => {
          const csv = ['Date,Description,Category,Amount,Notes']
          expenses.forEach(e => {
            csv.push(`${e.date},"${e.description}",${e.category},${e.amount},"${e.notes}"`)
          })
          const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `expenses-${filterMonth}.csv`
          a.click()
        }}
        className="w-full py-2 bg-slate-100 rounded font-medium"
      >
        {t('tools.expenseTracker.exportCSV')}
      </button>
    </div>
  )
}
