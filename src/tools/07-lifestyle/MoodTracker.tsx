import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface MoodEntry {
  id: number
  date: string
  time: string
  mood: number
  activities: string[]
  notes?: string
}

export default function MoodTracker() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [selectedMood, setSelectedMood] = useState(3)
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  const moods = [
    { value: 1, emoji: '😢', label: 'Very Sad', color: 'bg-red-500' },
    { value: 2, emoji: '😞', label: 'Sad', color: 'bg-orange-500' },
    { value: 3, emoji: '😐', label: 'Neutral', color: 'bg-yellow-500' },
    { value: 4, emoji: '😊', label: 'Happy', color: 'bg-green-400' },
    { value: 5, emoji: '😄', label: 'Very Happy', color: 'bg-green-600' },
  ]

  const activities = [
    { id: 'exercise', emoji: '🏃', label: 'Exercise' },
    { id: 'work', emoji: '💼', label: 'Work' },
    { id: 'social', emoji: '👥', label: 'Social' },
    { id: 'family', emoji: '👨‍👩‍👧', label: 'Family' },
    { id: 'hobby', emoji: '🎨', label: 'Hobby' },
    { id: 'rest', emoji: '😴', label: 'Rest' },
    { id: 'nature', emoji: '🌿', label: 'Nature' },
    { id: 'food', emoji: '🍽️', label: 'Good Food' },
    { id: 'music', emoji: '🎵', label: 'Music' },
    { id: 'reading', emoji: '📚', label: 'Reading' },
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

  const toggleActivity = (activityId: string) => {
    setSelectedActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(a => a !== activityId)
        : [...prev, activityId]
    )
  }

  const saveEntry = () => {
    const now = new Date()
    const entry: MoodEntry = {
      id: Date.now(),
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      mood: selectedMood,
      activities: selectedActivities,
      notes: notes || undefined,
    }
    setEntries([entry, ...entries])
    setSelectedMood(3)
    setSelectedActivities([])
    setNotes('')
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const stats = useMemo(() => {
    if (entries.length === 0) return null

    const last7Days = entries.filter(e => {
      const entryDate = new Date(e.date)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return entryDate >= weekAgo
    })

    const avgMood = last7Days.length > 0
      ? last7Days.reduce((sum, e) => sum + e.mood, 0) / last7Days.length
      : 0

    const activityCounts: Record<string, number> = {}
    last7Days.forEach(e => {
      e.activities.forEach(a => {
        activityCounts[a] = (activityCounts[a] || 0) + 1
      })
    })

    const topActivities = Object.entries(activityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id)

    return { avgMood, entriesCount: last7Days.length, topActivities }
  }, [entries])

  const getMoodForDate = (dateStr: string) => {
    const dayEntries = entries.filter(e => e.date === dateStr)
    if (dayEntries.length === 0) return null
    return dayEntries.reduce((sum, e) => sum + e.mood, 0) / dayEntries.length
  }

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      date: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en', { weekday: 'short' }),
    }
  })

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.moodTracker.howAreYou')}
        </h3>
        <div className="flex justify-between mb-4">
          {moods.map(mood => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-transform ${
                selectedMood === mood.value ? 'scale-125 ring-4 ring-blue-200' : ''
              }`}
            >
              {mood.emoji}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <h4 className="text-xs text-slate-500 mb-2">{t('tools.moodTracker.activities')}</h4>
          <div className="flex flex-wrap gap-2">
            {activities.map(activity => (
              <button
                key={activity.id}
                onClick={() => toggleActivity(activity.id)}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  selectedActivities.includes(activity.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100'
                }`}
              >
                <span>{activity.emoji}</span>
                <span>{activity.label}</span>
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('tools.moodTracker.notes')}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm mb-3"
        />

        <button
          onClick={saveEntry}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.moodTracker.logMood')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.moodTracker.weekOverview')}
        </h3>
        <div className="flex items-end gap-2 h-24 mb-2">
          {last7Days.map(day => {
            const avgMood = getMoodForDate(day.date)
            const height = avgMood ? (avgMood / 5) * 100 : 0
            const moodData = avgMood ? moods.find(m => m.value === Math.round(avgMood)) : null

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div className="flex-1 w-full flex items-end">
                  {avgMood ? (
                    <div
                      className={`w-full rounded-t ${moodData?.color || 'bg-slate-300'}`}
                      style={{ height: `${height}%` }}
                    />
                  ) : (
                    <div className="w-full h-1 bg-slate-200 rounded" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex gap-2">
          {last7Days.map(day => (
            <div key={day.date} className="flex-1 text-center text-xs text-slate-500">
              {day.day}
            </div>
          ))}
        </div>
      </div>

      {stats && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.moodTracker.stats')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded text-center">
              <div className="text-2xl">
                {moods.find(m => m.value === Math.round(stats.avgMood))?.emoji || '😐'}
              </div>
              <div className="text-xs text-slate-500">{t('tools.moodTracker.avgMood')}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.entriesCount}</div>
              <div className="text-xs text-slate-500">{t('tools.moodTracker.entries')}</div>
            </div>
          </div>
          {stats.topActivities.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-500 mb-2">{t('tools.moodTracker.topActivities')}</div>
              <div className="flex gap-2">
                {stats.topActivities.map(actId => {
                  const activity = activities.find(a => a.id === actId)
                  return activity ? (
                    <span key={actId} className="px-2 py-1 bg-slate-100 rounded text-sm">
                      {activity.emoji} {activity.label}
                    </span>
                  ) : null
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {entries.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.moodTracker.history')}
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {entries.slice(0, 20).map(entry => (
              <div key={entry.id} className="flex items-start justify-between p-2 bg-slate-50 rounded">
                <div className="flex gap-3">
                  <span className="text-2xl">
                    {moods.find(m => m.value === entry.mood)?.emoji}
                  </span>
                  <div>
                    <div className="text-xs text-slate-500">{entry.date} {entry.time}</div>
                    {entry.activities.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {entry.activities.map(actId => {
                          const activity = activities.find(a => a.id === actId)
                          return activity ? (
                            <span key={actId} className="text-sm">{activity.emoji}</span>
                          ) : null
                        })}
                      </div>
                    )}
                    {entry.notes && <div className="text-xs text-slate-400 mt-1">{entry.notes}</div>}
                  </div>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.moodTracker.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.moodTracker.tip1')}</li>
          <li>{t('tools.moodTracker.tip2')}</li>
          <li>{t('tools.moodTracker.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
