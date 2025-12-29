import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Timezone {
  id: string
  name: string
  offset: number
}

const timezones: Timezone[] = [
  { id: 'HST', name: 'Hawaii (HST)', offset: -10 },
  { id: 'PST', name: 'Los Angeles (PST)', offset: -8 },
  { id: 'MST', name: 'Denver (MST)', offset: -7 },
  { id: 'CST', name: 'Chicago (CST)', offset: -6 },
  { id: 'EST', name: 'New York (EST)', offset: -5 },
  { id: 'GMT', name: 'London (GMT)', offset: 0 },
  { id: 'CET', name: 'Paris/Berlin (CET)', offset: 1 },
  { id: 'GST', name: 'Dubai (GST)', offset: 4 },
  { id: 'IST', name: 'Mumbai (IST)', offset: 5.5 },
  { id: 'ICT', name: 'Bangkok (ICT)', offset: 7 },
  { id: 'CST_ASIA', name: 'Beijing/Taipei/HK (CST)', offset: 8 },
  { id: 'JST', name: 'Tokyo (JST)', offset: 9 },
  { id: 'KST', name: 'Seoul (KST)', offset: 9 },
  { id: 'AEST', name: 'Sydney (AEST)', offset: 10 },
  { id: 'NZST', name: 'Auckland (NZST)', offset: 12 },
]

export default function JetLagCalculator() {
  const { t } = useTranslation()
  const [homeTimezone, setHomeTimezone] = useState('EST')
  const [destTimezone, setDestTimezone] = useState('JST')
  const [travelDirection, setTravelDirection] = useState<'east' | 'west'>('east')
  const [arrivalTime, setArrivalTime] = useState('14:00')

  const getTimeDifference = () => {
    const home = timezones.find(tz => tz.id === homeTimezone)
    const dest = timezones.find(tz => tz.id === destTimezone)
    if (!home || !dest) return 0
    return dest.offset - home.offset
  }

  const timeDiff = getTimeDifference()
  const absTimeDiff = Math.abs(timeDiff)

  // Recovery time: approximately 1 day per hour of time difference
  // Eastward travel is generally harder to adjust to
  const getRecoveryDays = () => {
    const baseRecovery = absTimeDiff
    const direction = timeDiff > 0 ? 'east' : 'west'
    const multiplier = direction === 'east' ? 1.5 : 1
    return Math.ceil(baseRecovery * multiplier)
  }

  const recoveryDays = getRecoveryDays()

  const tips = [
    {
      title: t('tools.jetLagCalculator.tips.beforeFlight'),
      items: [
        t('tools.jetLagCalculator.tips.adjustSleep'),
        t('tools.jetLagCalculator.tips.stayHydrated'),
        t('tools.jetLagCalculator.tips.avoidAlcohol'),
      ],
    },
    {
      title: t('tools.jetLagCalculator.tips.duringFlight'),
      items: [
        t('tools.jetLagCalculator.tips.setWatch'),
        t('tools.jetLagCalculator.tips.sleepSchedule'),
        t('tools.jetLagCalculator.tips.moveAround'),
      ],
    },
    {
      title: t('tools.jetLagCalculator.tips.afterArrival'),
      items: [
        t('tools.jetLagCalculator.tips.getSunlight'),
        t('tools.jetLagCalculator.tips.avoidNaps'),
        t('tools.jetLagCalculator.tips.lightMeals'),
      ],
    },
  ]

  const getSeverity = () => {
    if (absTimeDiff <= 3) return { level: 'mild', color: 'green' }
    if (absTimeDiff <= 6) return { level: 'moderate', color: 'yellow' }
    if (absTimeDiff <= 9) return { level: 'significant', color: 'orange' }
    return { level: 'severe', color: 'red' }
  }

  const severity = getSeverity()

  const getOptimalSleepTime = () => {
    const arrivalHour = parseInt(arrivalTime.split(':')[0])
    const dest = timezones.find(tz => tz.id === destTimezone)
    if (!dest) return '22:00'

    // Suggest going to bed at local 22:00-23:00
    return '22:00'
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.jetLagCalculator.timezones')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-500 mb-1">{t('tools.jetLagCalculator.homeTimezone')}</label>
            <select
              value={homeTimezone}
              onChange={e => setHomeTimezone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {timezones.map(tz => (
                <option key={tz.id} value={tz.id}>{tz.name} (UTC{tz.offset >= 0 ? '+' : ''}{tz.offset})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-500 mb-1">{t('tools.jetLagCalculator.destTimezone')}</label>
            <select
              value={destTimezone}
              onChange={e => setDestTimezone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {timezones.map(tz => (
                <option key={tz.id} value={tz.id}>{tz.name} (UTC{tz.offset >= 0 ? '+' : ''}{tz.offset})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.jetLagCalculator.arrivalTime')}</h3>
        <input
          type="time"
          value={arrivalTime}
          onChange={e => setArrivalTime(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-6 text-center">
        <div className="text-sm text-slate-500 mb-2">{t('tools.jetLagCalculator.timeDifference')}</div>
        <div className="text-4xl font-bold mb-2">
          {timeDiff > 0 ? '+' : ''}{timeDiff} {t('tools.jetLagCalculator.hours')}
        </div>
        <div className={`inline-block px-3 py-1 rounded-full text-sm ${
          severity.color === 'green' ? 'bg-green-100 text-green-700' :
          severity.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
          severity.color === 'orange' ? 'bg-orange-100 text-orange-700' :
          'bg-red-100 text-red-700'
        }`}>
          {t(`tools.jetLagCalculator.severity.${severity.level}`)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">🌙</div>
          <div className="text-sm text-slate-500">{t('tools.jetLagCalculator.recoveryTime')}</div>
          <div className="font-bold text-lg">{recoveryDays} {t('tools.jetLagCalculator.days')}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">🛏️</div>
          <div className="text-sm text-slate-500">{t('tools.jetLagCalculator.suggestedBedtime')}</div>
          <div className="font-bold text-lg">{getOptimalSleepTime()}</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.jetLagCalculator.direction')}</h3>
        <div className={`p-3 rounded ${
          timeDiff > 0 ? 'bg-blue-50' : timeDiff < 0 ? 'bg-orange-50' : 'bg-slate-50'
        }`}>
          <div className="font-medium">
            {timeDiff > 0 ? '→ Traveling East' : timeDiff < 0 ? '← Traveling West' : 'Same Timezone'}
          </div>
          <div className="text-sm text-slate-600 mt-1">
            {timeDiff > 0
              ? t('tools.jetLagCalculator.eastwardInfo')
              : timeDiff < 0
              ? t('tools.jetLagCalculator.westwardInfo')
              : t('tools.jetLagCalculator.noJetLag')}
          </div>
        </div>
      </div>

      {tips.map((section, idx) => (
        <div key={idx} className="card p-4">
          <h3 className="font-medium mb-3">{section.title}</h3>
          <ul className="space-y-2">
            {section.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
