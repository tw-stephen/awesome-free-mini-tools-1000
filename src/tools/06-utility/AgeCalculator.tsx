import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function AgeCalculator() {
  const { t } = useTranslation()
  const [birthDate, setBirthDate] = useState('')
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0])

  const result = useMemo(() => {
    if (!birthDate) return null

    const birth = new Date(birthDate)
    const target = new Date(targetDate)

    if (birth > target) return null

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

    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months
    const totalHours = totalDays * 24
    const totalMinutes = totalHours * 60

    const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBirthday <= target) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
    }
    const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))

    const dayOfWeek = birth.toLocaleDateString('en-US', { weekday: 'long' })

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      daysToNextBirthday,
      dayOfWeek,
    }
  }, [birthDate, targetDate])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.ageCalculator.enterDates')}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.ageCalculator.birthDate')}
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.ageCalculator.targetDate')}
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {result && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-4">
              {t('tools.ageCalculator.yourAge')}
            </h3>

            <div className="flex justify-center gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{result.years}</div>
                <div className="text-sm text-slate-600">{t('tools.ageCalculator.years')}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{result.months}</div>
                <div className="text-sm text-slate-600">{t('tools.ageCalculator.months')}</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{result.days}</div>
                <div className="text-sm text-slate-600">{t('tools.ageCalculator.days')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.ageCalculator.details')}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-lg font-semibold text-slate-700">
                  {result.totalDays.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">{t('tools.ageCalculator.totalDays')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-lg font-semibold text-slate-700">
                  {result.totalWeeks.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">{t('tools.ageCalculator.totalWeeks')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-lg font-semibold text-slate-700">
                  {result.totalMonths.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">{t('tools.ageCalculator.totalMonths')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-lg font-semibold text-slate-700">
                  {result.totalHours.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">{t('tools.ageCalculator.totalHours')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-lg font-semibold text-slate-700">
                  {result.totalMinutes.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">{t('tools.ageCalculator.totalMinutes')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-lg font-semibold text-slate-700">
                  {result.dayOfWeek}
                </div>
                <div className="text-xs text-slate-500">{t('tools.ageCalculator.bornOn')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-1">
                {t('tools.ageCalculator.nextBirthday')}
              </div>
              <div className="text-2xl font-bold text-orange-500">
                {result.daysToNextBirthday} {t('tools.ageCalculator.days')}
              </div>
            </div>
          </div>
        </>
      )}

      {!result && birthDate && (
        <div className="card p-4 text-center text-slate-500">
          {t('tools.ageCalculator.invalidDate')}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.ageCalculator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.ageCalculator.tip1')}</li>
          <li>{t('tools.ageCalculator.tip2')}</li>
          <li>{t('tools.ageCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
