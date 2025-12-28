import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function LoanCalculator() {
  const { t } = useTranslation()
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [termUnit, setTermUnit] = useState<'years' | 'months'>('years')

  const result = useMemo(() => {
    const principal = parseFloat(loanAmount) || 0
    const annualRate = parseFloat(interestRate) || 0
    let months = parseFloat(loanTerm) || 0

    if (principal <= 0 || annualRate <= 0 || months <= 0) return null

    if (termUnit === 'years') {
      months = months * 12
    }

    const monthlyRate = annualRate / 100 / 12

    // Monthly payment calculation (PMT formula)
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)

    const totalPayment = monthlyPayment * months
    const totalInterest = totalPayment - principal
    const biweeklyPayment = monthlyPayment / 2

    // Generate amortization schedule (first 12 months)
    const schedule = []
    let balance = principal
    for (let i = 1; i <= Math.min(12, months); i++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = monthlyPayment - interestPayment
      balance -= principalPayment
      schedule.push({
        month: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      })
    }

    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      biweeklyPayment: biweeklyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      principal: principal.toFixed(2),
      months,
      schedule,
    }
  }, [loanAmount, interestRate, loanTerm, termUnit])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.loanCalculator.loanAmount')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="250000"
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.loanCalculator.interestRate')}
            </label>
            <div className="relative">
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="6.5"
                step="0.1"
                className="w-full pr-8 pl-3 py-2 border border-slate-300 rounded text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.loanCalculator.loanTerm')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="30"
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <select
                value={termUnit}
                onChange={(e) => setTermUnit(e.target.value as 'years' | 'months')}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                <option value="years">{t('tools.loanCalculator.years')}</option>
                <option value="months">{t('tools.loanCalculator.months')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-4">
              {t('tools.loanCalculator.paymentSummary')}
            </h3>

            <div className="text-center mb-6">
              <div className="text-sm text-slate-600 mb-1">
                {t('tools.loanCalculator.monthlyPayment')}
              </div>
              <div className="text-4xl font-bold text-blue-600">
                ${result.monthlyPayment}
              </div>
              <div className="text-sm text-slate-500 mt-2">
                {t('tools.loanCalculator.orBiweekly')}: ${result.biweeklyPayment}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded text-center">
                <div className="text-lg font-semibold text-slate-700">
                  ${result.principal}
                </div>
                <div className="text-xs text-slate-500">{t('tools.loanCalculator.principal')}</div>
              </div>
              <div className="p-3 bg-red-50 rounded text-center">
                <div className="text-lg font-semibold text-red-600">
                  ${result.totalInterest}
                </div>
                <div className="text-xs text-slate-500">{t('tools.loanCalculator.totalInterest')}</div>
              </div>
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="text-lg font-semibold text-blue-600">
                  ${result.totalPayment}
                </div>
                <div className="text-xs text-slate-500">{t('tools.loanCalculator.totalPayment')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.loanCalculator.amortization')} ({t('tools.loanCalculator.first12')})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-slate-500">#</th>
                    <th className="text-right py-2 text-slate-500">{t('tools.loanCalculator.payment')}</th>
                    <th className="text-right py-2 text-slate-500">{t('tools.loanCalculator.principal')}</th>
                    <th className="text-right py-2 text-slate-500">{t('tools.loanCalculator.interest')}</th>
                    <th className="text-right py-2 text-slate-500">{t('tools.loanCalculator.balance')}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.month} className="border-b border-slate-100">
                      <td className="py-2">{row.month}</td>
                      <td className="text-right">${row.payment.toFixed(2)}</td>
                      <td className="text-right text-green-600">${row.principal.toFixed(2)}</td>
                      <td className="text-right text-red-600">${row.interest.toFixed(2)}</td>
                      <td className="text-right">${row.balance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.loanCalculator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.loanCalculator.tip1')}</li>
          <li>{t('tools.loanCalculator.tip2')}</li>
          <li>{t('tools.loanCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
