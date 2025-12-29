import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function AgeCalculator() {
  const { t } = useTranslation()
  const [birthdate, setBirthdate] = useState('')
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0])
  const [age, setAge] = useState<{
    years: number
    months: number
    days: number
    totalDays: number
    totalWeeks: number
    totalMonths: number
    totalHours: number
    totalMinutes: number
    nextBirthday: number
  } | null>(null)

  useEffect(() => {
    if (!birthdate || !targetDate) {
      setAge(null)
      return
    }

    const birth = new Date(birthdate)
    const target = new Date(targetDate)

    if (birth > target) {
      setAge(null)
      return
    }

    // Calculate years, months, days
    let years = target.getFullYear() - birth.getFullYear()
    let months = target.getMonth() - birth.getMonth()
    let days = target.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0)
      days += prevMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    // Calculate totals
    const diffMs = target.getTime() - birth.getTime()
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
    const totalMinutes = Math.floor(diffMs / (1000 * 60))

    // Calculate days until next birthday
    const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBday <= target) {
      nextBday.setFullYear(target.getFullYear() + 1)
    }
    const nextBirthday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))

    setAge({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      nextBirthday,
    })
  }, [birthdate, targetDate])

  const getZodiacSign = (date: string) => {
    const d = new Date(date)
    const month = d.getMonth() + 1
    const day = d.getDate()

    const signs = [
      { name: 'Capricorn', start: [1, 1], end: [1, 19] },
      { name: 'Aquarius', start: [1, 20], end: [2, 18] },
      { name: 'Pisces', start: [2, 19], end: [3, 20] },
      { name: 'Aries', start: [3, 21], end: [4, 19] },
      { name: 'Taurus', start: [4, 20], end: [5, 20] },
      { name: 'Gemini', start: [5, 21], end: [6, 20] },
      { name: 'Cancer', start: [6, 21], end: [7, 22] },
      { name: 'Leo', start: [7, 23], end: [8, 22] },
      { name: 'Virgo', start: [8, 23], end: [9, 22] },
      { name: 'Libra', start: [9, 23], end: [10, 22] },
      { name: 'Scorpio', start: [10, 23], end: [11, 21] },
      { name: 'Sagittarius', start: [11, 22], end: [12, 21] },
      { name: 'Capricorn', start: [12, 22], end: [12, 31] },
    ]

    for (const sign of signs) {
      if ((month === sign.start[0] && day >= sign.start[1]) ||
          (month === sign.end[0] && day <= sign.end[1])) {
        return sign.name
      }
    }
    return 'Unknown'
  }

  const getChineseZodiac = (date: string) => {
    const year = new Date(date).getFullYear()
    const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig']
    return animals[(year - 4) % 12]
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.ageCalculator.enterDates')}</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.ageCalculator.birthdate')}</label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.ageCalculator.calculateAsOf')}</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      {age && (
        <>
          <div className="card p-6 bg-gradient-to-r from-blue-100 to-purple-100">
            <h3 className="text-center text-lg font-medium text-slate-700 mb-4">{t('tools.ageCalculator.yourAge')}</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-3 shadow">
                <div className="text-3xl font-bold text-blue-600">{age.years}</div>
                <div className="text-xs text-slate-500">{t('tools.ageCalculator.years')}</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow">
                <div className="text-3xl font-bold text-purple-600">{age.months}</div>
                <div className="text-xs text-slate-500">{t('tools.ageCalculator.months')}</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow">
                <div className="text-3xl font-bold text-blue-600">{age.days}</div>
                <div className="text-xs text-slate-500">{t('tools.ageCalculator.days')}</div>
              </div>
            </div>
            <div className="text-center mt-4">
              <span className="text-sm text-slate-600">
                {t('tools.ageCalculator.nextBirthday')}: <span className="font-medium">{age.nextBirthday} {t('tools.ageCalculator.daysAway')}</span>
              </span>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.ageCalculator.ageIn')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-xl font-bold text-slate-700">{age.totalMonths.toLocaleString()}</div>
                <div className="text-xs text-slate-500">{t('tools.ageCalculator.months')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-xl font-bold text-slate-700">{age.totalWeeks.toLocaleString()}</div>
                <div className="text-xs text-slate-500">{t('tools.ageCalculator.weeks')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-xl font-bold text-slate-700">{age.totalDays.toLocaleString()}</div>
                <div className="text-xs text-slate-500">{t('tools.ageCalculator.days')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-xl font-bold text-slate-700">{age.totalHours.toLocaleString()}</div>
                <div className="text-xs text-slate-500">{t('tools.ageCalculator.hours')}</div>
              </div>
            </div>
          </div>

          {birthdate && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.ageCalculator.zodiacSigns')}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-indigo-50 rounded">
                  <div className="text-sm text-slate-500">{t('tools.ageCalculator.westernZodiac')}</div>
                  <div className="text-lg font-medium text-indigo-600">{getZodiacSign(birthdate)}</div>
                </div>
                <div className="p-3 bg-red-50 rounded">
                  <div className="text-sm text-slate-500">{t('tools.ageCalculator.chineseZodiac')}</div>
                  <div className="text-lg font-medium text-red-600">{getChineseZodiac(birthdate)}</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.ageCalculator.info')}</h3>
        <p className="text-sm text-slate-600">
          {t('tools.ageCalculator.infoText')}
        </p>
      </div>
    </div>
  )
}
