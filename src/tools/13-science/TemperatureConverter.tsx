import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type TempUnit = 'celsius' | 'fahrenheit' | 'kelvin' | 'rankine'

interface TempConversion {
  celsius: number
  fahrenheit: number
  kelvin: number
  rankine: number
}

export default function TemperatureConverter() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('25')
  const [inputUnit, setInputUnit] = useState<TempUnit>('celsius')
  const [conversions, setConversions] = useState<TempConversion | null>(null)

  const toCelsius = (value: number, unit: TempUnit): number => {
    switch (unit) {
      case 'celsius': return value
      case 'fahrenheit': return (value - 32) * 5 / 9
      case 'kelvin': return value - 273.15
      case 'rankine': return (value - 491.67) * 5 / 9
    }
  }

  const fromCelsius = (celsius: number, unit: TempUnit): number => {
    switch (unit) {
      case 'celsius': return celsius
      case 'fahrenheit': return celsius * 9 / 5 + 32
      case 'kelvin': return celsius + 273.15
      case 'rankine': return (celsius + 273.15) * 9 / 5
    }
  }

  const convert = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) {
      setConversions(null)
      return
    }

    const celsius = toCelsius(value, inputUnit)
    setConversions({
      celsius: celsius,
      fahrenheit: fromCelsius(celsius, 'fahrenheit'),
      kelvin: fromCelsius(celsius, 'kelvin'),
      rankine: fromCelsius(celsius, 'rankine'),
    })
  }

  useEffect(() => {
    convert()
  }, [inputValue, inputUnit])

  const units: { id: TempUnit; label: string; symbol: string }[] = [
    { id: 'celsius', label: t('tools.temperatureConverter.celsius'), symbol: '°C' },
    { id: 'fahrenheit', label: t('tools.temperatureConverter.fahrenheit'), symbol: '°F' },
    { id: 'kelvin', label: t('tools.temperatureConverter.kelvin'), symbol: 'K' },
    { id: 'rankine', label: t('tools.temperatureConverter.rankine'), symbol: '°R' },
  ]

  const referencePoints = [
    { name: t('tools.temperatureConverter.absoluteZero'), celsius: -273.15, fahrenheit: -459.67, kelvin: 0 },
    { name: t('tools.temperatureConverter.freezingPoint'), celsius: 0, fahrenheit: 32, kelvin: 273.15 },
    { name: t('tools.temperatureConverter.roomTemp'), celsius: 20, fahrenheit: 68, kelvin: 293.15 },
    { name: t('tools.temperatureConverter.bodyTemp'), celsius: 37, fahrenheit: 98.6, kelvin: 310.15 },
    { name: t('tools.temperatureConverter.boilingPoint'), celsius: 100, fahrenheit: 212, kelvin: 373.15 },
  ]

  const quickTemps = [
    { label: '-40', value: -40, unit: 'celsius' as TempUnit },
    { label: '0°C', value: 0, unit: 'celsius' as TempUnit },
    { label: '32°F', value: 32, unit: 'fahrenheit' as TempUnit },
    { label: '100°C', value: 100, unit: 'celsius' as TempUnit },
    { label: '212°F', value: 212, unit: 'fahrenheit' as TempUnit },
    { label: '0K', value: 0, unit: 'kelvin' as TempUnit },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.temperatureConverter.enterTemp')}
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
            onChange={(e) => setInputUnit(e.target.value as TempUnit)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            {units.map(u => (
              <option key={u.id} value={u.id}>{u.symbol}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {quickTemps.map((t, i) => (
            <button
              key={i}
              onClick={() => { setInputValue(t.value.toString()); setInputUnit(t.unit) }}
              className="px-2 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {conversions && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.temperatureConverter.conversions')}</h3>
          <div className="grid grid-cols-2 gap-3">
            {units.map(u => (
              <div
                key={u.id}
                className={`p-4 rounded ${u.id === inputUnit ? 'bg-blue-50 border-2 border-blue-300' : 'bg-slate-50'}`}
              >
                <div className="text-sm text-slate-600">{u.label}</div>
                <div className="text-2xl font-bold font-mono">
                  {conversions[u.id].toFixed(2)}
                  <span className="text-lg ml-1">{u.symbol}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.temperatureConverter.referencePoints')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 text-left">{t('tools.temperatureConverter.point')}</th>
                <th className="p-2 text-center">°C</th>
                <th className="p-2 text-center">°F</th>
                <th className="p-2 text-center">K</th>
              </tr>
            </thead>
            <tbody>
              {referencePoints.map((point, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-2">{point.name}</td>
                  <td className="p-2 text-center font-mono">{point.celsius}</td>
                  <td className="p-2 text-center font-mono">{point.fahrenheit}</td>
                  <td className="p-2 text-center font-mono">{point.kelvin.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.temperatureConverter.formulas')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
          <div className="p-2 bg-white rounded">°F = °C × 9/5 + 32</div>
          <div className="p-2 bg-white rounded">°C = (°F - 32) × 5/9</div>
          <div className="p-2 bg-white rounded">K = °C + 273.15</div>
          <div className="p-2 bg-white rounded">°C = K - 273.15</div>
        </div>
      </div>

      <div className="card p-4">
        <h4 className="font-medium mb-2">{t('tools.temperatureConverter.funFact')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.temperatureConverter.minus40Fact')}
        </p>
        <div className="mt-2 p-2 bg-purple-50 rounded text-center font-mono text-lg text-purple-700">
          -40°C = -40°F
        </div>
      </div>
    </div>
  )
}
