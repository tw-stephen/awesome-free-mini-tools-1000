import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface TimeEntry {
  id: string
  project: string
  task: string
  startTime: number
  endTime: number | null
  duration: number
  date: string
}

export default function TimeTracker() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [project, setProject] = useState('')
  const [task, setTask] = useState('')
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('time-tracker-entries')
    if (saved) {
      const parsed = JSON.parse(saved)
      setEntries(parsed)
      const active = parsed.find((e: TimeEntry) => e.endTime === null)
      if (active) {
        setActiveEntry(active)
        setProject(active.project)
        setTask(active.task)
        setElapsed(Date.now() - active.startTime)
      }
    }
  }, [])

  useEffect(() => {
    if (activeEntry) {
      intervalRef.current = window.setInterval(() => {
        setElapsed(Date.now() - activeEntry.startTime)
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [activeEntry])

  const saveEntries = (updated: TimeEntry[]) => {
    setEntries(updated)
    localStorage.setItem('time-tracker-entries', JSON.stringify(updated))
  }

  const startTimer = () => {
    if (!project) return
    const entry: TimeEntry = {
      id: Date.now().toString(),
      project,
      task,
      startTime: Date.now(),
      endTime: null,
      duration: 0,
      date: new Date().toISOString().split('T')[0]
    }
    setActiveEntry(entry)
    setElapsed(0)
    saveEntries([...entries, entry])
  }

  const stopTimer = () => {
    if (!activeEntry) return
    const endTime = Date.now()
    const duration = endTime - activeEntry.startTime
    const updatedEntry = { ...activeEntry, endTime, duration }
    const updated = entries.map(e => e.id === activeEntry.id ? updatedEntry : e)
    saveEntries(updated)
    setActiveEntry(null)
    setElapsed(0)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const deleteEntry = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id))
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTodayTotal = () => {
    const today = new Date().toISOString().split('T')[0]
    const todayEntries = entries.filter(e => e.date === today && e.endTime)
    const total = todayEntries.reduce((sum, e) => sum + e.duration, 0)
    return total + (activeEntry ? elapsed : 0)
  }

  const getWeekTotal = () => {
    const now = new Date()
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
    weekStart.setHours(0, 0, 0, 0)
    const weekEntries = entries.filter(e => new Date(e.date) >= weekStart && e.endTime)
    const total = weekEntries.reduce((sum, e) => sum + e.duration, 0)
    return total + (activeEntry ? elapsed : 0)
  }

  const getProjectBreakdown = () => {
    const breakdown: Record<string, number> = {}
    entries.filter(e => e.endTime).forEach(e => {
      breakdown[e.project] = (breakdown[e.project] || 0) + e.duration
    })
    if (activeEntry) {
      breakdown[activeEntry.project] = (breakdown[activeEntry.project] || 0) + elapsed
    }
    return Object.entries(breakdown).sort((a, b) => b[1] - a[1])
  }

  const completedEntries = entries.filter(e => e.endTime !== null).sort((a, b) => b.startTime - a.startTime)

  return (
    <div className="space-y-4">
      <div className="card p-6 text-center">
        <div className="text-5xl font-mono font-bold text-slate-800 mb-4">
          {formatDuration(elapsed)}
        </div>
        {activeEntry ? (
          <div className="text-sm text-slate-500 mb-4">
            {activeEntry.project} {activeEntry.task && `- ${activeEntry.task}`}
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            <input
              type="text"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder={t('tools.timeTracker.project')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder={t('tools.timeTracker.task')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        )}
        {activeEntry ? (
          <button
            onClick={stopTimer}
            className="w-full py-3 bg-red-500 text-white rounded-lg font-medium"
          >
            ⏹ {t('tools.timeTracker.stop')}
          </button>
        ) : (
          <button
            onClick={startTimer}
            disabled={!project}
            className="w-full py-3 bg-green-500 text-white rounded-lg font-medium disabled:opacity-50"
          >
            ▶ {t('tools.timeTracker.start')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="card p-3 text-center">
          <div className="text-xs text-slate-500">{t('tools.timeTracker.today')}</div>
          <div className="text-lg font-bold">{formatDuration(getTodayTotal())}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xs text-slate-500">{t('tools.timeTracker.thisWeek')}</div>
          <div className="text-lg font-bold">{formatDuration(getWeekTotal())}</div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.timeTracker.projectBreakdown')}</h3>
        <div className="space-y-2">
          {getProjectBreakdown().slice(0, 5).map(([proj, duration]) => (
            <div key={proj} className="flex items-center justify-between">
              <span className="text-sm">{proj}</span>
              <span className="text-sm font-medium">{formatDuration(duration)}</span>
            </div>
          ))}
          {getProjectBreakdown().length === 0 && (
            <p className="text-center text-slate-500 text-sm py-2">
              {t('tools.timeTracker.noProjects')}
            </p>
          )}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium text-slate-700 mb-3">{t('tools.timeTracker.recentEntries')}</h3>
        {completedEntries.length === 0 ? (
          <p className="text-center text-slate-500 py-4">{t('tools.timeTracker.noEntries')}</p>
        ) : (
          <div className="space-y-2">
            {completedEntries.slice(0, 10).map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div>
                  <div className="text-sm font-medium">{entry.project}</div>
                  <div className="text-xs text-slate-500">
                    {entry.task && `${entry.task} • `}{entry.date}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{formatDuration(entry.duration)}</span>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-red-500 text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            setProject('')
            setTask('')
            saveEntries([])
          }}
          className="py-2 bg-red-100 text-red-600 rounded text-sm"
        >
          {t('tools.timeTracker.clearAll')}
        </button>
        <button
          onClick={() => {
            const csv = ['Date,Project,Task,Start,End,Duration (min)']
            completedEntries.forEach(e => {
              const start = new Date(e.startTime).toLocaleTimeString()
              const end = e.endTime ? new Date(e.endTime).toLocaleTimeString() : ''
              const durationMin = Math.round(e.duration / 60000)
              csv.push(`${e.date},"${e.project}","${e.task}",${start},${end},${durationMin}`)
            })
            const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'time-entries.csv'
            a.click()
          }}
          className="py-2 bg-slate-100 rounded text-sm"
        >
          {t('tools.timeTracker.exportCSV')}
        </button>
      </div>
    </div>
  )
}
