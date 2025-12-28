import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Debt {
  id: number
  name: string
  balance: string
  rate: string
  minPayment: string
}

export default function DebtSnowballCalculator() {
  const { t } = useTranslation()
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: 'Credit Card 1', balance: '', rate: '', minPayment: '' },
    { id: 2, name: 'Credit Card 2', balance: '', rate: '', minPayment: '' },
  ])
  const [extraPayment, setExtraPayment] = useState('')
  const [method, setMethod] = useState<'snowball' | 'avalanche'>('snowball')

  const addDebt = () => {
    setDebts([...debts, { id: Date.now(), name: `Debt ${debts.length + 1}`, balance: '', rate: '', minPayment: '' }])
  }

  const removeDebt = (id: number) => {
    if (debts.length <= 1) return
    setDebts(debts.filter(d => d.id !== id))
  }

  const updateDebt = (id: number, field: keyof Debt, value: string) => {
    setDebts(debts.map(d => d.id === id ? { ...d, [field]: value } : d))
  }

  const result = useMemo(() => {
    const extra = parseFloat(extraPayment) || 0
    const parsedDebts = debts
      .map(d => ({
        ...d,
        balance: parseFloat(d.balance) || 0,
        rate: (parseFloat(d.rate) || 0) / 100 / 12,
        minPayment: parseFloat(d.minPayment) || 0,
      }))
      .filter(d => d.balance > 0)

    if (parsedDebts.length === 0) return null

    // Sort based on method
    const sortedDebts = method === 'snowball'
      ? [...parsedDebts].sort((a, b) => a.balance - b.balance)
      : [...parsedDebts].sort((a, b) => b.rate - a.rate)

    const totalBalance = parsedDebts.reduce((sum, d) => sum + d.balance, 0)
    // Minimum payment calculated for informational purposes
    parsedDebts.reduce((sum, d) => sum + d.minPayment, 0)

    // Simulate payoff
    let currentDebts = sortedDebts.map(d => ({ ...d, remaining: d.balance }))
    let months = 0
    let totalPaid = 0
    const payoffOrder: { name: string; months: number }[] = []

    while (currentDebts.some(d => d.remaining > 0) && months < 600) {
      months++
      let availableExtra = extra

      for (const debt of currentDebts) {
        if (debt.remaining <= 0) continue

        // Add interest
        debt.remaining += debt.remaining * debt.rate

        // Pay minimum
        const minPay = Math.min(debt.minPayment, debt.remaining)
        debt.remaining -= minPay
        totalPaid += minPay

        // Apply extra to first debt with balance
        if (availableExtra > 0 && currentDebts.find(d => d.remaining > 0)?.id === debt.id) {
          const extraPay = Math.min(availableExtra, debt.remaining)
          debt.remaining -= extraPay
          totalPaid += extraPay
          availableExtra -= extraPay
        }

        if (debt.remaining <= 0 && !payoffOrder.find(p => p.name === debt.name)) {
          payoffOrder.push({ name: debt.name, months })
        }
      }
    }

    const totalInterest = totalPaid - totalBalance
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    return {
      months,
      years,
      remainingMonths,
      totalPaid,
      totalInterest,
      totalBalance,
      payoffOrder,
    }
  }, [debts, extraPayment, method])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMethod('snowball')}
            className={`flex-1 py-2 rounded text-sm ${
              method === 'snowball' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.debtSnowballCalculator.snowball')}
          </button>
          <button
            onClick={() => setMethod('avalanche')}
            className={`flex-1 py-2 rounded text-sm ${
              method === 'avalanche' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.debtSnowballCalculator.avalanche')}
          </button>
        </div>
        <p className="text-xs text-slate-500 text-center">
          {method === 'snowball'
            ? t('tools.debtSnowballCalculator.snowballDesc')
            : t('tools.debtSnowballCalculator.avalancheDesc')}
        </p>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.debtSnowballCalculator.debts')}
          </h3>
          <button
            onClick={addDebt}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            + {t('tools.debtSnowballCalculator.addDebt')}
          </button>
        </div>

        <div className="space-y-3">
          {debts.map(debt => (
            <div key={debt.id} className="p-3 bg-slate-50 rounded space-y-2">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={debt.name}
                  onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                  className="font-medium bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none"
                />
                {debts.length > 1 && (
                  <button
                    onClick={() => removeDebt(debt.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-slate-500">{t('tools.debtSnowballCalculator.balance')}</label>
                  <input
                    type="number"
                    value={debt.balance}
                    onChange={(e) => updateDebt(debt.id, 'balance', e.target.value)}
                    placeholder="5000"
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">{t('tools.debtSnowballCalculator.apr')}</label>
                  <input
                    type="number"
                    value={debt.rate}
                    onChange={(e) => updateDebt(debt.id, 'rate', e.target.value)}
                    placeholder="18.99"
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">{t('tools.debtSnowballCalculator.minPayment')}</label>
                  <input
                    type="number"
                    value={debt.minPayment}
                    onChange={(e) => updateDebt(debt.id, 'minPayment', e.target.value)}
                    placeholder="100"
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t('tools.debtSnowballCalculator.extraPayment')}
        </label>
        <input
          type="number"
          value={extraPayment}
          onChange={(e) => setExtraPayment(e.target.value)}
          placeholder="200"
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
        />
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-green-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.debtSnowballCalculator.debtFreeIn')}</div>
            <div className="text-2xl font-bold text-green-600">
              {result.years > 0 && `${result.years} ${t('tools.debtSnowballCalculator.years')} `}
              {result.remainingMonths} {t('tools.debtSnowballCalculator.months')}
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">
                  ${result.totalBalance.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">{t('tools.debtSnowballCalculator.totalDebt')}</div>
              </div>
              <div className="p-2 bg-red-50 rounded">
                <div className="text-lg font-bold text-red-600">
                  ${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-slate-500">{t('tools.debtSnowballCalculator.totalInterest')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.debtSnowballCalculator.payoffOrder')}
            </h3>
            <div className="space-y-1">
              {result.payoffOrder.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{i + 1}. {item.name}</span>
                  <span className="text-slate-500">{item.months} months</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
