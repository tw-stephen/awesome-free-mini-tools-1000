import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface GrowthEntry {
  id: number
  date: string
  weight: number
  height: number
  headCircumference: number
  notes: string
}

interface BabyProfile {
  name: string
  birthDate: string
  gender: 'male' | 'female'
}

export default function BabyGrowthTracker() {
  const { t } = useTranslation()
  const [profile, setProfile] = useState<BabyProfile | null>(null)
  const [entries, setEntries] = useState<GrowthEntry[]>([])
  const [mode, setMode] = useState<'setup' | 'list' | 'add'>('setup')
  const [newProfile, setNewProfile] = useState<BabyProfile>({
    name: '',
    birthDate: '',
    gender: 'male',
  })
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    headCircumference: '',
    notes: '',
  })

  useEffect(() => {
    const saved = localStorage.getItem('baby-growth-tracker')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.profile) {
          setProfile(data.profile)
          setMode('list')
        }
        setEntries(data.entries || [])
      } catch (e) {
        console.error('Failed to load baby data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('baby-growth-tracker', JSON.stringify({ profile, entries }))
  }, [profile, entries])

  const saveProfile = () => {
    if (!newProfile.name.trim() || !newProfile.birthDate) return
    setProfile(newProfile)
    setMode('list')
  }

  const addEntry = () => {
    if (!newEntry.weight || !newEntry.height) return

    const entry: GrowthEntry = {
      id: Date.now(),
      date: newEntry.date,
      weight: parseFloat(newEntry.weight),
      height: parseFloat(newEntry.height),
      headCircumference: parseFloat(newEntry.headCircumference) || 0,
      notes: newEntry.notes,
    }
    setEntries([entry, ...entries])
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      height: '',
      headCircumference: '',
      notes: '',
    })
    setMode('list')
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const getAgeInMonths = () => {
    if (!profile) return 0
    const birth = new Date(profile.birthDate)
    const today = new Date()
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth())
    return months
  }

  const getAgeString = () => {
    const months = getAgeInMonths()
    if (months < 12) return `${months} ${t('tools.babyGrowthTracker.months')}`
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    return `${years}${t('tools.babyGrowthTracker.years')} ${remainingMonths}${t('tools.babyGrowthTracker.months')}`
  }

  const getGrowthChange = () => {
    if (entries.length < 2) return null
    const latest = entries[0]
    const previous = entries[1]
    return {
      weight: (latest.weight - previous.weight).toFixed(2),
      height: (latest.height - previous.height).toFixed(1),
    }
  }

  const milestones = [
    { month: 2, name: t('tools.babyGrowthTracker.milestone2m') },
    { month: 4, name: t('tools.babyGrowthTracker.milestone4m') },
    { month: 6, name: t('tools.babyGrowthTracker.milestone6m') },
    { month: 9, name: t('tools.babyGrowthTracker.milestone9m') },
    { month: 12, name: t('tools.babyGrowthTracker.milestone12m') },
  ]

  return (
    <div className="space-y-4">
      {mode === 'setup' && (
        <div className="card p-4 space-y-4">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">👶</div>
            <h2 className="text-lg font-bold">{t('tools.babyGrowthTracker.setupTitle')}</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.babyGrowthTracker.babyName')} *
            </label>
            <input
              type="text"
              value={newProfile.name}
              onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
              placeholder={t('tools.babyGrowthTracker.namePlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.babyGrowthTracker.birthDate')} *
            </label>
            <input
              type="date"
              value={newProfile.birthDate}
              onChange={(e) => setNewProfile({ ...newProfile, birthDate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.babyGrowthTracker.gender')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setNewProfile({ ...newProfile, gender: 'male' })}
                className={`flex-1 py-2 rounded ${
                  newProfile.gender === 'male' ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {t('tools.babyGrowthTracker.male')}
              </button>
              <button
                onClick={() => setNewProfile({ ...newProfile, gender: 'female' })}
                className={`flex-1 py-2 rounded ${
                  newProfile.gender === 'female' ? 'bg-pink-500 text-white' : 'bg-slate-100'
                }`}
              >
                {t('tools.babyGrowthTracker.female')}
              </button>
            </div>
          </div>

          <button
            onClick={saveProfile}
            disabled={!newProfile.name.trim() || !newProfile.birthDate}
            className="w-full py-2 bg-green-500 text-white rounded font-medium disabled:opacity-50"
          >
            {t('tools.babyGrowthTracker.startTracking')}
          </button>
        </div>
      )}

      {mode === 'list' && profile && (
        <>
          <div className="card p-4 text-center bg-blue-50">
            <div className="text-4xl mb-2">{profile.gender === 'male' ? '👦' : '👧'}</div>
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <div className="text-sm text-slate-600">{getAgeString()}</div>
          </div>

          <button
            onClick={() => setMode('add')}
            className="w-full py-3 bg-green-500 text-white rounded font-medium"
          >
            + {t('tools.babyGrowthTracker.addMeasurement')}
          </button>

          {entries.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              <div className="card p-3 text-center">
                <div className="text-xl font-bold text-blue-600">{entries[0].weight}kg</div>
                <div className="text-xs text-slate-500">{t('tools.babyGrowthTracker.weight')}</div>
                {getGrowthChange() && (
                  <div className={`text-xs ${Number(getGrowthChange()!.weight) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Number(getGrowthChange()!.weight) >= 0 ? '+' : ''}{getGrowthChange()!.weight}kg
                  </div>
                )}
              </div>
              <div className="card p-3 text-center">
                <div className="text-xl font-bold text-green-600">{entries[0].height}cm</div>
                <div className="text-xs text-slate-500">{t('tools.babyGrowthTracker.height')}</div>
                {getGrowthChange() && (
                  <div className="text-xs text-green-600">
                    +{getGrowthChange()!.height}cm
                  </div>
                )}
              </div>
              <div className="card p-3 text-center">
                <div className="text-xl font-bold text-purple-600">{entries[0].headCircumference || '-'}cm</div>
                <div className="text-xs text-slate-500">{t('tools.babyGrowthTracker.head')}</div>
              </div>
            </div>
          )}

          {entries.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.babyGrowthTracker.noMeasurements')}
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-700">{t('tools.babyGrowthTracker.history')}</h3>
              {entries.map(entry => (
                <div key={entry.id} className="card p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-slate-500">{entry.date}</div>
                      <div className="flex gap-3 mt-1 text-sm">
                        <span>{entry.weight}kg</span>
                        <span>{entry.height}cm</span>
                        {entry.headCircumference > 0 && <span>Head: {entry.headCircumference}cm</span>}
                      </div>
                    </div>
                    <button onClick={() => deleteEntry(entry.id)} className="text-red-500">×</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.babyGrowthTracker.milestones')}</h3>
            <div className="space-y-2">
              {milestones.map(milestone => {
                const isPast = getAgeInMonths() >= milestone.month
                return (
                  <div
                    key={milestone.month}
                    className={`flex items-center gap-2 p-2 rounded ${
                      isPast ? 'bg-green-50' : 'bg-slate-50'
                    }`}
                  >
                    <span className={isPast ? 'text-green-600' : 'text-slate-400'}>
                      {isPast ? '✓' : '○'}
                    </span>
                    <span className={`text-sm ${isPast ? 'text-green-700' : 'text-slate-500'}`}>
                      {milestone.month}m: {milestone.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {mode === 'add' && (
        <div className="card p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.babyGrowthTracker.date')}
            </label>
            <input
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.babyGrowthTracker.weight')} (kg) *
            </label>
            <input
              type="number"
              step="0.01"
              value={newEntry.weight}
              onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })}
              placeholder="5.5"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.babyGrowthTracker.height')} (cm) *
            </label>
            <input
              type="number"
              step="0.1"
              value={newEntry.height}
              onChange={(e) => setNewEntry({ ...newEntry, height: e.target.value })}
              placeholder="60"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.babyGrowthTracker.headCircumference')} (cm)
            </label>
            <input
              type="number"
              step="0.1"
              value={newEntry.headCircumference}
              onChange={(e) => setNewEntry({ ...newEntry, headCircumference: e.target.value })}
              placeholder="40"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.babyGrowthTracker.notes')}
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
              disabled={!newEntry.weight || !newEntry.height}
              className="flex-1 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.babyGrowthTracker.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
