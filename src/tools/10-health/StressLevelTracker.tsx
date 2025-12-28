import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface StressEntry {
  id: number
  date: string
  time: string
  level: number
  triggers: string[]
  physicalSymptoms: string[]
  copingUsed: string[]
  notes: string
}

export default function StressLevelTracker() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<StressEntry[]>([])
  const [mode, setMode] = useState<'list' | 'add'>('list')
  const [newEntry, setNewEntry] = useState({
    level: 5,
    triggers: [] as string[],
    physicalSymptoms: [] as string[],
    copingUsed: [] as string[],
    notes: '',
  })

  const triggerOptions = ['work', 'family', 'health', 'finance', 'relationships', 'time', 'sleep', 'other']
  const symptomOptions = ['headache', 'tension', 'fatigue', 'anxiety', 'irritability', 'insomnia', 'appetite']
  const copingOptions = ['exercise', 'meditation', 'socializing', 'music', 'nature', 'reading', 'breathing']

  useEffect(() => {
    const saved = localStorage.getItem('stress-tracker')
    if (saved) {
      try {
        setEntries(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load stress data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('stress-tracker', JSON.stringify(entries))
  }, [entries])

  const addEntry = () => {
    const entry: StressEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...newEntry,
    }
    setEntries([entry, ...entries])
    setNewEntry({ level: 5, triggers: [], physicalSymptoms: [], copingUsed: [], notes: '' })
    setMode('list')
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const toggleItem = (field: 'triggers' | 'physicalSymptoms' | 'copingUsed', item: string) => {
    setNewEntry({
      ...newEntry,
      [field]: newEntry[field].includes(item)
        ? newEntry[field].filter(i => i !== item)
        : [...newEntry[field], item],
    })
  }

  const getStressColor = (level: number) => {
    if (level <= 3) return 'bg-green-100 text-green-700'
    if (level <= 6) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  const last7Days = entries.filter(e => {
    const date = new Date(e.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return date >= weekAgo
  })
  const avgStress = last7Days.length > 0
    ? (last7Days.reduce((sum, e) => sum + e.level, 0) / last7Days.length).toFixed(1)
    : '0'

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={() => setMode('add')}
            className="w-full py-3 bg-purple-500 text-white rounded font-medium"
          >
            + {t('tools.stressLevelTracker.logStress')}
          </button>

          {entries.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-slate-700">{last7Days.length}</div>
                <div className="text-xs text-slate-500">{t('tools.stressLevelTracker.entriesThisWeek')}</div>
              </div>
              <div className="card p-4 text-center">
                <div className={`text-2xl font-bold ${Number(avgStress) > 5 ? 'text-red-600' : 'text-green-600'}`}>{avgStress}/10</div>
                <div className="text-xs text-slate-500">{t('tools.stressLevelTracker.avgLevel')}</div>
              </div>
            </div>
          )}

          {entries.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.stressLevelTracker.noEntries')}
            </div>
          ) : (
            <div className="space-y-2">
              {entries.slice(0, 20).map(entry => (
                <div key={entry.id} className={`card p-4 ${getStressColor(entry.level)}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-slate-500">{entry.date} {entry.time}</div>
                      <div className="text-xl font-bold mt-1">{entry.level}/10</div>
                      {entry.triggers.length > 0 && (
                        <div className="text-xs mt-1">
                          {t('tools.stressLevelTracker.triggers')}: {entry.triggers.join(', ')}
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
              {t('tools.stressLevelTracker.stressLevel')}: {newEntry.level}/10
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={newEntry.level}
              onChange={(e) => setNewEntry({ ...newEntry, level: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>{t('tools.stressLevelTracker.low')}</span>
              <span>{t('tools.stressLevelTracker.moderate')}</span>
              <span>{t('tools.stressLevelTracker.high')}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.stressLevelTracker.triggers')}
            </label>
            <div className="flex flex-wrap gap-2">
              {triggerOptions.map(trigger => (
                <button
                  key={trigger}
                  onClick={() => toggleItem('triggers', trigger)}
                  className={`px-3 py-1.5 rounded text-sm ${
                    newEntry.triggers.includes(trigger) ? 'bg-purple-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {t(`tools.stressLevelTracker.trigger${trigger.charAt(0).toUpperCase() + trigger.slice(1)}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.stressLevelTracker.symptoms')}
            </label>
            <div className="flex flex-wrap gap-2">
              {symptomOptions.map(symptom => (
                <button
                  key={symptom}
                  onClick={() => toggleItem('physicalSymptoms', symptom)}
                  className={`px-3 py-1.5 rounded text-sm ${
                    newEntry.physicalSymptoms.includes(symptom) ? 'bg-red-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {t(`tools.stressLevelTracker.symptom${symptom.charAt(0).toUpperCase() + symptom.slice(1)}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.stressLevelTracker.copingUsed')}
            </label>
            <div className="flex flex-wrap gap-2">
              {copingOptions.map(coping => (
                <button
                  key={coping}
                  onClick={() => toggleItem('copingUsed', coping)}
                  className={`px-3 py-1.5 rounded text-sm ${
                    newEntry.copingUsed.includes(coping) ? 'bg-green-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {t(`tools.stressLevelTracker.coping${coping.charAt(0).toUpperCase() + coping.slice(1)}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.stressLevelTracker.notes')}
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
            <button onClick={addEntry} className="flex-1 py-2 bg-purple-500 text-white rounded">
              {t('tools.stressLevelTracker.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
