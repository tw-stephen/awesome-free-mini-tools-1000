import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Participation {
  id: number
  date: string
  type: string
  notes: string
  quality: 'low' | 'medium' | 'high'
}

interface Course {
  id: number
  name: string
  instructor: string
  targetPerWeek: number
  participations: Participation[]
}

export default function ClassParticipationTracker() {
  const { t } = useTranslation()
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [newCourse, setNewCourse] = useState({ name: '', instructor: '', targetPerWeek: 3 })
  const [newParticipation, setNewParticipation] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Question',
    notes: '',
    quality: 'medium' as 'low' | 'medium' | 'high',
  })

  const participationTypes = ['Question', 'Answer', 'Discussion', 'Presentation', 'Group Work', 'Office Hours']

  const addCourse = () => {
    if (!newCourse.name.trim()) return
    setCourses([...courses, {
      ...newCourse,
      id: Date.now(),
      participations: [],
    }])
    setNewCourse({ name: '', instructor: '', targetPerWeek: 3 })
    setShowCourseForm(false)
  }

  const removeCourse = (id: number) => {
    setCourses(courses.filter(c => c.id !== id))
    if (selectedCourse === id) setSelectedCourse(null)
  }

  const addParticipation = () => {
    if (!selectedCourse) return
    setCourses(courses.map(c => {
      if (c.id !== selectedCourse) return c
      return {
        ...c,
        participations: [...c.participations, { ...newParticipation, id: Date.now() }],
      }
    }))
    setNewParticipation({
      date: new Date().toISOString().split('T')[0],
      type: 'Question',
      notes: '',
      quality: 'medium',
    })
  }

  const removeParticipation = (participationId: number) => {
    if (!selectedCourse) return
    setCourses(courses.map(c => {
      if (c.id !== selectedCourse) return c
      return {
        ...c,
        participations: c.participations.filter(p => p.id !== participationId),
      }
    }))
  }

  const currentCourse = courses.find(c => c.id === selectedCourse)

  const getWeeklyCount = (participations: Participation[]): number => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return participations.filter(p => new Date(p.date) >= weekAgo).length
  }

  const getQualityScore = (participations: Participation[]): number => {
    if (participations.length === 0) return 0
    const scores = { low: 1, medium: 2, high: 3 }
    const total = participations.reduce((sum, p) => sum + scores[p.quality], 0)
    return Math.round((total / (participations.length * 3)) * 100)
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Question': return '❓'
      case 'Answer': return '💡'
      case 'Discussion': return '💬'
      case 'Presentation': return '📊'
      case 'Group Work': return '👥'
      case 'Office Hours': return '🏢'
      default: return '📝'
    }
  }

  if (selectedCourse && currentCourse) {
    const weeklyCount = getWeeklyCount(currentCourse.participations)
    const qualityScore = getQualityScore(currentCourse.participations)
    const weeklyProgress = Math.min((weeklyCount / currentCourse.targetPerWeek) * 100, 100)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{currentCourse.name}</h2>
            {currentCourse.instructor && (
              <div className="text-sm text-slate-500">{currentCourse.instructor}</div>
            )}
          </div>
          <button onClick={() => setSelectedCourse(null)} className="text-blue-500">
            Back
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="card p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{weeklyCount}</div>
            <div className="text-xs text-slate-500">This Week</div>
          </div>
          <div className="card p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{currentCourse.participations.length}</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
          <div className="card p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{qualityScore}%</div>
            <div className="text-xs text-slate-500">Quality</div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Weekly Goal Progress</span>
            <span>{weeklyCount}/{currentCourse.targetPerWeek}</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full">
            <div
              className={`h-3 rounded-full ${weeklyProgress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${weeklyProgress}%` }}
            />
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.classParticipationTracker.logParticipation')}</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={newParticipation.date}
                onChange={(e) => setNewParticipation({ ...newParticipation, date: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <select
                value={newParticipation.type}
                onChange={(e) => setNewParticipation({ ...newParticipation, type: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                {participationTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={newParticipation.notes}
              onChange={(e) => setNewParticipation({ ...newParticipation, notes: e.target.value })}
              placeholder="What did you contribute? (optional)"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div>
              <label className="text-sm text-slate-500 block mb-1">Quality</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map(q => (
                  <button
                    key={q}
                    onClick={() => setNewParticipation({ ...newParticipation, quality: q })}
                    className={`flex-1 py-2 rounded capitalize ${
                      newParticipation.quality === q ? getQualityColor(q) : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={addParticipation}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Log Participation
            </button>
          </div>
        </div>

        {currentCourse.participations.length > 0 && (
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.classParticipationTracker.history')}</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {[...currentCourse.participations].reverse().map(p => (
                <div key={p.id} className="flex items-start justify-between p-2 bg-slate-50 rounded">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{getTypeIcon(p.type)}</span>
                    <div>
                      <div className="font-medium">{p.type}</div>
                      {p.notes && <div className="text-sm text-slate-500">{p.notes}</div>}
                      <div className="text-xs text-slate-400">{new Date(p.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs capitalize ${getQualityColor(p.quality)}`}>
                      {p.quality}
                    </span>
                    <button
                      onClick={() => removeParticipation(p.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      ×
                    </button>
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
      {!showCourseForm && (
        <button
          onClick={() => setShowCourseForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          + {t('tools.classParticipationTracker.addCourse')}
        </button>
      )}

      {showCourseForm && (
        <div className="card p-4 border-2 border-blue-300">
          <h3 className="font-medium mb-3">{t('tools.classParticipationTracker.addCourse')}</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              placeholder="Course name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={newCourse.instructor}
              onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
              placeholder="Instructor (optional)"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div>
              <label className="text-sm text-slate-500 block mb-1">Weekly Participation Goal</label>
              <input
                type="number"
                value={newCourse.targetPerWeek}
                onChange={(e) => setNewCourse({ ...newCourse, targetPerWeek: parseInt(e.target.value) || 1 })}
                min={1}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addCourse}
                disabled={!newCourse.name.trim()}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                Add Course
              </button>
              <button
                onClick={() => setShowCourseForm(false)}
                className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {courses.map(course => {
          const weeklyCount = getWeeklyCount(course.participations)
          return (
            <div
              key={course.id}
              className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedCourse(course.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{course.name}</div>
                  {course.instructor && (
                    <div className="text-sm text-slate-500">{course.instructor}</div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      weeklyCount >= course.targetPerWeek ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {weeklyCount}/{course.targetPerWeek} this week
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {course.participations.length} total
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeCourse(course.id) }}
                  className="text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {courses.length === 0 && !showCourseForm && (
        <div className="card p-8 text-center text-slate-500">
          Add a course to start tracking participation
        </div>
      )}
    </div>
  )
}
