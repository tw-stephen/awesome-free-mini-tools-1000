import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function WeightConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('kilogram')

  const units = [
    { id: 'tonne', label: 'Tonne', symbol: 't', toGram: 1000000 },
    { id: 'kilogram', label: 'Kilogram', symbol: 'kg', toGram: 1000 },
    { id: 'gram', label: 'Gram', symbol: 'g', toGram: 1 },
    { id: 'milligram', label: 'Milligram', symbol: 'mg', toGram: 0.001 },
    { id: 'microgram', label: 'Microgram', symbol: 'μg', toGram: 0.000001 },
    { id: 'pound', label: 'Pound', symbol: 'lb', toGram: 453.592 },
    { id: 'ounce', label: 'Ounce', symbol: 'oz', toGram: 28.3495 },
    { id: 'stone', label: 'Stone', symbol: 'st', toGram: 6350.29 },
    { id: 'ton', label: 'US Ton', symbol: 'ton', toGram: 907185 },
    { id: 'carat', label: 'Carat', symbol: 'ct', toGram: 0.2 },
    { id: 'grain', label: 'Grain', symbol: 'gr', toGram: 0.0648 },
  ]

  const conversions = useMemo(() => {
    const val = parseFloat(value)
    if (isNaN(val)) return null

    const fromUnitData = units.find(u => u.id === fromUnit)
    if (!fromUnitData) return null

    const grams = val * fromUnitData.toGram

    return units.reduce((acc, unit) => {
      acc[unit.id] = grams / unit.toGram
      return acc
    }, {} as Record<string, number>)
  }, [value, fromUnit])

  const formatNumber = (num: number) => {
    if (num === 0) return '0'
    if (Math.abs(num) < 0.0001 || Math.abs(num) >= 1e9) {
      return num.toExponential(4)
    }
    return num.toLocaleString(undefined, { maximumFractionDigits: 6 })
  }

  const quickConversions = [
    { from: '1 kg', equals: '2.205 lb' },
    { from: '1 lb', equals: '453.6 g' },
    { from: '1 oz', equals: '28.35 g' },
    { from: '1 stone', equals: '6.35 kg' },
    { from: '1 tonne', equals: '2205 lb' },
    { from: '1 carat', equals: '0.2 g' },
  ]

  const commonWeights = [
    { item: t('tools.weightConverter.paperclip'), weight: '1 g' },
    { item: t('tools.weightConverter.apple'), weight: '200 g' },
    { item: t('tools.weightConverter.smartphone'), weight: '200 g' },
    { item: t('tools.weightConverter.laptop'), weight: '2 kg' },
    { item: t('tools.weightConverter.bowling'), weight: '7 kg' },
    { item: t('tools.weightConverter.car'), weight: '1500 kg' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.weightConverter.enterValue')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0"
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['1', '10', '100', '1000'].map((v) => (
              <button
                key={v}
                onClick={() => setValue(v)}
                className="px-3 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {conversions && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">
            {t('tools.weightConverter.results')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {units.map((unit) => (
              <div
                key={unit.id}
                className={`p-3 rounded ${
                  unit.id === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{unit.label}</span>
                  <span className="text-sm font-bold text-slate-800">
                    {formatNumber(conversions[unit.id])} {unit.symbol}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.weightConverter.quickReference')}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {quickConversions.map((conv, i) => (
            <div key={i} className="p-2 bg-slate-50 rounded text-sm">
              <span className="text-slate-600">{conv.from}</span>
              <span className="text-slate-400"> = </span>
              <span className="font-medium">{conv.equals}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.weightConverter.commonWeights')}
        </h3>
        <div className="space-y-2">
          {commonWeights.map((item, i) => (
            <div key={i} className="flex justify-between p-2 bg-slate-50 rounded text-sm">
              <span className="text-slate-600">{item.item}</span>
              <span className="font-medium">{item.weight}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.weightConverter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.weightConverter.tip1')}</li>
          <li>{t('tools.weightConverter.tip2')}</li>
          <li>{t('tools.weightConverter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
