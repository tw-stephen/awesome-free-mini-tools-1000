import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AgendaItem {
  id: number
  topic: string
  duration: number
  presenter: string
  notes: string
}

export default function MeetingAgenda() {
  const { t } = useTranslation()
  const [meeting, setMeeting] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    location: '',
    organizer: '',
    attendees: '',
    objective: '',
  })

  const [items, setItems] = useState<AgendaItem[]>([
    { id: 1, topic: 'Welcome & Introductions', duration: 5, presenter: '', notes: '' },
  ])

  const addItem = () => {
    setItems([...items, { id: Date.now(), topic: '', duration: 10, presenter: '', notes: '' }])
  }

  const updateItem = (id: number, field: keyof AgendaItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= items.length) return
    const newItems = [...items]
    ;[newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]]
    setItems(newItems)
  }

  const totalDuration = items.reduce((sum, item) => sum + item.duration, 0)

  const formatTime = (startTime: string, minutesOffset: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + minutesOffset
    const h = Math.floor(totalMinutes / 60) % 24
    const m = totalMinutes % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }

  const generateAgenda = (): string => {
    let doc = `${'═'.repeat(60)}\n`
    doc += `MEETING AGENDA\n`
    doc += `${meeting.title || '[Meeting Title]'}\n`
    doc += `${'═'.repeat(60)}\n\n`

    doc += `Date: ${meeting.date}\n`
    doc += `Time: ${meeting.time} (Duration: ${totalDuration} minutes)\n`
    if (meeting.location) doc += `Location: ${meeting.location}\n`
    if (meeting.organizer) doc += `Organizer: ${meeting.organizer}\n`
    if (meeting.attendees) doc += `Attendees: ${meeting.attendees}\n`
    doc += '\n'

    if (meeting.objective) {
      doc += `MEETING OBJECTIVE\n${'─'.repeat(40)}\n`
      doc += `${meeting.objective}\n\n`
    }

    doc += `AGENDA\n${'─'.repeat(40)}\n`
    let cumulativeTime = 0
    items.forEach((item, index) => {
      const startTime = formatTime(meeting.time, cumulativeTime)
      const endTime = formatTime(meeting.time, cumulativeTime + item.duration)
      doc += `${index + 1}. [${startTime}-${endTime}] ${item.topic || 'Topic'}\n`
      if (item.presenter) doc += `   Presenter: ${item.presenter}\n`
      if (item.notes) doc += `   Notes: ${item.notes}\n`
      cumulativeTime += item.duration
    })

    doc += `\n${'═'.repeat(60)}\n`
    doc += `Meeting ends at: ${formatTime(meeting.time, totalDuration)}\n`

    return doc
  }

  const copyAgenda = () => {
    navigator.clipboard.writeText(generateAgenda())
  }

  let cumulativeTime = 0

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.meetingAgenda.details')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={meeting.title}
            onChange={(e) => setMeeting({ ...meeting, title: e.target.value })}
            placeholder="Meeting Title"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              type="date"
              value={meeting.date}
              onChange={(e) => setMeeting({ ...meeting, date: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="time"
              value={meeting.time}
              onChange={(e) => setMeeting({ ...meeting, time: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={meeting.location}
              onChange={(e) => setMeeting({ ...meeting, location: e.target.value })}
              placeholder="Location / Link"
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={meeting.organizer}
              onChange={(e) => setMeeting({ ...meeting, organizer: e.target.value })}
              placeholder="Organizer"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={meeting.attendees}
              onChange={(e) => setMeeting({ ...meeting, attendees: e.target.value })}
              placeholder="Attendees"
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <textarea
            value={meeting.objective}
            onChange={(e) => setMeeting({ ...meeting, objective: e.target.value })}
            placeholder="Meeting Objective"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.meetingAgenda.agenda')}</h3>
          <span className="text-sm text-slate-500">Total: {totalDuration} min</span>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => {
            const startTime = formatTime(meeting.time, cumulativeTime)
            const endTime = formatTime(meeting.time, cumulativeTime + item.duration)
            cumulativeTime += item.duration

            return (
              <div key={item.id} className="p-3 bg-slate-50 rounded border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-500 font-mono w-24">{startTime}-{endTime}</span>
                  <input
                    type="text"
                    value={item.topic}
                    onChange={(e) => updateItem(item.id, 'topic', e.target.value)}
                    placeholder="Topic"
                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                  <div className="flex gap-1">
                    <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="px-2 py-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">↑</button>
                    <button onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1} className="px-2 py-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">↓</button>
                    <button onClick={() => removeItem(item.id)} disabled={items.length === 1} className="px-2 py-1 text-red-400 hover:text-red-600 disabled:opacity-30">×</button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={item.duration}
                      onChange={(e) => updateItem(item.id, 'duration', Number(e.target.value))}
                      min="1"
                      className="w-16 px-2 py-1 border border-slate-300 rounded text-sm text-center"
                    />
                    <span className="text-xs text-slate-500">min</span>
                  </div>
                  <input
                    type="text"
                    value={item.presenter}
                    onChange={(e) => updateItem(item.id, 'presenter', e.target.value)}
                    placeholder="Presenter"
                    className="px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                    placeholder="Notes"
                    className="px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
              </div>
            )
          })}
        </div>
        <button
          onClick={addItem}
          className="mt-3 text-blue-500 hover:text-blue-600 text-sm"
        >
          + Add Agenda Item
        </button>
      </div>

      <div className="card p-4 bg-blue-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Meeting ends at:</span>
          <span className="font-bold text-blue-600">{formatTime(meeting.time, totalDuration)}</span>
        </div>
      </div>

      <button
        onClick={copyAgenda}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.meetingAgenda.copy')}
      </button>
    </div>
  )
}
