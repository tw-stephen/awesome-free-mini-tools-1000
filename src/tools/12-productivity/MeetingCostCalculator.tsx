import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Attendee {
  id: string
  role: string
  hourlyRate: number
  count: number
}

export default function MeetingCostCalculator() {
  const { t } = useTranslation()
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: '1', role: 'Developer', hourlyRate: 75, count: 3 },
    { id: '2', role: 'Designer', hourlyRate: 65, count: 1 },
    { id: '3', role: 'Manager', hourlyRate: 100, count: 1 }
  ])
  const [duration, setDuration] = useState(60)
  const [frequency, setFrequency] = useState<'once' | 'weekly' | 'daily'>('once')
  const [newRole, setNewRole] = useState('')
  const [newRate, setNewRate] = useState(50)
  const [newCount, setNewCount] = useState(1)

  const addAttendee = () => {
    if (!newRole.trim()) return
    setAttendees([...attendees, {
      id: Date.now().toString(),
      role: newRole,
      hourlyRate: newRate,
      count: newCount
    }])
    setNewRole('')
    setNewRate(50)
    setNewCount(1)
  }

  const removeAttendee = (id: string) => {
    setAttendees(attendees.filter(a => a.id !== id))
  }

  const updateAttendee = (id: string, field: keyof Attendee, value: number | string) => {
    setAttendees(attendees.map(a =>
      a.id === id ? { ...a, [field]: value } : a
    ))
  }

  const calculateMeetingCost = () => {
    let totalCost = 0
    attendees.forEach(attendee => {
      totalCost += (attendee.hourlyRate / 60) * duration * attendee.count
    })
    return totalCost
  }

  const getTotalAttendees = () => {
    return attendees.reduce((sum, a) => sum + a.count, 0)
  }

  const getAnnualCost = () => {
    const baseCost = calculateMeetingCost()
    switch (frequency) {
      case 'daily': return baseCost * 260 // ~260 working days
      case 'weekly': return baseCost * 52
      default: return baseCost
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const meetingCost = calculateMeetingCost()
  const annualCost = getAnnualCost()
  const totalAttendees = getTotalAttendees()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-600 block mb-2">
          {t('tools.meetingCostCalculator.duration')} ({t('tools.meetingCostCalculator.minutes')})
        </label>
        <div className="flex gap-2">
          {[15, 30, 45, 60, 90, 120].map(d => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-3 py-1 rounded text-sm ${
                duration === d ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {d}m
            </button>
          ))}
        </div>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
          className="w-full mt-2 px-3 py-2 border border-slate-300 rounded"
          min="1"
        />
      </div>

      <div className="card p-4">
        <label className="text-sm text-slate-600 block mb-2">
          {t('tools.meetingCostCalculator.frequency')}
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setFrequency('once')}
            className={`flex-1 py-2 rounded ${
              frequency === 'once' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.meetingCostCalculator.oneTime')}
          </button>
          <button
            onClick={() => setFrequency('weekly')}
            className={`flex-1 py-2 rounded ${
              frequency === 'weekly' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.meetingCostCalculator.weekly')}
          </button>
          <button
            onClick={() => setFrequency('daily')}
            className={`flex-1 py-2 rounded ${
              frequency === 'daily' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.meetingCostCalculator.daily')}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.meetingCostCalculator.attendees')}</h3>

        <div className="space-y-2 mb-4">
          {attendees.map(attendee => (
            <div key={attendee.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
              <input
                type="text"
                value={attendee.role}
                onChange={(e) => updateAttendee(attendee.id, 'role', e.target.value)}
                className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm"
              />
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500">$</span>
                <input
                  type="number"
                  value={attendee.hourlyRate}
                  onChange={(e) => updateAttendee(attendee.id, 'hourlyRate', parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 border border-slate-200 rounded text-sm"
                />
                <span className="text-xs text-slate-500">/hr</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500">x</span>
                <input
                  type="number"
                  value={attendee.count}
                  onChange={(e) => updateAttendee(attendee.id, 'count', parseInt(e.target.value) || 1)}
                  className="w-12 px-2 py-1 border border-slate-200 rounded text-sm"
                  min="1"
                />
              </div>
              <button
                onClick={() => removeAttendee(attendee.id)}
                className="text-red-500 text-sm px-2"
              >
                x
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder={t('tools.meetingCostCalculator.rolePlaceholder')}
            className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
          />
          <input
            type="number"
            value={newRate}
            onChange={(e) => setNewRate(parseInt(e.target.value) || 0)}
            className="w-16 px-2 py-1 border border-slate-300 rounded text-sm"
            placeholder="$/hr"
          />
          <input
            type="number"
            value={newCount}
            onChange={(e) => setNewCount(parseInt(e.target.value) || 1)}
            className="w-12 px-2 py-1 border border-slate-300 rounded text-sm"
            min="1"
          />
          <button
            onClick={addAttendee}
            disabled={!newRole.trim()}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-3">{t('tools.meetingCostCalculator.costBreakdown')}</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded">
            <div className="text-3xl font-bold text-blue-600">{formatCurrency(meetingCost)}</div>
            <div className="text-sm text-slate-500">{t('tools.meetingCostCalculator.perMeeting')}</div>
          </div>
          <div className="text-center p-3 bg-white rounded">
            <div className="text-3xl font-bold text-green-600">{totalAttendees}</div>
            <div className="text-sm text-slate-500">{t('tools.meetingCostCalculator.totalAttendees')}</div>
          </div>
        </div>

        {frequency !== 'once' && (
          <div className="mt-4 text-center p-3 bg-white rounded">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(annualCost)}</div>
            <div className="text-sm text-slate-500">{t('tools.meetingCostCalculator.annualCost')}</div>
          </div>
        )}

        <div className="mt-4 text-center text-sm text-slate-500">
          {formatCurrency(meetingCost / totalAttendees)} {t('tools.meetingCostCalculator.perPerson')}
        </div>
      </div>

      <div className="card p-4 bg-yellow-50">
        <h3 className="font-medium mb-2">{t('tools.meetingCostCalculator.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>- {t('tools.meetingCostCalculator.tip1')}</li>
          <li>- {t('tools.meetingCostCalculator.tip2')}</li>
          <li>- {t('tools.meetingCostCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
