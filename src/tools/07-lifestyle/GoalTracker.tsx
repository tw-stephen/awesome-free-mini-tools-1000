import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Goal {
  id: number
  title: string
  description?: string
  targetDate: string
  category: string
  milestones: Milestone[]
  createdAt: string
}

interface Milestone {
  id: number
  title: string
  completed: boolean
}

export default function GoalTracker() {
  const { t } = useTranslation()
  const [goals, setGoals] = useState<Goal[]>([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category: 'Personal',
  })
  const [newMilestone, setNewMilestone] = useState('')
  const [milestonesTemp, setMilestonesTemp] = useState<string[]>([])

  const categories = ['Personal', 'Career', 'Health', 'Financial', 'Education', 'Relationship', 'Creative']

  useEffect(() => {
    const saved = localStorage.getItem('goal-tracker')
    if (saved) {
      try {
        setGoals(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load goals')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('goal-tracker', JSON.stringify(goals))
  }, [goals])

  const addGoal = () => {
    if (!newGoal.title) return
    const goal: Goal = {
      id: Date.now(),
      title: newGoal.title,
      description: newGoal.description || undefined,
      targetDate: newGoal.targetDate,
      category: newGoal.category,
      milestones: milestonesTemp.map((m, i) => ({
        id: Date.now() + i,
        title: m,
        completed: false,
      })),
      createdAt: new Date().toISOString().split('T')[0],
    }
    setGoals([goal, ...goals])
    setNewGoal({
      title: '',
      description: '',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category: 'Personal',
    })
    setMilestonesTemp([])
    setShowAddGoal(false)
  }

  const deleteGoal = (id: number) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  const toggleMilestone = (goalId: number, milestoneId: number) => {
    setGoals(goals.map(goal => {
      if (goal.id !== goalId) return goal
      return {
        ...goal,
        milestones: goal.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        ),
      }
    }))
  }

  const addMilestoneToTemp = () => {
    if (!newMilestone.trim()) return
    setMilestonesTemp([...milestonesTemp, newMilestone])
    setNewMilestone('')
  }

  const removeMilestoneFromTemp = (index: number) => {
    setMilestonesTemp(milestonesTemp.filter((_, i) => i !== index))
  }

  const getProgress = (goal: Goal) => {
    if (goal.milestones.length === 0) return 0
    const completed = goal.milestones.filter(m => m.completed).length
    return Math.round((completed / goal.milestones.length) * 100)
  }

  const isCompleted = (goal: Goal) => {
    return goal.milestones.length > 0 && goal.milestones.every(m => m.completed)
  }

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate)
    const today = new Date()
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const filteredGoals = useMemo(() => {
    return goals.filter(goal => {
      if (filter === 'completed') return isCompleted(goal)
      if (filter === 'active') return !isCompleted(goal)
      return true
    })
  }, [goals, filter])

  const stats = useMemo(() => {
    const active = goals.filter(g => !isCompleted(g)).length
    const completed = goals.filter(g => isCompleted(g)).length
    const totalMilestones = goals.reduce((sum, g) => sum + g.milestones.length, 0)
    const completedMilestones = goals.reduce(
      (sum, g) => sum + g.milestones.filter(m => m.completed).length,
      0
    )
    return { active, completed, totalMilestones, completedMilestones }
  }, [goals])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
            <div className="text-xs text-slate-500">{t('tools.goalTracker.active')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-slate-500">{t('tools.goalTracker.completed')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{stats.completedMilestones}</div>
            <div className="text-xs text-slate-500">{t('tools.goalTracker.milestones')}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <div className="text-2xl font-bold text-orange-600">{goals.length}</div>
            <div className="text-xs text-slate-500">{t('tools.goalTracker.total')}</div>
          </div>
        </div>
      </div>

      {!showAddGoal ? (
        <button
          onClick={() => setShowAddGoal(true)}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          + {t('tools.goalTracker.addGoal')}
        </button>
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.goalTracker.newGoal')}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder={t('tools.goalTracker.goalTitle')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <textarea
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              placeholder={t('tools.goalTracker.description')}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.goalTracker.targetDate')}
                </label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.goalTracker.category')}
                </label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.goalTracker.milestones')}
              </label>
              {milestonesTemp.length > 0 && (
                <div className="space-y-1 mb-2">
                  {milestonesTemp.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm">{m}</span>
                      <button
                        onClick={() => removeMilestoneFromTemp(i)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addMilestoneToTemp()}
                  placeholder={t('tools.goalTracker.addMilestone')}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
                />
                <button
                  onClick={addMilestoneToTemp}
                  className="px-3 py-2 bg-slate-200 rounded hover:bg-slate-300"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={addGoal}
                className="flex-1 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
              >
                {t('tools.goalTracker.create')}
              </button>
              <button
                onClick={() => {
                  setShowAddGoal(false)
                  setMilestonesTemp([])
                }}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                {t('tools.goalTracker.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded text-sm ${
                filter === f ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.goalTracker.${f}`)}
            </button>
          ))}
        </div>

        {filteredGoals.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {t('tools.goalTracker.noGoals')}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGoals.map(goal => {
              const progress = getProgress(goal)
              const completed = isCompleted(goal)
              const daysRemaining = getDaysRemaining(goal.targetDate)

              return (
                <div key={goal.id} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {completed && <span className="text-green-500">✓</span>}
                        {goal.title}
                      </div>
                      <div className="text-sm text-slate-500">
                        {goal.category} • {goal.targetDate}
                        {!completed && (
                          <span className={daysRemaining < 0 ? 'text-red-500' : daysRemaining <= 7 ? 'text-yellow-500' : ''}>
                            {' '}({daysRemaining < 0 ? 'Overdue' : `${daysRemaining} days left`})
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>

                  {goal.description && (
                    <p className="text-sm text-slate-600 mb-2">{goal.description}</p>
                  )}

                  {goal.milestones.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-2 bg-slate-200 rounded overflow-hidden">
                          <div
                            className={`h-full ${completed ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-500">{progress}%</span>
                      </div>

                      <div className="space-y-1">
                        {goal.milestones.map(milestone => (
                          <button
                            key={milestone.id}
                            onClick={() => toggleMilestone(goal.id, milestone.id)}
                            className="w-full flex items-center gap-2 p-2 bg-white rounded text-left hover:bg-slate-100"
                          >
                            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              milestone.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'
                            }`}>
                              {milestone.completed && '✓'}
                            </span>
                            <span className={milestone.completed ? 'line-through text-slate-400' : ''}>
                              {milestone.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.goalTracker.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.goalTracker.tip1')}</li>
          <li>{t('tools.goalTracker.tip2')}</li>
          <li>{t('tools.goalTracker.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
