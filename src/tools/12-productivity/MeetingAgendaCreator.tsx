import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface AgendaItem {
  id: string
  topic: string
  presenter: string
  duration: number
  notes: string
}

interface Meeting {
  id: string
  title: string
  date: string
  time: string
  location: string
  attendees: string
  items: AgendaItem[]
  objectives: string
}

export default function MeetingAgendaCreator() {
  const { t } = useTranslation()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [currentMeeting, setCurrentMeeting] = useState<Meeting>({
    id: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    location: '',
    attendees: '',
    items: [{ id: '1', topic: '', presenter: '', duration: 5, notes: '' }],
    objectives: ''
  })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('meeting-agendas')
    if (saved) setMeetings(JSON.parse(saved))
  }, [])

  const saveMeetings = (updated: Meeting[]) => {
    setMeetings(updated)
    localStorage.setItem('meeting-agendas', JSON.stringify(updated))
  }

  const addItem = () => {
    setCurrentMeeting(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), topic: '', presenter: '', duration: 5, notes: '' }]
    }))
  }

  const updateItem = (id: string, field: keyof AgendaItem, value: string | number) => {
    setCurrentMeeting(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const removeItem = (id: string) => {
    if (currentMeeting.items.length > 1) {
      setCurrentMeeting(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }))
    }
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...currentMeeting.items]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= newItems.length) return
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]]
    setCurrentMeeting(prev => ({ ...prev, items: newItems }))
  }

  const totalDuration = currentMeeting.items.reduce((sum, item) => sum + item.duration, 0)

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  const calculateEndTime = () => {
    const [hours, minutes] = currentMeeting.time.split(':').map(Number)
    const endMinutes = hours * 60 + minutes + totalDuration
    const endHours = Math.floor(endMinutes / 60) % 24
    const endMins = endMinutes % 60
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`
  }

  const generateAgendaText = () => {
    let text = `
MEETING AGENDA
${'='.repeat(50)}

${currentMeeting.title}
Date: ${currentMeeting.date} at ${currentMeeting.time}
Location: ${currentMeeting.location || 'TBD'}
Duration: ${formatDuration(totalDuration)} (ends at ${calculateEndTime()})

Attendees: ${currentMeeting.attendees || 'TBD'}

${currentMeeting.objectives ? `OBJECTIVES:\n${currentMeeting.objectives}\n` : ''}
${'='.repeat(50)}
AGENDA ITEMS
${'='.repeat(50)}

`
    let currentTime = currentMeeting.time
    currentMeeting.items.forEach((item, index) => {
      text += `${index + 1}. ${item.topic || 'Untitled'}\n`
      text += `   Time: ${currentTime} (${item.duration} min)\n`
      if (item.presenter) text += `   Presenter: ${item.presenter}\n`
      if (item.notes) text += `   Notes: ${item.notes}\n`
      text += '\n'

      // Calculate next time
      const [h, m] = currentTime.split(':').map(Number)
      const nextMinutes = h * 60 + m + item.duration
      currentTime = `${Math.floor(nextMinutes / 60).toString().padStart(2, '0')}:${(nextMinutes % 60).toString().padStart(2, '0')}`
    })

    return text.trim()
  }

  const copyAgenda = () => {
    navigator.clipboard.writeText(generateAgendaText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveMeeting = () => {
    if (!currentMeeting.title) return
    const meeting = { ...currentMeeting, id: Date.now().toString() }
    saveMeetings([...meetings, meeting])
    setCurrentMeeting({
      id: '',
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      location: '',
      attendees: '',
      items: [{ id: '1', topic: '', presenter: '', duration: 5, notes: '' }],
      objectives: ''
    })
  }

  const loadMeeting = (meeting: Meeting) => {
    setCurrentMeeting(meeting)
  }

  const deleteMeeting = (id: string) => {
    saveMeetings(meetings.filter(m => m.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.meetingAgendaCreator.meetingDetails')}</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={currentMeeting.title}
            onChange={(e) => setCurrentMeeting({ ...currentMeeting, title: e.target.value })}
            placeholder={t('tools.meetingAgendaCreator.meetingTitle')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="date"
              value={currentMeeting.date}
              onChange={(e) => setCurrentMeeting({ ...currentMeeting, date: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="time"
              value={currentMeeting.time}
              onChange={(e) => setCurrentMeeting({ ...currentMeeting, time: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="text"
              value={currentMeeting.location}
              onChange={(e) => setCurrentMeeting({ ...currentMeeting, location: e.target.value })}
              placeholder={t('tools.meetingAgendaCreator.location')}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <input
            type="text"
            value={currentMeeting.attendees}
            onChange={(e) => setCurrentMeeting({ ...currentMeeting, attendees: e.target.value })}
            placeholder={t('tools.meetingAgendaCreator.attendees')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <textarea
            value={currentMeeting.objectives}
            onChange={(e) => setCurrentMeeting({ ...currentMeeting, objectives: e.target.value })}
            placeholder={t('tools.meetingAgendaCreator.objectives')}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-slate-700">{t('tools.meetingAgendaCreator.agendaItems')}</h3>
          <div className="text-sm text-slate-500">
            {t('tools.meetingAgendaCreator.totalDuration')}: {formatDuration(totalDuration)}
          </div>
        </div>
        <div className="space-y-3">
          {currentMeeting.items.map((item, index) => (
            <div key={item.id} className="p-3 bg-slate-50 rounded">
              <div className="flex gap-2 items-start mb-2">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="text-xs text-slate-400 disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === currentMeeting.items.length - 1}
                    className="text-xs text-slate-400 disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>
                <span className="text-sm font-medium text-slate-400 w-6">{index + 1}</span>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={item.topic}
                    onChange={(e) => updateItem(item.id, 'topic', e.target.value)}
                    placeholder={t('tools.meetingAgendaCreator.topic')}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={item.presenter}
                      onChange={(e) => updateItem(item.id, 'presenter', e.target.value)}
                      placeholder={t('tools.meetingAgendaCreator.presenter')}
                      className="px-3 py-2 border border-slate-300 rounded text-sm"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={item.duration}
                        onChange={(e) => updateItem(item.id, 'duration', parseInt(e.target.value) || 0)}
                        min="1"
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                      />
                      <span className="text-xs text-slate-500">min</span>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 text-sm"
                      disabled={currentMeeting.items.length === 1}
                    >
                      {t('tools.meetingAgendaCreator.remove')}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                    placeholder={t('tools.meetingAgendaCreator.notes')}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="mt-3 w-full py-2 border-2 border-dashed border-slate-300 rounded text-slate-500"
        >
          + {t('tools.meetingAgendaCreator.addItem')}
        </button>
      </div>

      <div className="card p-4 bg-blue-50">
        <div className="flex justify-between items-center text-sm">
          <span>{t('tools.meetingAgendaCreator.meetingEnd')}: {calculateEndTime()}</span>
          <span>{t('tools.meetingAgendaCreator.items')}: {currentMeeting.items.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={copyAgenda}
          className={`py-2 rounded font-medium ${copied ? 'bg-green-500 text-white' : 'bg-slate-100'}`}
        >
          {copied ? '✓' : t('tools.meetingAgendaCreator.copyAgenda')}
        </button>
        <button
          onClick={saveMeeting}
          disabled={!currentMeeting.title}
          className="py-2 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
        >
          {t('tools.meetingAgendaCreator.saveAgenda')}
        </button>
      </div>

      {meetings.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium text-slate-700 mb-3">{t('tools.meetingAgendaCreator.savedAgendas')}</h3>
          <div className="space-y-2">
            {meetings.map(meeting => (
              <div key={meeting.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <div>
                  <div className="font-medium text-sm">{meeting.title}</div>
                  <div className="text-xs text-slate-500">{meeting.date} {meeting.time}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadMeeting(meeting)}
                    className="text-xs text-blue-500"
                  >
                    {t('tools.meetingAgendaCreator.load')}
                  </button>
                  <button
                    onClick={() => deleteMeeting(meeting.id)}
                    className="text-xs text-red-500"
                  >
                    {t('tools.meetingAgendaCreator.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
