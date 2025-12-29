import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Step {
  id: string
  text: string
  completed: boolean
  dueDate?: string
}

interface Goal {
  id: string
  title: string
  description: string
  deadline?: string
  steps: Step[]
  createdAt: string
}

export default function GoalBreakdown() {
  const { t } = useTranslation()
  const [goals, setGoals] = useState<Goal[]>([])
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [newGoalDescription, setNewGoalDescription] = useState('')
  const [newGoalDeadline, setNewGoalDeadline] = useState('')
  const [newStep, setNewStep] = useState('')
  const [stepDueDate, setStepDueDate] = useState('')
  const [showNewGoal, setShowNewGoal] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('goal-breakdown')
    if (saved) {
      const data = JSON.parse(saved)
      setGoals(data)
      if (data.length > 0) setSelectedGoal(data[0])
    }
  }, [])

  const saveGoals = (updated: Goal[]) => {
    setGoals(updated)
    localStorage.setItem('goal-breakdown', JSON.stringify(updated))
  }

  const createGoal = () => {
    if (!newGoalTitle.trim()) return
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      description: newGoalDescription,
      deadline: newGoalDeadline || undefined,
      steps: [],
      createdAt: new Date().toISOString()
    }
    const updated = [goal, ...goals]
    saveGoals(updated)
    setSelectedGoal(goal)
    setNewGoalTitle('')
    setNewGoalDescription('')
    setNewGoalDeadline('')
    setShowNewGoal(false)
  }

  const deleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id)
    saveGoals(updated)
    setSelectedGoal(updated.length > 0 ? updated[0] : null)
  }

  const addStep = () => {
    if (!selectedGoal || !newStep.trim()) return
    const step: Step = {
      id: Date.now().toString(),
      text: newStep,
      completed: false,
      dueDate: stepDueDate || undefined
    }
    const updated = goals.map(g => {
      if (g.id === selectedGoal.id) {
        return { ...g, steps: [...g.steps, step] }
      }
      return g
    })
    saveGoals(updated)
    setSelectedGoal(updated.find(g => g.id === selectedGoal.id) || null)
    setNewStep('')
    setStepDueDate('')
  }

  const toggleStep = (stepId: string) => {
    if (!selectedGoal) return
    const updated = goals.map(g => {
      if (g.id === selectedGoal.id) {
        return {
          ...g,
          steps: g.steps.map(s =>
            s.id === stepId ? { ...s, completed: !s.completed } : s
          )
        }
      }
      return g
    })
    saveGoals(updated)
    setSelectedGoal(updated.find(g => g.id === selectedGoal.id) || null)
  }

  const removeStep = (stepId: string) => {
    if (!selectedGoal) return
    const updated = goals.map(g => {
      if (g.id === selectedGoal.id) {
        return { ...g, steps: g.steps.filter(s => s.id !== stepId) }
      }
      return g
    })
    saveGoals(updated)
    setSelectedGoal(updated.find(g => g.id === selectedGoal.id) || null)
  }

  const getProgress = (goal: Goal) => {
    if (goal.steps.length === 0) return 0
    const completed = goal.steps.filter(s => s.completed).length
    return Math.round((completed / goal.steps.length) * 100)
  }

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">{t('tools.goalBreakdown.yourGoals')}</h3>
          <button
            onClick={() => setShowNewGoal(!showNewGoal)}
            className="text-sm text-blue-500"
          >
            {showNewGoal ? t('tools.goalBreakdown.cancel') : t('tools.goalBreakdown.newGoal')}
          </button>
        </div>

        {showNewGoal && (
          <div className="space-y-2 mb-3 p-3 bg-slate-50 rounded">
            <input
              type="text"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              placeholder={t('tools.goalBreakdown.goalTitle')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <textarea
              value={newGoalDescription}
              onChange={(e) => setNewGoalDescription(e.target.value)}
              placeholder={t('tools.goalBreakdown.goalDescription')}
              className="w-full px-3 py-2 border border-slate-300 rounded h-16"
            />
            <input
              type="date"
              value={newGoalDeadline}
              onChange={(e) => setNewGoalDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <button
              onClick={createGoal}
              disabled={!newGoalTitle.trim()}
              className="w-full py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.goalBreakdown.create')}
            </button>
          </div>
        )}

        <div className="space-y-2">
          {goals.map(goal => (
            <button
              key={goal.id}
              onClick={() => setSelectedGoal(goal)}
              className={`w-full p-3 rounded text-left ${
                selectedGoal?.id === goal.id
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{goal.title}</div>
                  <div className="text-xs text-slate-500">
                    {goal.steps.length} {t('tools.goalBreakdown.steps')} | {getProgress(goal)}% {t('tools.goalBreakdown.complete')}
                  </div>
                </div>
                {goal.deadline && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    getDaysRemaining(goal.deadline) < 0 ? 'bg-red-100 text-red-700' :
                    getDaysRemaining(goal.deadline) <= 7 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {getDaysRemaining(goal.deadline)} {t('tools.goalBreakdown.daysLeft')}
                  </span>
                )}
              </div>
              <div className="mt-2 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all"
                  style={{ width: `${getProgress(goal)}%` }}
                />
              </div>
            </button>
          ))}
          {goals.length === 0 && (
            <div className="text-center text-slate-400 py-4">
              {t('tools.goalBreakdown.noGoals')}
            </div>
          )}
        </div>
      </div>

      {selectedGoal && (
        <div className="card p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="font-bold text-lg">{selectedGoal.title}</h2>
              {selectedGoal.description && (
                <p className="text-sm text-slate-500">{selectedGoal.description}</p>
              )}
            </div>
            <button
              onClick={() => deleteGoal(selectedGoal.id)}
              className="text-red-500 text-sm"
            >
              {t('tools.goalBreakdown.delete')}
            </button>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{t('tools.goalBreakdown.progress')}</span>
              <span className="font-bold">{getProgress(selectedGoal)}%</span>
            </div>
            <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all"
                style={{ width: `${getProgress(selectedGoal)}%` }}
              />
            </div>
          </div>

          <h3 className="font-medium mb-2">{t('tools.goalBreakdown.actionSteps')}</h3>

          <div className="space-y-2 mb-3">
            {selectedGoal.steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 p-2 rounded ${
                  step.completed ? 'bg-green-50' : 'bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={step.completed}
                  onChange={() => toggleStep(step.id)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-400">#{index + 1}</span>
                <span className={`flex-1 text-sm ${step.completed ? 'line-through text-slate-400' : ''}`}>
                  {step.text}
                </span>
                {step.dueDate && (
                  <span className="text-xs text-slate-400">{step.dueDate}</span>
                )}
                <button
                  onClick={() => removeStep(step.id)}
                  className="text-red-500 text-xs"
                >
                  x
                </button>
              </div>
            ))}
            {selectedGoal.steps.length === 0 && (
              <div className="text-center text-slate-400 py-4 text-sm">
                {t('tools.goalBreakdown.noSteps')}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addStep()}
              placeholder={t('tools.goalBreakdown.addStep')}
              className="flex-1 px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="date"
              value={stepDueDate}
              onChange={(e) => setStepDueDate(e.target.value)}
              className="w-32 px-2 py-2 border border-slate-300 rounded text-sm"
            />
            <button
              onClick={addStep}
              disabled={!newStep.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.goalBreakdown.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>- {t('tools.goalBreakdown.tip1')}</li>
          <li>- {t('tools.goalBreakdown.tip2')}</li>
          <li>- {t('tools.goalBreakdown.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
