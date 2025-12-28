import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Event {
  id: number
  name: string
  date: string
  time: string
  color: string
}

export default function EventCountdown() {
  const { t } = useTranslation()
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '12:00',
    color: '#3b82f6',
  })
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const saved = localStorage.getItem('event-countdown')
    if (saved) {
      try {
        setEvents(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load events')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('event-countdown', JSON.stringify(events))
  }, [events])

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const addEvent = () => {
    if (!newEvent.name || !newEvent.date) return
    setEvents([
      ...events,
      {
        id: Date.now(),
        ...newEvent,
      },
    ])
    setNewEvent({
      name: '',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '12:00',
      color: '#3b82f6',
    })
  }

  const removeEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id))
  }

  const getCountdown = (event: Event) => {
    const eventDate = new Date(`${event.date}T${event.time}:00`)
    const diff = eventDate.getTime() - now

    if (diff <= 0) {
      return { passed: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { passed: false, days, hours, minutes, seconds }
  }

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}:00`).getTime()
      const dateB = new Date(`${b.date}T${b.time}:00`).getTime()
      return dateA - dateB
    })
  }, [events])

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4',
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.eventCountdown.addEvent')}
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            placeholder={t('tools.eventCountdown.eventName')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-slate-500">{t('tools.eventCountdown.color')}:</span>
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setNewEvent({ ...newEvent, color: c })}
                className={`w-8 h-8 rounded-full ${
                  newEvent.color === c ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <button
            onClick={addEvent}
            className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            + {t('tools.eventCountdown.add')}
          </button>
        </div>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          {t('tools.eventCountdown.noEvents')}
        </div>
      ) : (
        sortedEvents.map(event => {
          const countdown = getCountdown(event)
          return (
            <div
              key={event.id}
              className="card p-4"
              style={{ borderLeft: `4px solid ${event.color}` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-lg">{event.name}</h3>
                  <p className="text-sm text-slate-500">
                    {new Date(`${event.date}T${event.time}`).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => removeEvent(event.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>

              {countdown.passed ? (
                <div className="text-center p-4 bg-slate-100 rounded">
                  <span className="text-lg font-medium text-slate-500">
                    {t('tools.eventCountdown.eventPassed')}
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-3 bg-slate-50 rounded">
                    <div className="text-3xl font-bold\" style={{ color: event.color }}>
                      {countdown.days}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t('tools.eventCountdown.days')}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded">
                    <div className="text-3xl font-bold" style={{ color: event.color }}>
                      {countdown.hours}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t('tools.eventCountdown.hours')}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded">
                    <div className="text-3xl font-bold" style={{ color: event.color }}>
                      {countdown.minutes}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t('tools.eventCountdown.minutes')}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded">
                    <div className="text-3xl font-bold" style={{ color: event.color }}>
                      {countdown.seconds}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t('tools.eventCountdown.seconds')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.eventCountdown.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.eventCountdown.tip1')}</li>
          <li>{t('tools.eventCountdown.tip2')}</li>
          <li>{t('tools.eventCountdown.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
