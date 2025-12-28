import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface PowerUnit {
  id: string
  name: string
  toWatt: number
}

const powerUnits: PowerUnit[] = [
  { id: 'watt', name: 'Watts (W)', toWatt: 1 },
  { id: 'kw', name: 'Kilowatts (kW)', toWatt: 1000 },
  { id: 'mw', name: 'Megawatts (MW)', toWatt: 1e6 },
  { id: 'gw', name: 'Gigawatts (GW)', toWatt: 1e9 },
  { id: 'hp', name: 'Horsepower (hp)', toWatt: 745.7 },
  { id: 'hpmetric', name: 'Metric HP (PS)', toWatt: 735.5 },
  { id: 'ftlbps', name: 'ft·lbf/s', toWatt: 1.35582 },
  { id: 'btuh', name: 'BTU/hour', toWatt: 0.293071 },
  { id: 'calps', name: 'cal/s', toWatt: 4.184 },
  { id: 'kcalh', name: 'kcal/h', toWatt: 1.163 },
  { id: 'va', name: 'Volt-amperes (VA)', toWatt: 1 },
  { id: 'kva', name: 'Kilovolt-amperes (kVA)', toWatt: 1000 },
]

export default function PowerConverter() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('100')
  const [inputUnit, setInputUnit] = useState('watt')
  const [conversions, setConversions] = useState<Record<string, number>>({})

  const convert = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) {
      setConversions({})
      return
    }

    const inputUnitDef = powerUnits.find(u => u.id === inputUnit)
    if (!inputUnitDef) return

    const watts = value * inputUnitDef.toWatt
    const results: Record<string, number> = {}

    powerUnits.forEach(unit => {
      results[unit.id] = watts / unit.toWatt
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
    { label: '100 W', value: 100, unit: 'watt' },
    { label: '1 kW', value: 1, unit: 'kw' },
    { label: '1 HP', value: 1, unit: 'hp' },
    { label: '1 MW', value: 1, unit: 'mw' },
    { label: '1.21 GW', value: 1.21, unit: 'gw' },
  ]

  const powerExamples = [
    { name: t('tools.powerConverter.smartphone'), value: '5-20 W' },
    { name: t('tools.powerConverter.laptop'), value: '30-100 W' },
    { name: t('tools.powerConverter.microwave'), value: '700-1200 W' },
    { name: t('tools.powerConverter.hairDryer'), value: '1000-1800 W' },
    { name: t('tools.powerConverter.carEngine'), value: '100-300 HP' },
    { name: t('tools.powerConverter.windTurbine'), value: '2-5 MW' },
    { name: t('tools.powerConverter.nuclearPlant'), value: '1-1.5 GW' },
  ]

  // Calculate energy consumption
  const calculateEnergy = () => {
    const watts = conversions.watt || 0
    if (watts <= 0) return null

    return {
      perHour: watts / 1000, // kWh
      perDay: (watts / 1000) * 24,
      perMonth: (watts / 1000) * 24 * 30,
      costPerMonth: (watts / 1000) * 24 * 30 * 0.12, // ~$0.12/kWh average
    }
  }

  const energy = calculateEnergy()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.powerConverter.enterPower')}
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
            {powerUnits.map(u => (
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
            <h3 className="font-medium mb-3">{t('tools.powerConverter.conversions')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {powerUnits.slice(0, 9).map(unit => (
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

          {energy && energy.perHour > 0 && (
            <div className="card p-4 bg-yellow-50">
              <h3 className="font-medium mb-3">{t('tools.powerConverter.energyConsumption')}</h3>
              <p className="text-xs text-yellow-600 mb-2">
                {t('tools.powerConverter.ifRunning')}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-2 bg-white rounded">
                  <div className="text-xs text-slate-600">{t('tools.powerConverter.perHour')}</div>
                  <div className="font-mono font-bold">{formatNumber(energy.perHour)} kWh</div>
                </div>
                <div className="p-2 bg-white rounded">
                  <div className="text-xs text-slate-600">{t('tools.powerConverter.perDay')}</div>
                  <div className="font-mono font-bold">{formatNumber(energy.perDay)} kWh</div>
                </div>
                <div className="p-2 bg-white rounded">
                  <div className="text-xs text-slate-600">{t('tools.powerConverter.perMonth')}</div>
                  <div className="font-mono font-bold">{formatNumber(energy.perMonth)} kWh</div>
                </div>
                <div className="p-2 bg-white rounded">
                  <div className="text-xs text-slate-600">{t('tools.powerConverter.monthlyCost')}</div>
                  <div className="font-mono font-bold">${formatNumber(energy.costPerMonth)}</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                * {t('tools.powerConverter.costNote')}
              </p>
            </div>
          )}

          <div className="card p-4 bg-blue-50">
            <h3 className="font-medium mb-2">{t('tools.powerConverter.horsepowerComparison')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-white rounded">
                <div className="text-xs text-slate-600">{t('tools.powerConverter.mechanicalHP')}</div>
                <div className="font-mono font-bold">{formatNumber(conversions.hp)} hp</div>
              </div>
              <div className="p-2 bg-white rounded">
                <div className="text-xs text-slate-600">{t('tools.powerConverter.metricHP')}</div>
                <div className="font-mono font-bold">{formatNumber(conversions.hpmetric)} PS</div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.powerConverter.commonPowers')}</h3>
        <div className="space-y-2">
          {powerExamples.map((example, i) => (
            <div key={i} className="flex justify-between p-2 bg-slate-50 rounded">
              <span className="text-sm">{example.name}</span>
              <span className="font-mono text-sm">{example.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.powerConverter.quickRef')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
          <div className="p-2 bg-white rounded">1 hp = 745.7 W</div>
          <div className="p-2 bg-white rounded">1 PS = 735.5 W</div>
          <div className="p-2 bg-white rounded">1 kW = 1.34 hp</div>
          <div className="p-2 bg-white rounded">P = E / t</div>
        </div>
      </div>

      <div className="card p-4">
        <h4 className="font-medium mb-2">{t('tools.powerConverter.funFact')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.powerConverter.backToFuture')}
        </p>
        <div className="mt-2 p-2 bg-purple-50 rounded text-center font-mono text-lg text-purple-700">
          1.21 GW = 1,620,000 hp
        </div>
      </div>
    </div>
  )
}
