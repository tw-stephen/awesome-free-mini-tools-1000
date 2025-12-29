import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Airport {
  code: string
  city: string
  country: string
  lat: number
  lng: number
}

const airports: Airport[] = [
  { code: 'JFK', city: 'New York', country: 'USA', lat: 40.6413, lng: -73.7781 },
  { code: 'LAX', city: 'Los Angeles', country: 'USA', lat: 33.9425, lng: -118.408 },
  { code: 'LHR', city: 'London', country: 'UK', lat: 51.4700, lng: -0.4543 },
  { code: 'CDG', city: 'Paris', country: 'France', lat: 49.0097, lng: 2.5479 },
  { code: 'NRT', city: 'Tokyo Narita', country: 'Japan', lat: 35.7647, lng: 140.386 },
  { code: 'HND', city: 'Tokyo Haneda', country: 'Japan', lat: 35.5494, lng: 139.7798 },
  { code: 'PEK', city: 'Beijing', country: 'China', lat: 40.0799, lng: 116.6031 },
  { code: 'PVG', city: 'Shanghai', country: 'China', lat: 31.1443, lng: 121.8083 },
  { code: 'HKG', city: 'Hong Kong', country: 'China', lat: 22.3080, lng: 113.9185 },
  { code: 'TPE', city: 'Taipei', country: 'Taiwan', lat: 25.0777, lng: 121.2328 },
  { code: 'ICN', city: 'Seoul Incheon', country: 'South Korea', lat: 37.4602, lng: 126.4407 },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', lat: 1.3644, lng: 103.9915 },
  { code: 'SYD', city: 'Sydney', country: 'Australia', lat: -33.9399, lng: 151.1753 },
  { code: 'DXB', city: 'Dubai', country: 'UAE', lat: 25.2532, lng: 55.3657 },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', lat: 13.6900, lng: 100.7501 },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', lat: 50.0379, lng: 8.5622 },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', lat: 52.3105, lng: 4.7683 },
  { code: 'SFO', city: 'San Francisco', country: 'USA', lat: 37.6213, lng: -122.379 },
  { code: 'ORD', city: 'Chicago', country: 'USA', lat: 41.9742, lng: -87.9073 },
  { code: 'YYZ', city: 'Toronto', country: 'Canada', lat: 43.6777, lng: -79.6248 },
]

export default function FlightTimeEstimator() {
  const { t } = useTranslation()
  const [departure, setDeparture] = useState('TPE')
  const [arrival, setArrival] = useState('NRT')
  const [departureTime, setDepartureTime] = useState('10:00')
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0])

  const toRad = (deg: number) => deg * (Math.PI / 180)

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const getFlightInfo = () => {
    const dep = airports.find(a => a.code === departure)
    const arr = airports.find(a => a.code === arrival)
    if (!dep || !arr) return null

    const distance = calculateDistance(dep.lat, dep.lng, arr.lat, arr.lng)

    // Average cruising speed varies by distance
    let avgSpeed = 850 // km/h
    if (distance < 1000) avgSpeed = 700
    else if (distance > 5000) avgSpeed = 900

    // Add time for takeoff, landing, taxiing
    const flightTimeHours = distance / avgSpeed + 0.5
    const hours = Math.floor(flightTimeHours)
    const minutes = Math.round((flightTimeHours - hours) * 60)

    // Calculate arrival time
    const depDateTime = new Date(`${departureDate}T${departureTime}`)
    const arrDateTime = new Date(depDateTime.getTime() + flightTimeHours * 60 * 60 * 1000)

    return {
      distance: Math.round(distance),
      duration: { hours, minutes },
      arrivalTime: arrDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      arrivalDate: arrDateTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      isSameDay: depDateTime.toDateString() === arrDateTime.toDateString(),
    }
  }

  const flightInfo = getFlightInfo()

  const swapAirports = () => {
    setDeparture(arrival)
    setArrival(departure)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.flightTimeEstimator.route')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-500 mb-1">{t('tools.flightTimeEstimator.departure')}</label>
            <select
              value={departure}
              onChange={e => setDeparture(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {airports.map(a => (
                <option key={a.code} value={a.code}>{a.code} - {a.city}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-center">
            <button
              onClick={swapAirports}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full"
            >
              ⇄
            </button>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-500 mb-1">{t('tools.flightTimeEstimator.arrival')}</label>
            <select
              value={arrival}
              onChange={e => setArrival(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {airports.map(a => (
                <option key={a.code} value={a.code}>{a.code} - {a.city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.flightTimeEstimator.departureTime')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={departureDate}
            onChange={e => setDepartureDate(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="time"
            value={departureTime}
            onChange={e => setDepartureTime(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      {flightInfo && (
        <>
          <div className="card p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-3xl font-bold">{departure}</div>
                <div className="text-sm opacity-80">
                  {airports.find(a => a.code === departure)?.city}
                </div>
                <div className="mt-2 font-medium">{departureTime}</div>
              </div>
              <div className="text-center flex-1 px-4">
                <div className="text-sm opacity-80">{t('tools.flightTimeEstimator.flightTime')}</div>
                <div className="text-2xl font-bold">
                  {flightInfo.duration.hours}h {flightInfo.duration.minutes}m
                </div>
                <div className="text-xs opacity-60 mt-1">
                  ✈️ {flightInfo.distance} km
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{arrival}</div>
                <div className="text-sm opacity-80">
                  {airports.find(a => a.code === arrival)?.city}
                </div>
                <div className="mt-2 font-medium">
                  {flightInfo.arrivalTime}
                  {!flightInfo.isSameDay && (
                    <span className="text-xs ml-1 opacity-80">+1</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <div className="text-sm text-slate-500">{t('tools.flightTimeEstimator.distance')}</div>
              <div className="font-bold text-lg">{flightInfo.distance.toLocaleString()} km</div>
              <div className="text-xs text-slate-400">
                {Math.round(flightInfo.distance * 0.621371).toLocaleString()} mi
              </div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-sm text-slate-500">{t('tools.flightTimeEstimator.arrivalDate')}</div>
              <div className="font-bold text-lg">{flightInfo.arrivalDate}</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-sm text-slate-500">{t('tools.flightTimeEstimator.arrivalTime')}</div>
              <div className="font-bold text-lg">{flightInfo.arrivalTime}</div>
            </div>
          </div>
        </>
      )}

      <div className="text-xs text-slate-500 text-center">
        {t('tools.flightTimeEstimator.disclaimer')}
      </div>
    </div>
  )
}
