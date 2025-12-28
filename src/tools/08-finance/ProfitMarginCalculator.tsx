import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function ProfitMarginCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'costRevenue' | 'costMargin'>('costRevenue')
  const [cost, setCost] = useState('')
  const [revenue, setRevenue] = useState('')
  const [targetMargin, setTargetMargin] = useState('')

  const result = useMemo(() => {
    const costValue = parseFloat(cost) || 0

    if (mode === 'costRevenue') {
      const revenueValue = parseFloat(revenue) || 0
      if (costValue <= 0 || revenueValue <= 0) return null

      const profit = revenueValue - costValue
      const profitMargin = (profit / revenueValue) * 100
      const markup = (profit / costValue) * 100

      return { profit, profitMargin, markup, revenue: revenueValue }
    } else {
      const margin = parseFloat(targetMargin) || 0
      if (costValue <= 0 || margin <= 0 || margin >= 100) return null

      const requiredRevenue = costValue / (1 - margin / 100)
      const profit = requiredRevenue - costValue
      const markup = (profit / costValue) * 100

      return { profit, profitMargin: margin, markup, revenue: requiredRevenue }
    }
  }, [mode, cost, revenue, targetMargin])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('costRevenue')}
            className={`flex-1 py-2 rounded text-sm ${
              mode === 'costRevenue' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.profitMarginCalculator.calculateMargin')}
          </button>
          <button
            onClick={() => setMode('costMargin')}
            className={`flex-1 py-2 rounded text-sm ${
              mode === 'costMargin' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.profitMarginCalculator.calculatePrice')}
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.profitMarginCalculator.cost')}
            </label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="50"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          {mode === 'costRevenue' ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.profitMarginCalculator.revenue')}
              </label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                placeholder="100"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.profitMarginCalculator.targetMargin')}
              </label>
              <input
                type="number"
                value={targetMargin}
                onChange={(e) => setTargetMargin(e.target.value)}
                placeholder="30"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-green-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.profitMarginCalculator.profitMargin')}</div>
            <div className="text-3xl font-bold text-green-600">
              {result.profitMargin.toFixed(1)}%
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">${result.profit.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{t('tools.profitMarginCalculator.profit')}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-lg font-bold text-purple-600">{result.markup.toFixed(1)}%</div>
                <div className="text-xs text-slate-500">{t('tools.profitMarginCalculator.markup')}</div>
              </div>
            </div>
          </div>

          {mode === 'costMargin' && (
            <div className="card p-4 bg-yellow-50 text-center">
              <div className="text-sm text-slate-600">{t('tools.profitMarginCalculator.requiredPrice')}</div>
              <div className="text-2xl font-bold text-yellow-600">
                ${result.revenue.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.profitMarginCalculator.formulas')}
        </h3>
        <div className="text-xs text-slate-600 space-y-1">
          <p>• Profit Margin = (Revenue - Cost) / Revenue × 100</p>
          <p>• Markup = (Revenue - Cost) / Cost × 100</p>
          <p>• Price = Cost / (1 - Margin%)</p>
        </div>
      </div>
    </div>
  )
}
