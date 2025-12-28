import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Attendee {
  id: number
  role: string
  count: number
  hourlyRate: number
}

export default function MeetingCostCalculator() {
  const { t } = useTranslation()
  const [meetingTitle, setMeetingTitle] = useState('')
  const [duration, setDuration] = useState(60)
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'biweekly' | 'monthly'>('once')
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: 1, role: 'Manager', count: 1, hourlyRate: 75 },
    { id: 2, role: 'Developer', count: 3, hourlyRate: 50 },
    { id: 3, role: 'Designer', count: 1, hourlyRate: 45 },
  ])

  const addAttendee = () => {
    setAttendees([...attendees, { id: Date.now(), role: '', count: 1, hourlyRate: 50 }])
  }

  const updateAttendee = (id: number, field: keyof Attendee, value: string | number) => {
    setAttendees(attendees.map(a =>
      a.id === id ? { ...a, [field]: value } : a
    ))
  }

  const removeAttendee = (id: number) => {
    if (attendees.length > 1) {
      setAttendees(attendees.filter(a => a.id !== id))
    }
  }

  const totalAttendees = attendees.reduce((sum, a) => sum + a.count, 0)
  const hourlyTotal = attendees.reduce((sum, a) => sum + (a.count * a.hourlyRate), 0)
  const meetingCost = (hourlyTotal * duration) / 60

  const frequencyMultiplier: Record<string, number> = {
    'once': 1,
    'daily': 260,
    'weekly': 52,
    'biweekly': 26,
    'monthly': 12,
  }
  const yearlyMeetings = frequencyMultiplier[frequency]
  const yearlyCost = meetingCost * yearlyMeetings
  const yearlyHours = (duration / 60) * yearlyMeetings * totalAttendees

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const generateReport = (): string => {
    let text = `MEETING COST ANALYSIS\\n${'='.repeat(50)}\\n\\n`
    text += `Meeting: ${meetingTitle || '[Meeting Name]'}\\n`
    text += `Duration: ${duration} minutes\\n`
    text += `Frequency: ${frequency}\\n\\n`

    text += `ATTENDEES\\n${'─'.repeat(30)}\\n`
    attendees.forEach(a => {
      if (a.role) {
        text += `${a.role}: ${a.count} × ${formatCurrency(a.hourlyRate)}/hr\\n`
      }
    })
    text += `Total: ${totalAttendees} people\\n\\n`

    text += `COST BREAKDOWN\\n${'─'.repeat(30)}\\n`
    text += `Per Meeting: ${formatCurrency(meetingCost)}\\n`
    text += `Yearly (${yearlyMeetings} meetings): ${formatCurrency(yearlyCost)}\\n`
    text += `Yearly Hours: ${yearlyHours.toLocaleString()} person-hours\\n`

    return text
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.meetingCostCalculator.meeting')}</label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="Meeting name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.meetingCostCalculator.frequency')}</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as typeof frequency)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value="once">One-time</option>
              <option value="daily">Daily (weekdays)</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.meetingCostCalculator.duration')}</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="15"
            max="240"
            step="15"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="px-4 py-2 bg-slate-100 rounded font-mono min-w-[100px] text-center">
            {Math.floor(duration / 60) > 0 && `${Math.floor(duration / 60)}h `}
            {duration % 60 > 0 && `${duration % 60}m`}
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>15m</span>
          <span>1h</span>
          <span>2h</span>
          <span>3h</span>
          <span>4h</span>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.meetingCostCalculator.attendees')}</h3>
          <button
            onClick={addAttendee}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            + Add Role
          </button>
        </div>
        <div className="space-y-3">
          {attendees.map((attendee) => (
            <div key={attendee.id} className="flex gap-2 items-center">
              <input
                type="text"
                value={attendee.role}
                onChange={(e) => updateAttendee(attendee.id, 'role', e.target.value)}
                placeholder="Role"
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  value={attendee.count}
                  onChange={(e) => updateAttendee(attendee.id, 'count', parseInt(e.target.value) || 1)}
                  className="w-16 px-3 py-2 border border-slate-300 rounded text-center"
                />
                <span className="text-slate-500">×</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-500">$</span>
                <input
                  type="number"
                  min="0"
                  value={attendee.hourlyRate}
                  onChange={(e) => updateAttendee(attendee.id, 'hourlyRate', parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-2 border border-slate-300 rounded"
                />
                <span className="text-slate-500">/hr</span>
              </div>
              <button
                onClick={() => removeAttendee(attendee.id)}
                className="px-2 text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-3">
          Total: {totalAttendees} attendees, {formatCurrency(hourlyTotal)}/hour combined
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(meetingCost)}</p>
          <p className="text-sm text-slate-500">Per Meeting</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{formatCurrency(yearlyCost)}</p>
          <p className="text-sm text-slate-500">Yearly Cost</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{yearlyHours.toLocaleString()}</p>
          <p className="text-sm text-slate-500">Person-Hours/Year</p>
        </div>
      </div>

      <div className="card p-4 bg-yellow-50 border-yellow-200">
        <h4 className="font-medium text-yellow-800 mb-2">💡 {t('tools.meetingCostCalculator.insights')}</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• This meeting costs {formatCurrency(meetingCost / totalAttendees)} per person</li>
          <li>• That's {formatCurrency(meetingCost / (duration / 60))} per hour of meeting</li>
          {frequency !== 'once' && (
            <li>• Reducing by 15 min saves {formatCurrency((hourlyTotal * 15 / 60) * yearlyMeetings)}/year</li>
          )}
          {totalAttendees > 5 && (
            <li>• Consider if all {totalAttendees} attendees need to be in this meeting</li>
          )}
        </ul>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.meetingCostCalculator.report')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
          {generateReport()}
        </pre>
        <button
          onClick={copyReport}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.meetingCostCalculator.copy')}
        </button>
      </div>
    </div>
  )
}
