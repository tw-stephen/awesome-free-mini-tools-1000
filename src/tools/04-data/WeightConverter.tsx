import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

type WeightUnit =
  | 'kilogram'
  | 'gram'
  | 'milligram'
  | 'microgram'
  | 'tonne'
  | 'pound'
  | 'ounce'
  | 'stone'
  | 'ton'
  | 'carat'

export default function WeightConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('1')
  const [fromUnit, setFromUnit] = useState<WeightUnit>('kilogram')
  const { copy, copied } = useClipboard()

  // All values in kilograms
  const unitFactors: Record<WeightUnit, number> = {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    microgram: 0.000000001,
    tonne: 1000,
    pound: 0.453592,
    ounce: 0.0283495,
    stone: 6.35029,
    ton: 907.185,
    carat: 0.0002,
  }

  const unitLabels: Record<WeightUnit, string> = {
    kilogram: 'kg',
    gram: 'g',
    milligram: 'mg',
    microgram: 'μg',
    tonne: 't',
    pound: 'lb',
    ounce: 'oz',
    stone: 'st',
    ton: 'ton',
    carat: 'ct',
  }

  const convert = useCallback(
    (val: number, from: WeightUnit, to: WeightUnit): number => {
      const kg = val * unitFactors[from]
      return kg / unitFactors[to]
    },
    []
  )

  const getConversions = useCallback(() => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return null

    const results: Record<WeightUnit, number> = {} as Record<WeightUnit, number>
    for (const unit of Object.keys(unitFactors) as WeightUnit[]) {
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
    metric: ['tonne', 'kilogram', 'gram', 'milligram', 'microgram'] as WeightUnit[],
    imperial: ['ton', 'stone', 'pound', 'ounce'] as WeightUnit[],
    other: ['carat'] as WeightUnit[],
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.weightConverter.input')}
        </h3>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.weightConverter.value')}
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
              {t('tools.weightConverter.unit')}
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as WeightUnit)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <optgroup label={t('tools.weightConverter.metric')}>
                {unitGroups.metric.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.weightConverter.${unit}`)} ({unitLabels[unit]})
                  </option>
                ))}
              </optgroup>
              <optgroup label={t('tools.weightConverter.imperial')}>
                {unitGroups.imperial.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.weightConverter.${unit}`)} ({unitLabels[unit]})
                  </option>
                ))}
              </optgroup>
              <optgroup label={t('tools.weightConverter.other')}>
                {unitGroups.other.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.weightConverter.${unit}`)} ({unitLabels[unit]})
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
              {t('tools.weightConverter.metric')}
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
                    {t(`tools.weightConverter.${unit}`)}
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
              {t('tools.weightConverter.imperial')}
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
                    {t(`tools.weightConverter.${unit}`)}
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
              {t('tools.weightConverter.other')}
            </h3>
            <div className="space-y-2">
              {unitGroups.other.map((unit) => (
                <div
                  key={unit}
                  className={`flex items-center justify-between p-2 rounded ${
                    unit === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                  }`}
                >
                  <span className="text-sm text-slate-600">
                    {t(`tools.weightConverter.${unit}`)}
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
