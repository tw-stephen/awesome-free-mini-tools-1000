import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Assignment {
  id: number
  name: string
  score: number
  maxScore: number
  weight: number
  category: string
}

export default function GradeCalculator() {
  const { t } = useTranslation()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [newAssignment, setNewAssignment] = useState({
    name: '',
    score: 0,
    maxScore: 100,
    weight: 1,
    category: 'Homework',
  })

  const categories = ['Homework', 'Quiz', 'Test', 'Project', 'Exam', 'Participation']

  const addAssignment = () => {
    if (!newAssignment.name.trim()) return
    setAssignments([...assignments, { ...newAssignment, id: Date.now() }])
    setNewAssignment({ ...newAssignment, name: '', score: 0 })
  }

  const removeAssignment = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id))
  }

  const calculateOverallGrade = (): number => {
    if (assignments.length === 0) return 0

    const totalWeight = assignments.reduce((sum, a) => sum + a.weight, 0)
    const weightedSum = assignments.reduce((sum, a) => {
      const percentage = (a.score / a.maxScore) * 100
      return sum + percentage * a.weight
    }, 0)

    return totalWeight > 0 ? weightedSum / totalWeight : 0
  }

  const getLetterGrade = (percentage: number): string => {
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

  const getGradeColor = (percentage: number): string => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const overallGrade = calculateOverallGrade()
  const letterGrade = getLetterGrade(overallGrade)

  const categoryStats = categories.map(cat => {
    const catAssignments = assignments.filter(a => a.category === cat)
    const avg = catAssignments.length > 0
      ? catAssignments.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) / catAssignments.length
      : 0
    return { category: cat, count: catAssignments.length, average: avg }
  }).filter(s => s.count > 0)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.gradeCalculator.addAssignment')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newAssignment.name}
            onChange={(e) => setNewAssignment({ ...newAssignment, name: e.target.value })}
            placeholder="Assignment name"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="text-xs text-slate-500">Score</label>
              <input
                type="number"
                value={newAssignment.score}
                onChange={(e) => setNewAssignment({ ...newAssignment, score: parseFloat(e.target.value) || 0 })}
                min={0}
                className="w-full px-2 py-1 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Max Score</label>
              <input
                type="number"
                value={newAssignment.maxScore}
                onChange={(e) => setNewAssignment({ ...newAssignment, maxScore: parseFloat(e.target.value) || 100 })}
                min={1}
                className="w-full px-2 py-1 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Weight</label>
              <input
                type="number"
                value={newAssignment.weight}
                onChange={(e) => setNewAssignment({ ...newAssignment, weight: parseFloat(e.target.value) || 1 })}
                min={0.1}
                step={0.1}
                className="w-full px-2 py-1 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Category</label>
              <select
                value={newAssignment.category}
                onChange={(e) => setNewAssignment({ ...newAssignment, category: e.target.value })}
                className="w-full px-2 py-1 border border-slate-300 rounded"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={addAssignment}
            disabled={!newAssignment.name.trim()}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
          >
            Add Assignment
          </button>
        </div>
      </div>

      {assignments.length > 0 && (
        <>
          <div className="card p-6 text-center">
            <div className="text-sm text-slate-500 mb-2">Overall Grade</div>
            <div className={`text-5xl font-bold ${getGradeColor(overallGrade)}`}>
              {overallGrade.toFixed(1)}%
            </div>
            <div className={`text-3xl font-bold mt-2 ${getGradeColor(overallGrade)}`}>
              {letterGrade}
            </div>
          </div>

          {categoryStats.length > 0 && (
            <div className="card p-4">
              <h3 className="font-medium mb-3">{t('tools.gradeCalculator.byCategory')}</h3>
              <div className="space-y-2">
                {categoryStats.map(stat => (
                  <div key={stat.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stat.category}</span>
                      <span className="text-xs text-slate-400">({stat.count})</span>
                    </div>
                    <div className={`font-medium ${getGradeColor(stat.average)}`}>
                      {stat.average.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.gradeCalculator.assignments')} ({assignments.length})</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {assignments.map(a => {
                const percentage = (a.score / a.maxScore) * 100
                return (
                  <div key={a.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div>
                      <div className="font-medium">{a.name}</div>
                      <div className="text-xs text-slate-500">
                        {a.category} • Weight: {a.weight}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`font-medium ${getGradeColor(percentage)}`}>
                          {percentage.toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-500">
                          {a.score}/{a.maxScore}
                        </div>
                      </div>
                      <button
                        onClick={() => removeAssignment(a.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {assignments.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          Add assignments to calculate your grade
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.gradeCalculator.scale')}</h3>
        <div className="grid grid-cols-4 gap-2 text-sm text-center">
          <div className="p-2 bg-green-100 text-green-700 rounded">A: 93-100</div>
          <div className="p-2 bg-green-50 text-green-600 rounded">A-: 90-92</div>
          <div className="p-2 bg-blue-100 text-blue-700 rounded">B+: 87-89</div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded">B: 83-86</div>
          <div className="p-2 bg-blue-50 text-blue-500 rounded">B-: 80-82</div>
          <div className="p-2 bg-yellow-100 text-yellow-700 rounded">C+: 77-79</div>
          <div className="p-2 bg-yellow-50 text-yellow-600 rounded">C: 73-76</div>
          <div className="p-2 bg-yellow-50 text-yellow-500 rounded">C-: 70-72</div>
        </div>
      </div>
    </div>
  )
}
