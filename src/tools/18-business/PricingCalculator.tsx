import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function PricingCalculator() {
  const { t } = useTranslation()
  const [pricingModel, setPricingModel] = useState<'cost-plus' | 'value' | 'competitive'>('cost-plus')
  const [costs, setCosts] = useState({ fixed: 0, variable: 0, labor: 0 })
  const [markup, setMarkup] = useState(30)
  const [competitorPrice, setCompetitorPrice] = useState(0)
  const [perceivedValue, setPerceivedValue] = useState(0)
  const [volume, setVolume] = useState(100)

  const calculatePrice = (): { price: number; margin: number; profit: number } => {
    const totalCost = costs.fixed + costs.variable + costs.labor

    if (pricingModel === 'cost-plus') {
      const price = totalCost * (1 + markup / 100)
      const margin = markup
      const profit = (price - totalCost) * volume
      return { price, margin, profit }
    }

    if (pricingModel === 'competitive') {
      const price = competitorPrice
      const margin = totalCost > 0 ? ((price - totalCost) / price) * 100 : 0
      const profit = (price - totalCost) * volume
      return { price, margin, profit }
    }

    // Value-based
    const price = perceivedValue
    const margin = totalCost > 0 ? ((price - totalCost) / price) * 100 : 0
    const profit = (price - totalCost) * volume
    return { price, margin, profit }
  }

  const result = calculatePrice()

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.pricingCalculator.model')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'cost-plus', label: 'Cost-Plus', desc: 'Add markup to costs' },
            { id: 'value', label: 'Value-Based', desc: 'Based on perceived value' },
            { id: 'competitive', label: 'Competitive', desc: 'Match competitors' },
          ].map(model => (
            <button
              key={model.id}
              onClick={() => setPricingModel(model.id as typeof pricingModel)}
              className={`p-3 rounded text-left ${
                pricingModel === model.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="font-medium">{model.label}</div>
              <div className={`text-xs ${pricingModel === model.id ? 'text-blue-100' : 'text-slate-500'}`}>
                {model.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.pricingCalculator.costs')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Fixed Costs (per unit)</label>
            <input
              type="number"
              value={costs.fixed}
              onChange={(e) => setCosts({ ...costs, fixed: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Variable Costs (per unit)</label>
            <input
              type="number"
              value={costs.variable}
              onChange={(e) => setCosts({ ...costs, variable: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Labor Costs (per unit)</label>
            <input
              type="number"
              value={costs.labor}
              onChange={(e) => setCosts({ ...costs, labor: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              min="0"
              step="0.01"
            />
          </div>
          <div className="p-3 bg-slate-50 rounded">
            <span className="text-slate-500">Total Cost per Unit:</span>
            <span className="font-bold ml-2">{formatCurrency(costs.fixed + costs.variable + costs.labor)}</span>
          </div>
        </div>
      </div>

      {pricingModel === 'cost-plus' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.pricingCalculator.markup')}</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              value={markup}
              onChange={(e) => setMarkup(Number(e.target.value))}
              min="0"
              max="200"
              className="flex-1"
            />
            <span className="text-xl font-bold w-16">{markup}%</span>
          </div>
        </div>
      )}

      {pricingModel === 'competitive' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.pricingCalculator.competitor')}</h3>
          <input
            type="number"
            value={competitorPrice}
            onChange={(e) => setCompetitorPrice(Number(e.target.value))}
            placeholder="Competitor price..."
            className="w-full px-3 py-2 border border-slate-300 rounded"
            min="0"
            step="0.01"
          />
        </div>
      )}

      {pricingModel === 'value' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.pricingCalculator.value')}</h3>
          <input
            type="number"
            value={perceivedValue}
            onChange={(e) => setPerceivedValue(Number(e.target.value))}
            placeholder="Perceived value..."
            className="w-full px-3 py-2 border border-slate-300 rounded"
            min="0"
            step="0.01"
          />
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.pricingCalculator.volume')}</h3>
        <input
          type="number"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          placeholder="Expected volume..."
          className="w-full px-3 py-2 border border-slate-300 rounded"
          min="1"
        />
      </div>

      <div className={`card p-4 ${result.margin >= 30 ? 'bg-green-50' : result.margin >= 15 ? 'bg-yellow-50' : 'bg-red-50'}`}>
        <h3 className="font-medium mb-3">{t('tools.pricingCalculator.result')}</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">{formatCurrency(result.price)}</div>
            <div className="text-sm text-slate-500">Suggested Price</div>
          </div>
          <div>
            <div className={`text-3xl font-bold ${
              result.margin >= 30 ? 'text-green-600' : result.margin >= 15 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {result.margin.toFixed(1)}%
            </div>
            <div className="text-sm text-slate-500">Profit Margin</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">{formatCurrency(result.profit)}</div>
            <div className="text-sm text-slate-500">Est. Total Profit</div>
          </div>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.pricingCalculator.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Consider all costs including overhead</li>
          <li>• Research competitor pricing</li>
          <li>• Test different price points</li>
          <li>• Factor in perceived value to customers</li>
        </ul>
      </div>
    </div>
  )
}
