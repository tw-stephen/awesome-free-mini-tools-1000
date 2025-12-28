import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Goal {
  id: number
  description: string
  achievement: 'exceeded' | 'met' | 'partial' | 'missed'
  comments: string
}

interface Competency {
  id: number
  name: string
  rating: number
  comments: string
}

export default function PerformanceReviewTemplate() {
  const { t } = useTranslation()
  const [employeeName, setEmployeeName] = useState('')
  const [managerName, setManagerName] = useState('')
  const [reviewPeriod, setReviewPeriod] = useState('')
  const [overallRating, setOverallRating] = useState(3)
  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, description: '', achievement: 'met', comments: '' }
  ])
  const [competencies, setCompetencies] = useState<Competency[]>([
    { id: 1, name: 'Communication', rating: 3, comments: '' },
    { id: 2, name: 'Teamwork', rating: 3, comments: '' },
    { id: 3, name: 'Problem Solving', rating: 3, comments: '' },
    { id: 4, name: 'Leadership', rating: 3, comments: '' },
    { id: 5, name: 'Technical Skills', rating: 3, comments: '' },
  ])
  const [strengths, setStrengths] = useState('')
  const [improvements, setImprovements] = useState('')
  const [nextGoals, setNextGoals] = useState('')

  const addGoal = () => {
    setGoals([...goals, { id: Date.now(), description: '', achievement: 'met', comments: '' }])
  }

  const updateGoal = (id: number, field: keyof Goal, value: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, [field]: value } : g))
  }

  const removeGoal = (id: number) => {
    if (goals.length > 1) setGoals(goals.filter(g => g.id !== id))
  }

  const updateCompetency = (id: number, field: 'rating' | 'comments', value: number | string) => {
    setCompetencies(competencies.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const ratingLabels = ['Poor', 'Below Expectations', 'Meets Expectations', 'Exceeds Expectations', 'Outstanding']
  const achievementLabels: Record<string, { label: string; color: string }> = {
    'exceeded': { label: 'Exceeded', color: 'bg-green-100 text-green-700' },
    'met': { label: 'Met', color: 'bg-blue-100 text-blue-700' },
    'partial': { label: 'Partially Met', color: 'bg-yellow-100 text-yellow-700' },
    'missed': { label: 'Not Met', color: 'bg-red-100 text-red-700' },
  }

  const generateReview = (): string => {
    let text = `PERFORMANCE REVIEW\\n${'='.repeat(50)}\\n\\n`
    text += `Employee: ${employeeName || '[Name]'}\\n`
    text += `Manager: ${managerName || '[Manager]'}\\n`
    text += `Review Period: ${reviewPeriod || '[Period]'}\\n`
    text += `Overall Rating: ${overallRating}/5 - ${ratingLabels[overallRating - 1]}\\n\\n`

    text += `GOAL ACHIEVEMENT\\n${'─'.repeat(30)}\\n`
    goals.forEach((g, i) => {
      if (g.description) {
        text += `${i + 1}. ${g.description}\\n`
        text += `   Status: ${achievementLabels[g.achievement].label}\\n`
        if (g.comments) text += `   Comments: ${g.comments}\\n`
      }
    })
    text += '\\n'

    text += `COMPETENCY RATINGS\\n${'─'.repeat(30)}\\n`
    competencies.forEach(c => {
      text += `${c.name}: ${c.rating}/5 - ${ratingLabels[c.rating - 1]}\\n`
      if (c.comments) text += `   ${c.comments}\\n`
    })
    text += '\\n'

    if (strengths) text += `STRENGTHS\\n${'─'.repeat(30)}\\n${strengths}\\n\\n`
    if (improvements) text += `AREAS FOR IMPROVEMENT\\n${'─'.repeat(30)}\\n${improvements}\\n\\n`
    if (nextGoals) text += `GOALS FOR NEXT PERIOD\\n${'─'.repeat(30)}\\n${nextGoals}\\n`

    return text
  }

  const copyReview = () => {
    navigator.clipboard.writeText(generateReview())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.performanceReviewTemplate.details')}</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Employee</label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="Employee name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Manager</label>
            <input
              type="text"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder="Manager name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Review Period</label>
            <input
              type="text"
              value={reviewPeriod}
              onChange={(e) => setReviewPeriod(e.target.value)}
              placeholder="e.g., Q4 2024"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.performanceReviewTemplate.overall')}</h3>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="5"
            value={overallRating}
            onChange={(e) => setOverallRating(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className={`px-4 py-2 rounded font-medium ${
            overallRating >= 4 ? 'bg-green-100 text-green-700' :
            overallRating === 3 ? 'bg-blue-100 text-blue-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {overallRating}/5 - {ratingLabels[overallRating - 1]}
          </span>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.performanceReviewTemplate.goals')}</h3>
          <button
            onClick={addGoal}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            + Add Goal
          </button>
        </div>
        <div className="space-y-3">
          {goals.map((goal, index) => (
            <div key={goal.id} className="p-3 bg-slate-50 rounded">
              <div className="flex gap-2 mb-2">
                <span className="px-2 py-1 bg-slate-200 rounded text-sm">{index + 1}</span>
                <input
                  type="text"
                  value={goal.description}
                  onChange={(e) => updateGoal(goal.id, 'description', e.target.value)}
                  placeholder="Goal description"
                  className="flex-1 px-3 py-1 border border-slate-300 rounded"
                />
                <select
                  value={goal.achievement}
                  onChange={(e) => updateGoal(goal.id, 'achievement', e.target.value)}
                  className={`px-3 py-1 rounded ${achievementLabels[goal.achievement].color}`}
                >
                  {Object.entries(achievementLabels).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <button onClick={() => removeGoal(goal.id)} className="px-2 text-red-500">✕</button>
              </div>
              <input
                type="text"
                value={goal.comments}
                onChange={(e) => updateGoal(goal.id, 'comments', e.target.value)}
                placeholder="Comments (optional)"
                className="w-full px-3 py-1 text-sm border border-slate-300 rounded"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.performanceReviewTemplate.competencies')}</h3>
        <div className="space-y-3">
          {competencies.map((comp) => (
            <div key={comp.id} className="p-3 bg-slate-50 rounded">
              <div className="flex items-center gap-4 mb-2">
                <span className="w-32 font-medium">{comp.name}</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={comp.rating}
                  onChange={(e) => updateCompetency(comp.id, 'rating', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className={`px-3 py-1 rounded text-sm ${
                  comp.rating >= 4 ? 'bg-green-100 text-green-700' :
                  comp.rating === 3 ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {comp.rating}/5
                </span>
              </div>
              <input
                type="text"
                value={comp.comments}
                onChange={(e) => updateCompetency(comp.id, 'comments', e.target.value)}
                placeholder="Comments (optional)"
                className="w-full px-3 py-1 text-sm border border-slate-300 rounded"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-4">
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.performanceReviewTemplate.strengths')}</label>
          <textarea
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            placeholder="Key strengths and achievements..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.performanceReviewTemplate.improvements')}</label>
          <textarea
            value={improvements}
            onChange={(e) => setImprovements(e.target.value)}
            placeholder="Areas for development..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.performanceReviewTemplate.nextGoals')}</label>
          <textarea
            value={nextGoals}
            onChange={(e) => setNextGoals(e.target.value)}
            placeholder="Goals for next review period..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.performanceReviewTemplate.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
          {generateReview()}
        </pre>
        <button
          onClick={copyReview}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.performanceReviewTemplate.copy')}
        </button>
      </div>
    </div>
  )
}
