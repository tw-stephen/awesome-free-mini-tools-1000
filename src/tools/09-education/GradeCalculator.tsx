import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Assignment {
  id: number
  name: string
  score: string
  maxScore: string
  weight: string
}

export default function GradeCalculator() {
  const { t } = useTranslation()
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 1, name: '', score: '', maxScore: '100', weight: '' }
  ])
  const [useWeights, setUseWeights] = useState(false)

  const addAssignment = () => {
    setAssignments([...assignments, { id: Date.now(), name: '', score: '', maxScore: '100', weight: '' }])
  }

  const updateAssignment = (id: number, field: keyof Assignment, value: string) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, [field]: value } : a))
  }

  const removeAssignment = (id: number) => {
    if (assignments.length > 1) {
      setAssignments(assignments.filter(a => a.id !== id))
    }
  }

  const result = useMemo(() => {
    const validAssignments = assignments.filter(a =>
      parseFloat(a.score) >= 0 && parseFloat(a.maxScore) > 0
    )

    if (validAssignments.length === 0) return null

    if (useWeights) {
      const totalWeight = validAssignments.reduce((sum, a) => sum + (parseFloat(a.weight) || 0), 0)
      if (totalWeight <= 0) return null

      const weightedSum = validAssignments.reduce((sum, a) => {
        const percentage = (parseFloat(a.score) / parseFloat(a.maxScore)) * 100
        const weight = parseFloat(a.weight) || 0
        return sum + (percentage * weight)
      }, 0)

      return {
        percentage: weightedSum / totalWeight,
        totalWeight,
        count: validAssignments.length,
      }
    } else {
      const totalEarned = validAssignments.reduce((sum, a) => sum + parseFloat(a.score), 0)
      const totalPossible = validAssignments.reduce((sum, a) => sum + parseFloat(a.maxScore), 0)

      return {
        percentage: (totalEarned / totalPossible) * 100,
        totalEarned,
        totalPossible,
        count: validAssignments.length,
      }
    }
  }, [assignments, useWeights])

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 93) return 'A'
    if (percentage >= 90) return 'A-'
    if (percentage >= 87) return 'B+'
    if (percentage >= 83) return 'B'
    if (percentage >= 80) return 'B-'
    if (percentage >= 77) return 'C+'
    if (percentage >= 73) return 'C'
    if (percentage >= 70) return 'C-'
    if (percentage >= 67) return 'D+'
    if (percentage >= 63) return 'D'
    if (percentage >= 60) return 'D-'
    return 'F'
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-700">{t('tools.gradeCalculator.assignments')}</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useWeights}
              onChange={(e) => setUseWeights(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">{t('tools.gradeCalculator.useWeights')}</span>
          </label>
        </div>

        <div className="space-y-2">
          {assignments.map((assignment, index) => (
            <div key={assignment.id} className="flex gap-2 items-center">
              <input
                type="text"
                value={assignment.name}
                onChange={(e) => updateAssignment(assignment.id, 'name', e.target.value)}
                placeholder={`${t('tools.gradeCalculator.assignment')} ${index + 1}`}
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
              />
              <input
                type="number"
                value={assignment.score}
                onChange={(e) => updateAssignment(assignment.id, 'score', e.target.value)}
                placeholder={t('tools.gradeCalculator.score')}
                className="w-16 px-2 py-1 border border-slate-300 rounded text-sm"
              />
              <span className="text-slate-400">/</span>
              <input
                type="number"
                value={assignment.maxScore}
                onChange={(e) => updateAssignment(assignment.id, 'maxScore', e.target.value)}
                placeholder="100"
                className="w-16 px-2 py-1 border border-slate-300 rounded text-sm"
              />
              {useWeights && (
                <>
                  <span className="text-slate-400">×</span>
                  <input
                    type="number"
                    value={assignment.weight}
                    onChange={(e) => updateAssignment(assignment.id, 'weight', e.target.value)}
                    placeholder="%"
                    className="w-14 px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </>
              )}
              <button
                onClick={() => removeAssignment(assignment.id)}
                className="text-red-500 hover:text-red-600 px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addAssignment}
          className="mt-3 w-full py-2 border border-dashed border-slate-300 rounded text-sm text-slate-500 hover:border-slate-400"
        >
          + {t('tools.gradeCalculator.addAssignment')}
        </button>
      </div>

      {result && (
        <div className="card p-4 bg-blue-50 text-center">
          <div className="text-sm text-slate-600">{t('tools.gradeCalculator.currentGrade')}</div>
          <div className="text-4xl font-bold text-blue-600">
            {result.percentage.toFixed(1)}%
          </div>
          <div className="text-2xl font-bold text-blue-500 mt-1">
            {getLetterGrade(result.percentage)}
          </div>
          <div className="text-sm text-slate-500 mt-2">
            {t('tools.gradeCalculator.basedOn')} {result.count} {t('tools.gradeCalculator.assignments')}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.gradeCalculator.gradeScale')}</h3>
        <div className="grid grid-cols-4 gap-2 text-sm">
          {[
            { grade: 'A', min: 93 }, { grade: 'A-', min: 90 },
            { grade: 'B+', min: 87 }, { grade: 'B', min: 83 },
            { grade: 'B-', min: 80 }, { grade: 'C+', min: 77 },
            { grade: 'C', min: 73 }, { grade: 'C-', min: 70 },
            { grade: 'D+', min: 67 }, { grade: 'D', min: 63 },
            { grade: 'D-', min: 60 }, { grade: 'F', min: 0 },
          ].map(({ grade, min }) => (
            <div key={grade} className={`p-1 text-center rounded ${result && getLetterGrade(result.percentage) === grade ? 'bg-blue-100 text-blue-700' : 'bg-slate-50'}`}>
              <div className="font-medium">{grade}</div>
              <div className="text-xs text-slate-500">{min}%+</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
