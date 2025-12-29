import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ChineseZodiac() {
  const { t } = useTranslation()
  const [birthYear, setBirthYear] = useState(new Date().getFullYear().toString())

  const zodiacAnimals = [
    { name: 'Rat', element: 'Water', yin: true, years: [1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020] },
    { name: 'Ox', element: 'Earth', yin: false, years: [1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021] },
    { name: 'Tiger', element: 'Wood', yin: true, years: [1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022] },
    { name: 'Rabbit', element: 'Wood', yin: false, years: [1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023] },
    { name: 'Dragon', element: 'Earth', yin: true, years: [1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024] },
    { name: 'Snake', element: 'Fire', yin: false, years: [1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025] },
    { name: 'Horse', element: 'Fire', yin: true, years: [1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026] },
    { name: 'Goat', element: 'Earth', yin: false, years: [1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027] },
    { name: 'Monkey', element: 'Metal', yin: true, years: [1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028] },
    { name: 'Rooster', element: 'Metal', yin: false, years: [1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029] },
    { name: 'Dog', element: 'Earth', yin: true, years: [1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030] },
    { name: 'Pig', element: 'Water', yin: false, years: [1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031] },
  ]

  const chineseNames: Record<string, string> = {
    'Rat': '鼠', 'Ox': '牛', 'Tiger': '虎', 'Rabbit': '兔',
    'Dragon': '龍', 'Snake': '蛇', 'Horse': '馬', 'Goat': '羊',
    'Monkey': '猴', 'Rooster': '雞', 'Dog': '狗', 'Pig': '豬'
  }

  const traits: Record<string, string[]> = {
    'Rat': ['Quick-witted', 'Resourceful', 'Versatile', 'Kind'],
    'Ox': ['Diligent', 'Dependable', 'Strong', 'Determined'],
    'Tiger': ['Brave', 'Confident', 'Competitive', 'Unpredictable'],
    'Rabbit': ['Quiet', 'Elegant', 'Kind', 'Responsible'],
    'Dragon': ['Confident', 'Intelligent', 'Enthusiastic', 'Lucky'],
    'Snake': ['Enigmatic', 'Intelligent', 'Wise', 'Intuitive'],
    'Horse': ['Animated', 'Active', 'Energetic', 'Independent'],
    'Goat': ['Calm', 'Gentle', 'Sympathetic', 'Creative'],
    'Monkey': ['Sharp', 'Smart', 'Curious', 'Playful'],
    'Rooster': ['Observant', 'Hardworking', 'Courageous', 'Talented'],
    'Dog': ['Loyal', 'Honest', 'Prudent', 'Faithful'],
    'Pig': ['Compassionate', 'Generous', 'Diligent', 'Realistic'],
  }

  const compatibility: Record<string, { best: string[], avoid: string[] }> = {
    'Rat': { best: ['Dragon', 'Monkey', 'Ox'], avoid: ['Horse', 'Goat'] },
    'Ox': { best: ['Rat', 'Snake', 'Rooster'], avoid: ['Tiger', 'Dragon', 'Horse', 'Goat'] },
    'Tiger': { best: ['Dragon', 'Horse', 'Pig'], avoid: ['Ox', 'Tiger', 'Snake', 'Monkey'] },
    'Rabbit': { best: ['Goat', 'Monkey', 'Dog', 'Pig'], avoid: ['Snake', 'Rooster'] },
    'Dragon': { best: ['Rooster', 'Rat', 'Monkey'], avoid: ['Ox', 'Goat', 'Dog'] },
    'Snake': { best: ['Dragon', 'Rooster'], avoid: ['Tiger', 'Rabbit', 'Snake', 'Goat', 'Pig'] },
    'Horse': { best: ['Tiger', 'Goat', 'Rabbit'], avoid: ['Rat', 'Ox', 'Rooster', 'Horse'] },
    'Goat': { best: ['Rabbit', 'Horse', 'Pig'], avoid: ['Ox', 'Tiger', 'Dog'] },
    'Monkey': { best: ['Ox', 'Rabbit'], avoid: ['Tiger', 'Pig'] },
    'Rooster': { best: ['Ox', 'Snake'], avoid: ['Rat', 'Rabbit', 'Horse', 'Rooster', 'Dog'] },
    'Dog': { best: ['Rabbit'], avoid: ['Dragon', 'Goat', 'Rooster'] },
    'Pig': { best: ['Tiger', 'Rabbit', 'Goat'], avoid: ['Snake', 'Monkey'] },
  }

  const getZodiacAnimal = (year: number) => {
    const index = (year - 4) % 12
    return zodiacAnimals[index >= 0 ? index : index + 12]
  }

  const getElementColor = (element: string) => {
    switch (element) {
      case 'Wood': return 'bg-green-100 text-green-700 border-green-300'
      case 'Fire': return 'bg-red-100 text-red-700 border-red-300'
      case 'Earth': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'Metal': return 'bg-slate-100 text-slate-700 border-slate-300'
      case 'Water': return 'bg-blue-100 text-blue-700 border-blue-300'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const year = parseInt(birthYear)
  const animal = !isNaN(year) && year > 0 ? getZodiacAnimal(year) : null

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.chineseZodiac.enterYear')}</h3>
        <input
          type="number"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
          placeholder="1990"
          min="1"
        />
      </div>

      {animal && (
        <>
          <div className={`card p-6 border-2 ${getElementColor(animal.element)}`}>
            <div className="text-center">
              <div className="text-6xl mb-2">{chineseNames[animal.name]}</div>
              <div className="text-3xl font-bold mb-2">{animal.name}</div>
              <div className="flex justify-center gap-4 text-sm">
                <span>{t('tools.chineseZodiac.element')}: {animal.element}</span>
                <span>{animal.yin ? 'Yin' : 'Yang'}</span>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.chineseZodiac.traits')}</h3>
            <div className="flex flex-wrap gap-2">
              {traits[animal.name].map(trait => (
                <span key={trait} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.chineseZodiac.compatibility')}</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">{t('tools.chineseZodiac.bestMatch')}</div>
                <div className="flex flex-wrap gap-2">
                  {compatibility[animal.name].best.map(a => (
                    <span key={a} className="px-3 py-1 bg-green-100 text-green-700 rounded">
                      {chineseNames[a]} {a}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">{t('tools.chineseZodiac.avoid')}</div>
                <div className="flex flex-wrap gap-2">
                  {compatibility[animal.name].avoid.map(a => (
                    <span key={a} className="px-3 py-1 bg-red-100 text-red-700 rounded">
                      {chineseNames[a]} {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.chineseZodiac.sameAnimalYears')}</h3>
            <div className="flex flex-wrap gap-2">
              {animal.years.map(y => (
                <span
                  key={y}
                  className={`px-2 py-1 rounded text-sm ${
                    y === year ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {y}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.chineseZodiac.allAnimals')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {zodiacAnimals.map(a => (
            <div
              key={a.name}
              className={`p-2 rounded text-center ${
                animal?.name === a.name ? 'ring-2 ring-purple-400' : ''
              } ${getElementColor(a.element)}`}
            >
              <div className="text-2xl">{chineseNames[a.name]}</div>
              <div className="text-xs">{a.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
