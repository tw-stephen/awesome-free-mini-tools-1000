import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function CronGenerator() {
  const { t } = useTranslation()
  const [minute, setMinute] = useState('0')
  const [hour, setHour] = useState('*')
  const [dayOfMonth, setDayOfMonth] = useState('*')
  const [month, setMonth] = useState('*')
  const [dayOfWeek, setDayOfWeek] = useState('*')
  const { copy, copied } = useClipboard()

  const cronExpression = useMemo(() => {
    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
  }, [minute, hour, dayOfMonth, month, dayOfWeek])

  const presets = [
    { name: t('tools.cronGenerator.everyMinute'), cron: '* * * * *' },
    { name: t('tools.cronGenerator.everyHour'), cron: '0 * * * *' },
    { name: t('tools.cronGenerator.everyDay'), cron: '0 0 * * *' },
    { name: t('tools.cronGenerator.everyWeek'), cron: '0 0 * * 0' },
    { name: t('tools.cronGenerator.everyMonth'), cron: '0 0 1 * *' },
    { name: t('tools.cronGenerator.weekdays'), cron: '0 9 * * 1-5' },
  ]

  const applyPreset = useCallback((cron: string) => {
    const parts = cron.split(' ')
    setMinute(parts[0])
    setHour(parts[1])
    setDayOfMonth(parts[2])
    setMonth(parts[3])
    setDayOfWeek(parts[4])
  }, [])

  const getDescription = useCallback((): string => {
    const parts: string[] = []

    // Minute
    if (minute === '*') {
      parts.push(t('tools.cronGenerator.descEveryMinute'))
    } else if (minute.includes('/')) {
      parts.push(t('tools.cronGenerator.descEveryNMinutes', { n: minute.split('/')[1] }))
    } else if (minute.includes(',')) {
      parts.push(t('tools.cronGenerator.descAtMinutes', { minutes: minute }))
    } else {
      parts.push(t('tools.cronGenerator.descAtMinute', { minute }))
    }

    // Hour
    if (hour !== '*') {
      if (hour.includes('/')) {
        parts.push(t('tools.cronGenerator.descEveryNHours', { n: hour.split('/')[1] }))
      } else if (hour.includes('-')) {
        parts.push(t('tools.cronGenerator.descBetweenHours', { range: hour }))
      } else {
        parts.push(t('tools.cronGenerator.descAtHour', { hour }))
      }
    }

    // Day of month
    if (dayOfMonth !== '*') {
      if (dayOfMonth.includes('/')) {
        parts.push(t('tools.cronGenerator.descEveryNDays', { n: dayOfMonth.split('/')[1] }))
      } else {
        parts.push(t('tools.cronGenerator.descOnDay', { day: dayOfMonth }))
      }
    }

    // Month
    if (month !== '*') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      if (month.includes('-')) {
        parts.push(t('tools.cronGenerator.descInMonths', { months: month }))
      } else {
        const monthNum = parseInt(month) - 1
        parts.push(t('tools.cronGenerator.descInMonth', { month: monthNames[monthNum] || month }))
      }
    }

    // Day of week
    if (dayOfWeek !== '*') {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      if (dayOfWeek.includes('-')) {
        const [start, end] = dayOfWeek.split('-').map(d => parseInt(d))
        parts.push(t('tools.cronGenerator.descOnDays', { days: `${dayNames[start]} to ${dayNames[end]}` }))
      } else if (dayOfWeek.includes(',')) {
        parts.push(t('tools.cronGenerator.descOnDays', { days: dayOfWeek }))
      } else {
        const dayNum = parseInt(dayOfWeek)
        parts.push(t('tools.cronGenerator.descOnDay2', { day: dayNames[dayNum] || dayOfWeek }))
      }
    }

    return parts.join(', ')
  }, [minute, hour, dayOfMonth, month, dayOfWeek, t])

  const getNextRuns = useCallback((): string[] => {
    const runs: string[] = []
    const now = new Date()

    try {
      for (let i = 0; i < 5; i++) {
        let next = new Date(now.getTime() + (i + 1) * 60000)

        // Simple next run calculation (not perfect but illustrative)
        if (minute !== '*' && !minute.includes('/')) {
          next.setMinutes(parseInt(minute))
        }
        if (hour !== '*' && !hour.includes('/')) {
          next.setHours(parseInt(hour))
          if (next <= now) {
            next.setDate(next.getDate() + 1)
          }
        }
        if (dayOfMonth !== '*' && !dayOfMonth.includes('/')) {
          next.setDate(parseInt(dayOfMonth))
          if (next <= now) {
            next.setMonth(next.getMonth() + 1)
          }
        }

        runs.push(next.toLocaleString())
      }
    } catch {
      // Ignore calculation errors
    }

    return runs
  }, [minute, hour, dayOfMonth])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.cronGenerator.presets')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {presets.map(({ name, cron }) => (
            <Button
              key={name}
              variant="secondary"
              onClick={() => applyPreset(cron)}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.cronGenerator.expression')}
        </h3>

        <div className="grid grid-cols-5 gap-2 mb-4">
          <div>
            <label className="block text-xs text-slate-600 mb-1">
              {t('tools.cronGenerator.minute')}
            </label>
            <input
              type="text"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="w-full px-2 py-2 border border-slate-300 rounded font-mono text-sm text-center"
            />
            <p className="text-xs text-slate-500 mt-1">0-59</p>
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">
              {t('tools.cronGenerator.hour')}
            </label>
            <input
              type="text"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="w-full px-2 py-2 border border-slate-300 rounded font-mono text-sm text-center"
            />
            <p className="text-xs text-slate-500 mt-1">0-23</p>
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">
              {t('tools.cronGenerator.dayOfMonth')}
            </label>
            <input
              type="text"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              className="w-full px-2 py-2 border border-slate-300 rounded font-mono text-sm text-center"
            />
            <p className="text-xs text-slate-500 mt-1">1-31</p>
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">
              {t('tools.cronGenerator.month')}
            </label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-2 py-2 border border-slate-300 rounded font-mono text-sm text-center"
            />
            <p className="text-xs text-slate-500 mt-1">1-12</p>
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">
              {t('tools.cronGenerator.dayOfWeek')}
            </label>
            <input
              type="text"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full px-2 py-2 border border-slate-300 rounded font-mono text-sm text-center"
            />
            <p className="text-xs text-slate-500 mt-1">0-6</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
          <code className="text-lg font-mono text-slate-800">{cronExpression}</code>
          <Button variant="secondary" onClick={() => copy(cronExpression)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
      </div>

      <div className="card p-4 bg-blue-50 border border-blue-200">
        <h3 className="text-sm font-medium text-blue-700 mb-2">
          {t('tools.cronGenerator.description')}
        </h3>
        <p className="text-blue-800">{getDescription()}</p>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.cronGenerator.nextRuns')}
        </h3>
        <ul className="space-y-1">
          {getNextRuns().map((run, i) => (
            <li key={i} className="text-sm text-slate-600 font-mono">
              {run}
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 mt-2">
          {t('tools.cronGenerator.nextRunsNote')}
        </p>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.cronGenerator.syntax')}
        </h3>
        <div className="text-sm text-slate-600 space-y-1">
          <p><code className="bg-slate-100 px-1">*</code> - {t('tools.cronGenerator.syntaxAny')}</p>
          <p><code className="bg-slate-100 px-1">,</code> - {t('tools.cronGenerator.syntaxList')}</p>
          <p><code className="bg-slate-100 px-1">-</code> - {t('tools.cronGenerator.syntaxRange')}</p>
          <p><code className="bg-slate-100 px-1">/</code> - {t('tools.cronGenerator.syntaxStep')}</p>
        </div>
      </div>
    </div>
  )
}
