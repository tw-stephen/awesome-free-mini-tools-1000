import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface BudgetItem {
  id: number
  category: string
  description: string
  budgeted: number
  actual: number
  type: 'income' | 'expense'
}

export default function BudgetPlanner() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() })
  const [items, setItems] = useState<BudgetItem[]>([])
  const [showForm, setShowForm] = useState(false)

  const incomeCategories = ['Revenue', 'Investments', 'Grants', 'Other Income']
  const expenseCategories = ['Payroll', 'Marketing', 'Operations', 'Technology', 'Rent', 'Utilities', 'Travel', 'Supplies', 'Other']

  const addItem = (item: Omit<BudgetItem, 'id'>) => {
    setItems([...items, { ...item, id: Date.now() }])
    setShowForm(false)
  }

  const updateItem = (id: number, field: keyof BudgetItem, value: string | number) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id))
  }

  const income = items.filter(i => i.type === 'income')
  const expenses = items.filter(i => i.type === 'expense')

  const totalBudgetedIncome = income.reduce((sum, i) => sum + i.budgeted, 0)
  const totalActualIncome = income.reduce((sum, i) => sum + i.actual, 0)
  const totalBudgetedExpenses = expenses.reduce((sum, i) => sum + i.budgeted, 0)
  const totalActualExpenses = expenses.reduce((sum, i) => sum + i.actual, 0)

  const budgetedProfit = totalBudgetedIncome - totalBudgetedExpenses
  const actualProfit = totalActualIncome - totalActualExpenses
  const variance = actualProfit - budgetedProfit

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  const getVarianceColor = (budgeted: number, actual: number, type: 'income' | 'expense'): string => {
    const diff = actual - budgeted
    if (type === 'income') {
      return diff >= 0 ? 'text-green-600' : 'text-red-600'
    }
    return diff <= 0 ? 'text-green-600' : 'text-red-600'
  }

  const generateReport = (): string => {
    let doc = `BUDGET REPORT\n${'═'.repeat(50)}\n`
    doc += `Period: ${period.month}/${period.year}\n\n`

    doc += `INCOME\n${'─'.repeat(40)}\n`
    income.forEach(i => {
      doc += `${i.description} (${i.category})\n`
      doc += `  Budgeted: ${formatCurrency(i.budgeted)} | Actual: ${formatCurrency(i.actual)}\n`
    })
    doc += `Total Income: ${formatCurrency(totalActualIncome)} (Budget: ${formatCurrency(totalBudgetedIncome)})\n\n`

    doc += `EXPENSES\n${'─'.repeat(40)}\n`
    expenses.forEach(i => {
      doc += `${i.description} (${i.category})\n`
      doc += `  Budgeted: ${formatCurrency(i.budgeted)} | Actual: ${formatCurrency(i.actual)}\n`
    })
    doc += `Total Expenses: ${formatCurrency(totalActualExpenses)} (Budget: ${formatCurrency(totalBudgetedExpenses)})\n\n`

    doc += `SUMMARY\n${'─'.repeat(40)}\n`
    doc += `Net Profit: ${formatCurrency(actualProfit)}\n`
    doc += `Variance: ${formatCurrency(variance)}\n`

    return doc
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  const BudgetForm = () => {
    const [form, setForm] = useState({
      type: 'expense' as 'income' | 'expense',
      category: expenseCategories[0],
      description: '',
      budgeted: 0,
      actual: 0,
    })

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{t('tools.budgetPlanner.addItem')}</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setForm({ ...form, type: 'income', category: incomeCategories[0] })}
              className={`flex-1 py-2 rounded ${form.type === 'income' ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              Income
            </button>
            <button
              onClick={() => setForm({ ...form, type: 'expense', category: expenseCategories[0] })}
              className={`flex-1 py-2 rounded ${form.type === 'expense' ? 'bg-red-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              Expense
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {(form.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-500 block mb-1">Budgeted</label>
              <input
                type="number"
                value={form.budgeted}
                onChange={(e) => setForm({ ...form, budgeted: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                min="0"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Actual</label>
              <input
                type="number"
                value={form.actual}
                onChange={(e) => setForm({ ...form, actual: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                min="0"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addItem(form)}
              disabled={!form.description}
              className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
            >
              Add
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.budgetPlanner.period')}</h3>
          <div className="flex gap-2">
            <select
              value={period.month}
              onChange={(e) => setPeriod({ ...period, month: Number(e.target.value) })}
              className="px-3 py-1 border border-slate-300 rounded text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
            <input
              type="number"
              value={period.year}
              onChange={(e) => setPeriod({ ...period, year: Number(e.target.value) })}
              className="w-20 px-3 py-1 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-sm text-slate-500">Income</div>
            <div className="text-xl font-bold text-green-600">{formatCurrency(totalActualIncome)}</div>
            <div className="text-xs text-slate-400">Budget: {formatCurrency(totalBudgetedIncome)}</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded">
            <div className="text-sm text-slate-500">Expenses</div>
            <div className="text-xl font-bold text-red-600">{formatCurrency(totalActualExpenses)}</div>
            <div className="text-xs text-slate-400">Budget: {formatCurrency(totalBudgetedExpenses)}</div>
          </div>
          <div className={`text-center p-3 rounded ${actualProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
            <div className="text-sm text-slate-500">Net</div>
            <div className={`text-xl font-bold ${actualProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{formatCurrency(actualProfit)}</div>
            <div className={`text-xs ${variance >= 0 ? 'text-green-500' : 'text-red-500'}`}>{variance >= 0 ? '+' : ''}{formatCurrency(variance)}</div>
          </div>
        </div>
      </div>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
          + {t('tools.budgetPlanner.addItem')}
        </button>
      )}

      {showForm && <BudgetForm />}

      {income.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium text-green-600 mb-3">Income</h3>
          <div className="space-y-2">
            {income.map(item => (
              <div key={item.id} className="p-3 bg-green-50 rounded border border-green-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{item.description}</span>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 text-sm">×</button>
                </div>
                <div className="text-xs text-slate-500 mb-2">{item.category}</div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500">Budgeted</label>
                    <input
                      type="number"
                      value={item.budgeted}
                      onChange={(e) => updateItem(item.id, 'budgeted', Number(e.target.value))}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500">Actual</label>
                    <input
                      type="number"
                      value={item.actual}
                      onChange={(e) => updateItem(item.id, 'actual', Number(e.target.value))}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                  </div>
                  <div className={`text-sm font-medium ${getVarianceColor(item.budgeted, item.actual, 'income')}`}>
                    {item.actual >= item.budgeted ? '+' : ''}{formatCurrency(item.actual - item.budgeted)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {expenses.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium text-red-600 mb-3">Expenses</h3>
          <div className="space-y-2">
            {expenses.map(item => (
              <div key={item.id} className="p-3 bg-red-50 rounded border border-red-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{item.description}</span>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 text-sm">×</button>
                </div>
                <div className="text-xs text-slate-500 mb-2">{item.category}</div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500">Budgeted</label>
                    <input
                      type="number"
                      value={item.budgeted}
                      onChange={(e) => updateItem(item.id, 'budgeted', Number(e.target.value))}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500">Actual</label>
                    <input
                      type="number"
                      value={item.actual}
                      onChange={(e) => updateItem(item.id, 'actual', Number(e.target.value))}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                  </div>
                  <div className={`text-sm font-medium ${getVarianceColor(item.budgeted, item.actual, 'expense')}`}>
                    {item.actual <= item.budgeted ? '' : '+'}{formatCurrency(item.actual - item.budgeted)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && !showForm && (
        <div className="card p-8 text-center text-slate-500">
          Add income and expense items to plan your budget
        </div>
      )}

      {items.length > 0 && (
        <button onClick={copyReport} className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
          {t('tools.budgetPlanner.export')}
        </button>
      )}
    </div>
  )
}
