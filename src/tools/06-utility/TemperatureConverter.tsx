import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function TemperatureConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('celsius')

  const units = [
    { id: 'celsius', label: 'Celsius (°C)', symbol: '°C' },
    { id: 'fahrenheit', label: 'Fahrenheit (°F)', symbol: '°F' },
    { id: 'kelvin', label: 'Kelvin (K)', symbol: 'K' },
    { id: 'rankine', label: 'Rankine (°R)', symbol: '°R' },
    { id: 'reaumur', label: 'Réaumur (°Ré)', symbol: '°Ré' },
  ]

  const conversions = useMemo(() => {
    const val = parseFloat(value)
    if (isNaN(val)) return null

    // First convert to Celsius
    let celsius: number
    switch (fromUnit) {
      case 'celsius':
        celsius = val
        break
      case 'fahrenheit':
        celsius = (val - 32) * 5 / 9
        break
      case 'kelvin':
        celsius = val - 273.15
        break
      case 'rankine':
        celsius = (val - 491.67) * 5 / 9
        break
      case 'reaumur':
        celsius = val * 5 / 4
        break
      default:
        celsius = val
    }

    // Then convert from Celsius to all units
    return {
      celsius,
      fahrenheit: celsius * 9 / 5 + 32,
      kelvin: celsius + 273.15,
      rankine: (celsius + 273.15) * 9 / 5,
      reaumur: celsius * 4 / 5,
    }
  }, [value, fromUnit])

  const getTemperatureDescription = (celsius: number) => {
    if (celsius < -40) return { text: t('tools.temperatureConverter.extremelyCold'), color: 'text-blue-900' }
    if (celsius < -10) return { text: t('tools.temperatureConverter.veryCold'), color: 'text-blue-700' }
    if (celsius < 0) return { text: t('tools.temperatureConverter.freezing'), color: 'text-blue-500' }
    if (celsius < 10) return { text: t('tools.temperatureConverter.cold'), color: 'text-cyan-500' }
    if (celsius < 20) return { text: t('tools.temperatureConverter.cool'), color: 'text-green-500' }
    if (celsius < 25) return { text: t('tools.temperatureConverter.comfortable'), color: 'text-green-600' }
    if (celsius < 30) return { text: t('tools.temperatureConverter.warm'), color: 'text-yellow-500' }
    if (celsius < 35) return { text: t('tools.temperatureConverter.hot'), color: 'text-orange-500' }
    if (celsius < 40) return { text: t('tools.temperatureConverter.veryHot'), color: 'text-red-500' }
    return { text: t('tools.temperatureConverter.extremelyHot'), color: 'text-red-700' }
  }

  const temperatureReferences = [
    { temp: -273.15, label: t('tools.temperatureConverter.absoluteZero') },
    { temp: -40, label: t('tools.temperatureConverter.cfEqual') },
    { temp: 0, label: t('tools.temperatureConverter.waterFreezes') },
    { temp: 20, label: t('tools.temperatureConverter.roomTemp') },
    { temp: 37, label: t('tools.temperatureConverter.bodyTemp') },
    { temp: 100, label: t('tools.temperatureConverter.waterBoils') },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.temperatureConverter.enterTemperature')}
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
        </div>
      </div>

      {conversions && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-4">
              {t('tools.temperatureConverter.results')}
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
                    <span className="text-lg font-bold text-slate-800">
                      {(conversions as Record<string, number>)[unit.id].toFixed(2)} {unit.symbol}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {conversions.celsius !== undefined && (
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-red-100 rounded">
                <div className="text-center">
                  <span className={`text-lg font-medium ${getTemperatureDescription(conversions.celsius).color}`}>
                    {getTemperatureDescription(conversions.celsius).text}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.temperatureConverter.scale')}
            </h3>
            <div className="relative h-8 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-full overflow-hidden">
              {conversions.celsius >= -50 && conversions.celsius <= 50 && (
                <div
                  className="absolute top-0 h-full w-1 bg-black"
                  style={{ left: `${((conversions.celsius + 50) / 100) * 100}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap">
                    {conversions.celsius.toFixed(1)}°C
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>-50°C</span>
              <span>0°C</span>
              <span>50°C</span>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.temperatureConverter.references')}
        </h3>
        <div className="space-y-2">
          {temperatureReferences.map((ref, i) => (
            <div key={i} className="flex justify-between text-sm p-2 bg-slate-50 rounded">
              <span className="text-slate-600">{ref.label}</span>
              <span className="font-medium">
                {ref.temp}°C / {(ref.temp * 9 / 5 + 32).toFixed(1)}°F
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.temperatureConverter.formulas')}
        </h3>
        <div className="space-y-2 text-sm font-mono text-slate-600">
          <div className="p-2 bg-slate-50 rounded">°F = °C × 9/5 + 32</div>
          <div className="p-2 bg-slate-50 rounded">°C = (°F - 32) × 5/9</div>
          <div className="p-2 bg-slate-50 rounded">K = °C + 273.15</div>
          <div className="p-2 bg-slate-50 rounded">°R = (°C + 273.15) × 9/5</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.temperatureConverter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.temperatureConverter.tip1')}</li>
          <li>{t('tools.temperatureConverter.tip2')}</li>
          <li>{t('tools.temperatureConverter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
