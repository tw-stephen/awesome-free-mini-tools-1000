import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function CreditCardPayoffCalculator() {
  const { t } = useTranslation()
  const [balance, setBalance] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [monthlyPayment, setMonthlyPayment] = useState('')

  const result = useMemo(() => {
    const bal = parseFloat(balance) || 0
    const apr = parseFloat(interestRate) || 0
    const payment = parseFloat(monthlyPayment) || 0

    if (bal <= 0 || apr <= 0 || payment <= 0) return null

    const monthlyRate = apr / 100 / 12
    const minPayment = bal * monthlyRate

    if (payment <= minPayment) {
      return { error: 'paymentTooLow' as const, minPayment }
    }

    // Calculate months to payoff
    const months = Math.ceil(
      Math.log(payment / (payment - bal * monthlyRate)) / Math.log(1 + monthlyRate)
    )

    const totalPaid = payment * months
    const totalInterest = totalPaid - bal
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    // Calculate payoff with different payment amounts
    const scenarios = [1.25, 1.5, 2].map(multiplier => {
      const newPayment = payment * multiplier
      const newMonths = Math.ceil(
        Math.log(newPayment / (newPayment - bal * monthlyRate)) / Math.log(1 + monthlyRate)
      )
      const newTotal = newPayment * newMonths
      const newInterest = newTotal - bal
      return {
        payment: newPayment,
        months: newMonths,
        totalInterest: newInterest,
        savedInterest: totalInterest - newInterest,
        savedMonths: months - newMonths,
      }
    })

    return { months, years, remainingMonths, totalPaid, totalInterest, scenarios }
  }, [balance, interestRate, monthlyPayment])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.creditCardPayoffCalculator.currentBalance')}
          </label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="5000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.creditCardPayoffCalculator.interestRate')}
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="18.99"
              step="0.01"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.creditCardPayoffCalculator.monthlyPayment')}
            </label>
            <input
              type="number"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(e.target.value)}
              placeholder="200"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {result && 'error' in result && (
        <div className="card p-4 bg-red-50 text-center">
          <p className="text-red-600 text-sm">
            {t('tools.creditCardPayoffCalculator.paymentTooLow')}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            {t('tools.creditCardPayoffCalculator.minimumRequired')}: ${result.minPayment?.toFixed(2) ?? '0.00'}
          </p>
        </div>
      )}

      {result && !('error' in result) && (
        <div className="space-y-3">
          <div className="card p-4 bg-blue-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.creditCardPayoffCalculator.timeToPayoff')}</div>
            <div className="text-2xl font-bold text-blue-600">
              {result.years > 0 && `${result.years} ${t('tools.creditCardPayoffCalculator.years')} `}
              {result.remainingMonths} {t('tools.creditCardPayoffCalculator.months')}
            </div>
            <div className="text-sm text-slate-500">({result.months} {t('tools.creditCardPayoffCalculator.totalMonths')})</div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">
                  ${result.totalPaid.toFixed(0)}
                </div>
                <div className="text-xs text-slate-500">{t('tools.creditCardPayoffCalculator.totalPaid')}</div>
              </div>
              <div className="p-3 bg-red-50 rounded">
                <div className="text-lg font-bold text-red-600">
                  ${result.totalInterest.toFixed(0)}
                </div>
                <div className="text-xs text-slate-500">{t('tools.creditCardPayoffCalculator.totalInterest')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.creditCardPayoffCalculator.payFaster')}
            </h3>
            <div className="space-y-2">
              {result.scenarios.map((scenario, i) => (
                <div key={i} className="p-2 bg-green-50 rounded flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">${scenario.payment.toFixed(0)}/mo</div>
                    <div className="text-xs text-slate-500">
                      {Math.floor(scenario.months / 12)}y {scenario.months % 12}m
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      Save ${scenario.savedInterest.toFixed(0)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {scenario.savedMonths} months faster
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
