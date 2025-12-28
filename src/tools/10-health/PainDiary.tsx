import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface PainEntry {
  id: number
  date: string
  time: string
  location: string
  intensity: number
  type: string
  triggers: string[]
  notes: string
}

export default function PainDiary() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<PainEntry[]>([])
  const [mode, setMode] = useState<'list' | 'add'>('list')
  const [newEntry, setNewEntry] = useState({
    location: '',
    intensity: 5,
    type: 'aching',
    triggers: [] as string[],
    notes: '',
  })

  const painLocations = ['head', 'neck', 'shoulder', 'back', 'chest', 'arm', 'hand', 'hip', 'leg', 'knee', 'foot', 'other']
  const painTypes = ['aching', 'sharp', 'burning', 'throbbing', 'stabbing', 'cramping', 'dull']
  const triggerOptions = ['stress', 'sleep', 'weather', 'exercise', 'food', 'work', 'posture']

  useEffect(() => {
    const saved = localStorage.getItem('pain-diary')
    if (saved) {
      try {
        setEntries(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load pain diary')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('pain-diary', JSON.stringify(entries))
  }, [entries])

  const addEntry = () => {
    if (!newEntry.location) return

    const entry: PainEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...newEntry,
    }
    setEntries([entry, ...entries])
    setNewEntry({
      location: '',
      intensity: 5,
      type: 'aching',
      triggers: [],
      notes: '',
    })
    setMode('list')
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const toggleTrigger = (trigger: string) => {
    setNewEntry({
      ...newEntry,
      triggers: newEntry.triggers.includes(trigger)
        ? newEntry.triggers.filter(t => t !== trigger)
        : [...newEntry.triggers, trigger],
    })
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'text-green-600 bg-green-50'
    if (intensity <= 6) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const last7Days = entries.filter(e => {
    const date = new Date(e.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return date >= weekAgo
  })
  const avgIntensity = last7Days.length > 0
    ? (last7Days.reduce((sum, e) => sum + e.intensity, 0) / last7Days.length).toFixed(1)
    : 0

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={() => setMode('add')}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.painDiary.logPain')}
          </button>

          {entries.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-slate-700">{last7Days.length}</div>
                <div className="text-xs text-slate-500">{t('tools.painDiary.entriesThisWeek')}</div>
              </div>
              <div className="card p-4 text-center">
                <div className={`text-2xl font-bold ${Number(avgIntensity) > 5 ? 'text-red-600' : 'text-green-600'}`}>{avgIntensity}/10</div>
                <div className="text-xs text-slate-500">{t('tools.painDiary.avgIntensity')}</div>
              </div>
            </div>
          )}

          {entries.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.painDiary.noEntries')}
            </div>
          ) : (
            <div className="space-y-2">
              {entries.slice(0, 20).map(entry => (
                <div key={entry.id} className={`card p-4 ${getIntensityColor(entry.intensity)}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{t(`tools.painDiary.${entry.location}`)}</span>
                        <span className="text-xs px-2 py-0.5 bg-white rounded">{entry.type}</span>
                      </div>
                      <div className="text-xs text-slate-500">{entry.date} {entry.time}</div>
                      <div className="text-lg font-bold mt-1">{entry.intensity}/10</div>
                      {entry.triggers.length > 0 && (
                        <div className="text-xs mt-1">
                          {t('tools.painDiary.triggers')}: {entry.triggers.map(t => t).join(', ')}
                        </div>
                      )}
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
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.painDiary.location')} *
            </label>
            <div className="flex flex-wrap gap-2">
              {painLocations.map(loc => (
                <button
                  key={loc}
                  onClick={() => setNewEntry({ ...newEntry, location: loc })}
                  className={`px-3 py-1.5 rounded text-sm ${
                    newEntry.location === loc ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {t(`tools.painDiary.${loc}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.painDiary.intensity')}: {newEntry.intensity}/10
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={newEntry.intensity}
              onChange={(e) => setNewEntry({ ...newEntry, intensity: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>{t('tools.painDiary.mild')}</span>
              <span>{t('tools.painDiary.moderate')}</span>
              <span>{t('tools.painDiary.severe')}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.painDiary.type')}
            </label>
            <div className="flex flex-wrap gap-2">
              {painTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setNewEntry({ ...newEntry, type })}
                  className={`px-3 py-1.5 rounded text-sm ${
                    newEntry.type === type ? 'bg-purple-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {t(`tools.painDiary.${type}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.painDiary.possibleTriggers')}
            </label>
            <div className="flex flex-wrap gap-2">
              {triggerOptions.map(trigger => (
                <button
                  key={trigger}
                  onClick={() => toggleTrigger(trigger)}
                  className={`px-3 py-1.5 rounded text-sm ${
                    newEntry.triggers.includes(trigger) ? 'bg-orange-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {t(`tools.painDiary.trigger${trigger.charAt(0).toUpperCase() + trigger.slice(1)}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.painDiary.notes')}
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
              disabled={!newEntry.location}
              className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.painDiary.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
