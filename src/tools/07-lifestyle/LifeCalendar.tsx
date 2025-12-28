import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function LifeCalendar() {
  const { t } = useTranslation()
  const [birthDate, setBirthDate] = useState('')
  const [lifeExpectancy, setLifeExpectancy] = useState(80)
  const [viewMode, setViewMode] = useState<'years' | 'months' | 'weeks'>('years')

  const stats = useMemo(() => {
    if (!birthDate) return null

    const birth = new Date(birthDate)
    const today = new Date()
    const ageMs = today.getTime() - birth.getTime()
    const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000)
    const ageMonths = ageYears * 12
    const ageWeeks = ageYears * 52

    const remainingYears = Math.max(0, lifeExpectancy - ageYears)
    const remainingMonths = remainingYears * 12
    const remainingWeeks = remainingYears * 52
    const remainingDays = remainingYears * 365

    const percentLived = Math.min((ageYears / lifeExpectancy) * 100, 100)

    return {
      ageYears: Math.floor(ageYears),
      ageMonths: Math.floor(ageMonths),
      ageWeeks: Math.floor(ageWeeks),
      remainingYears: Math.floor(remainingYears),
      remainingMonths: Math.floor(remainingMonths),
      remainingWeeks: Math.floor(remainingWeeks),
      remainingDays: Math.floor(remainingDays),
      percentLived: Math.round(percentLived),
      totalYears: lifeExpectancy,
      totalMonths: lifeExpectancy * 12,
      totalWeeks: lifeExpectancy * 52,
    }
  }, [birthDate, lifeExpectancy])

  const renderGrid = () => {
    if (!stats) return null

    let total: number
    let lived: number
    let cellSize: string

    switch (viewMode) {
      case 'years':
        total = stats.totalYears
        lived = stats.ageYears
        cellSize = 'w-6 h-6'
        break
      case 'months':
        total = stats.totalMonths
        lived = stats.ageMonths
        cellSize = 'w-4 h-4'
        break
      case 'weeks':
        total = stats.totalWeeks
        lived = stats.ageWeeks
        cellSize = 'w-2 h-2'
        break
    }

    const cells = []
    for (let i = 0; i < total; i++) {
      const isLived = i < lived
      cells.push(
        <div
          key={i}
          className={`${cellSize} rounded-sm ${
            isLived ? 'bg-blue-500' : 'bg-slate-200'
          }`}
          title={`${viewMode.slice(0, -1)} ${i + 1}`}
        />
      )
    }

    return (
      <div
        className="flex flex-wrap gap-0.5"
        style={{ maxWidth: viewMode === 'weeks' ? '100%' : 'auto' }}
      >
        {cells}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.lifeCalendar.settings')}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.lifeCalendar.birthDate')}
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
              {t('tools.lifeCalendar.lifeExpectancy')}
            </label>
            <select
              value={lifeExpectancy}
              onChange={(e) => setLifeExpectancy(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              {[70, 75, 80, 85, 90, 95, 100].map(age => (
                <option key={age} value={age}>{age} years</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {stats && (
        <>
          <div className="card p-4">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-blue-600 mb-1">
                {stats.percentLived}%
              </div>
              <div className="text-slate-500">
                {t('tools.lifeCalendar.ofLifeLived')}
              </div>
            </div>

            <div className="h-4 bg-slate-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${stats.percentLived}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{stats.ageYears}</div>
                <div className="text-xs text-slate-500">{t('tools.lifeCalendar.yearsLived')}</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{stats.remainingYears}</div>
                <div className="text-xs text-slate-500">{t('tools.lifeCalendar.yearsRemaining')}</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.lifeCalendar.timeRemaining')}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-xl font-bold text-slate-700">{stats.remainingYears}</div>
                <div className="text-xs text-slate-500">{t('tools.lifeCalendar.years')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-xl font-bold text-slate-700">{stats.remainingMonths}</div>
                <div className="text-xs text-slate-500">{t('tools.lifeCalendar.months')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-xl font-bold text-slate-700">{stats.remainingWeeks}</div>
                <div className="text-xs text-slate-500">{t('tools.lifeCalendar.weeks')}</div>
              </div>
            </div>
            <div className="text-center mt-3 p-3 bg-yellow-50 rounded">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.remainingDays.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">{t('tools.lifeCalendar.daysRemaining')}</div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-slate-700">
                {t('tools.lifeCalendar.visualization')}
              </h3>
              <div className="flex gap-1">
                {(['years', 'months', 'weeks'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 rounded text-xs ${
                      viewMode === mode ? 'bg-blue-500 text-white' : 'bg-slate-100'
                    }`}
                  >
                    {t(`tools.lifeCalendar.${mode}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              {renderGrid()}
            </div>

            <div className="flex gap-4 mt-3 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                <span>{t('tools.lifeCalendar.lived')}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-slate-200 rounded-sm"></div>
                <span>{t('tools.lifeCalendar.remaining')}</span>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.lifeCalendar.reflection')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.lifeCalendar.tip1')}</li>
          <li>{t('tools.lifeCalendar.tip2')}</li>
          <li>{t('tools.lifeCalendar.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
