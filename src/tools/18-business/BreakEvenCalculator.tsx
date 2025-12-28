import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function BreakEvenCalculator() {
  const { t } = useTranslation()
  const [fixedCosts, setFixedCosts] = useState(0)
  const [pricePerUnit, setPricePerUnit] = useState(0)
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(0)
  const [targetProfit, setTargetProfit] = useState(0)

  const contributionMargin = pricePerUnit - variableCostPerUnit
  const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0
  const breakEvenRevenue = breakEvenUnits * pricePerUnit
  const unitsForProfit = contributionMargin > 0 ? Math.ceil((fixedCosts + targetProfit) / contributionMargin) : 0

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  const generateChart = () => {
    const maxUnits = Math.max(breakEvenUnits * 2, 100)
    const points = []
    for (let units = 0; units <= maxUnits; units += Math.ceil(maxUnits / 10)) {
      const revenue = units * pricePerUnit
      const totalCost = fixedCosts + (units * variableCostPerUnit)
      const profit = revenue - totalCost
      points.push({ units, revenue, totalCost, profit })
    }
    return points
  }

  const chartData = generateChart()
  const maxValue = Math.max(...chartData.map(d => Math.max(d.revenue, d.totalCost)))

  const copyReport = () => {
    let report = `BREAK-EVEN ANALYSIS\n${'='.repeat(50)}\n\n`
    report += `Fixed Costs: ${formatCurrency(fixedCosts)}\n`
    report += `Price Per Unit: ${formatCurrency(pricePerUnit)}\n`
    report += `Variable Cost Per Unit: ${formatCurrency(variableCostPerUnit)}\n`
    report += `Contribution Margin: ${formatCurrency(contributionMargin)}\n\n`
    report += `RESULTS\n${'─'.repeat(30)}\n`
    report += `Break-Even Units: ${formatNumber(breakEvenUnits)}\n`
    report += `Break-Even Revenue: ${formatCurrency(breakEvenRevenue)}\n`
    if (targetProfit > 0) {
      report += `Units for ${formatCurrency(targetProfit)} profit: ${formatNumber(unitsForProfit)}\n`
    }
    navigator.clipboard.writeText(report)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.breakEvenCalculator.inputs')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Fixed Costs ($)</label>
            <input
              type="number"
              value={fixedCosts}
              onChange={(e) => setFixedCosts(Number(e.target.value))}
              placeholder="e.g., 10000"
              className="w-full px-3 py-2 border border-slate-300 rounded"
              min="0"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-500 block mb-1">Price Per Unit ($)</label>
              <input
                type="number"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Number(e.target.value))}
                placeholder="e.g., 50"
                className="w-full px-3 py-2 border border-slate-300 rounded"
                min="0"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Variable Cost Per Unit ($)</label>
              <input
                type="number"
                value={variableCostPerUnit}
                onChange={(e) => setVariableCostPerUnit(Number(e.target.value))}
                placeholder="e.g., 20"
                className="w-full px-3 py-2 border border-slate-300 rounded"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Target Profit (optional)</label>
            <input
              type="number"
              value={targetProfit}
              onChange={(e) => setTargetProfit(Number(e.target.value))}
              placeholder="e.g., 5000"
              className="w-full px-3 py-2 border border-slate-300 rounded"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.breakEvenCalculator.margin')}</h3>
          <span className={`text-lg font-bold ${contributionMargin > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(contributionMargin)}
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Contribution margin = Price ({formatCurrency(pricePerUnit)}) - Variable Cost ({formatCurrency(variableCostPerUnit)})
        </p>
      </div>

      {contributionMargin > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 bg-blue-50">
              <div className="text-sm text-slate-500">Break-Even Units</div>
              <div className="text-3xl font-bold text-blue-600">{formatNumber(breakEvenUnits)}</div>
            </div>
            <div className="card p-4 bg-green-50">
              <div className="text-sm text-slate-500">Break-Even Revenue</div>
              <div className="text-3xl font-bold text-green-600">{formatCurrency(breakEvenRevenue)}</div>
            </div>
          </div>

          {targetProfit > 0 && (
            <div className="card p-4 bg-orange-50">
              <div className="text-sm text-slate-500">Units for {formatCurrency(targetProfit)} Profit</div>
              <div className="text-3xl font-bold text-orange-600">{formatNumber(unitsForProfit)}</div>
            </div>
          )}

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.breakEvenCalculator.chart')}</h3>
            <div className="h-48 relative">
              {/* Simple chart visualization */}
              <div className="absolute inset-0 flex items-end">
                {chartData.map((point, i) => (
                  <div key={i} className="flex-1 relative h-full flex items-end justify-center gap-0.5">
                    <div
                      className="w-2 bg-blue-400 rounded-t"
                      style={{ height: `${(point.revenue / maxValue) * 100}%` }}
                      title={`Revenue: ${formatCurrency(point.revenue)}`}
                    />
                    <div
                      className="w-2 bg-red-400 rounded-t"
                      style={{ height: `${(point.totalCost / maxValue) * 100}%` }}
                      title={`Cost: ${formatCurrency(point.totalCost)}`}
                    />
                  </div>
                ))}
              </div>
              {/* Break-even line */}
              <div
                className="absolute bottom-0 h-full border-l-2 border-dashed border-green-500"
                style={{ left: `${(breakEvenUnits / (chartData[chartData.length - 1]?.units || 1)) * 100}%` }}
              >
                <span className="absolute -top-1 left-1 text-xs text-green-600 whitespace-nowrap">
                  Break-even
                </span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-400 rounded" /> Revenue</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded" /> Total Cost</span>
            </div>
          </div>
        </>
      )}

      {contributionMargin <= 0 && pricePerUnit > 0 && (
        <div className="card p-4 bg-red-50 text-center">
          <div className="text-red-600 font-medium">Cannot break even</div>
          <p className="text-sm text-slate-600">Price must be greater than variable cost</p>
        </div>
      )}

      <button
        onClick={copyReport}
        className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
      >
        {t('tools.breakEvenCalculator.export')}
      </button>
    </div>
  )
}
