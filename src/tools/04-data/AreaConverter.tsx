import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

type AreaUnit =
  | 'squareMeter'
  | 'squareKilometer'
  | 'squareCentimeter'
  | 'squareMillimeter'
  | 'hectare'
  | 'acre'
  | 'squareFoot'
  | 'squareYard'
  | 'squareInch'
  | 'squareMile'

export default function AreaConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('1')
  const [fromUnit, setFromUnit] = useState<AreaUnit>('squareMeter')
  const { copy, copied } = useClipboard()

  // All values in square meters
  const unitFactors: Record<AreaUnit, number> = {
    squareMeter: 1,
    squareKilometer: 1000000,
    squareCentimeter: 0.0001,
    squareMillimeter: 0.000001,
    hectare: 10000,
    acre: 4046.86,
    squareFoot: 0.092903,
    squareYard: 0.836127,
    squareInch: 0.00064516,
    squareMile: 2589988.11,
  }

  const unitLabels: Record<AreaUnit, string> = {
    squareMeter: 'm²',
    squareKilometer: 'km²',
    squareCentimeter: 'cm²',
    squareMillimeter: 'mm²',
    hectare: 'ha',
    acre: 'ac',
    squareFoot: 'ft²',
    squareYard: 'yd²',
    squareInch: 'in²',
    squareMile: 'mi²',
  }

  const convert = useCallback(
    (val: number, from: AreaUnit, to: AreaUnit): number => {
      const sqm = val * unitFactors[from]
      return sqm / unitFactors[to]
    },
    []
  )

  const getConversions = useCallback(() => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return null

    const results: Record<AreaUnit, number> = {} as Record<AreaUnit, number>
    for (const unit of Object.keys(unitFactors) as AreaUnit[]) {
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

  const unitGroups = {
    metric: [
      'squareKilometer',
      'hectare',
      'squareMeter',
      'squareCentimeter',
      'squareMillimeter',
    ] as AreaUnit[],
    imperial: ['squareMile', 'acre', 'squareYard', 'squareFoot', 'squareInch'] as AreaUnit[],
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.areaConverter.input')}
        </h3>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.areaConverter.value')}
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
              {t('tools.areaConverter.unit')}
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as AreaUnit)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <optgroup label={t('tools.areaConverter.metric')}>
                {unitGroups.metric.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.areaConverter.${unit}`)} ({unitLabels[unit]})
                  </option>
                ))}
              </optgroup>
              <optgroup label={t('tools.areaConverter.imperial')}>
                {unitGroups.imperial.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.areaConverter.${unit}`)} ({unitLabels[unit]})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {conversions && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.areaConverter.metric')}
            </h3>
            <div className="space-y-2">
              {unitGroups.metric.map((unit) => (
                <div
                  key={unit}
                  className={`flex items-center justify-between p-2 rounded ${
                    unit === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                  }`}
                >
                  <span className="text-sm text-slate-600">
                    {t(`tools.areaConverter.${unit}`)}
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

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.areaConverter.imperial')}
            </h3>
            <div className="space-y-2">
              {unitGroups.imperial.map((unit) => (
                <div
                  key={unit}
                  className={`flex items-center justify-between p-2 rounded ${
                    unit === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                  }`}
                >
                  <span className="text-sm text-slate-600">
                    {t(`tools.areaConverter.${unit}`)}
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
        </>
      )}

      {copied && (
        <div className="text-center text-sm text-green-600">{t('common.copied')}</div>
      )}
    </div>
  )
}
