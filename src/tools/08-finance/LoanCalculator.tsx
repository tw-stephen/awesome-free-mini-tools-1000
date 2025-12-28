import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function LoanCalculator() {
  const { t } = useTranslation()
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [years, setYears] = useState('')
  const [result, setResult] = useState<{
    monthlyPayment: number
    totalPayment: number
    totalInterest: number
  } | null>(null)

  const calculate = () => {
    const p = parseFloat(principal)
    const r = parseFloat(rate) / 100 / 12
    const n = parseFloat(years) * 12

    if (p <= 0 || r <= 0 || n <= 0) return

    const monthlyPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPayment = monthlyPayment * n
    const totalInterest = totalPayment - p

    setResult({ monthlyPayment, totalPayment, totalInterest })
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.loanCalculator.principal')}
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="100000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.loanCalculator.interestRate')}
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="5"
            step="0.1"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.loanCalculator.loanTerm')}
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="30"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
        <button
          onClick={calculate}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.loanCalculator.calculate')}
        </button>
      </div>

      {result && (
        <div className="card p-4 space-y-3">
          <div className="p-3 bg-blue-50 rounded text-center">
            <div className="text-sm text-slate-600">{t('tools.loanCalculator.monthlyPayment')}</div>
            <div className="text-2xl font-bold text-blue-600">
              ${result.monthlyPayment.toFixed(2)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded text-center">
              <div className="text-xs text-slate-500">{t('tools.loanCalculator.totalPayment')}</div>
              <div className="text-lg font-bold text-slate-700">
                ${result.totalPayment.toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-red-50 rounded text-center">
              <div className="text-xs text-slate-500">{t('tools.loanCalculator.totalInterest')}</div>
              <div className="text-lg font-bold text-red-600">
                ${result.totalInterest.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
