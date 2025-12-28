import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

type TempUnit = 'celsius' | 'fahrenheit' | 'kelvin' | 'rankine'

export default function TemperatureConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('25')
  const [fromUnit, setFromUnit] = useState<TempUnit>('celsius')
  const { copy, copied } = useClipboard()

  const convertFromCelsius = useCallback((celsius: number) => {
    return {
      celsius: celsius,
      fahrenheit: (celsius * 9) / 5 + 32,
      kelvin: celsius + 273.15,
      rankine: ((celsius + 273.15) * 9) / 5,
    }
  }, [])

  const toCelsius = useCallback((val: number, unit: TempUnit): number => {
    switch (unit) {
      case 'celsius':
        return val
      case 'fahrenheit':
        return ((val - 32) * 5) / 9
      case 'kelvin':
        return val - 273.15
      case 'rankine':
        return ((val - 491.67) * 5) / 9
    }
  }, [])

  const getConversions = useCallback(() => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return null

    const celsius = toCelsius(numValue, fromUnit)
    return convertFromCelsius(celsius)
  }, [value, fromUnit, toCelsius, convertFromCelsius])

  const conversions = getConversions()

  const unitLabels: Record<TempUnit, string> = {
    celsius: '°C',
    fahrenheit: '°F',
    kelvin: 'K',
    rankine: '°R',
  }

  const unitNames: Record<TempUnit, string> = {
    celsius: t('tools.temperatureConverter.celsius'),
    fahrenheit: t('tools.temperatureConverter.fahrenheit'),
    kelvin: t('tools.temperatureConverter.kelvin'),
    rankine: t('tools.temperatureConverter.rankine'),
  }

  const commonTemperatures = [
    { label: t('tools.temperatureConverter.absoluteZero'), celsius: -273.15 },
    { label: t('tools.temperatureConverter.freezingPoint'), celsius: 0 },
    { label: t('tools.temperatureConverter.roomTemp'), celsius: 20 },
    { label: t('tools.temperatureConverter.bodyTemp'), celsius: 37 },
    { label: t('tools.temperatureConverter.boilingPoint'), celsius: 100 },
  ]

  const formatNumber = (num: number): string => {
    return num.toFixed(2).replace(/\.?0+$/, '')
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.temperatureConverter.input')}
        </h3>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.temperatureConverter.value')}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-lg"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.temperatureConverter.unit')}
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as TempUnit)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-lg"
            >
              {(Object.keys(unitLabels) as TempUnit[]).map((unit) => (
                <option key={unit} value={unit}>
                  {unitNames[unit]} ({unitLabels[unit]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {conversions && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.temperatureConverter.results')}
          </h3>

          <div className="space-y-3">
            {(Object.keys(conversions) as TempUnit[]).map((unit) => (
              <div
                key={unit}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  unit === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                }`}
              >
                <div>
                  <span className="text-sm text-slate-600">{unitNames[unit]}</span>
                  <p className="text-xl font-mono font-semibold text-slate-800">
                    {formatNumber(conversions[unit])} {unitLabels[unit]}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() =>
                    copy(`${formatNumber(conversions[unit])} ${unitLabels[unit]}`)
                  }
                >
                  {copied ? t('common.copied') : t('common.copy')}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.temperatureConverter.commonTemperatures')}
        </h3>

        <div className="space-y-2">
          {commonTemperatures.map((temp) => (
            <div
              key={temp.label}
              className="flex items-center justify-between p-2 bg-slate-50 rounded"
            >
              <span className="text-sm text-slate-700">{temp.label}</span>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm">
                  {formatNumber(temp.celsius)}°C /{' '}
                  {formatNumber(convertFromCelsius(temp.celsius).fahrenheit)}°F /{' '}
                  {formatNumber(convertFromCelsius(temp.celsius).kelvin)}K
                </span>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setValue(temp.celsius.toString())
                    setFromUnit('celsius')
                  }}
                >
                  {t('common.use')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.temperatureConverter.formulas')}
        </h3>

        <div className="text-sm font-mono bg-slate-50 p-4 rounded-lg space-y-1">
          <p>°F = (°C × 9/5) + 32</p>
          <p>°C = (°F - 32) × 5/9</p>
          <p>K = °C + 273.15</p>
          <p>°R = (°C + 273.15) × 9/5</p>
        </div>
      </div>
    </div>
  )
}
