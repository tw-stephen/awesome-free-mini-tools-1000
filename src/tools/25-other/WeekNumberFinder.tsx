import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function WeekNumberFinder() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  }

  const getWeeksInYear = (year: number): number => {
    const dec31 = new Date(year, 11, 31)
    const week = getWeekNumber(dec31)
    return week === 1 ? getWeekNumber(new Date(year, 11, 24)) : week
  }

  const getDateRangeForWeek = (year: number, week: number) => {
    const simple = new Date(year, 0, 1 + (week - 1) * 7)
    const dow = simple.getDay()
    const isoWeekStart = simple
    if (dow <= 4) {
      isoWeekStart.setDate(simple.getDate() - simple.getDay() + 1)
    } else {
      isoWeekStart.setDate(simple.getDate() + 8 - simple.getDay())
    }
    const isoWeekEnd = new Date(isoWeekStart)
    isoWeekEnd.setDate(isoWeekStart.getDate() + 6)
    return { start: isoWeekStart, end: isoWeekEnd }
  }

  const date = new Date(selectedDate)
  const weekNumber = getWeekNumber(date)
  const year = parseInt(selectedYear)
  const weeksInYear = !isNaN(year) ? getWeeksInYear(year) : 52

  const currentWeek = getWeekNumber(new Date())
  const currentYear = new Date().getFullYear()

  const getAllWeeksForYear = () => {
    const weeks = []
    for (let w = 1; w <= weeksInYear; w++) {
      const range = getDateRangeForWeek(year, w)
      weeks.push({
        week: w,
        start: range.start.toLocaleDateString(),
        end: range.end.toLocaleDateString(),
      })
    }
    return weeks
  }

  const allWeeks = !isNaN(year) ? getAllWeeksForYear() : []

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.weekNumberFinder.findWeekNumber')}</h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-6 bg-gradient-to-r from-blue-100 to-indigo-100">
        <div className="text-center">
          <div className="text-sm text-slate-500 mb-1">{date.toLocaleDateString()}</div>
          <div className="text-5xl font-bold text-blue-600 mb-2">{t('tools.weekNumberFinder.week')} {weekNumber}</div>
          <div className="text-sm text-slate-600">
            {t('tools.weekNumberFinder.of')} {date.getFullYear()}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.weekNumberFinder.currentWeek')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-green-50 rounded text-center">
            <div className="text-xs text-slate-500">{t('tools.weekNumberFinder.today')}</div>
            <div className="text-2xl font-bold text-green-600">{t('tools.weekNumberFinder.week')} {currentWeek}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded text-center">
            <div className="text-xs text-slate-500">{t('tools.weekNumberFinder.weeksInYear')}</div>
            <div className="text-2xl font-bold text-blue-600">{getWeeksInYear(currentYear)}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.weekNumberFinder.viewAllWeeks')}</h3>
        <input
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded mb-3"
          placeholder="2024"
        />
        {allWeeks.length > 0 && (
          <div className="max-h-64 overflow-y-auto space-y-1">
            {allWeeks.map(w => (
              <div
                key={w.week}
                className={`flex justify-between items-center p-2 rounded text-sm ${
                  w.week === currentWeek && year === currentYear
                    ? 'bg-green-100 border border-green-300'
                    : 'bg-slate-50'
                }`}
              >
                <span className="font-medium">{t('tools.weekNumberFinder.week')} {w.week}</span>
                <span className="text-slate-500">{w.start} - {w.end}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.weekNumberFinder.info')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.weekNumberFinder.info1')}</li>
          <li>{t('tools.weekNumberFinder.info2')}</li>
          <li>{t('tools.weekNumberFinder.info3')}</li>
        </ul>
      </div>
    </div>
  )
}
