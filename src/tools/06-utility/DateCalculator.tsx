import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function DateCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'difference' | 'add'>('difference')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState('')
  const [addDays, setAddDays] = useState(0)
  const [addMonths, setAddMonths] = useState(0)
  const [addYears, setAddYears] = useState(0)
  const [excludeWeekends, setExcludeWeekends] = useState(false)

  const differenceResult = useMemo(() => {
    if (!startDate || !endDate) return null

    const start = new Date(startDate)
    const end = new Date(endDate)

    const diffTime = end.getTime() - start.getTime()
    let totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const isNegative = totalDays < 0
    totalDays = Math.abs(totalDays)

    let businessDays = 0
    let weekendDays = 0
    const current = new Date(start)
    const endTime = end.getTime()

    while (current.getTime() <= endTime) {
      const dayOfWeek = current.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendDays++
      } else {
        businessDays++
      }
      current.setDate(current.getDate() + 1)
    }

    const weeks = Math.floor(totalDays / 7)
    const remainingDays = totalDays % 7

    let years = Math.floor(totalDays / 365)
    let months = Math.floor((totalDays % 365) / 30)
    let days = totalDays % 365 % 30

    return {
      totalDays,
      weeks,
      remainingDays,
      businessDays,
      weekendDays,
      years,
      months,
      days,
      isNegative,
    }
  }, [startDate, endDate])

  const addResult = useMemo(() => {
    if (!startDate) return null

    const start = new Date(startDate)
    let result = new Date(start)

    result.setFullYear(result.getFullYear() + addYears)
    result.setMonth(result.getMonth() + addMonths)

    if (excludeWeekends && addDays !== 0) {
      let daysToAdd = Math.abs(addDays)
      const direction = addDays > 0 ? 1 : -1

      while (daysToAdd > 0) {
        result.setDate(result.getDate() + direction)
        const dayOfWeek = result.getDay()
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          daysToAdd--
        }
      }
    } else {
      result.setDate(result.getDate() + addDays)
    }

    const dayName = result.toLocaleDateString('en-US', { weekday: 'long' })

    return {
      date: result.toISOString().split('T')[0],
      formatted: result.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      dayName,
    }
  }, [startDate, addDays, addMonths, addYears, excludeWeekends])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('difference')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium ${
              mode === 'difference' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.dateCalculator.difference')}
          </button>
          <button
            onClick={() => setMode('add')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium ${
              mode === 'add' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.dateCalculator.addSubtract')}
          </button>
        </div>

        {mode === 'difference' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.dateCalculator.startDate')}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.dateCalculator.endDate')}
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.dateCalculator.startDate')}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.dateCalculator.years')}
                </label>
                <input
                  type="number"
                  value={addYears}
                  onChange={(e) => setAddYears(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.dateCalculator.months')}
                </label>
                <input
                  type="number"
                  value={addMonths}
                  onChange={(e) => setAddMonths(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.dateCalculator.days')}
                </label>
                <input
                  type="number"
                  value={addDays}
                  onChange={(e) => setAddDays(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={excludeWeekends}
                onChange={(e) => setExcludeWeekends(e.target.checked)}
              />
              {t('tools.dateCalculator.excludeWeekends')}
            </label>
          </div>
        )}
      </div>

      {mode === 'difference' && differenceResult && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">
            {t('tools.dateCalculator.result')}
          </h3>

          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-blue-600">
              {differenceResult.isNegative && '-'}{differenceResult.totalDays}
            </div>
            <div className="text-sm text-slate-600">{t('tools.dateCalculator.totalDays')}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded text-center">
              <div className="font-semibold">{differenceResult.weeks} {t('tools.dateCalculator.weeks')}</div>
              <div className="text-xs text-slate-500">
                {differenceResult.remainingDays} {t('tools.dateCalculator.days')}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded text-center">
              <div className="font-semibold">
                {differenceResult.years}y {differenceResult.months}m {differenceResult.days}d
              </div>
              <div className="text-xs text-slate-500">{t('tools.dateCalculator.approximate')}</div>
            </div>
            <div className="p-3 bg-green-50 rounded text-center">
              <div className="font-semibold text-green-600">{differenceResult.businessDays}</div>
              <div className="text-xs text-slate-500">{t('tools.dateCalculator.businessDays')}</div>
            </div>
            <div className="p-3 bg-orange-50 rounded text-center">
              <div className="font-semibold text-orange-600">{differenceResult.weekendDays}</div>
              <div className="text-xs text-slate-500">{t('tools.dateCalculator.weekendDays')}</div>
            </div>
          </div>
        </div>
      )}

      {mode === 'add' && addResult && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">
            {t('tools.dateCalculator.result')}
          </h3>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {addResult.formatted}
            </div>
            <div className="text-sm text-slate-500">
              {addResult.date}
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.dateCalculator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.dateCalculator.tip1')}</li>
          <li>{t('tools.dateCalculator.tip2')}</li>
          <li>{t('tools.dateCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
