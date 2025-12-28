import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function DividendCalculator() {
  const { t } = useTranslation()
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [sharePrice, setSharePrice] = useState('')
  const [annualDividend, setAnnualDividend] = useState('')
  const [dividendFrequency, setDividendFrequency] = useState('4')
  const [dividendGrowthRate, setDividendGrowthRate] = useState('')
  const [years, setYears] = useState('10')

  const result = useMemo(() => {
    const investment = parseFloat(investmentAmount) || 0
    const price = parseFloat(sharePrice) || 0
    const dividend = parseFloat(annualDividend) || 0
    const frequency = parseInt(dividendFrequency)
    const growth = parseFloat(dividendGrowthRate) / 100 || 0
    const y = parseInt(years) || 10

    if (investment <= 0 || price <= 0 || dividend <= 0) return null

    const shares = investment / price
    const dividendYield = (dividend / price) * 100
    const annualIncome = shares * dividend
    const paymentPerPeriod = annualIncome / frequency

    // Calculate future dividend income with growth
    const futureProjections = []
    let cumulativeIncome = 0
    for (let year = 1; year <= y; year++) {
      const yearDividend = dividend * Math.pow(1 + growth, year - 1)
      const yearIncome = shares * yearDividend
      cumulativeIncome += yearIncome
      futureProjections.push({
        year,
        dividendPerShare: yearDividend,
        annualIncome: yearIncome,
        cumulativeIncome,
      })
    }

    return {
      shares,
      dividendYield,
      annualIncome,
      monthlyIncome: annualIncome / 12,
      paymentPerPeriod,
      futureProjections,
      totalIncome: cumulativeIncome,
    }
  }, [investmentAmount, sharePrice, annualDividend, dividendFrequency, dividendGrowthRate, years])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.dividendCalculator.investmentAmount')}
            </label>
            <input
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              placeholder="10000"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.dividendCalculator.sharePrice')}
            </label>
            <input
              type="number"
              value={sharePrice}
              onChange={(e) => setSharePrice(e.target.value)}
              placeholder="50"
              step="0.01"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.dividendCalculator.annualDividend')}
            </label>
            <input
              type="number"
              value={annualDividend}
              onChange={(e) => setAnnualDividend(e.target.value)}
              placeholder="2.00"
              step="0.01"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.dividendCalculator.frequency')}
            </label>
            <select
              value={dividendFrequency}
              onChange={(e) => setDividendFrequency(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value="1">{t('tools.dividendCalculator.annually')}</option>
              <option value="2">{t('tools.dividendCalculator.semiAnnually')}</option>
              <option value="4">{t('tools.dividendCalculator.quarterly')}</option>
              <option value="12">{t('tools.dividendCalculator.monthly')}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.dividendCalculator.growthRate')}
            </label>
            <input
              type="number"
              value={dividendGrowthRate}
              onChange={(e) => setDividendGrowthRate(e.target.value)}
              placeholder="5"
              step="0.5"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.dividendCalculator.projectionYears')}
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="10"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-green-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.dividendCalculator.annualIncome')}</div>
            <div className="text-3xl font-bold text-green-600">
              ${result.annualIncome.toFixed(2)}
            </div>
            <div className="text-sm text-slate-500">
              ${result.monthlyIncome.toFixed(2)}/mo
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-lg font-bold text-slate-700">
                  {result.shares.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500">{t('tools.dividendCalculator.shares')}</div>
              </div>
              <div className="p-2 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">
                  {result.dividendYield.toFixed(2)}%
                </div>
                <div className="text-xs text-slate-500">{t('tools.dividendCalculator.yield')}</div>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">
                  ${result.paymentPerPeriod.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500">{t('tools.dividendCalculator.perPayment')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.dividendCalculator.projection')}
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {result.futureProjections.map(proj => (
                <div key={proj.year} className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Year {proj.year}</span>
                  <div className="flex gap-4">
                    <span>${proj.annualIncome.toFixed(0)}/yr</span>
                    <span className="text-green-600">${proj.cumulativeIncome.toFixed(0)} total</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t mt-3 pt-3 text-center">
              <span className="text-sm text-slate-600">{t('tools.dividendCalculator.totalIncome')}: </span>
              <span className="font-bold text-green-600">${result.totalIncome.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
