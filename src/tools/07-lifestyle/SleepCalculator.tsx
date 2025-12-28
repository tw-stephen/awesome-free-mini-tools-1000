import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function SleepCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'wakeUp' | 'bedtime'>('wakeUp')
  const [wakeUpTime, setWakeUpTime] = useState('07:00')
  const [bedtime, setBedtime] = useState('23:00')

  const SLEEP_CYCLE = 90 // minutes
  const FALL_ASLEEP_TIME = 15 // minutes

  const recommendations = useMemo(() => {
    const times: string[] = []

    if (mode === 'wakeUp') {
      // Calculate when to sleep to wake up at the given time
      const [hours, mins] = wakeUpTime.split(':').map(Number)
      const wakeDate = new Date()
      wakeDate.setHours(hours, mins, 0, 0)

      // Calculate 6 sleep cycles backwards
      for (let cycles = 6; cycles >= 3; cycles--) {
        const sleepTime = new Date(wakeDate.getTime() - (cycles * SLEEP_CYCLE + FALL_ASLEEP_TIME) * 60000)
        times.push(sleepTime.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false }))
      }
    } else {
      // Calculate when to wake up based on bedtime
      const [hours, mins] = bedtime.split(':').map(Number)
      const sleepDate = new Date()
      sleepDate.setHours(hours, mins, 0, 0)

      // Add fall asleep time
      sleepDate.setMinutes(sleepDate.getMinutes() + FALL_ASLEEP_TIME)

      // Calculate 6 sleep cycles forward
      for (let cycles = 3; cycles <= 6; cycles++) {
        const wakeTime = new Date(sleepDate.getTime() + cycles * SLEEP_CYCLE * 60000)
        times.push(wakeTime.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false }))
      }
    }

    return times
  }, [mode, wakeUpTime, bedtime])

  const getSleepHours = (index: number) => {
    const cycles = mode === 'wakeUp' ? 6 - index : 3 + index
    const hours = (cycles * SLEEP_CYCLE) / 60
    return hours.toFixed(1)
  }

  const getQuality = (index: number) => {
    const cycles = mode === 'wakeUp' ? 6 - index : 3 + index
    if (cycles >= 5) return { label: t('tools.sleepCalculator.optimal'), color: 'text-green-600 bg-green-100' }
    if (cycles >= 4) return { label: t('tools.sleepCalculator.good'), color: 'text-blue-600 bg-blue-100' }
    return { label: t('tools.sleepCalculator.minimum'), color: 'text-yellow-600 bg-yellow-100' }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('wakeUp')}
            className={`flex-1 py-3 rounded font-medium ${
              mode === 'wakeUp' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.sleepCalculator.wakeUpAt')}
          </button>
          <button
            onClick={() => setMode('bedtime')}
            className={`flex-1 py-3 rounded font-medium ${
              mode === 'bedtime' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.sleepCalculator.goToBedAt')}
          </button>
        </div>

        <div className="text-center">
          <label className="block text-sm text-slate-500 mb-2">
            {mode === 'wakeUp'
              ? t('tools.sleepCalculator.whatTimeWakeUp')
              : t('tools.sleepCalculator.whatTimeBed')
            }
          </label>
          <input
            type="time"
            value={mode === 'wakeUp' ? wakeUpTime : bedtime}
            onChange={(e) => mode === 'wakeUp' ? setWakeUpTime(e.target.value) : setBedtime(e.target.value)}
            className="text-4xl font-bold text-center border-none bg-transparent"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {mode === 'wakeUp'
            ? t('tools.sleepCalculator.shouldSleepAt')
            : t('tools.sleepCalculator.shouldWakeAt')
          }
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {recommendations.map((time, i) => {
            const quality = getQuality(i)
            return (
              <div
                key={i}
                className="p-4 border border-slate-200 rounded-lg text-center"
              >
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  {time}
                </div>
                <div className="text-sm text-slate-500 mb-2">
                  {getSleepHours(i)} {t('tools.sleepCalculator.hours')}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${quality.color}`}>
                  {quality.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.sleepCalculator.sleepCycles')}
        </h3>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span>{t('tools.sleepCalculator.oneCycle')}</span>
            <span className="font-mono">90 min</span>
          </div>
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span>{t('tools.sleepCalculator.fallAsleep')}</span>
            <span className="font-mono">~15 min</span>
          </div>
          <div className="flex justify-between p-2 bg-green-50 rounded">
            <span>{t('tools.sleepCalculator.recommendedCycles')}</span>
            <span className="font-mono">5-6 (7.5-9h)</span>
          </div>
          <div className="flex justify-between p-2 bg-yellow-50 rounded">
            <span>{t('tools.sleepCalculator.minimumCycles')}</span>
            <span className="font-mono">3-4 (4.5-6h)</span>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.sleepCalculator.ageRecommendations')}
        </h3>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span>{t('tools.sleepCalculator.teenager')}</span>
            <span className="font-mono">8-10 hours</span>
          </div>
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span>{t('tools.sleepCalculator.adult')}</span>
            <span className="font-mono">7-9 hours</span>
          </div>
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span>{t('tools.sleepCalculator.senior')}</span>
            <span className="font-mono">7-8 hours</span>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.sleepCalculator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.sleepCalculator.tip1')}</li>
          <li>{t('tools.sleepCalculator.tip2')}</li>
          <li>{t('tools.sleepCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
