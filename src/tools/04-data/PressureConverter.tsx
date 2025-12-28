import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

type PressureUnit =
  | 'pascal'
  | 'kilopascal'
  | 'megapascal'
  | 'bar'
  | 'millibar'
  | 'psi'
  | 'atmosphere'
  | 'torr'
  | 'mmHg'

export default function PressureConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('1')
  const [fromUnit, setFromUnit] = useState<PressureUnit>('atmosphere')
  const { copy, copied } = useClipboard()

  // All values in Pascals
  const unitFactors: Record<PressureUnit, number> = {
    pascal: 1,
    kilopascal: 1000,
    megapascal: 1000000,
    bar: 100000,
    millibar: 100,
    psi: 6894.76,
    atmosphere: 101325,
    torr: 133.322,
    mmHg: 133.322,
  }

  const unitLabels: Record<PressureUnit, string> = {
    pascal: 'Pa',
    kilopascal: 'kPa',
    megapascal: 'MPa',
    bar: 'bar',
    millibar: 'mbar',
    psi: 'psi',
    atmosphere: 'atm',
    torr: 'Torr',
    mmHg: 'mmHg',
  }

  const convert = useCallback(
    (val: number, from: PressureUnit, to: PressureUnit): number => {
      const pascal = val * unitFactors[from]
      return pascal / unitFactors[to]
    },
    []
  )

  const getConversions = useCallback(() => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return null

    const results: Record<PressureUnit, number> = {} as Record<PressureUnit, number>
    for (const unit of Object.keys(unitFactors) as PressureUnit[]) {
      results[unit] = convert(numValue, fromUnit, unit)
    }
    return results
  }, [value, fromUnit, convert])

  const conversions = getConversions()

  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.000001 || Math.abs(num) >= 1000000) {
      return num.toExponential(6)
    }
    return num.toPrecision(8).replace(/\.?0+$/, '')
  }

  const commonPressures = [
    { label: t('tools.pressureConverter.vacuum'), pa: 0 },
    { label: t('tools.pressureConverter.seaLevel'), pa: 101325 },
    { label: t('tools.pressureConverter.tirePressure'), pa: 220632 },
    { label: t('tools.pressureConverter.scubaTank'), pa: 20265000 },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.pressureConverter.input')}
        </h3>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.pressureConverter.value')}
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
              {t('tools.pressureConverter.unit')}
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as PressureUnit)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              {(Object.keys(unitFactors) as PressureUnit[]).map((unit) => (
                <option key={unit} value={unit}>
                  {t(`tools.pressureConverter.${unit}`)} ({unitLabels[unit]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {conversions && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.pressureConverter.results')}
          </h3>

          <div className="space-y-2">
            {(Object.keys(unitFactors) as PressureUnit[]).map((unit) => (
              <div
                key={unit}
                className={`flex items-center justify-between p-3 rounded ${
                  unit === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                }`}
              >
                <span className="text-sm text-slate-600">
                  {t(`tools.pressureConverter.${unit}`)}
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
          {t('tools.pressureConverter.commonPressures')}
        </h3>

        <div className="space-y-2">
          {commonPressures.map((pressure) => (
            <div
              key={pressure.label}
              className="flex items-center justify-between p-2 bg-slate-50 rounded"
            >
              <span className="text-sm text-slate-700">{pressure.label}</span>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm">
                  {formatNumber(pressure.pa)} Pa / {formatNumber(pressure.pa / 101325)} atm
                </span>
                <button
                  onClick={() => {
                    setValue(pressure.pa.toString())
                    setFromUnit('pascal')
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
