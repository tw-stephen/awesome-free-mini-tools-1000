import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ZodiacFinder() {
  const { t } = useTranslation()
  const [birthdate, setBirthdate] = useState('')

  const zodiacSigns = [
    { name: 'Aries', symbol: 'Ram', start: [3, 21], end: [4, 19], element: 'Fire', ruling: 'Mars' },
    { name: 'Taurus', symbol: 'Bull', start: [4, 20], end: [5, 20], element: 'Earth', ruling: 'Venus' },
    { name: 'Gemini', symbol: 'Twins', start: [5, 21], end: [6, 20], element: 'Air', ruling: 'Mercury' },
    { name: 'Cancer', symbol: 'Crab', start: [6, 21], end: [7, 22], element: 'Water', ruling: 'Moon' },
    { name: 'Leo', symbol: 'Lion', start: [7, 23], end: [8, 22], element: 'Fire', ruling: 'Sun' },
    { name: 'Virgo', symbol: 'Virgin', start: [8, 23], end: [9, 22], element: 'Earth', ruling: 'Mercury' },
    { name: 'Libra', symbol: 'Scales', start: [9, 23], end: [10, 22], element: 'Air', ruling: 'Venus' },
    { name: 'Scorpio', symbol: 'Scorpion', start: [10, 23], end: [11, 21], element: 'Water', ruling: 'Pluto' },
    { name: 'Sagittarius', symbol: 'Archer', start: [11, 22], end: [12, 21], element: 'Fire', ruling: 'Jupiter' },
    { name: 'Capricorn', symbol: 'Goat', start: [12, 22], end: [1, 19], element: 'Earth', ruling: 'Saturn' },
    { name: 'Aquarius', symbol: 'Water Bearer', start: [1, 20], end: [2, 18], element: 'Air', ruling: 'Uranus' },
    { name: 'Pisces', symbol: 'Fish', start: [2, 19], end: [3, 20], element: 'Water', ruling: 'Neptune' },
  ]

  const getZodiacSign = (date: string) => {
    if (!date) return null
    const d = new Date(date)
    const month = d.getMonth() + 1
    const day = d.getDate()

    for (const sign of zodiacSigns) {
      const [startMonth, startDay] = sign.start
      const [endMonth, endDay] = sign.end

      if (startMonth === endMonth) {
        if (month === startMonth && day >= startDay && day <= endDay) return sign
      } else if (startMonth > endMonth) {
        // Capricorn case (Dec 22 - Jan 19)
        if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) return sign
      } else {
        if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) return sign
      }
    }
    return null
  }

  const sign = getZodiacSign(birthdate)

  const getElementColor = (element: string) => {
    switch (element) {
      case 'Fire': return 'bg-red-100 text-red-700 border-red-300'
      case 'Earth': return 'bg-green-100 text-green-700 border-green-300'
      case 'Air': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'Water': return 'bg-cyan-100 text-cyan-700 border-cyan-300'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getCompatibility = (signName: string) => {
    const compatibility: Record<string, { best: string[]; good: string[]; challenging: string[] }> = {
      'Aries': { best: ['Leo', 'Sagittarius'], good: ['Gemini', 'Aquarius'], challenging: ['Cancer', 'Capricorn'] },
      'Taurus': { best: ['Virgo', 'Capricorn'], good: ['Cancer', 'Pisces'], challenging: ['Leo', 'Aquarius'] },
      'Gemini': { best: ['Libra', 'Aquarius'], good: ['Aries', 'Leo'], challenging: ['Virgo', 'Pisces'] },
      'Cancer': { best: ['Scorpio', 'Pisces'], good: ['Taurus', 'Virgo'], challenging: ['Aries', 'Libra'] },
      'Leo': { best: ['Aries', 'Sagittarius'], good: ['Gemini', 'Libra'], challenging: ['Taurus', 'Scorpio'] },
      'Virgo': { best: ['Taurus', 'Capricorn'], good: ['Cancer', 'Scorpio'], challenging: ['Gemini', 'Sagittarius'] },
      'Libra': { best: ['Gemini', 'Aquarius'], good: ['Leo', 'Sagittarius'], challenging: ['Cancer', 'Capricorn'] },
      'Scorpio': { best: ['Cancer', 'Pisces'], good: ['Virgo', 'Capricorn'], challenging: ['Leo', 'Aquarius'] },
      'Sagittarius': { best: ['Aries', 'Leo'], good: ['Libra', 'Aquarius'], challenging: ['Virgo', 'Pisces'] },
      'Capricorn': { best: ['Taurus', 'Virgo'], good: ['Scorpio', 'Pisces'], challenging: ['Aries', 'Libra'] },
      'Aquarius': { best: ['Gemini', 'Libra'], good: ['Aries', 'Sagittarius'], challenging: ['Taurus', 'Scorpio'] },
      'Pisces': { best: ['Cancer', 'Scorpio'], good: ['Taurus', 'Capricorn'], challenging: ['Gemini', 'Sagittarius'] },
    }
    return compatibility[signName] || { best: [], good: [], challenging: [] }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.zodiacFinder.enterBirthdate')}</h3>
        <input
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      {sign && (
        <>
          <div className={`card p-6 border-2 ${getElementColor(sign.element)}`}>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{sign.name}</div>
              <div className="text-lg text-slate-600 mb-4">{sign.symbol}</div>
              <div className="flex justify-center gap-4">
                <div className="text-sm">
                  <span className="text-slate-500">{t('tools.zodiacFinder.element')}: </span>
                  <span className="font-medium">{sign.element}</span>
                </div>
                <div className="text-sm">
                  <span className="text-slate-500">{t('tools.zodiacFinder.ruling')}: </span>
                  <span className="font-medium">{sign.ruling}</span>
                </div>
              </div>
              <div className="text-sm text-slate-500 mt-2">
                {sign.start[0]}/{sign.start[1]} - {sign.end[0]}/{sign.end[1]}
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.zodiacFinder.compatibility')}</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">{t('tools.zodiacFinder.bestMatches')}</div>
                <div className="flex gap-2">
                  {getCompatibility(sign.name).best.map(s => (
                    <span key={s} className="px-3 py-1 bg-green-100 text-green-700 rounded">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">{t('tools.zodiacFinder.goodMatches')}</div>
                <div className="flex gap-2">
                  {getCompatibility(sign.name).good.map(s => (
                    <span key={s} className="px-3 py-1 bg-blue-100 text-blue-700 rounded">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">{t('tools.zodiacFinder.challenging')}</div>
                <div className="flex gap-2">
                  {getCompatibility(sign.name).challenging.map(s => (
                    <span key={s} className="px-3 py-1 bg-red-100 text-red-700 rounded">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.zodiacFinder.allSigns')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {zodiacSigns.map(s => (
            <div
              key={s.name}
              className={`p-2 rounded text-center text-sm ${
                sign?.name === s.name ? 'ring-2 ring-purple-400' : ''
              } ${getElementColor(s.element)}`}
            >
              <div className="font-medium">{s.name}</div>
              <div className="text-xs opacity-75">
                {s.start[0]}/{s.start[1]} - {s.end[0]}/{s.end[1]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.zodiacFinder.elements')}</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-red-50 rounded">
            <div className="font-medium text-red-700">{t('tools.zodiacFinder.fire')}</div>
            <div className="text-xs text-red-600">Aries, Leo, Sagittarius</div>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <div className="font-medium text-green-700">{t('tools.zodiacFinder.earth')}</div>
            <div className="text-xs text-green-600">Taurus, Virgo, Capricorn</div>
          </div>
          <div className="p-2 bg-blue-50 rounded">
            <div className="font-medium text-blue-700">{t('tools.zodiacFinder.air')}</div>
            <div className="text-xs text-blue-600">Gemini, Libra, Aquarius</div>
          </div>
          <div className="p-2 bg-cyan-50 rounded">
            <div className="font-medium text-cyan-700">{t('tools.zodiacFinder.water')}</div>
            <div className="text-xs text-cyan-600">Cancer, Scorpio, Pisces</div>
          </div>
        </div>
      </div>
    </div>
  )
}
