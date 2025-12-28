import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

type VolumeUnit =
  | 'cubicMeter'
  | 'liter'
  | 'milliliter'
  | 'cubicCentimeter'
  | 'gallon'
  | 'quart'
  | 'pint'
  | 'cup'
  | 'fluidOunce'
  | 'tablespoon'
  | 'teaspoon'
  | 'cubicFoot'
  | 'cubicInch'

export default function VolumeConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('1')
  const [fromUnit, setFromUnit] = useState<VolumeUnit>('liter')
  const { copy, copied } = useClipboard()

  // All values in liters
  const unitFactors: Record<VolumeUnit, number> = {
    cubicMeter: 1000,
    liter: 1,
    milliliter: 0.001,
    cubicCentimeter: 0.001,
    gallon: 3.78541,
    quart: 0.946353,
    pint: 0.473176,
    cup: 0.236588,
    fluidOunce: 0.0295735,
    tablespoon: 0.0147868,
    teaspoon: 0.00492892,
    cubicFoot: 28.3168,
    cubicInch: 0.0163871,
  }

  const unitLabels: Record<VolumeUnit, string> = {
    cubicMeter: 'm³',
    liter: 'L',
    milliliter: 'mL',
    cubicCentimeter: 'cm³',
    gallon: 'gal',
    quart: 'qt',
    pint: 'pt',
    cup: 'cup',
    fluidOunce: 'fl oz',
    tablespoon: 'tbsp',
    teaspoon: 'tsp',
    cubicFoot: 'ft³',
    cubicInch: 'in³',
  }

  const convert = useCallback(
    (val: number, from: VolumeUnit, to: VolumeUnit): number => {
      const liters = val * unitFactors[from]
      return liters / unitFactors[to]
    },
    []
  )

  const getConversions = useCallback(() => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return null

    const results: Record<VolumeUnit, number> = {} as Record<VolumeUnit, number>
    for (const unit of Object.keys(unitFactors) as VolumeUnit[]) {
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
    metric: ['cubicMeter', 'liter', 'milliliter', 'cubicCentimeter'] as VolumeUnit[],
    imperial: ['gallon', 'quart', 'pint', 'cubicFoot', 'cubicInch'] as VolumeUnit[],
    cooking: ['cup', 'fluidOunce', 'tablespoon', 'teaspoon'] as VolumeUnit[],
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.volumeConverter.input')}
        </h3>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.volumeConverter.value')}
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
              {t('tools.volumeConverter.unit')}
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as VolumeUnit)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <optgroup label={t('tools.volumeConverter.metric')}>
                {unitGroups.metric.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.volumeConverter.${unit}`)} ({unitLabels[unit]})
                  </option>
                ))}
              </optgroup>
              <optgroup label={t('tools.volumeConverter.imperial')}>
                {unitGroups.imperial.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.volumeConverter.${unit}`)} ({unitLabels[unit]})
                  </option>
                ))}
              </optgroup>
              <optgroup label={t('tools.volumeConverter.cooking')}>
                {unitGroups.cooking.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.volumeConverter.${unit}`)} ({unitLabels[unit]})
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
              {t('tools.volumeConverter.metric')}
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
                    {t(`tools.volumeConverter.${unit}`)}
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
              {t('tools.volumeConverter.imperial')}
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
                    {t(`tools.volumeConverter.${unit}`)}
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
              {t('tools.volumeConverter.cooking')}
            </h3>
            <div className="space-y-2">
              {unitGroups.cooking.map((unit) => (
                <div
                  key={unit}
                  className={`flex items-center justify-between p-2 rounded ${
                    unit === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                  }`}
                >
                  <span className="text-sm text-slate-600">
                    {t(`tools.volumeConverter.${unit}`)}
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
