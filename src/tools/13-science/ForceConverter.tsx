import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface ForceUnit {
  id: string
  name: string
  toNewton: number
}

const forceUnits: ForceUnit[] = [
  { id: 'newton', name: 'Newtons (N)', toNewton: 1 },
  { id: 'kilonewton', name: 'Kilonewtons (kN)', toNewton: 1000 },
  { id: 'meganewton', name: 'Meganewtons (MN)', toNewton: 1e6 },
  { id: 'dyne', name: 'Dynes (dyn)', toNewton: 1e-5 },
  { id: 'kgf', name: 'Kilogram-force (kgf)', toNewton: 9.80665 },
  { id: 'gf', name: 'Gram-force (gf)', toNewton: 0.00980665 },
  { id: 'lbf', name: 'Pound-force (lbf)', toNewton: 4.44822 },
  { id: 'ozf', name: 'Ounce-force (ozf)', toNewton: 0.278014 },
  { id: 'kip', name: 'Kips (klbf)', toNewton: 4448.22 },
  { id: 'poundal', name: 'Poundals (pdl)', toNewton: 0.138255 },
]

export default function ForceConverter() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('100')
  const [inputUnit, setInputUnit] = useState('newton')
  const [conversions, setConversions] = useState<Record<string, number>>({})

  const convert = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) {
      setConversions({})
      return
    }

    const inputUnitDef = forceUnits.find(u => u.id === inputUnit)
    if (!inputUnitDef) return

    const newtons = value * inputUnitDef.toNewton
    const results: Record<string, number> = {}

    forceUnits.forEach(unit => {
      results[unit.id] = newtons / unit.toNewton
    })

    setConversions(results)
  }

  useEffect(() => {
    convert()
  }, [inputValue, inputUnit])

  const formatNumber = (num: number): string => {
    if (num === 0) return '0'
    if (Math.abs(num) < 0.0001) return num.toExponential(4)
    if (Math.abs(num) >= 1e9) return num.toExponential(4)
    return num.toLocaleString(undefined, { maximumFractionDigits: 6 })
  }

  const quickValues = [
    { label: '1 N', value: 1, unit: 'newton' },
    { label: '10 N', value: 10, unit: 'newton' },
    { label: '1 kN', value: 1, unit: 'kilonewton' },
    { label: '1 lbf', value: 1, unit: 'lbf' },
    { label: '1 kgf', value: 1, unit: 'kgf' },
  ]

  const forceExamples = [
    { name: t('tools.forceConverter.weightApple'), force: '~1 N' },
    { name: t('tools.forceConverter.humanBite'), force: '~700 N' },
    { name: t('tools.forceConverter.carEngine'), force: '~3,000 N' },
    { name: t('tools.forceConverter.spaceShuttle'), force: '~31 MN' },
    { name: t('tools.forceConverter.earthGravity'), force: '3.5×10²² N' },
  ]

  // Calculate weight on different planets (if input is in Newtons on Earth)
  const planetGravity: { name: string; g: number }[] = [
    { name: 'Moon', g: 0.166 },
    { name: 'Mars', g: 0.38 },
    { name: 'Jupiter', g: 2.53 },
    { name: 'Venus', g: 0.9 },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.forceConverter.enterForce')}
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
            {forceUnits.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {quickValues.map((q, i) => (
            <button
              key={i}
              onClick={() => { setInputValue(q.value.toString()); setInputUnit(q.unit) }}
              className="px-2 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {Object.keys(conversions).length > 0 && (
        <>
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.forceConverter.conversions')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {forceUnits.map(unit => (
                <div
                  key={unit.id}
                  className={`p-3 rounded ${unit.id === inputUnit ? 'bg-blue-50 border-2 border-blue-300' : 'bg-slate-50'}`}
                >
                  <div className="text-sm text-slate-600">{unit.name}</div>
                  <div className="text-lg font-bold font-mono">
                    {formatNumber(conversions[unit.id])}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {inputUnit === 'newton' && (
            <div className="card p-4 bg-purple-50">
              <h3 className="font-medium mb-3">{t('tools.forceConverter.weightOnPlanets')}</h3>
              <p className="text-xs text-purple-600 mb-2">
                {t('tools.forceConverter.ifThisIsWeight')}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {planetGravity.map(planet => (
                  <div key={planet.name} className="p-2 bg-white rounded text-center">
                    <div className="text-sm font-medium">{planet.name}</div>
                    <div className="font-mono text-sm">
                      {formatNumber((conversions.newton || 0) * planet.g)} N
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.forceConverter.realWorldExamples')}</h3>
        <div className="space-y-2">
          {forceExamples.map((example, i) => (
            <div key={i} className="flex justify-between p-2 bg-slate-50 rounded">
              <span className="text-sm">{example.name}</span>
              <span className="font-mono text-sm">{example.force}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.forceConverter.formulas')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
          <div className="p-2 bg-white rounded">F = m × a</div>
          <div className="p-2 bg-white rounded">W = m × g</div>
          <div className="p-2 bg-white rounded">1 kgf = 9.807 N</div>
          <div className="p-2 bg-white rounded">1 lbf = 4.448 N</div>
        </div>
      </div>

      <div className="card p-4">
        <h4 className="font-medium mb-2">{t('tools.forceConverter.aboutNewton')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.forceConverter.newtonDef')}
        </p>
        <div className="mt-2 p-2 bg-blue-50 rounded text-center font-mono">
          1 N = 1 kg × 1 m/s²
        </div>
      </div>
    </div>
  )
}
