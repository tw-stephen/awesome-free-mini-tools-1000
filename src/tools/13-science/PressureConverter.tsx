import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface PressureUnit {
  id: string
  name: string
  toPascal: number
}

const pressureUnits: PressureUnit[] = [
  { id: 'pa', name: 'Pascals (Pa)', toPascal: 1 },
  { id: 'hpa', name: 'Hectopascals (hPa)', toPascal: 100 },
  { id: 'kpa', name: 'Kilopascals (kPa)', toPascal: 1000 },
  { id: 'mpa', name: 'Megapascals (MPa)', toPascal: 1e6 },
  { id: 'bar', name: 'Bars (bar)', toPascal: 100000 },
  { id: 'mbar', name: 'Millibars (mbar)', toPascal: 100 },
  { id: 'atm', name: 'Atmospheres (atm)', toPascal: 101325 },
  { id: 'psi', name: 'PSI (lbf/in²)', toPascal: 6894.76 },
  { id: 'mmhg', name: 'mmHg (Torr)', toPascal: 133.322 },
  { id: 'inhg', name: 'inHg', toPascal: 3386.39 },
  { id: 'kgcm2', name: 'kg/cm²', toPascal: 98066.5 },
]

export default function PressureConverter() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('1')
  const [inputUnit, setInputUnit] = useState('atm')
  const [conversions, setConversions] = useState<Record<string, number>>({})

  const convert = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) {
      setConversions({})
      return
    }

    const inputUnitDef = pressureUnits.find(u => u.id === inputUnit)
    if (!inputUnitDef) return

    const pascals = value * inputUnitDef.toPascal
    const results: Record<string, number> = {}

    pressureUnits.forEach(unit => {
      results[unit.id] = pascals / unit.toPascal
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
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 })
  }

  const quickValues = [
    { label: '1 atm', value: 1, unit: 'atm' },
    { label: '1 bar', value: 1, unit: 'bar' },
    { label: '1 kPa', value: 1, unit: 'kpa' },
    { label: '14.7 psi', value: 14.7, unit: 'psi' },
    { label: '760 mmHg', value: 760, unit: 'mmhg' },
  ]

  const pressureExamples = [
    { name: t('tools.pressureConverter.seaLevel'), value: '101,325 Pa (1 atm)' },
    { name: t('tools.pressureConverter.tirePressure'), value: '200-250 kPa' },
    { name: t('tools.pressureConverter.bloodPressure'), value: '120/80 mmHg' },
    { name: t('tools.pressureConverter.scubaTank'), value: '200-300 bar' },
    { name: t('tools.pressureConverter.deepOcean'), value: '~110 MPa (10,911m)' },
    { name: t('tools.pressureConverter.marsSurface'), value: '~600 Pa' },
  ]

  const weatherCategories = [
    { range: 'Low: < 1000 hPa', desc: t('tools.pressureConverter.stormyWeather') },
    { range: 'Normal: 1000-1020 hPa', desc: t('tools.pressureConverter.normalWeather') },
    { range: 'High: > 1020 hPa', desc: t('tools.pressureConverter.clearWeather') },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.pressureConverter.enterPressure')}
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
            {pressureUnits.map(u => (
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
            <h3 className="font-medium mb-3">{t('tools.pressureConverter.conversions')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {pressureUnits.map(unit => (
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

          {conversions.hpa && (
            <div className="card p-4 bg-blue-50">
              <h3 className="font-medium mb-2">{t('tools.pressureConverter.weatherContext')}</h3>
              <div className="text-2xl font-mono font-bold text-blue-700 mb-2">
                {formatNumber(conversions.hpa)} hPa
              </div>
              <div className="space-y-1 text-sm">
                {weatherCategories.map((cat, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="font-mono text-slate-600">{cat.range}</span>
                    <span>- {cat.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.pressureConverter.commonPressures')}</h3>
        <div className="space-y-2">
          {pressureExamples.map((example, i) => (
            <div key={i} className="flex justify-between p-2 bg-slate-50 rounded">
              <span className="text-sm">{example.name}</span>
              <span className="font-mono text-sm">{example.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.pressureConverter.quickRef')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
          <div className="p-2 bg-white rounded">1 atm = 101,325 Pa</div>
          <div className="p-2 bg-white rounded">1 bar = 100,000 Pa</div>
          <div className="p-2 bg-white rounded">1 atm = 760 mmHg</div>
          <div className="p-2 bg-white rounded">1 atm = 14.7 psi</div>
        </div>
      </div>

      <div className="card p-4">
        <h4 className="font-medium mb-2">{t('tools.pressureConverter.aboutPascal')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.pressureConverter.pascalDef')}
        </p>
        <div className="mt-2 p-2 bg-blue-50 rounded text-center font-mono">
          1 Pa = 1 N/m² = 1 kg/(m·s²)
        </div>
      </div>
    </div>
  )
}
