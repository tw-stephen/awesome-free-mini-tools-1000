import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface City {
  id: string
  name: string
  country: string
  timezone: string
  offset: number
}

const cities: City[] = [
  { id: 'nyc', name: 'New York', country: 'USA', timezone: 'America/New_York', offset: -5 },
  { id: 'la', name: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles', offset: -8 },
  { id: 'london', name: 'London', country: 'UK', timezone: 'Europe/London', offset: 0 },
  { id: 'paris', name: 'Paris', country: 'France', timezone: 'Europe/Paris', offset: 1 },
  { id: 'berlin', name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', offset: 1 },
  { id: 'dubai', name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', offset: 4 },
  { id: 'mumbai', name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', offset: 5.5 },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', offset: 7 },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', offset: 8 },
  { id: 'hk', name: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', offset: 8 },
  { id: 'taipei', name: 'Taipei', country: 'Taiwan', timezone: 'Asia/Taipei', offset: 8 },
  { id: 'shanghai', name: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', offset: 8 },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', offset: 9 },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', offset: 9 },
  { id: 'sydney', name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', offset: 10 },
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', offset: 12 },
]

export default function LocalTimeWidget() {
  const { t } = useTranslation()
  const [selectedCities, setSelectedCities] = useState(['taipei', 'tokyo', 'nyc', 'london'])
  const [currentTimes, setCurrentTimes] = useState<Record<string, { time: string; date: string; period: string }>>({})
  const [is24Hour, setIs24Hour] = useState(false)

  useEffect(() => {
    const updateTimes = () => {
      const times: Record<string, { time: string; date: string; period: string }> = {}
      cities.forEach(city => {
        try {
          const now = new Date()
          const options: Intl.DateTimeFormatOptions = {
            timeZone: city.timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: !is24Hour,
          }
          const dateOptions: Intl.DateTimeFormatOptions = {
            timeZone: city.timezone,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }
          const timeStr = now.toLocaleTimeString('en-US', options)
          const dateStr = now.toLocaleDateString('en-US', dateOptions)

          const hour = parseInt(now.toLocaleTimeString('en-US', { timeZone: city.timezone, hour: 'numeric', hour12: false }))
          let period = 'night'
          if (hour >= 6 && hour < 12) period = 'morning'
          else if (hour >= 12 && hour < 18) period = 'afternoon'
          else if (hour >= 18 && hour < 21) period = 'evening'

          times[city.id] = { time: timeStr, date: dateStr, period }
        } catch {
          times[city.id] = { time: '--:--:--', date: '', period: 'day' }
        }
      })
      setCurrentTimes(times)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 1000)
    return () => clearInterval(interval)
  }, [is24Hour])

  const addCity = (cityId: string) => {
    if (!selectedCities.includes(cityId)) {
      setSelectedCities([...selectedCities, cityId])
    }
  }

  const removeCity = (cityId: string) => {
    setSelectedCities(selectedCities.filter(id => id !== cityId))
  }

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'morning': return '🌅'
      case 'afternoon': return '☀️'
      case 'evening': return '🌆'
      case 'night': return '🌙'
      default: return '⏰'
    }
  }

  const getPeriodBg = (period: string) => {
    switch (period) {
      case 'morning': return 'bg-gradient-to-br from-yellow-100 to-orange-100'
      case 'afternoon': return 'bg-gradient-to-br from-blue-100 to-sky-100'
      case 'evening': return 'bg-gradient-to-br from-orange-100 to-pink-100'
      case 'night': return 'bg-gradient-to-br from-indigo-100 to-purple-100'
      default: return 'bg-slate-100'
    }
  }

  const sortedSelectedCities = [...selectedCities].sort((a, b) => {
    const cityA = cities.find(c => c.id === a)
    const cityB = cities.find(c => c.id === b)
    return (cityA?.offset || 0) - (cityB?.offset || 0)
  })

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{t('tools.localTimeWidget.settings')}</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={is24Hour}
              onChange={e => setIs24Hour(e.target.checked)}
            />
            <span className="text-sm">{t('tools.localTimeWidget.24hour')}</span>
          </label>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.localTimeWidget.addCity')}</h3>
        <select
          onChange={e => {
            addCity(e.target.value)
            e.target.value = ''
          }}
          className="w-full px-3 py-2 border border-slate-300 rounded"
          defaultValue=""
        >
          <option value="" disabled>{t('tools.localTimeWidget.selectCity')}</option>
          {cities.filter(c => !selectedCities.includes(c.id)).map(city => (
            <option key={city.id} value={city.id}>{city.name}, {city.country}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedSelectedCities.map(cityId => {
          const city = cities.find(c => c.id === cityId)
          const timeData = currentTimes[cityId]
          if (!city || !timeData) return null

          return (
            <div
              key={cityId}
              className={`card p-4 ${getPeriodBg(timeData.period)}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getPeriodIcon(timeData.period)}</span>
                    <div>
                      <div className="font-bold text-lg">{city.name}</div>
                      <div className="text-sm text-slate-600">{city.country}</div>
                    </div>
                  </div>
                  <div className="text-3xl font-mono font-bold mt-2">
                    {timeData.time}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {timeData.date}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    UTC{city.offset >= 0 ? '+' : ''}{city.offset}
                  </div>
                </div>
                <button
                  onClick={() => removeCity(cityId)}
                  className="text-slate-400 hover:text-red-500"
                >
                  x
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {selectedCities.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          {t('tools.localTimeWidget.noCities')}
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.localTimeWidget.allCities')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
          {cities.map(city => {
            const timeData = currentTimes[city.id]
            return (
              <button
                key={city.id}
                onClick={() => addCity(city.id)}
                disabled={selectedCities.includes(city.id)}
                className={`p-2 rounded text-left text-sm ${
                  selectedCities.includes(city.id)
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="font-medium truncate">{city.name}</div>
                <div className="text-slate-500">{timeData?.time.slice(0, 5) || '--:--'}</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
