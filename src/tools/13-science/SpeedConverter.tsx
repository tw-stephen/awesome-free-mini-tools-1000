import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface SpeedUnit {
  id: string
  name: string
  toMps: number // conversion factor to meters per second
}

const speedUnits: SpeedUnit[] = [
  { id: 'mps', name: 'm/s', toMps: 1 },
  { id: 'kmh', name: 'km/h', toMps: 1 / 3.6 },
  { id: 'mph', name: 'mph', toMps: 0.44704 },
  { id: 'fps', name: 'ft/s', toMps: 0.3048 },
  { id: 'knot', name: 'knots', toMps: 0.514444 },
  { id: 'mach', name: 'Mach', toMps: 343 },
  { id: 'light', name: 'c (light)', toMps: 299792458 },
]

export default function SpeedConverter() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('100')
  const [inputUnit, setInputUnit] = useState('kmh')
  const [conversions, setConversions] = useState<Record<string, number>>({})

  const convert = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) {
      setConversions({})
      return
    }

    const inputUnitDef = speedUnits.find(u => u.id === inputUnit)
    if (!inputUnitDef) return

    const mps = value * inputUnitDef.toMps
    const results: Record<string, number> = {}

    speedUnits.forEach(unit => {
      results[unit.id] = mps / unit.toMps
    })

    setConversions(results)
  }

  useEffect(() => {
    convert()
  }, [inputValue, inputUnit])

  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.001) return num.toExponential(4)
    if (Math.abs(num) >= 1000000) return num.toExponential(4)
    return num.toFixed(4).replace(/\.?0+$/, '')
  }

  const referenceSpeds = [
    { name: t('tools.speedConverter.walking'), speed: 5, unit: 'km/h' },
    { name: t('tools.speedConverter.cycling'), speed: 20, unit: 'km/h' },
    { name: t('tools.speedConverter.carCity'), speed: 50, unit: 'km/h' },
    { name: t('tools.speedConverter.carHighway'), speed: 120, unit: 'km/h' },
    { name: t('tools.speedConverter.train'), speed: 300, unit: 'km/h' },
    { name: t('tools.speedConverter.soundSpeed'), speed: 343, unit: 'm/s' },
    { name: t('tools.speedConverter.jetPlane'), speed: 900, unit: 'km/h' },
    { name: t('tools.speedConverter.spaceStation'), speed: 7.66, unit: 'km/s' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.speedConverter.enterSpeed')}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="any"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-lg"
          />
          <select
            value={inputUnit}
            onChange={(e) => setInputUnit(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            {speedUnits.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {[60, 100, 120, 200, 300].map(val => (
            <button
              key={val}
              onClick={() => { setInputValue(val.toString()); setInputUnit('kmh') }}
              className="px-2 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
            >
              {val} km/h
            </button>
          ))}
        </div>
      </div>

      {Object.keys(conversions).length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.speedConverter.conversions')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {speedUnits.map(unit => (
              <div
                key={unit.id}
                className={`p-3 rounded ${unit.id === inputUnit ? 'bg-blue-50 border-2 border-blue-300' : 'bg-slate-50'}`}
              >
                <div className="text-sm text-slate-600">{unit.name}</div>
                <div className="text-xl font-bold font-mono">
                  {formatNumber(conversions[unit.id])}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.speedConverter.referenceSpeeds')}</h3>
        <div className="space-y-2">
          {referenceSpeds.map((ref, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded">
              <span className="text-sm">{ref.name}</span>
              <button
                onClick={() => {
                  setInputValue(ref.speed.toString())
                  setInputUnit(ref.unit === 'km/h' ? 'kmh' : ref.unit === 'm/s' ? 'mps' : 'kmh')
                }}
                className="font-mono text-blue-600 hover:underline"
              >
                {ref.speed} {ref.unit}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.speedConverter.commonConversions')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
          <div className="p-2 bg-white rounded">1 km/h = 0.277 m/s</div>
          <div className="p-2 bg-white rounded">1 mph = 1.609 km/h</div>
          <div className="p-2 bg-white rounded">1 knot = 1.852 km/h</div>
          <div className="p-2 bg-white rounded">Mach 1 = 343 m/s</div>
        </div>
      </div>
    </div>
  )
}
