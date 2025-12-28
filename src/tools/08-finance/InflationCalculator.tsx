import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function InflationCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'future' | 'past'>('future')
  const [amount, setAmount] = useState('')
  const [inflationRate, setInflationRate] = useState('3')
  const [years, setYears] = useState('')

  const result = useMemo(() => {
    const value = parseFloat(amount) || 0
    const rate = parseFloat(inflationRate) / 100
    const y = parseFloat(years) || 0

    if (value <= 0 || y <= 0) return null

    if (mode === 'future') {
      // What will $X be worth in Y years?
      const futureValue = value / Math.pow(1 + rate, y)
      const purchasingPowerLost = value - futureValue
      const percentLost = (purchasingPowerLost / value) * 100
      return { result: futureValue, change: purchasingPowerLost, percentChange: percentLost }
    } else {
      // What was $X worth Y years ago?
      const pastValue = value * Math.pow(1 + rate, y)
      const purchasingPowerGained = pastValue - value
      const percentGained = (purchasingPowerGained / value) * 100
      return { result: pastValue, change: purchasingPowerGained, percentChange: percentGained }
    }
  }, [mode, amount, inflationRate, years])

  // Show cumulative inflation over time
  const inflationTimeline = useMemo(() => {
    const value = parseFloat(amount) || 100
    const rate = parseFloat(inflationRate) / 100
    const y = parseFloat(years) || 10

    const points = []
    for (let year = 0; year <= y; year++) {
      const adjustedValue = mode === 'future'
        ? value / Math.pow(1 + rate, year)
        : value * Math.pow(1 + rate, year)
      points.push({ year, value: adjustedValue })
    }
    return points
  }, [amount, inflationRate, years, mode])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('future')}
            className={`flex-1 py-2 rounded text-sm ${
              mode === 'future' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.inflationCalculator.futureValue')}
          </button>
          <button
            onClick={() => setMode('past')}
            className={`flex-1 py-2 rounded text-sm ${
              mode === 'past' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.inflationCalculator.pastValue')}
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.inflationCalculator.amount')}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.inflationCalculator.inflationRate')}
              </label>
              <input
                type="number"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                placeholder="3"
                step="0.5"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.inflationCalculator.years')}
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
      </div>

      {result && (
        <div className="space-y-3">
          <div className={`card p-4 text-center ${mode === 'future' ? 'bg-red-50' : 'bg-green-50'}`}>
            <div className="text-sm text-slate-600">
              {mode === 'future'
                ? t('tools.inflationCalculator.willBeWorth')
                : t('tools.inflationCalculator.wasEquivalentTo')}
            </div>
            <div className={`text-3xl font-bold ${mode === 'future' ? 'text-red-600' : 'text-green-600'}`}>
              ${result.result.toFixed(2)}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {mode === 'future' ? '-' : '+'}${Math.abs(result.change).toFixed(2)} ({result.percentChange.toFixed(1)}%)
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.inflationCalculator.timeline')}
            </h3>
            <div className="space-y-2">
              {inflationTimeline.filter((_, i) => i % Math.ceil(inflationTimeline.length / 6) === 0 || i === inflationTimeline.length - 1).map((point) => (
                <div key={point.year} className="flex items-center gap-2">
                  <span className="w-16 text-xs text-slate-500">Year {point.year}</span>
                  <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden">
                    <div
                      className={mode === 'future' ? 'bg-red-400' : 'bg-green-400'}
                      style={{
                        width: `${(point.value / Math.max(...inflationTimeline.map(p => p.value))) * 100}%`,
                        height: '100%',
                      }}
                    />
                  </div>
                  <span className="w-20 text-xs text-right">${point.value.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
