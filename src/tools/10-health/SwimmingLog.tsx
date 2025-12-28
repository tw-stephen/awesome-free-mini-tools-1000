import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface SwimEntry {
  id: number
  date: string
  stroke: string
  distance: number
  duration: number
  laps: number
  poolLength: number
  calories: number
  notes: string
}

export default function SwimmingLog() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<SwimEntry[]>([])
  const [mode, setMode] = useState<'list' | 'add'>('list')
  const [poolLength, setPoolLength] = useState(25)
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    stroke: 'freestyle',
    laps: '',
    duration: '',
    notes: '',
  })

  const strokes = ['freestyle', 'backstroke', 'breaststroke', 'butterfly', 'mixed']
  const caloriesPerMin: Record<string, number> = {
    freestyle: 10,
    backstroke: 8,
    breaststroke: 9,
    butterfly: 12,
    mixed: 9,
  }

  useEffect(() => {
    const saved = localStorage.getItem('swimming-log')
    if (saved) {
      try {
        setEntries(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load swimming data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('swimming-log', JSON.stringify(entries))
  }, [entries])

  const addEntry = () => {
    if (!newEntry.laps || !newEntry.duration) return

    const laps = parseInt(newEntry.laps)
    const duration = parseInt(newEntry.duration)
    const distance = (laps * poolLength) / 1000 // km
    const calories = Math.round(duration * caloriesPerMin[newEntry.stroke])

    const entry: SwimEntry = {
      id: Date.now(),
      date: newEntry.date,
      stroke: newEntry.stroke,
      distance,
      duration,
      laps,
      poolLength,
      calories,
      notes: newEntry.notes,
    }
    setEntries([entry, ...entries])
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      stroke: 'freestyle',
      laps: '',
      duration: '',
      notes: '',
    })
    setMode('list')
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const formatPace = (duration: number, distance: number) => {
    if (distance === 0) return '-'
    const pacePerKm = duration / distance
    const mins = Math.floor(pacePerKm)
    const secs = Math.round((pacePerKm - mins) * 60)
    return `${mins}:${secs.toString().padStart(2, '0')}/km`
  }

  const thisMonth = entries.filter(e => {
    const entryDate = new Date(e.date)
    const now = new Date()
    return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear()
  })

  const totalDistance = thisMonth.reduce((sum, e) => sum + e.distance, 0)
  const totalDuration = thisMonth.reduce((sum, e) => sum + e.duration, 0)
  const totalCalories = thisMonth.reduce((sum, e) => sum + e.calories, 0)

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={() => setMode('add')}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.swimmingLog.logSwim')}
          </button>

          {entries.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              <div className="card p-3 text-center">
                <div className="text-xl font-bold text-blue-600">{totalDistance.toFixed(1)}km</div>
                <div className="text-xs text-slate-500">{t('tools.swimmingLog.thisMonth')}</div>
              </div>
              <div className="card p-3 text-center">
                <div className="text-xl font-bold text-green-600">{totalDuration}min</div>
                <div className="text-xs text-slate-500">{t('tools.swimmingLog.time')}</div>
              </div>
              <div className="card p-3 text-center">
                <div className="text-xl font-bold text-orange-600">{totalCalories}</div>
                <div className="text-xs text-slate-500">{t('tools.swimmingLog.calories')}</div>
              </div>
            </div>
          )}

          {entries.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.swimmingLog.noSwims')}
            </div>
          ) : (
            <div className="space-y-2">
              {entries.slice(0, 20).map(entry => (
                <div key={entry.id} className="card p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-slate-500">{entry.date}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-medium">{(entry.distance * 1000).toFixed(0)}m</span>
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                          {t(`tools.swimmingLog.${entry.stroke}`)}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        {entry.laps} {t('tools.swimmingLog.laps')} • {entry.duration}min • {formatPace(entry.duration, entry.distance)}
                      </div>
                      <div className="text-xs text-orange-600">{entry.calories} kcal</div>
                    </div>
                    <button onClick={() => deleteEntry(entry.id)} className="text-red-500">×</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {mode === 'add' && (
        <div className="card p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.swimmingLog.date')}
            </label>
            <input
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.swimmingLog.poolLength')}
            </label>
            <div className="flex gap-2">
              {[25, 50].map(len => (
                <button
                  key={len}
                  onClick={() => setPoolLength(len)}
                  className={`flex-1 py-2 rounded ${
                    poolLength === len ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {len}m
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.swimmingLog.stroke')}
            </label>
            <div className="flex flex-wrap gap-2">
              {strokes.map(stroke => (
                <button
                  key={stroke}
                  onClick={() => setNewEntry({ ...newEntry, stroke })}
                  className={`px-3 py-1.5 rounded text-sm ${
                    newEntry.stroke === stroke ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {t(`tools.swimmingLog.${stroke}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.swimmingLog.laps')} *
              </label>
              <input
                type="number"
                value={newEntry.laps}
                onChange={(e) => setNewEntry({ ...newEntry, laps: e.target.value })}
                placeholder="20"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              {newEntry.laps && (
                <div className="text-xs text-slate-500 mt-1">
                  = {(parseInt(newEntry.laps) * poolLength)}m
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.swimmingLog.duration')} (min) *
              </label>
              <input
                type="number"
                value={newEntry.duration}
                onChange={(e) => setNewEntry({ ...newEntry, duration: e.target.value })}
                placeholder="30"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          {newEntry.laps && newEntry.duration && (
            <div className="p-3 bg-blue-50 rounded">
              <div className="text-sm text-slate-600">
                {t('tools.swimmingLog.estimated')}:
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-blue-600 font-medium">
                  {formatPace(parseInt(newEntry.duration), (parseInt(newEntry.laps) * poolLength) / 1000)}
                </span>
                <span className="text-orange-600 font-medium">
                  ~{Math.round(parseInt(newEntry.duration) * caloriesPerMin[newEntry.stroke])} kcal
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.swimmingLog.notes')}
            </label>
            <textarea
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setMode('list')} className="flex-1 py-2 bg-slate-100 rounded">
              {t('common.cancel')}
            </button>
            <button
              onClick={addEntry}
              disabled={!newEntry.laps || !newEntry.duration}
              className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.swimmingLog.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
