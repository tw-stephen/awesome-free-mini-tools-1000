import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Course {
  id: number
  name: string
  credits: number
  grade: string
}

export default function GPACalculator() {
  const { t } = useTranslation()
  const [courses, setCourses] = useState<Course[]>([])
  const [newCourse, setNewCourse] = useState({ name: '', credits: 3, grade: 'A' })
  const [scale, setScale] = useState<'4.0' | '4.3'>('4.0')

  const gradePoints: { [key: string]: { [scale: string]: number } } = {
    'A+': { '4.0': 4.0, '4.3': 4.3 },
    'A': { '4.0': 4.0, '4.3': 4.0 },
    'A-': { '4.0': 3.7, '4.3': 3.7 },
    'B+': { '4.0': 3.3, '4.3': 3.3 },
    'B': { '4.0': 3.0, '4.3': 3.0 },
    'B-': { '4.0': 2.7, '4.3': 2.7 },
    'C+': { '4.0': 2.3, '4.3': 2.3 },
    'C': { '4.0': 2.0, '4.3': 2.0 },
    'C-': { '4.0': 1.7, '4.3': 1.7 },
    'D+': { '4.0': 1.3, '4.3': 1.3 },
    'D': { '4.0': 1.0, '4.3': 1.0 },
    'D-': { '4.0': 0.7, '4.3': 0.7 },
    'F': { '4.0': 0.0, '4.3': 0.0 },
  }

  const grades = Object.keys(gradePoints)

  const addCourse = () => {
    if (!newCourse.name.trim()) return
    setCourses([...courses, { ...newCourse, id: Date.now() }])
    setNewCourse({ name: '', credits: 3, grade: 'A' })
  }

  const removeCourse = (id: number) => {
    setCourses(courses.filter(c => c.id !== id))
  }

  const updateCourse = (id: number, field: keyof Course, value: string | number) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const calculateGPA = (): number => {
    if (courses.length === 0) return 0

    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0)
    const totalPoints = courses.reduce((sum, c) => {
      return sum + (gradePoints[c.grade]?.[scale] || 0) * c.credits
    }, 0)

    return totalCredits > 0 ? totalPoints / totalCredits : 0
  }

  const gpa = calculateGPA()
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0)

  const getGPAColor = (gpa: number): string => {
    if (gpa >= 3.5) return 'text-green-600'
    if (gpa >= 3.0) return 'text-blue-600'
    if (gpa >= 2.5) return 'text-yellow-600'
    if (gpa >= 2.0) return 'text-orange-600'
    return 'text-red-600'
  }

  const getGPADescription = (gpa: number): string => {
    if (gpa >= 3.9) return "Dean's List"
    if (gpa >= 3.5) return 'Honors'
    if (gpa >= 3.0) return 'Good Standing'
    if (gpa >= 2.0) return 'Satisfactory'
    return 'Academic Probation'
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.gpaCalculator.scale')}</h3>
          <div className="flex gap-2">
            {(['4.0', '4.3'] as const).map(s => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`px-3 py-1 rounded ${scale === s ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                {s} Scale
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.gpaCalculator.addCourse')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newCourse.name}
            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            placeholder="Course name"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500">Credits</label>
              <select
                value={newCourse.credits}
                onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                {[1, 2, 3, 4, 5, 6].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500">Grade</label>
              <select
                value={newCourse.grade}
                onChange={(e) => setNewCourse({ ...newCourse, grade: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                {grades.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={addCourse}
            disabled={!newCourse.name.trim()}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
          >
            Add Course
          </button>
        </div>
      </div>

      {courses.length > 0 && (
        <>
          <div className="card p-6 text-center">
            <div className="text-sm text-slate-500 mb-2">Cumulative GPA</div>
            <div className={`text-5xl font-bold ${getGPAColor(gpa)}`}>
              {gpa.toFixed(2)}
            </div>
            <div className={`text-lg mt-2 ${getGPAColor(gpa)}`}>
              {getGPADescription(gpa)}
            </div>
            <div className="text-sm text-slate-500 mt-2">
              {totalCredits} Total Credits
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.gpaCalculator.courses')} ({courses.length})</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {courses.map(course => (
                <div key={course.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <div className="flex-1">
                    <div className="font-medium">{course.name}</div>
                    <div className="text-xs text-slate-500">{course.credits} credits</div>
                  </div>
                  <select
                    value={course.grade}
                    onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                    className="px-2 py-1 border border-slate-300 rounded text-sm"
                  >
                    {grades.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <div className="w-12 text-center font-medium">
                    {gradePoints[course.grade]?.[scale].toFixed(1)}
                  </div>
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {courses.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          Add courses to calculate your GPA
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.gpaCalculator.gradePoints')}</h3>
        <div className="grid grid-cols-4 gap-2 text-sm">
          {grades.map(g => (
            <div key={g} className="flex justify-between p-2 bg-slate-50 rounded">
              <span className="font-medium">{g}</span>
              <span className="text-slate-500">{gradePoints[g][scale].toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
