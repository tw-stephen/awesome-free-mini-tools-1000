import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function InvestmentCalculator() {
  const { t } = useTranslation()
  const [initialInvestment, setInitialInvestment] = useState('')
  const [monthlyContribution, setMonthlyContribution] = useState('')
  const [annualReturn, setAnnualReturn] = useState('7')
  const [investmentPeriod, setInvestmentPeriod] = useState('10')
  const [compoundFrequency, setCompoundFrequency] = useState<'monthly' | 'quarterly' | 'annually'>('monthly')

  const result = useMemo(() => {
    const principal = parseFloat(initialInvestment) || 0
    const monthly = parseFloat(monthlyContribution) || 0
    const rate = parseFloat(annualReturn) / 100 || 0
    const years = parseInt(investmentPeriod) || 0

    if (years <= 0) return null

    let compoundsPerYear = 12
    if (compoundFrequency === 'quarterly') compoundsPerYear = 4
    if (compoundFrequency === 'annually') compoundsPerYear = 1

    const periodicRate = rate / compoundsPerYear
    const totalPeriods = years * compoundsPerYear
    const monthsPerPeriod = 12 / compoundsPerYear

    // Calculate future value
    // FV of lump sum
    const fvPrincipal = principal * Math.pow(1 + periodicRate, totalPeriods)

    // FV of periodic contributions (adjusted for compound frequency)
    const contributionPerPeriod = monthly * monthsPerPeriod
    const fvContributions = contributionPerPeriod *
      ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate)

    const totalValue = fvPrincipal + fvContributions
    const totalContributions = principal + (monthly * 12 * years)
    const totalEarnings = totalValue - totalContributions

    // Generate yearly breakdown
    const yearlyBreakdown = []
    let currentValue = principal
    let totalDeposits = principal

    for (let year = 1; year <= years; year++) {
      const yearlyContributions = monthly * 12
      totalDeposits += yearlyContributions

      // Simple approximation for yearly breakdown
      const yearEndValue = (currentValue + yearlyContributions) * (1 + rate)

      yearlyBreakdown.push({
        year,
        deposits: totalDeposits,
        earnings: yearEndValue - totalDeposits,
        value: yearEndValue,
      })

      currentValue = yearEndValue
    }

    return {
      totalValue: totalValue.toFixed(2),
      totalContributions: totalContributions.toFixed(2),
      totalEarnings: totalEarnings.toFixed(2),
      principal: principal.toFixed(2),
      monthlyTotal: (monthly * 12 * years).toFixed(2),
      yearlyBreakdown,
    }
  }, [initialInvestment, monthlyContribution, annualReturn, investmentPeriod, compoundFrequency])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.investmentCalculator.initialInvestment')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                placeholder="10000"
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.investmentCalculator.monthlyContribution')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="500"
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.investmentCalculator.annualReturn')}
            </label>
            <div className="relative">
              <input
                type="number"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(e.target.value)}
                placeholder="7"
                step="0.1"
                className="w-full pr-8 pl-3 py-2 border border-slate-300 rounded text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.investmentCalculator.investmentPeriod')}
            </label>
            <div className="relative">
              <input
                type="number"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(e.target.value)}
                placeholder="10"
                className="w-full pr-16 pl-3 py-2 border border-slate-300 rounded text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {t('tools.investmentCalculator.years')}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.investmentCalculator.compoundFrequency')}
            </label>
            <select
              value={compoundFrequency}
              onChange={(e) => setCompoundFrequency(e.target.value as typeof compoundFrequency)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value="monthly">{t('tools.investmentCalculator.monthly')}</option>
              <option value="quarterly">{t('tools.investmentCalculator.quarterly')}</option>
              <option value="annually">{t('tools.investmentCalculator.annually')}</option>
            </select>
          </div>
        </div>
      </div>

      {result && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-4">
              {t('tools.investmentCalculator.projectedValue')}
            </h3>

            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-green-600">
                ${parseFloat(result.totalValue).toLocaleString()}
              </div>
              <div className="text-sm text-slate-500 mt-1">
                {t('tools.investmentCalculator.after')} {investmentPeriod} {t('tools.investmentCalculator.years')}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="text-lg font-semibold text-blue-600">
                  ${parseFloat(result.totalContributions).toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">
                  {t('tools.investmentCalculator.totalContributions')}
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded text-center">
                <div className="text-lg font-semibold text-green-600">
                  ${parseFloat(result.totalEarnings).toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">
                  {t('tools.investmentCalculator.totalEarnings')}
                </div>
              </div>
            </div>

            <div className="relative h-4 rounded-full overflow-hidden bg-slate-200">
              <div
                className="absolute inset-y-0 left-0 bg-blue-500"
                style={{
                  width: `${(parseFloat(result.totalContributions) / parseFloat(result.totalValue)) * 100}%`,
                }}
              />
              <div
                className="absolute inset-y-0 bg-green-500"
                style={{
                  left: `${(parseFloat(result.totalContributions) / parseFloat(result.totalValue)) * 100}%`,
                  width: `${(parseFloat(result.totalEarnings) / parseFloat(result.totalValue)) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>{t('tools.investmentCalculator.contributions')}</span>
              <span>{t('tools.investmentCalculator.earnings')}</span>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.investmentCalculator.yearlyBreakdown')}
            </h3>
            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b">
                    <th className="text-left py-2 text-slate-500">{t('tools.investmentCalculator.year')}</th>
                    <th className="text-right py-2 text-slate-500">{t('tools.investmentCalculator.deposits')}</th>
                    <th className="text-right py-2 text-slate-500">{t('tools.investmentCalculator.earnings')}</th>
                    <th className="text-right py-2 text-slate-500">{t('tools.investmentCalculator.value')}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="border-b border-slate-100">
                      <td className="py-2">{row.year}</td>
                      <td className="text-right">${row.deposits.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className="text-right text-green-600">${row.earnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className="text-right font-medium">${row.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
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
          {t('tools.investmentCalculator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.investmentCalculator.tip1')}</li>
          <li>{t('tools.investmentCalculator.tip2')}</li>
          <li>{t('tools.investmentCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
