import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Assignment {
  id: number
  subject: string
  title: string
  description: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  estimatedTime: number
}

export default function HomeworkPlanner() {
  const { t } = useTranslation()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    subject: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimatedTime: 30,
  })
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending')
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'subject'>('dueDate')

  const subjects = ['Math', 'Science', 'English', 'History', 'Art', 'Music', 'PE', 'Other']

  const addAssignment = () => {
    if (!newAssignment.subject || !newAssignment.title || !newAssignment.dueDate) return
    setAssignments([...assignments, {
      ...newAssignment,
      id: Date.now(),
      completed: false,
    }])
    setNewAssignment({
      subject: '',
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      estimatedTime: 30,
    })
    setShowForm(false)
  }

  const toggleComplete = (id: number) => {
    setAssignments(assignments.map(a =>
      a.id === id ? { ...a, completed: !a.completed } : a
    ))
  }

  const removeAssignment = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id))
  }

  const filteredAssignments = assignments
    .filter(a => {
      if (filter === 'pending') return !a.completed
      if (filter === 'completed') return a.completed
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        case 'subject':
          return a.subject.localeCompare(b.subject)
        default:
          return 0
      }
    })

  const getDaysUntilDue = (dueDate: string): number => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getDueDateColor = (dueDate: string): string => {
    const days = getDaysUntilDue(dueDate)
    if (days < 0) return 'text-red-600 bg-red-50'
    if (days === 0) return 'text-orange-600 bg-orange-50'
    if (days <= 2) return 'text-yellow-600 bg-yellow-50'
    return 'text-slate-600 bg-slate-50'
  }

  const priorityColors = {
    high: 'border-red-500',
    medium: 'border-yellow-500',
    low: 'border-green-500',
  }

  const pendingCount = assignments.filter(a => !a.completed).length
  const completedCount = assignments.filter(a => a.completed).length
  const totalTime = assignments.filter(a => !a.completed).reduce((sum, a) => sum + a.estimatedTime, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
          <div className="text-xs text-slate-500">Pending</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          <div className="text-xs text-slate-500">Completed</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{Math.round(totalTime / 60)}h</div>
          <div className="text-xs text-slate-500">Est. Time</div>
        </div>
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          + {t('tools.homeworkPlanner.add')}
        </button>
      )}

      {showForm && (
        <div className="card p-4 border-2 border-blue-300">
          <h3 className="font-medium mb-3">{t('tools.homeworkPlanner.add')}</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newAssignment.subject}
                onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                <option value="">Select Subject</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <input
              type="text"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              placeholder="Assignment title"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <textarea
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              placeholder="Description (optional)"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-500">Priority</label>
                <select
                  value={newAssignment.priority}
                  onChange={(e) => setNewAssignment({ ...newAssignment, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500">Est. Time (min)</label>
                <input
                  type="number"
                  value={newAssignment.estimatedTime}
                  onChange={(e) => setNewAssignment({ ...newAssignment, estimatedTime: parseInt(e.target.value) || 30 })}
                  min={5}
                  step={5}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addAssignment}
                disabled={!newAssignment.subject || !newAssignment.title || !newAssignment.dueDate}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                Add Assignment
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

      <div className="card p-3 flex items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'pending', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm capitalize ${
                filter === f ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-2 py-1 border border-slate-300 rounded text-sm"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="subject">Sort by Subject</option>
        </select>
      </div>

      <div className="space-y-2">
        {filteredAssignments.map(a => {
          const daysUntil = getDaysUntilDue(a.dueDate)
          return (
            <div
              key={a.id}
              className={`card p-4 border-l-4 ${priorityColors[a.priority]} ${a.completed ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={a.completed}
                    onChange={() => toggleComplete(a.id)}
                    className="mt-1 rounded"
                  />
                  <div>
                    <div className={`font-medium ${a.completed ? 'line-through' : ''}`}>{a.title}</div>
                    <div className="text-sm text-slate-500">{a.subject}</div>
                    {a.description && (
                      <div className="text-sm text-slate-400 mt-1">{a.description}</div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs ${getDueDateColor(a.dueDate)}`}>
                        {daysUntil < 0
                          ? `${Math.abs(daysUntil)} days overdue`
                          : daysUntil === 0
                          ? 'Due today'
                          : `${daysUntil} days left`}
                      </span>
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs">
                        {a.estimatedTime} min
                      </span>
                    </div>
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

      {filteredAssignments.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          {filter === 'completed' ? 'No completed assignments' : 'No pending assignments'}
        </div>
      )}
    </div>
  )
}
