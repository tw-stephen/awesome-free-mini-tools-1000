import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

type TimeUnit =
  | 'nanosecond'
  | 'microsecond'
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year'
  | 'decade'
  | 'century'

export default function TimeConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('1')
  const [fromUnit, setFromUnit] = useState<TimeUnit>('hour')
  const { copy, copied } = useClipboard()

  // All values in seconds
  const unitFactors: Record<TimeUnit, number> = {
    nanosecond: 1e-9,
    microsecond: 1e-6,
    millisecond: 0.001,
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2629746, // average month (365.25/12 days)
    year: 31556952, // average year (365.25 days)
    decade: 315569520,
    century: 3155695200,
  }

  const unitLabels: Record<TimeUnit, string> = {
    nanosecond: 'ns',
    microsecond: 'μs',
    millisecond: 'ms',
    second: 's',
    minute: 'min',
    hour: 'h',
    day: 'd',
    week: 'wk',
    month: 'mo',
    year: 'yr',
    decade: 'dec',
    century: 'cent',
  }

  const convert = useCallback(
    (val: number, from: TimeUnit, to: TimeUnit): number => {
      const seconds = val * unitFactors[from]
      return seconds / unitFactors[to]
    },
    []
  )

  const getConversions = useCallback(() => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return null

    const results: Record<TimeUnit, number> = {} as Record<TimeUnit, number>
    for (const unit of Object.keys(unitFactors) as TimeUnit[]) {
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

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${formatNumber(seconds)} seconds`

    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    const parts: string[] = []
    if (days > 0) parts.push(`${days}d`)
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (secs > 0) parts.push(`${secs}s`)

    return parts.join(' ')
  }

  const unitGroups = {
    small: ['nanosecond', 'microsecond', 'millisecond', 'second'] as TimeUnit[],
    medium: ['minute', 'hour', 'day', 'week'] as TimeUnit[],
    large: ['month', 'year', 'decade', 'century'] as TimeUnit[],
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.timeConverter.input')}
        </h3>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.timeConverter.value')}
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
              {t('tools.timeConverter.unit')}
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as TimeUnit)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <optgroup label={t('tools.timeConverter.small')}>
                {unitGroups.small.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.timeConverter.${unit}`)} ({unitLabels[unit]})
                  </option>
                ))}
              </optgroup>
              <optgroup label={t('tools.timeConverter.medium')}>
                {unitGroups.medium.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.timeConverter.${unit}`)} ({unitLabels[unit]})
                  </option>
                ))}
              </optgroup>
              <optgroup label={t('tools.timeConverter.large')}>
                {unitGroups.large.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.timeConverter.${unit}`)} ({unitLabels[unit]})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {conversions && (
        <>
          <div className="card p-4 bg-blue-50 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              {t('tools.timeConverter.humanReadable')}
            </h3>
            <p className="font-mono text-lg text-blue-900">
              {formatDuration(conversions.second)}
            </p>
          </div>

          {Object.entries(unitGroups).map(([groupName, units]) => (
            <div key={groupName} className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                {t(`tools.timeConverter.${groupName}`)}
              </h3>
              <div className="space-y-2">
                {units.map((unit) => (
                  <div
                    key={unit}
                    className={`flex items-center justify-between p-2 rounded ${
                      unit === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                    }`}
                  >
                    <span className="text-sm text-slate-600">
                      {t(`tools.timeConverter.${unit}`)}
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
          ))}
        </>
      )}

      {copied && (
        <div className="text-center text-sm text-green-600">{t('common.copied')}</div>
      )}
    </div>
  )
}
