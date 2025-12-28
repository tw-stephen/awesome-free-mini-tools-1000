import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

type PowerUnit =
  | 'watt'
  | 'kilowatt'
  | 'megawatt'
  | 'gigawatt'
  | 'horsepower'
  | 'metricHorsepower'
  | 'btuPerHour'
  | 'calPerSecond'
  | 'footPoundPerSecond'

export default function PowerConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('1')
  const [fromUnit, setFromUnit] = useState<PowerUnit>('kilowatt')
  const { copy, copied } = useClipboard()

  // All values in Watts
  const unitFactors: Record<PowerUnit, number> = {
    watt: 1,
    kilowatt: 1000,
    megawatt: 1000000,
    gigawatt: 1000000000,
    horsepower: 745.7,
    metricHorsepower: 735.5,
    btuPerHour: 0.293071,
    calPerSecond: 4.184,
    footPoundPerSecond: 1.35582,
  }

  const unitLabels: Record<PowerUnit, string> = {
    watt: 'W',
    kilowatt: 'kW',
    megawatt: 'MW',
    gigawatt: 'GW',
    horsepower: 'hp',
    metricHorsepower: 'PS',
    btuPerHour: 'BTU/h',
    calPerSecond: 'cal/s',
    footPoundPerSecond: 'ft⋅lb/s',
  }

  const convert = useCallback(
    (val: number, from: PowerUnit, to: PowerUnit): number => {
      const watts = val * unitFactors[from]
      return watts / unitFactors[to]
    },
    []
  )

  const getConversions = useCallback(() => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return null

    const results: Record<PowerUnit, number> = {} as Record<PowerUnit, number>
    for (const unit of Object.keys(unitFactors) as PowerUnit[]) {
      results[unit] = convert(numValue, fromUnit, unit)
    }
    return results
  }, [value, fromUnit, convert])

  const conversions = getConversions()

  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.000001 || Math.abs(num) >= 1000000000) {
      return num.toExponential(6)
    }
    return num.toPrecision(8).replace(/\.?0+$/, '')
  }

  const commonPowers = [
    { label: t('tools.powerConverter.lightBulb'), watts: 60 },
    { label: t('tools.powerConverter.laptop'), watts: 65 },
    { label: t('tools.powerConverter.microwave'), watts: 1000 },
    { label: t('tools.powerConverter.hairDryer'), watts: 1800 },
    { label: t('tools.powerConverter.electricCar'), watts: 150000 },
    { label: t('tools.powerConverter.sportsCarEngine'), watts: 373000 },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.powerConverter.input')}
        </h3>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.powerConverter.value')}
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
              {t('tools.powerConverter.unit')}
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as PowerUnit)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              {(Object.keys(unitFactors) as PowerUnit[]).map((unit) => (
                <option key={unit} value={unit}>
                  {t(`tools.powerConverter.${unit}`)} ({unitLabels[unit]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {conversions && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.powerConverter.results')}
          </h3>

          <div className="space-y-2">
            {(Object.keys(unitFactors) as PowerUnit[]).map((unit) => (
              <div
                key={unit}
                className={`flex items-center justify-between p-3 rounded ${
                  unit === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                }`}
              >
                <span className="text-sm text-slate-600">
                  {t(`tools.powerConverter.${unit}`)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-800">
                    {formatNumber(conversions[unit])} {unitLabels[unit]}
                  </span>
                  <button
                    onClick={() =>
                      copy(`${formatNumber(conversions[unit])} ${unitLabels[unit]}`)
                    }
                    className="text-blue-500 hover:text-blue-700 text-xs"
                  >
                    {t('common.copy')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.powerConverter.commonPowers')}
        </h3>

        <div className="space-y-2">
          {commonPowers.map((power) => (
            <div
              key={power.label}
              className="flex items-center justify-between p-2 bg-slate-50 rounded"
            >
              <span className="text-sm text-slate-700">{power.label}</span>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm">
                  {power.watts >= 1000
                    ? `${power.watts / 1000} kW`
                    : `${power.watts} W`}{' '}
                  / {formatNumber(power.watts / 745.7)} hp
                </span>
                <button
                  onClick={() => {
                    setValue(power.watts.toString())
                    setFromUnit('watt')
                  }}
                  className="text-blue-500 hover:text-blue-700 text-xs"
                >
                  {t('common.use')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {copied && (
        <div className="text-center text-sm text-green-600">{t('common.copied')}</div>
      )}
    </div>
  )
}
