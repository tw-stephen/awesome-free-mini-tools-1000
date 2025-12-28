import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Milestone {
  id: number
  title: string
  dueDate: string
  completed: boolean
  completedDate: string
  notes: string
}

export default function MilestoneTracker() {
  const { t } = useTranslation()
  const [projectName, setProjectName] = useState('')
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newDueDate, setNewDueDate] = useState('')

  const addMilestone = () => {
    if (!newTitle.trim()) return
    setMilestones([...milestones, {
      id: Date.now(),
      title: newTitle.trim(),
      dueDate: newDueDate,
      completed: false,
      completedDate: '',
      notes: ''
    }])
    setNewTitle('')
    setNewDueDate('')
  }

  const toggleComplete = (id: number) => {
    setMilestones(milestones.map(m => {
      if (m.id === id) {
        return {
          ...m,
          completed: !m.completed,
          completedDate: !m.completed ? new Date().toISOString().split('T')[0] : ''
        }
      }
      return m
    }))
  }

  const updateNotes = (id: number, notes: string) => {
    setMilestones(milestones.map(m =>
      m.id === id ? { ...m, notes } : m
    ))
  }

  const removeMilestone = (id: number) => {
    setMilestones(milestones.filter(m => m.id !== id))
  }

  const getStatus = (m: Milestone): { label: string; color: string } => {
    if (m.completed) return { label: 'Completed', color: 'bg-green-100 text-green-700' }
    if (!m.dueDate) return { label: 'No Due Date', color: 'bg-slate-100 text-slate-700' }
    const today = new Date()
    const due = new Date(m.dueDate)
    const daysUntil = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntil < 0) return { label: 'Overdue', color: 'bg-red-100 text-red-700' }
    if (daysUntil <= 3) return { label: 'Due Soon', color: 'bg-yellow-100 text-yellow-700' }
    return { label: 'On Track', color: 'bg-blue-100 text-blue-700' }
  }

  const completedCount = milestones.filter(m => m.completed).length
  const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0

  const generateReport = (): string => {
    let text = `MILESTONE TRACKER\\n${'='.repeat(50)}\\n`
    text += `Project: ${projectName || '[Project Name]'}\\n`
    text += `Progress: ${completedCount}/${milestones.length} (${progress}%)\\n\\n`

    const pending = milestones.filter(m => !m.completed)
    const completed = milestones.filter(m => m.completed)

    if (pending.length > 0) {
      text += `PENDING\\n${'─'.repeat(30)}\\n`
      pending.forEach(m => {
        const status = getStatus(m)
        text += `[ ] ${m.title}`
        if (m.dueDate) text += ` (Due: ${m.dueDate})`
        text += ` - ${status.label}\\n`
      })
      text += '\\n'
    }

    if (completed.length > 0) {
      text += `COMPLETED\\n${'─'.repeat(30)}\\n`
      completed.forEach(m => {
        text += `[✓] ${m.title}`
        if (m.completedDate) text += ` (Completed: ${m.completedDate})`
        text += '\\n'
      })
    }

    return text
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.milestoneTracker.project')}</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project name"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{t('tools.milestoneTracker.progress')}</h3>
          <span className="text-sm text-slate-500">{completedCount}/{milestones.length} ({progress}%)</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.milestoneTracker.addMilestone')}</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addMilestone()}
            placeholder="Milestone title"
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={addMilestone}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.milestoneTracker.milestones')}</h3>
        {milestones.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No milestones yet. Add one above!</p>
        ) : (
          <div className="space-y-3">
            {milestones.map((milestone) => {
              const status = getStatus(milestone)
              return (
                <div
                  key={milestone.id}
                  className={`p-4 rounded border-l-4 ${
                    milestone.completed ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleComplete(milestone.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        milestone.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-slate-400 hover:border-green-500'
                      }`}
                    >
                      {milestone.completed && '✓'}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={milestone.completed ? 'line-through text-slate-500' : 'font-medium'}>
                          {milestone.title}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      {milestone.dueDate && (
                        <p className="text-sm text-slate-500 mt-1">
                          Due: {milestone.dueDate}
                          {milestone.completedDate && ` • Completed: ${milestone.completedDate}`}
                        </p>
                      )}
                      <input
                        type="text"
                        value={milestone.notes}
                        onChange={(e) => updateNotes(milestone.id, e.target.value)}
                        placeholder="Add notes..."
                        className="w-full mt-2 px-2 py-1 text-sm border border-slate-200 rounded"
                      />
                    </div>
                    <button
                      onClick={() => removeMilestone(milestone.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.milestoneTracker.report')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
          {generateReport()}
        </pre>
        <button
          onClick={copyReport}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.milestoneTracker.copy')}
        </button>
      </div>
    </div>
  )
}
