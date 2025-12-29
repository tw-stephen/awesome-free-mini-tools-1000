import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function DaylightHoursCalculator() {
  const { t } = useTranslation()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [latitude, setLatitude] = useState('40.7128')
  const [longitude, setLongitude] = useState('-74.0060')

  const calculateDaylight = (lat: number, lng: number, dateStr: string) => {
    const d = new Date(dateStr)
    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))

    // Solar declination angle
    const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * Math.PI / 180)

    // Hour angle
    const latRad = lat * Math.PI / 180
    const decRad = declination * Math.PI / 180

    // Calculate sunrise/sunset hour angle
    const cosHourAngle = -Math.tan(latRad) * Math.tan(decRad)

    // Handle polar day/night
    if (cosHourAngle < -1) {
      return { daylightHours: 24, sunrise: null, sunset: null, isPolarDay: true }
    }
    if (cosHourAngle > 1) {
      return { daylightHours: 0, sunrise: null, sunset: null, isPolarNight: true }
    }

    const hourAngle = Math.acos(cosHourAngle) * 180 / Math.PI
    const daylightHours = (2 * hourAngle) / 15

    // Calculate approximate sunrise/sunset times
    const solarNoon = 12 - (lng / 15)
    const halfDaylight = daylightHours / 2
    const sunriseDecimal = solarNoon - halfDaylight
    const sunsetDecimal = solarNoon + halfDaylight

    const decimalToTime = (decimal: number) => {
      const hours = Math.floor(decimal)
      const minutes = Math.round((decimal - hours) * 60)
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }

    return {
      daylightHours,
      sunrise: decimalToTime(sunriseDecimal),
      sunset: decimalToTime(sunsetDecimal),
      solarNoon: decimalToTime(solarNoon),
    }
  }

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(4))
          setLongitude(position.coords.longitude.toFixed(4))
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  const lat = parseFloat(latitude)
  const lng = parseFloat(longitude)
  const result = !isNaN(lat) && !isNaN(lng) ? calculateDaylight(lat, lng, date) : null

  const presetLocations = [
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
    { name: 'Taipei', lat: 25.0330, lng: 121.5654 },
    { name: 'Reykjavik', lat: 64.1466, lng: -21.9426 },
  ]

  const getYearData = () => {
    if (isNaN(lat) || isNaN(lng)) return []
    const year = new Date(date).getFullYear()
    const data = []
    for (let month = 0; month < 12; month++) {
      const d = new Date(year, month, 15)
      const dateStr = d.toISOString().split('T')[0]
      const calc = calculateDaylight(lat, lng, dateStr)
      data.push({
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        hours: calc.daylightHours || 0,
      })
    }
    return data
  }

  const yearData = getYearData()
  const maxHours = Math.max(...yearData.map(d => d.hours), 1)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.daylightHoursCalculator.location')}</h3>
        <div className="flex flex-wrap gap-1 mb-3">
          {presetLocations.map(loc => (
            <button
              key={loc.name}
              onClick={() => {
                setLatitude(loc.lat.toString())
                setLongitude(loc.lng.toString())
              }}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs"
            >
              {loc.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.daylightHoursCalculator.latitude')}</label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              step="0.0001"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.daylightHoursCalculator.longitude')}</label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              step="0.0001"
            />
          </div>
        </div>
        <button
          onClick={useCurrentLocation}
          className="w-full py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
        >
          {t('tools.daylightHoursCalculator.useCurrentLocation')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.daylightHoursCalculator.date')}</h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      {result && (
        <div className="card p-6 bg-gradient-to-r from-yellow-100 to-orange-100">
          <div className="text-center">
            {'isPolarDay' in result && result.isPolarDay ? (
              <>
                <div className="text-4xl font-bold text-yellow-600 mb-2">24:00</div>
                <div className="text-slate-600">{t('tools.daylightHoursCalculator.polarDay')}</div>
              </>
            ) : 'isPolarNight' in result && result.isPolarNight ? (
              <>
                <div className="text-4xl font-bold text-slate-600 mb-2">0:00</div>
                <div className="text-slate-600">{t('tools.daylightHoursCalculator.polarNight')}</div>
              </>
            ) : (
              <>
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {Math.floor(result.daylightHours)}h {Math.round((result.daylightHours % 1) * 60)}m
                </div>
                <div className="text-slate-600">{t('tools.daylightHoursCalculator.ofDaylight')}</div>
              </>
            )}
          </div>
        </div>
      )}

      {result && !('isPolarDay' in result) && !('isPolarNight' in result) && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.daylightHoursCalculator.sunTimes')}</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-orange-50 rounded text-center">
              <div className="text-xs text-slate-500">{t('tools.daylightHoursCalculator.sunrise')}</div>
              <div className="text-xl font-bold text-orange-600">{result.sunrise}</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded text-center">
              <div className="text-xs text-slate-500">{t('tools.daylightHoursCalculator.solarNoon')}</div>
              <div className="text-xl font-bold text-yellow-600">{result.solarNoon}</div>
            </div>
            <div className="p-3 bg-red-50 rounded text-center">
              <div className="text-xs text-slate-500">{t('tools.daylightHoursCalculator.sunset')}</div>
              <div className="text-xl font-bold text-red-600">{result.sunset}</div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.daylightHoursCalculator.yearlyChart')}</h3>
        <div className="flex items-end gap-1 h-32">
          {yearData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-yellow-400 rounded-t"
                style={{ height: `${(d.hours / maxHours) * 100}%` }}
              />
              <div className="text-xs text-slate-500 mt-1">{d.month}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.daylightHoursCalculator.info')}</h3>
        <p className="text-sm text-slate-600">
          {t('tools.daylightHoursCalculator.infoText')}
        </p>
      </div>
    </div>
  )
}
