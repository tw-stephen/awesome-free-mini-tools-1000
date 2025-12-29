import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface City {
  name: string
  country: string
  lat: number
  lng: number
}

const cities: City[] = [
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.006 },
  { name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437 },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074 },
  { name: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737 },
  { name: 'Hong Kong', country: 'China', lat: 22.3193, lng: 114.1694 },
  { name: 'Taipei', country: 'Taiwan', lat: 25.033, lng: 121.5654 },
  { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.978 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018 },
  { name: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777 },
  { name: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.405 },
  { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
  { name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194 },
  { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 },
]

export default function DistanceCalculator() {
  const { t } = useTranslation()
  const [fromCity, setFromCity] = useState<string>('Taipei')
  const [toCity, setToCity] = useState<string>('Tokyo')
  const [unit, setUnit] = useState<'km' | 'miles'>('km')
  const [customFrom, setCustomFrom] = useState({ lat: '', lng: '' })
  const [customTo, setCustomTo] = useState({ lat: '', lng: '' })
  const [useCustom, setUseCustom] = useState(false)

  const toRad = (deg: number) => deg * (Math.PI / 180)

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const getDistance = () => {
    let lat1: number, lng1: number, lat2: number, lng2: number

    if (useCustom) {
      lat1 = parseFloat(customFrom.lat) || 0
      lng1 = parseFloat(customFrom.lng) || 0
      lat2 = parseFloat(customTo.lat) || 0
      lng2 = parseFloat(customTo.lng) || 0
    } else {
      const from = cities.find(c => c.name === fromCity)
      const to = cities.find(c => c.name === toCity)
      if (!from || !to) return 0
      lat1 = from.lat
      lng1 = from.lng
      lat2 = to.lat
      lng2 = to.lng
    }

    const distanceKm = calculateDistance(lat1, lng1, lat2, lng2)
    return unit === 'km' ? distanceKm : distanceKm * 0.621371
  }

  const distance = getDistance()

  const estimateFlightTime = () => {
    const avgSpeed = 900 // km/h
    const distanceKm = unit === 'km' ? distance : distance / 0.621371
    const hours = distanceKm / avgSpeed
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m}m`
  }

  const estimateDrivingTime = () => {
    const avgSpeed = unit === 'km' ? 80 : 50 // km/h or mph
    const hours = distance / avgSpeed
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m}m`
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.distanceCalculator.mode')}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setUseCustom(false)}
              className={`px-3 py-1 rounded ${!useCustom ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
            >
              {t('tools.distanceCalculator.cities')}
            </button>
            <button
              onClick={() => setUseCustom(true)}
              className={`px-3 py-1 rounded ${useCustom ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
            >
              {t('tools.distanceCalculator.coordinates')}
            </button>
          </div>
        </div>

        {!useCustom ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-500 mb-1">{t('tools.distanceCalculator.from')}</label>
              <select
                value={fromCity}
                onChange={e => setFromCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                {cities.map(c => (
                  <option key={c.name} value={c.name}>{c.name}, {c.country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">{t('tools.distanceCalculator.to')}</label>
              <select
                value={toCity}
                onChange={e => setToCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                {cities.map(c => (
                  <option key={c.name} value={c.name}>{c.name}, {c.country}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-500 mb-1">{t('tools.distanceCalculator.from')}</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={customFrom.lat}
                  onChange={e => setCustomFrom({ ...customFrom, lat: e.target.value })}
                  placeholder="Latitude"
                  className="px-3 py-2 border border-slate-300 rounded"
                />
                <input
                  type="number"
                  value={customFrom.lng}
                  onChange={e => setCustomFrom({ ...customFrom, lng: e.target.value })}
                  placeholder="Longitude"
                  className="px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">{t('tools.distanceCalculator.to')}</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={customTo.lat}
                  onChange={e => setCustomTo({ ...customTo, lat: e.target.value })}
                  placeholder="Latitude"
                  className="px-3 py-2 border border-slate-300 rounded"
                />
                <input
                  type="number"
                  value={customTo.lng}
                  onChange={e => setCustomTo({ ...customTo, lng: e.target.value })}
                  placeholder="Longitude"
                  className="px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.distanceCalculator.unit')}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setUnit('km')}
              className={`px-3 py-1 rounded ${unit === 'km' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
            >
              Kilometers
            </button>
            <button
              onClick={() => setUnit('miles')}
              className={`px-3 py-1 rounded ${unit === 'miles' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
            >
              Miles
            </button>
          </div>
        </div>
      </div>

      <div className="card p-6 text-center">
        <div className="text-sm text-slate-500 mb-2">{t('tools.distanceCalculator.distance')}</div>
        <div className="text-4xl font-bold text-blue-600">
          {distance.toFixed(1)} {unit}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">✈️</div>
          <div className="text-sm text-slate-500">{t('tools.distanceCalculator.flightTime')}</div>
          <div className="font-bold text-lg">{estimateFlightTime()}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">🚗</div>
          <div className="text-sm text-slate-500">{t('tools.distanceCalculator.drivingTime')}</div>
          <div className="font-bold text-lg">{estimateDrivingTime()}</div>
        </div>
      </div>

      <div className="text-xs text-slate-500 text-center">
        {t('tools.distanceCalculator.disclaimer')}
      </div>
    </div>
  )
}
