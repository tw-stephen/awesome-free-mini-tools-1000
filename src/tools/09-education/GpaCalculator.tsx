import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Course {
  id: number
  name: string
  grade: string
  credits: string
}

const gradePoints: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0,
}

export default function GpaCalculator() {
  const { t } = useTranslation()
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: '', grade: 'A', credits: '3' }
  ])
  const [cumulativeGpa, setCumulativeGpa] = useState('')
  const [cumulativeCredits, setCumulativeCredits] = useState('')

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), name: '', grade: 'A', credits: '3' }])
  }

  const updateCourse = (id: number, field: keyof Course, value: string) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id))
    }
  }

  const result = useMemo(() => {
    const validCourses = courses.filter(c =>
      c.grade && parseFloat(c.credits) > 0
    )

    if (validCourses.length === 0) return null

    const totalPoints = validCourses.reduce((sum, c) => {
      return sum + (gradePoints[c.grade] * parseFloat(c.credits))
    }, 0)

    const totalCredits = validCourses.reduce((sum, c) => sum + parseFloat(c.credits), 0)
    const semesterGpa = totalPoints / totalCredits

    // Calculate cumulative if provided
    let cumulativeResult = null
    if (cumulativeGpa && cumulativeCredits) {
      const cumGpa = parseFloat(cumulativeGpa)
      const cumCredits = parseFloat(cumulativeCredits)
      const cumPoints = cumGpa * cumCredits

      const newCumGpa = (cumPoints + totalPoints) / (cumCredits + totalCredits)
      cumulativeResult = {
        gpa: newCumGpa,
        credits: cumCredits + totalCredits,
      }
    }

    return {
      semesterGpa,
      totalCredits,
      totalPoints,
      courseCount: validCourses.length,
      cumulativeResult,
    }
  }, [courses, cumulativeGpa, cumulativeCredits])

  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-green-600'
    if (gpa >= 3.0) return 'text-blue-600'
    if (gpa >= 2.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.gpaCalculator.semesterCourses')}</h3>
        <div className="space-y-2">
          {courses.map((course, index) => (
            <div key={course.id} className="flex gap-2 items-center">
              <input
                type="text"
                value={course.name}
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                placeholder={`${t('tools.gpaCalculator.course')} ${index + 1}`}
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
              />
              <select
                value={course.grade}
                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                className="px-2 py-1 border border-slate-300 rounded text-sm"
              >
                {Object.keys(gradePoints).map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              <input
                type="number"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                placeholder={t('tools.gpaCalculator.credits')}
                className="w-16 px-2 py-1 border border-slate-300 rounded text-sm"
                min="0"
                step="0.5"
              />
              <button
                onClick={() => removeCourse(course.id)}
                className="text-red-500 hover:text-red-600 px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addCourse}
          className="mt-3 w-full py-2 border border-dashed border-slate-300 rounded text-sm text-slate-500 hover:border-slate-400"
        >
          + {t('tools.gpaCalculator.addCourse')}
        </button>
      </div>

      {result && (
        <div className="card p-4 bg-blue-50 text-center">
          <div className="text-sm text-slate-600">{t('tools.gpaCalculator.semesterGpa')}</div>
          <div className={`text-4xl font-bold ${getGpaColor(result.semesterGpa)}`}>
            {result.semesterGpa.toFixed(2)}
          </div>
          <div className="text-sm text-slate-500 mt-2">
            {result.totalCredits} {t('tools.gpaCalculator.credits')} · {result.courseCount} {t('tools.gpaCalculator.courses')}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.gpaCalculator.cumulative')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.gpaCalculator.currentCumGpa')}</label>
            <input
              type="number"
              value={cumulativeGpa}
              onChange={(e) => setCumulativeGpa(e.target.value)}
              placeholder="3.50"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              step="0.01"
              min="0"
              max="4"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.gpaCalculator.totalCredits')}</label>
            <input
              type="number"
              value={cumulativeCredits}
              onChange={(e) => setCumulativeCredits(e.target.value)}
              placeholder="60"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              min="0"
            />
          </div>
        </div>

        {result?.cumulativeResult && (
          <div className="mt-4 p-3 bg-green-50 rounded text-center">
            <div className="text-sm text-slate-600">{t('tools.gpaCalculator.newCumulativeGpa')}</div>
            <div className={`text-2xl font-bold ${getGpaColor(result.cumulativeResult.gpa)}`}>
              {result.cumulativeResult.gpa.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500">
              {result.cumulativeResult.credits} {t('tools.gpaCalculator.totalCredits')}
            </div>
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.gpaCalculator.gradeScale')}</h3>
        <div className="grid grid-cols-4 gap-1 text-xs">
          {Object.entries(gradePoints).map(([grade, points]) => (
            <div key={grade} className="p-1 text-center bg-slate-50 rounded">
              <span className="font-medium">{grade}</span>
              <span className="text-slate-400 ml-1">= {points.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
