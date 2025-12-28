import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

type EnergyUnit =
  | 'joule'
  | 'kilojoule'
  | 'calorie'
  | 'kilocalorie'
  | 'wattHour'
  | 'kilowattHour'
  | 'electronvolt'
  | 'btu'
  | 'footPound'

export default function EnergyConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('1')
  const [fromUnit, setFromUnit] = useState<EnergyUnit>('kilocalorie')
  const { copy, copied } = useClipboard()

  // All values in Joules
  const unitFactors: Record<EnergyUnit, number> = {
    joule: 1,
    kilojoule: 1000,
    calorie: 4.184,
    kilocalorie: 4184,
    wattHour: 3600,
    kilowattHour: 3600000,
    electronvolt: 1.602176634e-19,
    btu: 1055.06,
    footPound: 1.35582,
  }

  const unitLabels: Record<EnergyUnit, string> = {
    joule: 'J',
    kilojoule: 'kJ',
    calorie: 'cal',
    kilocalorie: 'kcal',
    wattHour: 'Wh',
    kilowattHour: 'kWh',
    electronvolt: 'eV',
    btu: 'BTU',
    footPound: 'ft⋅lb',
  }

  const convert = useCallback(
    (val: number, from: EnergyUnit, to: EnergyUnit): number => {
      const joules = val * unitFactors[from]
      return joules / unitFactors[to]
    },
    []
  )

  const getConversions = useCallback(() => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return null

    const results: Record<EnergyUnit, number> = {} as Record<EnergyUnit, number>
    for (const unit of Object.keys(unitFactors) as EnergyUnit[]) {
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

  const commonEnergies = [
    { label: t('tools.energyConverter.apple'), kcal: 52 },
    { label: t('tools.energyConverter.banana'), kcal: 89 },
    { label: t('tools.energyConverter.dailyIntake'), kcal: 2000 },
    { label: t('tools.energyConverter.marathon'), kcal: 2600 },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.energyConverter.input')}
        </h3>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.energyConverter.value')}
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
              {t('tools.energyConverter.unit')}
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as EnergyUnit)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              {(Object.keys(unitFactors) as EnergyUnit[]).map((unit) => (
                <option key={unit} value={unit}>
                  {t(`tools.energyConverter.${unit}`)} ({unitLabels[unit]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {conversions && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.energyConverter.results')}
          </h3>

          <div className="space-y-2">
            {(Object.keys(unitFactors) as EnergyUnit[]).map((unit) => (
              <div
                key={unit}
                className={`flex items-center justify-between p-3 rounded ${
                  unit === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                }`}
              >
                <span className="text-sm text-slate-600">
                  {t(`tools.energyConverter.${unit}`)}
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
          {t('tools.energyConverter.foodEnergy')}
        </h3>

        <div className="space-y-2">
          {commonEnergies.map((energy) => (
            <div
              key={energy.label}
              className="flex items-center justify-between p-2 bg-slate-50 rounded"
            >
              <span className="text-sm text-slate-700">{energy.label}</span>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm">
                  {energy.kcal} kcal / {formatNumber(energy.kcal * 4.184)} kJ
                </span>
                <button
                  onClick={() => {
                    setValue(energy.kcal.toString())
                    setFromUnit('kilocalorie')
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
