import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function TimeConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('hour')

  const units = [
    { id: 'year', label: 'Year', symbol: 'yr', toSecond: 31536000 },
    { id: 'month', label: 'Month (30 days)', symbol: 'mo', toSecond: 2592000 },
    { id: 'week', label: 'Week', symbol: 'wk', toSecond: 604800 },
    { id: 'day', label: 'Day', symbol: 'd', toSecond: 86400 },
    { id: 'hour', label: 'Hour', symbol: 'hr', toSecond: 3600 },
    { id: 'minute', label: 'Minute', symbol: 'min', toSecond: 60 },
    { id: 'second', label: 'Second', symbol: 's', toSecond: 1 },
    { id: 'millisecond', label: 'Millisecond', symbol: 'ms', toSecond: 0.001 },
    { id: 'microsecond', label: 'Microsecond', symbol: 'μs', toSecond: 0.000001 },
    { id: 'nanosecond', label: 'Nanosecond', symbol: 'ns', toSecond: 0.000000001 },
  ]

  const conversions = useMemo(() => {
    const val = parseFloat(value)
    if (isNaN(val)) return null

    const fromUnitData = units.find(u => u.id === fromUnit)
    if (!fromUnitData) return null

    const seconds = val * fromUnitData.toSecond

    return units.reduce((acc, unit) => {
      acc[unit.id] = seconds / unit.toSecond
      return acc
    }, {} as Record<string, number>)
  }, [value, fromUnit])

  const formatNumber = (num: number) => {
    if (num === 0) return '0'
    if (Math.abs(num) < 0.0001 || Math.abs(num) >= 1e9) {
      return num.toExponential(4)
    }
    return num.toLocaleString(undefined, { maximumFractionDigits: 6 })
  }

  const breakdown = useMemo(() => {
    const val = parseFloat(value)
    if (isNaN(val)) return null

    const fromUnitData = units.find(u => u.id === fromUnit)
    if (!fromUnitData) return null

    let seconds = val * fromUnitData.toSecond

    const years = Math.floor(seconds / 31536000)
    seconds %= 31536000

    const days = Math.floor(seconds / 86400)
    seconds %= 86400

    const hours = Math.floor(seconds / 3600)
    seconds %= 3600

    const minutes = Math.floor(seconds / 60)
    seconds %= 60

    return { years, days, hours, minutes, seconds: Math.floor(seconds) }
  }, [value, fromUnit])

  const quickConversions = [
    { from: '1 hour', equals: '3,600 seconds' },
    { from: '1 day', equals: '24 hours' },
    { from: '1 week', equals: '168 hours' },
    { from: '1 month', equals: '730 hours' },
    { from: '1 year', equals: '8,760 hours' },
    { from: '1 minute', equals: '60,000 ms' },
  ]

  const timeExamples = [
    { event: t('tools.timeConverter.blink'), duration: '300-400 ms' },
    { event: t('tools.timeConverter.heartbeat'), duration: '0.8 s' },
    { event: t('tools.timeConverter.sportsGame'), duration: '2-3 hours' },
    { event: t('tools.timeConverter.flight'), duration: '12-15 hours' },
    { event: t('tools.timeConverter.moonCycle'), duration: '29.5 days' },
    { event: t('tools.timeConverter.earthOrbit'), duration: '365.25 days' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.timeConverter.enterValue')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0"
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['1', '10', '60', '1000'].map((v) => (
              <button
                key={v}
                onClick={() => setValue(v)}
                className="px-3 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {breakdown && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.timeConverter.breakdown')}
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {breakdown.years > 0 && (
              <div className="p-3 bg-purple-50 rounded text-center min-w-[60px]">
                <div className="text-xl font-bold text-purple-600">{breakdown.years}</div>
                <div className="text-xs text-slate-500">{t('tools.timeConverter.years')}</div>
              </div>
            )}
            {(breakdown.years > 0 || breakdown.days > 0) && (
              <div className="p-3 bg-blue-50 rounded text-center min-w-[60px]">
                <div className="text-xl font-bold text-blue-600">{breakdown.days}</div>
                <div className="text-xs text-slate-500">{t('tools.timeConverter.days')}</div>
              </div>
            )}
            <div className="p-3 bg-green-50 rounded text-center min-w-[60px]">
              <div className="text-xl font-bold text-green-600">{breakdown.hours}</div>
              <div className="text-xs text-slate-500">{t('tools.timeConverter.hours')}</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded text-center min-w-[60px]">
              <div className="text-xl font-bold text-yellow-600">{breakdown.minutes}</div>
              <div className="text-xs text-slate-500">{t('tools.timeConverter.minutes')}</div>
            </div>
            <div className="p-3 bg-orange-50 rounded text-center min-w-[60px]">
              <div className="text-xl font-bold text-orange-600">{breakdown.seconds}</div>
              <div className="text-xs text-slate-500">{t('tools.timeConverter.seconds')}</div>
            </div>
          </div>
        </div>
      )}

      {conversions && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">
            {t('tools.timeConverter.results')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {units.map((unit) => (
              <div
                key={unit.id}
                className={`p-3 rounded ${
                  unit.id === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{unit.label}</span>
                  <span className="text-sm font-bold text-slate-800">
                    {formatNumber(conversions[unit.id])} {unit.symbol}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.timeConverter.quickReference')}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {quickConversions.map((conv, i) => (
            <div key={i} className="p-2 bg-slate-50 rounded text-sm">
              <span className="text-slate-600">{conv.from}</span>
              <span className="text-slate-400"> = </span>
              <span className="font-medium">{conv.equals}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.timeConverter.examples')}
        </h3>
        <div className="space-y-2">
          {timeExamples.map((item, i) => (
            <div key={i} className="flex justify-between p-2 bg-slate-50 rounded text-sm">
              <span className="text-slate-600">{item.event}</span>
              <span className="font-medium">{item.duration}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.timeConverter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.timeConverter.tip1')}</li>
          <li>{t('tools.timeConverter.tip2')}</li>
          <li>{t('tools.timeConverter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
