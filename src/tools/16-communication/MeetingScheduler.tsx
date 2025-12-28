import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface TimeSlot {
  date: string
  time: string
  duration: number
}

export default function MeetingScheduler() {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [slots, setSlots] = useState<TimeSlot[]>([
    { date: '', time: '09:00', duration: 60 }
  ])
  const [attendees, setAttendees] = useState('')

  const addSlot = () => {
    setSlots([...slots, { date: '', time: '09:00', duration: 60 }])
  }

  const updateSlot = (index: number, field: keyof TimeSlot, value: string | number) => {
    const newSlots = [...slots]
    newSlots[index] = { ...newSlots[index], [field]: value }
    setSlots(newSlots)
  }

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index))
  }

  const generateInvite = (): string => {
    let invite = `Meeting Invitation: ${title}\n\n`
    if (description) invite += `Description: ${description}\n\n`

    invite += `Proposed Times:\n`
    slots.forEach((slot, i) => {
      if (slot.date) {
        invite += `Option ${i + 1}: ${slot.date} at ${slot.time} (${slot.duration} minutes)\n`
      }
    })

    if (attendees) {
      invite += `\nAttendees: ${attendees}\n`
    }

    invite += `\nPlease confirm your availability.`
    return invite
  }

  const copyInvite = () => {
    navigator.clipboard.writeText(generateInvite())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.meetingScheduler.title')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Meeting title"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.meetingScheduler.description')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Meeting description"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.meetingScheduler.attendees')}</label>
          <input
            type="text"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            placeholder="Enter attendee names/emails"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.meetingScheduler.timeSlots')}</h3>
          <button
            onClick={addSlot}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            {t('tools.meetingScheduler.addSlot')}
          </button>
        </div>

        <div className="space-y-3">
          {slots.map((slot, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="date"
                value={slot.date}
                onChange={(e) => updateSlot(index, 'date', e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="time"
                value={slot.time}
                onChange={(e) => updateSlot(index, 'time', e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <select
                value={slot.duration}
                onChange={(e) => updateSlot(index, 'duration', parseInt(e.target.value))}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
              {slots.length > 1 && (
                <button
                  onClick={() => removeSlot(index)}
                  className="px-2 py-2 text-red-500 hover:bg-red-50 rounded"
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.meetingScheduler.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap">
          {generateInvite()}
        </pre>
        <button
          onClick={copyInvite}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.meetingScheduler.copy')}
        </button>
      </div>
    </div>
  )
}
