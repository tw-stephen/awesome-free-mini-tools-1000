import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

type SpeedUnit =
  | 'meterPerSecond'
  | 'kilometerPerHour'
  | 'milePerHour'
  | 'footPerSecond'
  | 'knot'
  | 'mach'

export default function SpeedConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('100')
  const [fromUnit, setFromUnit] = useState<SpeedUnit>('kilometerPerHour')
  const { copy, copied } = useClipboard()

  // All values in meters per second
  const unitFactors: Record<SpeedUnit, number> = {
    meterPerSecond: 1,
    kilometerPerHour: 0.277778,
    milePerHour: 0.44704,
    footPerSecond: 0.3048,
    knot: 0.514444,
    mach: 343, // speed of sound at sea level
  }

  const unitLabels: Record<SpeedUnit, string> = {
    meterPerSecond: 'm/s',
    kilometerPerHour: 'km/h',
    milePerHour: 'mph',
    footPerSecond: 'ft/s',
    knot: 'kn',
    mach: 'Mach',
  }

  const convert = useCallback(
    (val: number, from: SpeedUnit, to: SpeedUnit): number => {
      const mps = val * unitFactors[from]
      return mps / unitFactors[to]
    },
    []
  )

  const getConversions = useCallback(() => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return null

    const results: Record<SpeedUnit, number> = {} as Record<SpeedUnit, number>
    for (const unit of Object.keys(unitFactors) as SpeedUnit[]) {
      results[unit] = convert(numValue, fromUnit, unit)
    }
    return results
  }, [value, fromUnit, convert])

  const conversions = getConversions()

  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.001 || Math.abs(num) >= 1000000) {
      return num.toExponential(4)
    }
    return num.toPrecision(6).replace(/\.?0+$/, '')
  }

  const commonSpeeds = [
    { label: t('tools.speedConverter.walking'), mps: 1.4 },
    { label: t('tools.speedConverter.running'), mps: 5 },
    { label: t('tools.speedConverter.cycling'), mps: 8.3 },
    { label: t('tools.speedConverter.carCity'), mps: 13.9 },
    { label: t('tools.speedConverter.carHighway'), mps: 33.3 },
    { label: t('tools.speedConverter.airplane'), mps: 250 },
    { label: t('tools.speedConverter.soundSpeed'), mps: 343 },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.speedConverter.input')}
        </h3>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.speedConverter.value')}
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
              {t('tools.speedConverter.unit')}
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as SpeedUnit)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              {(Object.keys(unitFactors) as SpeedUnit[]).map((unit) => (
                <option key={unit} value={unit}>
                  {t(`tools.speedConverter.${unit}`)} ({unitLabels[unit]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {conversions && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.speedConverter.results')}
          </h3>

          <div className="space-y-2">
            {(Object.keys(unitFactors) as SpeedUnit[]).map((unit) => (
              <div
                key={unit}
                className={`flex items-center justify-between p-3 rounded ${
                  unit === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                }`}
              >
                <span className="text-sm text-slate-600">
                  {t(`tools.speedConverter.${unit}`)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg text-slate-800">
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
          {t('tools.speedConverter.commonSpeeds')}
        </h3>

        <div className="space-y-2">
          {commonSpeeds.map((speed) => (
            <div
              key={speed.label}
              className="flex items-center justify-between p-2 bg-slate-50 rounded"
            >
              <span className="text-sm text-slate-700">{speed.label}</span>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm">
                  {formatNumber(speed.mps)} m/s /{' '}
                  {formatNumber(speed.mps / unitFactors.kilometerPerHour)} km/h /{' '}
                  {formatNumber(speed.mps / unitFactors.milePerHour)} mph
                </span>
                <button
                  onClick={() => {
                    setValue(speed.mps.toString())
                    setFromUnit('meterPerSecond')
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
