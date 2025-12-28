import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function SpeedConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('kph')

  const units = [
    { id: 'mps', label: 'Meters per Second', symbol: 'm/s', toMps: 1 },
    { id: 'kph', label: 'Kilometers per Hour', symbol: 'km/h', toMps: 0.277778 },
    { id: 'mph', label: 'Miles per Hour', symbol: 'mph', toMps: 0.44704 },
    { id: 'knot', label: 'Knots', symbol: 'kn', toMps: 0.514444 },
    { id: 'fps', label: 'Feet per Second', symbol: 'ft/s', toMps: 0.3048 },
    { id: 'mach', label: 'Mach', symbol: 'Ma', toMps: 343 },
    { id: 'lightSpeed', label: 'Speed of Light', symbol: 'c', toMps: 299792458 },
  ]

  const conversions = useMemo(() => {
    const val = parseFloat(value)
    if (isNaN(val)) return null

    const fromUnitData = units.find(u => u.id === fromUnit)
    if (!fromUnitData) return null

    const mps = val * fromUnitData.toMps

    return units.reduce((acc, unit) => {
      acc[unit.id] = mps / unit.toMps
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
    { from: '100 km/h', equals: '62.14 mph' },
    { from: '60 mph', equals: '96.56 km/h' },
    { from: '1 knot', equals: '1.852 km/h' },
    { from: 'Mach 1', equals: '1235 km/h' },
    { from: '1 m/s', equals: '3.6 km/h' },
  ]

  const speedExamples = [
    { item: t('tools.speedConverter.walking'), speed: '5 km/h' },
    { item: t('tools.speedConverter.cycling'), speed: '20 km/h' },
    { item: t('tools.speedConverter.cityDriving'), speed: '50 km/h' },
    { item: t('tools.speedConverter.highway'), speed: '120 km/h' },
    { item: t('tools.speedConverter.highSpeedTrain'), speed: '300 km/h' },
    { item: t('tools.speedConverter.airplane'), speed: '900 km/h' },
    { item: t('tools.speedConverter.soundSpeed'), speed: '1235 km/h' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.speedConverter.enterValue')}
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
            {['10', '50', '100', '200'].map((v) => (
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
            {t('tools.speedConverter.results')}
          </h3>

          <div className="space-y-2">
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
          {t('tools.speedConverter.quickReference')}
        </h3>
        <div className="space-y-2">
          {quickConversions.map((conv, i) => (
            <div key={i} className="p-2 bg-slate-50 rounded text-sm">
              <span className="text-slate-600">{conv.from}</span>
              <span className="text-slate-400"> ≈ </span>
              <span className="font-medium">{conv.equals}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.speedConverter.examples')}
        </h3>
        <div className="space-y-2">
          {speedExamples.map((item, i) => (
            <div key={i} className="flex justify-between p-2 bg-slate-50 rounded text-sm">
              <span className="text-slate-600">{item.item}</span>
              <span className="font-medium">{item.speed}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.speedConverter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.speedConverter.tip1')}</li>
          <li>{t('tools.speedConverter.tip2')}</li>
          <li>{t('tools.speedConverter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
