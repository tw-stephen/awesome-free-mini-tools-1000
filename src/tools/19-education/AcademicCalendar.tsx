import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Event {
  id: number
  title: string
  date: string
  type: 'exam' | 'assignment' | 'class' | 'holiday' | 'other'
  course: string
  notes: string
  recurring: boolean
}

export default function AcademicCalendar() {
  const { t } = useTranslation()
  const [events, setEvents] = useState<Event[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'assignment' as Event['type'],
    course: '',
    notes: '',
    recurring: false,
  })
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month')

  const eventTypes = [
    { value: 'exam', label: 'Exam', color: 'bg-red-500' },
    { value: 'assignment', label: 'Assignment', color: 'bg-blue-500' },
    { value: 'class', label: 'Class', color: 'bg-green-500' },
    { value: 'holiday', label: 'Holiday', color: 'bg-purple-500' },
    { value: 'other', label: 'Other', color: 'bg-slate-500' },
  ]

  const getEventColor = (type: string) => {
    return eventTypes.find(t => t.value === type)?.color || 'bg-slate-500'
  }

  const addEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date) return
    setEvents([...events, { ...newEvent, id: Date.now() }])
    setNewEvent({
      title: '',
      date: selectedDate || new Date().toISOString().split('T')[0],
      type: 'assignment',
      course: '',
      notes: '',
      recurring: false,
    })
    setShowForm(false)
  }

  const removeEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id))
  }

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: Date[] = []

    // Add days from previous month to fill first week
    const startDay = firstDay.getDay()
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      days.push(d)
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    // Add days from next month to fill last week
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push(new Date(year, month + 1, i))
    }

    return days
  }

  const getEventsForDate = (date: string): Event[] => {
    return events.filter(e => e.date === date)
  }

  const formatDateString = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth()
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const getUpcomingEvents = (): Event[] => {
    const today = new Date().toISOString().split('T')[0]
    return events
      .filter(e => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 10)
  }

  const days = getDaysInMonth(currentDate)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('month')}
          className={`flex-1 py-2 rounded ${
            viewMode === 'month' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
          }`}
        >
          Month View
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`flex-1 py-2 rounded ${
            viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
          }`}
        >
          List View
        </button>
      </div>

      {viewMode === 'month' && (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200"
              >
                ←
              </button>
              <h2 className="text-lg font-bold">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => navigateMonth('next')}
                className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200"
              >
                →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                  {day}
                </div>
              ))}
              {days.map((day, i) => {
                const dateStr = formatDateString(day)
                const dayEvents = getEventsForDate(dateStr)
                return (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedDate(dateStr)
                      setNewEvent({ ...newEvent, date: dateStr })
                    }}
                    className={`min-h-[60px] p-1 border rounded cursor-pointer ${
                      isCurrentMonth(day) ? 'bg-white' : 'bg-slate-50'
                    } ${isToday(day) ? 'border-blue-500 border-2' : 'border-slate-200'} ${
                      selectedDate === dateStr ? 'ring-2 ring-blue-300' : ''
                    }`}
                  >
                    <div className={`text-xs ${isCurrentMonth(day) ? 'text-slate-700' : 'text-slate-400'}`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs px-1 py-0.5 rounded text-white truncate ${getEventColor(event.type)}`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-slate-500">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {selectedDate && (
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">
                  {new Date(selectedDate + 'T00:00').toLocaleDateString('default', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  + Add
                </button>
              </div>
              {getEventsForDate(selectedDate).length > 0 ? (
                <div className="space-y-2">
                  {getEventsForDate(selectedDate).map(event => (
                    <div key={event.id} className="flex items-start justify-between p-2 bg-slate-50 rounded">
                      <div className="flex items-start gap-2">
                        <div className={`w-3 h-3 rounded-full mt-1 ${getEventColor(event.type)}`} />
                        <div>
                          <div className="font-medium">{event.title}</div>
                          {event.course && <div className="text-sm text-slate-500">{event.course}</div>}
                          {event.notes && <div className="text-xs text-slate-400">{event.notes}</div>}
                        </div>
                      </div>
                      <button
                        onClick={() => removeEvent(event.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-500 text-sm text-center py-4">No events</div>
              )}
            </div>
          )}
        </>
      )}

      {viewMode === 'list' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.academicCalendar.upcoming')}</h3>
          {getUpcomingEvents().length > 0 ? (
            <div className="space-y-2">
              {getUpcomingEvents().map(event => (
                <div key={event.id} className="flex items-start justify-between p-3 bg-slate-50 rounded">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1 ${getEventColor(event.type)}`} />
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-slate-500">
                        {new Date(event.date + 'T00:00').toLocaleDateString('default', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                        {event.course && ` • ${event.course}`}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeEvent(event.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 text-center py-8">No upcoming events</div>
          )}
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          + {t('tools.academicCalendar.addEvent')}
        </button>
      )}

      {showForm && (
        <div className="card p-4 border-2 border-blue-300">
          <h3 className="font-medium mb-3">{t('tools.academicCalendar.addEvent')}</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="Event title"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as Event['type'] })}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                {eventTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={newEvent.course}
              onChange={(e) => setNewEvent({ ...newEvent, course: e.target.value })}
              placeholder="Course name (optional)"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <textarea
              value={newEvent.notes}
              onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
              placeholder="Notes (optional)"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addEvent}
                disabled={!newEvent.title.trim() || !newEvent.date}
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

      <div className="flex flex-wrap gap-2 text-xs">
        {eventTypes.map(t => (
          <div key={t.value} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-full ${t.color}`} />
            <span className="text-slate-600">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
