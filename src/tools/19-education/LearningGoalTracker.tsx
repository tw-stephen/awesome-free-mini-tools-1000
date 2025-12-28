import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Goal {
  id: number
  title: string
  description: string
  category: string
  deadline: string
  milestones: { id: number; text: string; completed: boolean }[]
  progress: number
}

export default function LearningGoalTracker() {
  const { t } = useTranslation()
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'Skill',
    deadline: '',
    milestones: [''],
  })

  const categories = ['Skill', 'Course', 'Certification', 'Language', 'Project', 'Reading', 'Other']

  const addGoal = () => {
    if (!newGoal.title.trim()) return
    const milestones = newGoal.milestones
      .filter(m => m.trim())
      .map((text, i) => ({ id: Date.now() + i, text, completed: false }))

    setGoals([...goals, {
      ...newGoal,
      id: Date.now(),
      milestones,
      progress: 0,
    }])
    setNewGoal({ title: '', description: '', category: 'Skill', deadline: '', milestones: [''] })
    setShowForm(false)
  }

  const removeGoal = (id: number) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  const toggleMilestone = (goalId: number, milestoneId: number) => {
    setGoals(goals.map(g => {
      if (g.id !== goalId) return g
      const updatedMilestones = g.milestones.map(m =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      )
      const completedCount = updatedMilestones.filter(m => m.completed).length
      const progress = Math.round((completedCount / updatedMilestones.length) * 100)
      return { ...g, milestones: updatedMilestones, progress }
    }))
  }

  const addMilestoneInput = () => {
    setNewGoal({ ...newGoal, milestones: [...newGoal.milestones, ''] })
  }

  const updateMilestoneInput = (index: number, value: string) => {
    const updated = [...newGoal.milestones]
    updated[index] = value
    setNewGoal({ ...newGoal, milestones: updated })
  }

  const removeMilestoneInput = (index: number) => {
    if (newGoal.milestones.length <= 1) return
    setNewGoal({ ...newGoal, milestones: newGoal.milestones.filter((_, i) => i !== index) })
  }

  const getStatusColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500'
    if (progress >= 75) return 'bg-blue-500'
    if (progress >= 50) return 'bg-yellow-500'
    if (progress >= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getDaysRemaining = (deadline: string): number | null => {
    if (!deadline) return null
    const today = new Date()
    const target = new Date(deadline)
    const diff = target.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const overallProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    : 0

  const completedGoals = goals.filter(g => g.progress === 100).length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold">{goals.length}</div>
          <div className="text-xs text-slate-500">Total Goals</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
          <div className="text-xs text-slate-500">Completed</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{overallProgress}%</div>
          <div className="text-xs text-slate-500">Overall</div>
        </div>
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          + {t('tools.learningGoalTracker.addGoal')}
        </button>
      )}

      {showForm && (
        <div className="card p-4 border-2 border-blue-300">
          <h3 className="font-medium mb-3">{t('tools.learningGoalTracker.addGoal')}</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder="Goal title"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <textarea
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              placeholder="Description (optional)"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-500">Milestones</label>
              {newGoal.milestones.map((m, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={m}
                    onChange={(e) => updateMilestoneInput(i, e.target.value)}
                    placeholder={`Milestone ${i + 1}`}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded"
                  />
                  <button
                    onClick={() => removeMilestoneInput(i)}
                    disabled={newGoal.milestones.length <= 1}
                    className="text-red-400 hover:text-red-600 disabled:opacity-30"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button onClick={addMilestoneInput} className="text-blue-500 text-sm">
                + Add Milestone
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={addGoal}
                disabled={!newGoal.title.trim()}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                Create Goal
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {goals.map(goal => {
          const daysLeft = getDaysRemaining(goal.deadline)
          return (
            <div key={goal.id} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium">{goal.title}</div>
                  <div className="text-xs text-slate-500">
                    {goal.category}
                    {daysLeft !== null && (
                      <span className={daysLeft < 0 ? 'text-red-500' : daysLeft < 7 ? 'text-orange-500' : ''}>
                        {' '}• {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => removeGoal(goal.id)} className="text-red-400 hover:text-red-600">
                  ×
                </button>
              </div>

              {goal.description && (
                <p className="text-sm text-slate-600 mb-3">{goal.description}</p>
              )}

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${getStatusColor(goal.progress)}`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                {goal.milestones.map(m => (
                  <label key={m.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={m.completed}
                      onChange={() => toggleMilestone(goal.id, m.id)}
                      className="rounded"
                    />
                    <span className={m.completed ? 'line-through text-slate-400' : ''}>{m.text}</span>
                  </label>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {goals.length === 0 && !showForm && (
        <div className="card p-8 text-center text-slate-500">
          Set learning goals to track your progress
        </div>
      )}
    </div>
  )
}
