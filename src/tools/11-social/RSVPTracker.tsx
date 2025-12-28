import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type RSVPStatus = 'attending' | 'not_attending' | 'maybe' | 'pending'

interface Event {
  id: string
  name: string
  date: string
  location: string
  description: string
  maxGuests: number
}

interface RSVP {
  id: string
  eventId: string
  name: string
  email: string
  status: RSVPStatus
  guests: number
  message: string
  timestamp: string
}

export default function RSVPTracker() {
  const { t } = useTranslation()
  const [events, setEvents] = useState<Event[]>([])
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [mode, setMode] = useState<'events' | 'rsvp' | 'manage'>('events')
  const [showEventForm, setShowEventForm] = useState(false)

  const [eventForm, setEventForm] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
    maxGuests: 50
  })

  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    email: '',
    status: 'attending' as RSVPStatus,
    guests: 1,
    message: ''
  })

  useEffect(() => {
    const savedEvents = localStorage.getItem('rsvp-events')
    const savedRsvps = localStorage.getItem('rsvp-responses')
    if (savedEvents) setEvents(JSON.parse(savedEvents))
    if (savedRsvps) setRsvps(JSON.parse(savedRsvps))
  }, [])

  const saveEvents = (updated: Event[]) => {
    setEvents(updated)
    localStorage.setItem('rsvp-events', JSON.stringify(updated))
  }

  const saveRsvps = (updated: RSVP[]) => {
    setRsvps(updated)
    localStorage.setItem('rsvp-responses', JSON.stringify(updated))
  }

  const createEvent = () => {
    const newEvent: Event = {
      id: Date.now().toString(),
      ...eventForm
    }
    saveEvents([...events, newEvent])
    setEventForm({ name: '', date: '', location: '', description: '', maxGuests: 50 })
    setShowEventForm(false)
  }

  const deleteEvent = (id: string) => {
    saveEvents(events.filter(e => e.id !== id))
    saveRsvps(rsvps.filter(r => r.eventId !== id))
    if (selectedEvent?.id === id) setSelectedEvent(null)
  }

  const submitRsvp = () => {
    if (!selectedEvent) return
    const newRsvp: RSVP = {
      id: Date.now().toString(),
      eventId: selectedEvent.id,
      ...rsvpForm,
      timestamp: new Date().toISOString()
    }
    saveRsvps([...rsvps, newRsvp])
    setRsvpForm({ name: '', email: '', status: 'attending', guests: 1, message: '' })
    setMode('events')
  }

  const getEventStats = (eventId: string) => {
    const eventRsvps = rsvps.filter(r => r.eventId === eventId)
    return {
      total: eventRsvps.length,
      attending: eventRsvps.filter(r => r.status === 'attending').reduce((sum, r) => sum + r.guests, 0),
      notAttending: eventRsvps.filter(r => r.status === 'not_attending').length,
      maybe: eventRsvps.filter(r => r.status === 'maybe').length,
      pending: eventRsvps.filter(r => r.status === 'pending').length
    }
  }

  const statusColors: Record<RSVPStatus, string> = {
    attending: 'bg-green-100 text-green-700',
    not_attending: 'bg-red-100 text-red-700',
    maybe: 'bg-yellow-100 text-yellow-700',
    pending: 'bg-slate-100 text-slate-700'
  }

  return (
    <div className="space-y-4">
      {mode === 'events' && (
        <>
          <button
            onClick={() => setShowEventForm(true)}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.rsvpTracker.createEvent')}
          </button>

          {showEventForm && (
            <div className="card p-4 space-y-3">
              <input
                type="text"
                value={eventForm.name}
                onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                placeholder={t('tools.rsvpTracker.eventName')}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="datetime-local"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded"
                />
                <input
                  type="number"
                  value={eventForm.maxGuests}
                  onChange={(e) => setEventForm({ ...eventForm, maxGuests: parseInt(e.target.value) })}
                  placeholder={t('tools.rsvpTracker.maxGuests')}
                  className="px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <input
                type="text"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                placeholder={t('tools.rsvpTracker.location')}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              <textarea
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder={t('tools.rsvpTracker.description')}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowEventForm(false)} className="flex-1 py-2 bg-slate-100 rounded">
                  {t('tools.rsvpTracker.cancel')}
                </button>
                <button
                  onClick={createEvent}
                  disabled={!eventForm.name || !eventForm.date}
                  className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  {t('tools.rsvpTracker.create')}
                </button>
              </div>
            </div>
          )}

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.rsvpTracker.yourEvents')}</h3>
            {events.length === 0 ? (
              <p className="text-center text-slate-500 py-4">{t('tools.rsvpTracker.noEvents')}</p>
            ) : (
              <div className="space-y-2">
                {events.map(event => {
                  const stats = getEventStats(event.id)
                  return (
                    <div key={event.id} className="p-3 bg-slate-50 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{event.name}</div>
                          <div className="text-xs text-slate-500">
                            {new Date(event.date).toLocaleDateString()} • {event.location}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-green-100 text-green-700 px-1.5 rounded">
                              {stats.attending} {t('tools.rsvpTracker.attending')}
                            </span>
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 rounded">
                              {stats.maybe} {t('tools.rsvpTracker.maybe')}
                            </span>
                            <span className="text-xs bg-red-100 text-red-700 px-1.5 rounded">
                              {stats.notAttending} {t('tools.rsvpTracker.declined')}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setSelectedEvent(event); setMode('rsvp') }}
                            className="text-xs text-blue-500 px-2 py-1"
                          >
                            {t('tools.rsvpTracker.rsvp')}
                          </button>
                          <button
                            onClick={() => { setSelectedEvent(event); setMode('manage') }}
                            className="text-xs text-slate-500 px-2 py-1"
                          >
                            {t('tools.rsvpTracker.manage')}
                          </button>
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="text-xs text-red-500 px-2 py-1"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}

      {mode === 'rsvp' && selectedEvent && (
        <>
          <button onClick={() => setMode('events')} className="flex items-center gap-2 text-blue-500">
            ← {t('tools.rsvpTracker.back')}
          </button>

          <div className="card p-4 bg-blue-50">
            <h2 className="font-bold text-lg">{selectedEvent.name}</h2>
            <p className="text-sm text-slate-600">{new Date(selectedEvent.date).toLocaleString()}</p>
            <p className="text-sm text-slate-600">{selectedEvent.location}</p>
            {selectedEvent.description && <p className="text-sm mt-2">{selectedEvent.description}</p>}
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="font-medium">{t('tools.rsvpTracker.yourResponse')}</h3>
            <input
              type="text"
              value={rsvpForm.name}
              onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
              placeholder={t('tools.rsvpTracker.yourName')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="email"
              value={rsvpForm.email}
              onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
              placeholder={t('tools.rsvpTracker.email')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.rsvpTracker.willYouAttend')}</label>
              <div className="flex flex-wrap gap-2">
                {(['attending', 'not_attending', 'maybe'] as RSVPStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setRsvpForm({ ...rsvpForm, status: s })}
                    className={`px-3 py-1.5 rounded text-sm ${
                      rsvpForm.status === s ? statusColors[s] : 'bg-slate-100'
                    }`}
                  >
                    {t(`tools.rsvpTracker.status${s.replace('_', '')}`)}
                  </button>
                ))}
              </div>
            </div>
            {rsvpForm.status === 'attending' && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.rsvpTracker.numberOfGuests')}</label>
                <input
                  type="number"
                  min="1"
                  value={rsvpForm.guests}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, guests: parseInt(e.target.value) || 1 })}
                  className="w-20 px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            )}
            <textarea
              value={rsvpForm.message}
              onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
              placeholder={t('tools.rsvpTracker.message')}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
            <button
              onClick={submitRsvp}
              disabled={!rsvpForm.name}
              className="w-full py-3 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
            >
              {t('tools.rsvpTracker.submit')}
            </button>
          </div>
        </>
      )}

      {mode === 'manage' && selectedEvent && (
        <>
          <button onClick={() => setMode('events')} className="flex items-center gap-2 text-blue-500">
            ← {t('tools.rsvpTracker.back')}
          </button>

          <div className="card p-4">
            <h2 className="font-bold">{selectedEvent.name}</h2>
            <p className="text-sm text-slate-600">{t('tools.rsvpTracker.responses')}</p>
          </div>

          <div className="card p-4">
            {rsvps.filter(r => r.eventId === selectedEvent.id).length === 0 ? (
              <p className="text-center text-slate-500 py-4">{t('tools.rsvpTracker.noResponses')}</p>
            ) : (
              <div className="space-y-2">
                {rsvps.filter(r => r.eventId === selectedEvent.id).map(rsvp => (
                  <div key={rsvp.id} className="p-3 bg-slate-50 rounded flex items-center justify-between">
                    <div>
                      <div className="font-medium">{rsvp.name}</div>
                      <div className="text-xs text-slate-500">{rsvp.email}</div>
                      {rsvp.message && <div className="text-sm italic mt-1">"{rsvp.message}"</div>}
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${statusColors[rsvp.status]}`}>
                        {t(`tools.rsvpTracker.status${rsvp.status.replace('_', '')}`)}
                      </span>
                      {rsvp.status === 'attending' && rsvp.guests > 1 && (
                        <div className="text-xs text-slate-500 mt-1">+{rsvp.guests - 1} {t('tools.rsvpTracker.guests')}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
