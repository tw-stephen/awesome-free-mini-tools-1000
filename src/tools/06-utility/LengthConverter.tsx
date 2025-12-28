import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function LengthConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('meter')

  const units = [
    { id: 'kilometer', label: 'Kilometer', symbol: 'km', toMeter: 1000 },
    { id: 'meter', label: 'Meter', symbol: 'm', toMeter: 1 },
    { id: 'centimeter', label: 'Centimeter', symbol: 'cm', toMeter: 0.01 },
    { id: 'millimeter', label: 'Millimeter', symbol: 'mm', toMeter: 0.001 },
    { id: 'micrometer', label: 'Micrometer', symbol: 'μm', toMeter: 0.000001 },
    { id: 'nanometer', label: 'Nanometer', symbol: 'nm', toMeter: 0.000000001 },
    { id: 'mile', label: 'Mile', symbol: 'mi', toMeter: 1609.344 },
    { id: 'yard', label: 'Yard', symbol: 'yd', toMeter: 0.9144 },
    { id: 'foot', label: 'Foot', symbol: 'ft', toMeter: 0.3048 },
    { id: 'inch', label: 'Inch', symbol: 'in', toMeter: 0.0254 },
    { id: 'nauticalMile', label: 'Nautical Mile', symbol: 'nmi', toMeter: 1852 },
    { id: 'lightYear', label: 'Light Year', symbol: 'ly', toMeter: 9.461e15 },
  ]

  const conversions = useMemo(() => {
    const val = parseFloat(value)
    if (isNaN(val)) return null

    const fromUnitData = units.find(u => u.id === fromUnit)
    if (!fromUnitData) return null

    const meters = val * fromUnitData.toMeter

    return units.reduce((acc, unit) => {
      acc[unit.id] = meters / unit.toMeter
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
    { from: '1 km', equals: '0.621 mi' },
    { from: '1 mi', equals: '1.609 km' },
    { from: '1 m', equals: '3.281 ft' },
    { from: '1 ft', equals: '30.48 cm' },
    { from: '1 in', equals: '2.54 cm' },
    { from: '1 yd', equals: '0.914 m' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.lengthConverter.enterValue')}
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
            {t('tools.lengthConverter.results')}
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
          {t('tools.lengthConverter.quickReference')}
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
          {t('tools.lengthConverter.scale')}
        </h3>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
            <span className="w-20">1 nm</span>
            <div className="flex-1 h-1 bg-blue-200 rounded" style={{ width: '1%' }} />
            <span className="text-xs">{t('tools.lengthConverter.atomicScale')}</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
            <span className="w-20">1 mm</span>
            <div className="flex-1 h-2 bg-blue-300 rounded" style={{ width: '10%' }} />
            <span className="text-xs">{t('tools.lengthConverter.pencilTip')}</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
            <span className="w-20">1 cm</span>
            <div className="flex-1 h-3 bg-blue-400 rounded" style={{ width: '20%' }} />
            <span className="text-xs">{t('tools.lengthConverter.fingernail')}</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
            <span className="w-20">1 m</span>
            <div className="flex-1 h-4 bg-blue-500 rounded" style={{ width: '50%' }} />
            <span className="text-xs">{t('tools.lengthConverter.doorway')}</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
            <span className="w-20">1 km</span>
            <div className="flex-1 h-5 bg-blue-600 rounded" style={{ width: '100%' }} />
            <span className="text-xs">{t('tools.lengthConverter.walkDistance')}</span>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.lengthConverter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.lengthConverter.tip1')}</li>
          <li>{t('tools.lengthConverter.tip2')}</li>
          <li>{t('tools.lengthConverter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
