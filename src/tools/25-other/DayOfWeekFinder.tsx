import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function DayOfWeekFinder() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState('')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString())
  const [day, setDay] = useState(new Date().getDate().toString())

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDateInfo = (date: Date) => {
    const dayOfWeek = days[date.getDay()]
    const dayOfYear = Math.ceil((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const weekOfYear = Math.ceil(dayOfYear / 7)
    const isLeapYear = (date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) || date.getFullYear() % 400 === 0
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    const quarter = Math.ceil((date.getMonth() + 1) / 3)

    return { dayOfWeek, dayOfYear, weekOfYear, isLeapYear, daysInMonth, quarter }
  }

  const dateFromInputs = () => {
    const y = parseInt(year)
    const m = parseInt(month) - 1
    const d = parseInt(day)
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null
    const date = new Date(y, m, d)
    if (date.getFullYear() !== y || date.getMonth() !== m || date.getDate() !== d) return null
    return date
  }

  const date = selectedDate ? new Date(selectedDate) : dateFromInputs()
  const info = date ? getDateInfo(date) : null

  const getMonthCalendar = () => {
    if (!date) return []
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    const startPadding = firstDay.getDay()
    const calendar: (number | null)[][] = []
    let week: (number | null)[] = new Array(startPadding).fill(null)

    for (let d = 1; d <= lastDay.getDate(); d++) {
      week.push(d)
      if (week.length === 7) {
        calendar.push(week)
        week = []
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null)
      calendar.push(week)
    }
    return calendar
  }

  const calendar = getMonthCalendar()

  const historicalEvents = date ? [
    { year: 1776, event: 'US Declaration of Independence' },
    { year: 1969, event: 'Moon Landing' },
    { year: 2000, event: 'Y2K New Millennium' },
  ].filter(e => {
    const eventDate = new Date(e.year, date.getMonth(), date.getDate())
    return eventDate.getMonth() === date.getMonth() && eventDate.getDate() === date.getDate()
  }) : []

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.dayOfWeekFinder.selectDate')}</h3>
        <div className="space-y-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="text-center text-sm text-slate-500">{t('tools.dayOfWeekFinder.or')}</div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.dayOfWeekFinder.year')}</label>
              <input
                type="number"
                value={year}
                onChange={(e) => { setYear(e.target.value); setSelectedDate('') }}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="2024"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.dayOfWeekFinder.month')}</label>
              <input
                type="number"
                value={month}
                onChange={(e) => { setMonth(e.target.value); setSelectedDate('') }}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="1-12"
                min="1"
                max="12"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.dayOfWeekFinder.day')}</label>
              <input
                type="number"
                value={day}
                onChange={(e) => { setDay(e.target.value); setSelectedDate('') }}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="1-31"
                min="1"
                max="31"
              />
            </div>
          </div>
        </div>
      </div>

      {info && date && (
        <>
          <div className="card p-6 bg-gradient-to-r from-green-100 to-blue-100">
            <div className="text-center">
              <div className="text-sm text-slate-500 mb-1">{date.toLocaleDateString()}</div>
              <div className="text-4xl font-bold text-green-600 mb-2">{info.dayOfWeek}</div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.dayOfWeekFinder.dateInfo')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">{t('tools.dayOfWeekFinder.dayOfYear')}</div>
                <div className="text-lg font-medium">{info.dayOfYear}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">{t('tools.dayOfWeekFinder.weekOfYear')}</div>
                <div className="text-lg font-medium">{info.weekOfYear}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">{t('tools.dayOfWeekFinder.quarter')}</div>
                <div className="text-lg font-medium">Q{info.quarter}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">{t('tools.dayOfWeekFinder.daysInMonth')}</div>
                <div className="text-lg font-medium">{info.daysInMonth}</div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-slate-50 rounded text-center">
              <span className={`px-3 py-1 rounded text-sm ${info.isLeapYear ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                {info.isLeapYear ? t('tools.dayOfWeekFinder.leapYear') : t('tools.dayOfWeekFinder.notLeapYear')}
              </span>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="grid grid-cols-7 gap-1 text-center">
              {daysShort.map(d => (
                <div key={d} className="text-xs font-medium text-slate-500 py-1">{d}</div>
              ))}
              {calendar.flat().map((d, i) => (
                <div
                  key={i}
                  className={`text-sm py-1 rounded ${
                    d === date.getDate() ? 'bg-blue-500 text-white font-bold' :
                    d ? 'hover:bg-slate-100' : ''
                  }`}
                >
                  {d || ''}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.dayOfWeekFinder.sameDayOtherYears')}</h3>
            <div className="space-y-1">
              {[-100, -50, -10, 10, 50, 100].map(offset => {
                const otherDate = new Date(date.getFullYear() + offset, date.getMonth(), date.getDate())
                return (
                  <div key={offset} className="flex justify-between text-sm">
                    <span className="text-slate-600">{otherDate.getFullYear()}</span>
                    <span className="font-medium">{days[otherDate.getDay()]}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {!info && (
        <div className="card p-8 text-center text-slate-500">
          {t('tools.dayOfWeekFinder.enterValidDate')}
        </div>
      )}
    </div>
  )
}
