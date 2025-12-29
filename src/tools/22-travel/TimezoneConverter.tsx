import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const timezones = [
  { id: 'UTC', name: 'UTC', offset: 0 },
  { id: 'America/New_York', name: 'New York (EST/EDT)', offset: -5 },
  { id: 'America/Los_Angeles', name: 'Los Angeles (PST/PDT)', offset: -8 },
  { id: 'America/Chicago', name: 'Chicago (CST/CDT)', offset: -6 },
  { id: 'America/Denver', name: 'Denver (MST/MDT)', offset: -7 },
  { id: 'Europe/London', name: 'London (GMT/BST)', offset: 0 },
  { id: 'Europe/Paris', name: 'Paris (CET/CEST)', offset: 1 },
  { id: 'Europe/Berlin', name: 'Berlin (CET/CEST)', offset: 1 },
  { id: 'Asia/Tokyo', name: 'Tokyo (JST)', offset: 9 },
  { id: 'Asia/Shanghai', name: 'Shanghai (CST)', offset: 8 },
  { id: 'Asia/Hong_Kong', name: 'Hong Kong (HKT)', offset: 8 },
  { id: 'Asia/Taipei', name: 'Taipei (CST)', offset: 8 },
  { id: 'Asia/Singapore', name: 'Singapore (SGT)', offset: 8 },
  { id: 'Asia/Seoul', name: 'Seoul (KST)', offset: 9 },
  { id: 'Asia/Dubai', name: 'Dubai (GST)', offset: 4 },
  { id: 'Asia/Kolkata', name: 'Mumbai (IST)', offset: 5.5 },
  { id: 'Australia/Sydney', name: 'Sydney (AEST/AEDT)', offset: 10 },
  { id: 'Pacific/Auckland', name: 'Auckland (NZST/NZDT)', offset: 12 },
  { id: 'Pacific/Honolulu', name: 'Honolulu (HST)', offset: -10 },
]

export default function TimezoneConverter() {
  const { t } = useTranslation()
  const [sourceZone, setSourceZone] = useState('America/New_York')
  const [targetZones, setTargetZones] = useState(['Europe/London', 'Asia/Tokyo', 'Asia/Taipei'])
  const [sourceTime, setSourceTime] = useState('')
  const [sourceDate, setSourceDate] = useState('')
  const [currentTimes, setCurrentTimes] = useState<Record<string, string>>({})

  useEffect(() => {
    const now = new Date()
    setSourceDate(now.toISOString().split('T')[0])
    setSourceTime(now.toTimeString().slice(0, 5))
    updateCurrentTimes()
    const interval = setInterval(updateCurrentTimes, 1000)
    return () => clearInterval(interval)
  }, [])

  const updateCurrentTimes = () => {
    const times: Record<string, string> = {}
    timezones.forEach(tz => {
      try {
        times[tz.id] = new Date().toLocaleTimeString('en-US', {
          timeZone: tz.id,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      } catch {
        times[tz.id] = '--:--:--'
      }
    })
    setCurrentTimes(times)
  }

  const convertTime = (targetZoneId: string) => {
    if (!sourceTime || !sourceDate) return '--:--'

    try {
      const sourceDateTime = new Date(`${sourceDate}T${sourceTime}:00`)
      const sourceOffset = timezones.find(tz => tz.id === sourceZone)?.offset || 0
      const targetOffset = timezones.find(tz => tz.id === targetZoneId)?.offset || 0

      const utcTime = sourceDateTime.getTime() - sourceOffset * 60 * 60 * 1000
      const targetTime = new Date(utcTime + targetOffset * 60 * 60 * 1000)

      return targetTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    } catch {
      return '--:--'
    }
  }

  const getDateDiff = (targetZoneId: string) => {
    if (!sourceTime || !sourceDate) return ''

    try {
      const sourceDateTime = new Date(`${sourceDate}T${sourceTime}:00`)
      const sourceOffset = timezones.find(tz => tz.id === sourceZone)?.offset || 0
      const targetOffset = timezones.find(tz => tz.id === targetZoneId)?.offset || 0

      const utcTime = sourceDateTime.getTime() - sourceOffset * 60 * 60 * 1000
      const targetTime = new Date(utcTime + targetOffset * 60 * 60 * 1000)

      const sourceDateStr = sourceDateTime.toDateString()
      const targetDateStr = targetTime.toDateString()

      if (sourceDateStr !== targetDateStr) {
        const diff = (targetTime.getTime() - sourceDateTime.getTime()) / (24 * 60 * 60 * 1000)
        return diff > 0 ? ' (+1 day)' : ' (-1 day)'
      }
      return ''
    } catch {
      return ''
    }
  }

  const addTargetZone = (zoneId: string) => {
    if (!targetZones.includes(zoneId)) {
      setTargetZones([...targetZones, zoneId])
    }
  }

  const removeTargetZone = (zoneId: string) => {
    setTargetZones(targetZones.filter(z => z !== zoneId))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.timezoneConverter.sourceTime')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={sourceZone}
            onChange={e => setSourceZone(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            {timezones.map(tz => (
              <option key={tz.id} value={tz.id}>{tz.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={sourceDate}
            onChange={e => setSourceDate(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="time"
            value={sourceTime}
            onChange={e => setSourceTime(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.timezoneConverter.addTimezone')}</h3>
        <select
          onChange={e => {
            addTargetZone(e.target.value)
            e.target.value = ''
          }}
          className="w-full px-3 py-2 border border-slate-300 rounded"
          defaultValue=""
        >
          <option value="" disabled>{t('tools.timezoneConverter.selectTimezone')}</option>
          {timezones.filter(tz => !targetZones.includes(tz.id) && tz.id !== sourceZone).map(tz => (
            <option key={tz.id} value={tz.id}>{tz.name}</option>
          ))}
        </select>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.timezoneConverter.convertedTimes')}</h3>
        <div className="space-y-3">
          {targetZones.map(zoneId => {
            const zone = timezones.find(tz => tz.id === zoneId)
            if (!zone) return null
            return (
              <div key={zoneId} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <div>
                  <div className="font-medium">{zone.name}</div>
                  <div className="text-xs text-slate-500">
                    {t('tools.timezoneConverter.currentTime')}: {currentTimes[zoneId]}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-blue-600">
                    {convertTime(zoneId)}
                    <span className="text-sm text-orange-500">{getDateDiff(zoneId)}</span>
                  </span>
                  <button
                    onClick={() => removeTargetZone(zoneId)}
                    className="text-red-400 hover:text-red-600"
                  >
                    x
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.timezoneConverter.allTimezones')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {timezones.map(tz => (
            <div key={tz.id} className="text-sm p-2 bg-slate-50 rounded">
              <div className="font-medium truncate">{tz.name}</div>
              <div className="text-slate-500">{currentTimes[tz.id]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
