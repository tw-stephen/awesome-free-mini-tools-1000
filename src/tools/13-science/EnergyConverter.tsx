import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface EnergyUnit {
  id: string
  name: string
  toJoule: number
}

const energyUnits: EnergyUnit[] = [
  { id: 'joule', name: 'Joules (J)', toJoule: 1 },
  { id: 'kj', name: 'Kilojoules (kJ)', toJoule: 1000 },
  { id: 'mj', name: 'Megajoules (MJ)', toJoule: 1e6 },
  { id: 'gj', name: 'Gigajoules (GJ)', toJoule: 1e9 },
  { id: 'cal', name: 'Calories (cal)', toJoule: 4.184 },
  { id: 'kcal', name: 'Kilocalories (kcal)', toJoule: 4184 },
  { id: 'wh', name: 'Watt-hours (Wh)', toJoule: 3600 },
  { id: 'kwh', name: 'Kilowatt-hours (kWh)', toJoule: 3600000 },
  { id: 'ev', name: 'Electronvolts (eV)', toJoule: 1.602e-19 },
  { id: 'btu', name: 'BTU', toJoule: 1055.06 },
  { id: 'ftlb', name: 'Foot-pounds (ft·lbf)', toJoule: 1.35582 },
  { id: 'erg', name: 'Ergs', toJoule: 1e-7 },
]

export default function EnergyConverter() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('1')
  const [inputUnit, setInputUnit] = useState('kwh')
  const [conversions, setConversions] = useState<Record<string, number>>({})

  const convert = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) {
      setConversions({})
      return
    }

    const inputUnitDef = energyUnits.find(u => u.id === inputUnit)
    if (!inputUnitDef) return

    const joules = value * inputUnitDef.toJoule
    const results: Record<string, number> = {}

    energyUnits.forEach(unit => {
      results[unit.id] = joules / unit.toJoule
    })

    setConversions(results)
  }

  useEffect(() => {
    convert()
  }, [inputValue, inputUnit])

  const formatNumber = (num: number): string => {
    if (num === 0) return '0'
    if (Math.abs(num) < 0.0001) return num.toExponential(4)
    if (Math.abs(num) >= 1e12) return num.toExponential(4)
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 })
  }

  const quickValues = [
    { label: '1 kWh', value: 1, unit: 'kwh' },
    { label: '1 kJ', value: 1, unit: 'kj' },
    { label: '100 kcal', value: 100, unit: 'kcal' },
    { label: '1 MJ', value: 1, unit: 'mj' },
    { label: '1 BTU', value: 1, unit: 'btu' },
  ]

  const energyExamples = [
    { name: t('tools.energyConverter.apple'), value: '~400 kJ (95 kcal)' },
    { name: t('tools.energyConverter.dailyIntake'), value: '8,400 kJ (2,000 kcal)' },
    { name: t('tools.energyConverter.carBattery'), value: '~2 MJ' },
    { name: t('tools.energyConverter.gasoline'), value: '~34 MJ/L' },
    { name: t('tools.energyConverter.lightning'), value: '~1 GJ' },
    { name: t('tools.energyConverter.tntTon'), value: '4.18 GJ' },
  ]

  // Calculate practical equivalents
  const calculateEquivalents = () => {
    const kwh = conversions.kwh || 0
    if (kwh <= 0) return null

    return {
      ledBulbHours: kwh / 0.01, // 10W LED bulb
      laptopHours: kwh / 0.05, // 50W laptop
      evKm: kwh / 0.15, // ~150 Wh/km for EV
      phonesCharged: kwh / 0.01, // ~10 Wh per charge
    }
  }

  const equivalents = calculateEquivalents()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.energyConverter.enterEnergy')}
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
            {energyUnits.map(u => (
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
            <h3 className="font-medium mb-3">{t('tools.energyConverter.conversions')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {energyUnits.slice(0, 9).map(unit => (
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

          {equivalents && equivalents.phonesCharged > 0 && (
            <div className="card p-4 bg-green-50">
              <h3 className="font-medium mb-3">{t('tools.energyConverter.practicalEquivalents')}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-white rounded">
                  <div className="text-xs text-slate-600">{t('tools.energyConverter.ledBulbHours')}</div>
                  <div className="font-mono font-bold">{formatNumber(equivalents.ledBulbHours)} h</div>
                </div>
                <div className="p-2 bg-white rounded">
                  <div className="text-xs text-slate-600">{t('tools.energyConverter.laptopHours')}</div>
                  <div className="font-mono font-bold">{formatNumber(equivalents.laptopHours)} h</div>
                </div>
                <div className="p-2 bg-white rounded">
                  <div className="text-xs text-slate-600">{t('tools.energyConverter.evDistance')}</div>
                  <div className="font-mono font-bold">{formatNumber(equivalents.evKm)} km</div>
                </div>
                <div className="p-2 bg-white rounded">
                  <div className="text-xs text-slate-600">{t('tools.energyConverter.phonesCharged')}</div>
                  <div className="font-mono font-bold">{formatNumber(equivalents.phonesCharged)}</div>
                </div>
              </div>
            </div>
          )}

          <div className="card p-4 bg-orange-50">
            <h3 className="font-medium mb-2">{t('tools.energyConverter.nutritionContext')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-white rounded">
                <div className="text-xs text-slate-600">{t('tools.energyConverter.inKcal')}</div>
                <div className="font-mono font-bold text-lg">{formatNumber(conversions.kcal)} kcal</div>
              </div>
              <div className="p-2 bg-white rounded">
                <div className="text-xs text-slate-600">{t('tools.energyConverter.percentDaily')}</div>
                <div className="font-mono font-bold text-lg">
                  {formatNumber((conversions.kcal / 2000) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.energyConverter.commonEnergies')}</h3>
        <div className="space-y-2">
          {energyExamples.map((example, i) => (
            <div key={i} className="flex justify-between p-2 bg-slate-50 rounded">
              <span className="text-sm">{example.name}</span>
              <span className="font-mono text-sm">{example.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.energyConverter.quickRef')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
          <div className="p-2 bg-white rounded">1 kWh = 3.6 MJ</div>
          <div className="p-2 bg-white rounded">1 kcal = 4.184 kJ</div>
          <div className="p-2 bg-white rounded">1 BTU = 1.055 kJ</div>
          <div className="p-2 bg-white rounded">1 J = 1 W·s</div>
        </div>
      </div>
    </div>
  )
}
