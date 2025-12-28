import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface City {
  id: string
  name: string
  timezone: string
  country: string
}

const cities: City[] = [
  { id: 'nyc', name: 'New York', timezone: 'America/New_York', country: 'USA' },
  { id: 'la', name: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'USA' },
  { id: 'chicago', name: 'Chicago', timezone: 'America/Chicago', country: 'USA' },
  { id: 'london', name: 'London', timezone: 'Europe/London', country: 'UK' },
  { id: 'paris', name: 'Paris', timezone: 'Europe/Paris', country: 'France' },
  { id: 'berlin', name: 'Berlin', timezone: 'Europe/Berlin', country: 'Germany' },
  { id: 'tokyo', name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan' },
  { id: 'shanghai', name: 'Shanghai', timezone: 'Asia/Shanghai', country: 'China' },
  { id: 'taipei', name: 'Taipei', timezone: 'Asia/Taipei', country: 'Taiwan' },
  { id: 'singapore', name: 'Singapore', timezone: 'Asia/Singapore', country: 'Singapore' },
  { id: 'sydney', name: 'Sydney', timezone: 'Australia/Sydney', country: 'Australia' },
  { id: 'dubai', name: 'Dubai', timezone: 'Asia/Dubai', country: 'UAE' },
  { id: 'moscow', name: 'Moscow', timezone: 'Europe/Moscow', country: 'Russia' },
  { id: 'mumbai', name: 'Mumbai', timezone: 'Asia/Kolkata', country: 'India' },
  { id: 'seoul', name: 'Seoul', timezone: 'Asia/Seoul', country: 'Korea' },
  { id: 'hk', name: 'Hong Kong', timezone: 'Asia/Hong_Kong', country: 'Hong Kong' },
  { id: 'toronto', name: 'Toronto', timezone: 'America/Toronto', country: 'Canada' },
  { id: 'saopaulo', name: 'São Paulo', timezone: 'America/Sao_Paulo', country: 'Brazil' },
]

export default function WorldClock() {
  const { t } = useTranslation()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedCities, setSelectedCities] = useState<string[]>(['nyc', 'london', 'tokyo', 'taipei'])
  const [is24Hour, setIs24Hour] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const getTimeInTimezone = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !is24Hour,
    }).format(currentTime)
  }

  const getDateInTimezone = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(currentTime)
  }

  const getOffset = (timezone: string) => {
    const date = new Date()
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }))
    const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60)
    const sign = offset >= 0 ? '+' : ''
    return `UTC${sign}${offset}`
  }

  const isDaytime = (timezone: string) => {
    const hour = parseInt(
      new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        hour12: false,
      }).format(currentTime)
    )
    return hour >= 6 && hour < 18
  }

  const toggleCity = (cityId: string) => {
    if (selectedCities.includes(cityId)) {
      if (selectedCities.length > 1) {
        setSelectedCities(selectedCities.filter((id) => id !== cityId))
      }
    } else {
      setSelectedCities([...selectedCities, cityId])
    }
  }

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(search.toLowerCase()) ||
    city.country.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.worldClock.title')}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIs24Hour(!is24Hour)}
              className="text-xs px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
            >
              {is24Hour ? '24H' : '12H'}
            </button>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + {t('tools.worldClock.addCity')}
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('tools.worldClock.searchCity')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm mb-2"
            />
            <div className="max-h-40 overflow-y-auto bg-slate-50 rounded p-2">
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    toggleCity(city.id)
                    setSearch('')
                    setShowSearch(false)
                  }}
                  className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-slate-200 ${
                    selectedCities.includes(city.id) ? 'bg-blue-100' : ''
                  }`}
                >
                  {city.name}, {city.country}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {cities
            .filter((city) => selectedCities.includes(city.id))
            .map((city) => (
              <div
                key={city.id}
                className={`p-4 rounded-lg border ${
                  isDaytime(city.timezone)
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                    : 'bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className={`font-medium ${
                      isDaytime(city.timezone) ? 'text-slate-800' : 'text-white'
                    }`}>
                      {city.name}
                    </div>
                    <div className={`text-xs ${
                      isDaytime(city.timezone) ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {city.country} • {getOffset(city.timezone)}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleCity(city.id)}
                    className={`text-xs ${
                      isDaytime(city.timezone) ? 'text-slate-400' : 'text-slate-500'
                    } hover:text-red-500`}
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-2 flex items-end justify-between">
                  <div className={`text-3xl font-mono font-bold ${
                    isDaytime(city.timezone) ? 'text-slate-800' : 'text-white'
                  }`}>
                    {getTimeInTimezone(city.timezone)}
                  </div>
                  <div className={`text-sm ${
                    isDaytime(city.timezone) ? 'text-slate-600' : 'text-slate-300'
                  }`}>
                    {getDateInTimezone(city.timezone)}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-lg">
                    {isDaytime(city.timezone) ? '☀️' : '🌙'}
                  </span>
                  <span className={`text-xs ${
                    isDaytime(city.timezone) ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {isDaytime(city.timezone)
                      ? t('tools.worldClock.daytime')
                      : t('tools.worldClock.nighttime')
                    }
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.worldClock.quickAdd')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {cities
            .filter((city) => !selectedCities.includes(city.id))
            .slice(0, 8)
            .map((city) => (
              <button
                key={city.id}
                onClick={() => toggleCity(city.id)}
                className="px-3 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
              >
                {city.name}
              </button>
            ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.worldClock.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.worldClock.tip1')}</li>
          <li>{t('tools.worldClock.tip2')}</li>
          <li>{t('tools.worldClock.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
