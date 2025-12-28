import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

type LengthUnit =
  | 'meter'
  | 'kilometer'
  | 'centimeter'
  | 'millimeter'
  | 'micrometer'
  | 'nanometer'
  | 'mile'
  | 'yard'
  | 'foot'
  | 'inch'
  | 'nauticalMile'

export default function LengthConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('1')
  const [fromUnit, setFromUnit] = useState<LengthUnit>('meter')
  const { copy, copied } = useClipboard()

  // All values in meters
  const unitFactors: Record<LengthUnit, number> = {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    micrometer: 0.000001,
    nanometer: 0.000000001,
    mile: 1609.344,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254,
    nauticalMile: 1852,
  }

  const unitLabels: Record<LengthUnit, string> = {
    meter: 'm',
    kilometer: 'km',
    centimeter: 'cm',
    millimeter: 'mm',
    micrometer: 'μm',
    nanometer: 'nm',
    mile: 'mi',
    yard: 'yd',
    foot: 'ft',
    inch: 'in',
    nauticalMile: 'nmi',
  }

  const convert = useCallback(
    (val: number, from: LengthUnit, to: LengthUnit): number => {
      const meters = val * unitFactors[from]
      return meters / unitFactors[to]
    },
    []
  )

  const getConversions = useCallback(() => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return null

    const results: Record<LengthUnit, number> = {} as Record<LengthUnit, number>
    for (const unit of Object.keys(unitFactors) as LengthUnit[]) {
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
    metric: ['kilometer', 'meter', 'centimeter', 'millimeter', 'micrometer', 'nanometer'] as LengthUnit[],
    imperial: ['mile', 'yard', 'foot', 'inch'] as LengthUnit[],
    nautical: ['nauticalMile'] as LengthUnit[],
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.lengthConverter.input')}
        </h3>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.lengthConverter.value')}
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
              {t('tools.lengthConverter.unit')}
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as LengthUnit)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <optgroup label={t('tools.lengthConverter.metric')}>
                {unitGroups.metric.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.lengthConverter.${unit}`)} ({unitLabels[unit]})
                  </option>
                ))}
              </optgroup>
              <optgroup label={t('tools.lengthConverter.imperial')}>
                {unitGroups.imperial.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.lengthConverter.${unit}`)} ({unitLabels[unit]})
                  </option>
                ))}
              </optgroup>
              <optgroup label={t('tools.lengthConverter.nautical')}>
                {unitGroups.nautical.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.lengthConverter.${unit}`)} ({unitLabels[unit]})
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
              {t('tools.lengthConverter.metric')}
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
                    {t(`tools.lengthConverter.${unit}`)}
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
              {t('tools.lengthConverter.imperial')}
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
                    {t(`tools.lengthConverter.${unit}`)}
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
              {t('tools.lengthConverter.nautical')}
            </h3>
            <div className="space-y-2">
              {unitGroups.nautical.map((unit) => (
                <div
                  key={unit}
                  className={`flex items-center justify-between p-2 rounded ${
                    unit === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                  }`}
                >
                  <span className="text-sm text-slate-600">
                    {t(`tools.lengthConverter.${unit}`)}
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
