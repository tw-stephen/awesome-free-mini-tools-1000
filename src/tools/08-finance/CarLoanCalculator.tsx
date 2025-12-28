import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function CarLoanCalculator() {
  const { t } = useTranslation()
  const [carPrice, setCarPrice] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [tradeInValue, setTradeInValue] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('60')
  const [salesTax, setSalesTax] = useState('')

  const loanTerms = [24, 36, 48, 60, 72, 84]

  const result = useMemo(() => {
    const price = parseFloat(carPrice) || 0
    const down = parseFloat(downPayment) || 0
    const tradeIn = parseFloat(tradeInValue) || 0
    const rate = parseFloat(interestRate) / 100 / 12
    const months = parseInt(loanTerm)
    const tax = parseFloat(salesTax) / 100 || 0

    if (price <= 0) return null

    const taxAmount = price * tax
    const totalPrice = price + taxAmount
    const loanAmount = totalPrice - down - tradeIn

    if (loanAmount <= 0) return { loanAmount: 0, monthlyPayment: 0, totalInterest: 0, totalCost: totalPrice, taxAmount }

    const monthlyPayment = rate > 0
      ? (loanAmount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
      : loanAmount / months

    const totalPayment = monthlyPayment * months
    const totalInterest = totalPayment - loanAmount
    const totalCost = totalPayment + down + tradeIn

    return {
      loanAmount,
      monthlyPayment,
      totalPayment,
      totalInterest,
      totalCost,
      taxAmount,
    }
  }, [carPrice, downPayment, tradeInValue, interestRate, loanTerm, salesTax])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.carLoanCalculator.carPrice')}
          </label>
          <input
            type="number"
            value={carPrice}
            onChange={(e) => setCarPrice(e.target.value)}
            placeholder="35000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.carLoanCalculator.downPayment')}
            </label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              placeholder="5000"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.carLoanCalculator.tradeInValue')}
            </label>
            <input
              type="number"
              value={tradeInValue}
              onChange={(e) => setTradeInValue(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.carLoanCalculator.interestRate')}
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="6.5"
              step="0.1"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.carLoanCalculator.salesTax')}
            </label>
            <input
              type="number"
              value={salesTax}
              onChange={(e) => setSalesTax(e.target.value)}
              placeholder="8"
              step="0.1"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.carLoanCalculator.loanTerm')}: {loanTerm} months
          </label>
          <div className="flex gap-2 flex-wrap">
            {loanTerms.map(term => (
              <button
                key={term}
                onClick={() => setLoanTerm(term.toString())}
                className={`px-3 py-2 rounded text-sm ${
                  loanTerm === term.toString() ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {term}mo
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-blue-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.carLoanCalculator.monthlyPayment')}</div>
            <div className="text-3xl font-bold text-blue-600">
              ${result.monthlyPayment.toFixed(2)}
            </div>
          </div>

          <div className="card p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('tools.carLoanCalculator.loanAmount')}</span>
                <span className="font-medium">${result.loanAmount.toLocaleString()}</span>
              </div>
              {result.taxAmount > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>{t('tools.carLoanCalculator.salesTaxAmount')}</span>
                  <span>${result.taxAmount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-red-600">
                <span>{t('tools.carLoanCalculator.totalInterest')}</span>
                <span className="font-medium">${result.totalInterest.toFixed(0)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-medium">
                <span>{t('tools.carLoanCalculator.totalCost')}</span>
                <span>${result.totalCost.toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.carLoanCalculator.compareLoanTerms')}
            </h3>
            <div className="space-y-2">
              {loanTerms.slice(0, 4).map(term => {
                const rate = parseFloat(interestRate) / 100 / 12
                const loan = result.loanAmount
                const payment = rate > 0
                  ? (loan * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
                  : loan / term
                const interest = (payment * term) - loan
                return (
                  <div key={term} className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">{term}mo</span>
                    <div className="flex gap-4">
                      <span className="font-medium">${payment.toFixed(0)}/mo</span>
                      <span className="text-red-500">${interest.toFixed(0)} int</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
