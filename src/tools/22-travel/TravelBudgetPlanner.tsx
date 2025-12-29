import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface BudgetItem {
  id: number
  category: string
  name: string
  amount: number
  currency: string
}

const categories = [
  { id: 'transport', icon: '✈️', name: 'Transportation' },
  { id: 'accommodation', icon: '🏨', name: 'Accommodation' },
  { id: 'food', icon: '🍽️', name: 'Food & Drinks' },
  { id: 'activities', icon: '🎭', name: 'Activities' },
  { id: 'shopping', icon: '🛍️', name: 'Shopping' },
  { id: 'other', icon: '📦', name: 'Other' },
]

const currencies = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'JPY', symbol: '¥', rate: 149.5 },
  { code: 'TWD', symbol: 'NT$', rate: 31.5 },
  { code: 'CNY', symbol: '¥', rate: 7.24 },
]

export default function TravelBudgetPlanner() {
  const { t } = useTranslation()
  const [tripName, setTripName] = useState('')
  const [tripDays, setTripDays] = useState(7)
  const [totalBudget, setTotalBudget] = useState(2000)
  const [mainCurrency, setMainCurrency] = useState('USD')
  const [items, setItems] = useState<BudgetItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newItem, setNewItem] = useState({
    category: 'transport',
    name: '',
    amount: 0,
    currency: 'USD',
  })

  const addItem = () => {
    if (!newItem.name.trim() || newItem.amount <= 0) return
    setItems([...items, { ...newItem, id: Date.now() }])
    setNewItem({ category: 'transport', name: '', amount: 0, currency: 'USD' })
    setShowForm(false)
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const convertToMain = (amount: number, fromCurrency: string) => {
    const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1
    const toRate = currencies.find(c => c.code === mainCurrency)?.rate || 1
    return (amount / fromRate) * toRate
  }

  const getTotalSpent = () => {
    return items.reduce((sum, item) => sum + convertToMain(item.amount, item.currency), 0)
  }

  const getCategoryTotal = (categoryId: string) => {
    return items
      .filter(item => item.category === categoryId)
      .reduce((sum, item) => sum + convertToMain(item.amount, item.currency), 0)
  }

  const totalSpent = getTotalSpent()
  const remaining = totalBudget - totalSpent
  const dailyBudget = remaining / Math.max(tripDays, 1)
  const progress = (totalSpent / totalBudget) * 100

  const mainCurrencySymbol = currencies.find(c => c.code === mainCurrency)?.symbol || '$'

  const exportBudget = () => {
    let text = `${tripName || 'Trip'} Budget\n`
    text += `Duration: ${tripDays} days\n`
    text += `Total Budget: ${mainCurrencySymbol}${totalBudget.toLocaleString()}\n`
    text += `Total Spent: ${mainCurrencySymbol}${totalSpent.toFixed(2)}\n`
    text += `Remaining: ${mainCurrencySymbol}${remaining.toFixed(2)}\n\n`

    categories.forEach(cat => {
      const catItems = items.filter(i => i.category === cat.id)
      if (catItems.length > 0) {
        text += `${cat.icon} ${cat.name}\n`
        catItems.forEach(item => {
          const currency = currencies.find(c => c.code === item.currency)
          text += `  - ${item.name}: ${currency?.symbol}${item.amount}\n`
        })
        text += '\n'
      }
    })

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `travel-budget-${tripName || 'trip'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.travelBudgetPlanner.tripDetails')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={tripName}
            onChange={e => setTripName(e.target.value)}
            placeholder={t('tools.travelBudgetPlanner.tripName')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="number"
            value={tripDays}
            onChange={e => setTripDays(parseInt(e.target.value) || 1)}
            min={1}
            className="px-3 py-2 border border-slate-300 rounded"
            placeholder="Days"
          />
          <input
            type="number"
            value={totalBudget}
            onChange={e => setTotalBudget(parseFloat(e.target.value) || 0)}
            className="px-3 py-2 border border-slate-300 rounded"
            placeholder="Budget"
          />
          <select
            value={mainCurrency}
            onChange={e => setMainCurrency(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">{t('tools.travelBudgetPlanner.budgetProgress')}</span>
          <span className="font-bold">{mainCurrencySymbol}{totalSpent.toFixed(0)} / {mainCurrencySymbol}{totalBudget}</span>
        </div>
        <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              progress > 100 ? 'bg-red-500' : progress > 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
            {remaining >= 0 ? `${mainCurrencySymbol}${remaining.toFixed(0)} remaining` : `${mainCurrencySymbol}${Math.abs(remaining).toFixed(0)} over budget`}
          </span>
          <span className="text-slate-500">
            {mainCurrencySymbol}{dailyBudget.toFixed(0)}/day
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {categories.map(cat => (
          <div key={cat.id} className="card p-2 text-center">
            <div className="text-xl">{cat.icon}</div>
            <div className="text-xs text-slate-500 truncate">{cat.name}</div>
            <div className="font-bold text-sm">{mainCurrencySymbol}{getCategoryTotal(cat.id).toFixed(0)}</div>
          </div>
        ))}
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + {t('tools.travelBudgetPlanner.addExpense')}
        </button>
      )}

      {showForm && (
        <div className="card p-4 border-2 border-blue-300">
          <h3 className="font-medium mb-3">{t('tools.travelBudgetPlanner.addExpense')}</h3>
          <div className="space-y-3">
            <select
              value={newItem.category}
              onChange={e => setNewItem({ ...newItem, category: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              placeholder={t('tools.travelBudgetPlanner.expenseName')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={newItem.amount || ''}
                onChange={e => setNewItem({ ...newItem, amount: parseFloat(e.target.value) || 0 })}
                placeholder="Amount"
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <select
                value={newItem.currency}
                onChange={e => setNewItem({ ...newItem, currency: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addItem}
                disabled={!newItem.name.trim() || newItem.amount <= 0}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                Add
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.travelBudgetPlanner.expenses')}</h3>
          <div className="space-y-2">
            {items.map(item => {
              const cat = categories.find(c => c.id === item.category)
              const currency = currencies.find(c => c.code === item.currency)
              return (
                <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="flex items-center gap-2">
                    <span>{cat?.icon}</span>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-slate-500">{cat?.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{currency?.symbol}{item.amount.toLocaleString()}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      x
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <button
          onClick={exportBudget}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {t('tools.travelBudgetPlanner.export')}
        </button>
      )}
    </div>
  )
}
