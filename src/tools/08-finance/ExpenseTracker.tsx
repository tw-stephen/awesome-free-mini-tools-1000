import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Expense {
  id: number
  description: string
  amount: number
  category: string
  date: string
}

const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Other']

export default function ExpenseTracker() {
  const { t } = useTranslation()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Food',
  })

  useEffect(() => {
    const saved = localStorage.getItem('expense-tracker')
    if (saved) {
      try {
        setExpenses(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load expenses')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('expense-tracker', JSON.stringify(expenses))
  }, [expenses])

  const addExpense = () => {
    const amount = parseFloat(newExpense.amount)
    if (!newExpense.description || isNaN(amount) || amount <= 0) return

    const expense: Expense = {
      id: Date.now(),
      description: newExpense.description,
      amount,
      category: newExpense.category,
      date: new Date().toISOString().split('T')[0],
    }
    setExpenses([expense, ...expenses])
    setNewExpense({ description: '', amount: '', category: 'Food' })
  }

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const thisMonth = today.substring(0, 7)

    const todayTotal = expenses
      .filter(e => e.date === today)
      .reduce((sum, e) => sum + e.amount, 0)

    const monthTotal = expenses
      .filter(e => e.date.startsWith(thisMonth))
      .reduce((sum, e) => sum + e.amount, 0)

    const byCategory: Record<string, number> = {}
    expenses.filter(e => e.date.startsWith(thisMonth)).forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount
    })

    return { todayTotal, monthTotal, byCategory }
  }, [expenses])

  const recentExpenses = expenses.slice(0, 10)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-xl font-bold text-blue-600">${stats.todayTotal.toFixed(2)}</div>
            <div className="text-xs text-slate-500">{t('tools.expenseTracker.today')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-xl font-bold text-green-600">${stats.monthTotal.toFixed(2)}</div>
            <div className="text-xs text-slate-500">{t('tools.expenseTracker.thisMonth')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <input
          type="text"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          placeholder={t('tools.expenseTracker.description')}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
        />
        <div className="flex gap-2">
          <input
            type="number"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            placeholder={t('tools.expenseTracker.amount')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <button
          onClick={addExpense}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          + {t('tools.expenseTracker.addExpense')}
        </button>
      </div>

      {Object.keys(stats.byCategory).length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            {t('tools.expenseTracker.byCategory')}
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amount]) => (
                <div key={cat} className="flex justify-between items-center">
                  <span className="text-sm">{cat}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-slate-200 rounded overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${(amount / stats.monthTotal) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">${amount.toFixed(0)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.expenseTracker.recentExpenses')}
        </h3>
        {recentExpenses.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">
            {t('tools.expenseTracker.noExpenses')}
          </p>
        ) : (
          <div className="space-y-2">
            {recentExpenses.map(expense => (
              <div key={expense.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <div>
                  <div className="text-sm font-medium">{expense.description}</div>
                  <div className="text-xs text-slate-500">{expense.category} • {expense.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-red-600">-${expense.amount.toFixed(2)}</span>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
