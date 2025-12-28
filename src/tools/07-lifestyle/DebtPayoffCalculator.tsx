import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Debt {
  id: number
  name: string
  balance: number
  interestRate: number
  minimumPayment: number
}

interface PayoffPlan {
  debtId: number
  name: string
  months: number
  totalPaid: number
  interestPaid: number
  payoffDate: string
}

export default function DebtPayoffCalculator() {
  const { t } = useTranslation()
  const [debts, setDebts] = useState<Debt[]>([])
  const [extraPayment, setExtraPayment] = useState('')
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche')
  const [newDebt, setNewDebt] = useState({
    name: '',
    balance: '',
    interestRate: '',
    minimumPayment: '',
  })
  const [showAddDebt, setShowAddDebt] = useState(false)

  const addDebt = () => {
    if (!newDebt.name || !newDebt.balance) return
    const debt: Debt = {
      id: Date.now(),
      name: newDebt.name,
      balance: parseFloat(newDebt.balance) || 0,
      interestRate: parseFloat(newDebt.interestRate) || 0,
      minimumPayment: parseFloat(newDebt.minimumPayment) || 0,
    }
    setDebts([...debts, debt])
    setNewDebt({ name: '', balance: '', interestRate: '', minimumPayment: '' })
    setShowAddDebt(false)
  }

  const deleteDebt = (id: number) => {
    setDebts(debts.filter(d => d.id !== id))
  }

  const payoffPlan = useMemo(() => {
    if (debts.length === 0) return null

    const extra = parseFloat(extraPayment) || 0
    const sortedDebts = [...debts].sort((a, b) => {
      if (strategy === 'avalanche') {
        return b.interestRate - a.interestRate // Highest interest first
      }
      return a.balance - b.balance // Smallest balance first
    })

    const plans: PayoffPlan[] = []
    const balances = debts.map(d => ({ id: d.id, balance: d.balance }))
    let currentMonth = 0
    let totalInterestPaid = 0
    let availableExtra = extra

    while (balances.some(b => b.balance > 0)) {
      currentMonth++
      if (currentMonth > 600) break // Safety: max 50 years

      // Pay minimums on all debts first
      balances.forEach(b => {
        const debt = debts.find(d => d.id === b.id)!
        if (b.balance > 0) {
          const monthlyInterest = (b.balance * debt.interestRate) / 100 / 12
          totalInterestPaid += monthlyInterest
          b.balance += monthlyInterest
          const payment = Math.min(debt.minimumPayment, b.balance)
          b.balance -= payment
        }
      })

      // Apply extra payment to priority debt
      for (const sortedDebt of sortedDebts) {
        const b = balances.find(bal => bal.id === sortedDebt.id)!
        if (b.balance > 0 && availableExtra > 0) {
          const payment = Math.min(availableExtra + (parseFloat(extraPayment) || 0), b.balance)
          b.balance -= payment
          if (b.balance <= 0) {
            b.balance = 0
            const debt = debts.find(d => d.id === sortedDebt.id)!
            const payoffDate = new Date()
            payoffDate.setMonth(payoffDate.getMonth() + currentMonth)

            plans.push({
              debtId: debt.id,
              name: debt.name,
              months: currentMonth,
              totalPaid: debt.balance + debt.balance * (debt.interestRate / 100 / 12) * currentMonth * 0.5,
              interestPaid: debt.balance * (debt.interestRate / 100 / 12) * currentMonth * 0.5,
              payoffDate: payoffDate.toISOString().split('T')[0],
            })
            // Redirect freed up minimum payment to extra
            availableExtra += debt.minimumPayment
          }
          break
        }
      }
    }

    const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0)
    const totalMinPayments = debts.reduce((sum, d) => sum + d.minimumPayment, 0)
    const monthlyPayment = totalMinPayments + (parseFloat(extraPayment) || 0)

    return {
      plans,
      totalMonths: currentMonth,
      totalPaid: totalDebt + totalInterestPaid,
      totalInterest: totalInterestPaid,
      debtFreeDate: plans.length > 0 ? plans[plans.length - 1].payoffDate : null,
      monthlyPayment,
    }
  }, [debts, extraPayment, strategy])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0)
  const avgInterestRate = debts.length > 0
    ? debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length
    : 0

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</div>
            <div className="text-xs text-slate-500">{t('tools.debtPayoff.totalDebt')}</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{avgInterestRate.toFixed(1)}%</div>
            <div className="text-xs text-slate-500">{t('tools.debtPayoff.avgRate')}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{debts.length}</div>
            <div className="text-xs text-slate-500">{t('tools.debtPayoff.accounts')}</div>
          </div>
        </div>
      </div>

      {!showAddDebt ? (
        <button
          onClick={() => setShowAddDebt(true)}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          + {t('tools.debtPayoff.addDebt')}
        </button>
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.debtPayoff.addDebt')}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newDebt.name}
              onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
              placeholder={t('tools.debtPayoff.debtName')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={newDebt.balance}
                onChange={(e) => setNewDebt({ ...newDebt, balance: e.target.value })}
                placeholder={t('tools.debtPayoff.balance')}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="number"
                value={newDebt.interestRate}
                onChange={(e) => setNewDebt({ ...newDebt, interestRate: e.target.value })}
                placeholder={t('tools.debtPayoff.rate')}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="number"
                value={newDebt.minimumPayment}
                onChange={(e) => setNewDebt({ ...newDebt, minimumPayment: e.target.value })}
                placeholder={t('tools.debtPayoff.minPayment')}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addDebt}
                className="flex-1 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
              >
                {t('tools.debtPayoff.add')}
              </button>
              <button
                onClick={() => setShowAddDebt(false)}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                {t('tools.debtPayoff.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {debts.length > 0 && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.debtPayoff.yourDebts')}
            </h3>
            <div className="space-y-2">
              {debts.map(debt => (
                <div key={debt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                  <div>
                    <div className="font-medium">{debt.name}</div>
                    <div className="text-sm text-slate-500">
                      {debt.interestRate}% APR • {formatCurrency(debt.minimumPayment)}/mo min
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-red-600">{formatCurrency(debt.balance)}</span>
                    <button
                      onClick={() => deleteDebt(debt.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.debtPayoff.payoffStrategy')}
            </h3>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setStrategy('avalanche')}
                className={`flex-1 py-2 rounded text-sm ${
                  strategy === 'avalanche' ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {t('tools.debtPayoff.avalanche')}
              </button>
              <button
                onClick={() => setStrategy('snowball')}
                className={`flex-1 py-2 rounded text-sm ${
                  strategy === 'snowball' ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {t('tools.debtPayoff.snowball')}
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              {strategy === 'avalanche'
                ? t('tools.debtPayoff.avalancheDesc')
                : t('tools.debtPayoff.snowballDesc')}
            </p>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.debtPayoff.extraMonthly')}
              </label>
              <input
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>

          {payoffPlan && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                {t('tools.debtPayoff.payoffPlan')}
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xl font-bold text-green-600">
                    {payoffPlan.debtFreeDate || '-'}
                  </div>
                  <div className="text-xs text-slate-500">{t('tools.debtPayoff.debtFreeDate')}</div>
                </div>
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {payoffPlan.totalMonths} mo
                  </div>
                  <div className="text-xs text-slate-500">{t('tools.debtPayoff.timeToPayoff')}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('tools.debtPayoff.monthlyPayment')}</span>
                  <span className="font-medium">{formatCurrency(payoffPlan.monthlyPayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('tools.debtPayoff.totalInterest')}</span>
                  <span className="font-medium text-red-600">{formatCurrency(payoffPlan.totalInterest)}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.debtPayoff.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.debtPayoff.tip1')}</li>
          <li>{t('tools.debtPayoff.tip2')}</li>
          <li>{t('tools.debtPayoff.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
