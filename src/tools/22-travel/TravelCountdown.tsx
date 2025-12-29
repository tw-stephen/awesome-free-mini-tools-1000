import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Trip {
  id: number
  name: string
  destination: string
  date: string
  image?: string
}

const destinationImages: Record<string, string> = {
  'japan': '🗾',
  'paris': '🗼',
  'london': '🎡',
  'new york': '🗽',
  'rome': '🏛️',
  'sydney': '🦘',
  'dubai': '🏙️',
  'bali': '🏝️',
  'default': '✈️',
}

export default function TravelCountdown() {
  const { t } = useTranslation()
  const [trips, setTrips] = useState<Trip[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newTrip, setNewTrip] = useState({ name: '', destination: '', date: '' })
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const addTrip = () => {
    if (!newTrip.name.trim() || !newTrip.date) return
    setTrips([...trips, { ...newTrip, id: Date.now() }])
    setNewTrip({ name: '', destination: '', date: '' })
    setShowForm(false)
  }

  const removeTrip = (id: number) => {
    setTrips(trips.filter(trip => trip.id !== id))
  }

  const getCountdown = (dateStr: string) => {
    const targetDate = new Date(dateStr)
    const diff = targetDate.getTime() - now.getTime()

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds, isPast: false }
  }

  const getDestinationEmoji = (destination: string) => {
    const lower = destination.toLowerCase()
    for (const [key, emoji] of Object.entries(destinationImages)) {
      if (lower.includes(key)) return emoji
    }
    return destinationImages.default
  }

  const sortedTrips = [...trips].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const upcomingTrips = sortedTrips.filter(trip => new Date(trip.date) >= now)
  const pastTrips = sortedTrips.filter(trip => new Date(trip.date) < now)

  return (
    <div className="space-y-4">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + {t('tools.travelCountdown.addTrip')}
        </button>
      )}

      {showForm && (
        <div className="card p-4 border-2 border-blue-300">
          <h3 className="font-medium mb-3">{t('tools.travelCountdown.addTrip')}</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newTrip.name}
              onChange={e => setNewTrip({ ...newTrip, name: e.target.value })}
              placeholder={t('tools.travelCountdown.tripName')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={newTrip.destination}
              onChange={e => setNewTrip({ ...newTrip, destination: e.target.value })}
              placeholder={t('tools.travelCountdown.destination')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="datetime-local"
              value={newTrip.date}
              onChange={e => setNewTrip({ ...newTrip, date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="flex gap-2">
              <button
                onClick={addTrip}
                disabled={!newTrip.name.trim() || !newTrip.date}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                Add
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

      {upcomingTrips.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">{t('tools.travelCountdown.upcoming')}</h3>
          {upcomingTrips.map((trip, index) => {
            const countdown = getCountdown(trip.date)
            const isNext = index === 0

            return (
              <div
                key={trip.id}
                className={`card p-4 ${isNext ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{getDestinationEmoji(trip.destination)}</span>
                    <div>
                      <div className={`font-bold text-lg ${isNext ? '' : 'text-slate-800'}`}>
                        {trip.name}
                      </div>
                      <div className={`text-sm ${isNext ? 'opacity-90' : 'text-slate-500'}`}>
                        {trip.destination}
                      </div>
                      <div className={`text-xs mt-1 ${isNext ? 'opacity-80' : 'text-slate-400'}`}>
                        {new Date(trip.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTrip(trip.id)}
                    className={`${isNext ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-red-500'}`}
                  >
                    x
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className={`text-center p-2 rounded ${isNext ? 'bg-white/20' : 'bg-slate-100'}`}>
                    <div className="text-2xl font-bold">{countdown.days}</div>
                    <div className={`text-xs ${isNext ? 'opacity-80' : 'text-slate-500'}`}>
                      {t('tools.travelCountdown.days')}
                    </div>
                  </div>
                  <div className={`text-center p-2 rounded ${isNext ? 'bg-white/20' : 'bg-slate-100'}`}>
                    <div className="text-2xl font-bold">{countdown.hours}</div>
                    <div className={`text-xs ${isNext ? 'opacity-80' : 'text-slate-500'}`}>
                      {t('tools.travelCountdown.hours')}
                    </div>
                  </div>
                  <div className={`text-center p-2 rounded ${isNext ? 'bg-white/20' : 'bg-slate-100'}`}>
                    <div className="text-2xl font-bold">{countdown.minutes}</div>
                    <div className={`text-xs ${isNext ? 'opacity-80' : 'text-slate-500'}`}>
                      {t('tools.travelCountdown.minutes')}
                    </div>
                  </div>
                  <div className={`text-center p-2 rounded ${isNext ? 'bg-white/20' : 'bg-slate-100'}`}>
                    <div className="text-2xl font-bold">{countdown.seconds}</div>
                    <div className={`text-xs ${isNext ? 'opacity-80' : 'text-slate-500'}`}>
                      {t('tools.travelCountdown.seconds')}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {pastTrips.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-slate-500">{t('tools.travelCountdown.past')}</h3>
          {pastTrips.map(trip => (
            <div key={trip.id} className="card p-4 opacity-60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getDestinationEmoji(trip.destination)}</span>
                  <div>
                    <div className="font-medium">{trip.name}</div>
                    <div className="text-sm text-slate-500">{trip.destination}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeTrip(trip.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  x
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {trips.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          <div className="text-4xl mb-2">✈️</div>
          {t('tools.travelCountdown.noTrips')}
        </div>
      )}
    </div>
  )
}
