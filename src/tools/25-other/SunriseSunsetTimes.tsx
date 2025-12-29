import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function SunriseSunsetTimes() {
  const { t } = useTranslation()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [latitude, setLatitude] = useState('40.7128')
  const [longitude, setLongitude] = useState('-74.0060')
  const [timezone, setTimezone] = useState('0')

  const calculateSunTimes = (lat: number, lng: number, dateStr: string, tz: number) => {
    const d = new Date(dateStr)
    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))

    // Solar declination
    const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * Math.PI / 180)

    const latRad = lat * Math.PI / 180
    const decRad = declination * Math.PI / 180

    // Calculate times for different twilight phases
    const calculateTime = (angle: number) => {
      const cosH = (Math.sin(angle * Math.PI / 180) - Math.sin(latRad) * Math.sin(decRad)) /
                   (Math.cos(latRad) * Math.cos(decRad))

      if (cosH < -1 || cosH > 1) return null

      const H = Math.acos(cosH) * 180 / Math.PI / 15
      const solarNoon = 12 - lng / 15 + tz

      return {
        rise: solarNoon - H,
        set: solarNoon + H,
      }
    }

    const formatTime = (decimal: number | null) => {
      if (decimal === null) return '--:--'
      const hours = Math.floor(decimal)
      const minutes = Math.round((decimal - hours) * 60)
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }

    const sunrise = calculateTime(-0.833) // Standard sunrise/sunset (accounting for refraction)
    const civilTwilight = calculateTime(-6) // Civil twilight
    const nauticalTwilight = calculateTime(-12) // Nautical twilight
    const astronomicalTwilight = calculateTime(-18) // Astronomical twilight

    const dayLength = sunrise ? (sunrise.set - sunrise.rise) : 0

    return {
      sunrise: formatTime(sunrise?.rise ?? null),
      sunset: formatTime(sunrise?.set ?? null),
      civilDawn: formatTime(civilTwilight?.rise ?? null),
      civilDusk: formatTime(civilTwilight?.set ?? null),
      nauticalDawn: formatTime(nauticalTwilight?.rise ?? null),
      nauticalDusk: formatTime(nauticalTwilight?.set ?? null),
      astronomicalDawn: formatTime(astronomicalTwilight?.rise ?? null),
      astronomicalDusk: formatTime(astronomicalTwilight?.set ?? null),
      solarNoon: formatTime(12 - parseFloat(longitude) / 15 + parseFloat(timezone)),
      dayLength: `${Math.floor(dayLength)}h ${Math.round((dayLength % 1) * 60)}m`,
    }
  }

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(4))
          setLongitude(position.coords.longitude.toFixed(4))
          setTimezone((-new Date().getTimezoneOffset() / 60).toString())
        },
        (error) => console.error('Error getting location:', error)
      )
    }
  }

  const lat = parseFloat(latitude)
  const lng = parseFloat(longitude)
  const tz = parseFloat(timezone)
  const times = !isNaN(lat) && !isNaN(lng) && !isNaN(tz) ? calculateSunTimes(lat, lng, date, tz) : null

  const presetLocations = [
    { name: 'New York', lat: 40.7128, lng: -74.0060, tz: -5 },
    { name: 'London', lat: 51.5074, lng: -0.1278, tz: 0 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, tz: 9 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093, tz: 10 },
    { name: 'Taipei', lat: 25.0330, lng: 121.5654, tz: 8 },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.sunriseSunsetTimes.location')}</h3>
        <div className="flex flex-wrap gap-1 mb-3">
          {presetLocations.map(loc => (
            <button
              key={loc.name}
              onClick={() => {
                setLatitude(loc.lat.toString())
                setLongitude(loc.lng.toString())
                setTimezone(loc.tz.toString())
              }}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs"
            >
              {loc.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.sunriseSunsetTimes.latitude')}</label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              step="0.0001"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.sunriseSunsetTimes.longitude')}</label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              step="0.0001"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.sunriseSunsetTimes.timezone')}</label>
            <input
              type="number"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
        <button
          onClick={useCurrentLocation}
          className="w-full py-2 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200"
        >
          {t('tools.sunriseSunsetTimes.useCurrentLocation')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.sunriseSunsetTimes.date')}</h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      {times && (
        <>
          <div className="card p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg text-center">
                <div className="text-sm text-slate-500">{t('tools.sunriseSunsetTimes.sunrise')}</div>
                <div className="text-3xl font-bold text-orange-600">{times.sunrise}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-100 to-purple-100 rounded-lg text-center">
                <div className="text-sm text-slate-500">{t('tools.sunriseSunsetTimes.sunset')}</div>
                <div className="text-3xl font-bold text-red-600">{times.sunset}</div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-yellow-50 rounded text-center">
              <span className="text-sm text-slate-600">{t('tools.sunriseSunsetTimes.dayLength')}: </span>
              <span className="font-bold text-yellow-700">{times.dayLength}</span>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.sunriseSunsetTimes.twilight')}</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <div>
                  <div className="font-medium text-sm">{t('tools.sunriseSunsetTimes.astronomicalTwilight')}</div>
                  <div className="text-xs text-slate-500">{t('tools.sunriseSunsetTimes.astronomicalDesc')}</div>
                </div>
                <div className="text-sm">
                  <span className="text-blue-600">{times.astronomicalDawn}</span>
                  <span className="text-slate-400 mx-1">-</span>
                  <span className="text-indigo-600">{times.astronomicalDusk}</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <div>
                  <div className="font-medium text-sm">{t('tools.sunriseSunsetTimes.nauticalTwilight')}</div>
                  <div className="text-xs text-slate-500">{t('tools.sunriseSunsetTimes.nauticalDesc')}</div>
                </div>
                <div className="text-sm">
                  <span className="text-blue-600">{times.nauticalDawn}</span>
                  <span className="text-slate-400 mx-1">-</span>
                  <span className="text-indigo-600">{times.nauticalDusk}</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <div>
                  <div className="font-medium text-sm">{t('tools.sunriseSunsetTimes.civilTwilight')}</div>
                  <div className="text-xs text-slate-500">{t('tools.sunriseSunsetTimes.civilDesc')}</div>
                </div>
                <div className="text-sm">
                  <span className="text-blue-600">{times.civilDawn}</span>
                  <span className="text-slate-400 mx-1">-</span>
                  <span className="text-indigo-600">{times.civilDusk}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.sunriseSunsetTimes.solarNoon')}</h3>
            <div className="p-4 bg-yellow-50 rounded text-center">
              <div className="text-2xl font-bold text-yellow-600">{times.solarNoon}</div>
              <div className="text-sm text-slate-500">{t('tools.sunriseSunsetTimes.solarNoonDesc')}</div>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.sunriseSunsetTimes.info')}</h3>
        <p className="text-sm text-slate-600">
          {t('tools.sunriseSunsetTimes.infoText')}
        </p>
      </div>
    </div>
  )
}
