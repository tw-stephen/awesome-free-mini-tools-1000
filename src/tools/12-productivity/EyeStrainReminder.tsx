import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface EyeBreakLog {
  date: string
  breaks: number
}

export default function EyeStrainReminder() {
  const { t } = useTranslation()
  const [interval, setIntervalTime] = useState(20) // 20-20-20 rule
  const [lookAwayTime, setLookAwayTime] = useState(20) // seconds
  const [distance, setDistance] = useState(20) // feet
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isBreaking, setIsBreaking] = useState(false)
  const [breaksTaken, setBreaksTaken] = useState(0)
  const [logs, setLogs] = useState<EyeBreakLog[]>([])
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('eye-break-logs')
    if (saved) setLogs(JSON.parse(saved))

    const today = new Date().toISOString().split('T')[0]
    const savedBreaks = localStorage.getItem(`eye-breaks-${today}`)
    if (savedBreaks) setBreaksTaken(parseInt(savedBreaks))
  }, [])

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      if (isBreaking) {
        endBreak()
      } else {
        startBreak()
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isActive, timeLeft, isBreaking])

  const playSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gainNode.gain.value = 0.2

      oscillator.start()
      setTimeout(() => oscillator.stop(), 200)
    } catch {
      // Audio not supported
    }
  }

  const startBreak = () => {
    playSound()
    setIsBreaking(true)
    setTimeLeft(lookAwayTime)
  }

  const endBreak = () => {
    playSound()
    setIsBreaking(false)
    setTimeLeft(interval * 60)

    // Log the break
    const today = new Date().toISOString().split('T')[0]
    const newBreaks = breaksTaken + 1
    setBreaksTaken(newBreaks)
    localStorage.setItem(`eye-breaks-${today}`, newBreaks.toString())

    const existing = logs.find(l => l.date === today)
    let updated: EyeBreakLog[]
    if (existing) {
      updated = logs.map(l => l.date === today ? { ...l, breaks: newBreaks } : l)
    } else {
      updated = [...logs, { date: today, breaks: newBreaks }]
    }
    setLogs(updated)
    localStorage.setItem('eye-break-logs', JSON.stringify(updated))
  }

  const start = () => {
    setIsActive(true)
    setIsBreaking(false)
    setTimeLeft(interval * 60)
  }

  const stop = () => {
    setIsActive(false)
    setIsBreaking(false)
    setTimeLeft(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return isBreaking
      ? secs.toString()
      : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    const total = isBreaking ? lookAwayTime : interval * 60
    return ((total - timeLeft) / total) * 100
  }

  const getWeekStats = () => {
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    return logs
      .filter(l => new Date(l.date) >= weekAgo)
      .reduce((sum, l) => sum + l.breaks, 0)
  }

  return (
    <div className="space-y-4">
      <div className={`card p-6 text-center ${isBreaking ? 'bg-green-50' : ''}`}>
        {isBreaking && (
          <div className="text-lg font-medium text-green-600 mb-2 animate-pulse">
            {t('tools.eyeStrainReminder.lookAway')}
          </div>
        )}

        <div className="relative w-48 h-48 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-200"
            />
            {isActive && (
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className={isBreaking ? 'text-green-500' : 'text-blue-500'}
                strokeDasharray={553}
                strokeDashoffset={553 - (553 * getProgress()) / 100}
                strokeLinecap="round"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl mb-2">
              {isBreaking ? '👀' : isActive ? '💻' : '👁️'}
            </div>
            <div className={`font-mono font-bold ${isBreaking ? 'text-5xl text-green-600' : 'text-3xl'}`}>
              {formatTime(timeLeft)}
            </div>
            {isBreaking && (
              <div className="text-sm text-green-600 mt-1">
                {t('tools.eyeStrainReminder.lookAtFeet', { distance })}
              </div>
            )}
          </div>
        </div>

        {!isActive ? (
          <div className="space-y-4">
            <div className="card p-4 bg-blue-50">
              <h3 className="font-medium mb-2">{t('tools.eyeStrainReminder.rule2020')}</h3>
              <p className="text-sm text-slate-600">
                {t('tools.eyeStrainReminder.ruleExplanation')}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-slate-600 block mb-1">
                  {t('tools.eyeStrainReminder.interval')}
                </label>
                <select
                  value={interval}
                  onChange={(e) => setIntervalTime(parseInt(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                >
                  {[10, 15, 20, 30, 45].map(m => (
                    <option key={m} value={m}>{m} min</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">
                  {t('tools.eyeStrainReminder.lookAwayTime')}
                </label>
                <select
                  value={lookAwayTime}
                  onChange={(e) => setLookAwayTime(parseInt(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                >
                  {[10, 20, 30, 45, 60].map(s => (
                    <option key={s} value={s}>{s} sec</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">
                  {t('tools.eyeStrainReminder.distance')}
                </label>
                <select
                  value={distance}
                  onChange={(e) => setDistance(parseInt(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                >
                  {[10, 15, 20, 25, 30].map(f => (
                    <option key={f} value={f}>{f} ft</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={start}
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium"
            >
              {t('tools.eyeStrainReminder.start')}
            </button>
          </div>
        ) : (
          <div className="flex justify-center gap-2">
            {isBreaking && (
              <button
                onClick={endBreak}
                className="px-6 py-2 bg-green-500 text-white rounded-lg"
              >
                {t('tools.eyeStrainReminder.done')}
              </button>
            )}
            <button
              onClick={stop}
              className="px-6 py-2 bg-slate-200 rounded-lg"
            >
              {t('tools.eyeStrainReminder.stop')}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{breaksTaken}</div>
          <div className="text-sm text-slate-500">{t('tools.eyeStrainReminder.breaksToday')}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{getWeekStats()}</div>
          <div className="text-sm text-slate-500">{t('tools.eyeStrainReminder.breaksWeek')}</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.eyeStrainReminder.exercises')}</h3>
        <div className="space-y-2">
          <div className="p-2 bg-slate-50 rounded text-sm">
            <strong>{t('tools.eyeStrainReminder.exercise1Title')}</strong>
            <p className="text-slate-600">{t('tools.eyeStrainReminder.exercise1Desc')}</p>
          </div>
          <div className="p-2 bg-slate-50 rounded text-sm">
            <strong>{t('tools.eyeStrainReminder.exercise2Title')}</strong>
            <p className="text-slate-600">{t('tools.eyeStrainReminder.exercise2Desc')}</p>
          </div>
          <div className="p-2 bg-slate-50 rounded text-sm">
            <strong>{t('tools.eyeStrainReminder.exercise3Title')}</strong>
            <p className="text-slate-600">{t('tools.eyeStrainReminder.exercise3Desc')}</p>
          </div>
        </div>
      </div>

      <div className="card p-4 bg-yellow-50">
        <h3 className="font-medium mb-2">{t('tools.eyeStrainReminder.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>- {t('tools.eyeStrainReminder.tip1')}</li>
          <li>- {t('tools.eyeStrainReminder.tip2')}</li>
          <li>- {t('tools.eyeStrainReminder.tip3')}</li>
          <li>- {t('tools.eyeStrainReminder.tip4')}</li>
        </ul>
      </div>
    </div>
  )
}
