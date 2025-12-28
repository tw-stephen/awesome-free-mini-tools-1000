import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface SleepEntry {
  id: number
  date: string
  bedtime: string
  wakeTime: string
  quality: number
  notes: string
}

export default function SleepTracker() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<SleepEntry[]>([])
  const [mode, setMode] = useState<'list' | 'add'>('list')
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    bedtime: '22:00',
    wakeTime: '06:00',
    quality: 3,
    notes: '',
  })

  useEffect(() => {
    const saved = localStorage.getItem('sleep-tracker')
    if (saved) {
      try {
        setEntries(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load sleep data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sleep-tracker', JSON.stringify(entries))
  }, [entries])

  const calculateDuration = (bedtime: string, wakeTime: string): number => {
    const [bedH, bedM] = bedtime.split(':').map(Number)
    const [wakeH, wakeM] = wakeTime.split(':').map(Number)
    let duration = (wakeH * 60 + wakeM) - (bedH * 60 + bedM)
    if (duration < 0) duration += 24 * 60
    return duration / 60
  }

  const addEntry = () => {
    const entry: SleepEntry = {
      id: Date.now(),
      ...newEntry,
    }
    setEntries([entry, ...entries])
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      bedtime: '22:00',
      wakeTime: '06:00',
      quality: 3,
      notes: '',
    })
    setMode('list')
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const last7Days = entries.slice(0, 7)
  const avgSleep = last7Days.length > 0
    ? last7Days.reduce((sum, e) => sum + calculateDuration(e.bedtime, e.wakeTime), 0) / last7Days.length
    : 0
  const avgQuality = last7Days.length > 0
    ? last7Days.reduce((sum, e) => sum + e.quality, 0) / last7Days.length
    : 0

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={() => setMode('add')}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.sleepTracker.addEntry')}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <div className="card p-4 text-center bg-indigo-50">
              <div className="text-2xl font-bold text-indigo-600">{avgSleep.toFixed(1)}h</div>
              <div className="text-xs text-slate-500">{t('tools.sleepTracker.avgSleep')}</div>
            </div>
            <div className="card p-4 text-center bg-purple-50">
              <div className="text-2xl font-bold text-purple-600">{avgQuality.toFixed(1)}/5</div>
              <div className="text-xs text-slate-500">{t('tools.sleepTracker.avgQuality')}</div>
            </div>
          </div>

          {entries.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.sleepTracker.noEntries')}
            </div>
          ) : (
            <div className="space-y-2">
              {entries.slice(0, 14).map(entry => {
                const duration = calculateDuration(entry.bedtime, entry.wakeTime)
                return (
                  <div key={entry.id} className="card p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{entry.date}</div>
                        <div className="text-sm text-slate-500">
                          {entry.bedtime} → {entry.wakeTime} ({duration.toFixed(1)}h)
                        </div>
                        <div className="text-sm mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < entry.quality ? 'text-yellow-400' : 'text-slate-300'}>★</span>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => deleteEntry(entry.id)} className="text-red-500">×</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {mode === 'add' && (
        <div className="card p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.sleepTracker.date')}
            </label>
            <input
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.sleepTracker.bedtime')}
              </label>
              <input
                type="time"
                value={newEntry.bedtime}
                onChange={(e) => setNewEntry({ ...newEntry, bedtime: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.sleepTracker.wakeTime')}
              </label>
              <input
                type="time"
                value={newEntry.wakeTime}
                onChange={(e) => setNewEntry({ ...newEntry, wakeTime: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.sleepTracker.quality')}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setNewEntry({ ...newEntry, quality: n })}
                  className={`flex-1 py-2 rounded text-xl ${newEntry.quality >= n ? 'bg-yellow-400' : 'bg-slate-100'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.sleepTracker.notes')}
            </label>
            <textarea
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              placeholder={t('tools.sleepTracker.notesPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setMode('list')} className="flex-1 py-2 bg-slate-100 rounded">
              {t('common.cancel')}
            </button>
            <button onClick={addEntry} className="flex-1 py-2 bg-blue-500 text-white rounded">
              {t('tools.sleepTracker.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
