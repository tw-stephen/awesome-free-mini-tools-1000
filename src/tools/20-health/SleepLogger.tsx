import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface SleepEntry {
  id: number
  date: string
  bedTime: string
  wakeTime: string
  quality: number // 1-5
  notes: string
  duration: number // minutes
}

export default function SleepLogger() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<SleepEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    bedTime: '23:00',
    wakeTime: '07:00',
    quality: 3,
    notes: '',
  })

  const calculateDuration = (bedTime: string, wakeTime: string): number => {
    const [bedHour, bedMin] = bedTime.split(':').map(Number)
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number)

    let bedMinutes = bedHour * 60 + bedMin
    let wakeMinutes = wakeHour * 60 + wakeMin

    // If wake time is earlier than bed time, add 24 hours
    if (wakeMinutes <= bedMinutes) {
      wakeMinutes += 24 * 60
    }

    return wakeMinutes - bedMinutes
  }

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const addEntry = () => {
    const duration = calculateDuration(newEntry.bedTime, newEntry.wakeTime)
    setEntries([
      ...entries,
      {
        ...newEntry,
        id: Date.now(),
        duration,
      },
    ])
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      bedTime: '23:00',
      wakeTime: '07:00',
      quality: 3,
      notes: '',
    })
    setShowForm(false)
  }

  const removeEntry = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id))
  }

  const getQualityEmoji = (quality: number): string => {
    switch (quality) {
      case 1: return '😫'
      case 2: return '😞'
      case 3: return '😐'
      case 4: return '🙂'
      case 5: return '😴'
      default: return '😐'
    }
  }

  const getQualityLabel = (quality: number): string => {
    switch (quality) {
      case 1: return 'Very Poor'
      case 2: return 'Poor'
      case 3: return 'Fair'
      case 4: return 'Good'
      case 5: return 'Excellent'
      default: return 'Fair'
    }
  }

  const getAverageStats = () => {
    if (entries.length === 0) return null
    const avgDuration = entries.reduce((sum, e) => sum + e.duration, 0) / entries.length
    const avgQuality = entries.reduce((sum, e) => sum + e.quality, 0) / entries.length
    return { avgDuration, avgQuality }
  }

  const stats = getAverageStats()

  const getSleepAdvice = (duration: number): string => {
    if (duration < 360) return 'You might be sleep deprived. Aim for 7-9 hours.'
    if (duration < 420) return 'Consider getting a bit more sleep.'
    if (duration <= 540) return 'Great! You got the recommended amount of sleep.'
    return 'You slept quite a lot. Keep it balanced.'
  }

  return (
    <div className="space-y-4">
      {stats && (
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="text-sm text-indigo-600">{t('tools.sleepLogger.avgDuration')}</div>
            <div className="text-2xl font-bold text-indigo-700">{formatDuration(Math.round(stats.avgDuration))}</div>
          </div>
          <div className="card p-4 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="text-sm text-purple-600">{t('tools.sleepLogger.avgQuality')}</div>
            <div className="text-2xl font-bold text-purple-700 flex items-center gap-2">
              {stats.avgQuality.toFixed(1)} {getQualityEmoji(Math.round(stats.avgQuality))}
            </div>
          </div>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-indigo-500 text-white rounded hover:bg-indigo-600 font-medium"
        >
          + {t('tools.sleepLogger.logSleep')}
        </button>
      )}

      {showForm && (
        <div className="card p-4 border-2 border-indigo-300">
          <h3 className="font-medium mb-3">{t('tools.sleepLogger.logSleep')}</h3>
          <div className="space-y-3">
            <input
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-slate-500">Bed Time</label>
                <input
                  type="time"
                  value={newEntry.bedTime}
                  onChange={(e) => setNewEntry({ ...newEntry, bedTime: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500">Wake Time</label>
                <input
                  type="time"
                  value={newEntry.wakeTime}
                  onChange={(e) => setNewEntry({ ...newEntry, wakeTime: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-2">{t('tools.sleepLogger.quality')}</label>
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map((q) => (
                  <button
                    key={q}
                    onClick={() => setNewEntry({ ...newEntry, quality: q })}
                    className={`text-2xl p-2 rounded transition-all ${
                      newEntry.quality === q ? 'bg-indigo-100 scale-125' : 'hover:bg-slate-100'
                    }`}
                  >
                    {getQualityEmoji(q)}
                  </button>
                ))}
              </div>
              <div className="text-center text-sm text-indigo-600 mt-1">
                {getQualityLabel(newEntry.quality)}
              </div>
            </div>
            <textarea
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              placeholder="Notes (optional) - dreams, disturbances, etc."
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
            <div className="bg-indigo-50 p-2 rounded text-sm text-indigo-700">
              Duration: {formatDuration(calculateDuration(newEntry.bedTime, newEntry.wakeTime))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={addEntry}
                className="flex-1 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                Log Sleep
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {entries.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.sleepLogger.history')}</h3>
          <div className="space-y-3">
            {entries
              .slice()
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((entry) => (
                <div key={entry.id} className="p-3 bg-slate-50 rounded">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">
                        {new Date(entry.date + 'T00:00').toLocaleDateString('default', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-sm text-slate-500">
                        {entry.bedTime} → {entry.wakeTime}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-indigo-600">{formatDuration(entry.duration)}</div>
                      <div className="text-lg">{getQualityEmoji(entry.quality)}</div>
                    </div>
                    <button onClick={() => removeEntry(entry.id)} className="text-red-400 hover:text-red-600">
                      ×
                    </button>
                  </div>
                  {entry.notes && (
                    <div className="mt-2 text-sm text-slate-600 italic">{entry.notes}</div>
                  )}
                  <div className="mt-1 text-xs text-slate-400">{getSleepAdvice(entry.duration)}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-indigo-50">
        <h3 className="font-medium text-indigo-700 mb-2">{t('tools.sleepLogger.tips')}</h3>
        <ul className="text-sm text-indigo-600 space-y-1">
          <li>• Adults need 7-9 hours of sleep per night</li>
          <li>• Keep a consistent sleep schedule</li>
          <li>• Avoid screens 1 hour before bed</li>
          <li>• Keep your bedroom cool and dark</li>
        </ul>
      </div>
    </div>
  )
}
