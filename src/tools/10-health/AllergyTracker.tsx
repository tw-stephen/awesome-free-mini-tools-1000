import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface AllergyEntry {
  id: number
  date: string
  time: string
  symptoms: string[]
  severity: number
  triggers: string[]
  notes: string
}

interface Allergy {
  id: number
  name: string
  type: string
}

export default function AllergyTracker() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<AllergyEntry[]>([])
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [mode, setMode] = useState<'list' | 'addEntry' | 'addAllergy'>('list')
  const [newAllergy, setNewAllergy] = useState({ name: '', type: 'food' })
  const [newEntry, setNewEntry] = useState({
    symptoms: [] as string[],
    severity: 5,
    triggers: [] as string[],
    notes: '',
  })

  const allergyTypes = ['food', 'environmental', 'drug', 'insect', 'other']
  const symptomOptions = ['sneezing', 'itching', 'rash', 'swelling', 'breathing', 'nausea', 'headache', 'fatigue']

  useEffect(() => {
    const saved = localStorage.getItem('allergy-tracker')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setEntries(data.entries || [])
        setAllergies(data.allergies || [])
      } catch (e) {
        console.error('Failed to load allergy data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('allergy-tracker', JSON.stringify({ entries, allergies }))
  }, [entries, allergies])

  const addAllergy = () => {
    if (!newAllergy.name.trim()) return
    const allergy: Allergy = {
      id: Date.now(),
      name: newAllergy.name,
      type: newAllergy.type,
    }
    setAllergies([...allergies, allergy])
    setNewAllergy({ name: '', type: 'food' })
    setMode('list')
  }

  const addEntry = () => {
    if (newEntry.symptoms.length === 0) return
    const entry: AllergyEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...newEntry,
    }
    setEntries([entry, ...entries])
    setNewEntry({ symptoms: [], severity: 5, triggers: [], notes: '' })
    setMode('list')
  }

  const deleteAllergy = (id: number) => {
    setAllergies(allergies.filter(a => a.id !== id))
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const toggleSymptom = (symptom: string) => {
    setNewEntry({
      ...newEntry,
      symptoms: newEntry.symptoms.includes(symptom)
        ? newEntry.symptoms.filter(s => s !== symptom)
        : [...newEntry.symptoms, symptom],
    })
  }

  const toggleTrigger = (trigger: string) => {
    setNewEntry({
      ...newEntry,
      triggers: newEntry.triggers.includes(trigger)
        ? newEntry.triggers.filter(t => t !== trigger)
        : [...newEntry.triggers, trigger],
    })
  }

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return 'bg-green-100 text-green-700'
    if (severity <= 6) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('addEntry')}
              className="flex-1 py-3 bg-blue-500 text-white rounded font-medium"
            >
              + {t('tools.allergyTracker.logReaction')}
            </button>
            <button
              onClick={() => setMode('addAllergy')}
              className="flex-1 py-3 bg-green-500 text-white rounded font-medium"
            >
              + {t('tools.allergyTracker.addAllergy')}
            </button>
          </div>

          {allergies.length > 0 && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.allergyTracker.myAllergies')}</h3>
              <div className="flex flex-wrap gap-2">
                {allergies.map(allergy => (
                  <div key={allergy.id} className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    <span>{allergy.name}</span>
                    <button onClick={() => deleteAllergy(allergy.id)} className="ml-1">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {entries.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.allergyTracker.noReactions')}
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-700">{t('tools.allergyTracker.recentReactions')}</h3>
              {entries.slice(0, 20).map(entry => (
                <div key={entry.id} className={`card p-4 ${getSeverityColor(entry.severity)}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-slate-500">{entry.date} {entry.time}</div>
                      <div className="font-medium mt-1">
                        {entry.symptoms.map(s => t(`tools.allergyTracker.${s}`)).join(', ')}
                      </div>
                      <div className="text-sm">{t('tools.allergyTracker.severity')}: {entry.severity}/10</div>
                      {entry.triggers.length > 0 && (
                        <div className="text-xs mt-1">
                          {t('tools.allergyTracker.suspectedTriggers')}: {entry.triggers.join(', ')}
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

      {mode === 'addAllergy' && (
        <div className="card p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.allergyTracker.allergyName')} *
            </label>
            <input
              type="text"
              value={newAllergy.name}
              onChange={(e) => setNewAllergy({ ...newAllergy, name: e.target.value })}
              placeholder={t('tools.allergyTracker.allergyPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.allergyTracker.allergyType')}
            </label>
            <div className="flex flex-wrap gap-2">
              {allergyTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setNewAllergy({ ...newAllergy, type })}
                  className={`px-3 py-1.5 rounded text-sm ${
                    newAllergy.type === type ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {t(`tools.allergyTracker.${type}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setMode('list')} className="flex-1 py-2 bg-slate-100 rounded">
              {t('common.cancel')}
            </button>
            <button
              onClick={addAllergy}
              disabled={!newAllergy.name.trim()}
              className="flex-1 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.allergyTracker.save')}
            </button>
          </div>
        </div>
      )}

      {mode === 'addEntry' && (
        <div className="card p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.allergyTracker.symptoms')} *
            </label>
            <div className="flex flex-wrap gap-2">
              {symptomOptions.map(symptom => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`px-3 py-1.5 rounded text-sm ${
                    newEntry.symptoms.includes(symptom) ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {t(`tools.allergyTracker.${symptom}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.allergyTracker.severity')}: {newEntry.severity}/10
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={newEntry.severity}
              onChange={(e) => setNewEntry({ ...newEntry, severity: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {allergies.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('tools.allergyTracker.suspectedTriggers')}
              </label>
              <div className="flex flex-wrap gap-2">
                {allergies.map(allergy => (
                  <button
                    key={allergy.id}
                    onClick={() => toggleTrigger(allergy.name)}
                    className={`px-3 py-1.5 rounded text-sm ${
                      newEntry.triggers.includes(allergy.name) ? 'bg-red-500 text-white' : 'bg-slate-100'
                    }`}
                  >
                    {allergy.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.allergyTracker.notes')}
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
              disabled={newEntry.symptoms.length === 0}
              className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.allergyTracker.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
