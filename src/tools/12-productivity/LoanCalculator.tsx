import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface AmortizationRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export default function LoanCalculator() {
  const { t } = useTranslation()
  const [loanAmount, setLoanAmount] = useState(250000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [termType, setTermType] = useState<'years' | 'months'>('years')
  const [extraPayment, setExtraPayment] = useState(0)
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [showAmortization, setShowAmortization] = useState(false)

  const calculations = useMemo(() => {
    const principal = loanAmount
    const monthlyRate = interestRate / 100 / 12
    const totalMonths = termType === 'years' ? loanTerm * 12 : loanTerm

    if (principal <= 0 || monthlyRate <= 0 || totalMonths <= 0) {
      return null
    }

    // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)

    const totalPayment = monthlyPayment * totalMonths
    const totalInterest = totalPayment - principal

    // Calculate with extra payments
    const amortization: AmortizationRow[] = []
    let balance = principal
    let month = 0
    let totalInterestPaid = 0
    let totalExtraPaid = 0

    while (balance > 0 && month < totalMonths * 2) {
      month++
      const interestPayment = balance * monthlyRate
      let principalPayment = monthlyPayment - interestPayment + extraPayment

      if (principalPayment > balance) {
        principalPayment = balance
      }

      balance -= principalPayment - extraPayment
      if (balance < 0) balance = 0

      totalInterestPaid += interestPayment
      if (extraPayment > 0 && balance > 0) {
        totalExtraPaid += extraPayment
      }

      amortization.push({
        month,
        payment: Math.min(monthlyPayment + extraPayment, principalPayment + interestPayment),
        principal: principalPayment - extraPayment,
        interest: interestPayment,
        balance
      })

      if (balance === 0) break
    }

    const actualMonths = amortization.length
    const monthsSaved = totalMonths - actualMonths
    const interestSaved = totalInterest - totalInterestPaid

    // Calculate payoff date
    const payoffDate = new Date(startDate)
    payoffDate.setMonth(payoffDate.getMonth() + actualMonths)

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      actualMonths,
      monthsSaved,
      interestSaved,
      payoffDate: payoffDate.toISOString().split('T')[0],
      amortization,
      totalWithExtra: principal + totalInterestPaid
    }
  }, [loanAmount, interestRate, loanTerm, termType, extraPayment, startDate])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
  }

  const presets = [
    { name: 'Mortgage 30yr', amount: 300000, rate: 6.5, term: 30 },
    { name: 'Mortgage 15yr', amount: 300000, rate: 6.0, term: 15 },
    { name: 'Auto Loan', amount: 35000, rate: 7.5, term: 5 },
    { name: 'Personal Loan', amount: 10000, rate: 10.0, term: 3 },
    { name: 'Student Loan', amount: 50000, rate: 5.5, term: 10 }
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {presets.map(preset => (
          <button
            key={preset.name}
            onClick={() => {
              setLoanAmount(preset.amount)
              setInterestRate(preset.rate)
              setLoanTerm(preset.term)
              setTermType('years')
            }}
            className="px-3 py-1.5 bg-slate-100 rounded text-sm hover:bg-slate-200"
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="card p-4 space-y-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1">{t('tools.loanCalculator.loanAmount')}</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="range"
            value={loanAmount}
            onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
            min="1000"
            max="1000000"
            step="1000"
            className="w-full mt-2"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">{t('tools.loanCalculator.interestRate')} (%)</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
            step="0.1"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="range"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            min="0.5"
            max="25"
            step="0.1"
            className="w-full mt-2"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">{t('tools.loanCalculator.loanTerm')}</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(parseInt(e.target.value) || 1)}
              min="1"
              className="flex-1 px-3 py-2 border border-slate-300 rounded"
            />
            <select
              value={termType}
              onChange={(e) => setTermType(e.target.value as 'years' | 'months')}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              <option value="years">{t('tools.loanCalculator.years')}</option>
              <option value="months">{t('tools.loanCalculator.months')}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">{t('tools.loanCalculator.extraPayment')}</label>
          <input
            type="number"
            value={extraPayment}
            onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">{t('tools.loanCalculator.startDate')}</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      {calculations && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 text-center bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(calculations.monthlyPayment + extraPayment)}
              </div>
              <div className="text-sm text-slate-600">{t('tools.loanCalculator.monthlyPayment')}</div>
              {extraPayment > 0 && (
                <div className="text-xs text-slate-500">
                  (Base: {formatCurrency(calculations.monthlyPayment)})
                </div>
              )}
            </div>
            <div className="card p-4 text-center bg-purple-50">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(calculations.totalWithExtra)}
              </div>
              <div className="text-sm text-slate-600">{t('tools.loanCalculator.totalPayment')}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="card p-3 text-center">
              <div className="text-lg font-bold text-orange-600">
                {formatCurrency(calculations.totalInterest - calculations.interestSaved)}
              </div>
              <div className="text-xs text-slate-500">{t('tools.loanCalculator.totalInterest')}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-lg font-bold text-green-600">
                {calculations.actualMonths} mo
              </div>
              <div className="text-xs text-slate-500">{t('tools.loanCalculator.payoffTime')}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-lg font-bold text-slate-700">
                {calculations.payoffDate}
              </div>
              <div className="text-xs text-slate-500">{t('tools.loanCalculator.payoffDate')}</div>
            </div>
          </div>

          {extraPayment > 0 && calculations.monthsSaved > 0 && (
            <div className="card p-4 bg-green-50">
              <h3 className="font-medium text-green-700 mb-2">{t('tools.loanCalculator.extraPaymentSavings')}</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(calculations.interestSaved)}
                  </div>
                  <div className="text-xs text-slate-600">{t('tools.loanCalculator.interestSaved')}</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">
                    {calculations.monthsSaved} mo
                  </div>
                  <div className="text-xs text-slate-600">{t('tools.loanCalculator.timeSaved')}</div>
                </div>
              </div>
            </div>
          )}

          <div className="card p-4">
            <div className="text-sm text-slate-600 mb-2">{t('tools.loanCalculator.breakdown')}</div>
            <div className="h-6 flex rounded overflow-hidden">
              <div
                className="bg-blue-500"
                style={{ width: `${(loanAmount / calculations.totalPayment) * 100}%` }}
                title={`Principal: ${formatCurrency(loanAmount)}`}
              />
              <div
                className="bg-orange-500"
                style={{ width: `${((calculations.totalInterest - calculations.interestSaved) / calculations.totalPayment) * 100}%` }}
                title={`Interest: ${formatCurrency(calculations.totalInterest - calculations.interestSaved)}`}
              />
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-500 rounded" />
                {t('tools.loanCalculator.principal')}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-orange-500 rounded" />
                {t('tools.loanCalculator.interest')}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowAmortization(!showAmortization)}
            className="w-full py-2 bg-slate-100 rounded text-sm"
          >
            {showAmortization ? t('tools.loanCalculator.hideSchedule') : t('tools.loanCalculator.showSchedule')}
          </button>

          {showAmortization && (
            <div className="card p-4 max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="text-left border-b">
                    <th className="py-2">#</th>
                    <th className="py-2">{t('tools.loanCalculator.payment')}</th>
                    <th className="py-2">{t('tools.loanCalculator.principal')}</th>
                    <th className="py-2">{t('tools.loanCalculator.interest')}</th>
                    <th className="py-2">{t('tools.loanCalculator.balance')}</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.amortization.map(row => (
                    <tr key={row.month} className="border-b border-slate-100">
                      <td className="py-2">{row.month}</td>
                      <td className="py-2">${row.payment.toFixed(2)}</td>
                      <td className="py-2 text-blue-600">${row.principal.toFixed(2)}</td>
                      <td className="py-2 text-orange-600">${row.interest.toFixed(2)}</td>
                      <td className="py-2">${row.balance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
