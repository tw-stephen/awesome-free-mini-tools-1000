import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface MoodEntry {
  id: number
  date: string
  time: string
  mood: number
  activities: string[]
  notes: string
}

export default function MoodTracker() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [mode, setMode] = useState<'list' | 'add'>('list')
  const [selectedMood, setSelectedMood] = useState(3)
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  const moods = ['😢', '😕', '😐', '🙂', '😊']
  const activities = [
    'work', 'exercise', 'family', 'friends', 'relax', 'hobby', 'sleep', 'food'
  ]

  useEffect(() => {
    const saved = localStorage.getItem('mood-tracker')
    if (saved) {
      try {
        setEntries(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load mood data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('mood-tracker', JSON.stringify(entries))
  }, [entries])

  const addEntry = () => {
    const entry: MoodEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: selectedMood,
      activities: selectedActivities,
      notes,
    }
    setEntries([entry, ...entries])
    setSelectedMood(3)
    setSelectedActivities([])
    setNotes('')
    setMode('list')
  }

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity]
    )
  }

  const last7Days = entries.filter(e => {
    const date = new Date(e.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return date >= weekAgo
  })

  const avgMood = last7Days.length > 0
    ? last7Days.reduce((sum, e) => sum + e.mood, 0) / last7Days.length
    : 0

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={() => setMode('add')}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.moodTracker.logMood')}
          </button>

          <div className="card p-4 text-center">
            <div className="text-sm text-slate-600">{t('tools.moodTracker.weeklyAvg')}</div>
            <div className="text-6xl my-2">{moods[Math.round(avgMood) - 1] || '😐'}</div>
            <div className="text-lg font-medium text-slate-700">{avgMood.toFixed(1)} / 5</div>
          </div>

          {last7Days.length > 0 && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.moodTracker.last7Days')}</h3>
              <div className="flex justify-between">
                {Array.from({ length: 7 }).map((_, i) => {
                  const date = new Date()
                  date.setDate(date.getDate() - (6 - i))
                  const dateStr = date.toISOString().split('T')[0]
                  const dayEntries = entries.filter(e => e.date === dateStr)
                  const avgDayMood = dayEntries.length > 0
                    ? dayEntries.reduce((sum, e) => sum + e.mood, 0) / dayEntries.length
                    : 0

                  return (
                    <div key={i} className="text-center">
                      <div className="text-xs text-slate-400">
                        {date.toLocaleDateString([], { weekday: 'short' })}
                      </div>
                      <div className="text-2xl">{avgDayMood ? moods[Math.round(avgDayMood) - 1] : '·'}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {entries.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.moodTracker.noEntries')}
            </div>
          ) : (
            <div className="space-y-2">
              {entries.slice(0, 10).map(entry => (
                <div key={entry.id} className="card p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{moods[entry.mood - 1]}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{entry.date} {entry.time}</div>
                      {entry.activities.length > 0 && (
                        <div className="text-xs text-slate-500">
                          {entry.activities.map(a => t(`tools.moodTracker.${a}`)).join(', ')}
                        </div>
                      )}
                      {entry.notes && (
                        <div className="text-sm text-slate-600 mt-1">{entry.notes}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {mode === 'add' && (
        <div className="card p-4 space-y-4">
          <div className="text-center">
            <div className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.moodTracker.howAreYou')}
            </div>
            <div className="flex justify-center gap-2">
              {moods.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMood(i + 1)}
                  className={`text-4xl p-2 rounded-lg transition ${
                    selectedMood === i + 1 ? 'bg-blue-100 scale-110' : 'opacity-50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.moodTracker.activities')}
            </div>
            <div className="flex flex-wrap gap-2">
              {activities.map(activity => (
                <button
                  key={activity}
                  onClick={() => toggleActivity(activity)}
                  className={`px-3 py-1.5 rounded text-sm ${
                    selectedActivities.includes(activity)
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100'
                  }`}
                >
                  {t(`tools.moodTracker.${activity}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.moodTracker.notes')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('tools.moodTracker.notesPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setMode('list')} className="flex-1 py-2 bg-slate-100 rounded">
              {t('common.cancel')}
            </button>
            <button onClick={addEntry} className="flex-1 py-2 bg-blue-500 text-white rounded">
              {t('tools.moodTracker.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
