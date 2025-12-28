import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Event {
  id: number
  date: string
  title: string
  description: string
  category: string
  importance: 'low' | 'medium' | 'high'
}

export default function HistoryTimelineMaker() {
  const { t } = useTranslation()
  const [events, setEvents] = useState<Event[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newEvent, setNewEvent] = useState({
    date: '',
    title: '',
    description: '',
    category: 'Political',
    importance: 'medium' as 'low' | 'medium' | 'high',
  })
  const [filterCategory, setFilterCategory] = useState('all')
  const [timelineTitle, setTimelineTitle] = useState('')

  const categories = ['Political', 'Military', 'Economic', 'Social', 'Cultural', 'Scientific', 'Religious']
  const categoryColors: { [key: string]: string } = {
    Political: 'bg-blue-500',
    Military: 'bg-red-500',
    Economic: 'bg-green-500',
    Social: 'bg-purple-500',
    Cultural: 'bg-yellow-500',
    Scientific: 'bg-cyan-500',
    Religious: 'bg-orange-500',
  }

  const addEvent = () => {
    if (!newEvent.date || !newEvent.title.trim()) return
    setEvents([...events, { ...newEvent, id: Date.now() }])
    setNewEvent({
      date: '',
      title: '',
      description: '',
      category: 'Political',
      importance: 'medium',
    })
    setShowForm(false)
  }

  const removeEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id))
  }

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.date.replace(/[^\d-]/g, '')
    const dateB = b.date.replace(/[^\d-]/g, '')
    return dateA.localeCompare(dateB)
  })

  const filteredEvents = filterCategory === 'all'
    ? sortedEvents
    : sortedEvents.filter(e => e.category === filterCategory)

  const exportTimeline = () => {
    let text = timelineTitle ? `${timelineTitle}\n${'='.repeat(timelineTitle.length)}\n\n` : 'TIMELINE\n========\n\n'

    filteredEvents.forEach(event => {
      text += `${event.date} - ${event.title}`
      text += ` [${event.category}]`
      if (event.importance === 'high') text += ' ★'
      text += '\n'
      if (event.description) text += `  ${event.description}\n`
      text += '\n'
    })

    navigator.clipboard.writeText(text)
  }

  const getImportanceStyle = (importance: string) => {
    switch (importance) {
      case 'high': return 'border-l-4 border-red-500'
      case 'medium': return 'border-l-4 border-yellow-500'
      case 'low': return 'border-l-4 border-slate-300'
      default: return ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={timelineTitle}
          onChange={(e) => setTimelineTitle(e.target.value)}
          placeholder="Timeline Title (e.g., World War II, Renaissance Era)"
          className="w-full px-3 py-2 text-lg font-bold border border-slate-300 rounded"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1 rounded text-sm ${
            filterCategory === 'all' ? 'bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded text-sm ${
              filterCategory === cat ? `${categoryColors[cat]} text-white` : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setShowForm(true)}
          className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + {t('tools.historyTimelineMaker.addEvent')}
        </button>
        <button
          onClick={exportTimeline}
          disabled={events.length === 0}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-slate-300"
        >
          {t('tools.historyTimelineMaker.export')}
        </button>
      </div>

      {showForm && (
        <div className="card p-4 border-2 border-blue-300">
          <h3 className="font-medium mb-3">{t('tools.historyTimelineMaker.addEvent')}</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                placeholder="Date (e.g., 1776, 500 BCE, July 4, 1776)"
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <select
                value={newEvent.category}
                onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="Event title"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Description (optional)"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
            <div>
              <label className="text-sm text-slate-500 block mb-1">Importance</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map(imp => (
                  <button
                    key={imp}
                    onClick={() => setNewEvent({ ...newEvent, importance: imp })}
                    className={`flex-1 py-2 rounded capitalize ${
                      newEvent.importance === imp
                        ? imp === 'high' ? 'bg-red-500 text-white'
                          : imp === 'medium' ? 'bg-yellow-500 text-white'
                          : 'bg-slate-500 text-white'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {imp}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addEvent}
                disabled={!newEvent.date || !newEvent.title.trim()}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                Add Event
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-0 relative">
        {filteredEvents.length > 0 && (
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
        )}
        {filteredEvents.map((event) => (
          <div key={event.id} className="relative pl-10 pb-4">
            <div className={`absolute left-2 w-4 h-4 rounded-full ${categoryColors[event.category]} border-2 border-white`} />
            <div className={`card p-3 ${getImportanceStyle(event.importance)}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-slate-500 font-medium">{event.date}</div>
                  <div className="font-medium">
                    {event.title}
                    {event.importance === 'high' && <span className="ml-1 text-red-500">★</span>}
                  </div>
                  {event.description && (
                    <div className="text-sm text-slate-600 mt-1">{event.description}</div>
                  )}
                  <span className={`inline-block mt-2 px-2 py-0.5 text-xs text-white rounded ${categoryColors[event.category]}`}>
                    {event.category}
                  </span>
                </div>
                <button
                  onClick={() => removeEvent(event.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          Add events to build your timeline
        </div>
      )}

      {events.length > 0 && (
        <div className="text-sm text-slate-500 text-center">
          {filteredEvents.length} of {events.length} events shown
        </div>
      )}
    </div>
  )
}
