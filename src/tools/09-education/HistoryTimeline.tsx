import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Event {
  id: number
  year: number
  title: string
  description: string
}

export default function HistoryTimeline() {
  const { t } = useTranslation()
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState({ year: '', title: '', description: '' })
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    const saved = localStorage.getItem('history-timeline')
    if (saved) {
      try {
        setEvents(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load timeline')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('history-timeline', JSON.stringify(events))
  }, [events])

  const addEvent = () => {
    if (!newEvent.year || !newEvent.title.trim()) return

    const event: Event = {
      id: Date.now(),
      year: parseInt(newEvent.year),
      title: newEvent.title.trim(),
      description: newEvent.description.trim(),
    }
    setEvents([...events, event])
    setNewEvent({ year: '', title: '', description: '' })
  }

  const deleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id))
  }

  const sortedEvents = [...events].sort((a, b) =>
    sortOrder === 'asc' ? a.year - b.year : b.year - a.year
  )

  const formatYear = (year: number) => {
    if (year < 0) return `${Math.abs(year)} BCE`
    return `${year} CE`
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.historyTimeline.addEvent')}
        </h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              value={newEvent.year}
              onChange={(e) => setNewEvent({ ...newEvent, year: e.target.value })}
              placeholder={t('tools.historyTimeline.year')}
              className="w-24 px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder={t('tools.historyTimeline.title')}
              className="flex-1 px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <textarea
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            placeholder={t('tools.historyTimeline.description')}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            rows={2}
          />
          <button
            onClick={addEvent}
            disabled={!newEvent.year || !newEvent.title.trim()}
            className="w-full py-2 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
          >
            {t('tools.historyTimeline.add')}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-600">
          {events.length} {t('tools.historyTimeline.events')}
        </span>
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="px-3 py-1 text-sm bg-slate-100 rounded"
        >
          {sortOrder === 'asc' ? '↑' : '↓'} {t('tools.historyTimeline.sortBy')}
        </button>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="card p-6 text-center text-slate-500">
          {t('tools.historyTimeline.noEvents')}
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200" />
          <div className="space-y-4">
            {sortedEvents.map(event => (
              <div key={event.id} className="relative pl-10">
                <div className="absolute left-2.5 top-3 w-3 h-3 bg-blue-500 rounded-full" />
                <div className="card p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-blue-600">
                        {formatYear(event.year)}
                      </div>
                      <div className="font-medium">{event.title}</div>
                      {event.description && (
                        <div className="text-sm text-slate-500 mt-1">
                          {event.description}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="text-red-500 text-sm"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.historyTimeline.tips')}
        </h3>
        <div className="text-xs text-slate-500 space-y-1">
          <p>• {t('tools.historyTimeline.tip1')}</p>
          <p>• {t('tools.historyTimeline.tip2')}</p>
          <p>• {t('tools.historyTimeline.tip3')}</p>
        </div>
      </div>
    </div>
  )
}
