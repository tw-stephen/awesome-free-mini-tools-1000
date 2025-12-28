import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function PregnancyCalculator() {
  const { t } = useTranslation()
  const [lastPeriod, setLastPeriod] = useState('')
  const [cycleLength, setCycleLength] = useState(28)
  const [result, setResult] = useState<{
    dueDate: Date
    currentWeek: number
    trimester: number
    daysUntilDue: number
    conception: Date
  } | null>(null)

  const calculate = () => {
    if (!lastPeriod) return

    const lmp = new Date(lastPeriod)
    const dueDate = new Date(lmp)
    dueDate.setDate(dueDate.getDate() + 280 + (cycleLength - 28))

    const today = new Date()
    const daysSinceLMP = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24))
    const currentWeek = Math.floor(daysSinceLMP / 7)
    const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    const conception = new Date(lmp)
    conception.setDate(conception.getDate() + 14 + (cycleLength - 28))

    let trimester = 1
    if (currentWeek >= 13 && currentWeek < 27) trimester = 2
    else if (currentWeek >= 27) trimester = 3

    setResult({
      dueDate,
      currentWeek: Math.max(0, currentWeek),
      trimester,
      daysUntilDue: Math.max(0, daysUntilDue),
      conception,
    })
  }

  const milestones = [
    { week: 4, event: t('tools.pregnancyCalculator.milestone4') },
    { week: 8, event: t('tools.pregnancyCalculator.milestone8') },
    { week: 12, event: t('tools.pregnancyCalculator.milestone12') },
    { week: 16, event: t('tools.pregnancyCalculator.milestone16') },
    { week: 20, event: t('tools.pregnancyCalculator.milestone20') },
    { week: 24, event: t('tools.pregnancyCalculator.milestone24') },
    { week: 28, event: t('tools.pregnancyCalculator.milestone28') },
    { week: 32, event: t('tools.pregnancyCalculator.milestone32') },
    { week: 36, event: t('tools.pregnancyCalculator.milestone36') },
    { week: 40, event: t('tools.pregnancyCalculator.milestone40') },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.pregnancyCalculator.lastPeriod')}
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
            {t('tools.pregnancyCalculator.cycleLength')}
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
            <span className="text-sm font-medium w-16">{cycleLength} {t('tools.pregnancyCalculator.days')}</span>
          </div>
        </div>

        <button
          onClick={calculate}
          disabled={!lastPeriod}
          className="w-full py-2 bg-pink-500 text-white rounded font-medium disabled:opacity-50"
        >
          {t('tools.pregnancyCalculator.calculate')}
        </button>
      </div>

      {result && (
        <>
          <div className="card p-6 text-center bg-pink-50">
            <div className="text-sm text-slate-600">{t('tools.pregnancyCalculator.dueDate')}</div>
            <div className="text-3xl font-bold text-pink-600">
              {result.dueDate.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="text-sm text-slate-500 mt-2">
              {result.daysUntilDue} {t('tools.pregnancyCalculator.daysRemaining')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">{result.currentWeek}</div>
              <div className="text-xs text-slate-500">{t('tools.pregnancyCalculator.weeks')}</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">{result.trimester}</div>
              <div className="text-xs text-slate-500">{t('tools.pregnancyCalculator.trimester')}</div>
            </div>
          </div>

          <div className="card p-4">
            <div className="text-sm text-slate-600 mb-2">{t('tools.pregnancyCalculator.progress')}</div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-500 rounded-full"
                style={{ width: `${Math.min(100, (result.currentWeek / 40) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0w</span>
              <span>13w</span>
              <span>27w</span>
              <span>40w</span>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.pregnancyCalculator.conception')}
            </h3>
            <p className="text-slate-600">
              ~{result.conception.toLocaleDateString()}
            </p>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.pregnancyCalculator.milestones')}</h3>
            <div className="space-y-2">
              {milestones.map(m => (
                <div
                  key={m.week}
                  className={`flex items-center gap-2 p-2 rounded ${
                    result.currentWeek >= m.week ? 'bg-green-50' : 'bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    result.currentWeek >= m.week ? 'bg-green-500 text-white' : 'bg-slate-300'
                  }`}>
                    {result.currentWeek >= m.week ? '✓' : m.week}
                  </div>
                  <span className="text-sm">{m.event}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="card p-4 bg-yellow-50">
        <p className="text-xs text-slate-600">
          {t('tools.pregnancyCalculator.disclaimer')}
        </p>
      </div>
    </div>
  )
}
