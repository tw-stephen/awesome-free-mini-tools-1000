import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function VolumeConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('liter')

  const units = [
    { id: 'cubicMeter', label: 'Cubic Meter', symbol: 'm³', toLiter: 1000 },
    { id: 'liter', label: 'Liter', symbol: 'L', toLiter: 1 },
    { id: 'milliliter', label: 'Milliliter', symbol: 'mL', toLiter: 0.001 },
    { id: 'cubicCentimeter', label: 'Cubic Centimeter', symbol: 'cm³', toLiter: 0.001 },
    { id: 'gallon', label: 'US Gallon', symbol: 'gal', toLiter: 3.78541 },
    { id: 'quart', label: 'US Quart', symbol: 'qt', toLiter: 0.946353 },
    { id: 'pint', label: 'US Pint', symbol: 'pt', toLiter: 0.473176 },
    { id: 'cup', label: 'US Cup', symbol: 'cup', toLiter: 0.236588 },
    { id: 'fluidOunce', label: 'US Fluid Ounce', symbol: 'fl oz', toLiter: 0.0295735 },
    { id: 'tablespoon', label: 'Tablespoon', symbol: 'tbsp', toLiter: 0.0147868 },
    { id: 'teaspoon', label: 'Teaspoon', symbol: 'tsp', toLiter: 0.00492892 },
    { id: 'imperialGallon', label: 'Imperial Gallon', symbol: 'imp gal', toLiter: 4.54609 },
  ]

  const conversions = useMemo(() => {
    const val = parseFloat(value)
    if (isNaN(val)) return null

    const fromUnitData = units.find(u => u.id === fromUnit)
    if (!fromUnitData) return null

    const liters = val * fromUnitData.toLiter

    return units.reduce((acc, unit) => {
      acc[unit.id] = liters / unit.toLiter
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
    { from: '1 L', equals: '0.264 gal' },
    { from: '1 gal', equals: '3.785 L' },
    { from: '1 cup', equals: '237 mL' },
    { from: '1 tbsp', equals: '15 mL' },
    { from: '1 tsp', equals: '5 mL' },
    { from: '1 fl oz', equals: '30 mL' },
  ]

  const cookingConversions = [
    { measure: '1 cup', value: '16 tbsp = 48 tsp' },
    { measure: '1/2 cup', value: '8 tbsp = 24 tsp' },
    { measure: '1/4 cup', value: '4 tbsp = 12 tsp' },
    { measure: '1 tbsp', value: '3 tsp' },
    { measure: '1 fl oz', value: '2 tbsp' },
    { measure: '1 pint', value: '2 cups' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.volumeConverter.enterValue')}
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
            {t('tools.volumeConverter.results')}
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
          {t('tools.volumeConverter.quickReference')}
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
          {t('tools.volumeConverter.cooking')}
        </h3>
        <div className="space-y-2">
          {cookingConversions.map((item, i) => (
            <div key={i} className="flex justify-between p-2 bg-slate-50 rounded text-sm">
              <span className="text-slate-600">{item.measure}</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.volumeConverter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.volumeConverter.tip1')}</li>
          <li>{t('tools.volumeConverter.tip2')}</li>
          <li>{t('tools.volumeConverter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
