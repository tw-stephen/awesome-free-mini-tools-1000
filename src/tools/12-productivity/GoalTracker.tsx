import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type GoalCategory = 'personal' | 'career' | 'health' | 'finance' | 'learning' | 'other'
type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'abandoned'

interface Milestone {
  id: string
  title: string
  completed: boolean
}

interface Goal {
  id: string
  title: string
  description: string
  category: GoalCategory
  status: GoalStatus
  targetDate: string
  milestones: Milestone[]
  progress: number
  createdAt: string
}

export default function GoalTracker() {
  const { t } = useTranslation()
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState<GoalCategory | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<GoalStatus | 'all'>('all')
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'personal' as GoalCategory,
    targetDate: '',
    milestones: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const categories: GoalCategory[] = ['personal', 'career', 'health', 'finance', 'learning', 'other']

  const categoryEmoji: Record<GoalCategory, string> = {
    personal: '🎯',
    career: '💼',
    health: '💪',
    finance: '💰',
    learning: '📚',
    other: '⭐'
  }

  useEffect(() => {
    const saved = localStorage.getItem('goal-tracker')
    if (saved) setGoals(JSON.parse(saved))
  }, [])

  const saveGoals = (updated: Goal[]) => {
    setGoals(updated)
    localStorage.setItem('goal-tracker', JSON.stringify(updated))
  }

  const addGoal = () => {
    if (!form.title) return
    const milestones = form.milestones
      .split('\n')
      .filter(m => m.trim())
      .map(m => ({ id: Date.now().toString() + Math.random(), title: m.trim(), completed: false }))

    const goal: Goal = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      category: form.category,
      status: 'not_started',
      targetDate: form.targetDate,
      milestones,
      progress: 0,
      createdAt: new Date().toISOString()
    }
    saveGoals([...goals, goal])
    resetForm()
  }

  const resetForm = () => {
    setForm({ title: '', description: '', category: 'personal', targetDate: '', milestones: '' })
    setShowForm(false)
    setEditingId(null)
  }

  const updateGoalStatus = (id: string, status: GoalStatus) => {
    saveGoals(goals.map(g => g.id === id ? { ...g, status } : g))
  }

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    saveGoals(goals.map(g => {
      if (g.id !== goalId) return g
      const updatedMilestones = g.milestones.map(m =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      )
      const completedCount = updatedMilestones.filter(m => m.completed).length
      const progress = updatedMilestones.length > 0
        ? Math.round((completedCount / updatedMilestones.length) * 100)
        : 0
      const status = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : g.status
      return { ...g, milestones: updatedMilestones, progress, status }
    }))
  }

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter(g => g.id !== id))
  }

  const filteredGoals = useMemo(() => {
    return goals.filter(g => {
      const matchCategory = filterCategory === 'all' || g.category === filterCategory
      const matchStatus = filterStatus === 'all' || g.status === filterStatus
      return matchCategory && matchStatus
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [goals, filterCategory, filterStatus])

  const stats = useMemo(() => {
    return {
      total: goals.length,
      completed: goals.filter(g => g.status === 'completed').length,
      inProgress: goals.filter(g => g.status === 'in_progress').length,
      avgProgress: goals.length > 0
        ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
        : 0
    }
  }, [goals])

  const getDaysRemaining = (targetDate: string) => {
    if (!targetDate) return null
    const days = Math.ceil((new Date(targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  const statusColors: Record<GoalStatus, string> = {
    not_started: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    abandoned: 'bg-red-100 text-red-700'
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <div className="card p-3 text-center">
          <div className="text-xl font-bold">{stats.total}</div>
          <div className="text-xs text-slate-500">{t('tools.goalTracker.total')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-xs text-slate-500">{t('tools.goalTracker.inProgress')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-xs text-slate-500">{t('tools.goalTracker.completed')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold">{stats.avgProgress}%</div>
          <div className="text-xs text-slate-500">{t('tools.goalTracker.avgProgress')}</div>
        </div>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        + {t('tools.goalTracker.addGoal')}
      </button>

      {showForm && (
        <div className="card p-4 space-y-3">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={t('tools.goalTracker.goalTitle')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder={t('tools.goalTracker.description')}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as GoalCategory })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {categoryEmoji[cat]} {t(`tools.goalTracker.${cat}`)}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={form.targetDate}
              onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <textarea
            value={form.milestones}
            onChange={(e) => setForm({ ...form, milestones: e.target.value })}
            placeholder={t('tools.goalTracker.milestonesPlaceholder')}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <button onClick={resetForm} className="py-2 bg-slate-100 rounded">
              {t('tools.goalTracker.cancel')}
            </button>
            <button
              onClick={addGoal}
              disabled={!form.title}
              className="py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.goalTracker.save')}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as GoalCategory | 'all')}
          className="px-3 py-2 border border-slate-300 rounded text-sm"
        >
          <option value="all">{t('tools.goalTracker.allCategories')}</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{categoryEmoji[cat]} {t(`tools.goalTracker.${cat}`)}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as GoalStatus | 'all')}
          className="px-3 py-2 border border-slate-300 rounded text-sm"
        >
          <option value="all">{t('tools.goalTracker.allStatuses')}</option>
          <option value="not_started">{t('tools.goalTracker.notStarted')}</option>
          <option value="in_progress">{t('tools.goalTracker.inProgress')}</option>
          <option value="completed">{t('tools.goalTracker.completed')}</option>
          <option value="abandoned">{t('tools.goalTracker.abandoned')}</option>
        </select>
      </div>

      <div className="space-y-3">
        {filteredGoals.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">
            {t('tools.goalTracker.noGoals')}
          </div>
        ) : (
          filteredGoals.map(goal => {
            const daysRemaining = getDaysRemaining(goal.targetDate)
            return (
              <div key={goal.id} className="card p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="mr-2">{categoryEmoji[goal.category]}</span>
                    <span className="font-medium">{goal.title}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${statusColors[goal.status]}`}>
                    {t(`tools.goalTracker.${goal.status.replace('_', '')}`)}
                  </span>
                </div>
                {goal.description && (
                  <p className="text-sm text-slate-600 mb-2">{goal.description}</p>
                )}
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{t('tools.goalTracker.progress')}</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded overflow-hidden">
                    <div
                      className={`h-full ${goal.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
                {goal.milestones.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs text-slate-500 mb-1">{t('tools.goalTracker.milestones')}</div>
                    <div className="space-y-1">
                      {goal.milestones.map(m => (
                        <div
                          key={m.id}
                          onClick={() => toggleMilestone(goal.id, m.id)}
                          className={`flex items-center gap-2 text-sm cursor-pointer ${
                            m.completed ? 'text-slate-400 line-through' : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={m.completed}
                            onChange={() => {}}
                            className="shrink-0"
                          />
                          <span>{m.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div>
                    {daysRemaining !== null && (
                      <span className={daysRemaining < 0 ? 'text-red-500' : daysRemaining < 7 ? 'text-yellow-600' : ''}>
                        {daysRemaining < 0
                          ? t('tools.goalTracker.overdue', { days: Math.abs(daysRemaining) })
                          : t('tools.goalTracker.daysLeft', { days: daysRemaining })}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={goal.status}
                      onChange={(e) => updateGoalStatus(goal.id, e.target.value as GoalStatus)}
                      className="text-xs bg-transparent border-none"
                    >
                      <option value="not_started">{t('tools.goalTracker.notStarted')}</option>
                      <option value="in_progress">{t('tools.goalTracker.inProgress')}</option>
                      <option value="completed">{t('tools.goalTracker.completed')}</option>
                      <option value="abandoned">{t('tools.goalTracker.abandoned')}</option>
                    </select>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-500"
                    >
                      {t('tools.goalTracker.delete')}
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
