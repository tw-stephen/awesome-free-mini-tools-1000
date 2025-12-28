import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function CompoundInterestCalculator() {
  const { t } = useTranslation()
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [years, setYears] = useState('')
  const [compounds, setCompounds] = useState('12')
  const [monthlyAdd, setMonthlyAdd] = useState('')
  const [result, setResult] = useState<{
    finalAmount: number
    totalDeposits: number
    totalInterest: number
  } | null>(null)

  const calculate = () => {
    const p = parseFloat(principal) || 0
    const r = parseFloat(rate) / 100
    const n = parseFloat(compounds)
    const t = parseFloat(years)
    const pmt = parseFloat(monthlyAdd) || 0

    if (r <= 0 || t <= 0 || n <= 0) return

    // A = P(1 + r/n)^(nt) + PMT * (((1 + r/n)^(nt) - 1) / (r/n))
    const ratePerPeriod = r / n
    const periods = n * t

    const compoundPrincipal = p * Math.pow(1 + ratePerPeriod, periods)
    const futureValueOfSeries = pmt * ((Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod)

    const finalAmount = compoundPrincipal + futureValueOfSeries
    const totalDeposits = p + (pmt * periods)
    const totalInterest = finalAmount - totalDeposits

    setResult({ finalAmount, totalDeposits, totalInterest })
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.compoundInterestCalculator.principal')}
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="10000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.compoundInterestCalculator.monthlyContribution')}
          </label>
          <input
            type="number"
            value={monthlyAdd}
            onChange={(e) => setMonthlyAdd(e.target.value)}
            placeholder="500"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.compoundInterestCalculator.rate')}
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="7"
              step="0.1"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.compoundInterestCalculator.years')}
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="20"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.compoundInterestCalculator.compoundFrequency')}
          </label>
          <select
            value={compounds}
            onChange={(e) => setCompounds(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          >
            <option value="1">{t('tools.compoundInterestCalculator.annually')}</option>
            <option value="4">{t('tools.compoundInterestCalculator.quarterly')}</option>
            <option value="12">{t('tools.compoundInterestCalculator.monthly')}</option>
            <option value="365">{t('tools.compoundInterestCalculator.daily')}</option>
          </select>
        </div>
        <button
          onClick={calculate}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.compoundInterestCalculator.calculate')}
        </button>
      </div>

      {result && (
        <div className="card p-4 space-y-3">
          <div className="p-3 bg-green-50 rounded text-center">
            <div className="text-sm text-slate-600">{t('tools.compoundInterestCalculator.finalAmount')}</div>
            <div className="text-2xl font-bold text-green-600">
              ${result.finalAmount.toFixed(2)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded text-center">
              <div className="text-xs text-slate-500">{t('tools.compoundInterestCalculator.totalDeposits')}</div>
              <div className="text-lg font-bold text-slate-700">
                ${result.totalDeposits.toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded text-center">
              <div className="text-xs text-slate-500">{t('tools.compoundInterestCalculator.totalInterest')}</div>
              <div className="text-lg font-bold text-blue-600">
                ${result.totalInterest.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
