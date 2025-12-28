import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Transaction {
  id: number
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string
  date: string
}

const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
const expenseCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other']

export default function BudgetTracker() {
  const { t } = useTranslation()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    const saved = localStorage.getItem('budget-tracker')
    if (saved) {
      try {
        setTransactions(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load transactions')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('budget-tracker', JSON.stringify(transactions))
  }, [transactions])

  const categories = type === 'income' ? incomeCategories : expenseCategories

  const addTransaction = () => {
    if (!amount || parseFloat(amount) <= 0) return
    const transaction: Transaction = {
      id: Date.now(),
      type,
      category: category || categories[0],
      amount: parseFloat(amount),
      description: description.trim(),
      date,
    }
    setTransactions([transaction, ...transactions])
    setAmount('')
    setDescription('')
  }

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    return { income, expense, balance: income - expense }
  }, [transactions])

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        totals[t.category] = (totals[t.category] || 0) + t.amount
      })
    return Object.entries(totals).sort((a, b) => b[1] - a[1])
  }, [transactions])

  const formatCurrency = (n: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(n)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="text-sm text-slate-500">{t('tools.budgetTracker.income')}</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.income)}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-sm text-slate-500">{t('tools.budgetTracker.expense')}</div>
          <div className="text-2xl font-bold text-red-500">{formatCurrency(summary.expense)}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-sm text-slate-500">{t('tools.budgetTracker.balance')}</div>
          <div className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatCurrency(summary.balance)}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setType('expense')}
            className={`flex-1 py-2 rounded font-medium ${
              type === 'expense' ? 'bg-red-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.budgetTracker.expense')}
          </button>
          <button
            onClick={() => setType('income')}
            className={`flex-1 py-2 rounded font-medium ${
              type === 'income' ? 'bg-green-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.budgetTracker.income')}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t('tools.budgetTracker.amount')}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('tools.budgetTracker.description')}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
        <button
          onClick={addTransaction}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          + {t('tools.budgetTracker.addTransaction')}
        </button>
      </div>

      {categoryTotals.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.budgetTracker.byCategory')}
          </h3>
          <div className="space-y-2">
            {categoryTotals.map(([cat, total]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-24">{cat}</span>
                <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400 rounded-full"
                    style={{ width: `${(total / summary.expense) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700 w-20 text-right">
                  {formatCurrency(total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.budgetTracker.recent')}
        </h3>
        {transactions.length === 0 ? (
          <div className="text-center text-slate-500 py-4">
            {t('tools.budgetTracker.noTransactions')}
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 10).map(tx => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-2 bg-slate-50 rounded"
              >
                <div>
                  <div className="text-sm font-medium">
                    {tx.description || tx.category}
                  </div>
                  <div className="text-xs text-slate-400">
                    {tx.category} • {tx.date}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${
                    tx.type === 'income' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                  <button
                    onClick={() => deleteTransaction(tx.id)}
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

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.budgetTracker.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.budgetTracker.tip1')}</li>
          <li>{t('tools.budgetTracker.tip2')}</li>
          <li>{t('tools.budgetTracker.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
