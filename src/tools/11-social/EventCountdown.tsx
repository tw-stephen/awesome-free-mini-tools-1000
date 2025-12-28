import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface SavedEvent {
  id: string
  name: string
  date: string
  color: string
}

export default function EventCountdown() {
  const { t } = useTranslation()
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [events, setEvents] = useState<SavedEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<SavedEvent | null>(null)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [eventColor, setEventColor] = useState('#3b82f6')

  useEffect(() => {
    const saved = localStorage.getItem('event-countdowns')
    if (saved) {
      setEvents(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (!selectedEvent) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const target = new Date(selectedEvent.date).getTime()
      const diff = target - now

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [selectedEvent])

  const saveEvent = () => {
    if (!eventName || !eventDate) return

    const newEvent: SavedEvent = {
      id: Date.now().toString(),
      name: eventName,
      date: eventDate,
      color: eventColor
    }

    const updated = [...events, newEvent]
    setEvents(updated)
    localStorage.setItem('event-countdowns', JSON.stringify(updated))
    setSelectedEvent(newEvent)
    setEventName('')
    setEventDate('')
  }

  const deleteEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id)
    setEvents(updated)
    localStorage.setItem('event-countdowns', JSON.stringify(updated))
    if (selectedEvent?.id === id) {
      setSelectedEvent(null)
    }
  }

  const getDaysUntil = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const isPast = selectedEvent ? new Date(selectedEvent.date) < new Date() : false

  return (
    <div className="space-y-4">
      {selectedEvent ? (
        <>
          <button
            onClick={() => setSelectedEvent(null)}
            className="flex items-center gap-2 text-blue-500"
          >
            ← {t('tools.eventCountdown.backToList')}
          </button>

          <div
            className="card p-6 text-center text-white"
            style={{ backgroundColor: selectedEvent.color }}
          >
            <h2 className="text-2xl font-bold mb-2">{selectedEvent.name}</h2>
            <p className="text-sm opacity-80">
              {new Date(selectedEvent.date).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {isPast ? (
            <div className="card p-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <div className="text-xl font-bold">{t('tools.eventCountdown.eventPassed')}</div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              <div className="card p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{countdown.days}</div>
                <div className="text-xs text-slate-500">{t('tools.eventCountdown.days')}</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{countdown.hours}</div>
                <div className="text-xs text-slate-500">{t('tools.eventCountdown.hours')}</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{countdown.minutes}</div>
                <div className="text-xs text-slate-500">{t('tools.eventCountdown.minutes')}</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{countdown.seconds}</div>
                <div className="text-xs text-slate-500">{t('tools.eventCountdown.seconds')}</div>
              </div>
            </div>
          )}

          <div className="card p-4 text-center">
            <div className="text-lg">
              {countdown.days > 0 ? (
                <>
                  <span className="font-bold">{countdown.days}</span>{' '}
                  {t('tools.eventCountdown.daysUntil')} {selectedEvent.name}
                </>
              ) : countdown.hours > 0 ? (
                <>
                  <span className="font-bold">{countdown.hours}</span>{' '}
                  {t('tools.eventCountdown.hoursLeft')}
                </>
              ) : (
                t('tools.eventCountdown.almostHere')
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="card p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.eventCountdown.eventName')}
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder={t('tools.eventCountdown.eventNamePlaceholder')}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('tools.eventCountdown.eventDate')}
                </label>
                <input
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('tools.eventCountdown.color')}
                </label>
                <input
                  type="color"
                  value={eventColor}
                  onChange={(e) => setEventColor(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={saveEvent}
              disabled={!eventName || !eventDate}
              className="w-full py-2 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
            >
              {t('tools.eventCountdown.addEvent')}
            </button>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.eventCountdown.savedEvents')}
            </h3>
            {events.length === 0 ? (
              <p className="text-slate-500 text-sm">{t('tools.eventCountdown.noEvents')}</p>
            ) : (
              <div className="space-y-2">
                {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => {
                  const daysUntil = getDaysUntil(event.date)
                  return (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 rounded cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: `${event.color}20`, borderLeft: `4px solid ${event.color}` }}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div>
                        <div className="font-medium">{event.name}</div>
                        <div className="text-xs text-slate-500">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          daysUntil < 0 ? 'text-slate-400' : daysUntil <= 7 ? 'text-red-500' : 'text-blue-500'
                        }`}>
                          {daysUntil < 0
                            ? t('tools.eventCountdown.passed')
                            : daysUntil === 0
                              ? t('tools.eventCountdown.today')
                              : `${daysUntil}d`
                          }
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteEvent(event.id) }}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
