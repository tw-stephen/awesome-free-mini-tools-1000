import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function RetirementCalculator() {
  const { t } = useTranslation()
  const [currentAge, setCurrentAge] = useState('')
  const [retirementAge, setRetirementAge] = useState('65')
  const [currentSavings, setCurrentSavings] = useState('')
  const [monthlyContribution, setMonthlyContribution] = useState('')
  const [expectedReturn, setExpectedReturn] = useState('7')
  const [monthlyRetirementSpending, setMonthlyRetirementSpending] = useState('')

  const result = useMemo(() => {
    const age = parseInt(currentAge)
    const retire = parseInt(retirementAge)
    const savings = parseFloat(currentSavings) || 0
    const monthly = parseFloat(monthlyContribution) || 0
    const returnRate = parseFloat(expectedReturn) / 100
    const spending = parseFloat(monthlyRetirementSpending) || 0

    if (!age || age >= retire) return null

    const yearsToRetirement = retire - age
    const monthlyRate = returnRate / 12
    const months = yearsToRetirement * 12

    // FV = PV(1+r)^n + PMT * ((1+r)^n - 1) / r
    const futureSavings = savings * Math.pow(1 + monthlyRate, months)
    const futureContributions = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    const retirementBalance = futureSavings + futureContributions

    // Assuming 4% withdrawal rate
    const safeWithdrawal = retirementBalance * 0.04 / 12
    const yearsOfFunding = spending > 0 ? retirementBalance / (spending * 12) : 0

    // How much needed for desired spending
    const neededForSpending = spending > 0 ? (spending * 12) / 0.04 : 0
    const shortfall = neededForSpending - retirementBalance

    return {
      yearsToRetirement,
      retirementBalance,
      safeWithdrawal,
      yearsOfFunding,
      neededForSpending,
      shortfall,
      onTrack: shortfall <= 0,
    }
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, monthlyRetirementSpending])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.retirementCalculator.currentAge')}
            </label>
            <input
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(e.target.value)}
              placeholder="30"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.retirementCalculator.retirementAge')}
            </label>
            <input
              type="number"
              value={retirementAge}
              onChange={(e) => setRetirementAge(e.target.value)}
              placeholder="65"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.retirementCalculator.currentSavings')}
          </label>
          <input
            type="number"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(e.target.value)}
            placeholder="50000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.retirementCalculator.monthlyContribution')}
            </label>
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              placeholder="500"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.retirementCalculator.expectedReturn')}
            </label>
            <input
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              placeholder="7"
              step="0.5"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.retirementCalculator.desiredMonthlySpending')}
          </label>
          <input
            type="number"
            value={monthlyRetirementSpending}
            onChange={(e) => setMonthlyRetirementSpending(e.target.value)}
            placeholder="4000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className={`card p-4 text-center ${result.onTrack ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <div className="text-sm text-slate-600">
              {t('tools.retirementCalculator.projectedBalance')}
            </div>
            <div className={`text-2xl font-bold ${result.onTrack ? 'text-green-600' : 'text-yellow-600'}`}>
              ${result.retirementBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {t('tools.retirementCalculator.inYears', { years: result.yearsToRetirement })}
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">
                  ${result.safeWithdrawal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-slate-500">{t('tools.retirementCalculator.safeMonthlyWithdrawal')}</div>
              </div>
              <div className="p-2 bg-purple-50 rounded">
                <div className="text-lg font-bold text-purple-600">
                  {result.yearsOfFunding.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500">{t('tools.retirementCalculator.yearsOfFunding')}</div>
              </div>
            </div>
          </div>

          {result.shortfall > 0 && (
            <div className="card p-4 bg-red-50">
              <div className="text-sm text-red-700 text-center">
                {t('tools.retirementCalculator.shortfall')}:
                <span className="font-bold"> ${result.shortfall.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
