import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface WeightEntry {
  id: number
  weight: number
  date: string
  notes: string
}

export default function WeightTracker() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg')
  const [newWeight, setNewWeight] = useState('')
  const [goalWeight, setGoalWeight] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('weight-tracker')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setEntries(data.entries || [])
        setGoalWeight(data.goalWeight || '')
        setUnit(data.unit || 'kg')
      } catch (e) {
        console.error('Failed to load weight data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('weight-tracker', JSON.stringify({ entries, goalWeight, unit }))
  }, [entries, goalWeight, unit])

  const addEntry = () => {
    const weight = parseFloat(newWeight)
    if (isNaN(weight)) return

    const entry: WeightEntry = {
      id: Date.now(),
      weight,
      date: new Date().toISOString().split('T')[0],
      notes,
    }
    setEntries([entry, ...entries])
    setNewWeight('')
    setNotes('')
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const convertWeight = (w: number, to: 'kg' | 'lbs') => {
    if (to === 'lbs') return w * 2.20462
    return w / 2.20462
  }

  const displayWeight = (w: number) => {
    return unit === 'kg' ? w : convertWeight(w, 'lbs')
  }

  const latestWeight = entries[0]?.weight
  const startWeight = entries[entries.length - 1]?.weight
  const goal = parseFloat(goalWeight)
  const progress = startWeight && goal
    ? Math.min(100, Math.max(0, ((startWeight - (latestWeight || startWeight)) / (startWeight - goal)) * 100))
    : 0

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekEntries = entries.filter(e => new Date(e.date) >= weekAgo)
  const weeklyChange = weekEntries.length >= 2
    ? weekEntries[0].weight - weekEntries[weekEntries.length - 1].weight
    : 0

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setUnit('kg')}
          className={`flex-1 py-2 rounded ${unit === 'kg' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          kg
        </button>
        <button
          onClick={() => setUnit('lbs')}
          className={`flex-1 py-2 rounded ${unit === 'lbs' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          lbs
        </button>
      </div>

      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.weightTracker.currentWeight')} ({unit})
          </label>
          <input
            type="number"
            step="0.1"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder={unit === 'kg' ? '70.0' : '154.0'}
            className="w-full px-3 py-2 border border-slate-300 rounded text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.weightTracker.notes')}
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('tools.weightTracker.notesPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <button
          onClick={addEntry}
          disabled={!newWeight}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
        >
          + {t('tools.weightTracker.logWeight')}
        </button>
      </div>

      {entries.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {displayWeight(latestWeight || 0).toFixed(1)}
            </div>
            <div className="text-xs text-slate-500">{t('tools.weightTracker.current')} ({unit})</div>
          </div>
          <div className="card p-4 text-center">
            <div className={`text-2xl font-bold ${weeklyChange < 0 ? 'text-green-600' : weeklyChange > 0 ? 'text-red-600' : 'text-slate-600'}`}>
              {weeklyChange > 0 ? '+' : ''}{displayWeight(weeklyChange).toFixed(1)}
            </div>
            <div className="text-xs text-slate-500">{t('tools.weightTracker.weeklyChange')}</div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.weightTracker.goalWeight')} ({unit})
        </label>
        <input
          type="number"
          step="0.1"
          value={goalWeight}
          onChange={(e) => setGoalWeight(e.target.value)}
          placeholder={unit === 'kg' ? '65.0' : '143.0'}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
        {goal > 0 && startWeight && (
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{t('tools.weightTracker.progress')}</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="card p-6 text-center text-slate-500">
          {t('tools.weightTracker.noEntries')}
        </div>
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.weightTracker.history')}</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {entries.slice(0, 30).map((entry, i) => {
              const prevEntry = entries[i + 1]
              const change = prevEntry ? entry.weight - prevEntry.weight : 0
              return (
                <div key={entry.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <div>
                    <div className="font-medium">{displayWeight(entry.weight).toFixed(1)} {unit}</div>
                    <div className="text-xs text-slate-500">{entry.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {change !== 0 && (
                      <span className={`text-sm ${change < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change > 0 ? '+' : ''}{displayWeight(change).toFixed(1)}
                      </span>
                    )}
                    <button onClick={() => deleteEntry(entry.id)} className="text-red-500">×</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
