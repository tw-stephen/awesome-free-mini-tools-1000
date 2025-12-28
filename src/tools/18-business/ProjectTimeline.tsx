import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Task {
  id: number
  name: string
  startDate: string
  endDate: string
  progress: number
  assignee: string
  color: string
}

export default function ProjectTimeline() {
  const { t } = useTranslation()
  const [project, setProject] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
  })

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'Planning', startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], progress: 100, assignee: '', color: colors[0] },
  ])

  const addTask = () => {
    const lastTask = tasks[tasks.length - 1]
    const start = lastTask ? lastTask.endDate : new Date().toISOString().split('T')[0]
    const end = new Date(new Date(start).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    setTasks([...tasks, { id: Date.now(), name: '', startDate: start, endDate: end, progress: 0, assignee: '', color: colors[tasks.length % colors.length] }])
  }

  const updateTask = (id: number, field: keyof Task, value: string | number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, [field]: value } : task))
  }

  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const getDateRange = () => {
    if (tasks.length === 0) return { start: new Date(), end: new Date() }
    const dates = tasks.flatMap(t => [new Date(t.startDate), new Date(t.endDate)])
    return {
      start: new Date(Math.min(...dates.map(d => d.getTime()))),
      end: new Date(Math.max(...dates.map(d => d.getTime()))),
    }
  }

  const { start: rangeStart, end: rangeEnd } = getDateRange()
  const totalDays = Math.max(1, Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / (24 * 60 * 60 * 1000)) + 1)

  const getTaskPosition = (task: Task) => {
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.endDate)
    const startOffset = Math.ceil((taskStart.getTime() - rangeStart.getTime()) / (24 * 60 * 60 * 1000))
    const duration = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (24 * 60 * 60 * 1000)) + 1
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
    }
  }

  const overallProgress = tasks.length > 0
    ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length)
    : 0

  const generateTimeline = (): string => {
    let doc = `PROJECT TIMELINE\n${'═'.repeat(50)}\n\n`
    doc += `Project: ${project.name || '[Project Name]'}\n`
    doc += `Start Date: ${project.startDate}\n`
    doc += `Overall Progress: ${overallProgress}%\n\n`

    doc += `TASKS\n${'─'.repeat(40)}\n`
    tasks.forEach((task, index) => {
      doc += `${index + 1}. ${task.name || 'Task'}\n`
      doc += `   Duration: ${task.startDate} to ${task.endDate}\n`
      doc += `   Progress: ${task.progress}%\n`
      if (task.assignee) doc += `   Assignee: ${task.assignee}\n`
      doc += '\n'
    })

    return doc
  }

  const copyTimeline = () => {
    navigator.clipboard.writeText(generateTimeline())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.projectTimeline.details')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            placeholder="Project Name"
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="date"
            value={project.startDate}
            onChange={(e) => setProject({ ...project, startDate: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.projectTimeline.chart')}</h3>
          <span className="text-sm text-slate-500">Overall: {overallProgress}%</span>
        </div>

        {tasks.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{rangeStart.toLocaleDateString()}</span>
              <span>{rangeEnd.toLocaleDateString()}</span>
            </div>
            <div className="relative bg-slate-100 rounded h-2">
              <div className="h-full bg-slate-300 rounded" style={{ width: '100%' }} />
            </div>
          </div>
        )}

        <div className="space-y-2">
          {tasks.map((task, index) => {
            const pos = getTaskPosition(task)
            return (
              <div key={task.id} className="relative h-10">
                <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                  <div
                    className="h-8 rounded flex items-center px-2 text-white text-xs font-medium overflow-hidden"
                    style={{
                      ...pos,
                      position: 'absolute',
                      backgroundColor: task.color,
                    }}
                    title={`${task.name}: ${task.startDate} - ${task.endDate}`}
                  >
                    <span className="truncate">{task.name || `Task ${index + 1}`}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.projectTimeline.tasks')}</h3>
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div key={task.id} className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="color"
                  value={task.color}
                  onChange={(e) => updateTask(task.id, 'color', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={task.name}
                  onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                  placeholder={`Task ${index + 1}`}
                  className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                />
                <button
                  onClick={() => removeTask(task.id)}
                  className="px-2 py-1 text-red-500 hover:text-red-600"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="date"
                  value={task.startDate}
                  onChange={(e) => updateTask(task.id, 'startDate', e.target.value)}
                  className="px-2 py-1 border border-slate-300 rounded text-sm"
                />
                <input
                  type="date"
                  value={task.endDate}
                  onChange={(e) => updateTask(task.id, 'endDate', e.target.value)}
                  className="px-2 py-1 border border-slate-300 rounded text-sm"
                />
                <input
                  type="text"
                  value={task.assignee}
                  onChange={(e) => updateTask(task.id, 'assignee', e.target.value)}
                  placeholder="Assignee"
                  className="px-2 py-1 border border-slate-300 rounded text-sm"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="range"
                    value={task.progress}
                    onChange={(e) => updateTask(task.id, 'progress', Number(e.target.value))}
                    min="0"
                    max="100"
                    className="flex-1"
                  />
                  <span className="text-xs text-slate-500 w-10">{task.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addTask}
          className="mt-3 text-blue-500 hover:text-blue-600 text-sm"
        >
          + Add Task
        </button>
      </div>

      <button
        onClick={copyTimeline}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.projectTimeline.export')}
      </button>
    </div>
  )
}
