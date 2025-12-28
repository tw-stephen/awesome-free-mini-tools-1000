import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Assignment {
  id: number
  subject: string
  title: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  notes: string
}

export default function HomeworkTracker() {
  const { t } = useTranslation()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [mode, setMode] = useState<'list' | 'add'>('list')
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    subject: '',
    title: '',
    dueDate: '',
    priority: 'medium',
    notes: '',
  })
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  useEffect(() => {
    const saved = localStorage.getItem('homework-tracker')
    if (saved) {
      try {
        setAssignments(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load assignments')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('homework-tracker', JSON.stringify(assignments))
  }, [assignments])

  const addAssignment = () => {
    if (!newAssignment.title?.trim() || !newAssignment.dueDate) return

    const assignment: Assignment = {
      id: Date.now(),
      subject: newAssignment.subject || '',
      title: newAssignment.title,
      dueDate: newAssignment.dueDate,
      priority: newAssignment.priority || 'medium',
      completed: false,
      notes: newAssignment.notes || '',
    }
    setAssignments([...assignments, assignment])
    setNewAssignment({ subject: '', title: '', dueDate: '', priority: 'medium', notes: '' })
    setMode('list')
  }

  const toggleComplete = (id: number) => {
    setAssignments(assignments.map(a =>
      a.id === id ? { ...a, completed: !a.completed } : a
    ))
  }

  const deleteAssignment = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id))
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    due.setHours(0, 0, 0, 0)
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const filteredAssignments = assignments
    .filter(a => {
      if (filter === 'pending') return !a.completed
      if (filter === 'completed') return a.completed
      return true
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

  const subjects = ['Math', 'English', 'Science', 'History', 'Art', 'Music', 'PE', 'Other']

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={() => setMode('add')}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.homeworkTracker.addAssignment')}
          </button>

          <div className="flex gap-2">
            {(['all', 'pending', 'completed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 rounded text-sm ${filter === f ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
              >
                {t(`tools.homeworkTracker.${f}`)}
              </button>
            ))}
          </div>

          {filteredAssignments.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.homeworkTracker.noAssignments')}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAssignments.map(assignment => {
                const daysUntil = getDaysUntilDue(assignment.dueDate)
                const isOverdue = daysUntil < 0 && !assignment.completed
                const isDueSoon = daysUntil >= 0 && daysUntil <= 2 && !assignment.completed

                return (
                  <div
                    key={assignment.id}
                    className={`card p-4 ${assignment.completed ? 'opacity-60' : ''} ${isOverdue ? 'border-l-4 border-red-500' : isDueSoon ? 'border-l-4 border-yellow-500' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={assignment.completed}
                        onChange={() => toggleComplete(assignment.id)}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className={`font-medium ${assignment.completed ? 'line-through' : ''}`}>
                          {assignment.title}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {assignment.subject && (
                            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                              {assignment.subject}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            assignment.priority === 'high' ? 'bg-red-100 text-red-700' :
                            assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {t(`tools.homeworkTracker.${assignment.priority}`)}
                          </span>
                          <span className={`text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                            {isOverdue
                              ? t('tools.homeworkTracker.overdue')
                              : daysUntil === 0
                              ? t('tools.homeworkTracker.dueToday')
                              : daysUntil === 1
                              ? t('tools.homeworkTracker.dueTomorrow')
                              : `${t('tools.homeworkTracker.dueIn')} ${daysUntil} ${t('tools.homeworkTracker.days')}`}
                          </span>
                        </div>
                        {assignment.notes && (
                          <div className="text-xs text-slate-500 mt-1">{assignment.notes}</div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteAssignment(assignment.id)}
                        className="text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {mode === 'add' && (
        <>
          <div className="card p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.homeworkTracker.title')} *
              </label>
              <input
                type="text"
                value={newAssignment.title || ''}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder={t('tools.homeworkTracker.titlePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.homeworkTracker.subject')}
              </label>
              <select
                value={newAssignment.subject || ''}
                onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                <option value="">{t('tools.homeworkTracker.selectSubject')}</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.homeworkTracker.dueDate')} *
              </label>
              <input
                type="date"
                value={newAssignment.dueDate || ''}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.homeworkTracker.priority')}
              </label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setNewAssignment({ ...newAssignment, priority: p })}
                    className={`flex-1 py-2 rounded ${
                      newAssignment.priority === p
                        ? p === 'high' ? 'bg-red-500 text-white' :
                          p === 'medium' ? 'bg-yellow-500 text-white' :
                          'bg-green-500 text-white'
                        : 'bg-slate-100'
                    }`}
                  >
                    {t(`tools.homeworkTracker.${p}`)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.homeworkTracker.notes')}
              </label>
              <textarea
                value={newAssignment.notes || ''}
                onChange={(e) => setNewAssignment({ ...newAssignment, notes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
                rows={2}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMode('list')}
              className="flex-1 py-2 bg-slate-100 rounded"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={addAssignment}
              disabled={!newAssignment.title?.trim() || !newAssignment.dueDate}
              className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.homeworkTracker.add')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
