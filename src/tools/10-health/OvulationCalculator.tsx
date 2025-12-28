import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function OvulationCalculator() {
  const { t } = useTranslation()
  const [lastPeriod, setLastPeriod] = useState('')
  const [cycleLength, setCycleLength] = useState(28)
  const [result, setResult] = useState<{
    ovulationDate: Date
    fertileStart: Date
    fertileEnd: Date
    nextPeriod: Date
  } | null>(null)

  const calculate = () => {
    if (!lastPeriod) return

    const lmp = new Date(lastPeriod)

    const ovulationDate = new Date(lmp)
    ovulationDate.setDate(ovulationDate.getDate() + cycleLength - 14)

    const fertileStart = new Date(ovulationDate)
    fertileStart.setDate(fertileStart.getDate() - 5)

    const fertileEnd = new Date(ovulationDate)
    fertileEnd.setDate(fertileEnd.getDate() + 1)

    const nextPeriod = new Date(lmp)
    nextPeriod.setDate(nextPeriod.getDate() + cycleLength)

    setResult({
      ovulationDate,
      fertileStart,
      fertileEnd,
      nextPeriod,
    })
  }

  const generateCalendar = () => {
    if (!result || !lastPeriod) return []

    const lmp = new Date(lastPeriod)
    const days: { date: Date; type: string }[] = []

    for (let i = 0; i < cycleLength; i++) {
      const date = new Date(lmp)
      date.setDate(date.getDate() + i)

      let type = 'normal'
      if (i < 5) type = 'period'
      else if (date >= result.fertileStart && date <= result.fertileEnd) {
        if (date.toDateString() === result.ovulationDate.toDateString()) {
          type = 'ovulation'
        } else {
          type = 'fertile'
        }
      }

      days.push({ date, type })
    }

    return days
  }

  const calendar = generateCalendar()

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.ovulationCalculator.lastPeriod')}
          </label>
          <input
            type="date"
            value={lastPeriod}
            onChange={(e) => setLastPeriod(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.ovulationCalculator.cycleLength')}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={21}
              max={35}
              value={cycleLength}
              onChange={(e) => setCycleLength(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium w-16">{cycleLength} {t('tools.ovulationCalculator.days')}</span>
          </div>
        </div>

        <button
          onClick={calculate}
          disabled={!lastPeriod}
          className="w-full py-2 bg-pink-500 text-white rounded font-medium disabled:opacity-50"
        >
          {t('tools.ovulationCalculator.calculate')}
        </button>
      </div>

      {result && (
        <>
          <div className="card p-4 bg-pink-50">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm text-slate-600">{t('tools.ovulationCalculator.ovulationDate')}</div>
                <div className="text-lg font-bold text-pink-600">
                  {result.ovulationDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-600">{t('tools.ovulationCalculator.nextPeriod')}</div>
                <div className="text-lg font-bold text-red-600">
                  {result.nextPeriod.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.ovulationCalculator.fertileWindow')}
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
              <span className="text-lg font-bold text-green-600">
                {result.fertileStart.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                {' - '}
                {result.fertileEnd.toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.ovulationCalculator.cycleCalendar')}</h3>
            <div className="grid grid-cols-7 gap-1">
              {calendar.map((day, i) => (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center text-xs rounded ${
                    day.type === 'period' ? 'bg-red-200 text-red-800' :
                    day.type === 'ovulation' ? 'bg-pink-500 text-white font-bold' :
                    day.type === 'fertile' ? 'bg-green-200 text-green-800' :
                    'bg-slate-100'
                  }`}
                >
                  {day.date.getDate()}
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-200 rounded" />
                <span>{t('tools.ovulationCalculator.period')}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-200 rounded" />
                <span>{t('tools.ovulationCalculator.fertile')}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-pink-500 rounded" />
                <span>{t('tools.ovulationCalculator.ovulation')}</span>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card p-4 bg-yellow-50">
        <p className="text-xs text-slate-600">
          {t('tools.ovulationCalculator.disclaimer')}
        </p>
      </div>
    </div>
  )
}
