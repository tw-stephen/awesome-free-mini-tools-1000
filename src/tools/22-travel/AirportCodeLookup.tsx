import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Airport {
  code: string
  name: string
  city: string
  country: string
  region: string
}

const airports: Airport[] = [
  // North America
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA', region: 'North America' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', region: 'North America' },
  { code: 'ORD', name: 'O\'Hare International', city: 'Chicago', country: 'USA', region: 'North America' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA', region: 'North America' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA', region: 'North America' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'USA', region: 'North America' },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA', region: 'North America' },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'USA', region: 'North America' },
  { code: 'BOS', name: 'Boston Logan International', city: 'Boston', country: 'USA', region: 'North America' },
  { code: 'LAS', name: 'Harry Reid International', city: 'Las Vegas', country: 'USA', region: 'North America' },
  { code: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada', region: 'North America' },
  { code: 'YVR', name: 'Vancouver International', city: 'Vancouver', country: 'Canada', region: 'North America' },
  { code: 'MEX', name: 'Mexico City International', city: 'Mexico City', country: 'Mexico', region: 'North America' },

  // Europe
  { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'UK', region: 'Europe' },
  { code: 'LGW', name: 'London Gatwick', city: 'London', country: 'UK', region: 'Europe' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', region: 'Europe' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', region: 'Europe' },
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands', region: 'Europe' },
  { code: 'MAD', name: 'Adolfo Suarez Madrid-Barajas', city: 'Madrid', country: 'Spain', region: 'Europe' },
  { code: 'BCN', name: 'Barcelona El Prat', city: 'Barcelona', country: 'Spain', region: 'Europe' },
  { code: 'FCO', name: 'Leonardo da Vinci-Fiumicino', city: 'Rome', country: 'Italy', region: 'Europe' },
  { code: 'MXP', name: 'Milan Malpensa', city: 'Milan', country: 'Italy', region: 'Europe' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', region: 'Europe' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', region: 'Europe' },
  { code: 'VIE', name: 'Vienna International', city: 'Vienna', country: 'Austria', region: 'Europe' },

  // Asia
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan', region: 'Asia' },
  { code: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan', region: 'Asia' },
  { code: 'KIX', name: 'Kansai International', city: 'Osaka', country: 'Japan', region: 'Asia' },
  { code: 'PEK', name: 'Beijing Capital International', city: 'Beijing', country: 'China', region: 'Asia' },
  { code: 'PKX', name: 'Beijing Daxing International', city: 'Beijing', country: 'China', region: 'Asia' },
  { code: 'PVG', name: 'Shanghai Pudong International', city: 'Shanghai', country: 'China', region: 'Asia' },
  { code: 'SHA', name: 'Shanghai Hongqiao', city: 'Shanghai', country: 'China', region: 'Asia' },
  { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'China', region: 'Asia' },
  { code: 'TPE', name: 'Taiwan Taoyuan International', city: 'Taipei', country: 'Taiwan', region: 'Asia' },
  { code: 'TSA', name: 'Taipei Songshan', city: 'Taipei', country: 'Taiwan', region: 'Asia' },
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea', region: 'Asia' },
  { code: 'GMP', name: 'Gimpo International', city: 'Seoul', country: 'South Korea', region: 'Asia' },
  { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore', region: 'Asia' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', region: 'Asia' },
  { code: 'DMK', name: 'Don Mueang International', city: 'Bangkok', country: 'Thailand', region: 'Asia' },
  { code: 'KUL', name: 'Kuala Lumpur International', city: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia' },
  { code: 'CGK', name: 'Soekarno-Hatta International', city: 'Jakarta', country: 'Indonesia', region: 'Asia' },
  { code: 'DPS', name: 'Ngurah Rai International', city: 'Bali', country: 'Indonesia', region: 'Asia' },
  { code: 'MNL', name: 'Ninoy Aquino International', city: 'Manila', country: 'Philippines', region: 'Asia' },
  { code: 'SGN', name: 'Tan Son Nhat International', city: 'Ho Chi Minh City', country: 'Vietnam', region: 'Asia' },
  { code: 'HAN', name: 'Noi Bai International', city: 'Hanoi', country: 'Vietnam', region: 'Asia' },
  { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', country: 'India', region: 'Asia' },
  { code: 'BOM', name: 'Chhatrapati Shivaji International', city: 'Mumbai', country: 'India', region: 'Asia' },

  // Middle East
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', region: 'Middle East' },
  { code: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', country: 'UAE', region: 'Middle East' },
  { code: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar', region: 'Middle East' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', region: 'Middle East' },
  { code: 'TLV', name: 'Ben Gurion International', city: 'Tel Aviv', country: 'Israel', region: 'Middle East' },

  // Oceania
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', region: 'Oceania' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', region: 'Oceania' },
  { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia', region: 'Oceania' },
  { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', region: 'Oceania' },
]

export default function AirportCodeLookup() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRegion, setFilterRegion] = useState('all')
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['TPE', 'NRT', 'HND']))

  const regions = ['all', 'North America', 'Europe', 'Asia', 'Middle East', 'Oceania']

  const filteredAirports = useMemo(() => {
    return airports.filter(airport => {
      const matchesSearch = searchTerm === '' ||
        airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.country.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRegion = filterRegion === 'all' || airport.region === filterRegion

      return matchesSearch && matchesRegion
    })
  }, [searchTerm, filterRegion])

  const toggleFavorite = (code: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(code)) {
      newFavorites.delete(code)
    } else {
      newFavorites.add(code)
    }
    setFavorites(newFavorites)
  }

  const favoriteAirports = airports.filter(a => favorites.has(a.code))

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={t('tools.airportCodeLookup.search')}
          className="w-full px-3 py-2 border border-slate-300 rounded text-lg"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.airportCodeLookup.filterByRegion')}</h3>
        <div className="flex flex-wrap gap-2">
          {regions.map(region => (
            <button
              key={region}
              onClick={() => setFilterRegion(region)}
              className={`px-3 py-1 rounded-full text-sm ${
                filterRegion === region
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {region === 'all' ? 'All Regions' : region}
            </button>
          ))}
        </div>
      </div>

      {favoriteAirports.length > 0 && (
        <div className="card p-4 bg-yellow-50">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <span>⭐</span>
            {t('tools.airportCodeLookup.favorites')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {favoriteAirports.map(airport => (
              <div
                key={airport.code}
                className="px-3 py-1 bg-white rounded-full border border-yellow-300 flex items-center gap-2"
              >
                <span className="font-bold text-blue-600">{airport.code}</span>
                <span className="text-sm text-slate-600">{airport.city}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">
          {t('tools.airportCodeLookup.results')} ({filteredAirports.length})
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredAirports.map(airport => (
            <div
              key={airport.code}
              className="flex items-center justify-between p-3 bg-slate-50 rounded hover:bg-slate-100"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-blue-600 w-16">
                  {airport.code}
                </div>
                <div>
                  <div className="font-medium">{airport.name}</div>
                  <div className="text-sm text-slate-500">
                    {airport.city}, {airport.country}
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(airport.code)}
                className={`text-xl ${
                  favorites.has(airport.code) ? 'text-yellow-500' : 'text-slate-300'
                }`}
              >
                ★
              </button>
            </div>
          ))}
          {filteredAirports.length === 0 && (
            <div className="text-center text-slate-500 py-8">
              {t('tools.airportCodeLookup.noResults')}
            </div>
          )}
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.airportCodeLookup.tip')}</h3>
        <p className="text-sm text-slate-600">
          {t('tools.airportCodeLookup.tipText')}
        </p>
      </div>
    </div>
  )
}
