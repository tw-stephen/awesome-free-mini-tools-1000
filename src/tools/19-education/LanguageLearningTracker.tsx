import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface LearningSession {
  id: number
  date: string
  duration: number
  activity: string
  notes: string
}

interface Language {
  id: number
  name: string
  level: string
  targetLevel: string
  sessions: LearningSession[]
  streak: number
  lastPractice: string
}

export default function LanguageLearningTracker() {
  const { t } = useTranslation()
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<number | null>(null)
  const [showLangForm, setShowLangForm] = useState(false)
  const [newLanguage, setNewLanguage] = useState({ name: '', level: 'A1', targetLevel: 'B2' })
  const [newSession, setNewSession] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: 30,
    activity: 'Vocabulary',
    notes: '',
  })

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  const activities = ['Vocabulary', 'Grammar', 'Speaking', 'Listening', 'Reading', 'Writing', 'Conversation', 'App Practice']

  const addLanguage = () => {
    if (!newLanguage.name.trim()) return
    setLanguages([...languages, {
      ...newLanguage,
      id: Date.now(),
      sessions: [],
      streak: 0,
      lastPractice: '',
    }])
    setNewLanguage({ name: '', level: 'A1', targetLevel: 'B2' })
    setShowLangForm(false)
  }

  const removeLanguage = (id: number) => {
    setLanguages(languages.filter(l => l.id !== id))
    if (selectedLanguage === id) setSelectedLanguage(null)
  }

  const addSession = () => {
    if (!selectedLanguage) return
    const today = new Date().toISOString().split('T')[0]

    setLanguages(languages.map(lang => {
      if (lang.id !== selectedLanguage) return lang

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      let newStreak = lang.streak
      if (lang.lastPractice === yesterdayStr) {
        newStreak = lang.streak + 1
      } else if (lang.lastPractice !== today) {
        newStreak = 1
      }

      return {
        ...lang,
        sessions: [...lang.sessions, { ...newSession, id: Date.now() }],
        streak: newStreak,
        lastPractice: today,
      }
    }))
    setNewSession({
      date: new Date().toISOString().split('T')[0],
      duration: 30,
      activity: 'Vocabulary',
      notes: '',
    })
  }

  const currentLanguage = languages.find(l => l.id === selectedLanguage)

  const getTotalTime = (sessions: LearningSession[]): number => {
    return sessions.reduce((sum, s) => sum + s.duration, 0)
  }

  const getWeeklyTime = (sessions: LearningSession[]): number => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return sessions
      .filter(s => new Date(s.date) >= weekAgo)
      .reduce((sum, s) => sum + s.duration, 0)
  }

  const getLevelProgress = (current: string, target: string): number => {
    const currentIndex = levels.indexOf(current)
    const targetIndex = levels.indexOf(target)
    if (targetIndex <= currentIndex) return 100
    return Math.round((currentIndex / targetIndex) * 100)
  }

  if (selectedLanguage && currentLanguage) {
    const totalMinutes = getTotalTime(currentLanguage.sessions)
    const weeklyMinutes = getWeeklyTime(currentLanguage.sessions)
    const progress = getLevelProgress(currentLanguage.level, currentLanguage.targetLevel)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{currentLanguage.name}</h2>
            <div className="text-sm text-slate-500">
              {currentLanguage.level} → {currentLanguage.targetLevel}
            </div>
          </div>
          <button onClick={() => setSelectedLanguage(null)} className="text-blue-500">
            Back
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="card p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">{currentLanguage.streak}</div>
            <div className="text-xs text-slate-500">Day Streak</div>
          </div>
          <div className="card p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(weeklyMinutes / 60)}h</div>
            <div className="text-xs text-slate-500">This Week</div>
          </div>
          <div className="card p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{Math.round(totalMinutes / 60)}h</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex justify-between text-sm mb-2">
            <span>{currentLanguage.level}</span>
            <span>{currentLanguage.targetLevel}</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full">
            <div
              className="h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center text-sm text-slate-500 mt-1">{progress}% to goal</div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.languageLearningTracker.logSession')}</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <input
                type="date"
                value={newSession.date}
                onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                className="px-2 py-1 border border-slate-300 rounded text-sm"
              />
              <select
                value={newSession.activity}
                onChange={(e) => setNewSession({ ...newSession, activity: e.target.value })}
                className="px-2 py-1 border border-slate-300 rounded text-sm"
              >
                {activities.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={newSession.duration}
                  onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) || 0 })}
                  min={5}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                />
                <span className="text-sm text-slate-500">min</span>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSession.notes}
                onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                placeholder="Notes (optional)"
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
              />
              <button
                onClick={addSession}
                className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Log
              </button>
            </div>
          </div>
        </div>

        {currentLanguage.sessions.length > 0 && (
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.languageLearningTracker.history')}</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {[...currentLanguage.sessions].reverse().slice(0, 10).map(session => (
                <div key={session.id} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                  <div>
                    <span className="font-medium">{session.activity}</span>
                    {session.notes && (
                      <span className="text-slate-500 ml-2">- {session.notes}</span>
                    )}
                  </div>
                  <div className="text-right text-slate-500">
                    <div>{session.duration} min</div>
                    <div className="text-xs">{new Date(session.date).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!showLangForm && (
        <button
          onClick={() => setShowLangForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          + {t('tools.languageLearningTracker.addLanguage')}
        </button>
      )}

      {showLangForm && (
        <div className="card p-4 border-2 border-blue-300">
          <h3 className="font-medium mb-3">{t('tools.languageLearningTracker.addLanguage')}</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newLanguage.name}
              onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
              placeholder="Language (e.g., Spanish, Japanese)"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-500">Current Level</label>
                <select
                  value={newLanguage.level}
                  onChange={(e) => setNewLanguage({ ...newLanguage, level: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                >
                  {levels.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500">Target Level</label>
                <select
                  value={newLanguage.targetLevel}
                  onChange={(e) => setNewLanguage({ ...newLanguage, targetLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                >
                  {levels.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addLanguage}
                disabled={!newLanguage.name.trim()}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                Add Language
              </button>
              <button
                onClick={() => setShowLangForm(false)}
                className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {languages.map(lang => (
          <div
            key={lang.id}
            className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedLanguage(lang.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{lang.name}</div>
                <div className="text-sm text-slate-500">
                  {lang.level} → {lang.targetLevel}
                </div>
                <div className="flex gap-2 mt-2 text-xs">
                  {lang.streak > 0 && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                      {lang.streak} day streak
                    </span>
                  )}
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {Math.round(getTotalTime(lang.sessions) / 60)}h total
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeLanguage(lang.id) }}
                className="text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {languages.length === 0 && !showLangForm && (
        <div className="card p-8 text-center text-slate-500">
          Add a language to start tracking your learning
        </div>
      )}
    </div>
  )
}
