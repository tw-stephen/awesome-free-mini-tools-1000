import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function MoonPhaseCalculator() {
  const { t } = useTranslation()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const calculateMoonPhase = (dateStr: string) => {
    const d = new Date(dateStr)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()

    // Calculate Julian date
    let jy = year
    let jm = month
    if (month <= 2) {
      jy = year - 1
      jm = month + 12
    }

    const jd = Math.floor(365.25 * (jy + 4716)) + Math.floor(30.6001 * (jm + 1)) + day - 1524.5

    // Calculate moon age in days (synodic month is ~29.53 days)
    const synodicMonth = 29.530588853
    const newMoon = 2451550.1 // Known new moon date in Julian
    const moonAge = ((jd - newMoon) % synodicMonth + synodicMonth) % synodicMonth

    // Determine phase
    const phaseNumber = Math.floor((moonAge / synodicMonth) * 8) % 8
    const illumination = (1 - Math.cos(2 * Math.PI * moonAge / synodicMonth)) / 2 * 100

    const phases = [
      { name: t('tools.moonPhaseCalculator.newMoon'), emoji: 'o' },
      { name: t('tools.moonPhaseCalculator.waxingCrescent'), emoji: ')' },
      { name: t('tools.moonPhaseCalculator.firstQuarter'), emoji: 'D' },
      { name: t('tools.moonPhaseCalculator.waxingGibbous'), emoji: ')' },
      { name: t('tools.moonPhaseCalculator.fullMoon'), emoji: 'O' },
      { name: t('tools.moonPhaseCalculator.waningGibbous'), emoji: '(' },
      { name: t('tools.moonPhaseCalculator.lastQuarter'), emoji: 'C' },
      { name: t('tools.moonPhaseCalculator.waningCrescent'), emoji: '(' },
    ]

    // Calculate next phases
    const getNextPhase = (targetPhase: number) => {
      const daysPerPhase = synodicMonth / 8
      let daysUntil = ((targetPhase - phaseNumber + 8) % 8) * daysPerPhase
      if (daysUntil === 0) daysUntil = synodicMonth
      const nextDate = new Date(d.getTime() + daysUntil * 24 * 60 * 60 * 1000)
      return nextDate.toLocaleDateString()
    }

    return {
      phase: phases[phaseNumber],
      moonAge: moonAge.toFixed(1),
      illumination: illumination.toFixed(1),
      phaseNumber,
      nextNewMoon: getNextPhase(0),
      nextFirstQuarter: getNextPhase(2),
      nextFullMoon: getNextPhase(4),
      nextLastQuarter: getNextPhase(6),
    }
  }

  const moonData = calculateMoonPhase(date)

  const getMoonVisual = () => {
    const { phaseNumber } = moonData
    // Create a simple SVG moon visualization
    const illumination = parseFloat(moonData.illumination)
    const isWaxing = phaseNumber < 4

    return (
      <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto">
        <circle cx="50" cy="50" r="45" fill="#1a1a2e" />
        {illumination > 0 && (
          <ellipse
            cx="50"
            cy="50"
            rx={Math.abs(50 - illumination) * 0.9}
            ry="45"
            fill={isWaxing ? '#fef08a' : '#1a1a2e'}
          />
        )}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#fef08a"
          strokeWidth="2"
        />
        {isWaxing ? (
          <path
            d={`M 50 5 A 45 45 0 0 1 50 95 A ${45 * (1 - illumination / 50)} 45 0 0 ${illumination < 50 ? 0 : 1} 50 5`}
            fill="#fef08a"
          />
        ) : (
          <path
            d={`M 50 5 A 45 45 0 0 0 50 95 A ${45 * (1 - (100 - illumination) / 50)} 45 0 0 ${illumination > 50 ? 0 : 1} 50 5`}
            fill="#fef08a"
          />
        )}
      </svg>
    )
  }

  const getMonthPhases = () => {
    const d = new Date(date)
    const phases = []
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(d.getFullYear(), d.getMonth(), i + 1)
      const data = calculateMoonPhase(checkDate.toISOString().split('T')[0])
      phases.push({
        day: i + 1,
        phase: data.phaseNumber,
        illumination: parseFloat(data.illumination),
      })
    }
    return phases
  }

  const monthPhases = getMonthPhases()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.moonPhaseCalculator.selectDate')}</h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-6 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="mb-4">
            {getMoonVisual()}
          </div>
          <div className="text-2xl font-bold text-yellow-200 mb-2">{moonData.phase.name}</div>
          <div className="text-slate-300">
            {moonData.illumination}% {t('tools.moonPhaseCalculator.illuminated')}
          </div>
          <div className="text-slate-400 text-sm mt-1">
            {t('tools.moonPhaseCalculator.moonAge')}: {moonData.moonAge} {t('tools.moonPhaseCalculator.days')}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.moonPhaseCalculator.upcomingPhases')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-900 rounded text-center">
            <div className="text-2xl mb-1">o</div>
            <div className="text-xs text-slate-400">{t('tools.moonPhaseCalculator.newMoon')}</div>
            <div className="text-sm text-white">{moonData.nextNewMoon}</div>
          </div>
          <div className="p-3 bg-slate-900 rounded text-center">
            <div className="text-2xl mb-1 text-yellow-200">D</div>
            <div className="text-xs text-slate-400">{t('tools.moonPhaseCalculator.firstQuarter')}</div>
            <div className="text-sm text-white">{moonData.nextFirstQuarter}</div>
          </div>
          <div className="p-3 bg-slate-900 rounded text-center">
            <div className="text-2xl mb-1 text-yellow-200">O</div>
            <div className="text-xs text-slate-400">{t('tools.moonPhaseCalculator.fullMoon')}</div>
            <div className="text-sm text-white">{moonData.nextFullMoon}</div>
          </div>
          <div className="p-3 bg-slate-900 rounded text-center">
            <div className="text-2xl mb-1 text-yellow-200">C</div>
            <div className="text-xs text-slate-400">{t('tools.moonPhaseCalculator.lastQuarter')}</div>
            <div className="text-sm text-white">{moonData.nextLastQuarter}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.moonPhaseCalculator.monthOverview')}</h3>
        <div className="flex flex-wrap gap-1">
          {monthPhases.map((p, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded flex items-center justify-center text-xs ${
                p.day === new Date(date).getDate() ? 'ring-2 ring-blue-400' : ''
              }`}
              style={{
                backgroundColor: `rgba(254, 240, 138, ${p.illumination / 100})`,
                color: p.illumination > 50 ? '#1e293b' : '#fef08a',
              }}
              title={`Day ${p.day}: ${p.illumination.toFixed(0)}%`}
            >
              {p.day}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.moonPhaseCalculator.moonFacts')}</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.moonPhaseCalculator.fact1')}</li>
          <li>{t('tools.moonPhaseCalculator.fact2')}</li>
          <li>{t('tools.moonPhaseCalculator.fact3')}</li>
        </ul>
      </div>
    </div>
  )
}
