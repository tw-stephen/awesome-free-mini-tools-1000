import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

type AngleUnit = 'degree' | 'radian' | 'gradian' | 'turn' | 'arcminute' | 'arcsecond'

export default function AngleConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('90')
  const [fromUnit, setFromUnit] = useState<AngleUnit>('degree')
  const { copy, copied } = useClipboard()

  // All values in degrees
  const unitFactors: Record<AngleUnit, number> = {
    degree: 1,
    radian: 180 / Math.PI,
    gradian: 0.9,
    turn: 360,
    arcminute: 1 / 60,
    arcsecond: 1 / 3600,
  }

  const unitLabels: Record<AngleUnit, string> = {
    degree: '°',
    radian: 'rad',
    gradian: 'grad',
    turn: 'turn',
    arcminute: "'",
    arcsecond: '"',
  }

  const convert = useCallback(
    (val: number, from: AngleUnit, to: AngleUnit): number => {
      const degrees = val * unitFactors[from]
      return degrees / unitFactors[to]
    },
    []
  )

  const getConversions = useCallback(() => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return null

    const results: Record<AngleUnit, number> = {} as Record<AngleUnit, number>
    for (const unit of Object.keys(unitFactors) as AngleUnit[]) {
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

  const commonAngles = [
    { deg: 0, label: '0°' },
    { deg: 30, label: '30° (π/6)' },
    { deg: 45, label: '45° (π/4)' },
    { deg: 60, label: '60° (π/3)' },
    { deg: 90, label: '90° (π/2)' },
    { deg: 120, label: '120° (2π/3)' },
    { deg: 135, label: '135° (3π/4)' },
    { deg: 180, label: '180° (π)' },
    { deg: 270, label: '270° (3π/2)' },
    { deg: 360, label: '360° (2π)' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.angleConverter.input')}
        </h3>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.angleConverter.value')}
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
              {t('tools.angleConverter.unit')}
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as AngleUnit)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              {(Object.keys(unitFactors) as AngleUnit[]).map((unit) => (
                <option key={unit} value={unit}>
                  {t(`tools.angleConverter.${unit}`)} ({unitLabels[unit]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {conversions && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.angleConverter.results')}
          </h3>

          <div className="space-y-2">
            {(Object.keys(unitFactors) as AngleUnit[]).map((unit) => (
              <div
                key={unit}
                className={`flex items-center justify-between p-3 rounded ${
                  unit === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                }`}
              >
                <span className="text-sm text-slate-600">
                  {t(`tools.angleConverter.${unit}`)}
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
          {t('tools.angleConverter.commonAngles')}
        </h3>

        <div className="grid grid-cols-5 gap-2">
          {commonAngles.map((angle) => (
            <button
              key={angle.deg}
              onClick={() => {
                setValue(angle.deg.toString())
                setFromUnit('degree')
              }}
              className="p-2 bg-slate-50 rounded hover:bg-slate-100 text-center"
            >
              <span className="text-sm font-mono text-slate-700">{angle.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.angleConverter.trigValues')}
        </h3>

        {conversions && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-50 p-3 rounded">
              <div className="text-xs text-slate-500">sin</div>
              <div className="font-mono text-lg">
                {formatNumber(Math.sin(conversions.radian))}
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded">
              <div className="text-xs text-slate-500">cos</div>
              <div className="font-mono text-lg">
                {formatNumber(Math.cos(conversions.radian))}
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded">
              <div className="text-xs text-slate-500">tan</div>
              <div className="font-mono text-lg">
                {Math.abs(Math.cos(conversions.radian)) < 0.0001
                  ? '∞'
                  : formatNumber(Math.tan(conversions.radian))}
              </div>
            </div>
          </div>
        )}
      </div>

      {copied && (
        <div className="text-center text-sm text-green-600">{t('common.copied')}</div>
      )}
    </div>
  )
}
