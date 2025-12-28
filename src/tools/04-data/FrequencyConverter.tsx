import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

type FrequencyUnit =
  | 'hertz'
  | 'kilohertz'
  | 'megahertz'
  | 'gigahertz'
  | 'terahertz'
  | 'rpm'
  | 'radPerSecond'
  | 'bpm'

export default function FrequencyConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('1')
  const [fromUnit, setFromUnit] = useState<FrequencyUnit>('megahertz')
  const { copy, copied } = useClipboard()

  // All values in Hertz
  const unitFactors: Record<FrequencyUnit, number> = {
    hertz: 1,
    kilohertz: 1000,
    megahertz: 1000000,
    gigahertz: 1000000000,
    terahertz: 1000000000000,
    rpm: 1 / 60,
    radPerSecond: 1 / (2 * Math.PI),
    bpm: 1 / 60,
  }

  const unitLabels: Record<FrequencyUnit, string> = {
    hertz: 'Hz',
    kilohertz: 'kHz',
    megahertz: 'MHz',
    gigahertz: 'GHz',
    terahertz: 'THz',
    rpm: 'RPM',
    radPerSecond: 'rad/s',
    bpm: 'BPM',
  }

  const convert = useCallback(
    (val: number, from: FrequencyUnit, to: FrequencyUnit): number => {
      const hertz = val * unitFactors[from]
      return hertz / unitFactors[to]
    },
    []
  )

  const getConversions = useCallback(() => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return null

    const results: Record<FrequencyUnit, number> = {} as Record<FrequencyUnit, number>
    for (const unit of Object.keys(unitFactors) as FrequencyUnit[]) {
      results[unit] = convert(numValue, fromUnit, unit)
    }
    return results
  }, [value, fromUnit, convert])

  const conversions = getConversions()

  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.000001 || Math.abs(num) >= 1000000000000) {
      return num.toExponential(6)
    }
    return num.toPrecision(8).replace(/\.?0+$/, '')
  }

  const commonFrequencies = [
    { label: t('tools.frequencyConverter.heartbeat'), hz: 1.2 },
    { label: t('tools.frequencyConverter.powerLine50'), hz: 50 },
    { label: t('tools.frequencyConverter.powerLine60'), hz: 60 },
    { label: t('tools.frequencyConverter.audioMiddleC'), hz: 261.63 },
    { label: t('tools.frequencyConverter.amRadio'), hz: 1000000 },
    { label: t('tools.frequencyConverter.fmRadio'), hz: 100000000 },
    { label: t('tools.frequencyConverter.wifi24'), hz: 2400000000 },
    { label: t('tools.frequencyConverter.wifi5'), hz: 5000000000 },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.frequencyConverter.input')}
        </h3>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.frequencyConverter.value')}
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
              {t('tools.frequencyConverter.unit')}
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as FrequencyUnit)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              {(Object.keys(unitFactors) as FrequencyUnit[]).map((unit) => (
                <option key={unit} value={unit}>
                  {t(`tools.frequencyConverter.${unit}`)} ({unitLabels[unit]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {conversions && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.frequencyConverter.results')}
          </h3>

          <div className="space-y-2">
            {(Object.keys(unitFactors) as FrequencyUnit[]).map((unit) => (
              <div
                key={unit}
                className={`flex items-center justify-between p-3 rounded ${
                  unit === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                }`}
              >
                <span className="text-sm text-slate-600">
                  {t(`tools.frequencyConverter.${unit}`)}
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

          <div className="mt-4 p-3 bg-slate-50 rounded">
            <span className="text-sm text-slate-600">
              {t('tools.frequencyConverter.period')}:
            </span>
            <span className="ml-2 font-mono text-slate-800">
              {formatNumber(1 / conversions.hertz)} s (
              {formatNumber((1 / conversions.hertz) * 1000)} ms)
            </span>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.frequencyConverter.commonFrequencies')}
        </h3>

        <div className="space-y-2">
          {commonFrequencies.map((freq) => (
            <div
              key={freq.label}
              className="flex items-center justify-between p-2 bg-slate-50 rounded"
            >
              <span className="text-sm text-slate-700">{freq.label}</span>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm">
                  {freq.hz >= 1000000000
                    ? `${freq.hz / 1000000000} GHz`
                    : freq.hz >= 1000000
                      ? `${freq.hz / 1000000} MHz`
                      : freq.hz >= 1000
                        ? `${freq.hz / 1000} kHz`
                        : `${freq.hz} Hz`}
                </span>
                <button
                  onClick={() => {
                    setValue(freq.hz.toString())
                    setFromUnit('hertz')
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
