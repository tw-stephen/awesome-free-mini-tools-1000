import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function AreaConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('squareMeter')

  const units = [
    { id: 'squareKilometer', label: 'Square Kilometer', symbol: 'km²', toSqm: 1000000 },
    { id: 'hectare', label: 'Hectare', symbol: 'ha', toSqm: 10000 },
    { id: 'squareMeter', label: 'Square Meter', symbol: 'm²', toSqm: 1 },
    { id: 'squareCentimeter', label: 'Square Centimeter', symbol: 'cm²', toSqm: 0.0001 },
    { id: 'squareMillimeter', label: 'Square Millimeter', symbol: 'mm²', toSqm: 0.000001 },
    { id: 'squareMile', label: 'Square Mile', symbol: 'mi²', toSqm: 2589988.11 },
    { id: 'acre', label: 'Acre', symbol: 'ac', toSqm: 4046.86 },
    { id: 'squareYard', label: 'Square Yard', symbol: 'yd²', toSqm: 0.836127 },
    { id: 'squareFoot', label: 'Square Foot', symbol: 'ft²', toSqm: 0.092903 },
    { id: 'squareInch', label: 'Square Inch', symbol: 'in²', toSqm: 0.00064516 },
    { id: 'ping', label: 'Ping (坪)', symbol: '坪', toSqm: 3.30579 },
  ]

  const conversions = useMemo(() => {
    const val = parseFloat(value)
    if (isNaN(val)) return null

    const fromUnitData = units.find(u => u.id === fromUnit)
    if (!fromUnitData) return null

    const sqm = val * fromUnitData.toSqm

    return units.reduce((acc, unit) => {
      acc[unit.id] = sqm / unit.toSqm
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
    { from: '1 hectare', equals: '10,000 m²' },
    { from: '1 acre', equals: '4,047 m²' },
    { from: '1 km²', equals: '100 hectares' },
    { from: '1 ft²', equals: '929 cm²' },
    { from: '1 坪', equals: '3.306 m²' },
    { from: '1 mi²', equals: '640 acres' },
  ]

  const areaExamples = [
    { item: t('tools.areaConverter.creditCard'), area: '46 cm²' },
    { item: t('tools.areaConverter.parkingSpace'), area: '15 m²' },
    { item: t('tools.areaConverter.tennisCount'), area: '260 m²' },
    { item: t('tools.areaConverter.soccerField'), area: '7,140 m²' },
    { item: t('tools.areaConverter.cityBlock'), area: '1 hectare' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.areaConverter.enterValue')}
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
            {t('tools.areaConverter.results')}
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
          {t('tools.areaConverter.quickReference')}
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
          {t('tools.areaConverter.examples')}
        </h3>
        <div className="space-y-2">
          {areaExamples.map((item, i) => (
            <div key={i} className="flex justify-between p-2 bg-slate-50 rounded text-sm">
              <span className="text-slate-600">{item.item}</span>
              <span className="font-medium">{item.area}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.areaConverter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.areaConverter.tip1')}</li>
          <li>{t('tools.areaConverter.tip2')}</li>
          <li>{t('tools.areaConverter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
