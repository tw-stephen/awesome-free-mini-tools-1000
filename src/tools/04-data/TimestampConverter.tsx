import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function TimestampConverter() {
  const { t } = useTranslation()
  const [timestamp, setTimestamp] = useState('')
  const [dateString, setDateString] = useState('')
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [timezone, setTimezone] = useState('local')
  const { copy, copied } = useClipboard()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatDate = useCallback(
    (date: Date): string => {
      if (timezone === 'utc') {
        return date.toISOString()
      }
      return date.toLocaleString()
    },
    [timezone]
  )

  const timestampToDate = useCallback(() => {
    if (!timestamp.trim()) return

    let ts = parseInt(timestamp, 10)

    // Check if seconds (10 digits) or milliseconds (13 digits)
    if (timestamp.length <= 10) {
      ts *= 1000
    }

    const date = new Date(ts)
    if (isNaN(date.getTime())) {
      setDateString(t('tools.timestampConverter.invalidTimestamp'))
      return
    }

    setDateString(formatDate(date))
  }, [timestamp, formatDate, t])

  const dateToTimestamp = useCallback(() => {
    if (!dateString.trim()) return

    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      setTimestamp(t('tools.timestampConverter.invalidDate'))
      return
    }

    setTimestamp(Math.floor(date.getTime() / 1000).toString())
  }, [dateString, t])

  const setNow = () => {
    setTimestamp(Math.floor(Date.now() / 1000).toString())
    setDateString(formatDate(new Date()))
  }

  const formats = [
    { label: 'Unix (seconds)', value: Math.floor(currentTime / 1000) },
    { label: 'Unix (milliseconds)', value: currentTime },
    { label: 'ISO 8601', value: new Date(currentTime).toISOString() },
    { label: 'UTC String', value: new Date(currentTime).toUTCString() },
    { label: 'Local String', value: new Date(currentTime).toLocaleString() },
    { label: 'Date Only', value: new Date(currentTime).toLocaleDateString() },
    { label: 'Time Only', value: new Date(currentTime).toLocaleTimeString() },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4 bg-blue-50 border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          {t('tools.timestampConverter.currentTime')}
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {formats.map((f) => (
            <div
              key={f.label}
              className="flex items-center justify-between bg-white p-2 rounded"
            >
              <span className="text-slate-600">{f.label}:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-800">{String(f.value)}</span>
                <button
                  onClick={() => copy(String(f.value))}
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
          {t('tools.timestampConverter.convert')}
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm text-slate-600">
            {t('tools.timestampConverter.timezone')}:
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="px-3 py-1 border border-slate-300 rounded"
          >
            <option value="local">{t('tools.timestampConverter.local')}</option>
            <option value="utc">UTC</option>
          </select>
          <Button variant="secondary" onClick={setNow}>
            {t('tools.timestampConverter.setNow')}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.timestampConverter.timestamp')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="1703683200"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
              <Button variant="primary" onClick={timestampToDate}>
                →
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.timestampConverter.dateTime')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={dateString}
                onChange={(e) => setDateString(e.target.value)}
                placeholder="2024-12-27 12:00:00"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
              <Button variant="primary" onClick={dateToTimestamp}>
                ←
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.timestampConverter.commonTimestamps')}
        </h3>

        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { label: t('tools.timestampConverter.startOfDay'), offset: 0 },
            { label: t('tools.timestampConverter.startOfWeek'), offset: 1 },
            { label: t('tools.timestampConverter.startOfMonth'), offset: 2 },
            { label: t('tools.timestampConverter.startOfYear'), offset: 3 },
          ].map((item) => {
            let date = new Date()
            if (item.offset === 0) {
              date.setHours(0, 0, 0, 0)
            } else if (item.offset === 1) {
              const day = date.getDay()
              date.setDate(date.getDate() - day)
              date.setHours(0, 0, 0, 0)
            } else if (item.offset === 2) {
              date.setDate(1)
              date.setHours(0, 0, 0, 0)
            } else if (item.offset === 3) {
              date.setMonth(0, 1)
              date.setHours(0, 0, 0, 0)
            }
            const ts = Math.floor(date.getTime() / 1000)

            return (
              <div
                key={item.label}
                className="flex items-center justify-between bg-slate-50 p-2 rounded"
              >
                <span className="text-slate-600">{item.label}:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-800">{ts}</span>
                  <button
                    onClick={() => {
                      setTimestamp(ts.toString())
                      setDateString(formatDate(date))
                    }}
                    className="text-blue-500 hover:text-blue-700 text-xs"
                  >
                    {t('common.use')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.timestampConverter.relativeTime')}
        </h3>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: '+1 hour', seconds: 3600 },
            { label: '+1 day', seconds: 86400 },
            { label: '+1 week', seconds: 604800 },
            { label: '+1 month', seconds: 2592000 },
            { label: '-1 hour', seconds: -3600 },
            { label: '-1 day', seconds: -86400 },
            { label: '-1 week', seconds: -604800 },
            { label: '-1 month', seconds: -2592000 },
          ].map((item) => (
            <Button
              key={item.label}
              variant="secondary"
              onClick={() => {
                const current = timestamp ? parseInt(timestamp) : Math.floor(Date.now() / 1000)
                const newTs = current + item.seconds
                setTimestamp(newTs.toString())
                setDateString(formatDate(new Date(newTs * 1000)))
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {copied && (
        <div className="text-center text-sm text-green-600">{t('common.copied')}</div>
      )}
    </div>
  )
}
