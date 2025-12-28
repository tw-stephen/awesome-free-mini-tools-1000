import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function CAGRCalculator() {
  const { t } = useTranslation()
  const [beginningValue, setBeginningValue] = useState('')
  const [endingValue, setEndingValue] = useState('')
  const [years, setYears] = useState('')

  const result = useMemo(() => {
    const begin = parseFloat(beginningValue) || 0
    const end = parseFloat(endingValue) || 0
    const n = parseFloat(years) || 0

    if (begin <= 0 || end <= 0 || n <= 0) return null

    // CAGR = (Ending Value / Beginning Value)^(1/n) - 1
    const cagr = (Math.pow(end / begin, 1 / n) - 1) * 100
    const totalReturn = ((end - begin) / begin) * 100
    const absoluteGain = end - begin

    // Project future values at this rate
    const projections = [5, 10, 15, 20].map(year => ({
      year,
      value: begin * Math.pow(1 + cagr / 100, year),
    }))

    return {
      cagr,
      totalReturn,
      absoluteGain,
      projections,
      isPositive: cagr >= 0,
    }
  }, [beginningValue, endingValue, years])

  // Common benchmarks
  const benchmarks = [
    { name: 'S&P 500 (historical)', rate: 10.5 },
    { name: 'Bond Market', rate: 5.5 },
    { name: 'Inflation', rate: 3.0 },
    { name: 'Savings Account', rate: 0.5 },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.cagrCalculator.beginningValue')}
          </label>
          <input
            type="number"
            value={beginningValue}
            onChange={(e) => setBeginningValue(e.target.value)}
            placeholder="10000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.cagrCalculator.endingValue')}
          </label>
          <input
            type="number"
            value={endingValue}
            onChange={(e) => setEndingValue(e.target.value)}
            placeholder="25000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.cagrCalculator.years')}
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="10"
            step="0.5"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className={`card p-4 text-center ${result.isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-sm text-slate-600">{t('tools.cagrCalculator.cagr')}</div>
            <div className={`text-3xl font-bold ${result.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {result.cagr.toFixed(2)}%
            </div>
            <div className="text-sm text-slate-500">
              {t('tools.cagrCalculator.perYear')}
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-slate-50 rounded">
                <div className={`text-lg font-bold ${result.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.totalReturn >= 0 ? '+' : ''}{result.totalReturn.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500">{t('tools.cagrCalculator.totalReturn')}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className={`text-lg font-bold ${result.absoluteGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.absoluteGain >= 0 ? '+' : ''}${result.absoluteGain.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">{t('tools.cagrCalculator.absoluteGain')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.cagrCalculator.projections')}
            </h3>
            <div className="space-y-2">
              {result.projections.map(proj => (
                <div key={proj.year} className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">{proj.year} years</span>
                  <span className="font-medium">
                    ${proj.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.cagrCalculator.comparison')}
            </h3>
            <div className="space-y-2">
              {benchmarks.map(bench => {
                const diff = result.cagr - bench.rate
                return (
                  <div key={bench.name} className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">{bench.name}</span>
                    <div className="text-right">
                      <span className="font-medium">{bench.rate}%</span>
                      <span className={`ml-2 text-xs ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ({diff >= 0 ? '+' : ''}{diff.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.cagrCalculator.formula')}
            </h3>
            <p className="text-xs text-slate-600 font-mono">
              CAGR = (Ending Value / Beginning Value)^(1/Years) - 1
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
