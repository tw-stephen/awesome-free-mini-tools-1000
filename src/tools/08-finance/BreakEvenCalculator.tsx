import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function BreakEvenCalculator() {
  const { t } = useTranslation()
  const [fixedCosts, setFixedCosts] = useState('')
  const [pricePerUnit, setPricePerUnit] = useState('')
  const [variableCostPerUnit, setVariableCostPerUnit] = useState('')

  const result = useMemo(() => {
    const fixed = parseFloat(fixedCosts) || 0
    const price = parseFloat(pricePerUnit) || 0
    const variable = parseFloat(variableCostPerUnit) || 0

    if (fixed <= 0 || price <= 0 || price <= variable) return null

    const contributionMargin = price - variable
    const breakEvenUnits = Math.ceil(fixed / contributionMargin)
    const breakEvenRevenue = breakEvenUnits * price
    const contributionMarginRatio = (contributionMargin / price) * 100

    return {
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin,
      contributionMarginRatio,
    }
  }, [fixedCosts, pricePerUnit, variableCostPerUnit])

  // Calculate profit at different sales levels
  const profitChart = useMemo(() => {
    if (!result) return []
    const fixed = parseFloat(fixedCosts) || 0
    const price = parseFloat(pricePerUnit) || 0
    const variable = parseFloat(variableCostPerUnit) || 0

    const points = []
    for (let units = 0; units <= result.breakEvenUnits * 2; units += Math.ceil(result.breakEvenUnits / 5)) {
      const revenue = units * price
      const totalCost = fixed + (units * variable)
      const profit = revenue - totalCost
      points.push({ units, revenue, profit })
    }
    return points
  }, [result, fixedCosts, pricePerUnit, variableCostPerUnit])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.breakEvenCalculator.fixedCosts')}
          </label>
          <input
            type="number"
            value={fixedCosts}
            onChange={(e) => setFixedCosts(e.target.value)}
            placeholder="10000"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.breakEvenCalculator.pricePerUnit')}
            </label>
            <input
              type="number"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
              placeholder="50"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.breakEvenCalculator.variableCost')}
            </label>
            <input
              type="number"
              value={variableCostPerUnit}
              onChange={(e) => setVariableCostPerUnit(e.target.value)}
              placeholder="20"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-blue-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.breakEvenCalculator.breakEvenPoint')}</div>
            <div className="text-3xl font-bold text-blue-600">
              {result.breakEvenUnits.toLocaleString()} {t('tools.breakEvenCalculator.units')}
            </div>
            <div className="text-sm text-slate-500">
              ${result.breakEvenRevenue.toLocaleString()} {t('tools.breakEvenCalculator.inRevenue')}
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">
                  ${result.contributionMargin.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500">{t('tools.breakEvenCalculator.contributionMargin')}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-lg font-bold text-purple-600">
                  {result.contributionMarginRatio.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500">{t('tools.breakEvenCalculator.marginRatio')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.breakEvenCalculator.profitAnalysis')}
            </h3>
            <div className="space-y-2">
              {profitChart.map((point, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-16 text-xs text-slate-500">{point.units} units</span>
                  <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden relative">
                    {point.profit >= 0 ? (
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${Math.min(100, (point.profit / (result.breakEvenRevenue)) * 100)}%` }}
                      />
                    ) : (
                      <div
                        className="h-full bg-red-500"
                        style={{ width: `${Math.min(100, (Math.abs(point.profit) / parseFloat(fixedCosts)) * 100)}%` }}
                      />
                    )}
                  </div>
                  <span className={`w-20 text-xs text-right ${point.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${point.profit.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
