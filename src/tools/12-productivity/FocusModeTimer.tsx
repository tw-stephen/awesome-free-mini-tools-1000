import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface FocusSession {
  date: string
  duration: number
  completed: boolean
}

export default function FocusModeTimer() {
  const { t } = useTranslation()
  const [duration, setDuration] = useState(25)
  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [task, setTask] = useState('')
  const [showBlockList, setShowBlockList] = useState(false)
  const [blockedSites, setBlockedSites] = useState<string[]>([
    'facebook.com', 'twitter.com', 'instagram.com', 'youtube.com', 'reddit.com'
  ])
  const [newSite, setNewSite] = useState('')
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('focus-sessions')
    if (saved) setSessions(JSON.parse(saved))

    const savedSites = localStorage.getItem('blocked-sites')
    if (savedSites) setBlockedSites(JSON.parse(savedSites))
  }, [])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      completeSession()
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, timeLeft])

  const playSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 600
      oscillator.type = 'sine'
      gainNode.gain.value = 0.3

      oscillator.start()
      setTimeout(() => oscillator.stop(), 500)
    } catch {
      // Audio not supported
    }
  }

  const completeSession = () => {
    playSound()
    setIsRunning(false)
    const session: FocusSession = {
      date: new Date().toISOString(),
      duration: duration,
      completed: true
    }
    const updated = [session, ...sessions]
    setSessions(updated)
    localStorage.setItem('focus-sessions', JSON.stringify(updated))
  }

  const startTimer = () => {
    setTimeLeft(duration * 60)
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(duration * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    return ((duration * 60 - timeLeft) / (duration * 60)) * 100
  }

  const addBlockedSite = () => {
    if (!newSite.trim()) return
    const updated = [...blockedSites, newSite.trim().toLowerCase()]
    setBlockedSites(updated)
    localStorage.setItem('blocked-sites', JSON.stringify(updated))
    setNewSite('')
  }

  const removeBlockedSite = (site: string) => {
    const updated = blockedSites.filter(s => s !== site)
    setBlockedSites(updated)
    localStorage.setItem('blocked-sites', JSON.stringify(updated))
  }

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const todaySessions = sessions.filter(s => s.date.startsWith(today) && s.completed)
    const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0)
    return { count: todaySessions.length, minutes: totalMinutes }
  }

  const getWeekStats = () => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekSessions = sessions.filter(s => new Date(s.date) >= weekAgo && s.completed)
    const totalMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0)
    return { count: weekSessions.length, minutes: totalMinutes }
  }

  const todayStats = getTodayStats()
  const weekStats = getWeekStats()

  return (
    <div className="space-y-4">
      <div className="card p-6 text-center">
        {task && (
          <div className="text-sm text-slate-500 mb-2">
            {t('tools.focusModeTimer.focusingOn')}: {task}
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
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className={isRunning ? 'text-green-500' : 'text-blue-500'}
              strokeDasharray={553}
              strokeDashoffset={553 - (553 * getProgress()) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-mono font-bold">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {isRunning ? t('tools.focusModeTimer.focusing') : t('tools.focusModeTimer.ready')}
            </div>
          </div>
        </div>

        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder={t('tools.focusModeTimer.taskPlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded mb-4"
          disabled={isRunning}
        />

        <div className="mb-4">
          <label className="text-sm text-slate-600 block mb-2">
            {t('tools.focusModeTimer.duration')}: {duration} {t('tools.focusModeTimer.minutes')}
          </label>
          <div className="flex gap-2 justify-center">
            {[15, 25, 30, 45, 60, 90].map(d => (
              <button
                key={d}
                onClick={() => {
                  setDuration(d)
                  if (!isRunning) setTimeLeft(d * 60)
                }}
                disabled={isRunning}
                className={`px-3 py-1 rounded text-sm ${
                  duration === d ? 'bg-blue-500 text-white' : 'bg-slate-100'
                } ${isRunning ? 'opacity-50' : ''}`}
              >
                {d}m
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="px-8 py-2 bg-green-500 text-white rounded-lg font-medium"
            >
              {t('tools.focusModeTimer.start')}
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="px-8 py-2 bg-yellow-500 text-white rounded-lg font-medium"
            >
              {t('tools.focusModeTimer.pause')}
            </button>
          )}
          <button
            onClick={resetTimer}
            className="px-4 py-2 bg-slate-200 rounded-lg font-medium"
          >
            {t('tools.focusModeTimer.reset')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{todayStats.count}</div>
          <div className="text-xs text-slate-500">{t('tools.focusModeTimer.sessionsToday')}</div>
          <div className="text-sm text-slate-600 mt-1">{todayStats.minutes} min</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{weekStats.count}</div>
          <div className="text-xs text-slate-500">{t('tools.focusModeTimer.sessionsWeek')}</div>
          <div className="text-sm text-slate-600 mt-1">{Math.round(weekStats.minutes / 60 * 10) / 10}h</div>
        </div>
      </div>

      <button
        onClick={() => setShowBlockList(!showBlockList)}
        className="w-full py-2 bg-slate-100 rounded text-sm"
      >
        {showBlockList ? t('tools.focusModeTimer.hideBlockList') : t('tools.focusModeTimer.showBlockList')}
      </button>

      {showBlockList && (
        <div className="card p-4">
          <h3 className="font-medium mb-2">{t('tools.focusModeTimer.distractionList')}</h3>
          <p className="text-xs text-slate-500 mb-3">
            {t('tools.focusModeTimer.distractionNote')}
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {blockedSites.map(site => (
              <span
                key={site}
                className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs flex items-center gap-1"
              >
                {site}
                <button onClick={() => removeBlockedSite(site)}>x</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSite}
              onChange={(e) => setNewSite(e.target.value)}
              placeholder={t('tools.focusModeTimer.addSite')}
              className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
            />
            <button
              onClick={addBlockedSite}
              disabled={!newSite.trim()}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="card p-4 bg-green-50">
        <h3 className="font-medium mb-2">{t('tools.focusModeTimer.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>- {t('tools.focusModeTimer.tip1')}</li>
          <li>- {t('tools.focusModeTimer.tip2')}</li>
          <li>- {t('tools.focusModeTimer.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
