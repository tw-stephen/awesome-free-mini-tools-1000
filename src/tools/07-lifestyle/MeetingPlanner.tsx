import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Participant {
  id: number
  name: string
  timezone: string
  availability: boolean[]
}

export default function MeetingPlanner() {
  const { t } = useTranslation()
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0])
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: 'You', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, availability: Array(24).fill(false) },
  ])
  const [newParticipant, setNewParticipant] = useState({ name: '', timezone: 'America/New_York' })

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Taipei',
    'Asia/Singapore',
    'Australia/Sydney',
    'Pacific/Auckland',
  ]

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const addParticipant = () => {
    if (!newParticipant.name) return
    setParticipants([
      ...participants,
      {
        id: Date.now(),
        name: newParticipant.name,
        timezone: newParticipant.timezone,
        availability: Array(24).fill(false),
      },
    ])
    setNewParticipant({ name: '', timezone: 'America/New_York' })
  }

  const removeParticipant = (id: number) => {
    setParticipants(participants.filter(p => p.id !== id))
  }

  const toggleAvailability = (participantId: number, hour: number) => {
    setParticipants(participants.map(p => {
      if (p.id !== participantId) return p
      const newAvail = [...p.availability]
      newAvail[hour] = !newAvail[hour]
      return { ...p, availability: newAvail }
    }))
  }

  const getTimeInTimezone = (hour: number, fromTz: string, toTz: string) => {
    const date = new Date(`${meetingDate}T${hour.toString().padStart(2, '0')}:00:00`)
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: true,
      timeZone: toTz,
    })
    return formatter.format(date)
  }

  const bestSlots = useMemo(() => {
    if (participants.length === 0) return []

    const slots: { hour: number; count: number; percentage: number }[] = []

    for (let hour = 0; hour < 24; hour++) {
      const available = participants.filter(p => p.availability[hour]).length
      if (available > 0) {
        slots.push({
          hour,
          count: available,
          percentage: (available / participants.length) * 100,
        })
      }
    }

    return slots.sort((a, b) => b.count - a.count).slice(0, 5)
  }, [participants])

  const formatHour = (hour: number) => {
    const h = hour % 12 || 12
    const ampm = hour < 12 ? 'AM' : 'PM'
    return `${h}:00 ${ampm}`
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="mb-4">
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.meetingPlanner.date')}
          </label>
          <input
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.meetingPlanner.participants')}
        </h3>

        <div className="space-y-2 mb-4">
          {participants.map(p => (
            <div key={p.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
              <span className="flex-1 font-medium">{p.name}</span>
              <span className="text-xs text-slate-500">{p.timezone}</span>
              {p.id !== 1 && (
                <button
                  onClick={() => removeParticipant(p.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newParticipant.name}
            onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
            placeholder={t('tools.meetingPlanner.name')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <select
            value={newParticipant.timezone}
            onChange={(e) => setNewParticipant({ ...newParticipant, timezone: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            {timezones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
          <button
            onClick={addParticipant}
            className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            +
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.meetingPlanner.availability')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-1 sticky left-0 bg-white">
                  {t('tools.meetingPlanner.participant')}
                </th>
                {hours.filter((_, i) => i % 2 === 0).map(h => (
                  <th key={h} className="p-1 text-xs text-slate-500">
                    {formatHour(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {participants.map(p => (
                <tr key={p.id}>
                  <td className="p-1 font-medium sticky left-0 bg-white whitespace-nowrap">
                    {p.name}
                  </td>
                  {hours.filter((_, i) => i % 2 === 0).map(h => (
                    <td key={h} className="p-1">
                      <button
                        onClick={() => {
                          toggleAvailability(p.id, h)
                          toggleAvailability(p.id, h + 1)
                        }}
                        className={`w-8 h-6 rounded ${
                          p.availability[h] ? 'bg-green-500' : 'bg-slate-200'
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 mt-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-green-500 rounded"></span>
            <span>{t('tools.meetingPlanner.available')}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-slate-200 rounded"></span>
            <span>{t('tools.meetingPlanner.unavailable')}</span>
          </div>
        </div>
      </div>

      {bestSlots.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.meetingPlanner.bestTimes')}
          </h3>
          <div className="space-y-2">
            {bestSlots.map(slot => (
              <div key={slot.hour} className="p-3 bg-slate-50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{formatHour(slot.hour)}</span>
                  <span className="text-sm text-green-600">
                    {slot.count}/{participants.length} {t('tools.meetingPlanner.available')}
                  </span>
                </div>
                <div className="h-2 bg-slate-200 rounded overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${slot.percentage}%` }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {participants.map(p => (
                    <span
                      key={p.id}
                      className={`px-2 py-1 rounded ${
                        p.availability[slot.hour]
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {p.name}: {getTimeInTimezone(slot.hour, participants[0].timezone, p.timezone)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.meetingPlanner.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.meetingPlanner.tip1')}</li>
          <li>{t('tools.meetingPlanner.tip2')}</li>
          <li>{t('tools.meetingPlanner.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
