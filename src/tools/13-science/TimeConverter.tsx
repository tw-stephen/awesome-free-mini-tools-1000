import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface TimeUnit {
  id: string
  name: string
  toSeconds: number
}

const timeUnits: TimeUnit[] = [
  { id: 'nanosecond', name: 'Nanoseconds (ns)', toSeconds: 1e-9 },
  { id: 'microsecond', name: 'Microseconds (μs)', toSeconds: 1e-6 },
  { id: 'millisecond', name: 'Milliseconds (ms)', toSeconds: 0.001 },
  { id: 'second', name: 'Seconds (s)', toSeconds: 1 },
  { id: 'minute', name: 'Minutes (min)', toSeconds: 60 },
  { id: 'hour', name: 'Hours (h)', toSeconds: 3600 },
  { id: 'day', name: 'Days (d)', toSeconds: 86400 },
  { id: 'week', name: 'Weeks (wk)', toSeconds: 604800 },
  { id: 'month', name: 'Months (30d)', toSeconds: 2592000 },
  { id: 'year', name: 'Years (365d)', toSeconds: 31536000 },
  { id: 'decade', name: 'Decades', toSeconds: 315360000 },
  { id: 'century', name: 'Centuries', toSeconds: 3153600000 },
]

export default function TimeConverter() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('1')
  const [inputUnit, setInputUnit] = useState('hour')
  const [conversions, setConversions] = useState<Record<string, number>>({})

  const convert = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) {
      setConversions({})
      return
    }

    const inputUnitDef = timeUnits.find(u => u.id === inputUnit)
    if (!inputUnitDef) return

    const seconds = value * inputUnitDef.toSeconds
    const results: Record<string, number> = {}

    timeUnits.forEach(unit => {
      results[unit.id] = seconds / unit.toSeconds
    })

    setConversions(results)
  }

  useEffect(() => {
    convert()
  }, [inputValue, inputUnit])

  const formatNumber = (num: number): string => {
    if (num === 0) return '0'
    if (Math.abs(num) < 0.0001) return num.toExponential(4)
    if (Math.abs(num) >= 1e10) return num.toExponential(4)
    return num.toLocaleString(undefined, { maximumFractionDigits: 6 })
  }

  const formatDuration = (seconds: number): string => {
    if (seconds < 0) return '-' + formatDuration(-seconds)

    const years = Math.floor(seconds / 31536000)
    seconds %= 31536000
    const days = Math.floor(seconds / 86400)
    seconds %= 86400
    const hours = Math.floor(seconds / 3600)
    seconds %= 3600
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60

    const parts: string[] = []
    if (years > 0) parts.push(`${years}y`)
    if (days > 0) parts.push(`${days}d`)
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (secs > 0 || parts.length === 0) parts.push(`${secs.toFixed(2)}s`)

    return parts.join(' ')
  }

  const quickValues = [
    { label: '1 min', value: 1, unit: 'minute' },
    { label: '1 hour', value: 1, unit: 'hour' },
    { label: '1 day', value: 1, unit: 'day' },
    { label: '1 week', value: 1, unit: 'week' },
    { label: '1 year', value: 1, unit: 'year' },
  ]

  const timeFacts = [
    { label: t('tools.timeConverter.lightSecond'), value: '299,792 km' },
    { label: t('tools.timeConverter.heartbeat'), value: '~0.8 s' },
    { label: t('tools.timeConverter.blink'), value: '~300-400 ms' },
    { label: t('tools.timeConverter.dayOnMars'), value: '24h 37m' },
    { label: t('tools.timeConverter.yearOnVenus'), value: '224.7 Earth days' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.timeConverter.enterTime')}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="any"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-lg"
          />
          <select
            value={inputUnit}
            onChange={(e) => setInputUnit(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            {timeUnits.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {quickValues.map((q, i) => (
            <button
              key={i}
              onClick={() => { setInputValue(q.value.toString()); setInputUnit(q.unit) }}
              className="px-2 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {Object.keys(conversions).length > 0 && (
        <>
          <div className="card p-4 bg-blue-50">
            <div className="text-sm text-blue-600">{t('tools.timeConverter.humanReadable')}</div>
            <div className="text-xl font-mono font-bold text-blue-700">
              {formatDuration(conversions['second'] || 0)}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.timeConverter.conversions')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {timeUnits.slice(3, 10).map(unit => (
                <div
                  key={unit.id}
                  className={`p-3 rounded ${unit.id === inputUnit ? 'bg-blue-50 border-2 border-blue-300' : 'bg-slate-50'}`}
                >
                  <div className="text-sm text-slate-600">{unit.name}</div>
                  <div className="text-lg font-bold font-mono">
                    {formatNumber(conversions[unit.id])}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.timeConverter.precisionUnits')}</h3>
            <div className="grid grid-cols-3 gap-3">
              {timeUnits.slice(0, 3).map(unit => (
                <div
                  key={unit.id}
                  className={`p-3 rounded ${unit.id === inputUnit ? 'bg-blue-50 border-2 border-blue-300' : 'bg-slate-50'}`}
                >
                  <div className="text-xs text-slate-600">{unit.name}</div>
                  <div className="text-sm font-bold font-mono">
                    {formatNumber(conversions[unit.id])}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.timeConverter.timeFacts')}</h3>
        <div className="space-y-2">
          {timeFacts.map((fact, i) => (
            <div key={i} className="flex justify-between p-2 bg-slate-50 rounded">
              <span className="text-sm">{fact.label}</span>
              <span className="font-mono text-sm">{fact.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.timeConverter.conversionsRef')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
          <div className="p-2 bg-white rounded">1 min = 60 s</div>
          <div className="p-2 bg-white rounded">1 h = 3,600 s</div>
          <div className="p-2 bg-white rounded">1 day = 86,400 s</div>
          <div className="p-2 bg-white rounded">1 year = 31,536,000 s</div>
        </div>
      </div>
    </div>
  )
}
