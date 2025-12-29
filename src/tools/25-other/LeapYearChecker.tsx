import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function LeapYearChecker() {
  const { t } = useTranslation()
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [rangeStart, setRangeStart] = useState('2000')
  const [rangeEnd, setRangeEnd] = useState('2100')

  const isLeapYear = (y: number): boolean => {
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
  }

  const checkYear = parseInt(year)
  const isLeap = !isNaN(checkYear) && isLeapYear(checkYear)

  const getLeapYearsInRange = () => {
    const start = parseInt(rangeStart)
    const end = parseInt(rangeEnd)
    if (isNaN(start) || isNaN(end) || start > end) return []

    const leapYears: number[] = []
    for (let y = start; y <= end && leapYears.length < 100; y++) {
      if (isLeapYear(y)) {
        leapYears.push(y)
      }
    }
    return leapYears
  }

  const leapYearsInRange = getLeapYearsInRange()

  const getNextLeapYear = () => {
    let y = new Date().getFullYear()
    while (!isLeapYear(y)) y++
    return y
  }

  const getPrevLeapYear = () => {
    let y = new Date().getFullYear() - 1
    while (!isLeapYear(y)) y--
    return y
  }

  const getYearInfo = (y: number) => {
    const daysInYear = isLeapYear(y) ? 366 : 365
    const feb29 = isLeapYear(y)
    const firstDayOfYear = new Date(y, 0, 1).toLocaleDateString('en-US', { weekday: 'long' })
    return { daysInYear, feb29, firstDayOfYear }
  }

  const yearInfo = !isNaN(checkYear) ? getYearInfo(checkYear) : null

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.leapYearChecker.checkYear')}</h3>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded text-center text-xl"
          placeholder="2024"
        />
      </div>

      {!isNaN(checkYear) && (
        <div className={`card p-6 ${isLeap ? 'bg-green-50' : 'bg-slate-50'}`}>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{checkYear}</div>
            <div className={`text-2xl font-medium ${isLeap ? 'text-green-600' : 'text-slate-600'}`}>
              {isLeap ? t('tools.leapYearChecker.isLeapYear') : t('tools.leapYearChecker.notLeapYear')}
            </div>
            {isLeap && (
              <div className="mt-2 text-green-600">
                {t('tools.leapYearChecker.february29')}
              </div>
            )}
          </div>
        </div>
      )}

      {yearInfo && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.leapYearChecker.yearInfo')}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">{t('tools.leapYearChecker.daysInYear')}:</span>
              <span className="font-medium">{yearInfo.daysInYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">{t('tools.leapYearChecker.startsOn')}:</span>
              <span className="font-medium">{yearInfo.firstDayOfYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">{t('tools.leapYearChecker.hasFeb29')}:</span>
              <span className={`font-medium ${yearInfo.feb29 ? 'text-green-600' : 'text-slate-500'}`}>
                {yearInfo.feb29 ? t('tools.leapYearChecker.yes') : t('tools.leapYearChecker.no')}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.leapYearChecker.quickReference')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-green-50 rounded">
            <div className="text-sm text-slate-500">{t('tools.leapYearChecker.nextLeapYear')}</div>
            <div className="text-2xl font-bold text-green-600">{getNextLeapYear()}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-sm text-slate-500">{t('tools.leapYearChecker.prevLeapYear')}</div>
            <div className="text-2xl font-bold text-blue-600">{getPrevLeapYear()}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.leapYearChecker.leapYearsInRange')}</h3>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <input
            type="number"
            value={rangeStart}
            onChange={(e) => setRangeStart(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
            placeholder="2000"
          />
          <input
            type="number"
            value={rangeEnd}
            onChange={(e) => setRangeEnd(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
            placeholder="2100"
          />
        </div>
        {leapYearsInRange.length > 0 && (
          <>
            <div className="text-sm text-slate-500 mb-2">
              {leapYearsInRange.length} {t('tools.leapYearChecker.leapYearsFound')}
            </div>
            <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
              {leapYearsInRange.map(y => (
                <span
                  key={y}
                  className={`px-2 py-1 rounded text-sm ${
                    y === new Date().getFullYear() ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {y}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.leapYearChecker.rules')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.leapYearChecker.rule1')}</li>
          <li>{t('tools.leapYearChecker.rule2')}</li>
          <li>{t('tools.leapYearChecker.rule3')}</li>
        </ul>
      </div>
    </div>
  )
}
