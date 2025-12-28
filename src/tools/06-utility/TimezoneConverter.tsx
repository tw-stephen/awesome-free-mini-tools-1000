import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Timezone {
  id: string
  name: string
  offset: number
  city: string
}

const timezones: Timezone[] = [
  { id: 'UTC-12', name: 'UTC-12:00', offset: -12, city: 'Baker Island' },
  { id: 'UTC-11', name: 'UTC-11:00', offset: -11, city: 'Pago Pago' },
  { id: 'UTC-10', name: 'UTC-10:00', offset: -10, city: 'Honolulu' },
  { id: 'UTC-9', name: 'UTC-09:00', offset: -9, city: 'Anchorage' },
  { id: 'UTC-8', name: 'UTC-08:00', offset: -8, city: 'Los Angeles' },
  { id: 'UTC-7', name: 'UTC-07:00', offset: -7, city: 'Denver' },
  { id: 'UTC-6', name: 'UTC-06:00', offset: -6, city: 'Chicago' },
  { id: 'UTC-5', name: 'UTC-05:00', offset: -5, city: 'New York' },
  { id: 'UTC-4', name: 'UTC-04:00', offset: -4, city: 'Caracas' },
  { id: 'UTC-3', name: 'UTC-03:00', offset: -3, city: 'São Paulo' },
  { id: 'UTC-2', name: 'UTC-02:00', offset: -2, city: 'Mid-Atlantic' },
  { id: 'UTC-1', name: 'UTC-01:00', offset: -1, city: 'Azores' },
  { id: 'UTC+0', name: 'UTC+00:00', offset: 0, city: 'London' },
  { id: 'UTC+1', name: 'UTC+01:00', offset: 1, city: 'Paris' },
  { id: 'UTC+2', name: 'UTC+02:00', offset: 2, city: 'Cairo' },
  { id: 'UTC+3', name: 'UTC+03:00', offset: 3, city: 'Moscow' },
  { id: 'UTC+4', name: 'UTC+04:00', offset: 4, city: 'Dubai' },
  { id: 'UTC+5', name: 'UTC+05:00', offset: 5, city: 'Karachi' },
  { id: 'UTC+5.5', name: 'UTC+05:30', offset: 5.5, city: 'Mumbai' },
  { id: 'UTC+6', name: 'UTC+06:00', offset: 6, city: 'Dhaka' },
  { id: 'UTC+7', name: 'UTC+07:00', offset: 7, city: 'Bangkok' },
  { id: 'UTC+8', name: 'UTC+08:00', offset: 8, city: 'Taipei / Hong Kong' },
  { id: 'UTC+9', name: 'UTC+09:00', offset: 9, city: 'Tokyo' },
  { id: 'UTC+10', name: 'UTC+10:00', offset: 10, city: 'Sydney' },
  { id: 'UTC+11', name: 'UTC+11:00', offset: 11, city: 'Solomon Islands' },
  { id: 'UTC+12', name: 'UTC+12:00', offset: 12, city: 'Auckland' },
]

export default function TimezoneConverter() {
  const { t } = useTranslation()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState(
    new Date().toTimeString().slice(0, 5)
  )
  const [fromTimezone, setFromTimezone] = useState('UTC+8')
  const [toTimezone, setToTimezone] = useState('UTC-5')
  const [showAll, setShowAll] = useState(false)

  const result = useMemo(() => {
    const fromTz = timezones.find(tz => tz.id === fromTimezone)
    const toTz = timezones.find(tz => tz.id === toTimezone)
    if (!fromTz || !toTz) return null

    const [hours, minutes] = time.split(':').map(Number)
    const dateObj = new Date(date)
    dateObj.setHours(hours, minutes, 0, 0)

    // Convert to UTC first, then to target timezone
    const utcHours = hours - fromTz.offset
    const targetHours = utcHours + toTz.offset

    const targetDate = new Date(date)
    targetDate.setHours(targetHours, minutes, 0, 0)

    const timeDiff = toTz.offset - fromTz.offset
    const dayChange = targetDate.getDate() !== dateObj.getDate()

    return {
      time: targetDate.toTimeString().slice(0, 5),
      date: targetDate.toISOString().split('T')[0],
      formatted: targetDate.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      timeDiff: `${timeDiff >= 0 ? '+' : ''}${timeDiff} hours`,
      dayChange,
    }
  }, [date, time, fromTimezone, toTimezone])

  const allConversions = useMemo(() => {
    const fromTz = timezones.find(tz => tz.id === fromTimezone)
    if (!fromTz) return []

    const [hours, minutes] = time.split(':').map(Number)

    return timezones.map(tz => {
      const utcHours = hours - fromTz.offset
      const targetHours = utcHours + tz.offset

      const targetDate = new Date(date)
      targetDate.setHours(targetHours, minutes, 0, 0)

      return {
        ...tz,
        time: targetDate.toTimeString().slice(0, 5),
        date: targetDate.toISOString().split('T')[0],
        isDaytime: targetDate.getHours() >= 6 && targetDate.getHours() < 18,
      }
    })
  }, [date, time, fromTimezone])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.timezoneConverter.date')}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.timezoneConverter.time')}
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.timezoneConverter.from')}
              </label>
              <select
                value={fromTimezone}
                onChange={(e) => setFromTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {timezones.map((tz) => (
                  <option key={tz.id} value={tz.id}>
                    {tz.name} ({tz.city})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.timezoneConverter.to')}
              </label>
              <select
                value={toTimezone}
                onChange={(e) => setToTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {timezones.map((tz) => (
                  <option key={tz.id} value={tz.id}>
                    {tz.name} ({tz.city})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">
            {t('tools.timezoneConverter.result')}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded text-center">
              <div className="text-xs text-slate-500 mb-1">{fromTimezone}</div>
              <div className="text-2xl font-bold text-blue-600">{time}</div>
              <div className="text-sm text-slate-600">{date}</div>
            </div>
            <div className="p-4 bg-green-50 rounded text-center">
              <div className="text-xs text-slate-500 mb-1">{toTimezone}</div>
              <div className="text-2xl font-bold text-green-600">{result.time}</div>
              <div className="text-sm text-slate-600">{result.date}</div>
              {result.dayChange && (
                <div className="text-xs text-orange-500 mt-1">
                  {t('tools.timezoneConverter.differentDay')}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-slate-500">
            {t('tools.timezoneConverter.difference')}: {result.timeDiff}
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.timezoneConverter.allTimezones')}
          </h3>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            {showAll ? t('tools.timezoneConverter.showLess') : t('tools.timezoneConverter.showAll')}
          </button>
        </div>

        <div className="space-y-1 max-h-60 overflow-y-auto">
          {(showAll ? allConversions : allConversions.slice(0, 8)).map((tz) => (
            <div
              key={tz.id}
              className={`flex justify-between p-2 rounded text-sm ${
                tz.isDaytime ? 'bg-yellow-50' : 'bg-slate-800 text-white'
              }`}
            >
              <span className={tz.isDaytime ? 'text-slate-600' : 'text-slate-300'}>
                {tz.city} ({tz.name})
              </span>
              <span className={`font-mono font-medium ${tz.isDaytime ? '' : 'text-white'}`}>
                {tz.time} {tz.isDaytime ? '☀️' : '🌙'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.timezoneConverter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.timezoneConverter.tip1')}</li>
          <li>{t('tools.timezoneConverter.tip2')}</li>
          <li>{t('tools.timezoneConverter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
