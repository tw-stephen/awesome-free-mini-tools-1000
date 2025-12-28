import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Transaction {
  id: number
  date: string
  description: string
  amount: number
  type: 'inflow' | 'outflow'
  category: string
  recurring: boolean
}

export default function CashFlowTracker() {
  const { t } = useTranslation()
  const [openingBalance, setOpeningBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')

  const inflowCategories = ['Sales', 'Investment', 'Loan', 'Refund', 'Other Income']
  const outflowCategories = ['Payroll', 'Rent', 'Utilities', 'Inventory', 'Marketing', 'Equipment', 'Taxes', 'Loan Payment', 'Other']

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions([...transactions, { ...transaction, id: Date.now() }])
    setShowForm(false)
  }

  const removeTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const filteredTransactions = filter === 'all'
    ? sortedTransactions
    : sortedTransactions.filter(t => t.type === filter)

  const totalInflows = transactions.filter(t => t.type === 'inflow').reduce((sum, t) => sum + t.amount, 0)
  const totalOutflows = transactions.filter(t => t.type === 'outflow').reduce((sum, t) => sum + t.amount, 0)
  const netCashFlow = totalInflows - totalOutflows
  const closingBalance = openingBalance + netCashFlow

  const groupByMonth = () => {
    const grouped: Record<string, Transaction[]> = {}
    sortedTransactions.forEach(t => {
      const month = t.date.substring(0, 7)
      if (!grouped[month]) grouped[month] = []
      grouped[month].push(t)
    })
    return grouped
  }

  const generateReport = (): string => {
    let doc = `CASH FLOW STATEMENT\n${'═'.repeat(50)}\n\n`
    doc += `Opening Balance: ${formatCurrency(openingBalance)}\n\n`

    doc += `INFLOWS\n${'─'.repeat(40)}\n`
    transactions.filter(t => t.type === 'inflow').forEach(t => {
      doc += `${t.date} - ${t.description}: ${formatCurrency(t.amount)}\n`
    })
    doc += `Total Inflows: ${formatCurrency(totalInflows)}\n\n`

    doc += `OUTFLOWS\n${'─'.repeat(40)}\n`
    transactions.filter(t => t.type === 'outflow').forEach(t => {
      doc += `${t.date} - ${t.description}: ${formatCurrency(t.amount)}\n`
    })
    doc += `Total Outflows: ${formatCurrency(totalOutflows)}\n\n`

    doc += `SUMMARY\n${'─'.repeat(40)}\n`
    doc += `Net Cash Flow: ${formatCurrency(netCashFlow)}\n`
    doc += `Closing Balance: ${formatCurrency(closingBalance)}\n`

    return doc
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  const TransactionForm = () => {
    const [form, setForm] = useState({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: 0,
      type: 'inflow' as 'inflow' | 'outflow',
      category: inflowCategories[0],
      recurring: false,
    })

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{t('tools.cashFlowTracker.addTransaction')}</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setForm({ ...form, type: 'inflow', category: inflowCategories[0] })}
              className={`flex-1 py-2 rounded ${form.type === 'inflow' ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              Inflow
            </button>
            <button
              onClick={() => setForm({ ...form, type: 'outflow', category: outflowCategories[0] })}
              className={`flex-1 py-2 rounded ${form.type === 'outflow' ? 'bg-red-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              Outflow
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              placeholder="Amount"
              className="px-3 py-2 border border-slate-300 rounded"
              min="0"
            />
          </div>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {(form.type === 'inflow' ? inflowCategories : outflowCategories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 px-3 py-2">
              <input
                type="checkbox"
                checked={form.recurring}
                onChange={(e) => setForm({ ...form, recurring: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Recurring</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addTransaction(form)}
              disabled={!form.description || form.amount <= 0}
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
        <h3 className="font-medium mb-3">{t('tools.cashFlowTracker.balance')}</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Opening Balance</label>
            <input
              type="number"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-sm text-slate-500">Inflows</div>
            <div className="text-xl font-bold text-green-600">{formatCurrency(totalInflows)}</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded">
            <div className="text-sm text-slate-500">Outflows</div>
            <div className="text-xl font-bold text-red-600">{formatCurrency(totalOutflows)}</div>
          </div>
          <div className={`text-center p-3 rounded ${closingBalance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
            <div className="text-sm text-slate-500">Closing</div>
            <div className={`text-xl font-bold ${closingBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{formatCurrency(closingBalance)}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>All</button>
        <button onClick={() => setFilter('inflow')} className={`px-3 py-1 rounded ${filter === 'inflow' ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Inflows</button>
        <button onClick={() => setFilter('outflow')} className={`px-3 py-1 rounded ${filter === 'outflow' ? 'bg-red-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Outflows</button>
      </div>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
          + {t('tools.cashFlowTracker.addTransaction')}
        </button>
      )}

      {showForm && <TransactionForm />}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.cashFlowTracker.transactions')}</h3>
        {filteredTransactions.length > 0 ? (
          <div className="space-y-2">
            {filteredTransactions.map(t => (
              <div key={t.id} className={`p-3 rounded border ${t.type === 'inflow' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t.description}</span>
                      {t.recurring && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">Recurring</span>}
                    </div>
                    <div className="text-xs text-slate-500">{t.date} • {t.category}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${t.type === 'inflow' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'inflow' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                    <button onClick={() => removeTransaction(t.id)} className="text-red-400 hover:text-red-600">×</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-8">
            {transactions.length === 0 ? 'Add transactions to track cash flow' : 'No transactions match filter'}
          </div>
        )}
      </div>

      {transactions.length > 0 && (
        <div className="card p-4 bg-slate-50">
          <h3 className="font-medium mb-2">{t('tools.cashFlowTracker.summary')}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between"><span>Net Cash Flow:</span><span className={netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>{formatCurrency(netCashFlow)}</span></div>
            <div className="flex justify-between"><span>Closing Balance:</span><span className="font-bold">{formatCurrency(closingBalance)}</span></div>
          </div>
        </div>
      )}

      {transactions.length > 0 && (
        <button onClick={copyReport} className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
          {t('tools.cashFlowTracker.export')}
        </button>
      )}
    </div>
  )
}
