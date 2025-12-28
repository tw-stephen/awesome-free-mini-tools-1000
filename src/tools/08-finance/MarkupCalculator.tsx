import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function MarkupCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'costMarkup' | 'costProfit' | 'priceProfit'>('costMarkup')
  const [cost, setCost] = useState('')
  const [markupPercent, setMarkupPercent] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')
  const [profitAmount, setProfitAmount] = useState('')

  const quickMarkups = [25, 50, 75, 100, 150, 200]

  const result = useMemo(() => {
    const costValue = parseFloat(cost) || 0

    if (mode === 'costMarkup') {
      const markup = parseFloat(markupPercent) || 0
      if (costValue <= 0) return null

      const profit = costValue * (markup / 100)
      const price = costValue + profit
      const margin = (profit / price) * 100

      return { cost: costValue, price, profit, markup, margin }
    } else if (mode === 'costProfit') {
      const profit = parseFloat(profitAmount) || 0
      if (costValue <= 0) return null

      const price = costValue + profit
      const markup = (profit / costValue) * 100
      const margin = (profit / price) * 100

      return { cost: costValue, price, profit, markup, margin }
    } else {
      const price = parseFloat(sellingPrice) || 0
      if (price <= 0 || price < costValue) return null

      const profit = price - costValue
      const markup = (profit / costValue) * 100
      const margin = (profit / price) * 100

      return { cost: costValue, price, profit, markup, margin }
    }
  }, [mode, cost, markupPercent, sellingPrice, profitAmount])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-1 mb-4 text-xs">
          <button
            onClick={() => setMode('costMarkup')}
            className={`flex-1 py-2 rounded ${
              mode === 'costMarkup' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.markupCalculator.costMarkup')}
          </button>
          <button
            onClick={() => setMode('costProfit')}
            className={`flex-1 py-2 rounded ${
              mode === 'costProfit' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.markupCalculator.costProfit')}
          </button>
          <button
            onClick={() => setMode('priceProfit')}
            className={`flex-1 py-2 rounded ${
              mode === 'priceProfit' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.markupCalculator.priceProfit')}
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.markupCalculator.cost')}
            </label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="50"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          {mode === 'costMarkup' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.markupCalculator.markupPercent')}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {quickMarkups.map(m => (
                  <button
                    key={m}
                    onClick={() => setMarkupPercent(m.toString())}
                    className={`px-3 py-1 rounded text-sm ${
                      markupPercent === m.toString() ? 'bg-blue-500 text-white' : 'bg-slate-100'
                    }`}
                  >
                    {m}%
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={markupPercent}
                onChange={(e) => setMarkupPercent(e.target.value)}
                placeholder="50"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          )}

          {mode === 'costProfit' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.markupCalculator.desiredProfit')}
              </label>
              <input
                type="number"
                value={profitAmount}
                onChange={(e) => setProfitAmount(e.target.value)}
                placeholder="25"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          )}

          {mode === 'priceProfit' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.markupCalculator.sellingPrice')}
              </label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="75"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card p-4 bg-green-50 text-center">
            <div className="text-sm text-slate-600">
              {mode === 'costMarkup' || mode === 'costProfit'
                ? t('tools.markupCalculator.sellingPrice')
                : t('tools.markupCalculator.markup')}
            </div>
            <div className="text-3xl font-bold text-green-600">
              {mode === 'costMarkup' || mode === 'costProfit'
                ? `$${result.price.toFixed(2)}`
                : `${result.markup.toFixed(1)}%`}
            </div>
          </div>

          <div className="card p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded text-center">
                <div className="text-lg font-bold text-slate-700">${result.cost.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{t('tools.markupCalculator.cost')}</div>
              </div>
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="text-lg font-bold text-blue-600">${result.price.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{t('tools.markupCalculator.price')}</div>
              </div>
              <div className="p-3 bg-green-50 rounded text-center">
                <div className="text-lg font-bold text-green-600">${result.profit.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{t('tools.markupCalculator.profit')}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded text-center">
                <div className="text-lg font-bold text-purple-600">{result.margin.toFixed(1)}%</div>
                <div className="text-xs text-slate-500">{t('tools.markupCalculator.margin')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.markupCalculator.formulas')}
            </h3>
            <div className="text-xs text-slate-600 space-y-1">
              <p>• Markup % = (Profit / Cost) × 100</p>
              <p>• Margin % = (Profit / Price) × 100</p>
              <p>• Price = Cost × (1 + Markup%)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
